import fs from 'fs';
import path from 'path';

export type StorageMode = 'cloud' | 'local' | 'hybrid' | 'supabase';

export interface LocalConfig {
  // ── Google identity / auth ──────────────────────────────
  googleClientId?: string;
  googleClientSecret?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: number;
  googleUserEmail?: string;
  // ── Google Cloud project (required for Vertex AI) ──────
  googleProjectId?: string;
  // ── Google data tools ──────────────────────────────────
  googleSpreadsheetId: string;
  googlePlacesApiKey: string;
  // ── Outreach ───────────────────────────────────────────
  dryRun: boolean;
  businessSignature: string;
  outreachChannel?: 'gmail' | 'whatsapp' | 'coldcall' | 'jiji' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'sms';
  // WhatsApp template (optional)
  whatsappMessageTemplate?: string;
  // Twilio Cold Call configuration (optional)
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  // Template for the spoken message (supports {{lead.name}}, {{previewUrl}})
  twilioCallMessageTemplate?: string;
  // Jiji messaging settings (optional)
  jijiEmail?: string;
  jijiPassword?: string;
  jijiMessageTemplate?: string;
  instagramMessageTemplate?: string;
  facebookMessageTemplate?: string;
  tiktokMessageTemplate?: string;
  linkedinMessageTemplate?: string;
  // Optional URL to a TwiML document; if not provided we generate inline TwiML via API.
  twilioTwimlUrl?: string;

  // ── SMS Outreach Configuration ──────────────────────────
  smsProvider?: 'twilio' | 'termii' | 'africastalking' | 'gateway';
  smsMessageTemplate?: string;
  smsGatewayUrl?: string;
  termiiApiKey?: string;
  termiiSenderId?: string;
  africastalkingUsername?: string;
  africastalkingApiKey?: string;
  africastalkingSenderId?: string;
  
  // ── Alternative Outreach Channels ───────────────────────
  emailProvider?: 'gmail' | 'resend' | 'brevo';
  whatsappProvider?: 'cloud' | 'evolution' | 'whapi';
  resendApiKey?: string;
  resendFromEmail?: string;
  brevoApiKey?: string;
  brevoSenderName?: string;
  brevoSenderEmail?: string;
  evolutionApiUrl?: string;
  evolutionApiKey?: string;
  evolutionInstanceName?: string;
  whapiToken?: string;

  // ── Claiming / Payments ────────────────────────────────
  paystackPublicKey?: string;
  paystackSecretKey?: string;
  claimFeeNGN?: number;
  moniepointBankName?: string;
  moniepointAccountNumber?: string;
  moniepointAccountName?: string;

  // ── Legacy / optional (kept for backward compat) ───────
  apifyToken: string;
  apifyDatasetId: string;
  whatsappPhoneNumberId: string;
  whatsappAccessToken: string;
  whatsappTemplateName: string;
  whatsappTemplateLanguageCode: string;
  whatsappDailyCap: number;
  whatsappEnabled: boolean;
  supabaseUrl?: string;
  supabaseKey?: string;
  geminiApiKey?: string;
  n8nWebhookUrl?: string;
}

export interface RuntimeConfig extends LocalConfig {
  storageMode: StorageMode;
}

