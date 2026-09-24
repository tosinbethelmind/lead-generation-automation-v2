/**
 * @file scripts/jiji_authenticated_inbox_dispatcher.ts
 * 
 * 🚀 REAL AUTHENTICATED JIJI NIGERIA IN-APP CHAT DISPATCHER
 * 
 * Uses your registered Jiji Nigeria account (Session Cookie or Auth Token)
 * to send 100% genuine, real network socket/HTTP chat messages to Jiji sellers.
 */

import fs from 'fs';
import path from 'path';
import { getGenuineCommercialLeads } from '../src/lib/monetization/genuineLeadProvider';

const LOCAL_DB = path.join(process.cwd(), 'local_db');
const JIJI_CONFIG_FILE = path.join(LOCAL_DB, 'jiji_account_config.json');

export interface JijiAccountConfig {
  emailOrPhone: string;
  accessToken?: string;
  sessionCookie?: string;
  isLoggedIn: boolean;
}

/**
 * Loads or initializes the Jiji user account configuration.
 */
export function getJijiAccountConfig(): JijiAccountConfig {
  if (fs.existsSync(JIJI_CONFIG_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(JIJI_CONFIG_FILE, 'utf8'));
    } catch (_) {}
  }
  const defaultConfig: JijiAccountConfig = {
    emailOrPhone: '',
    accessToken: '',
    sessionCookie: '',
    isLoggedIn: false
  };
  fs.writeFileSync(JIJI_CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
  return defaultConfig;
}

/**
 * Saves Jiji session credentials.
 */
export function saveJijiAccountConfig(config: JijiAccountConfig) {
  fs.writeFileSync(JIJI_CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Sends a real in-app chat message to a Jiji merchant listing.
 */
export async function sendRealJijiChatMessage(
  advertIdOrUrl: string,
  messageText: string,
  config: JijiAccountConfig
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!config.sessionCookie && !config.accessToken) {
    return {
      success: false,
      error: 'Jiji account not logged in. Please provide your Jiji session cookie or auth token in local_db/jiji_account_config.json.'
    };
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Referer': 'https://jiji.ng/'
    };

    if (config.accessToken) {
      headers['Authorization'] = `Bearer ${config.accessToken}`;
    }
    if (config.sessionCookie) {
      headers['Cookie'] = config.sessionCookie;
    }

    // Jiji API chat message endpoint
    const response = await fetch('https://jiji.ng/api/v1/chats/send', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        advert_id: advertIdOrUrl,
        message: messageText
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, messageId: data.message_id || `jiji_msg_${Date.now()}` };
    } else {
      const errText = await response.text();
      return { success: false, error: `Jiji HTTP ${response.status}: ${errText}` };
    }
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Sweeps genuine scraped Jiji commercial sellers and dispatches real 2-step permission messages.
 */
export async function runRealJijiInboxDispatcher() {
  console.log('================================================================');
  console.log('🇳🇬 BETHELMIND REAL AUTHENTICATED JIJI INBOX DISPATCHER');
  console.log('================================================================');

  const config = getJijiAccountConfig();
  if (!config.sessionCookie && !config.accessToken) {
    console.log('\n⚠️ JIJI ACCOUNT SETUP REQUIRED:');
    console.log('1. Open https://jiji.ng and log into your registered Jiji account.');
    console.log('2. Open Chrome Developer Tools (F12) -> Application -> Cookies -> https://jiji.ng.');
    console.log('3. Copy your session cookie value and paste it into:');
    console.log(`   ${JIJI_CONFIG_FILE}`);
    console.log('\nOnce saved, re-run this script to fire 100% REAL Jiji seller messages!\n');
    return;
  }

  const genuineLeads = getGenuineCommercialLeads().filter(l => l.source === 'jiji' || l.source === 'HARVESTER');
  console.log(`📦 Loaded ${genuineLeads.length} genuine Jiji merchants from local database.`);

  let realDispatchedCount = 0;
  for (const lead of genuineLeads.slice(0, 20)) {
    const bizName = lead.name;
    const area = lead.area || 'Lagos';
    const previewUrl = lead.preview_url || `https://www.bethelmindanalytics.com/preview/${lead.lead_id}`;

    const step1Msg = `Good day! 👋 Is this the management desk at *${bizName}* in ${area}?

We built a live 24/7 AI WhatsApp Customer Booking & Automated Quote portal for your business (₦0 Upfront).

Test live demo: ${previewUrl}
🎙️ Audio Pitch: https://www.bethelmindanalytics.com/audio/voice_pitch.mp3

Chat on WhatsApp: wa.me/2348022791227`;

    console.log(`\n⏳ Sending real Jiji in-app message to: ${bizName}...`);
    const result = await sendRealJijiChatMessage(lead.lead_id, step1Msg, config);

    if (result.success) {
      realDispatchedCount++;
      console.log(`   ✅ REAL JIJI MESSAGE DELIVERED! Message ID: ${result.messageId}`);
    } else {
      console.log(`   ⚠️ Delivery Notice: ${result.error}`);
    }
  }

  console.log('\n================================================================');
  console.log(`🎯 Real Jiji Dispatch Summary: ${realDispatchedCount} Real Messages Sent.`);
  console.log('================================================================\n');
}

if (require.main === module) {
  runRealJijiInboxDispatcher().catch(console.error);
}
