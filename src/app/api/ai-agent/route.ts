import { NextRequest, NextResponse } from 'next/server';
import {
  getCustomerAiAgentConfig,
  saveCustomerAiAgentConfig,
  processCustomerMessage,
  getOrCreateCustomerSession,
  getAllCustomerSessions,
} from '@/lib/customerAiAgent';

export async function GET() {
  try {
    const config = await getCustomerAiAgentConfig();
    const sessions = await getAllCustomerSessions();

    const totalSessions = sessions.length;
    const leadsCaptured = sessions.filter((s) => s.lead_captured).length;
    const handedOverSessions = sessions.filter((s) => s.status === 'handed_over').length;

    return NextResponse.json({
      success: true,
      config,
      sessions,
      stats: {
        totalSessions,
        leadsCaptured,
        handedOverSessions,
        conversionRate: totalSessions > 0 ? ((leadsCaptured / totalSessions) * 100).toFixed(1) + '%' : '0%',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch Customer AI Agent data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'chat', sessionId, message, sector, leadData, config } = body;

    if (action === 'save_config') {
      if (!config) {
        return NextResponse.json(
          { success: false, error: 'Configuration object required' },
          { status: 400 }
        );
      }
      const updated = await saveCustomerAiAgentConfig(config);
      return NextResponse.json({
        success: true,
        message: 'Customer AI Agent configuration saved successfully',
        config: updated,
      });
    }

    // Default Chat Action
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    const activeSessionId = sessionId || `session_${Math.random().toString(36).substring(2, 10)}`;
    const response = await processCustomerMessage(activeSessionId, message, sector || 'general', leadData);

    return NextResponse.json({
      success: true,
      sessionId: activeSessionId,
      reply: response.reply,
      session: response.session,
      pendingApproval: response.pendingApproval,
      handedOver: response.session.status === 'handed_over',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process Customer AI Agent request' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, status } = body;

    if (!sessionId || !status) {
      return NextResponse.json(
        { success: false, error: 'Session ID and new status required' },
        { status: 400 }
      );
    }

    const session = await getOrCreateCustomerSession(sessionId);
    session.status = status;
    session.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Session ${sessionId} status updated to ${status}`,
      session,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update session status' },
      { status: 500 }
    );
  }
}
