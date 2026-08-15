'use client';

/**
 * @file src/app/home/page.tsx
 * High-Performance Public Homepage — Bethelmind Analytics & Strategy
 *
 * Performance Optimized:
 * - Dynamic import code-splitting for below-the-fold components
 * - Optimized font display variables (no render-blocking @import fonts)
 * - Zero hydration lag
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import SectorToolsSection from '@/components/home/SectorToolsSection';
import Footer from '@/components/home/Footer';
import { getSectorById } from '@/config/sectors';

// Dynamic Lazy Code-Splitting for Below-the-Fold Sections
const CrmPreviewSection = dynamic(() => import('@/components/home/CrmPreviewSection'), { ssr: true });
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), { ssr: true });
const PricingSection = dynamic(() => import('@/components/home/PricingSection'), { ssr: true });
const PaymentSection = dynamic(() => import('@/components/home/PaymentSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/home/FaqSection'), { ssr: true });
const CustomerAiAgentWidget = dynamic(() => import('@/components/CustomerAiAgentWidget'), { ssr: false });

const RelumeSiteGeneratorSection = dynamic(() => import('@/components/home/RelumeSiteGeneratorSection'), { ssr: false });
const LeadMarketplaceSection = dynamic(() => import('@/components/home/LeadMarketplaceSection'), { ssr: false });
const AddonModulesSection = dynamic(() => import('@/components/home/AddonModulesSection'), { ssr: false });

export default function HomePage() {
  const [businessName, setBusinessName] = useState('My Business');
  const [selectedIndustry, setSelectedIndustry] = useState('general');
  const [targetDistrict, setTargetDistrict] = useState('Ikeja');
  const [selectedPlanId, setSelectedPlanId] = useState('pro');

  const sectorProfile = getSectorById(selectedIndustry);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07090e',
        color: '#f8fafc',
        fontFamily: "var(--font-inter), 'Inter', sans-serif",
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

        <RelumeSiteGeneratorSection />

        <LeadMarketplaceSection />

        <SectorToolsSection
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
        />

        <AddonModulesSection />

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

      <CustomerAiAgentWidget sector={sectorProfile.name} />

      <Footer />

      <style>{`
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
