const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_FILE_PATH = path.join(__dirname, 'config.json');

// Helper colors for CLI formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m'
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE_PATH)) {
    try {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.warn(colors.yellow + 'Warning: Could not parse existing config.json, starting fresh.' + colors.reset);
    }
  }
  return {};
}

function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config, null, 2), 'utf-8');
    console.log('\n' + colors.green + '✔ Configuration successfully saved to config.json!' + colors.reset);
  } catch (e) {
    console.error(colors.red + 'Error saving configuration: ' + e.message + colors.reset);
  }
}

async function runWizard() {
  console.log(colors.cyan + colors.bright);
  console.log('====================================================');
  console.log('       ApexReach Setup & Configuration Wizard       ');
  console.log('====================================================' + colors.reset);
  console.log('This script will guide you step-by-step through setting up your API keys and credentials.');
  console.log('Press ' + colors.bright + 'Enter' + colors.reset + ' to accept the current value in brackets if it already exists.\n');

  const currentConfig = loadConfig();
  const newConfig = { ...currentConfig };

  // ==========================================
  // Section 1: Storage & Basic Outreach
  // ==========================================
  console.log(colors.cyan + '\n--- 1. Storage & Global Outreach ---' + colors.reset);

  const storageModes = ['hybrid', 'local', 'supabase', 'cloud'];
  const currentStorage = newConfig.storageMode || 'hybrid';
  console.log(colors.gray + 'Options: "hybrid" (Sheets + fallback), "local" (JSON files), "supabase" (Database), "cloud" (Google Sheets)' + colors.reset);
  let storageMode = await question(`Select Storage Mode [${currentStorage}]: `);
  storageMode = storageMode.trim() || currentStorage;
  if (!storageModes.includes(storageMode)) {
    console.log(colors.yellow + `Invalid storage mode. Defaulting to: ${currentStorage}` + colors.reset);
    storageMode = currentStorage;
  }
  newConfig.storageMode = storageMode;

  const outreachChannels = ['gmail', 'whatsapp', 'coldcall'];
  const currentChannel = newConfig.outreachChannel || 'gmail';
  console.log(colors.gray + 'Options: "gmail" (Email Outreach), "whatsapp" (WhatsApp Outreach), "coldcall" (Twilio Voice API)' + colors.reset);
  let outreachChannel = await question(`Default Outreach Channel [${currentChannel}]: `);
  outreachChannel = outreachChannel.trim() || currentChannel;
  if (!outreachChannels.includes(outreachChannel)) {
    console.log(colors.yellow + `Invalid outreach channel. Defaulting to: ${currentChannel}` + colors.reset);
    outreachChannel = currentChannel;
  }
  newConfig.outreachChannel = outreachChannel;

  const currentDryRun = newConfig.dryRun !== undefined ? String(newConfig.dryRun).toUpperCase() : 'TRUE';
  console.log(colors.gray + 'Options: "TRUE" (Simulate campaigns without charging / sending), "FALSE" (Send live outreach)' + colors.reset);
  let dryRunInput = await question(`Enable Dry-Run (Simulation Mode) [${currentDryRun}]: `);
  dryRunInput = dryRunInput.trim().toUpperCase() || currentDryRun;
  newConfig.dryRun = dryRunInput !== 'FALSE';

  const currentSignature = newConfig.businessSignature || 'ApexReach';
  let businessSignature = await question(`Business Signature (e.g. ApexReach) [${currentSignature}]: `);
  newConfig.businessSignature = businessSignature.trim() || currentSignature;

  // ==========================================
  // Section 2: Google Sheets & Places API
  // ==========================================
  console.log(colors.cyan + '\n--- 2. Google Sheets & Places API (Scraper) ---' + colors.reset);

  console.log(colors.gray + 'How to get Sheet ID: Open your Google Sheet. Copy the long random letters/numbers in the URL between "/d/" and "/edit".' + colors.reset);
  const currentSheetId = newConfig.googleSpreadsheetId || '';
  let sheetId = await question(`Google Spreadsheet ID [${currentSheetId}]: `);
  newConfig.googleSpreadsheetId = sheetId.trim() || currentSheetId;

  console.log(colors.gray + 'How to get Google Places API Key: Enable the Places API in your Google Cloud Console (https://console.cloud.google.com/).' + colors.reset);
  const currentPlacesKey = newConfig.googlePlacesApiKey || '';
  let placesKey = await question(`Google Places API Key [${currentPlacesKey}]: `);
  newConfig.googlePlacesApiKey = placesKey.trim() || currentPlacesKey;

  // ==========================================
  // Section 3: Email Provider Selection
  // ==========================================
  console.log(colors.cyan + '\n--- 3. Email Provider Configuration ---' + colors.reset);
  const emailProviders = ['gmail', 'resend', 'brevo'];
  const currentEmailProvider = newConfig.emailProvider || 'gmail';
  console.log(colors.gray + 'Options: "gmail" (Google Workspace OAuth), "resend" (Resend.com API Key), "brevo" (Brevo.com API Key)' + colors.reset);
  let emailProvider = await question(`Select Email Provider [${currentEmailProvider}]: `);
  emailProvider = emailProvider.trim() || currentEmailProvider;
  if (!emailProviders.includes(emailProvider)) {
    console.log(colors.yellow + `Invalid email provider. Defaulting to: ${currentEmailProvider}` + colors.reset);
    emailProvider = currentEmailProvider;
  }
  newConfig.emailProvider = emailProvider;

  if (emailProvider === 'gmail') {
    console.log(colors.gray + '\nGoogle OAuth 2.0 Credentials (Set up in Google Cloud Console)' + colors.reset);
    const currentClientId = newConfig.googleClientId || '';
    let clientId = await question(`Google Client ID [${currentClientId}]: `);
    newConfig.googleClientId = clientId.trim() || currentClientId;

    const currentClientSecret = newConfig.googleClientSecret || '';
    let clientSecret = await question(`Google Client Secret [${currentClientSecret}]: `);
    newConfig.googleClientSecret = clientSecret.trim() || currentClientSecret;

    const currentProjectId = newConfig.googleProjectId || '';
    let projectId = await question(`Google Cloud Project ID (Optional) [${currentProjectId}]: `);
    newConfig.googleProjectId = projectId.trim() || currentProjectId;
  } else if (emailProvider === 'resend') {
    console.log(colors.gray + '\nResend API Key & Sender Email (Verify your domain on Resend.com)' + colors.reset);
    const currentResendKey = newConfig.resendApiKey || '';
    let resendKey = await question(`Resend API Key [${currentResendKey}]: `);
    newConfig.resendApiKey = resendKey.trim() || currentResendKey;

    const currentResendFrom = newConfig.resendFromEmail || 'onboarding@resend.dev';
    let resendFrom = await question(`Sender Email Address [${currentResendFrom}]: `);
    newConfig.resendFromEmail = resendFrom.trim() || currentResendFrom;
  } else if (emailProvider === 'brevo') {
    console.log(colors.gray + '\nBrevo SMTP API Key & Sender Details' + colors.reset);
    const currentBrevoKey = newConfig.brevoApiKey || '';
    let brevoKey = await question(`Brevo API Key [${currentBrevoKey}]: `);
    newConfig.brevoApiKey = brevoKey.trim() || currentBrevoKey;

    const currentBrevoName = newConfig.brevoSenderName || 'ApexReach';
    let brevoName = await question(`Sender Display Name [${currentBrevoName}]: `);
    newConfig.brevoSenderName = brevoName.trim() || currentBrevoName;

    const currentBrevoEmail = newConfig.brevoSenderEmail || '';
    let brevoEmail = await question(`Sender Email Address [${currentBrevoEmail}]: `);
    newConfig.brevoSenderEmail = brevoEmail.trim() || currentBrevoEmail;
  }

  // ==========================================
  // Section 4: WhatsApp Provider Selection
  // ==========================================
  console.log(colors.cyan + '\n--- 4. WhatsApp Provider Configuration ---' + colors.reset);
  const whatsappProviders = ['cloud', 'evolution', 'whapi'];
  const currentWhatsAppProvider = newConfig.whatsappProvider || 'cloud';
  console.log(colors.gray + 'Options: "cloud" (Meta Business API), "evolution" (Evolution QR Code), "whapi" (Whapi.cloud QR Code)' + colors.reset);
  let whatsappProvider = await question(`Select WhatsApp Provider [${currentWhatsAppProvider}]: `);
  whatsappProvider = whatsappProvider.trim() || currentWhatsAppProvider;
  if (!whatsappProviders.includes(whatsappProvider)) {
    console.log(colors.yellow + `Invalid WhatsApp provider. Defaulting to: ${currentWhatsAppProvider}` + colors.reset);
    whatsappProvider = currentWhatsAppProvider;
  }
  newConfig.whatsappProvider = whatsappProvider;

  if (whatsappProvider === 'cloud') {
    console.log(colors.gray + '\nMeta WhatsApp Cloud Credentials (requires Facebook Developer account)' + colors.reset);
    const currentPhoneId = newConfig.whatsappPhoneNumberId || '';
    let phoneId = await question(`WhatsApp Phone Number ID [${currentPhoneId}]: `);
    newConfig.whatsappPhoneNumberId = phoneId.trim() || currentPhoneId;

    const currentToken = newConfig.whatsappAccessToken || '';
    let token = await question(`WhatsApp Access Token [${currentToken}]: `);
    newConfig.whatsappAccessToken = token.trim() || currentToken;

    const currentTemplate = newConfig.whatsappTemplateName || 'lead_outreach_1';
    let templateName = await question(`WhatsApp Template Name [${currentTemplate}]: `);
    newConfig.whatsappTemplateName = templateName.trim() || currentTemplate;

    const currentLang = newConfig.whatsappTemplateLanguageCode || 'en_US';
    let lang = await question(`Template Language Code [${currentLang}]: `);
    newConfig.whatsappTemplateLanguageCode = lang.trim() || currentLang;
  } else if (whatsappProvider === 'evolution') {
    console.log(colors.gray + '\nEvolution API Server Details' + colors.reset);
    const currentEvolutionUrl = newConfig.evolutionApiUrl || '';
    let evolutionUrl = await question(`Evolution API Base URL (e.g. https://api.myserver.com) [${currentEvolutionUrl}]: `);
    newConfig.evolutionApiUrl = evolutionUrl.trim() || currentEvolutionUrl;

    const currentEvolutionKey = newConfig.evolutionApiKey || '';
    let evolutionKey = await question(`Evolution Instance API Key [${currentEvolutionKey}]: `);
    newConfig.evolutionApiKey = evolutionKey.trim() || currentEvolutionKey;

    const currentEvolutionInstance = newConfig.evolutionInstanceName || '';
    let evolutionInstance = await question(`Evolution Instance Name [${currentEvolutionInstance}]: `);
    newConfig.evolutionInstanceName = evolutionInstance.trim() || currentEvolutionInstance;
  } else if (whatsappProvider === 'whapi') {
    console.log(colors.gray + '\nWhapi.cloud Token' + colors.reset);
    const currentWhapiToken = newConfig.whapiToken || '';
    let whapiToken = await question(`Whapi Token [${currentWhapiToken}]: `);
    newConfig.whapiToken = whapiToken.trim() || currentWhapiToken;
  }

  // Custom text template (Evolution & Whapi)
  const currentMsgTemplate = newConfig.whatsappMessageTemplate || '';
  let msgTemplate = await question(`Custom WhatsApp Message Template (Optional) [${currentMsgTemplate}]: `);
  newConfig.whatsappMessageTemplate = msgTemplate.trim() || currentMsgTemplate;

  // ==========================================
  // Section 5: Gemini AI (Copywriting Engine)
  // ==========================================
  console.log(colors.cyan + '\n--- 5. Google Gemini API Key ---' + colors.reset);
  console.log(colors.gray + 'Go to https://aistudio.google.com/ to copy your free API key.' + colors.reset);

  const currentGeminiKey = newConfig.geminiApiKey || '';
  let geminiKey = await question(`Gemini API Key [${currentGeminiKey}]: `);
  newConfig.geminiApiKey = geminiKey.trim() || currentGeminiKey;

  // ==========================================
  // Section 6: Twilio Cold Calls (Optional)
  // ==========================================
  console.log(colors.cyan + '\n--- 6. Twilio Voice Configuration (Optional) ---' + colors.reset);
  console.log(colors.gray + 'Get these credentials from the Twilio Console (https://console.twilio.com/).' + colors.reset);

  const currentTwilioSid = newConfig.twilioAccountSid || '';
  let twilioSid = await question(`Twilio Account SID [${currentTwilioSid}]: `);
  newConfig.twilioAccountSid = twilioSid.trim() || currentTwilioSid;

  const currentTwilioAuth = newConfig.twilioAuthToken || '';
  let twilioAuth = await question(`Twilio Auth Token [${currentTwilioAuth}]: `);
  newConfig.twilioAuthToken = twilioAuth.trim() || currentTwilioAuth;

  const currentTwilioFrom = newConfig.twilioFromNumber || '';
  let twilioFrom = await question(`Twilio From Number (e.g. +1234567890) [${currentTwilioFrom}]: `);
  newConfig.twilioFromNumber = twilioFrom.trim() || currentTwilioFrom;

  const currentTwilioTemplate = newConfig.twilioCallMessageTemplate || '';
  let twilioTemplate = await question(`Twilio Speech Template [${currentTwilioTemplate || 'Default standard speech'}]: `);
  newConfig.twilioCallMessageTemplate = twilioTemplate.trim() || currentTwilioTemplate;

  // ==========================================
  // Section 7: Supabase Credentials (If selected)
  // ==========================================
  if (storageMode === 'supabase') {
    console.log(colors.cyan + '\n--- 7. Supabase Credentials ---' + colors.reset);
    console.log(colors.gray + 'Get these from your Supabase Dashboard -> Project Settings -> API.' + colors.reset);

    const currentSupaUrl = newConfig.supabaseUrl || '';
    let supaUrl = await question(`Supabase URL [${currentSupaUrl}]: `);
    newConfig.supabaseUrl = supaUrl.trim() || currentSupaUrl;

    const currentSupaKey = newConfig.supabaseKey || '';
    let supaKey = await question(`Supabase Key (Service Role Key) [${currentSupaKey}]: `);
    newConfig.supabaseKey = supaKey.trim() || currentSupaKey;
  }

  // Save changes
  saveConfig(newConfig);

  console.log('\n' + colors.cyan + '====================================================');
  console.log('  Setup complete! Run "npm run dev" to start your server.  ');
  console.log('====================================================' + colors.reset + '\n');

  rl.close();
}

runWizard();
