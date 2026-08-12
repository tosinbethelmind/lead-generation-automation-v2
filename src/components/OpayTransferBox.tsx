'use client';

import React, { useState } from 'react';
import { Building2, Copy, Check, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface OpayTransferBoxProps {
  businessName: string;
  leadId?: string;
  setupPriceNGN?: number;
  monthlyRenewalNGN?: number;
  adminWhatsAppPhone?: string;
}

export function OpayTransferBox({
  businessName,
  leadId,
  setupPriceNGN = 185000,
  monthlyRenewalNGN = 35000,
  adminWhatsAppPhone = '2348012345678',
}: OpayTransferBoxProps) {
  const [copied, setCopied] = useState(false);
  const opayAccount = {
    bankName: 'OPay Digital Services',
    accountNumber: '7034297995',
    accountName: 'Oyelakin Tosin Matthew',
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(opayAccount.accountNumber);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const cleanPhone = adminWhatsAppPhone.replace(/\D/g, '');
  const waMsg = encodeURIComponent(
    `Hello! I just made a bank transfer to your OPay account for ${businessName}.\n\n` +
    `Amount: ₦${setupPriceNGN.toLocaleString()}\n` +
    `Package: Business Growth & AI Harvester\n` +
    `Please verify and activate my subscription!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      border: '1px solid #10b981',
      borderRadius: '16px',
      padding: '24px',
      color: '#ffffff',
      maxWidth: '480px',
      margin: '0 auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.5)',
      fontFamily: 'Outfit, system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Building2 style={{ color: '#10b981', width: '24px', height: '24px' }} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
            OPay Direct Bank Transfer
          </h3>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            🟢 Official Direct Payment Channel
          </span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px 0', lineHeight: 1.5 }}>
        To activate your AI Lead Harvester, Customer AI Care Agent, and WhatsApp Voice Notes for <strong>{businessName}</strong>, make a bank transfer to the official OPay account below:
      </p>

      {/* Pricing summary */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '12px 16px',
        marginBottom: '16px',
        border: '1px dashed #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>One-Time Setup & Activation:</span>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
            ₦{setupPriceNGN.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>Monthly Renewal:</span>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1' }}>
            ₦{monthlyRenewalNGN.toLocaleString()}/mo
          </div>
        </div>
      </div>

      {/* Account Details Box */}
      <div style={{
        background: '#1e293b',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #334155',
        marginBottom: '20px',
      }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bank Name</span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{opayAccount.bankName}</div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Name</span>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{opayAccount.accountName}</div>
        </div>

        <div>
          <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Number</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>
              {opayAccount.accountNumber}
            </span>
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#10b981' : '#334155',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Instant WhatsApp Confirmation Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          padding: '14px',
          background: '#25d366',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '15px',
          borderRadius: '12px',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
          transition: 'all 0.2s ease',
        }}
      >
        <MessageSquare size={18} />
        Send Receipt on WhatsApp for Instant Activation
      </a>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '14px',
        fontSize: '11px',
        color: '#64748b',
      }}>
        <ShieldCheck size={13} style={{ color: '#10b981' }} />
        <span>100% Guaranteed 1-Second Manual Transfer Activation</span>
      </div>
    </div>
  );
}
