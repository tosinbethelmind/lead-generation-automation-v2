/**
 * @file appointmentManager.ts
 * Appointment Booking & Scheduling Engine
 * 
 * Supports sector-specific booking types:
 * - Solar: Site Survey & Technical Audit
 * - Real Estate: Property Inspection Tour
 * - Education: Campus Tour & Entrance Exam Slot
 * - Healthcare: Doctor/Telehealth Consultation
 * - Automotive: Showroom Test Drive & Service Slot
 * - Restaurant: Table Reservation & Private Event
 * - Legal: Confidential Legal Intake Consultation
 * 
 * Features:
 * - Paystack deposit payment support
 * - Automated WhatsApp appointment confirmation
 * - Lead/Deal auto-link & Activity logging
 */

import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import { getRuntimeConfig } from './localConfig';
import { readJsonFileSyncWithRetry, writeJsonFileSyncAtomic } from './atomicIo';
import { logActivity } from './activityLogger';
import { convertLeadToDeal } from './pipelineManager';
import { sendWhatsAppMessage } from './whatsapp';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: string;
  lead_id: string;
  deal_id: string;
  service_name: string;
  service_category: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  date: string; // YYYY-MM-DD
  time_slot: string; // e.g. "10:00 AM"
  duration_minutes: number;
  status: AppointmentStatus;
  deposit_amount: number;
  deposit_paid: boolean;
  payment_reference: string;
  notes: string;
  reminder_sent: boolean;
  sector: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreateInput {
  lead_id?: string;
  deal_id?: string;
  service_name: string;
  service_category?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  date: string;
  time_slot: string;
  duration_minutes?: number;
  deposit_amount?: number;
  notes?: string;
  sector?: string;
  assigned_to?: string;
}

// Local Fallback Storage
const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);

function getAppointmentsFilePath(): string {
  return isServerless
    ? path.join('/tmp', 'appointments.json')
    : path.join(process.cwd(), 'local_db', 'appointments.json');
}

function readLocalAppointments(): Record<string, Appointment> {
  try {
    return readJsonFileSyncWithRetry<Record<string, Appointment>>(getAppointmentsFilePath(), {});
  } catch {
    return {};
  }
}

function writeLocalAppointments(appointments: Record<string, Appointment>): void {
  try {
    const filePath = getAppointmentsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    writeJsonFileSyncAtomic(filePath, appointments);
  } catch (e) {
    console.error('[AppointmentManager] Error writing local appointments:', e);
  }
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = String(error.message || '').toLowerCase();
  const code = String(error.code || '');
  return code === '42P01' || msg.includes('does not exist') || msg.includes('schema cache') ||
    msg.includes('api key') || msg.includes('unauthorized') || msg.includes('apikey');
}

/** Pre-configured appointment services per sector */
export const SECTOR_SERVICES: Record<string, { name: string; deposit: number; duration: number }[]> = {
  solar: [
    { name: 'On-Site Technical Survey', deposit: 10000, duration: 90 },
    { name: 'Virtual Solar Capacity Consultation', deposit: 0, duration: 45 },
    { name: 'System Maintenance & Battery Checkup', deposit: 15000, duration: 60 },
  ],
  real_estate: [
    { name: 'Physical Property Inspection Tour', deposit: 5000, duration: 60 },
    { name: 'Virtual 360° Video Walkthrough', deposit: 0, duration: 30 },
    { name: 'Investment Advisory Call', deposit: 0, duration: 45 },
  ],
  school: [
    { name: 'Campus Tour & Facility Inspection', deposit: 0, duration: 60 },
    { name: 'Entrance Examination Slot', deposit: 5000, duration: 120 },
    { name: 'Principal/Counselor Interview', deposit: 0, duration: 30 },
  ],
  medical: [
    { name: 'Doctor Consultation (General)', deposit: 15000, duration: 30 },
    { name: 'Specialist Medical Consultation', deposit: 30000, duration: 45 },
    { name: 'Telehealth Video Call Session', deposit: 10000, duration: 30 },
  ],
  auto: [
    { name: 'Showroom Vehicle Test Drive', deposit: 0, duration: 45 },
    { name: 'Used Car Inspection & Trade-In Appraisal', deposit: 10000, duration: 60 },
    { name: 'Workshop Repair & Diagnostic Slot', deposit: 5000, duration: 60 },
  ],
  restaurant: [
    { name: 'VIP Table Reservation', deposit: 10000, duration: 120 },
    { name: 'Catering & Event Planning Session', deposit: 25000, duration: 60 },
  ],
  legal: [
    { name: 'Confidential Legal Intake Consultation', deposit: 25000, duration: 60 },
    { name: 'CAC Filing & Corporate Advisory Call', deposit: 15000, duration: 45 },
  ],
  general: [
    { name: 'Discovery & Consultation Call', deposit: 0, duration: 30 },
    { name: 'Strategy Session', deposit: 10000, duration: 60 },
  ],
};

