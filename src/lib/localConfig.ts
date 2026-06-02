import fs from 'fs';
import path from 'path';

export type StorageMode = 'cloud' | 'local' | 'hybrid' | 'supabase';

export interface LocalConfig {
  googleSpreadsheetId: string;
  apifyToken: string;
  apifyDatasetId: string;
  googlePlacesApiKey: string;
  whatsappPhoneNumberId: string;
  whatsappAccessToken: string;
  whatsappTemplateName: string;
  whatsappTemplateLanguageCode: string;
  whatsappDailyCap: number;
  whatsappEnabled: boolean;
  dryRun: boolean;
  businessSignature: string;
  supabaseUrl?: string;
  supabaseKey?: string;
}

export interface RuntimeConfig extends LocalConfig {
  storageMode: StorageMode;
}

const DEFAULT_CONFIG: RuntimeConfig = {
  googleSpreadsheetId: '',
  apifyToken: '',
  apifyDatasetId: '',
  googlePlacesApiKey: '',
  whatsappPhoneNumberId: '',
  whatsappAccessToken: '',
  whatsappTemplateName: 'lead_outreach_1',
  whatsappTemplateLanguageCode: 'en_US',
  whatsappDailyCap: 50,
  whatsappEnabled: false,
  dryRun: true,
  businessSignature: 'Bethelmind Analytics',
  supabaseUrl: '',
  supabaseKey: '',
  storageMode: 'hybrid' // Auto-detect mode by default
};

const CONFIG_FILE_PATH = path.join(process.cwd(), 'config.json');

export function getRuntimeConfig(): RuntimeConfig {
  let fileConfig: Partial<LocalConfig & { storageMode: StorageMode }> = {};
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      fileConfig = JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading local config:', e);
  }

  // Precedence rule: process.env > config.json > DEFAULT_CONFIG
  const merged: RuntimeConfig = {
    googleSpreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || fileConfig.googleSpreadsheetId || DEFAULT_CONFIG.googleSpreadsheetId,
    apifyToken: process.env.APIFY_TOKEN || fileConfig.apifyToken || DEFAULT_CONFIG.apifyToken,
    apifyDatasetId: process.env.APIFY_DATASET_ID || fileConfig.apifyDatasetId || DEFAULT_CONFIG.apifyDatasetId,
    googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || fileConfig.googlePlacesApiKey || DEFAULT_CONFIG.googlePlacesApiKey,
    whatsappPhoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || fileConfig.whatsappPhoneNumberId || DEFAULT_CONFIG.whatsappPhoneNumberId,
    whatsappAccessToken: process.env.WHATSAPP_ACCESS_TOKEN || fileConfig.whatsappAccessToken || DEFAULT_CONFIG.whatsappAccessToken,
    whatsappTemplateName: process.env.WHATSAPP_TEMPLATE_NAME || fileConfig.whatsappTemplateName || DEFAULT_CONFIG.whatsappTemplateName,
    whatsappTemplateLanguageCode: process.env.WHATSAPP_TEMPLATE_LANGUAGE_CODE || fileConfig.whatsappTemplateLanguageCode || DEFAULT_CONFIG.whatsappTemplateLanguageCode,
    whatsappDailyCap: Number(process.env.WHATSAPP_DAILY_CAP) || Number(fileConfig.whatsappDailyCap) || DEFAULT_CONFIG.whatsappDailyCap,
    whatsappEnabled: process.env.WHATSAPP_ENABLED === 'true' || fileConfig.whatsappEnabled || DEFAULT_CONFIG.whatsappEnabled,
    dryRun: process.env.DRY_RUN !== 'false' && (process.env.DRY_RUN === 'true' || fileConfig.dryRun !== false),
    businessSignature: process.env.BUSINESS_SIGNATURE || fileConfig.businessSignature || DEFAULT_CONFIG.businessSignature,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || fileConfig.supabaseUrl || DEFAULT_CONFIG.supabaseUrl,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || fileConfig.supabaseKey || DEFAULT_CONFIG.supabaseKey,
    storageMode: (process.env.STORAGE_MODE as StorageMode) || fileConfig.storageMode || DEFAULT_CONFIG.storageMode
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
      googleSpreadsheetId: updated.googleSpreadsheetId,
      apifyToken: updated.apifyToken,
      apifyDatasetId: updated.apifyDatasetId,
      googlePlacesApiKey: updated.googlePlacesApiKey,
      whatsappPhoneNumberId: updated.whatsappPhoneNumberId,
      whatsappAccessToken: updated.whatsappAccessToken,
      whatsappTemplateName: updated.whatsappTemplateName,
      whatsappTemplateLanguageCode: updated.whatsappTemplateLanguageCode,
      whatsappDailyCap: updated.whatsappDailyCap,
      whatsappEnabled: updated.whatsappEnabled,
      dryRun: updated.dryRun,
      businessSignature: updated.businessSignature,
      supabaseUrl: updated.supabaseUrl,
      supabaseKey: updated.supabaseKey,
      storageMode: updated.storageMode
    };
    
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(fileData, null, 2), 'utf-8');
    return updated;
  } catch (e) {
    console.error('Error writing local config:', e);
    throw e;
  }
}
