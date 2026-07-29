import { NextRequest, NextResponse } from 'next/server';
import {
  getApprovalTickets,
  createApprovalTicket,
  approveTicket,
  rejectTicket,
  getApprovalTicketById,
} from '@/lib/approvalQueueManager';
import { sendTelegramApprovalRequest } from '@/lib/telegramApprovalBot';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/approvals
 * Returns approval queue tickets (supports status query filter: PENDING_HUMAN_APPROVAL, APPROVED, REJECTED)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as any;
    const tickets = await getApprovalTickets(status);
    return NextResponse.json({ success: true, count: tickets.length, tickets });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/approvals
 * Action Handler: create, approve, or reject approval tickets
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId, actionType, title, summary, proposedData, adminPromptModifier, reason } = body;

    // 1. Create a new decision approval ticket
    if (action === 'create') {
      if (!title || !summary) {
        return NextResponse.json({ error: 'Title and summary are required' }, { status: 400 });
      }

      const ticket = await createApprovalTicket({
        actionType: actionType || 'OTHER',
        title,
        summary,
        proposedData: proposedData || {},
      });

      // Send interactive Telegram notification
      await sendTelegramApprovalRequest(ticket);

      return NextResponse.json({ success: true, message: 'Ticket created and sent to Telegram', ticket });
    }

    // 2. Approve a decision ticket (with optional prompt modifier)
    if (action === 'approve') {
      if (!ticketId) return NextResponse.json({ error: 'ticketId is required' }, { status: 400 });
      const updatedTicket = await approveTicket(ticketId, adminPromptModifier);
      return NextResponse.json({ success: true, message: 'Ticket approved', ticket: updatedTicket });
    }

    // 3. Reject a decision ticket
    if (action === 'reject') {
      if (!ticketId) return NextResponse.json({ error: 'ticketId is required' }, { status: 400 });
      const updatedTicket = await rejectTicket(ticketId, reason);
      return NextResponse.json({ success: true, message: 'Ticket rejected', ticket: updatedTicket });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
