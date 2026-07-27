import { NextRequest, NextResponse } from 'next/server';
import {
  getPendingApprovalRequests,
  processApprovalDecision,
} from '@/lib/customerAiAgent';

export async function GET() {
  try {
    const pending = await getPendingApprovalRequests();
    return NextResponse.json({
      success: true,
      pending,
      count: pending.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch pending approval requests' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, decision, adminNotes } = body;

    if (!sessionId || !decision || !['approve', 'reject'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'sessionId and valid decision ("approve" or "reject") required' },
        { status: 400 }
      );
    }

    const result = await processApprovalDecision({
      sessionId,
      decision,
      adminNotes,
    });

    return NextResponse.json({
      success: true,
      message: `Critical stage request ${decision === 'approve' ? 'APPROVED' : 'REJECTED'} successfully! Notification sent to customer session.`,
      session: result.session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process approval decision' },
      { status: 500 }
    );
  }
}
