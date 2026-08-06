/**
 * src/lib/approvalQueueManager.ts
 * 
 * Human-in-the-Loop Decision & Approval Queue Manager:
 * Intercepts high-stakes AI actions (e.g. launching campaigns, executing redesigns,
 * deleting leads, granting handover) and suspends execution until an Admin approves
 * or modifies the prompt via Telegram or Web Dashboard.
 */

export interface ApprovalTicket {
  id: string;
  actionType: 'LAUNCH_CAMPAIGN' | 'EXECUTE_REDESIGN' | 'CLIENT_HANDOVER' | 'DELETE_DATA' | 'OTHER';
  title: string;
  summary: string;
  proposedData: any;
  status: 'PENDING_HUMAN_APPROVAL' | 'APPROVED' | 'REJECTED';
  adminPromptModifier?: string;
  adminDecisionNotes?: string;
  telegramMessageId?: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback queue store with persistence interface
let inMemoryQueue: ApprovalTicket[] = [];

/**
 * Creates a new pending approval ticket for human review
 */
export async function createApprovalTicket(params: {
  actionType: ApprovalTicket['actionType'];
  title: string;
  summary: string;
  proposedData: any;
}): Promise<ApprovalTicket> {
  const ticket: ApprovalTicket = {
    id: `APPR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actionType: params.actionType,
    title: params.title,
    summary: params.summary,
    proposedData: params.proposedData,
    status: 'PENDING_HUMAN_APPROVAL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryQueue.unshift(ticket);
  console.log(`[Approval Gate] Created ticket ${ticket.id}: "${ticket.title}" (Status: PENDING_HUMAN_APPROVAL)`);
  return ticket;
}

/**
 * Returns all tickets filtered by status
 */
export async function getApprovalTickets(statusFilter?: ApprovalTicket['status']): Promise<ApprovalTicket[]> {
  if (!statusFilter) return inMemoryQueue;
  return inMemoryQueue.filter(t => t.status === statusFilter);
}

/**
 * Retrieves a single ticket by ID
 */
export async function getApprovalTicketById(id: string): Promise<ApprovalTicket | null> {
  return inMemoryQueue.find(t => t.id === id) || null;
}

/**
 * Approves a decision ticket, optionally attaching a custom prompt modifier,
 * and dispatches the execution action to downstream service endpoints (Baileys :3007 or Command Center :3008).
 */
export async function approveTicket(id: string, adminPromptModifier?: string): Promise<ApprovalTicket> {
  const ticket = inMemoryQueue.find(t => t.id === id);
  if (!ticket) throw new Error(`Approval ticket ${id} not found.`);

  ticket.status = 'APPROVED';
  ticket.updatedAt = new Date().toISOString();
  if (adminPromptModifier) {
    ticket.adminPromptModifier = adminPromptModifier;
  }

  console.log(`[Approval Gate] Ticket ${id} APPROVED by Admin.${adminPromptModifier ? ` Prompt Modifier: "${adminPromptModifier}"` : ''}`);

  // ── Dispatch Execution to External Services ─────────────────────────────────
  const targetId = ticket.proposedData?.ticketId || ticket.id;

  // 1. WhatsApp Auto-Reply Ticket (Baileys service on port 3007)
  if (targetId.startsWith('WA-APPR-') || ticket.actionType === 'OTHER') {
    try {
      const baileysUrl = process.env.WHATSAPP_BAILEYS_URL || 'http://localhost:3007';
      await fetch(`${baileysUrl}/approve-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: targetId,
          modifiedReplyText: adminPromptModifier || ticket.proposedData?.replyText,
        }),
        signal: AbortSignal.timeout(4000),
      }).catch(() => {});
    } catch (_) {}
  }

  // 2. Multi-Channel Command Center Ticket (Email/Web/SMS on port 3008)
  if (
    targetId.startsWith('EM-APPR-') ||
    targetId.startsWith('WEB-APPR-') ||
    targetId.startsWith('SMS-APPR-') ||
    targetId.startsWith('GEN-APPR-')
  ) {
    try {
      const commandCenterUrl = process.env.UNIFIED_COMMAND_URL || 'http://localhost:3008';
      await fetch(`${commandCenterUrl}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: targetId,
          customReply: adminPromptModifier,
        }),
        signal: AbortSignal.timeout(4000),
      }).catch(() => {});
    } catch (_) {}
  }

  return ticket;
}

/**
 * Rejects a decision ticket and dispatches rejection status to downstream service endpoints.
 */
export async function rejectTicket(id: string, reason?: string): Promise<ApprovalTicket> {
  const ticket = inMemoryQueue.find(t => t.id === id);
  if (!ticket) throw new Error(`Approval ticket ${id} not found.`);

  ticket.status = 'REJECTED';
  ticket.updatedAt = new Date().toISOString();
  if (reason) {
    ticket.adminDecisionNotes = reason;
  }

  console.log(`[Approval Gate] Ticket ${id} REJECTED by Admin. Reason: ${reason || 'None specified'}`);

  // ── Dispatch Rejection to External Services ──────────────────────────────────
  const targetId = ticket.proposedData?.ticketId || ticket.id;

  if (targetId.startsWith('WA-APPR-')) {
    try {
      const baileysUrl = process.env.WHATSAPP_BAILEYS_URL || 'http://localhost:3007';
      await fetch(`${baileysUrl}/reject-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: targetId, reason }),
        signal: AbortSignal.timeout(4000),
      }).catch(() => {});
    } catch (_) {}
  }

  if (
    targetId.startsWith('EM-APPR-') ||
    targetId.startsWith('WEB-APPR-') ||
    targetId.startsWith('SMS-APPR-') ||
    targetId.startsWith('GEN-APPR-')
  ) {
    try {
      const commandCenterUrl = process.env.UNIFIED_COMMAND_URL || 'http://localhost:3008';
      await fetch(`${commandCenterUrl}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: targetId, reason }),
        signal: AbortSignal.timeout(4000),
      }).catch(() => {});
    } catch (_) {}
  }

  return ticket;
}

/**
 * Updates Telegram Message ID associated with ticket
 */
export async function setTicketTelegramMessageId(id: string, telegramMessageId: number): Promise<void> {
  const ticket = inMemoryQueue.find(t => t.id === id);
  if (ticket) {
    ticket.telegramMessageId = telegramMessageId;
  }
}

