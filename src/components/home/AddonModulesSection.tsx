'use client';

/**
 * @file src/components/home/AddonModulesSection.tsx
 * Interactive Selectable Paid Tool Add-on Modules.
 * Allows Nigerian businesses to add high-demand integration modules to their base plan.
 */

import React, { useState } from 'react';
import { PlusCircle, CheckCircle, Zap, Sparkles } from 'lucide-react';

export interface AddonModule {
  id: string;
  name: string;
  monthlyNGN: number;
  badge: string;
  desc: string;
  icon: string;
  category: string;
}

export const ADDON_MODULES: AddonModule[] = [
  {
    id: 'virtual_nuban',
    name: 'Virtual NUBAN Auto-Reconciliation Engine',
    monthlyNGN: 10_000,
    badge: 'High Demand',
    desc: 'Generates unique Paystack/Monnify virtual bank accounts per lead to auto-verify transfers and eliminate "Fake Alerts".',
    icon: '💳',
    category: 'Payments',
  },
  {
    id: 'voice_note_ai',
    name: 'WhatsApp Voice Note (VN) AI Transcriber',
    monthlyNGN: 8_000,
    badge: 'AI Powered',
    desc: 'Uses Speech-to-Text AI to listen to Nigerian voice notes in local accents/Pidgin and generate structured auto-replies.',
    icon: '🎙️',
    category: 'AI Assistant',
  },
  {
    id: 'ig_dm_funnel',
    name: 'Instagram DM & Comment-to-WhatsApp Funnel',
    monthlyNGN: 12_000,
    badge: 'Social Sales',
    desc: 'Auto-detects IG comments ("Price?", "Location?") and transfers prospects directly into a WhatsApp sales flow.',
    icon: '📸',
    category: 'Lead Capture',
  },
  {
    id: 'b2b_lead_finder',
    name: 'Nigerian B2B Lead Extraction Engine',
    monthlyNGN: 15_000,
    badge: 'Enterprise Data',
    desc: 'Search verified decision-maker phone numbers & WhatsApp lines across Lagos, Abuja, Port Harcourt, and major commercial hubs.',
    icon: '🎯',
    category: 'Lead Mining',
  },
  {
    id: 'anti_ban_broadcast',
    name: 'Smart Anti-Ban WhatsApp Broadcast Engine',
    monthlyNGN: 10_000,
    badge: 'Compliance',
    desc: 'Throttled campaign broadcast runner with humanized delays, spin-tax message variations, and Cloud API compliance.',
    icon: '⚡',
    category: 'Marketing',
  },
  {
    id: 'firs_vat_wht_invoice',
    name: 'FIRS VAT & WHT Pro-Forma Invoice Builder',
    monthlyNGN: 5_000,
    badge: 'Tax Compliant',
    desc: 'Instantly builds PDF corporate quotes featuring CAC numbers, TIN, 7.5% VAT, and 5% Withholding Tax line items.',
    icon: '📄',
    category: 'Finance',
  },
];

export default function AddonModulesSection() {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['virtual_nuban', 'voice_note_ai']);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalAddonCost = selectedAddons.reduce((sum, id) => {
    const addon = ADDON_MODULES.find((m) => m.id === id);
    return sum + (addon ? addon.monthlyNGN : 0);
  }, 0);

  return (
    <div
      id="addon-modules"
      style={{
        marginTop: 60,
        marginBottom: 40,
        background: 'rgba(7,9,14,0.7)',
        border: '1px solid rgba(139,92,246,0.25)',
        borderRadius: 24,
        padding: 'clamp(20px, 4vw, 36px)',
        boxShadow: '0 20px 60px rgba(139,92,246,0.06)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(6,182,212,0.08)',
            border: '1px solid rgba(6,182,212,0.25)',
            borderRadius: 100,
            padding: '5px 16px',
            marginBottom: 12,
          }}
        >
          <Sparkles size={14} style={{ color: '#06b6d4' }} />
          <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700 }}>
            Modular Add-Ons
          </span>
        </div>
        <h3
          style={{
            fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
            fontWeight: 900,
            margin: '0 0 10px',
            fontFamily: "'Outfit', sans-serif",
            color: '#f8fafc',
          }}
        >
          Power Up Your Plan With Selectable Tool Modules
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: 640, margin: '0 auto' }}>
          Select extra high-demand automation integrations to plug directly into your base subscription plan.
        </p>
      </div>

      {/* Grid of Addons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {ADDON_MODULES.map((addon) => {
          const isChecked = selectedAddons.includes(addon.id);
          return (
            <div
              key={addon.id}
              onClick={() => toggleAddon(addon.id)}
              style={{
                background: isChecked ? 'rgba(6,182,212,0.06)' : 'rgba(255,255,255,0.02)',
                border: `2px solid ${isChecked ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>{addon.icon}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: isChecked ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                      color: isChecked ? '#07090e' : '#94a3b8',
                      padding: '3px 10px',
                      borderRadius: 12,
                    }}
                  >
                    {addon.badge}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  {addon.name}
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.5, margin: '0 0 16px' }}>
                  {addon.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
                <div>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#06b6d4', fontFamily: "'Outfit', sans-serif" }}>
                    +₦{addon.monthlyNGN.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}> /month</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: isChecked ? '#06b6d4' : '#64748b' }}>
                  {isChecked ? (
                    <>
                      <CheckCircle size={16} fill="#06b6d4" color="#07090e" /> Added
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} /> Add Module
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Modules Summary Box */}
      <div
        style={{
          background: 'rgba(6,182,212,0.04)',
          border: '1px solid rgba(6,182,212,0.2)',
          borderRadius: 16,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap size={20} style={{ color: '#06b6d4' }} />
          <div>
            <div style={{ color: '#f8fafc', fontSize: '0.88rem', fontWeight: 700 }}>
              Selected Tool Modules: {selectedAddons.length} Active
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
              Seamlessly configured into your WhatsApp & CRM dashboard during setup.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Add-on Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#06b6d4', fontFamily: "'Outfit', sans-serif" }}>
              +₦{totalAddonCost.toLocaleString()}/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
