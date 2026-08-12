'use client';

import React, { useState } from 'react';
import { MessageCircle, Send, Phone, RefreshCw } from 'lucide-react';

const MESSAGE_TEMPLATES = [
  {
    id: 'claim_ready',
    label: '✅ Website is Ready — Claim It Now',
    text: (name: string) => `Hello ${name}! Your business website is now LIVE and ready for you to claim. I'm your assigned support from Bethelmind Analytics. Click the link below to verify your details and activate your domain. Reply here if you need any help!`
  },
  {
    id: 'payment_confirm',
    label: '💳 Payment Received — Activating Now',
    text: (name: string) => `Hello ${name}! We have received your payment successfully. Your website is now being activated. I will send you your live domain link within the next 24 hours. Thank you for trusting Bethelmind Analytics! 🚀`
  },
  {
    id: 'redesign_update',
    label: '🎨 Your Website Redesign is Ready',
    text: (name: string) => `Hello ${name}! Great news — your custom website redesign is complete and ready for your review! Please click the link your manager shared to view your updated website. Let me know if you'd like any adjustments!`
  },
  {
    id: 'tool_setup',
    label: '🔧 Your Booking/Chat Tool is Active',
    text: (name: string) => `Hello ${name}! Your website tool integration is now live. Your booking/chat/WhatsApp button is active and ready for customers to use. Log in to your website dashboard to see it in action!`
  },
  {
    id: 'follow_up',
    label: '📞 Follow-Up Support Check',
    text: (name: string) => `Hello ${name}! This is your support assistant from Bethelmind Analytics checking in. Is there anything you need help with regarding your website? We're here 24/7 to assist you. Just reply to this message!`
  },
];

export default function AssistantOutreachPage() {
  const [phone, setPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMsg, setCustomMsg] = useState('');


  const template = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplate);
  const messageText = template ? template.text(clientName || 'there') : customMsg;

  const handleWhatsApp = () => {
    if (!phone) return;
    const num = formatPhone(phone);
    const url = `https://wa.me/${num}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <MessageCircle style={{ width: 15, height: 15, color: '#10b981' }} />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            WhatsApp Outreach Tools
          </span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0fdf4', margin: 0 }}>
          Send Support Messages to Assigned Leads
        </h1>
        <p style={{ fontSize: '0.72rem', color: '#4b5563', margin: '4px 0 0' }}>
          Use pre-written templates or craft a custom message. Opens WhatsApp Web / Mobile directly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* LEFT — Compose */}
        <div style={{
          background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0fdf4', margin: 0 }}>
            Compose WhatsApp Message
          </h3>

          <div>
            <label style={labelStyle}>Client Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#4b5563' }} />
              <input
                id="outreach-phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="08012345678 or 2348012345678"
                style={{ ...inputStyle, paddingLeft: 36 }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Client Name (for template personalisation)</label>
            <input
              id="outreach-name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              placeholder="e.g. Mr. Adebayo"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Message Template</label>
            <select
              id="outreach-template"
              value={selectedTemplate}
              onChange={e => { setSelectedTemplate(e.target.value); setCustomMsg(''); }}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">— Select a template —</option>
              {MESSAGE_TEMPLATES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
              <option value="__custom">✏️ Write Custom Message</option>
            </select>
          </div>

          {selectedTemplate === '__custom' && (
            <div>
              <label style={labelStyle}>Custom Message</label>
              <textarea
                id="outreach-custom-msg"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                rows={4}
                placeholder="Type your message here..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          )}

          <button
            id="send-whatsapp-btn"
            onClick={handleWhatsApp}
            disabled={!phone || !messageText}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '13px', borderRadius: 10,
              background: phone && messageText ? '#25d366' : 'rgba(37,211,102,0.2)',
              border: 'none', color: '#fff',
              fontSize: '0.85rem', fontWeight: 700,
              cursor: phone && messageText ? 'pointer' : 'not-allowed',
              boxShadow: phone && messageText ? '0 4px 20px rgba(37,211,102,0.3)' : 'none'
            }}
          >
            <MessageCircle style={{ width: 16, height: 16 }} /> Open in WhatsApp
          </button>
        </div>

        {/* RIGHT — Preview */}
        <div style={{
          background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
          borderRadius: 16, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14
        }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f0fdf4', margin: 0 }}>
            Message Preview
          </h3>

          <div style={{
            flex: 1, minHeight: 200,
            background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '16px',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {messageText ? (
              <div style={{
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
                borderRadius: 10, padding: '12px 14px', fontSize: '0.82rem', color: '#bbf7d0',
                lineHeight: 1.7, maxWidth: '85%'
              }}>
                {messageText}
              </div>
            ) : (
              <div style={{ color: '#374151', fontSize: '0.78rem', textAlign: 'center', paddingTop: 60 }}>
                Select a template to preview your message.
              </div>
            )}
          </div>

          {phone && (
            <div style={{
              fontSize: '0.72rem', color: '#4b5563', background: 'rgba(0,0,0,0.3)',
              borderRadius: 8, padding: '8px 12px'
            }}>
              📱 Will open WhatsApp for: <strong style={{ color: '#4ade80' }}>+{formatPhone(phone)}</strong>
            </div>
          )}
        </div>
      </div>

      <style>{``}</style>
    </div>
  );

  function formatPhone(p: string) {
    const d = p.replace(/\D/g, '');
    if (d.startsWith('0') && d.length === 11) return '234' + d.slice(1);
    return d;
  }
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.7rem', fontWeight: 700,
  color: '#86efac', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em'
};

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(16,185,129,0.15)',
  borderRadius: 10, padding: '10px 14px',
  color: '#f0fdf4', fontSize: '0.84rem'
};
