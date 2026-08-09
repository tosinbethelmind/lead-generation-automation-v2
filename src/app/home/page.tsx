/**
 * @file src/app/home/page.tsx
 * Public Homepage — bethelmindanalytics.com
 * High-converting landing page with intelligent sector profiling,
 * live AI website/bot previews, interactive sector calculation tools, and instant bank transfer checkout.
 */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, CheckCircle, Zap, Star, Crown, Rocket,
  Target, Brain, MessageSquare, Phone, Globe, Shield, Play,
  MapPin, Check, Copy, ExternalLink, RefreshCw, Smartphone, Laptop,
  FileText, Calculator, Calendar, Car, Building, HeartPulse, Scale, ShoppingBag, GraduationCap, Truck, X, Loader2
} from 'lucide-react';

// ─── Intelligent Industry Profiler Data & Top Demanded Tools ───────────────────

interface SectorTool {
  id: string;
  name: string;
  desc: string;
  demandTag: string; // e.g. "#1 Demanded Feature"
  icon: any;
  actionKey?: string; // Maps to /api/sector-tools action
}

interface IndustryProfile {
  id: string;
  name: string;
  emoji: string;
  badge: string;
  topFeature: string;
  featureDesc: string;
  leadCount: string;
  targetLeadsDesc: string;
  sampleHeadline: string;
  sampleProducts: string[];
  demandedTools: SectorTool[];
  recommendedPlan: 'starter' | 'pro' | 'vip';
  color: string;
}

