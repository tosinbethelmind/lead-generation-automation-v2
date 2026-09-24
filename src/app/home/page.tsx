'use client';

/**
 * @file src/app/home/page.tsx
 * High-Converting Nigerian B2B Homepage — Bethelmind Analytics Lagos Desk
 *
 * Performance Optimized:
 * - Streamlined 6-step conversion journey: Hero -> How It Works -> Sector Tools -> Solutions -> Trust -> Pricing -> Settlement -> FAQ
 * - 0% distraction: Removed low-converting developer tools (Relume, Source code buyout clutter)
 * - Pinned Sticky Mobile Conversion Bar for 1-tap WhatsApp closing
 * - Zero hydration lag & edge-optimized
 */

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/home/Navbar';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import SectorToolsSection from '@/components/home/SectorToolsSection';
import SolutionsSection from '@/components/home/SolutionsSection';
import Footer from '@/components/home/Footer';
import { getSectorById } from '@/config/sectors';

// Dynamic Lazy Code-Splitting for Below-the-Fold Sections
const TrustSection = dynamic(() => import('@/components/home/TrustSection'), { ssr: true });
const PricingSection = dynamic(() => import('@/components/home/PricingSection'), { ssr: true });
const PaymentSection = dynamic(() => import('@/components/home/PaymentSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/components/home/FaqSection'), { ssr: true });
const CustomerAiAgentWidget = dynamic(() => import('@/components/CustomerAiAgentWidget'), { ssr: false });
const StickyMobileConversionBar = dynamic(() => import('@/components/StickyMobileConversionBar'), { ssr: false });
const LiveSocialProofTicker = dynamic(() => import('@/components/LiveSocialProofTicker').then(m => m.LiveSocialProofTicker), { ssr: false });
const ExitIntentAndIdleModal = dynamic(() => import('@/components/ExitIntentAndIdleModal'), { ssr: false });

export default function HomePage() {
  const [businessName, setBusinessName] = useState('My Business');
  const [selectedIndustry, setSelectedIndustry] = useState('solar');
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
        paddingBottom: 70, // Buffer for mobile sticky bar
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

        <SectorToolsSection
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
        />

        <SolutionsSection />

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

      <StickyMobileConversionBar
        businessName={businessName}
        area={targetDistrict}
        category={sectorProfile.name}
        hasWebsite={false}
        adminPhone="2348022791227"
      />

      <LiveSocialProofTicker />

      <ExitIntentAndIdleModal
        businessName={businessName}
        category={sectorProfile.name}
        area={targetDistrict}
        adminPhone="2348022791227"
      />

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