const DEFAULT_CONFIG: RuntimeConfig = {
  // Google auth
  googleClientId: '',
  googleClientSecret: '',
  googleAccessToken: '',
  googleRefreshToken: '',
  googleTokenExpiry: 0,
  googleUserEmail: '',
  googleProjectId: '',
  // Google data tools
  googleSpreadsheetId: '',
  googlePlacesApiKey: '',
  // Outreach
  dryRun: true,
  businessSignature: 'ApexReach',
  outreachChannel: 'gmail',
  // WhatsApp template (optional)
  whatsappMessageTemplate: '',
  // Twilio Cold Call defaults
  twilioAccountSid: '',
  twilioAuthToken: '',
  twilioFromNumber: '',
  twilioCallMessageTemplate: '',
  twilioTwimlUrl: '',
  jijiEmail: '',
  jijiPassword: '',
  jijiMessageTemplate: '',
  instagramMessageTemplate: '',
  facebookMessageTemplate: '',
  tiktokMessageTemplate: '',
  linkedinMessageTemplate: '',
  
  // Alternative Outreach
  emailProvider: 'gmail',
  whatsappProvider: 'cloud',
  resendApiKey: '',
  resendFromEmail: '',
  brevoApiKey: '',
  brevoSenderName: '',
  brevoSenderEmail: '',
  evolutionApiUrl: '',
  evolutionApiKey: '',
  evolutionInstanceName: '',
  whapiToken: '',

  // Claiming / Payments Defaults
  paystackPublicKey: '',
  paystackSecretKey: '',
  claimFeeNGN: 0,
  moniepointBankName: 'Moniepoint Microfinance Bank',
  moniepointAccountNumber: '',
  moniepointAccountName: '',

  // SMS Outreach Defaults
  smsProvider: 'gateway',
  smsMessageTemplate: '',
  smsGatewayUrl: '',
  termiiApiKey: '',
  termiiSenderId: '',
  africastalkingUsername: '',
  africastalkingApiKey: '',
  africastalkingSenderId: '',

  // Legacy
  apifyToken: '',
  apifyDatasetId: '',
  whatsappPhoneNumberId: '',
  whatsappAccessToken: '',
  whatsappTemplateName: 'lead_outreach_1',
  whatsappTemplateLanguageCode: 'en_US',
  whatsappDailyCap: 50,
  whatsappEnabled: false,
  supabaseUrl: '',
  supabaseKey: '',
  geminiApiKey: '',
  n8nWebhookUrl: '',
  storageMode: 'hybrid',
};

const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
const BUNDLE_CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');
const WRITEABLE_CONFIG_FILE_PATH = isServerless
  ? path.join('/tmp', 'config.json')
  : BUNDLE_CONFIG_FILE_PATH;

