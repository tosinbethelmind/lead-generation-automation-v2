'use client';

/**
 * @file src/components/home/LeadMarketplaceSection.tsx
 * Clean, high-converting B2B Lead Data Marketplace Section
 * Allows visitors & referred leads to buy & download verified B2B lead packages (Excel / CSV).
 */

import React, { useState } from 'react';
import { Database, Download, CheckCircle2, ShieldCheck, Zap, ArrowRight, ShoppingBag } from 'lucide-react';
import InstantCheckoutModal from '@/components/InstantCheckoutModal';

export interface LeadPackage {
  id: string;
  title: string;
  countText: string;
  category: string;
  priceNGN: number;
  badge: string;
  features: string[];
  sampleFilename: string;
}

const MARKETPLACE_PACKAGES: LeadPackage[] = [
  {
    id: 'solar-energy-lagos-1k',
    title: '1,000 Verified Lagos Solar & Inverter Installers',
    countText: '1,000 Contacts',
    category: 'Solar & Renewable Energy',
    priceNGN: 35000,
    badge: 'Popular for Solar B2B',
    features: [
      'Verified Phone Numbers & WhatsApp Contacts',
      'Owner Names & Business Office Addresses',
      'Google Maps Ratings & Website Domains',
      'Instant Excel / CSV Download'
    ],
    sampleFilename: 'Lagos_Solar_Energy_Leads_1000.xlsx'
  },
  {
    id: 'real-estate-lekki-vi-1k',
    title: '1,000 Lagos Real Estate & Property Developers',
    countText: '1,000 Contacts',
    category: 'Real Estate & Construction',
    priceNGN: 35000,
    badge: 'High Value B2B',
    features: [
      'Property Agencies in Lekki, VI, Ikoyi & Ikeja',
      'Direct WhatsApp & Phone Numbers',
      'Verified Office Addresses & Website Links',
      'Instant Excel / CSV Download'
    ],
    sampleFilename: 'Lagos_RealEstate_Leads_1000.xlsx'
  },
  {
    id: 'health-clinics-lagos-1k',
    title: '1,000 Medical Clinics, Dentists & Hospitals',
    countText: '1,000 Contacts',
    category: 'Healthcare & Wellness',
    priceNGN: 35000,
    badge: 'Verified Health B2B',
    features: [
      'Private Hospitals, Dental Clinics & Pharmacies',
      'Verified Phone Numbers & Email Contacts',
      'Decision-Maker Names & Addresses',
      'Instant Excel / CSV Download'
    ],
    sampleFilename: 'Lagos_Medical_Clinics_Leads_1000.xlsx'
  },
  {
    id: 'master-lagos-10k-database',
    title: 'Master Lagos 10,000 Business Lead Database',
    countText: '10,000 Contacts',
    category: 'Master Commercial Suite',
    priceNGN: 85000,
    badge: 'Best Value Bundle',
    features: [
      'Complete 10,000 Verified B2B Lagos Database',
      'Covers Ikeja, Lekki, VI, Yaba, Victoria Island & Abuja',
      'Phone, Email, Maps Rating & Visual Photo Metadata',
      'Instant Excel Download + Free Monthly Updates'
    ],
    sampleFilename: 'ApexReach_Master_Lagos_10000_Database.xlsx'
  }
];

export default function LeadMarketplaceSection() {
  const [selectedPkg, setSelectedPkg] = useState<LeadPackage | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleBuy = (pkg: LeadPackage) => {
    setSelectedPkg(pkg);
    setIsCheckoutOpen(true);
  };

  return (
    <section id="marketplace" style={{ padding: '80px clamp(16px, 4vw, 40px)', background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
            <ShoppingBag size={14} style={{ color: '#60a5fa' }} />
            <span style={{ fontSize: '0.78rem', color: '#60a5fa', fontWeight: 800 }}>Verified B2B Lead Store</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
            Instant Verified B2B Lead Marketplace
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 640, margin: '0 auto' }}>
            Accelerate your sales pipeline in Lagos & Nigeria. Download instant verified business contact lists in Excel format.
          </p>
        </div>

        {/* Package Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {MARKETPLACE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: 'rgba(30, 41, 59, 0.5)',
                border: pkg.id === 'master-lagos-10k-database' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: pkg.id === 'master-lagos-10k-database' ? '0 10px 30px rgba(59,130,246,0.2)' : 'none'
              }}
            >
              {pkg.badge && (
                <div style={{ position: 'absolute', top: -12, right: 20, background: pkg.id === 'master-lagos-10k-database' ? '#2563eb' : '#334155', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 12 }}>
                  {pkg.badge}
                </div>
              )}

              <div>
                <div style={{ fontSize: 12, color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>{pkg.category}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 }}>{pkg.title}</h3>
                
                <div style={{ margin: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 800, color: '#ffffff' }}>
                    ₦{pkg.priceNGN.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 6 }}>/ {pkg.countText}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#cbd5e1', marginBottom: 8 }}>
                      <CheckCircle2 size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleBuy(pkg)}
                style={{
                  width: '100%',
                  background: pkg.id === 'master-lagos-10k-database' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#1e293b',
                  border: pkg.id === 'master-lagos-10k-database' ? 'none' : '1px solid #475569',
                  color: '#ffffff',
                  borderRadius: 10,
                  padding: 12,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8
                }}
              >
                <Download size={16} />
                Buy & Download Excel
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPkg && (
        <InstantCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          title={selectedPkg.title}
          amountNGN={selectedPkg.priceNGN}
          productType="lead_package"
          itemDetails={selectedPkg.countText}
        />
      )}
    </section>
  );
}
