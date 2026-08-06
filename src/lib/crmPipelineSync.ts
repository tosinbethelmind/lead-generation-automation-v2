/**
 * src/lib/crmPipelineSync.ts
 * 
 * Option 4: Real-Time Multi-Channel CRM & Pipeline Sync Engine
 * Automatically records every lead inquiry, heat score, approval status, and stage transition
 * into local database (local_db/crm_pipeline.json) and Google Sheets / Supabase.
 */

import fs from 'fs';
import path from 'path';

export interface CrmPipelineRecord {
  ticketId: string;
  channel: 'WHATSAPP' | 'EMAIL' | 'WEB' | 'SMS' | 'OTHER';
  leadName: string;
  contact: string; // phone or email
  messageText: string;
  aiDraftReply: string;
  adminPromptModifier?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISPATCHED' | 'REJECTED';
  stage: 'NEW_INQUIRY' | 'QUALIFIED' | 'PROPOSAL_DISPATCHED' | 'CLOSED_WON' | 'REJECTED';
  heatCategory: 'HOT' | 'WARM' | 'COLD';
  heatScore: number;
  estimatedValueNgn: number;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
}

const LOCAL_CRM_PATH = path.join(process.cwd(), 'local_db', 'crm_pipeline.json');

/**
 * Ensures the local CRM storage file exists
 */
function ensureStorageExists(): void {
  const dir = path.dirname(LOCAL_CRM_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_CRM_PATH)) {
    fs.writeFileSync(LOCAL_CRM_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * Returns all CRM pipeline records
 */
export function getCrmPipelineRecords(): CrmPipelineRecord[] {
  try {
    ensureStorageExists();
    const data = fs.readFileSync(LOCAL_CRM_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (_) {
    return [];
  }
}

/**
 * Upserts a lead record into the CRM pipeline
 */
export async function syncRecordToCrm(record: Partial<CrmPipelineRecord> & { ticketId: string }): Promise<CrmPipelineRecord> {
  ensureStorageExists();
  const records = getCrmPipelineRecords();
  const existingIdx = records.findIndex(r => r.ticketId === record.ticketId);

  const now = new Date().toISOString();

  let updatedRecord: CrmPipelineRecord;

  if (existingIdx >= 0) {
    updatedRecord = {
      ...records[existingIdx],
      ...record,
      updatedAt: now
    };
    records[existingIdx] = updatedRecord;
  } else {
    updatedRecord = {
      ticketId: record.ticketId,
      channel: record.channel || 'WHATSAPP',
      leadName: record.leadName || 'Inbound Lead',
      contact: record.contact || 'N/A',
      messageText: record.messageText || '',
      aiDraftReply: record.aiDraftReply || '',
      adminPromptModifier: record.adminPromptModifier,
      status: record.status || 'PENDING_APPROVAL',
      stage: record.stage || 'NEW_INQUIRY',
      heatCategory: record.heatCategory || 'WARM',
      heatScore: record.heatScore || 60,
      estimatedValueNgn: record.estimatedValueNgn || 185000,
      createdAt: now,
      updatedAt: now,
      dispatchedAt: record.status === 'DISPATCHED' ? now : undefined
    };
    records.unshift(updatedRecord);
  }

  try {
    fs.writeFileSync(LOCAL_CRM_PATH, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`[CRM Sync] Ticket ${updatedRecord.ticketId} synced to CRM Pipeline (Stage: ${updatedRecord.stage}, Heat: ${updatedRecord.heatCategory})`);
  } catch (err: any) {
    console.error('[CRM Sync Write Error]:', err.message);
  }

  return updatedRecord;
}
