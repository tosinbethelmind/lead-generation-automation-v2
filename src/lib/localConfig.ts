import fs from 'fs';
import path from 'path';

export type StorageMode = 'cloud' | 'local' | 'hybrid' | 'supabase';

export interface LocalConfig {
  // ── SMTP Preset ───────────────────────────────────────
  smtpPreset?: string;
  // ── Marketing Email Config ────────────────────────────
  marketingSubject?: string;
  marketingBody?: string;
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
  outreachChannel?: 'gmail' | 'whatsapp' | 'coldcall' | 'jiji' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'sms' | 'multichannel';
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
  emailProvider?: 'gmail' | 'resend' | 'brevo' | 'smtp' | 'sendgrid';
  whatsappProvider?: 'cloud' | 'evolution' | 'whapi' | 'baileys';
  resendApiKey?: string;
  resendFromEmail?: string;
  brevoApiKey?: string;
  brevoSenderName?: string;
  brevoSenderEmail?: string;
  evolutionApiUrl?: string;
  evolutionApiKey?: string;
  evolutionInstanceName?: string;
  whapiToken?: string;

  // ── SMTP Outreach Configuration ─────────────────────────
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom?: string;
  smtpSenderName?: string;

  // ── SendGrid Outreach Configuration ─────────────────────
  sendgridApiKey?: string;
  sendgridFromEmail?: string;
  sendgridSenderName?: string;

  // ── Local Baileys WhatsApp Service ──────────────────────
  whatsappBaileysUrl?: string;

  // ── Claiming / Payments ────────────────────────────────
  paystackPublicKey?: string;
  paystackSecretKey?: string;
  claimFeeNGN?: number;
  moniepointBankName?: string;
  moniepointAccountNumber?: string;
  moniepointAccountName?: string;
  moniepointSecretKey?: string;
  opayBankName?: string;
  opayAccountNumber?: string;
  opayAccountName?: string;
  opaySecretKey?: string;

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
  geminiApiKeys?: string[];
  claudeApiKey?: string;
  openaiApiKey?: string;
  anthropicApiKey?: string;
  cohereApiKey?: string;
  mistralApiKey?: string;
  // Antigravity model credentials
  antigravityApiKey?: string;
  antigravityModels?: string[]; // e.g., ['gemini_flash_high','gemini_pro_low','gpt_oss','claude','sonneta','opus']
  // ── On‑ground mode flag ────────────────────────────────────
  onGroundMode?: boolean;

  // ── Remote Browser WebSocket (Browserless.io / proxy browser) ────
  // When set, all Puppeteer scrapers connect to this remote endpoint
  // instead of launching a local Chromium. Required on Vercel (AL2023)
  // which is missing system-level Chromium shared libraries (libnss3.so).
  remoteBrowserWs?: string;
  scraperProxy?: string;

  n8nWebhookUrl?: string;
  minReviews?: number;
  minRating?: number;
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
    // Marketing Email defaults
    marketingSubject: '',
    marketingBody: '',
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

  // SMTP Settings
  smtpHost: '',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
  smtpFrom: '',
  smtpSenderName: 'ApexReach',
  // ── SMTP Preset Default ─────────────────────────────────────
  smtpPreset: 'custom',

  // SendGrid Settings
  sendgridApiKey: '',
  sendgridFromEmail: '',
  sendgridSenderName: 'ApexReach',

  // Baileys Settings
  whatsappBaileysUrl: 'http://localhost:3006',

  // Claiming / Payments Defaults
  paystackPublicKey: '',
  paystackSecretKey: '',
  claimFeeNGN: 0,
  moniepointBankName: 'Moniepoint Microfinance Bank',
  moniepointAccountNumber: '',
  moniepointAccountName: '',
  moniepointSecretKey: '',
  opayBankName: 'OPay Digital Services (Merchant)',
  opayAccountNumber: '',
  opayAccountName: '',
  opaySecretKey: '',

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
  antigravityApiKey: '',
  antigravityModels: [],
  onGroundMode: false,
  geminiApiKey: '',
  remoteBrowserWs: '',
  scraperProxy: '',
  n8nWebhookUrl: '',
  minReviews: 1,
  minRating: 3.0,
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
    // Marketing Email
    marketingSubject: process.env.MARKETING_SUBJECT || fileConfig.marketingSubject || DEFAULT_CONFIG.marketingSubject,
    marketingBody: process.env.MARKETING_BODY || fileConfig.marketingBody || DEFAULT_CONFIG.marketingBody,
    // Google data tools
    googleSpreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || fileConfig.googleSpreadsheetId || DEFAULT_CONFIG.googleSpreadsheetId,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || fileConfig.googlePlacesApiKey || DEFAULT_CONFIG.googlePlacesApiKey,
    // Outreach
    dryRun: process.env.DRY_RUN !== 'false' && (process.env.DRY_RUN === 'true' || fileConfig.dryRun !== false),
    businessSignature: process.env.BUSINESS_SIGNATURE || fileConfig.businessSignature || DEFAULT_CONFIG.businessSignature,
    outreachChannel: (process.env.OUTREACH_CHANNEL as any) || fileConfig.outreachChannel || DEFAULT_CONFIG.outreachChannel,
    
