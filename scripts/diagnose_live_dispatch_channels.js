/**
 * @file scripts/diagnose_live_dispatch_channels.js
 * 
 * Comprehensive Forensic Health & Connectivity Audit of All 3 Outreach Channels:
 * 1. WhatsApp: Contabo VPS (169.58.182.92:8080) Evolution API & Instance Health
 * 2. GSM SMS: Termii Cloud API + Android GSM Gateway Connectivity
 * 3. Email: Hostinger Direct SMTP (smtp.hostinger.com:465) Authentication & Delivery
 */

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = process.cwd();
require('dotenv').config({ path: path.join(ROOT_DIR, '.env') });
require('dotenv').config({ path: path.join(ROOT_DIR, '.env.local') });

async function checkWhatsApp() {
  console.log('\n============================================================');
  console.log('1. AUDITING WHATSAPP GATEWAY (Contabo VPS 169.58.182.92:8080)');
  console.log('============================================================');

  const vpsUrl = process.env.EVOLUTION_SEND_URL || 'http://169.58.182.92:8080/send';
  const apiKey = process.env.EVOLUTION_API_KEY || 'evolution_bethelmind_secret_2026';

  console.log(`Target URL : ${vpsUrl}`);
  console.log(`API Key    : ${apiKey.substring(0, 8)}...`);

  // Probe 1: Ping base URL http://169.58.182.92:8080/
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const pingRes = await fetch('http://169.58.182.92:8080/', { signal: controller.signal });
    clearTimeout(timeout);
    console.log(`Base URL HTTP Status: ${pingRes.status} ${pingRes.statusText}`);
    const pingText = await pingRes.text().catch(() => '');
    console.log(`Base URL Response: ${pingText.slice(0, 150)}`);
  } catch (err) {
    console.log(`⚠️ Base URL Probe Failed: ${err.message}`);
  }

  // Probe 2: Ping /send endpoint or /instances endpoint
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(vpsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        phone: '2348022791227', // Admin closer desk
        message: '🧪 Bethelmind Forensic Channel Diagnostic Probe.',
        isColdOutreach: false,
        lineId: 1
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    console.log(`WhatsApp /send HTTP Status: ${res.status}`);
    console.log('WhatsApp /send Response Body:', data);
    return { online: res.status >= 200 && res.status < 400, status: res.status, data };
  } catch (err) {
    console.log(`❌ WhatsApp /send Probe Failed: ${err.message}`);
    return { online: false, error: err.message };
  }
}

async function checkSms() {
  console.log('\n============================================================');
  console.log('2. AUDITING GSM SMS GATEWAYS (Termii Cloud API & Android Gateway)');
  console.log('============================================================');

  // Check Termii API
  const termiiKey = process.env.TERMII_API_KEY || 'tlv_HilsNNhBaQtzgLkf0nyq1Maie3kfr27xDYW2_d-JD6M';
  console.log(`Termii API Key: ${termiiKey.substring(0, 10)}...`);

  let termiiResult = { online: false };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(`https://api.ng.termii.com/api/get-balance?api_key=${termiiKey}`, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json().catch(() => ({}));
    console.log(`Termii Balance HTTP Status: ${res.status}`);
    console.log('Termii Balance Data:', data);
    termiiResult = { online: res.status === 200, balance: data.balance, currency: data.currency, raw: data };
  } catch (err) {
    console.log(`❌ Termii Balance Check Failed: ${err.message}`);
    termiiResult = { online: false, error: err.message };
  }

  // Check Local / Tailscale Android SMS Gateway candidates
  const candidates = [
    'http://100.107.243.108:8082',
    'http://10.132.90.251:8082',
    'http://169.58.182.92:8082'
  ];
  let androidResult = { online: false };
  for (const url of candidates) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      console.log(`Android Gateway (${url}) Status: ${res.status}`);
      if (res.status >= 200 && res.status < 500) {
        androidResult = { online: true, url, status: res.status };
        break;
      }
    } catch (err) {
      console.log(`Android Gateway (${url}) Unreachable: ${err.message}`);
    }
  }

  return { termii: termiiResult, android: androidResult };
}

async function checkEmail() {
  console.log('\n============================================================');
  console.log('3. AUDITING CORPORATE B2B EMAIL (Hostinger SMTP: smtp.hostinger.com:465)');
  console.log('============================================================');

  const host = process.env.SMTP_HOST || 'smtp.hostinger.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER || 'tosin@bethelmindanalytics.com';
  const pass = process.env.SMTP_PASS;

  console.log(`SMTP Host : ${host}:${port}`);
  console.log(`SMTP User : ${user}`);
  console.log(`Password  : ${pass ? '[Configured in environment]' : '[MISSING]'}`);

  if (!pass) {
    console.log('❌ SMTP_PASS is missing in local environment. Checking Brevo fallback...');
    const brevoKey = process.env.BREVO_API_KEY;
    console.log(`Brevo API Key: ${brevoKey ? `${brevoKey.substring(0, 10)}...` : '[MISSING]'}`);
    return { smtpOnline: false, reason: 'SMTP_PASS missing' };
  }

  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
      socketTimeout: 8000
    });

    console.log('Verifying SMTP connection credentials...');
    await transporter.verify();
    console.log('✅ Hostinger SMTP Connection Verified Successfully! Credentials are valid.');
    return { smtpOnline: true, user, host };
  } catch (err) {
    console.log(`❌ Hostinger SMTP Verification Failed: ${err.message}`);
    return { smtpOnline: false, error: err.message };
  }
}

async function run() {
  console.log('🔍 COMMENCING LIVE MULTI-CHANNEL DISPATCH FORENSIC AUDIT...');
  const wa = await checkWhatsApp();
  const sms = await checkSms();
  const email = await checkEmail();

  console.log('\n============================================================');
  console.log('SUMMARY AUDIT REPORT');
  console.log('============================================================');
  console.log(`1. WhatsApp (Contabo VPS) : ${wa.online ? '✅ ONLINE' : '❌ OFFLINE / UNREACHABLE'}`);
  console.log(`2. GSM SMS (Termii Cloud) : ${sms.termii.online ? `✅ ONLINE (Balance: ₦${sms.termii.balance || 0})` : '❌ OFFLINE'}`);
  console.log(`   GSM SMS (Android SIM)  : ${sms.android.online ? `✅ ONLINE (${sms.android.url})` : '❌ OFFLINE'}`);
  console.log(`3. Email (Hostinger SMTP) : ${email.smtpOnline ? '✅ ONLINE & AUTHENTICATED' : '❌ OFFLINE / CONFIG ISSUE'}`);
}

run().catch(e => console.error('Fatal audit failure:', e));
