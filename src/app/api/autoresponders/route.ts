import { NextRequest, NextResponse } from 'next/server';
import {
  getAutoresponderRules,
  saveAutoresponderRule,
  deleteAutoresponderRule,
  processAutoresponderMessage,
  AutoresponderChannel,
} from '@/lib/autoresponderEngine';

export async function GET() {
  try {
    const rules = await getAutoresponderRules();
    const totalReplies = rules.reduce((acc, r) => acc + (r.reply_count || 0), 0);

    const channelStats = {
      whatsapp: rules.filter((r) => r.channel === 'whatsapp' || r.channel === 'all').length,
      sms: rules.filter((r) => r.channel === 'sms' || r.channel === 'all').length,
      email: rules.filter((r) => r.channel === 'email' || r.channel === 'all').length,
      webchat: rules.filter((r) => r.channel === 'webchat' || r.channel === 'all').length,
    };

    return NextResponse.json({
      success: true,
      rules,
      totalRules: rules.length,
      activeRules: rules.filter((r) => r.enabled).length,
      totalReplies,
      channelStats,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch autoresponder rules' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Rule name is required' },
        { status: 400 }
      );
    }

    const savedRule = await saveAutoresponderRule({
      id: body.id,
      name: body.name,
      channel: body.channel || 'all',
      trigger_type: body.trigger_type || 'contains',
      keywords: Array.isArray(body.keywords)
        ? body.keywords
        : String(body.keywords || '').split(',').map((k) => k.trim()).filter(Boolean),
      response_type: body.response_type || 'template',
      response_text: body.response_text || 'Thank you for reaching out!',
      priority: Number(body.priority) || 5,
      enabled: body.enabled !== undefined ? Boolean(body.enabled) : true,
    });

    return NextResponse.json({
      success: true,
      message: 'Autoresponder rule saved successfully',
      rule: savedRule,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save autoresponder rule' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ruleId = searchParams.get('id');

    if (!ruleId) {
      return NextResponse.json(
        { success: false, error: 'Rule ID parameter required' },
        { status: 400 }
      );
    }

    await deleteAutoresponderRule(ruleId);
    return NextResponse.json({
      success: true,
      message: `Autoresponder rule ${ruleId} deleted successfully`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete rule' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, channel = 'webchat', senderContact, senderName } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Test message is required' },
        { status: 400 }
      );
    }

    const result = await processAutoresponderMessage({
      message,
      channel: channel as AutoresponderChannel,
      senderContact,
      senderName,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process autoresponder test' },
      { status: 500 }
    );
  }
}