    // Alternative Outreach
    emailProvider: (process.env.EMAIL_PROVIDER as any) || fileConfig.emailProvider || DEFAULT_CONFIG.emailProvider,
    smtpPreset: process.env.SMTP_PRESET || fileConfig.smtpPreset || DEFAULT_CONFIG.smtpPreset,
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

    // SMTP Settings
    smtpHost: process.env.SMTP_HOST || fileConfig.smtpHost || DEFAULT_CONFIG.smtpHost,
    smtpPort: Number(process.env.SMTP_PORT) || Number(fileConfig.smtpPort) || DEFAULT_CONFIG.smtpPort,
    smtpSecure: process.env.SMTP_SECURE === 'true' || fileConfig.smtpSecure || DEFAULT_CONFIG.smtpSecure,
    smtpUser: process.env.SMTP_USER || fileConfig.smtpUser || DEFAULT_CONFIG.smtpUser,
    smtpPass: process.env.SMTP_PASS || fileConfig.smtpPass || DEFAULT_CONFIG.smtpPass,
    smtpFrom: process.env.SMTP_FROM || fileConfig.smtpFrom || DEFAULT_CONFIG.smtpFrom,
    smtpSenderName: process.env.SMTP_SENDER_NAME || fileConfig.smtpSenderName || DEFAULT_CONFIG.smtpSenderName,

    // SendGrid Settings
    sendgridApiKey: process.env.SENDGRID_API_KEY || fileConfig.sendgridApiKey || DEFAULT_CONFIG.sendgridApiKey,
    sendgridFromEmail: process.env.SENDGRID_FROM_EMAIL || fileConfig.sendgridFromEmail || DEFAULT_CONFIG.sendgridFromEmail,
    sendgridSenderName: process.env.SENDGRID_SENDER_NAME || fileConfig.sendgridSenderName || DEFAULT_CONFIG.sendgridSenderName,

    // Baileys Settings
    whatsappBaileysUrl: process.env.WHATSAPP_BAILEYS_URL || fileConfig.whatsappBaileysUrl || DEFAULT_CONFIG.whatsappBaileysUrl,

    // Claiming / Payments
    paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || fileConfig.paystackPublicKey || DEFAULT_CONFIG.paystackPublicKey,
    paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || fileConfig.paystackSecretKey || DEFAULT_CONFIG.paystackSecretKey,
    claimFeeNGN: Number(process.env.CLAIM_FEE_NGN) || (fileConfig.claimFeeNGN !== undefined ? Number(fileConfig.claimFeeNGN) : DEFAULT_CONFIG.claimFeeNGN),
    moniepointBankName: process.env.MONIEPOINT_BANK_NAME || fileConfig.moniepointBankName || DEFAULT_CONFIG.moniepointBankName,
    moniepointAccountNumber: process.env.MONIEPOINT_ACCOUNT_NUMBER || fileConfig.moniepointAccountNumber || DEFAULT_CONFIG.moniepointAccountNumber,
    moniepointAccountName: process.env.MONIEPOINT_ACCOUNT_NAME || fileConfig.moniepointAccountName || DEFAULT_CONFIG.moniepointAccountName,
    moniepointSecretKey: process.env.MONIEPOINT_SECRET_KEY || fileConfig.moniepointSecretKey || DEFAULT_CONFIG.moniepointSecretKey,
    opayBankName: process.env.OPAY_BANK_NAME || fileConfig.opayBankName || DEFAULT_CONFIG.opayBankName,
    opayAccountNumber: process.env.OPAY_ACCOUNT_NUMBER || fileConfig.opayAccountNumber || DEFAULT_CONFIG.opayAccountNumber,
    opayAccountName: process.env.OPAY_ACCOUNT_NAME || fileConfig.opayAccountName || DEFAULT_CONFIG.opayAccountName,
    opaySecretKey: process.env.OPAY_SECRET_KEY || fileConfig.opaySecretKey || DEFAULT_CONFIG.opaySecretKey,

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
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || fileConfig.geminiApiKey || DEFAULT_CONFIG.geminiApiKey,
    remoteBrowserWs: process.env.REMOTE_BROWSER_WS || process.env.BROWSERLESS_WS || fileConfig.remoteBrowserWs || DEFAULT_CONFIG.remoteBrowserWs,
    scraperProxy: process.env.SCRAPER_PROXY || fileConfig.scraperProxy || DEFAULT_CONFIG.scraperProxy,
    n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || fileConfig.n8nWebhookUrl || DEFAULT_CONFIG.n8nWebhookUrl,
    minReviews: process.env.MIN_REVIEWS !== undefined ? Number(process.env.MIN_REVIEWS) : (fileConfig.minReviews !== undefined ? Number(fileConfig.minReviews) : DEFAULT_CONFIG.minReviews),
    minRating: process.env.MIN_RATING !== undefined ? Number(process.env.MIN_RATING) : (fileConfig.minRating !== undefined ? Number(fileConfig.minRating) : DEFAULT_CONFIG.minRating),
    storageMode: (process.env.STORAGE_MODE as StorageMode) || fileConfig.storageMode || DEFAULT_CONFIG.storageMode,
  };

  return merged;
}

