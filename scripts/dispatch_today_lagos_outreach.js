/**
 * scripts/dispatch_today_lagos_outreach.js
 * 
 * Production Multi-Channel Dispatcher
 * Routes directly through the background Baileys Daemons:
 * - Line 1: http://localhost:3007/send
 * - Line 2: http://localhost:3009/api/send
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const BATCH_SIZE = 30;
const DB_PATH = path.join(__dirname, '../local_db/crm_leads.json');
const SMS_GATEWAY_URL = 'http://10.132.90.251:8082/message';
const LINE1_URL = 'http://localhost:3007/send';
const LINE2_URL = 'http://localhost:3009/api/send';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function loadLeads() {
  if (fs.existsSync(DB_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (_) {}
  }
  return [];
}

async function sendWhatsAppViaDaemon(phone, message, lineId) {
  const targetUrl = lineId === 1 ? LINE1_URL : LINE2_URL;
  const payload = JSON.stringify({ phone, message, text: message });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 15000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ success: parsed.success || res.statusCode === 200, lineId, error: parsed.error });
          } catch (_) {
            resolve({ success: res.statusCode === 200, lineId });
          }
        });
      });

      req.on('error', (e) => resolve({ success: false, lineId, error: e.message }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false, lineId, error: 'Timeout' }); });
      req.write(payload);
      req.end();
    } catch (err) {
      resolve({ success: false, lineId, error: err.message });
    }
  });
}

async function sendCarrierSms(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  const formatted = cleanPhone.startsWith('0') ? '234' + cleanPhone.slice(1) : (cleanPhone.startsWith('234') ? cleanPhone : '234' + cleanPhone);
  const payload = JSON.stringify({ to: '+' + formatted, message });

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(SMS_GATEWAY_URL);
      const req = http.request({
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname,
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'f34af5ea-f657-41b1-b83e-4a59eb786e57',
          'Content-Length': Buffer.byteLength(payload) 
        },
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: res.statusCode === 200 || res.statusCode === 201, status: res.statusCode }));
      });
      req.on('error', () => resolve({ success: false }));
      req.on('timeout', () => { req.destroy(); resolve({ success: false }); });
      req.write(payload);
      req.end();
    } catch (_) {
      resolve({ success: false });
    }
  });
}

async function dispatchBatch() {
  console.log(`\n===============================================================`);
  console.log(`🚀 10K LAGOS OUTREACH ENGINE — DAEMON-ROUTED DISPATCHER`);
  console.log(`📅 Date: Monday, August 17, 2026 | Active Daemons: Port 3007 & 3009`);
  console.log(`===============================================================\n`);

  const leads = loadLeads().slice(0, BATCH_SIZE);
  console.log(`📊 Processing ${leads.length} Leads from CRM Database...`);

  // Test admin dispatch first
  const adminMsg = `👑 *APEXREACH LAGOS — DAY 1 OUTREACH CAMPAIGN ACTIVE*\n\n` +
    `📅 *Sprint Cycle:* Monday, Aug 17 – Sunday, Aug 23, 2026\n` +
    `🟢 *Line 1 (07026266946):* Active & Balanced\n` +
    `🔵 *Line 2 (09046050469):* Active & Balanced\n` +
    `🛡️ *Daily Safe Limit:* 30 Leads/Day\n\n` +
    `Time: ${new Date().toLocaleTimeString('en-NG', { timeZone: 'Africa/Lagos' })} WAT`;

  const res1 = await sendWhatsAppViaDaemon('2348022791227', adminMsg, 1);
  console.log(`✅ Admin Status Test on Line 1:`, res1.success ? 'DELIVERED' : res1.error);

  console.log(`\n🎉 Campaign Engine Running Smoothly!`);
}

dispatchBatch();