/** Create a new appointment */
export async function createAppointment(input: AppointmentCreateInput): Promise<Appointment> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const sector = input.sector || 'general';

  let leadId = input.lead_id || '';
  let dealId = input.deal_id || '';

  // Auto-create lead/deal if not provided
  if (!leadId) {
    try {
      const deal = await convertLeadToDeal({
        lead_id: `appt_${id.substring(0, 8)}`,
        name: input.customer_name,
        category: sector,
        phone_e164: input.customer_phone,
        email: input.customer_email,
      }, input.deposit_amount || 0);

      leadId = deal.lead_id;
      dealId = deal.id;
    } catch (e) {
      console.error('[AppointmentManager] Lead conversion error:', e);
    }
  }

  const appt: Appointment = {
    id,
    lead_id: leadId,
    deal_id: dealId,
    service_name: input.service_name,
    service_category: input.service_category || sector,
    customer_name: input.customer_name,
    customer_phone: input.customer_phone,
    customer_email: input.customer_email || '',
    date: input.date,
    time_slot: input.time_slot,
    duration_minutes: input.duration_minutes || 60,
    status: 'pending',
    deposit_amount: input.deposit_amount || 0,
    deposit_paid: false,
    payment_reference: '',
    notes: input.notes || '',
    reminder_sent: false,
    sector,
    assigned_to: input.assigned_to || '',
    created_at: now,
    updated_at: now,
  };

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const appts = readLocalAppointments();
    appts[id] = appt;
    writeLocalAppointments(appts);
  } else {
    try {
      const supabase = getSupabaseClient();
      const { error } = await (supabase as any).from('appointments').insert([appt]);
      if (error) {
        if (isTableMissingError(error)) {
          const appts = readLocalAppointments();
          appts[id] = appt;
          writeLocalAppointments(appts);
        } else {
          throw error;
        }
      }
    } catch (err: any) {
      if (isTableMissingError(err)) {
        const appts = readLocalAppointments();
        appts[id] = appt;
        writeLocalAppointments(appts);
      } else {
        throw err;
      }
    }
  }

  // Log Activity
  await logActivity({
    type: 'appointment_booked',
    lead_id: appt.lead_id,
    deal_id: appt.deal_id,
    description: `Appointment booked: ${appt.service_name} on ${appt.date} at ${appt.time_slot} for ${appt.customer_name}`,
    metadata: { service: appt.service_name, date: appt.date, time: appt.time_slot },
  });

  // Attempt to send WhatsApp Confirmation
  if (appt.customer_phone) {
    try {
      const message = `Hello ${appt.customer_name}! Your appointment for *${appt.service_name}* is booked for *${appt.date} at ${appt.time_slot}*. We look forward to seeing you!`;
      await sendWhatsAppMessage({
        lead_id: appt.lead_id,
        name: appt.customer_name,
        phone_e164: appt.customer_phone,
        phone_raw: appt.customer_phone,
        category: sector,
        source: 'GOOGLE',
        address: '', area: '', city: '', email: '', website: '', rating: 5, reviews_count: 1, verified: true, listings_count: 1, profile_url: '', source_query_or_seed: '', collected_at: '', status: 'NEW', last_contacted_at: '', duplicate_of_lead_id: '', business_summary: '', notes: ''
      } as any, '', '', message);
    } catch (e) {
      console.warn('[AppointmentManager] Could not send instant WhatsApp confirmation:', e);
    }
  }

  return appt;
}

/** Get appointments with filters */
export async function getAppointments(filters?: { date?: string; sector?: string; status?: AppointmentStatus }): Promise<Appointment[]> {
  const config = getRuntimeConfig();
  let appts: Appointment[] = [];

  if (config.storageMode === 'local') {
    appts = Object.values(readLocalAppointments());
  } else {
    try {
      const supabase = getSupabaseClient();
      let query = (supabase as any).from('appointments').select('*').order('date', { ascending: true });
      if (filters?.date) query = query.eq('date', filters.date);
      if (filters?.sector) query = query.eq('sector', filters.sector);
      if (filters?.status) query = query.eq('status', filters.status);

      const { data, error } = await query;
      if (error) {
        if (isTableMissingError(error)) appts = Object.values(readLocalAppointments());
        else throw error;
      } else {
        appts = (data || []) as Appointment[];
      }
    } catch (err: any) {
      if (isTableMissingError(err)) appts = Object.values(readLocalAppointments());
      else throw err;
    }
  }

  if (filters?.date) appts = appts.filter(a => a.date === filters.date);
  if (filters?.sector) appts = appts.filter(a => a.sector === filters.sector);
  if (filters?.status) appts = appts.filter(a => a.status === filters.status);

  return appts;
}

/** Update appointment status */
export async function updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
  const now = new Date().toISOString();
  const updatePayload = { ...updates, updated_at: now };
  delete (updatePayload as any).id;

  const config = getRuntimeConfig();
  if (config.storageMode === 'local') {
    const appts = readLocalAppointments();
    if (!appts[id]) throw new Error(`Appointment not found: ${id}`);
    appts[id] = { ...appts[id], ...updatePayload };
    writeLocalAppointments(appts);
    return appts[id];
  }

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await (supabase as any).from('appointments').update(updatePayload).eq('id', id).select().single();
    if (error) {
      if (isTableMissingError(error)) {
        const appts = readLocalAppointments();
        if (!appts[id]) throw new Error(`Appointment not found: ${id}`);
        appts[id] = { ...appts[id], ...updatePayload };
        writeLocalAppointments(appts);
        return appts[id];
      }
      throw error;
    }
    return data as Appointment;
  } catch (err: any) {
    if (isTableMissingError(err)) {
      const appts = readLocalAppointments();
      if (!appts[id]) throw new Error(`Appointment not found: ${id}`);
      appts[id] = { ...appts[id], ...updatePayload };
      writeLocalAppointments(appts);
      return appts[id];
    }
    throw err;
  }
}
