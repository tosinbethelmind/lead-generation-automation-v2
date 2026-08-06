'use client';

import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Building2, Copy, MessageSquare, Plus, Minus } from 'lucide-react';
import { MODULAR_FEATURES_CATALOG, calculateCustomFeatureSelection, formatCustomFeatureWhatsAppRequest } from '@/lib/featureCustomizer';

interface SelectiveFeaturePickerModalProps {
  businessName: string;
  clientPhone?: string;
  leadId?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function SelectiveFeaturePickerModal({
  businessName = 'My Business Website',
  clientPhone = '08012345678',
  leadId = 'lead_123',
  isOpen = true,
  onClose,
}: SelectiveFeaturePickerModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'feature_lead_harvester',
    'feature_customer_ai_agent',
    'feature_whatsapp_voice_notes',
  ]);
  const [copied, setCopied] = useState(false);

  const calc = calculateCustomFeatureSelection(selectedIds);
  const waRequest = formatCustomFeatureWhatsAppRequest({
    businessName,
    leadId,
    selectedIds,
    clientPhone,
  });

  const toggleFeature = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) return; // Keep at least 1 feature selected
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('7034297995');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid #3b82f6',
        borderRadius: '20px',
        padding: '24px',
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#ffffff',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
        fontFamily: 'Outfit, system-ui, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
              ⚙️ Custom Selective Feature Picker
            </h2>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Pick & choose exact features for <strong>{businessName}</strong>. Pay only for what you need!
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>
              ✕
            </button>
          )}
        </div>

        {/* Feature Checkboxes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {MODULAR_FEATURES_CATALOG.map(feat => {
            const isSelected = selectedIds.includes(feat.id);
            return (
              <div
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                style={{
                  background: isSelected ? 'rgba(59, 130, 246, 0.12)' : '#1e293b',
                  border: isSelected ? '1.5px solid #3b82f6' : '1px solid #334155',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    fontSize: '20px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isSelected ? '#3b82f6' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {feat.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#ffffff' }}>
                      {feat.name}
                    </h4>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                      {feat.description}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#60a5fa' : '#cbd5e1' }}>
                    ₦{feat.setupPriceNGN.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    +₦{feat.monthlyRenewalNGN.toLocaleString()}/mo
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pricing Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          border: '1px solid #4338ca',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Selected Features Count:</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>{calc.selectedFeatures.length} Features</span>
          </div>

          {calc.discountAppliedPercentage > 0 && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '12px',
              color: '#34d399',
              fontWeight: 700,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Sparkles size={14} />
              🎉 15% Multi-Feature Bundle Discount Applied!
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #312e81', paddingTop: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Custom One-Time Setup</span>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#10b981' }}>
                ₦{calc.finalSetupNGN.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Monthly Renewal</span>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>
                ₦{calc.finalMonthlyNGN.toLocaleString()}/mo
              </div>
            </div>
          </div>
        </div>

        {/* OPay Bank Transfer Box */}
        <div style={{
          background: '#1e293b',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '16px',
          border: '1px solid #334155',
        }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
            Transfer <strong>₦{calc.finalSetupNGN.toLocaleString()}</strong> to OPay Bank:
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>OPay Digital Services</span>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>7034297995</div>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Oyelakin Tosin Matthew</span>
            </div>
            <button
              onClick={handleCopyAccount}
              style={{
                background: copied ? '#10b981' : '#334155',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* WhatsApp Submit Button */}
        <a
          href={waRequest.waUrl}
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
          }}
        >
          <MessageSquare size={18} />
          Submit Selection & Send OPay Receipt on WhatsApp
        </a>
      </div>
    </div>
  );
}
