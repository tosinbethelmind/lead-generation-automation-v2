/**
 * src/lib/whatsapp/metaCloudClient.ts
 * 
 * Official Meta WhatsApp Business Cloud API Client
 * 
 * Provides 100% compliant, zero-ban official messaging:
 * 1. Automated Phone Registration & Verification (request_code, verify_code, register)
 * 2. Automated Business Profile Configuration
 * 3. Automated Outreach Template Creation & Dispatch
 * 4. Inbound Webhook Payload Processing
 */

export interface MetaCloudConfig {
  accessToken: string;
  phoneNumberId: string;
  wabaId?: string;
  apiVersion?: string;
}

export function getMetaCloudConfig(): MetaCloudConfig {
  let fileConfig: any = {};
  try {
    const { getRuntimeConfig } = require('@/lib/localConfig');
    fileConfig = getRuntimeConfig() || {};
  } catch (_) {}

  const accessToken = process.env.WHATSAPP_CLOUD_ACCESS_TOKEN || process.env.META_WA_ACCESS_TOKEN || fileConfig.whatsappAccessToken || '';
  const phoneNumberId = process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || process.env.META_WA_PHONE_NUMBER_ID || fileConfig.whatsappPhoneNumberId || '';
  const wabaId = process.env.WHATSAPP_CLOUD_WABA_ID || process.env.META_WA_WABA_ID || fileConfig.whatsappWabaId || '';
  const apiVersion = process.env.WHATSAPP_CLOUD_API_VERSION || 'v20.0';

  return {
    accessToken,
    phoneNumberId,
    wabaId,
    apiVersion
  };
}

/**
 * 1. Health check & Phone Number Status
 */
export async function getMetaPhoneNumberStatus(config?: Partial<MetaCloudConfig>): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  if (!conf.accessToken || !conf.phoneNumberId) {
    throw new Error('Meta Cloud API credentials missing (WHATSAPP_CLOUD_ACCESS_TOKEN or WHATSAPP_CLOUD_PHONE_NUMBER_ID)');
  }

  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}?fields=verified_name,code_verification_status,display_phone_number,quality_rating,platform_type,throughput`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Meta API error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 2. Automated Phone Verification Request (SMS or VOICE OTP)
 */
export async function requestPhoneVerificationCode(
  codeMethod: 'SMS' | 'VOICE' = 'SMS',
  locale: string = 'en_US',
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/request_code`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code_method: codeMethod,
      locale: locale
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Request code error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 3. Verify OTP Code
 */
export async function verifyPhoneCode(
  code: string,
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/verify_code`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: code
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Verify code error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 4. Register Phone Number with 6-digit Two-Step PIN
 */
export async function registerMetaPhoneNumber(
  pin: string = '123456',
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/register`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      pin: pin
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Register phone error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 5. Update Business Profile Details
 */
export async function updateMetaBusinessProfile(params: {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  websites?: string[];
  vertical?: string;
}, config?: Partial<MetaCloudConfig>): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/whatsapp_business_profile`;

  const body: any = {
    messaging_product: 'whatsapp',
    about: params.about || 'Bethelmind Analytics Lagos | 24/7 AI Commercial Automations',
    address: params.address || 'Victoria Island & Lekki Phase 1, Lagos, Nigeria',
    description: params.description || 'Specialized B2B Lead Generation, AI WhatsApp Sales Closers & Custom Digital Prototypes for Nigerian Commercial Enterprises.',
    email: params.email || 'bethelmindrecruit@gmail.com',
    websites: params.websites || ['https://www.bethelmindanalytics.com'],
    vertical: params.vertical || 'PROF_SERVICES'
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Profile update error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 6. Send Free-Form Text Message (Available inside 24h Customer Care Window or to Test Numbers)
 */
export async function sendMetaCloudTextMessage(
  recipientPhone: string,
  text: string,
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const cleanPhone = recipientPhone.replace(/\D/g, '');

  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: true,
        body: text
      }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Send text error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 7. Send Official Pre-Approved Meta Template (For Cold Outbound Outside 24h Window)
 */
export async function sendMetaCloudTemplateMessage(
  recipientPhone: string,
  templateName: string,
  languageCode: string = 'en',
  components: any[] = [],
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  const cleanPhone = recipientPhone.replace(/\D/g, '');

  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.phoneNumberId}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode
        },
        components: components
      }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Send template error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}

/**
 * 8. Automated Template Creation on Meta WABA
 */
export async function createMetaOutreachTemplate(
  name: string = 'commercial_prototype_demo',
  category: 'MARKETING' | 'UTILITY' = 'UTILITY',
  config?: Partial<MetaCloudConfig>
): Promise<any> {
  const conf = { ...getMetaCloudConfig(), ...config };
  if (!conf.wabaId) {
    throw new Error('WHATSAPP_CLOUD_WABA_ID is required to register templates');
  }

  const url = `https://graph.facebook.com/${conf.apiVersion}/${conf.wabaId}/message_templates`;

  const templatePayload = {
    name: name,
    category: category,
    language: 'en',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: 'Bethelmind Analytics Lagos | Operational Update'
      },
      {
        type: 'BODY',
        text: 'Good day {{1}} team. We built a custom 24/7 quoting tool and digital prototype for your firm. Tap below to preview your live prototype.',
        example: {
          body_text: [
            ['SolarTech']
          ]
        }
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'URL',
            text: 'View Demo Prototype',
            url: 'https://www.bethelmindanalytics.com/preview/{{1}}',
            example: ['solartech']
          },
          {
            type: 'QUICK_REPLY',
            text: 'Speak with Admin Desk'
          }
        ]
      }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${conf.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(templatePayload)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Create template error (${res.status}): ${JSON.stringify(data)}`);
  }
  return data;
}