export function getLocalConfig(): RuntimeConfig {
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

      // SMTP Settings
      smtpHost: updated.smtpHost,
      smtpPort: updated.smtpPort,
      smtpSecure: updated.smtpSecure,
      smtpUser: updated.smtpUser,
      smtpPass: updated.smtpPass,
      smtpFrom: updated.smtpFrom,
      smtpSenderName: updated.smtpSenderName,
      // SMTP Preset
      smtpPreset: updated.smtpPreset,

      // SendGrid Settings
      sendgridApiKey: updated.sendgridApiKey,
      sendgridFromEmail: updated.sendgridFromEmail,
      sendgridSenderName: updated.sendgridSenderName,

      // Baileys Settings
      whatsappBaileysUrl: updated.whatsappBaileysUrl,

      // Claiming / Payments
      paystackPublicKey: updated.paystackPublicKey,
      paystackSecretKey: updated.paystackSecretKey,
      claimFeeNGN: updated.claimFeeNGN,
      moniepointBankName: updated.moniepointBankName,
      moniepointAccountNumber: updated.moniepointAccountNumber,
      moniepointAccountName: updated.moniepointAccountName,
      moniepointSecretKey: updated.moniepointSecretKey,
      opayBankName: updated.opayBankName,
      opayAccountNumber: updated.opayAccountNumber,
      opayAccountName: updated.opayAccountName,
      opaySecretKey: updated.opaySecretKey,

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
      remoteBrowserWs: updated.remoteBrowserWs,
      scraperProxy: updated.scraperProxy,
      n8nWebhookUrl: updated.n8nWebhookUrl,
      minReviews: updated.minReviews,
      minRating: updated.minRating,
      storageMode: updated.storageMode,
    };
    
    fs.writeFileSync(WRITEABLE_CONFIG_FILE_PATH, JSON.stringify(fileData, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.error('Error writing local config:', e);
    throw e;
  }
}

/**
 * Resolves a comma-separated key string to a single key, randomly rotated.
 */
export function rotateKey(value: string | undefined): string {
  if (!value) return '';
  if (value.includes(',')) {
    const keys = value.split(',').map(k => k.trim()).filter(Boolean);
    if (keys.length > 0) {
      return keys[Math.floor(Math.random() * keys.length)];
    }
  }
  return value.trim();
}

/**
 * Resolves corresponding public and secret keys from rotated comma-separated lists.
 * It uses a consistent index or random index but selected once per request/outreach transaction.
 */
export function getRotatedPaystackKeys(publicKeysStr: string | undefined, secretKeysStr: string | undefined): { publicKey: string, secretKey: string } {
  if (!publicKeysStr) return { publicKey: '', secretKey: '' };
  
  const pubList = publicKeysStr.split(',').map(k => k.trim()).filter(Boolean);
  const secList = (secretKeysStr || '').split(',').map(k => k.trim()).filter(Boolean);
  
  if (pubList.length === 0) return { publicKey: '', secretKey: '' };
  
  // Pick a random index
  const index = Math.floor(Math.random() * pubList.length);
  const publicKey = pubList[index];
  // Match with secret key at same index, or fall back to the first secret key or empty
  const secretKey = secList[index] || secList[0] || '';
  
  return { publicKey, secretKey };
}

/**
 * Resolves the matching secret key from the rotated list for a given public key.
 */
export function getMatchingSecretKey(publicKey: string | undefined): string {
  const config = getRuntimeConfig();
  const pubList = (config.paystackPublicKey || '').split(',').map(k => k.trim()).filter(Boolean);
  const secList = (config.paystackSecretKey || '').split(',').map(k => k.trim()).filter(Boolean);
  
  if (!publicKey) return secList[0] || '';
  
  const index = pubList.indexOf(publicKey.trim());
  if (index !== -1 && secList[index]) {
    return secList[index];
  }
  
  // fallback to first key
  return secList[0] || '';
}

/**
 * Resolves corresponding twilio Account SID, Auth Token and From Number from rotated lists.
 */
export function getRotatedTwilioKeys(sidStr: string | undefined, tokenStr: string | undefined, fromStr: string | undefined): { accountSid: string, authToken: string, fromNumber: string } {
  if (!sidStr) return { accountSid: '', authToken: '', fromNumber: '' };
  
  const sids = sidStr.split(',').map(s => s.trim()).filter(Boolean);
  const tokens = (tokenStr || '').split(',').map(s => s.trim()).filter(Boolean);
  const froms = (fromStr || '').split(',').map(s => s.trim()).filter(Boolean);
  
  if (sids.length === 0) return { accountSid: '', authToken: '', fromNumber: '' };
  
  const index = Math.floor(Math.random() * sids.length);
  return {
    accountSid: sids[index] || '',
    authToken: tokens[index] || tokens[0] || '',
    fromNumber: froms[index] || froms[0] || ''
  };
}



