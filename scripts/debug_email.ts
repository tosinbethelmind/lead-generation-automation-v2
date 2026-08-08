import path from 'path';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { getRuntimeConfig } from '../src/lib/localConfig';

async function testEmailDebug() {
  console.log('====================================================');
  console.log('🔍 DEBUG SMTP EMAIL DISPATCH');
  console.log('====================================================');

  const config = getRuntimeConfig();
  console.log('SMTP Host:', config.smtpHost);
  console.log('SMTP Port:', config.smtpPort);
  console.log('SMTP Secure:', config.smtpSecure);
  console.log('SMTP User:', config.smtpUser);
  console.log('SMTP From:', config.smtpFrom);

  const transporter = nodemailer.createTransport({
    host: config.smtpHost || 'smtp.hostinger.com',
    port: config.smtpPort || 465,
    secure: config.smtpSecure !== undefined ? config.smtpSecure : true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    debug: true,
    logger: true,
  });

  try {
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');

    console.log('Sending test email to BETHELMINDRECRUIT@GMAIL.COM...');
    const info = await transporter.sendMail({
      from: `"${config.smtpSenderName || 'Bethelmind Analytics'}" <${config.smtpFrom || config.smtpUser}>`,
      to: 'BETHELMINDRECRUIT@GMAIL.COM',
      subject: '🔴 TEST DISPATCH - Bethelmind Analytics System Test',
      text: 'Hello,\n\nThis is a live test email from your Bethelmind Analytics Lead Engine.\n\nIf you receive this, your email dispatch pipeline is 100% operational!\n\nBest regards,\nBethelmind Team',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <h2 style="color: #2563eb;">🚀 Bethelmind Analytics - Live Outreach Verification</h2>
          <p>Hello,</p>
          <p>This is a live system verification email from your <strong>ApexReach / Bethelmind Lead Engine</strong>.</p>
          <p>Your outreach engine is active and configured!</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280;">Sent via Hostinger SMTP (${config.smtpUser})</p>
        </div>
      `
    });

    console.log('====================================================');
    console.log('RESULT SUMMARY:');
    console.log('Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('Response from SMTP Server:', info.response);
    console.log('====================================================');
  } catch (err: any) {
    console.error('❌ SMTP Error:', err);
  }
}

testEmailDebug();
