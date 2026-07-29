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
 * Approves a decision ticket, optionally attaching a custom prompt modifier
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
  return ticket;
}

/**
 * Rejects a decision ticket
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
