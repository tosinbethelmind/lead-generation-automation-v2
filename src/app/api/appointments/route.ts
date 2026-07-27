import { NextRequest, NextResponse } from 'next/server';
import { createAppointment, getAppointments, updateAppointment, SECTOR_SERVICES } from '@/lib/appointmentManager';

export const dynamic = 'force-dynamic';

/** GET /api/appointments — Fetch appointments or sector services */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const sector = url.searchParams.get('sector') || undefined;
    const date = url.searchParams.get('date') || undefined;
    const status = (url.searchParams.get('status') as any) || undefined;

    if (action === 'services') {
      const services = sector ? SECTOR_SERVICES[sector] || SECTOR_SERVICES['general'] : SECTOR_SERVICES;
      return NextResponse.json({ success: true, services });
    }

    const appointments = await getAppointments({ date, sector, status });
    return NextResponse.json({ success: true, appointments });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** POST /api/appointments — Book appointment */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.service_name || !body.customer_name || !body.customer_phone || !body.date || !body.time_slot) {
      return NextResponse.json({
        success: false,
        error: 'service_name, customer_name, customer_phone, date, and time_slot are required'
      }, { status: 400 });
    }

    const appointment = await createAppointment({
      lead_id: body.lead_id,
      deal_id: body.deal_id,
      service_name: body.service_name,
      service_category: body.service_category,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      date: body.date,
      time_slot: body.time_slot,
      duration_minutes: body.duration_minutes,
      deposit_amount: body.deposit_amount,
      notes: body.notes,
      sector: body.sector,
      assigned_to: body.assigned_to,
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/** PATCH /api/appointments — Update appointment status */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const appointment = await updateAppointment(body.id, body);
    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