export function getRuntimeConfig(): RuntimeConfig {
  let fileConfig: Partial<LocalConfig & { storageMode: StorageMode }> = {};
  try {
    const readPath = fs.existsSync(WRITEABLE_CONFIG_FILE_PATH) ? WRITEABLE_CONFIG_FILE_PATH : BUNDLE_CONFIG_FILE_PATH;
    if (fs.existsSync(readPath)) {
      const data = fs.readFileSync(readPath, 'utf-8');
      fileConfig = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local config:', e);
  }

  // Precedence rule: process.env > config.json > DEFAULT_CONFIG
  const merged: RuntimeConfig = {
    // Google auth
    googleClientId: process.env.GOOGLE_CLIENT_ID || fileConfig.googleClientId || DEFAULT_CONFIG.googleClientId,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || fileConfig.googleClientSecret || DEFAULT_CONFIG.googleClientSecret,
    googleAccessToken: process.env.GOOGLE_ACCESS_TOKEN || fileConfig.googleAccessToken || DEFAULT_CONFIG.googleAccessToken,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN || fileConfig.googleRefreshToken || DEFAULT_CONFIG.googleRefreshToken,
    googleTokenExpiry: Number(process.env.GOOGLE_TOKEN_EXPIRY) || Number(fileConfig.googleTokenExpiry) || DEFAULT_CONFIG.googleTokenExpiry,
    googleUserEmail: process.env.GOOGLE_USER_EMAIL || fileConfig.googleUserEmail || DEFAULT_CONFIG.googleUserEmail,
    googleProjectId: process.env.GOOGLE_PROJECT_ID || fileConfig.googleProjectId || DEFAULT_CONFIG.googleProjectId,
    // Google data tools
    googleSpreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || fileConfig.googleSpreadsheetId || DEFAULT_CONFIG.googleSpreadsheetId,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || fileConfig.googlePlacesApiKey || DEFAULT_CONFIG.googlePlacesApiKey,
    // Outreach
    dryRun: process.env.DRY_RUN !== 'false' && (process.env.DRY_RUN === 'true' || fileConfig.dryRun !== false),
    businessSignature: process.env.BUSINESS_SIGNATURE || fileConfig.businessSignature || DEFAULT_CONFIG.businessSignature,
    outreachChannel: (process.env.OUTREACH_CHANNEL as any) || fileConfig.outreachChannel || DEFAULT_CONFIG.outreachChannel,
    
    // Alternative Outreach
    emailProvider: (process.env.EMAIL_PROVIDER as any) || fileConfig.emailProvider || DEFAULT_CONFIG.emailProvider,
    whatsappProvider: (process.env.WHATSAPP_PROVIDER as any) || fileConfig.whatsappProvider || DEFAULT_CONFIG.whatsappProvider,
    resendApiKey: process.env.RESEND_API_KEY || fileConfig.resendApiKey || DEFAULT_CONFIG.resendApiKey,
    resendFromEmail: process.env.RESEND_FROM_EMAIL || fileConfig.resendFromEmail || DEFAULT_CONFIG.resendFromEmail,
    brevoApiKey: process.env.BREVO_API_KEY || fileConfig.brevoApiKey || DEFAULT_CONFIG.brevoApiKey,
    brevoSenderName: process.env.BREVO_SENDER_NAME || fileConfig.brevoSenderName || DEFAULT_CONFIG.brevoSenderName,
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || fileConfig.brevoSenderEmail || DEFAULT_CONFIG.brevoSenderEmail,
    evolutionApiUrl: process.env.EVOLUTION_API_URL || fileConfig.evolutionApiUrl || DEFAULT_CONFIG.evolutionApiUrl,
    evolutionApiKey: process.env.EVOLUTION_API_KEY || fileConfig.evolutionApiKey || DEFAULT_CONFIG.evolutionApiKey,
    evolutionInstanceName: process.env.EVOLUTION_INSTANCE_NAME || fileConfig.evolutionInstanceName || DEFAULT_CONFIG.evolutionInstanceName,
    whapiToken: process.env.WHAPI_TOKEN || fileConfig.whapiToken || DEFAULT_CONFIG.whapiToken,

    // Claiming / Payments
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || fileConfig.paystackPublicKey || DEFAULT_CONFIG.paystackPublicKey,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || fileConfig.paystackSecretKey || DEFAULT_CONFIG.paystackSecretKey,
    claimFeeNGN: Number(process.env.CLAIM_FEE_NGN) || (fileConfig.claimFeeNGN !== undefined ? Number(fileConfig.claimFeeNGN) : DEFAULT_CONFIG.claimFeeNGN),
    moniepointBankName: process.env.MONIEPOINT_BANK_NAME || fileConfig.moniepointBankName || DEFAULT_CONFIG.moniepointBankName,
    moniepointAccountNumber: process.env.MONIEPOINT_ACCOUNT_NUMBER || fileConfig.moniepointAccountNumber || DEFAULT_CONFIG.moniepointAccountNumber,
    moniepointAccountName: process.env.MONIEPOINT_ACCOUNT_NAME || fileConfig.moniepointAccountName || DEFAULT_CONFIG.moniepointAccountName,

    // SMS Outreach Configuration
    smsProvider: (process.env.SMS_PROVIDER as any) || fileConfig.smsProvider || DEFAULT_CONFIG.smsProvider,
    smsMessageTemplate: process.env.SMS_MESSAGE_TEMPLATE || fileConfig.smsMessageTemplate || DEFAULT_CONFIG.smsMessageTemplate,
    smsGatewayUrl: process.env.SMS_GATEWAY_URL || fileConfig.smsGatewayUrl || DEFAULT_CONFIG.smsGatewayUrl,
    termiiApiKey: process.env.TERMII_API_KEY || fileConfig.termiiApiKey || DEFAULT_CONFIG.termiiApiKey,
    termiiSenderId: process.env.TERMII_SENDER_ID || fileConfig.termiiSenderId || DEFAULT_CONFIG.termiiSenderId,
    africastalkingUsername: process.env.AFRICASTALKING_USERNAME || fileConfig.africastalkingUsername || DEFAULT_CONFIG.africastalkingUsername,
    africastalkingApiKey: process.env.AFRICASTALKING_API_KEY || fileConfig.africastalkingApiKey || DEFAULT_CONFIG.africastalkingApiKey,
    africastalkingSenderId: process.env.AFRICASTALKING_SENDER_ID || fileConfig.africastalkingSenderId || DEFAULT_CONFIG.africastalkingSenderId,

    // Legacy
    apifyToken: process.env.APIFY_TOKEN || fileConfig.apifyToken || DEFAULT_CONFIG.apifyToken,
    apifyDatasetId: process.env.APIFY_DATASET_ID || fileConfig.apifyDatasetId || DEFAULT_CONFIG.apifyDatasetId,
    whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || fileConfig.whatsappPhoneNumberId || DEFAULT_CONFIG.whatsappPhoneNumberId,
    whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || fileConfig.whatsappAccessToken || DEFAULT_CONFIG.whatsappAccessToken,
    whatsappTemplateName: process.env.WHATSAPP_TEMPLATE_NAME || fileConfig.whatsappTemplateName || DEFAULT_CONFIG.whatsappTemplateName,
    whatsappTemplateLanguageCode: process.env.WHATSAPP_TEMPLATE_LANGUAGE_CODE || fileConfig.whatsappTemplateLanguageCode || DEFAULT_CONFIG.whatsappTemplateLanguageCode,
    whatsappDailyCap: Number(process.env.WHATSAPP_DAILY_CAP) || Number(fileConfig.whatsappDailyCap) || DEFAULT_CONFIG.whatsappDailyCap,
    whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true' || fileConfig.whatsappEnabled || DEFAULT_CONFIG.whatsappEnabled,
    // Custom message template
    whatsappMessageTemplate: process.env.WHATSAPP_MESSAGE_TEMPLATE || fileConfig.whatsappMessageTemplate || DEFAULT_CONFIG.whatsappMessageTemplate,
    // Twilio fields
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || fileConfig.twilioAccountSid || DEFAULT_CONFIG.twilioAccountSid,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || fileConfig.twilioAuthToken || DEFAULT_CONFIG.twilioAuthToken,
    twilioFromNumber: process.env.TWILIO_FROM_NUMBER || fileConfig.twilioFromNumber || DEFAULT_CONFIG.twilioFromNumber,
    twilioCallMessageTemplate: process.env.TWILIO_CALL_MESSAGE_TEMPLATE || fileConfig.twilioCallMessageTemplate || DEFAULT_CONFIG.twilioCallMessageTemplate,
    twilioTwimlUrl: process.env.TWILIO_TWIML_URL || fileConfig.twilioTwimlUrl || DEFAULT_CONFIG.twilioTwimlUrl,
    jijiEmail: process.env.JIJI_EMAIL || fileConfig.jijiEmail || DEFAULT_CONFIG.jijiEmail,
    jijiPassword: process.env.JIJI_PASSWORD || fileConfig.jijiPassword || DEFAULT_CONFIG.jijiPassword,
    jijiMessageTemplate: process.env.JIJI_MESSAGE_TEMPLATE || fileConfig.jijiMessageTemplate || DEFAULT_CONFIG.jijiMessageTemplate,
    instagramMessageTemplate: process.env.INSTAGRAM_MESSAGE_TEMPLATE || fileConfig.instagramMessageTemplate || DEFAULT_CONFIG.instagramMessageTemplate,
    facebookMessageTemplate: process.env.FACEBOOK_MESSAGE_TEMPLATE || fileConfig.facebookMessageTemplate || DEFAULT_CONFIG.facebookMessageTemplate,
    tiktokMessageTemplate: process.env.TIKTOK_MESSAGE_TEMPLATE || fileConfig.tiktokMessageTemplate || DEFAULT_CONFIG.tiktokMessageTemplate,
    linkedinMessageTemplate: process.env.LINKEDIN_MESSAGE_TEMPLATE || fileConfig.linkedinMessageTemplate || DEFAULT_CONFIG.linkedinMessageTemplate,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || fileConfig.supabaseUrl || DEFAULT_CONFIG.supabaseUrl,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fileConfig.supabaseKey || DEFAULT_CONFIG.supabaseKey,
    geminiApiKey: process.env.GEMINI_API_KEY || fileConfig.geminiApiKey || DEFAULT_CONFIG.geminiApiKey,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || fileConfig.n8nWebhookUrl || DEFAULT_CONFIG.n8nWebhookUrl,
    storageMode: (process.env.STORAGE_MODE as StorageMode) || fileConfig.storageMode || DEFAULT_CONFIG.storageMode,
  };

  return merged;
}

export function getLocalConfig(): LocalConfig {
  return getRuntimeConfig();
}

export function saveLocalConfig(config: Partial<RuntimeConfig>): RuntimeConfig {
  try {
    const current = getRuntimeConfig();
    const updated = { ...current, ...config };
    
    // Save to config.json
    const fileData = {
      // Google auth
      googleClientId: updated.googleClientId,
      googleClientSecret: updated.googleClientSecret,
      googleAccessToken: updated.googleAccessToken,
      googleRefreshToken: updated.googleRefreshToken,
      googleTokenExpiry: updated.googleTokenExpiry,
      googleUserEmail: updated.googleUserEmail,
      googleProjectId: updated.googleProjectId,
      // Google data tools
      googleSpreadsheetId: updated.googleSpreadsheetId,
      googlePlacesApiKey: updated.googlePlacesApiKey,
      // Outreach
      dryRun: updated.dryRun,
      businessSignature: updated.businessSignature,
      outreachChannel: updated.outreachChannel,
      
      // Alternative Outreach
      emailProvider: updated.emailProvider,
      whatsappProvider: updated.whatsappProvider,
      resendApiKey: updated.resendApiKey,
      resendFromEmail: updated.resendFromEmail,
      brevoApiKey: updated.brevoApiKey,
      brevoSenderName: updated.brevoSenderName,
      brevoSenderEmail: updated.brevoSenderEmail,
      evolutionApiUrl: updated.evolutionApiUrl,
      evolutionApiKey: updated.evolutionApiKey,
      evolutionInstanceName: updated.evolutionInstanceName,
      whapiToken: updated.whapiToken,

      // Claiming / Payments
      paystackPublicKey: updated.paystackPublicKey,
      paystackSecretKey: updated.paystackSecretKey,
      claimFeeNGN: updated.claimFeeNGN,
      moniepointBankName: updated.moniepointBankName,
      moniepointAccountNumber: updated.moniepointAccountNumber,
      moniepointAccountName: updated.moniepointAccountName,

      // SMS Outreach Configuration
      smsProvider: updated.smsProvider,
      smsMessageTemplate: updated.smsMessageTemplate,
      smsGatewayUrl: updated.smsGatewayUrl,
      termiiApiKey: updated.termiiApiKey,
      termiiSenderId: updated.termiiSenderId,
      africastalkingUsername: updated.africastalkingUsername,
      africastalkingApiKey: updated.africastalkingApiKey,
      africastalkingSenderId: updated.africastalkingSenderId,

      // Legacy
      apifyToken: updated.apifyToken,
      apifyDatasetId: updated.apifyDatasetId,
      whatsappPhoneNumberId: updated.whatsappPhoneNumberId,
      whatsappAccessToken: updated.whatsappAccessToken,
      whatsappTemplateName: updated.whatsappTemplateName,
      whatsappTemplateLanguageCode: updated.whatsappTemplateLanguageCode,
      whatsappDailyCap: updated.whatsappDailyCap,
      whatsappEnabled: updated.whatsappEnabled,
      jijiEmail: updated.jijiEmail,
      jijiPassword: updated.jijiPassword,
      jijiMessageTemplate: updated.jijiMessageTemplate,
      instagramMessageTemplate: updated.instagramMessageTemplate,
      facebookMessageTemplate: updated.facebookMessageTemplate,
      tiktokMessageTemplate: updated.tiktokMessageTemplate,
      linkedinMessageTemplate: updated.linkedinMessageTemplate,
      supabaseUrl: updated.supabaseUrl,
      supabaseKey: updated.supabaseKey,
      geminiApiKey: updated.geminiApiKey,
      n8nWebhookUrl: updated.n8nWebhookUrl,
      storageMode: updated.storageMode,
    };
    
    fs.writeFileSync(WRITEABLE_CONFIG_FILE_PATH, JSON.stringify(fileData, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.error('Error writing local config:', e);
    throw e;
  }
}
