// src/app/api/whatsapp/meta-cloud/setup/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import {
  getMetaCloudConfig,
  getMetaPhoneNumberStatus,
  registerMetaPhoneNumber,
  updateMetaBusinessProfile,
  createMetaOutreachTemplate,
  sendMetaCloudTextMessage,
  requestPhoneVerificationCode,
  verifyPhoneCode
} from '@/lib/whatsapp/metaCloudClient';

function saveCredentialsToEnvFile(updates: Record<string, string>) {
  try {
    const envPath = path.join(process.cwd(), '.env.local');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    for (const [key, value] of Object.entries(updates)) {
      if (!value) continue;
      const regex = new RegExp(`^${key}=.*$`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}="${value}"`);
      } else {
        content += `\n${key}="${value}"`;
      }
    }

    fs.writeFileSync(envPath, content.trim() + '\n', 'utf8');
    return true;
  } catch (err: any) {
    console.error('[Meta Cloud Setup] Failed to write .env.local:', err.message);
    return false;
  }
}

/**
 * GET: Returns current Meta WhatsApp Cloud connection status and webhook info
 */
export async function GET() {
  try {
    const currentConfig = getMetaCloudConfig();
    const runtimeConfig = getRuntimeConfig();
    const webhookVerifyToken = process.env.WHATSAPP_CLOUD_VERIFY_TOKEN || process.env.META_WA_VERIFY_TOKEN || 'bethelmind_meta_webhook_2026';
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.bethelmindanalytics.com'}/api/whatsapp/meta-webhook`;

    let connectionStatus: any = null;
    let isConnected = false;
    let error: string | null = null;

    if (currentConfig.accessToken && currentConfig.phoneNumberId) {
      try {
        connectionStatus = await getMetaPhoneNumberStatus(currentConfig);
        isConnected = true;
      } catch (err: any) {
        error = err.message;
      }
    }

    return NextResponse.json({
      success: true,
      configured: !!(currentConfig.accessToken && currentConfig.phoneNumberId),
      isConnected,
      phoneNumberId: currentConfig.phoneNumberId ? `${currentConfig.phoneNumberId.slice(0, 4)}...${currentConfig.phoneNumberId.slice(-4)}` : null,
      wabaId: currentConfig.wabaId || null,
      apiVersion: currentConfig.apiVersion,
      statusDetails: connectionStatus,
      error,
      webhook: {
        url: webhookUrl,
        verifyToken: webhookVerifyToken,
        instructions: 'Add this Webhook URL and Verify Token in Meta App Dashboard > WhatsApp > Configuration > Webhook'
      },
      currentProvider: runtimeConfig.whatsappProvider || 'meta_cloud'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * POST: Automates setup actions (validate, register, profile, template, test, full_setup)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      accessToken,
      phoneNumberId,
      wabaId,
      pin = '123456',
      testPhone = '2348022791227',
      action = 'full_setup',
      codeMethod = 'SMS',
      otpCode
    } = body;

    const conf = {
      accessToken: accessToken || process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || process.env.META_WA_ACCESS_TOKEN,
      phoneNumberId: phoneNumberId || process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || process.env.META_WA_PHONE_NUMBER_ID,
      wabaId: wabaId || process.env.WHATSAPP_CLOUD_WABA_ID || process.env.META_WA_WABA_ID
    };

    if (!conf.accessToken || !conf.phoneNumberId) {
      return NextResponse.json({
        success: false,
        error: 'Both accessToken and phoneNumberId are required for Meta Cloud API automation.'
      }, { status: 400 });
    }

    const results: Record<string, any> = {};

    // 1. Validate connection
    if (action === 'validate' || action === 'full_setup') {
      try {
        const status = await getMetaPhoneNumberStatus(conf);
        results.validation = {
          success: true,
          displayNumber: status.display_phone_number,
          verifiedName: status.verified_name,
          qualityRating: status.quality_rating,
          codeVerificationStatus: status.code_verification_status
        };
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          stage: 'validation',
          error: `Meta API Connection Failed: ${err.message}`
        }, { status: 400 });
      }
    }

    // 2. Request OTP Code (optional step if number is unverified)
    if (action === 'request_otp') {
      try {
        const otpReq = await requestPhoneVerificationCode(codeMethod, 'en_US', conf);
        return NextResponse.json({ success: true, message: 'OTP requested via ' + codeMethod, details: otpReq });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
      }
    }

    // 3. Verify OTP Code
    if (action === 'verify_otp') {
      if (!otpCode) {
        return NextResponse.json({ success: false, error: 'otpCode is required for verify_otp action.' }, { status: 400 });
      }
      try {
        const otpVer = await verifyPhoneCode(otpCode, conf);
        return NextResponse.json({ success: true, message: 'OTP verified successfully!', details: otpVer });
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
      }
    }

    // 4. Register Phone Number with Two-Step Verification PIN
    if (action === 'register' || action === 'full_setup') {
      try {
        const regRes = await registerMetaPhoneNumber(pin, conf);
        results.registration = { success: true, details: regRes };
      } catch (err: any) {
        results.registration = {
          success: false,
          note: 'Phone number might already be registered or requires OTP first.',
          error: err.message
        };
      }
    }

    // 5. Update Business Profile with Bethelmind Analytics Lagos Branding
    if (action === 'profile' || action === 'full_setup') {
      try {
        const profRes = await updateMetaBusinessProfile({
          about: 'Bethelmind Analytics Lagos | 24/7 AI Commercial Automations',
          address: 'Victoria Island & Lekki Phase 1, Lagos, Nigeria',
          description: 'Specialized B2B Lead Generation, AI WhatsApp Sales Closers & Custom Digital Prototypes for Nigerian Commercial Enterprises.',
          email: 'bethelmindrecruit@gmail.com',
          websites: ['https://www.bethelmindanalytics.com'],
          vertical: 'PROF_SERVICES'
        }, conf);
        results.profile = { success: true, details: profRes };
      } catch (err: any) {
        results.profile = { success: false, error: err.message };
      }
    }

    // 6. Submit Pre-Approved B2B Outreach Template (if WABA ID provided)
    if ((action === 'template' || action === 'full_setup') && conf.wabaId) {
      try {
        const tplRes = await createMetaOutreachTemplate('b2b_prototype_outreach_v1', 'MARKETING', conf);
        results.template = { success: true, details: tplRes };
      } catch (err: any) {
        results.template = {
          success: false,
          note: 'Template may already exist or WABA ID requires review.',
          error: err.message
        };
      }
    }

    // 7. Send Live Test Message (to Admin Desk)
    if (action === 'test' || action === 'full_setup') {
      try {
        const cleanTestPhone = testPhone.replace(/\D/g, '');
        const testRes = await sendMetaCloudTextMessage(
          cleanTestPhone,
          '🚀 *Bethelmind Analytics Lagos Desk*\nOfficial Meta WhatsApp Business Cloud API successfully automated and linked!\nZero ban risk • Sub-3s AI Closer Active.',
          conf
        );
        results.testDispatch = { success: true, messageId: testRes?.messages?.[0]?.id };
      } catch (err: any) {
        results.testDispatch = {
          success: false,
          note: 'Outbound text to un-messaged numbers requires a pre-approved template outside 24h window.',
          error: err.message
        };
      }
    }

    // 8. Persist credentials to .env.local and runtime config
    if (action === 'full_setup' || action === 'save') {
      saveCredentialsToEnvFile({
        WHATSAPP_CLOUD_ACCESS_TOKEN: conf.accessToken,
        WHATSAPP_CLOUD_PHONE_NUMBER_ID: conf.phoneNumberId,
        WHATSAPP_CLOUD_WABA_ID: conf.wabaId || '',
        WHATSAPP_PROVIDER: 'meta_cloud'
      });

      const runtimeConfig = getRuntimeConfig();
      saveLocalConfig({
        ...runtimeConfig,
        whatsappAccessToken: conf.accessToken,
        whatsappPhoneNumberId: conf.phoneNumberId,
        whatsappProvider: 'meta_cloud'
      });
      results.persisted = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Meta WhatsApp Cloud automation executed successfully!',
      results
    });

  } catch (err: any) {
    console.error('[Meta Cloud Setup Route Error]:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
