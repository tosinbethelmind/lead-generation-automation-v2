/**
 * @file src/app/home/page.tsx
 * Public Homepage — Bethelmind Analytics & Strategy
 *
 * Refactored: August 2026
 * - Monolithic 1,333-line file replaced with focused, reusable components
 * - Pricing CTA bug fixed: each plan uses its own data, never hard-coded
 * - All false claims, unconfigured payment methods, and fake data removed
 * - Payment configuration moved to src/config/payment.ts (reads from env vars)
 * - Plan data moved to src/config/plans.ts
 * - Sector profiles moved to src/config/sectors.ts
 * - Legal pages added at /legal/*
 */
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import SectorToolsSection from '@/components/home/SectorToolsSection';
import CrmPreviewSection from '@/components/home/CrmPreviewSection';
import TrustSection from '@/components/home/TrustSection';
import PricingSection from '@/components/home/PricingSection';
import PaymentSection from '@/components/home/PaymentSection';
import FaqSection from '@/components/home/FaqSection';
import Footer from '@/components/home/Footer';
import { getSectorById } from '@/config/sectors';

export default function HomePage() {
  // Shared profiler state — lifted here so Navbar WA link and payment section stay in sync
  const [businessName, setBusinessName] = useState('My Business');
  const [selectedIndustry, setSelectedIndustry] = useState('solar');
  const [targetDistrict, setTargetDistrict] = useState('Ikeja');

  // Selected plan — shared between PricingSection and PaymentSection
  const [selectedPlanId, setSelectedPlanId] = useState('pro');

  const sectorProfile = getSectorById(selectedIndustry);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07090e',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden',
      }}
    >
      <Navbar />

      <main id="main-content">
        <HeroSection
          businessName={businessName}
          setBusinessName={setBusinessName}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          targetDistrict={targetDistrict}
          setTargetDistrict={setTargetDistrict}
        />

        <HowItWorksSection />

        <SolutionsSection />

        <SectorToolsSection
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
        />

        <CrmPreviewSection />

        <TrustSection />

        <PricingSection
          selectedPlanId={selectedPlanId}
          setSelectedPlanId={setSelectedPlanId}
          businessName={businessName}
          selectedIndustry={sectorProfile.name}
          targetDistrict={targetDistrict}
        />

        <PaymentSection
          selectedPlanId={selectedPlanId}
          businessName={businessName}
          selectedIndustry={sectorProfile.name}
          targetDistrict={targetDistrict}
        />

        <FaqSection />
      </main>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        :focus-visible {
          outline: 2px solid #06b6d4;
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