const INDUSTRY_PROFILES: Record<string, IndustryProfile> = {
  solar: {
    id: 'solar',
    name: 'Solar & Renewable Energy',
    emoji: '☀️',
    badge: 'Solar Industry Stack',
    topFeature: 'Automated Solar BOQ Load Calculator & Invoice Generator',
    featureDesc: 'Calculates customer appliance loads (TVs, ACs, Fridges, Pumps), recommends exact kVA inverter & battery setup, and outputs a formatted WhatsApp BOQ quote.',
    leadCount: '2,450+',
    targetLeadsDesc: 'Verified Property Owners, Commercial Buildings, Estates & Petrol Stations in Ikeja & Lekki',
    sampleHeadline: 'Lagos #1 Solar & Inverter Installation — Get Instant BOQ Estimate on WhatsApp',
    sampleProducts: ['5kVA Solar Generator System', '10kVA Lithium Commercial BOQ', '2kVA Home Backup Kit'],
    demandedTools: [
      { id: 'solar_boq', name: 'WhatsApp Solar BOQ Calculator', desc: 'Calculates battery count, inverter kVA & panel wattage automatically on WhatsApp', demandTag: '#1 Most Demanded', icon: Calculator, actionKey: 'solar_boq' },
      { id: 'diesel_roi', name: 'Diesel vs Solar ROI Calculator', desc: 'Compares monthly generator fuel expense (₦1,350/L) against solar payback period', demandTag: 'High ROI', icon: RefreshCw, actionKey: 'diesel_roi' },
      { id: 'solar_lead', name: 'Commercial Building Lead Harvester', desc: 'Extracts 2,400+ Lagos plaza owners, estate executives & high-energy bill businesses', demandTag: 'Lead Finder', icon: Target },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate & Property',
    emoji: '🏠',
    badge: 'Real Estate Stack',
    topFeature: 'WhatsApp Property Inspector & Inspection Tour Scheduler',
    featureDesc: 'Auto-sends video walkthroughs, title documents (C of O, Governor\'s Consent), payment plans, and books physical site inspection visits with calendar reminders.',
    leadCount: '3,120+',
    targetLeadsDesc: 'Verified HNW Buyers, Investors, Tech Founders & Overseas Nigerian Diaspora',
    sampleHeadline: 'Luxury Apartments & Land in Lekki, Ikoyi & Victoria Island',
    sampleProducts: ['2-Bedroom Terrace (Lekki Phase 1)', 'Commercial Land (Ibeju-Lekki)', 'Fully Serviced Apartment (Ikoyi)'],
    demandedTools: [
      { id: 'mortgage_amortization', name: 'Rent & Mortgage Amortization Bot', desc: 'Calculates 10-year installment schedules & down-payments for property buyers', demandTag: '#1 Most Demanded', icon: Calculator, actionKey: 'mortgage_amortization' },
      { id: 'inspection_scheduler', name: 'WhatsApp Inspection Scheduler', desc: 'Sends HD video tours, title docs & books physical site inspection visits on autopilot', demandTag: 'Automation', icon: Calendar },
      { id: 'hnw_harvester', name: 'Lagos HNW & Diaspora Lead Database', desc: 'Access 3,100+ verified high-net-worth executives & diaspora investors looking to buy', demandTag: 'High Yield', icon: Building },
    ],
    recommendedPlan: 'pro',
    color: '#8b5cf6',
  },
  automotive: {
    id: 'automotive',
    name: 'Car Dealers & Tokunbo Importers',
    emoji: '🚗',
    badge: 'Auto Sales Stack',
    topFeature: 'Tokunbo Import Duty & VIN History Calculator',
    featureDesc: 'Instant VIN lookup, customs duty estimate, landing cost calculator, and clearance status checker on WhatsApp.',
    leadCount: '4,200+',
    targetLeadsDesc: 'Verified Car Buyers, Corporate Fleet Managers & Transport Operators in Lagos',
    sampleHeadline: 'Direct Tokunbo Imports & Clean Foreign Used Cars — Instant Price Sheet',
    sampleProducts: ['2020 Toyota Camry (Foreign Used)', '2018 Lexus RX350 (Full Option)', '2019 Toyota Hilux Pick-Up'],
    demandedTools: [
      { id: 'tokunbo_duty', name: 'Tokunbo Duty & VIN Calculator', desc: 'Estimates customs duty, VIN history & landing cost for buyers on WhatsApp', demandTag: '#1 Most Demanded', icon: Car, actionKey: 'tokunbo_duty' },
      { id: 'port_clearing', name: 'Port Clearing Cost Calculator', desc: 'Calculates Tin Can & Apapa port terminal charges & shipping clearance fees', demandTag: 'Cost Estimator', icon: RefreshCw, actionKey: 'tokunbo_port_clearing' },
      { id: 'fleet_harvester', name: 'Lagos Fleet & Corporate Buyer Harvester', desc: 'Extracts 4,200+ corporate fleet managers, ride-hailing owners & private car buyers', demandTag: 'Bulk Buyers', icon: Target },
    ],
    recommendedPlan: 'pro',
    color: '#f59e0b',
  },
  medical: {
    id: 'medical',
    name: 'Clinics, Hospitals & Healthcare',
    emoji: '🏥',
    badge: 'Healthcare Stack',
    topFeature: '24/7 Patient Triage & HMO Verification Bot',
    featureDesc: 'Screens patient complaints, verifies HMO eligibility (Hygeia, Reliance, AXA Mansard), and handles doctor appointment bookings.',
    leadCount: '1,890+',
    targetLeadsDesc: 'Corporate HR Directors, Family Heads & HMO Decision Makers in Lagos',
    sampleHeadline: 'Premier Healthcare & Specialist Consultation in Lagos — Book Online',
    sampleProducts: ['Full Executive Health Checkup', 'Dental & Optical Consultation', 'Pediatric Family Plan'],
    demandedTools: [
      { id: 'healthcare_hmo', name: 'HMO & Co-Pay Calculator Bot', desc: 'Verifies HMO coverage tiers, co-pay amounts & books specialist appointments 24/7', demandTag: '#1 Most Demanded', icon: HeartPulse, actionKey: 'healthcare_hmo' },
      { id: 'patient_reminder', name: 'Medication & Follow-Up Reminder', desc: 'Automates patient follow-up voice notes, lab result alerts & prescription renewals', demandTag: 'Patient Retention', icon: Phone },
      { id: 'hr_harvester', name: 'Corporate HMO Account Harvester', desc: 'Scrapes 1,800+ Lagos corporate HR managers looking for staff HMO & retainer plans', demandTag: 'High Contract', icon: Target },
    ],
    recommendedPlan: 'starter',
    color: '#10b981',
  },
  legal: {
    id: 'legal',
    name: 'Law Firms & Legal Services',
    emoji: '⚖️',
    badge: 'Legal Practice Stack',
    topFeature: 'CAC Registration & Property Title Search Assistant',
    featureDesc: 'Checks CAC name availability, takes property title search requests, and collects paid consultation fee retainers.',
    leadCount: '1,450+',
    targetLeadsDesc: 'Corporate Directors, SME Founders & Commercial Business Owners in Lagos',
    sampleHeadline: 'Corporate Law, CAC Registration & Property Documentation Experts',
    sampleProducts: ['Corporate Retainer Package', 'Property Title Verification (Governor\'s Consent)', 'CAC Incorporation'],
    demandedTools: [
      { id: 'cac_fees', name: 'CAC Filing & Entity Fee Calculator', desc: 'Calculates exact CAC filing fees & government stamp duties for Company Ltd & NGOs', demandTag: '#1 Most Demanded', icon: Scale, actionKey: 'cac_fees' },
      { id: 'cac_name_check', name: 'CAC Name Availability Checker', desc: 'Simulates CAC portal availability checks for proposed business names', demandTag: 'Instant Check', icon: CheckCircle, actionKey: 'cac_name_check' },
      { id: 'legal_harvester', name: 'Lagos SME Corporate Lead Harvester', desc: 'Extracts newly registered Lagos businesses needing ongoing legal retainers', demandTag: 'Steady Income', icon: Target },
    ],
    recommendedPlan: 'pro',
    color: '#ec4899',
  },
  retail: {
    id: 'retail',
    name: 'Boutiques, Fashion & E-Commerce',
    emoji: '🛍️',
    badge: 'Retail Commerce Stack',
    topFeature: 'WhatsApp Catalog & Moniepoint Auto-Checkout Bot',
    featureDesc: 'Displays your clothing/shoe catalog, takes size/color choices, collects instant payment via Moniepoint/OPay, and prints waybill labels.',
    leadCount: '5,600+',
    targetLeadsDesc: 'Lagos Wholesale Buyers, Boutique Shoppers & Retail Customers',
    sampleHeadline: 'Exclusive Fashion & Wears — Order Direct on WhatsApp with Fast Lagos Delivery',
    sampleProducts: ['Designer Native Wear Set', 'Luxury Italian Leather Shoes', 'Corporate Suit Collection'],
    demandedTools: [
      { id: 'logistics_delivery', name: 'Lagos Delivery & Waybill Calculator', desc: 'Calculates dispatch rider delivery fees across Ikeja, Lekki, Yaba & Festac', demandTag: '#1 Most Demanded', icon: Truck, actionKey: 'logistics_delivery' },
      { id: 'whatsapp_cart', name: 'WhatsApp Catalog & Checkout Bot', desc: 'Displays sizes/colors, collects Moniepoint payments & takes Lagos delivery details', demandTag: 'Auto-Checkout', icon: ShoppingBag, actionKey: 'whatsapp_cart' },
      { id: 'retail_broadcast', name: 'Bulk Re-Engagement Broadcast Engine', desc: 'Broadcasts new stock & native wear arrivals to past buyers with 1-click re-order', demandTag: 'Repeat Sales', icon: MessageSquare },
    ],
    recommendedPlan: 'starter',
    color: '#f97316',
  },
  schools: {
    id: 'schools',
    name: 'Schools & Training Institutes',
    emoji: '📚',
    badge: 'Education Admin Stack',
    topFeature: 'WhatsApp School Fees Reminder & Digital Receipt Bot',
    featureDesc: 'Sends termly fee reminders to parents, tracks payment installments, and issues digital receipts automatically.',
    leadCount: '2,800+',
    targetLeadsDesc: 'Verified Parents in Estate Zones & Corporate Staff in Lagos',
    sampleHeadline: 'Top Rated Private Academy — Enrolment Open for New Academic Session',
    sampleProducts: ['Creche & Nursery Admission', 'Primary & Secondary School Fees', 'After-School STEM Program'],
    demandedTools: [
      { id: 'school_tuition', name: 'School Tuition & Fee PIN Calculator', desc: 'Calculates termly tuition installments, boarding fees & generates student PINs', demandTag: '#1 Most Demanded', icon: GraduationCap, actionKey: 'school_tuition' },
      { id: 'admission_bot', name: 'Student Admission Intake Bot', desc: 'Takes student registrations, schedules entrance exams & answers parent questions', demandTag: 'Fast Intake', icon: Calendar },
      { id: 'parent_harvester', name: 'Lagos Estate Parent Lead Harvester', desc: 'Extracts parents in targeted estate zones looking for quality private schools', demandTag: 'High Enrolment', icon: Target },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
  general: {
    id: 'general',
    name: 'General Business & B2B Services',
    emoji: '🚀',
    badge: 'B2B Growth Stack',
    topFeature: 'Mass Lagos B2B Lead Harvester + AI Voice Note Generator',
    featureDesc: 'Extracts thousands of verified business phone numbers across 27 Lagos districts and automates multi-channel sales.',
    leadCount: '17,100+',
    targetLeadsDesc: 'Verified Lagos Business Owners & Decision Makers Across All 27 Districts',
    sampleHeadline: 'Nigeria\'s Premier AI Lead Generation & Business Automation Platform',
    sampleProducts: ['Mass Lead Harvester Access', '24/7 AI Customer Agent', 'Nigerian Accent Voice Notes'],
    demandedTools: [
      { id: 'b2b_harvester', name: 'Mass Lagos B2B Harvester', desc: 'Extracts 17,000+ verified decision-maker phone numbers & WhatsApp contacts', demandTag: '#1 Most Demanded', icon: Target },
      { id: 'voice_generator', name: 'Nigerian Accent Voice Note Generator', desc: 'Sends warm, authentic Nigerian accent voice notes (en-NG Abeo/Ezinne) automatically', demandTag: 'High Response', icon: Phone },
      { id: 'ai_agent', name: '24/7 Multi-Channel AI Sales Agent', desc: 'Handles enquiries, quotes & closes deals across WhatsApp, Email & Web 24/7', demandTag: 'Non-stop Sales', icon: Brain },
    ],
    recommendedPlan: 'pro',
    color: '#06b6d4',
  },
};

const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Starter Package',
    monthlyNGN: 15000,
    oneTimeNGN: 75000,
    color: '#0ea5e9',
    badge: 'Great for Small Vendors',
    tagline: 'WhatsApp Catalog + AI Autoresponder + Simple CRM',
    highlights: [
      '⚡ 24/7 AI Customer Bot for your site & WhatsApp',
      '📲 WhatsApp Catalog & Moniepoint Checkout Bot',
      '📊 Simple 1-Click Lead CRM Kanban Board',
      '🎯 500 Verified Lagos B2B Contacts Export',
      '🌐 Free Subdomain (yourname.apexreach.site)',
    ],
  },
  {
    id: 'pro',
    name: 'Business Pro Package',
    monthlyNGN: 35000,
    oneTimeNGN: 185000,
    color: '#8b5cf6',
    popular: true,
    badge: '⭐ REPLACES 2 SALES REPS (SMEs Choice)',
    tagline: 'Full AI Sales Engine + Social Ads Creator + Sector Tools',
    highlights: [
      '🎨 AI Social Media Ad Creator (Meta Lead Ads Webhook Sync)',
      '⚡ Top Demanded Sector Tools (Solar BOQ, VIN Duty, Mortgage)',
      '📊 Built-In Simple CRM System (5-Stage Kanban Board)',
      '🎯 Mass Lagos B2B Lead Harvester (17,000+ Verified Contacts)',
      '🤖 24/7 Human-Level WhatsApp & Web AI Agent',
      '🎙️ Nigerian Accent Voice Notes (en-NG Abeo/Ezinne)',
      '💳 Moniepoint / OPay Instant Bank Transfer Gateway',
      '🌐 Custom .com.ng Domain Included (1 Year)',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Enterprise Suite',
    monthlyNGN: 75000,
    oneTimeNGN: 480000,
    color: '#f59e0b',
    badge: '100% Hands-Free Enterprise',
    tagline: 'AI Outbound Voice Caller + Complete Automation Suite',
    highlights: [
      '📞 AI Outbound Voice Caller (Auto-dials leads with voice)',
      '🎨 Unlimited AI Social Media Ad Campaigns & Meta Sync',
      '⚡ All Sector Tools & Custom Workflow Integrations',
      '🎯 Unlimited Lead Harvesting Across All 27 Lagos Districts',
      '📊 Custom Revenue Analytics & Lead Journey Dashboard',
      '👑 Dedicated Account Manager & 24/7 Priority Support',
    ],
  },
];

export default function HomePage() {
  // Profiler state
  const [businessName, setBusinessName] = useState('My Business');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('solar');
  const [targetDistrict, setTargetDistrict] = useState('Ikeja');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('mobile');
  
  // Checkout & Plan state
  const [planBilling, setPlanBilling] = useState<'subscription' | 'standalone'>('subscription');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [copiedBank, setCopiedBank] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Dynamic Bank Account Details State
  const [bankDetails, setBankDetails] = useState({
    bankName: 'OPay Digital Services',
    accountNumber: '7034297995',
    accountName: 'Oyelakin Tosin Matthew',
  });

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data && (data.config || data)) {
          const cfg = data.config || data;
          setBankDetails({
            bankName: cfg.moniepointBankName || cfg.opayBankName || 'OPay Digital Services',
            accountNumber: cfg.moniepointAccountNumber || cfg.opayAccountNumber || '7034297995',
            accountName: cfg.moniepointAccountName || cfg.opayAccountName || 'Oyelakin Tosin Matthew',
          });
        }
      })
      .catch(() => {});
  }, []);

  // Live Sector Tool API Testing Modal State
  const [activeModalTool, setActiveModalTool] = useState<SectorTool | null>(null);
  const [modalInputs, setModalInputs] = useState<Record<string, any>>({});
  const [modalResult, setModalResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Active industry profile definition
  const profile = useMemo(() => {
    return INDUSTRY_PROFILES[selectedIndustry] || INDUSTRY_PROFILES.general;
  }, [selectedIndustry]);

  const activePlan = useMemo(() => {
    return PRICING_TIERS.find(t => t.id === selectedPlanId) || PRICING_TIERS[1];
  }, [selectedPlanId]);

  const copyAccountNum = () => {
    navigator.clipboard.writeText(bankDetails.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };

  // Open Sector Tool API Modal
  const openToolModal = (tool: SectorTool) => {
    setActiveModalTool(tool);
    setModalResult(null);
    // Set default initial inputs per tool type
    if (tool.actionKey === 'solar_boq') {
      setModalInputs({ kva: 5, batteryType: 'lithium', backupHours: 12 });
    } else if (tool.actionKey === 'tokunbo_duty') {
      setModalInputs({ year: 2018, engineCc: 2500, cifNgn: 8500000 });
    } else if (tool.actionKey === 'mortgage_amortization') {
      setModalInputs({ propertyPriceNgn: 45000000, downPaymentPercent: 20, interestRatePercent: 18, tenureYears: 10 });
    } else if (tool.actionKey === 'healthcare_hmo') {
      setModalInputs({ hmoProvider: 'Reliance HMO', procedureName: 'Dental Scaling & Polishing', totalProcedureCostNgn: 35000 });
    } else if (tool.actionKey === 'cac_fees') {
      setModalInputs({ entityType: 'company_ltd', shareCapital: 1000000 });
    } else if (tool.actionKey === 'logistics_delivery') {
      setModalInputs({ originCity: 'Lagos (Ikeja)', destinationCity: 'Lagos (Lekki)', weightKg: 5 });
    } else if (tool.actionKey === 'school_tuition') {
      setModalInputs({ gradeLevel: 'JSS 1', isBoarder: false, termCount: 3 });
    } else {
      setModalInputs({ name: businessName || 'My Business', district: targetDistrict });
    }
  };

  // Execute Live API Request to /api/sector-tools
  const runLiveToolCalculation = async () => {
    if (!activeModalTool?.actionKey) return;
    setIsCalculating(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: activeModalTool.actionKey, ...modalInputs }),
      });
      const data = await res.json();
      setModalResult(data.result || data);
    } catch (err: any) {
      setModalResult({ error: err.message || 'Failed to connect to sector calculation engine.' });
    } finally {
      setIsCalculating(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Bethelmind Team! I just profiled my business on your site:\n\n` +
    `• Business Name: ${businessName || 'My Business'}\n` +
    `• Industry: ${profile.name}\n` +
    `• District: ${targetDistrict}\n` +
    `• Selected Plan: ${activePlan.name} (${planBilling === 'subscription' ? '₦' + activePlan.monthlyNGN.toLocaleString() + '/mo' : '₦' + activePlan.oneTimeNGN.toLocaleString() + ' One-time'})\n\n` +
    `I want to complete payment and activate my AI platform immediately.`
  );

  return (
    <div style={{ minHeight: '100vh', background: '#07090e', color: '#f8fafc', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 66, padding: '0 clamp(16px, 4vw, 40px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7,9,14,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Outfit', sans-serif" }}>
              Bethelmind Analytics
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block', marginTop: -2 }}>Lagos, Nigeria</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="#sector-tools" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }} className="desktop-only">
            Sector Tools
          </a>
          <a href="#offers" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500 }} className="desktop-only">
            Offers & Pricing
          </a>
          <a href="/admin" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.85rem', padding: '6px 12px' }}>
            Login
          </a>
          <a href={`https://wa.me/+2348022791227?text=${whatsappMessage}`} target="_blank" rel="noreferrer"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageSquare style={{ width: 14, height: 14 }} /> WhatsApp Us
          </a>
        </div>
      </header>

      {/* ── HERO & INTELLIGENT PROFILER ───────────────────────────────────── */}
      <section style={{ paddingTop: 110, paddingBottom: 60, paddingLeft: 'clamp(16px, 4vw, 40px)', paddingRight: 'clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Simple Header Pill */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 100, padding: '6px 16px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4' }} />
            <span style={{ fontSize: '0.78rem', color: '#06b6d4', fontWeight: 700 }}>Nigeria's #1 AI Lead & Sales Engine</span>
          </div>
        </div>

        {/* Clear Headline */}
        <h1 style={{ textAlign: 'center', fontSize: 'clamp(2.1rem, 5.5vw, 3.6rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 16px', fontFamily: "'Outfit', sans-serif" }}>
          Get More Paying Clients in Lagos.<br />
          <span style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Zero Cold Calls. 100% Automated by AI.
          </span>
        </h1>

        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', maxWidth: 680, margin: '0 auto 36px', lineHeight: 1.6 }}>
          Type your business details below to <strong style={{ color: '#f8fafc' }}>instantly unlock your tailored AI sales engine</strong> and top demanded tools for your sector.
        </p>

        {/* ── THE INTELLIGENT PROFILER INPUT BOX ─────────────────────────── */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 24, padding: 'clamp(20px, 4vw, 32px)', boxShadow: '0 20px 60px rgba(6,182,212,0.1)', marginBottom: 48 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Sparkles style={{ width: 20, height: 20, color: '#06b6d4' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
              Step 1: Profile Your Business (Takes 5 Seconds)
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
            
            {/* Input 1: Business Name */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                placeholder="e.g. Apex Solar Solutions"
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.95rem', outline: 'none' }}
              />
            </div>

            {/* Input 2: Select Industry */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                Industry / Sector
              </label>
              <select
                value={selectedIndustry}
                onChange={e => setSelectedIndustry(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
              >
                {Object.values(INDUSTRY_PROFILES).map(ind => (
                  <option key={ind.id} value={ind.id} style={{ background: '#07090e', color: '#fff' }}>
                    {ind.emoji} {ind.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 3: Target District */}
            <div>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                Target Lagos District
              </label>
              <select
                value={targetDistrict}
                onChange={e => setTargetDistrict(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
              >
                {['Ikeja', 'Lekki Phase 1', 'Victoria Island', 'Ikoyi', 'Yaba', 'Surulere', 'Ikorodu', 'Alimosho', 'All 27 Lagos Districts'].map(d => (
                  <option key={d} value={d} style={{ background: '#07090e', color: '#fff' }}>📍 {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, background: 'rgba(6,182,212,0.06)', padding: '14px 20px', borderRadius: 14, border: '1px solid rgba(6,182,212,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap style={{ width: 16, height: 16, color: '#06b6d4' }} />
              <span style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                Intelligent Match: <strong style={{ color: '#06b6d4' }}>{profile.leadCount}</strong> verified {profile.name} leads in {targetDistrict}
              </span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>✓ Top Demanded Tools Unlocked</span>
          </div>
        </div>

        {/* ── DYNAMIC LIVE PREVIEW & TAILORED OFFER ───────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, alignItems: 'start' }}>
          
          {/* Left Column: Tailored Killer Feature & Offer */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${profile.color}40`, borderRadius: 24, padding: 28, position: 'relative' }}>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${profile.color}15`, border: `1px solid ${profile.color}30`, borderRadius: 100, padding: '4px 14px', marginBottom: 16 }}>
              <span style={{ fontSize: '0.9rem' }}>{profile.emoji}</span>
              <span style={{ fontSize: '0.75rem', color: profile.color, fontWeight: 700 }}>{profile.badge}</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 10px', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
              {businessName || 'Your Business'}'s Top Demanded Tool:
            </h3>

            <div style={{ background: 'rgba(7,9,14,0.6)', border: `1px solid ${profile.color}30`, borderRadius: 16, padding: 18, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Target style={{ width: 20, height: 20, color: profile.color }} />
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>{profile.topFeature}</h4>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5 }}>
                {profile.featureDesc}
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                Top Demanded Features for {profile.name}:
              </h4>
              {profile.demandedTools.map(tool => {
                const IconComponent = tool.icon;
                return (
                  <div key={tool.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <IconComponent style={{ width: 18, height: 18, color: profile.color, flexShrink: 0, marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700 }}>{tool.name}</span>
                        {tool.actionKey ? (
                          <button
                            onClick={() => openToolModal(tool)}
                            style={{ fontSize: '0.65rem', color: '#fff', background: profile.color, border: 'none', padding: '2px 8px', borderRadius: 6, fontWeight: 700, cursor: 'pointer' }}
                          >
                            ⚡ Test Live Demo
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.65rem', color: profile.color, background: `${profile.color}15`, padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>{tool.demandTag}</span>
                        )}
                      </div>
                      <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '0.78rem' }}>{tool.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <a href="#offers" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '14px 0', borderRadius: 14, background: `linear-gradient(135deg, ${profile.color}, #7c3aed)`, color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: '0.95rem', boxShadow: `0 8px 30px ${profile.color}30` }}>
              Activate Engine for {businessName || 'My Business'} <ArrowRight style={{ width: 16, height: 16 }} />
            </a>
          </div>

          {/* Right Column: Live Mockup Devices (Phone & Laptop Toggle) */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 24 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Live Generated Preview</span>
              <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 10 }}>
                <button onClick={() => setPreviewDevice('mobile')} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: previewDevice === 'mobile' ? profile.color : 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Smartphone style={{ width: 12, height: 12 }} /> Phone
                </button>
                <button onClick={() => setPreviewDevice('desktop')} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: previewDevice === 'desktop' ? profile.color : 'transparent', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Laptop style={{ width: 12, height: 12 }} /> Laptop
                </button>
              </div>
            </div>

            {/* Mockup Frame */}
            <div style={{ background: '#0a0d14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 16, minHeight: 380, position: 'relative', overflow: 'hidden' }}>
              
              {/* Header Bar */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: profile.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>
                    {profile.emoji}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff' }}>{businessName || 'Your Business'}</span>
                </div>
                <span style={{ fontSize: '0.65rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>Live AI Agent</span>
              </div>

              {/* Hero Banner */}
              <div style={{ background: `linear-gradient(135deg, ${profile.color}20, transparent)`, borderRadius: 12, padding: 16, marginBottom: 16, border: `1px solid ${profile.color}30` }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>{profile.sampleHeadline}</h4>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>Targeted in {targetDistrict}, Lagos</p>
              </div>

              {/* Sample Product Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {profile.sampleProducts.slice(0, 2).map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#e2e8f0', fontWeight: 600 }}>{item}</p>
                    <span style={{ fontSize: '0.65rem', color: profile.color, fontWeight: 700 }}>Instant Quote →</span>
                  </div>
                ))}
              </div>

              {/* Simulated Floating WhatsApp Chat Widget */}
              <div style={{ position: 'absolute', bottom: 12, right: 12, left: 12, background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(37,211,102,0.4)', borderRadius: 14, padding: 12, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MessageSquare style={{ width: 16, height: 16, color: '#fff' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#fff', fontWeight: 700 }}>
                    {businessName} AI Assistant:
                  </p>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    "Hello! I can send you instant quotes, calculate BOQ & book consultations 24/7."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── UNIVERSAL BUSINESS AUTOMATION SUITE (FOR ALL SECTORS) ───────────── */}
      <section style={{ padding: '60px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto', background: 'rgba(255,255,255,0.01)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 40 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 100, padding: '4px 14px', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>Universal Core Stack (For Every Business)</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            6 Essential Tools Every Nigerian Business Needs
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 680, margin: '0 auto' }}>
            No matter your industry — whether Solar, Real Estate, Retail, Education, Health, or B2B Services — these 6 universal tools power your customer acquisition 24/7.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          
          {[
            {
              id: 'universal_whatsapp',
              name: '24/7 WhatsApp AI Sales & Support Bot',
              desc: 'Auto-replies in 3 seconds to late-night 10 PM buyers on WhatsApp. Shares price sheets, catalog links, handles FAQs & captures lead phone numbers.',
              icon: MessageSquare,
              color: '#25d366',
              tag: 'Universal Essential',
              actionKey: 'whatsapp_cart'
            },
            {
              id: 'universal_voice',
              name: 'Nigerian Accent Voice Note Generator',
              desc: 'Sends warm, authentic Lagos accent voice notes (en-NG Abeo / Ezinne models) for prospect outreach and payment reminders with 85%+ open rates.',
              icon: Phone,
              color: '#06b6d4',
              tag: 'High Response',
              actionKey: 'nigerian_ai_tone'
            },
            {
              id: 'universal_harvester',
              name: 'Mass Lagos B2B Lead Harvester',
              desc: 'Extracts 17,000+ verified decision-maker phone numbers & WhatsApp contacts across all 27 Lagos districts (Ikeja, Lekki, Victoria Island, Yaba).',
              icon: Target,
              color: '#8b5cf6',
              tag: 'Data Powerhouse'
            },
            {
              id: 'universal_moniepoint',
              name: 'Moniepoint / OPay Auto-Checkout Bot',
              desc: 'Frictionless payment box with 1-click copy account number and instant WhatsApp receipt submission to close sales on the spot.',
              icon: Zap,
              color: '#f59e0b',
              tag: 'Instant Payment',
              actionKey: 'virtual_account_dva'
            },
            {
              id: 'universal_sdr',
              name: 'Multi-Channel AI Customer SDR Agent',
              desc: 'Continuous AI agent that works 24 hours a day across WhatsApp, Website Live Widget, and Email without taking sick leave or requesting salary raises.',
              icon: Brain,
              color: '#ec4899',
              tag: 'Replaces 2 SDRs'
            },
            {
              id: 'universal_social_ads',
              name: 'AI Social Media Ad Creation & Campaign Manager',
              desc: 'Generates high-converting Instagram, Facebook & TikTok ad copy, headlines & target audiences. Auto-syncs Meta Lead Forms into WhatsApp & Simple CRM.',
              icon: Rocket,
              color: '#0ea5e9',
              tag: 'Meta Ads Auto-Pilot',
              actionKey: 'social_ad_creator'
            },
            {
              id: 'universal_analytics',
              name: 'Daily Lead Journey & Conversion Dashboard',
              desc: 'Full real-time visibility into lead pipeline stages: from initial cold outreach ➔ WhatsApp chat ➔ quote sent ➔ confirmed payment.',
              icon: Shield,
              color: '#10b981',
              tag: 'Pipeline Visibility'
            }
          ].map(tool => {
            const Icon = tool.icon;
            return (
              <div key={tool.id} style={{ background: 'rgba(7,9,14,0.7)', border: `1px solid ${tool.color}30`, borderRadius: 20, padding: 24, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${tool.color}15`, border: `1px solid ${tool.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 20, height: 20, color: tool.color }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: tool.color, background: `${tool.color}15`, padding: '3px 10px', borderRadius: 20 }}>
                    {tool.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>{tool.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px' }}>{tool.desc}</p>
                
                {tool.actionKey && (
                  <button
                    onClick={() => openToolModal(tool as any)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: tool.color, color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                  >
                    ⚡ Test Live Universal Bot →
                  </button>
                )}
              </div>
            );
          })}

        </div>
      </section>

      {/* ── SIMPLE CRM & LEAD PIPELINE SYSTEM SHOWCASE ───────────────────── */}
      <section style={{ padding: '60px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto', marginBottom: 40 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 100, padding: '4px 14px', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 700 }}>Built-In Simple CRM System</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            Zero Spreadsheets. Simple 1-Click Lead CRM.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 680, margin: '0 auto' }}>
            Never lose track of a client again. Our built-in simple CRM automatically moves every prospect through 7 clear stages from cold lead to paid customer.
          </p>
        </div>

        {/* Visual Simple CRM Kanban Board Preview */}
        <div style={{ background: '#0a0d14', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 24, padding: 'clamp(18px, 3vw, 28px)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem', fontWeight: 800 }}>
                {businessName || 'Your Business'} Lead Pipeline Board
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: '0.78rem', color: '#64748b' }}>
              <span>Total Leads: <strong style={{ color: '#06b6d4' }}>{profile.leadCount}</strong></span>
              <span>Conversion Rate: <strong style={{ color: '#10b981' }}>28.4%</strong></span>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            
            {[
              {
                stage: '1. Harvested Leads',
                count: '1,420',
                color: '#64748b',
                badge: 'Auto-Scraped',
                sampleLead: { name: 'Kapex Solar Solutions', loc: 'Ikeja', phone: '+234 803 492 ****', status: 'Phone Verified' }
              },
              {
                stage: '2. AI Enriched',
                count: '890',
                color: '#06b6d4',
                badge: 'Site Generated',
                sampleLead: { name: 'Lekki Luxury Haven', loc: 'Lekki Phase 1', phone: '+234 812 839 ****', status: 'Custom Site Built' }
              },
              {
                stage: '3. Voice / SMS Sent',
                count: '430',
                color: '#8b5cf6',
                badge: 'Outreach Sent',
                sampleLead: { name: 'Apex Foreign Motors', loc: 'Victoria Island', phone: '+234 703 192 ****', status: 'en-NG Voice Sent' }
              },
              {
                stage: '4. WhatsApp Reply',
                count: '142',
                color: '#f59e0b',
                badge: 'Hot Prospect',
                sampleLead: { name: 'Dr. Folake (Hygeia HMO)', loc: 'Ikoyi', phone: '+234 802 279 ****', status: 'Asked for Quote' }
              },
              {
                stage: '5. Paid Deal Won',
                count: '38',
                color: '#10b981',
                badge: '₦ Money Paid',
                sampleLead: { name: 'Bethelmind Enterprise', loc: 'Lagos Island', phone: '+234 802 279 1227', status: 'Moniepoint ₦185,000' }
              }
            ].map(col => (
              <div key={col.stage} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${col.color}30`, borderRadius: 16, padding: 14 }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${col.color}20` }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff' }}>{col.stage}</span>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: col.color, background: `${col.color}15`, padding: '2px 8px', borderRadius: 10 }}>{col.count}</span>
                </div>

                {/* Sample Lead Card inside column */}
                <div style={{ background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.sampleLead.name}</h4>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '0.72rem', color: '#94a3b8' }}>📍 {col.sampleLead.loc} · {col.sampleLead.phone}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: '0.65rem', color: col.color, fontWeight: 700 }}>{col.sampleLead.status}</span>
                    <span style={{ fontSize: '0.62rem', color: '#64748b', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>{col.badge}</span>
                  </div>
                </div>

              </div>
            ))}

          </div>

          <div style={{ marginTop: 20, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              ⚡ <strong>100% Automated CRM:</strong> Leads update their stage automatically when they click links or reply on WhatsApp.
            </span>
          </div>

        </div>
      </section>

      {/* ── SECTOR TOOLS SHOWCASE ─────────────────────────────────────────── */}


      <section id="sector-tools" style={{ padding: '60px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '4px 14px', marginBottom: 12 }}>
            <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 700 }}>Top Demanded Tools By Sector</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            Explore Highly Demanded Automation Tools
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Click on any tool below to launch the **Live API Demo Bot** and test calculations in real time.
          </p>
        </div>

        {/* Industry Selector Tabs */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {Object.values(INDUSTRY_PROFILES).map(ind => (
            <button
              key={ind.id}
              onClick={() => setSelectedIndustry(ind.id)}
              style={{
                padding: '8px 18px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                background: selectedIndustry === ind.id ? ind.color : 'rgba(255,255,255,0.03)',
                color: selectedIndustry === ind.id ? '#fff' : '#94a3b8',
                border: `1px solid ${selectedIndustry === ind.id ? ind.color : 'rgba(255,255,255,0.08)'}`
              }}
            >
              <span>{ind.emoji}</span> {ind.name}
            </button>
          ))}
        </div>

        {/* Selected Sector Showcase Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {profile.demandedTools.map(tool => {
            const ToolIcon = tool.icon;
            return (
              <div key={tool.name} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${profile.color}30`, borderRadius: 18, padding: 24, transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${profile.color}15`, border: `1px solid ${profile.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ToolIcon style={{ width: 22, height: 22, color: profile.color }} />
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: profile.color, background: `${profile.color}15`, padding: '3px 10px', borderRadius: 20 }}>
                    {tool.demandTag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>{tool.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 16px' }}>{tool.desc}</p>
                
                {tool.actionKey && (
                  <button
                    onClick={() => openToolModal(tool)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: `linear-gradient(135deg, ${profile.color}, #7c3aed)`, color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    ⚡ Test Live Demo Bot →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ULTRA-SIMPLE ROI COMPARISON ───────────────────────────────────── */}
      <section style={{ padding: '60px clamp(16px, 4vw, 40px)', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            Why Lagos Business Owners Are Switching to AI
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 36 }}>
            Stop spending massive monthly budgets hiring sales reps who drop leads and don't work nights.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, textAlign: 'left' }}>
            
            {/* Column 1: Traditional Sales Reps */}
            <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: '1.2rem' }}>❌</span>
                <h3 style={{ margin: 0, color: '#f87171', fontSize: '1.1rem', fontWeight: 800 }}>Hiring 2 Sales SDRs in Lagos</h3>
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f87171', margin: '0 0 16px', fontFamily: "'Outfit', sans-serif" }}>
                ₦300,000<span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/month</span>
              </p>
              <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 8px' }}>• Salary + Airtime + Transport allowance</p>
                <p style={{ margin: '0 0 8px' }}>• Limited to 8 working hours (Mon - Fri)</p>
                <p style={{ margin: '0 0 8px' }}>• Misses late-night 10 PM WhatsApp buyers</p>
                <p style={{ margin: 0 }}>• High staff turnover & manual lead entry</p>
              </div>
            </div>

            {/* Column 2: Bethelmind AI Platform */}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: 24, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, right: 20, background: '#10b981', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                SAVE 88% MONTHLY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span>
                <h3 style={{ margin: 0, color: '#10b981', fontSize: '1.1rem', fontWeight: 800 }}>Bethelmind Business Pro AI</h3>
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981', margin: '0 0 16px', fontFamily: "'Outfit', sans-serif" }}>
                ₦35,000<span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/month</span>
              </p>
              <div style={{ fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 8px' }}>• <strong>17,000+ Verified Lagos B2B Leads</strong> included</p>
                <p style={{ margin: '0 0 8px' }}>• <strong>24/7 Non-stop continuous AI agent</strong></p>
                <p style={{ margin: '0 0 8px' }}>• Automated Nigerian Accent Voice Notes (en-NG)</p>
                <p style={{ margin: 0 }}>• Moniepoint / OPay instant checkout in chat</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOR THE CURIOUS: HOW IT WORKS IN 3 STEPS ─────────────────────── */}
      <section style={{ padding: '60px clamp(16px, 4vw, 40px)', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            How It Works (3-Step Walkthrough)
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            From setup to receiving paid customer orders on WhatsApp in under 30 minutes.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          
          {[
            { step: '01', title: 'Profile & Configure', desc: 'Type your business name, products, and prices in our simple 30-second admin panel.', color: '#06b6d4', icon: Sparkles },
            { step: '02', title: 'Auto-Harvest & Outreach', desc: 'Our harvester extracts target leads in Ikeja, Lekki, or V.I. and sends automated voice notes.', color: '#8b5cf6', icon: Target },
            { step: '03', title: 'Receive Paid Orders', desc: 'Your 24/7 AI agent handles enquiries and collects payments straight into your bank account.', color: '#10b981', icon: Rocket },
          ].map(({ step, title, desc, color, icon: Icon }) => (
            <div key={step} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color, fontFamily: "'Outfit', sans-serif" }}>{step}</span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: 18, height: 18, color }} />
                </div>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 8px', color: '#fff' }}>{title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}

        </div>

        {/* Playable Audio Voice Sample */}
        <div style={{ marginTop: 36, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Phone style={{ width: 20, height: 20 }} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 4px', color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Listen to Sample Nigerian AI Voice Note</h4>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>Authentic Lagos accent (en-NG Abeo / Ezinne voice models)</p>
            </div>
          </div>

          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Play style={{ width: 14, height: 14 }} /> {isPlayingAudio ? 'Playing Sample Voice...' : '▶ Listen Sample (0:15)'}
          </button>
        </div>
      </section>

      {/* ── OFFERS, PRICING & BANK TRANSFER ──────────────────────────────── */}
      <section id="offers" style={{ padding: '60px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif" }}>
            Choose Your Offer Package
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 24 }}>Transparent pricing. Instant reactivation. Cancel anytime.</p>

          {/* Toggle */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 4 }}>
            {(['subscription', 'standalone'] as const).map(type => (
              <button key={type} onClick={() => setPlanBilling(type)}
                style={{ padding: '10px 24px', borderRadius: 11, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
                  background: planBilling === type ? 'linear-gradient(135deg, #06b6d4, #8b5cf6)' : 'transparent',
                  color: planBilling === type ? '#fff' : '#64748b' }}>
                {type === 'subscription' ? '🔄 Monthly Subscription' : '♾️ One-Time License'}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 48 }}>
          {PRICING_TIERS.map(tier => {
            const isSelected = selectedPlanId === tier.id;
            const price = planBilling === 'subscription' ? tier.monthlyNGN : tier.oneTimeNGN;

            return (
              <div key={tier.id} onClick={() => setSelectedPlanId(tier.id)}
                style={{ background: tier.popular ? 'rgba(139,92,246,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${tier.popular ? '#8b5cf6' : 'rgba(255,255,255,0.08)'}`, borderRadius: 20, padding: 26, position: 'relative', cursor: 'pointer', boxShadow: isSelected ? `0 0 0 2px ${tier.color}` : 'none' }}>

                {tier.popular && (
                  <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '4px 14px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {tier.badge}
                  </div>
                )}

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>{tier.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '0 0 16px' }}>{tier.tagline}</p>

                <p style={{ fontSize: '2rem', fontWeight: 900, color: tier.color, margin: '0 0 20px', fontFamily: "'Outfit', sans-serif" }}>
                  ₦{price.toLocaleString()}
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 400 }}>{planBilling === 'subscription' ? '/mo' : ' once'}</span>
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 20 }}>
                  {tier.highlights.map(h => (
                    <div key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                      <CheckCircle style={{ width: 14, height: 14, color: tier.color, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.4 }}>{h}</span>
                    </div>
                  ))}
                </div>

                <a href={`https://wa.me/+2348022791227?text=${whatsappMessage}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px 0', borderRadius: 12, background: tier.popular ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'rgba(255,255,255,0.05)', color: '#fff', border: `1px solid ${tier.popular ? 'transparent' : tier.color + '40'}`, fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                  Select {tier.name} <ArrowRight style={{ width: 14, height: 14 }} />
                </a>
              </div>
            );
          })}
        </div>

        {/* ── INSTANT CORPORATE BANK TRANSFER BOX (NIGERIAN FRICTION KILLER) ── */}
        <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 24, padding: 'clamp(20px, 4vw, 36px)', maxWidth: 800, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontWeight: 700 }}>
              ⚡ Instant Bank Transfer Activation
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '10px 0 6px', color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
              Pay via Moniepoint / OPay Bank Transfer
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Transfer selected amount for <strong>{activePlan.name}</strong> (₦{(planBilling === 'subscription' ? activePlan.monthlyNGN : activePlan.oneTimeNGN).toLocaleString()}) to activate instantly:
            </p>
          </div>

          <div style={{ background: 'rgba(7,9,14,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#64748b' }}>Bank Name: <strong style={{ color: '#fff' }}>{bankDetails.bankName}</strong></p>
              <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#64748b' }}>Account Name: <strong style={{ color: '#fff' }}>{bankDetails.accountName}</strong></p>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#06b6d4', letterSpacing: '0.05em', fontFamily: "'Outfit', sans-serif" }}>
                {bankDetails.accountNumber}
              </p>
            </div>

            <button onClick={copyAccountNum} style={{ background: copiedBank ? '#10b981' : 'rgba(6,182,212,0.15)', color: copiedBank ? '#fff' : '#06b6d4', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 12, padding: '10px 18px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Copy style={{ width: 14, height: 14 }} /> {copiedBank ? 'Copied Account!' : 'Copy Account No.'}
            </button>
          </div>

          <div style={{ textDecoration: 'none', textAlign: 'center' }}>
            <a href={`https://wa.me/+2348022791227?text=${whatsappMessage}`} target="_blank" rel="noreferrer"
              style={{ background: '#25d366', color: '#fff', textDecoration: 'none', borderRadius: 14, padding: '14px 28px', fontWeight: 800, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 24px rgba(37,211,102,0.3)' }}>
              <MessageSquare style={{ width: 18, height: 18 }} /> Send Payment Receipt on WhatsApp →
            </a>
          </div>

        </div>
      </section>

      {/* ── LIVE INTERACTIVE SECTOR TOOL API MODAL ───────────────────────── */}
      {activeModalTool && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(6,182,212,0.4)', borderRadius: 24, padding: 28, maxWidth: 540, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}>
            
            <button onClick={() => setActiveModalTool(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
              <X style={{ width: 22, height: 22 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Zap style={{ width: 22, height: 22, color: '#06b6d4' }} />
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Outfit', sans-serif" }}>
                Live API Demo Bot: {activeModalTool.name}
              </h3>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 20 }}>
              Test this sector calculation tool live. It connects directly to our backend <code>/api/sector-tools</code> calculation engine.
            </p>

            {/* Input Form Fields per Tool Type */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
              
              {activeModalTool.actionKey === 'solar_boq' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Inverter Capacity (kVA)</label>
                    <input type="number" value={modalInputs.kva || 5} onChange={e => setModalInputs({ ...modalInputs, kva: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Battery Storage Type</label>
                    <select value={modalInputs.batteryType || 'lithium'} onChange={e => setModalInputs({ ...modalInputs, batteryType: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                      <option value="lithium">Lithium Iron Phosphate (LiFePO4)</option>
                      <option value="tubular">Tubular Deep Cycle Battery</option>
                    </select>
                  </div>
                </div>
              )}

              {activeModalTool.actionKey === 'tokunbo_duty' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Manufacture Year</label>
                    <input type="number" value={modalInputs.year || 2018} onChange={e => setModalInputs({ ...modalInputs, year: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>CIF Value (NGN)</label>
                    <input type="number" value={modalInputs.cifNgn || 8500000} onChange={e => setModalInputs({ ...modalInputs, cifNgn: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>
              )}

              {activeModalTool.actionKey === 'mortgage_amortization' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Property Selling Price (NGN)</label>
                    <input type="number" value={modalInputs.propertyPriceNgn || 45000000} onChange={e => setModalInputs({ ...modalInputs, propertyPriceNgn: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Down Payment (%)</label>
                    <input type="number" value={modalInputs.downPaymentPercent || 20} onChange={e => setModalInputs({ ...modalInputs, downPaymentPercent: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>
              )}

              {activeModalTool.actionKey === 'logistics_delivery' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Pickup Area (Lagos)</label>
                    <input type="text" value={modalInputs.originCity || 'Lagos (Ikeja)'} onChange={e => setModalInputs({ ...modalInputs, originCity: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Dropoff Area (Lagos)</label>
                    <input type="text" value={modalInputs.destinationCity || 'Lagos (Lekki)'} onChange={e => setModalInputs({ ...modalInputs, destinationCity: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>
              )}

              {/* Default inputs for other actions */}
              {!['solar_boq', 'tokunbo_duty', 'mortgage_amortization', 'logistics_delivery'].includes(activeModalTool.actionKey || '') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: 4 }}>Business Name</label>
                    <input type="text" value={modalInputs.name || businessName} onChange={e => setModalInputs({ ...modalInputs, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} />
                  </div>
                </div>
              )}

            </div>

            <button
              onClick={runLiveToolCalculation}
              disabled={isCalculating}
              style={{ width: '100%', padding: '14px', borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.95rem', cursor: isCalculating ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {isCalculating ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} /> : <Zap style={{ width: 18, height: 18 }} />}
              {isCalculating ? 'Calculating via Backend Engine...' : '▶ Run Live Calculation & AI Report'}
            </button>

            {/* Results Output Display */}
            {modalResult && (
              <div style={{ marginTop: 20, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 16, padding: 18 }}>
                <h4 style={{ margin: '0 0 10px', color: '#06b6d4', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle style={{ width: 16, height: 16 }} /> Live Output Result:
                </h4>
                <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', background: 'rgba(7,9,14,0.8)', padding: 12, borderRadius: 10, maxHeight: 200, overflowY: 'auto' }}>
                  {JSON.stringify(modalResult, null, 2)}
                </pre>
                
                <a
                  href={`https://wa.me/+2348022791227?text=${encodeURIComponent(`Hi! I just ran a live API calculation for ${activeModalTool.name}:\n\n` + JSON.stringify(modalResult, null, 2))}`}
                  target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, padding: '10px 16px', borderRadius: 10, background: '#25d366', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  <MessageSquare style={{ width: 14, height: 14 }} /> Send Calculation to My WhatsApp
                </a>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '36px clamp(16px, 4vw, 40px)', textAlign: 'center', color: '#475569', fontSize: '0.8rem' }}>
        <p style={{ margin: '0 0 8px' }}>© 2026 Bethelmind Analytics & Strategy · Lagos, Nigeria</p>
        <p style={{ margin: 0 }}>NDPR Compliant · 24/7 Automated AI Support · Moniepoint & Paystack Verified</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800;900&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; }
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
      `}</style>
    </div>
  );
}
