const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dns = require('dns');

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

function loadConfig() {
  const configPath = path.join(__dirname, '../config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return {};
}

async function verifySMTP(host, port, secure, user, pass) {
  console.log(`🤖 Connection attempt to ${host}:${port} (SSL: ${secure})...`);
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: { user, pass },
    tls: {
      servername: 'smtp.hostinger.com',
      rejectUnauthorized: false
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  try {
    await transporter.verify();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function testSMTP() {
  const config = loadConfig();
  console.log('====================================================');
  console.log('🔍 Diagnostics: Testing Hostinger SMTP Connection...');
  console.log(`SMTP User: ${config.smtpUser}`);
  console.log('====================================================');

  if (!config.smtpUser || !config.smtpPass || config.smtpPass === 'YOUR_EMAIL_PASSWORD_HERE') {
    console.error('❌ Error: Please replace "YOUR_EMAIL_PASSWORD_HERE" with your actual password in config.json.');
    return;
  }

  const directIp = '172.65.255.143'; 

  // Attempt 1: Port 465 (SSL) with Direct IPv4
  console.log('\n[1/3] Testing Port 465 (SSL) with direct IP...');
  let result = await verifySMTP(directIp, 465, true, config.smtpUser, config.smtpPass);
  if (result.success) {
    console.log('✅ Success! Port 465 (SSL) connected perfectly.');
    updateConfig(465, true);
    return;
  }
  console.log(`❌ Failed: ${result.error}`);

  // Attempt 2: Port 587 (TLS/STARTTLS) with Direct IPv4
  console.log('\n[2/3] Testing Port 587 (TLS) with direct IP...');
  result = await verifySMTP(directIp, 587, false, config.smtpUser, config.smtpPass);
  if (result.success) {
    console.log('✅ Success! Port 587 (TLS) connected perfectly.');
    updateConfig(587, false);
    return;
  }
  console.log(`❌ Failed: ${result.error}`);

  // Attempt 3: Port 587 (TLS/STARTTLS) with DNS Domain
  console.log('\n[3/3] Testing Port 587 (TLS) with domain resolution...');
  result = await verifySMTP('smtp.hostinger.com', 587, false, config.smtpUser, config.smtpPass);
  if (result.success) {
    console.log('✅ Success! Hostname resolve on Port 587 connected perfectly.');
    updateConfig(587, false);
    return;
  }
  console.log(`❌ Failed: ${result.error}`);

  console.log('\n====================================================');
  console.log('❌ Diagnostic Summary: Could not connect to Hostinger SMTP.');
  console.log('1. Double check that your password is correct.');
  console.log('2. Verify that your email address exists and is active on Hostinger.');
  console.log('====================================================');
}

function updateConfig(port, secure) {
  const configPath = path.join(__dirname, '../config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    config.smtpPort = port;
    config.smtpSecure = secure;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log('💾 Configuration automatically updated and saved in config.json!');
  }
}

testSMTP();
