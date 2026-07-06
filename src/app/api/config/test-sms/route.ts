// src/app/api/config/test-sms/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendSmsMessage } from '@/lib/sms';

/**
 * POST /api/config/test-sms
 * Body: { testNumber: string, config: any }
 *
 * Sends a real test SMS using the provided (potentially unsaved) SMS configuration.
 */
export async function POST(req: NextRequest) {
  try {
    const { testNumber, config } = await req.json();

    if (!testNumber) {
      return NextResponse.json(
        { success: false, error: 'Test phone number is required.' },
        { status: 400 }
      );
    }

    if (!config || typeof config !== 'object') {
      return NextResponse.json(
        { success: false, error: 'SMS Configuration object is required.' },
        { status: 400 }
      );
    }

    // Create a mock lead for the test
    const mockLead = {
      name: 'Test Recipient',
      phone_raw: testNumber,
      phone_e164: testNumber,
      company: 'ApexReach Test'
    };

    const previewUrl = `${new URL(req.url).origin}/preview/test-sms`;
    const testMessage = `This is a test message from ApexReach to verify your SMS provider (${config.smsProvider}) settings.`;

    const details = await sendSmsMessage(mockLead, previewUrl, testMessage, config);

    return NextResponse.json({
      success: true,
      message: `Test SMS sent successfully! Details: ${details}`
    });
  } catch (err: any) {
    console.error('Test SMS configuration failed:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown SMS API error' },
      { status: 500 }
    );
  }
}
