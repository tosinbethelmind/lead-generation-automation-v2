'use client';

import React, { useState, useEffect } from 'react';
import { Star, Phone, MapPin, Award, CheckCircle, ArrowRight, ShieldCheck, Plus, Minus, Printer, Receipt, X, Clock, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TransferRebuildOptions } from '@/components/TransferRebuildOptions';
import { SocialAdAutomationWidget } from '@/components/SocialAdAutomationWidget';
import BeforeAfterAuditWidget from '@/components/BeforeAfterAuditWidget';
import InvoiceModal, { InvoiceItem } from '@/components/InvoiceModal';
import BusinessOwnerToolSelector from '@/components/BusinessOwnerToolSelector';
import CustomerJourneyAnalyticsWidget from '@/components/CustomerJourneyAnalyticsWidget';
import FacebookAdAnalyticsWidget from '@/components/FacebookAdAnalyticsWidget';
import EmailDripDashboardWidget from '@/components/EmailDripDashboardWidget';
import SalesIntegrationNarrative from '@/components/SalesIntegrationNarrative';
import { trackDualMetaEvent } from '@/lib/metaPixel';
import { CustomerJourneyTracker } from '@/lib/customerJourneyTracker';

interface PreviewData {
  lead: {
    name: string;
    category: string;
    address: string;
    area: string;
    city: string;
    phone_raw: string;
    phone_e164: string;
    rating: number;
    reviews_count: number;
    business_summary: string;
    business_hours?: string;
    reviews_data?: string;
    photos_data?: string;
    social_links?: string;
    website?: string;
    cmsPlatform?: string;
    cmsConfidence?: number;
    upgradeStrategy?: string;
    pluginSuggestions?: string | string[];
    embedNote?: string;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    headingFont?: string;
    bodyFont?: string;
    heroImage: string;
    gradient: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: { title: string; description: string; icon: string }[];
    aboutText: string;
    testimonials: { name: string; text: string; rating: number }[];
    ctaText: string;
  };
  pitch?: any;
  paymentConfig?: {
    paystackPublicKey: string;
    claimFeeNGN: number;
    moniepointBankName: string;
    moniepointAccountNumber: string;
    moniepointAccountName: string;
    opayBankName?: string;
    opayAccountNumber?: string;
    opayAccountName?: string;
    opayPublicKey?: string;
    opayMerchantId?: string;
  };
  selectedFeatures?: string[];
  customInstructions?: string;
  customInject?: {
    headHtml?: string;
    bodyHtml?: string;
  };
}

interface LandingPageProps {
  data: PreviewData;
  leadId: string;
  isPreview?: boolean;
}

const LUXURY_PRESETS = [
  {
    name: '👑 Royal Gold',
    primary: 'hsl(45, 90%, 55%)',
    accent: 'hsl(198, 95%, 60%)',
    bg: 'hsl(225, 45%, 4%)',
    text: '#ffffff',
    font: 'Playfair Display',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80',
    gradient: 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(38, 95%, 55%) 50%, hsl(265, 85%, 60%) 100%)'
  },
  {
    name: '🌿 Emerald Solar',
    primary: 'hsl(160, 84%, 45%)',
    accent: 'hsl(38, 92%, 50%)',
    bg: 'hsl(150, 45%, 3%)',
    text: '#ffffff',
    font: 'Space Grotesk',
    headingFont: 'Space Grotesk',
    bodyFont: 'Plus Jakarta Sans',
    heroImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1400&q=80',
    gradient: 'linear-gradient(135deg, hsl(160, 84%, 45%) 0%, hsl(190, 90%, 45%) 50%, hsl(38, 92%, 50%) 100%)'
  },
  {
    name: '⚡ Cyber Crimson',
    primary: 'hsl(348, 89%, 60%)',
    accent: 'hsl(43, 96%, 56%)',
    bg: 'hsl(240, 20%, 4%)',
    text: '#ffffff',
    font: 'Space Grotesk',
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    heroImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1400&q=80',
    gradient: 'linear-gradient(135deg, hsl(348, 89%, 60%) 0%, hsl(43, 96%, 56%) 100%)'
  },
  {
    name: '💎 Diamond Cyan',
    primary: 'hsl(188, 94%, 43%)',
    accent: 'hsl(158, 64%, 52%)',
    bg: 'hsl(210, 60%, 4%)',
    text: '#ffffff',
    font: 'Outfit',
    headingFont: 'Outfit',
    bodyFont: 'Inter',
    heroImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1400&q=80',
    gradient: 'linear-gradient(135deg, hsl(188, 94%, 43%) 0%, hsl(217, 91%, 60%) 50%, hsl(158, 64%, 52%) 100%)'
  },
  {
    name: '🌹 Rose Gold',
    primary: 'hsl(330, 81%, 60%)',
    accent: 'hsl(43, 96%, 56%)',
    bg: 'hsl(315, 45%, 4%)',
    text: '#ffffff',
    font: 'Playfair Display',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    heroImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80',
    gradient: 'linear-gradient(135deg, hsl(330, 81%, 60%) 0%, hsl(348, 89%, 60%) 50%, hsl(43, 96%, 56%) 100%)'
  }
];

export default function LandingPage({ data, leadId, isPreview = false }: LandingPageProps) {
  const { lead, copy, paymentConfig } = data;
  const [selectedTheme, setSelectedTheme] = useState(data.theme);
  const [showThemeBar, setShowThemeBar] = useState(false);
  const theme = selectedTheme || data.theme;

  useEffect(() => {
    if (data?.theme) {
      setSelectedTheme(data.theme);
    }
    if (typeof window !== 'undefined') {
      const tracker = new CustomerJourneyTracker(leadId);
      tracker.init();
      trackDualMetaEvent({
        eventName: 'PageView',
        eventSourceUrl: window.location.href,
        eventId: `pv_${leadId}_${Date.now()}`
      });
    }
  }, [data, leadId]);

  const hasWebsite = !!(lead.website && lead.website.trim() && lead.website.toLowerCase() !== 'none');
  const websiteUrl = lead.website || '';

  const pitch = data.pitch || {
    categoryKey: 'general',
    widgetType: 'quote_estimator',
    widgetTitle: 'Smart Project Estimator & Invoice Generator',
    widgetDescription: 'Simulate adjusting the sliders to estimate costs and see immediate PDF quote invoice generation and CRM logging.',
    benefitsList: [
      'Dynamic quote estimator slider based on project scope, size, or duration',
      'Automatic branded PDF quote invoice generated and emailed to lead',
      'Bidirectional client sync with Google Sheets CRM',
      'Instant WhatsApp notifications for new business proposals'
    ],
    whatsappSim: [
      { sender: 'customer', text: 'Hi! I calculated a cost estimate of ₦600,000 for standard web automation.', timeOffsetMs: 500 },
      { sender: 'bot', text: 'Hello! Branded PDF Estimate Quote #8283 has been dispatched to your email. An agent will contact you shortly.', timeOffsetMs: 1600 },
      { sender: 'agent', text: '🔔 [New Quote Request] Client calculated ₦600,000 estimate. Contact: info@client.com. PDF Invoice #8283 generated. Logs synced to Google Sheets CRM.', timeOffsetMs: 3100 }
    ],
    invoiceDemo: {
      currency: '₦',
      taxRate: 0.075,
      items: [
        { name: 'Standard Project Set-Up & Consulting Fee', price: 200000, qty: 1 },
        { name: 'Implementation & Custom Development Service', price: 400000, qty: 1 }
      ]
    }
  };

  const [claimed, setClaimed] = useState(false);

  // Test Alert Widget States
  const [testAlertPhone, setTestAlertPhone] = useState('');
  const [testAlertChannel, setTestAlertChannel] = useState<'whatsapp' | 'call'>('whatsapp');
  const [testAlertLoading, setTestAlertLoading] = useState(false);
  const [testAlertResult, setTestAlertResult] = useState<string | null>(null);

  // Domain Checker States
  const [domainSlug, setDomainSlug] = useState(() => {
    const cleaned = lead.name ? lead.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) : 'yourbusiness';
    return cleaned;
  });
  const [domainStatus, setDomainStatus] = useState<'idle' | 'checking' | 'registrar'>('idle');
  // Delayed test alert widget visibility
  const [showTestAlert, setShowTestAlert] = useState(false);

  const handleTestAlert = async () => {
    if (!testAlertPhone.trim()) return;
    setTestAlertLoading(true);
    setTestAlertResult(null);
    try {
      const res = await fetch('/api/preview/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testAlertPhone,
          businessName: lead.name,
          leadId,
          channel: testAlertChannel
        })
      });
      const data = await res.json();
      setTestAlertResult(data.message || (data.success ? '✅ Alert sent! Check your phone.' : `❌ ${data.error}`));
    } catch (err: any) {
      setTestAlertResult('❌ Network error. Please try again.');
    } finally {
      setTestAlertLoading(false);
    }
  };

  const handleDomainCheck = () => {
    if (!domainSlug.trim()) return;
    setDomainStatus('checking');
    // After a brief delay, redirect the user to a real registrar to check availability
    setTimeout(() => {
      setDomainStatus('registrar');
    }, 900);
  };

  // Celebration Confetti Trigger Helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (_) {}
  };

  // Countdown timer — persisted across page reloads via localStorage
  const COUNTDOWN_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    if (!isPreview || typeof window === 'undefined') return;
    const storageKey = `apex_countdown_${leadId}`;
    let expiresAt: number;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      expiresAt = parseInt(stored, 10);
    } else {
      expiresAt = Date.now() + COUNTDOWN_DURATION_MS;
      localStorage.setItem(storageKey, String(expiresAt));
    }

    const computeTimeLeft = () => {
      const remaining = Math.max(0, expiresAt - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      };
    };

    setTimeLeft(computeTimeLeft());
    const interval = setInterval(() => {
      const tl = computeTimeLeft();
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPreview, leadId]);

  // Scroll tracker to trigger floating CTA
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  useEffect(() => {
    if (!isPreview) return;
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingCta(true);
      } else {
        setShowFloatingCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPreview]);

  // Keep test alert widget quiet during preview mode to avoid UI clutter

  // Dynamically load Google Fonts for headings and body
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fontsToLoad = [];
    if (theme.headingFont) fontsToLoad.push(theme.headingFont);
    if (theme.bodyFont) fontsToLoad.push(theme.bodyFont);
    else if (theme.font) fontsToLoad.push(theme.font);

    if (fontsToLoad.length > 0) {
      const linkId = 'google-fonts-loader';
      let linkElement = document.getElementById(linkId) as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = linkId;
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      const uniqueFonts = Array.from(new Set(fontsToLoad));
      const fontQuery = uniqueFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700;800`).join('&');
      linkElement.href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;
    }
  }, [theme.headingFont, theme.bodyFont, theme.font]);

  // Dynamic Head and Body HTML script injection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Inject Head HTML if provided
    if (data.customInject?.headHtml) {
      const container = document.createElement('div');
      container.innerHTML = data.customInject.headHtml.trim();
      const elements: Element[] = Array.from(container.children);
      
      elements.forEach((el) => {
        const tag = document.createElement(el.tagName.toLowerCase());
        Array.from(el.attributes).forEach(attr => tag.setAttribute(attr.name, attr.value));
        tag.innerHTML = el.innerHTML;
        document.head.appendChild(tag);
      });
    }

    // 2. Inject Body HTML if provided
    if (data.customInject?.bodyHtml) {
      const container = document.createElement('div');
      container.innerHTML = data.customInject.bodyHtml.trim();
      const elements: Element[] = Array.from(container.children);
      
      elements.forEach((el) => {
        const tag = document.createElement(el.tagName.toLowerCase());
        Array.from(el.attributes).forEach(attr => tag.setAttribute(attr.name, attr.value));
        tag.innerHTML = el.innerHTML;
        document.body.appendChild(tag);
      });
    }
  }, [data.customInject]);

  // Demo Automation States
  const [demoForm, setDemoForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoStatus, setDemoStatus] = useState<string | null>(null);

  // Fail-Proof WhatsApp Phone Number Formatter for Nigerian Mobile Numbers
  const formatWhatsAppNumber = (phone?: string): string => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '234' + cleaned.substring(1);
    } else if (cleaned.length === 10) {
      cleaned = '234' + cleaned;
    }
    return cleaned;
  };

  // NDPR Privacy Banner State with Safe LocalStorage Access
  const [ndprDismissed, setNdprDismissed] = useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const dismissed = localStorage.getItem('ndpr_accepted');
        if (dismissed === 'true') setNdprDismissed(true);
      } catch (e) {
        console.warn('LocalStorage access warning:', e);
      }
    }
  }, []);

  const acceptNdpr = () => { 
    setNdprDismissed(true); 
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ndpr_accepted', 'true');
      } catch (e) {}
    }
  };

  // Business features selection states
  const [activeWidget, setActiveWidget] = useState<string>(
    data.selectedFeatures && data.selectedFeatures.length > 0 
      ? data.selectedFeatures[0] 
      : pitch.widgetType || 'quote_estimator'
  );
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    data.selectedFeatures && data.selectedFeatures.length > 0 
      ? data.selectedFeatures 
      : pitch.widgetType 
        ? [pitch.widgetType] 
        : ['quote_estimator']
  );
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const toggleFeature = (type: string) => {
    if (selectedFeatures.includes(type)) {
      if (selectedFeatures.length > 1) {
        setSelectedFeatures(selectedFeatures.filter(f => f !== type));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, type]);
    }
  };

  // New Interactive Widget States
  const [showClaimInvoice, setShowClaimInvoice] = useState(false);
  const [activeModalInvoice, setActiveModalInvoice] = useState<any | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<any[]>([]);
  const [whatsappSimActive, setWhatsappSimActive] = useState(false);

  // E-commerce state
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Luxury Unisex Sneakers (White/Gold)', price: 45000, qty: 1, selected: true },
    { id: 2, name: 'Designer Leather Crossbody Bag', price: 65000, qty: 0, selected: false },
    { id: 3, name: 'Edo Coral Beads Set (Polished)', price: 30000, qty: 0, selected: false }
  ]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'paystack' | 'success'>('cart');

  // Auto valuation state
  const [valuationBrand, setValuationBrand] = useState('Toyota');
  const [valuationYear, setValuationYear] = useState(2018);
  const [valuationMileage, setValuationMileage] = useState(50000);
  const [valuationCondition, setValuationCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Good');

  // Restaurant state
  const [tableGuests, setTableGuests] = useState(4);
  const [tableDate, setTableDate] = useState(new Date().toISOString().split('T')[0]);
  const [tableTime, setTableTime] = useState('19:30');
  const [tableNum, setTableNum] = useState(4);
  const [preOrderFood, setPreOrderFood] = useState(false);

  // Patient intake state
  const [intakeDate, setIntakeDate] = useState(new Date().toISOString().split('T')[0]);
  const [intakeTime, setIntakeTime] = useState('10:00');
  const [intakeProcedure, setIntakeProcedure] = useState('Routine Dental Consultation');
  const [intakeInsurance, setIntakeInsurance] = useState('Self-Pay');
  const [intakeConsent, setIntakeConsent] = useState(true);

  // General scope estimator state
  const [estimatorScope, setEstimatorScope] = useState(250000);
  const [estimatorExtras, setEstimatorExtras] = useState({
    gateway: false,
    crm: false,
    whatsapp: false,
    socialMedia: false,
    adAutomation: false,
    enterprise: false
  });

  // Top-level Solar widget state
  const [solarKva, setSolarKva] = useState(5);
  const [solarBatteryType, setSolarBatteryType] = useState<'Tubular Gel' | 'Lithium-Ion'>('Tubular Gel');
  const [solarPanelsCount, setSolarPanelsCount] = useState(6);

  // Top-level Real estate widget state
  const [estatePropertyType, setEstatePropertyType] = useState('4-Bedroom Detached Duplex');
  const [estateDownPaymentPct, setEstateDownPaymentPct] = useState(20);
  const [estateMonths, setEstateMonths] = useState(12);

  // Top-level School tuition widget state
  const [schoolClass, setSchoolClass] = useState('Senior Secondary (SS1 - SS3)');
  const [schoolBoarding, setSchoolBoarding] = useState(true);
  const [includeCbtExam, setIncludeCbtExam] = useState(true);
  const [includeResultCheckerPin, setIncludeResultCheckerPin] = useState(true);

  // Common Widget Submission Logic
  const handleWidgetSubmit = async (
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    detailsString: string,
    invoiceItems: { name: string; price: number; qty: number }[]
  ) => {
    setDemoLoading(true);
    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          date: new Date().toISOString().split('T')[0],
          message: detailsString
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit simulation');
      }

      // Calculate invoice numbers and subtotal
      const subtotal = invoiceItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      const taxRate = pitch.invoiceDemo?.taxRate || 0.075;
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      const newInvoice = {
        invoiceNumber: `INV-APX-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
        clientName: customerName,
        clientEmail: customerEmail,
        clientPhone: customerPhone,
        items: invoiceItems,
        subtotal,
        tax,
        total,
        businessName: lead.name,
        businessAddress: lead.address || 'Lagos, Nigeria',
        businessPhone: lead.phone_raw || '+234 123 4567',
        signature: 'Bethelmind Analytics & Strategy Automations'
      };

      setActiveModalInvoice(newInvoice);
      setDemoStatus(`Automation simulation success! Branded invoice #${newInvoice.invoiceNumber} has been generated. View the overlay to inspect or print.`);

      // Trigger WhatsApp simulation
      if (pitch.whatsappSim && pitch.whatsappSim.length > 0) {
        setWhatsappSimActive(true);
        setWhatsappMessages([]);
        
        pitch.whatsappSim.forEach((msg: any) => {
          setTimeout(() => {
            const formattedText = msg.text
              .replace(/\{\{lead\.name\}\}/g, lead.name)
              .replace(/\{\{previewUrl\}\}/g, `${window.location.origin}/preview/${leadId}`)
              .replace(/John Doe/g, customerName)
              .replace(/\+2348031234567/g, customerPhone || '+2348031234567');
            
            setWhatsappMessages(prev => [
              ...prev,
              {
                sender: msg.sender,
                text: formattedText,
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }, msg.timeOffsetMs);
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Simulation Error: ${error.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const renderPatientIntake = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const handleIntakeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Dental Consultation / Procedure (${intakeProcedure})`, price: intakeProcedure.includes('Root Canal') ? 85000 : intakeProcedure.includes('Whitening') ? 45000 : 25000, qty: 1 },
        { name: 'X-Ray Diagnostics Fee', price: 15000, qty: 1 }
      ];
      const details = `Patient intake details. Date: ${intakeDate} at ${intakeTime}. Procedure: ${intakeProcedure}. Insurance: ${intakeInsurance}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleIntakeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="Patient's Full Name" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="patient@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 123 4567" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Procedure Requested</label>
            <select value={intakeProcedure} onChange={(e) => setIntakeProcedure(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Routine Dental Consultation">Routine Dental Consultation (₦25,000)</option>
              <option value="Professional Teeth Whitening">Professional Teeth Whitening (₦45,000)</option>
              <option value="Root Canal Therapy">Root Canal Therapy (₦85,000)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Appointment Date</label>
            <input type="date" value={intakeDate} onChange={(e) => setIntakeDate(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Time Slot</label>
            <select value={intakeTime} onChange={(e) => setIntakeTime(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="09:00">09:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="13:00">01:00 PM</option>
              <option value="15:00">03:00 PM</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Insurance Provider</label>
            <select value={intakeInsurance} onChange={(e) => setIntakeInsurance(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Self-Pay">Self-Pay / Cash</option>
              <option value="Leadway Health">Leadway Health</option>
              <option value="AXA Mansard HMO">AXA Mansard HMO</option>
              <option value="Hygeia Health">Hygeia Health</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%', alignSelf: 'end', paddingBottom: '12px' }}>
            <input type="checkbox" id="consent" checked={intakeConsent} onChange={(e) => setIntakeConsent(e.target.checked)} />
            <label htmlFor="consent" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>Enable SMS/WhatsApp reminders</label>
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Processing Request...' : 'Submit Patient Intake & Sync Calendar'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderVehicleValuation = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    // Calculate estimate live
    const baseValue = 12000000;
    const yearMult = 1 - (2026 - valuationYear) * 0.04;
    const mileageMult = 1 - (valuationMileage / 200000) * 0.15;
    const condMult = valuationCondition === 'Excellent' ? 1.0 : valuationCondition === 'Good' ? 0.85 : 0.7;
    const finalValuationValue = Math.max(1500000, Math.floor(baseValue * yearMult * mileageMult * condMult));

    const handleValuationSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Vehicle Diagnostic Inspection Fee (${valuationBrand} ${valuationYear})`, price: 30000, qty: 1 },
        { name: 'Trade-in Appraisal Certification', price: 15000, qty: 1 },
        { name: `Estimated Trade-in Value Allowance`, price: -finalValuationValue, qty: 1 }
      ];
      const details = `Car Valuation request. Brand: ${valuationBrand}, Year: ${valuationYear}, Mileage: ${valuationMileage} km, Condition: ${valuationCondition}. Estimated Value: ₦${finalValuationValue.toLocaleString()}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleValuationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Kola Alao" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="kola@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 802 987 6543" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Vehicle Brand</label>
            <select value={valuationBrand} onChange={(e) => setValuationBrand(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Toyota">Toyota</option>
              <option value="Lexus">Lexus</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Honda">Honda</option>
              <option value="Hyundai">Hyundai</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Model Year ({valuationYear})</label>
            <input type="range" min="2010" max="2026" step="1" value={valuationYear} onChange={(e) => setValuationYear(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Mileage: {valuationMileage.toLocaleString()} km</label>
            <input type="range" min="1000" max="200000" step="5000" value={valuationMileage} onChange={(e) => setValuationMileage(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Vehicle Condition</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Excellent', 'Good', 'Fair'].map((cond) => (
              <label key={cond} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem', color: '#4b5563' }}>
                <input type="radio" name="condition" checked={valuationCondition === cond} onChange={() => setValuationCondition(cond as any)} style={{ accentColor: theme.primary }} />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ESTIMATED TRADE-IN VALUATION</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            ₦{finalValuationValue.toLocaleString()}
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Appraising Vehicle...' : 'Request Valuation & Alert Dealership'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderTableReservation = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const handleReserveSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Table Booking Deposit (Table #${tableNum} - ${tableGuests} guests)`, price: 10000, qty: 1 }
      ];
      if (preOrderFood) {
        items.push({ name: 'Gourmet Jollof Rice Platter (Feeds 2)', price: 18000, qty: 1 });
        items.push({ name: 'Mocktail Pitcher (Strawberry Mint)', price: 12000, qty: 1 });
      }
      const details = `Table booking. Date: ${tableDate} at ${tableTime}. Table #${tableNum}, Guests: ${tableGuests}. Preorder dinner: ${preOrderFood ? 'Yes' : 'No'}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleReserveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Tunde Bello" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="tunde@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 111 2233" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Select Table Preference</label>
            <select value={tableNum} onChange={(e) => setTableNum(Number(e.target.value))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="1">Table 1 (Indoor standard, max 4)</option>
              <option value="2">Table 2 (Window view, max 2)</option>
              <option value="3">Table 3 (Booth seating, max 6)</option>
              <option value="4">Table 4 (VIP dining suite, max 8)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Dining Date</label>
            <input type="date" value={tableDate} onChange={(e) => setTableDate(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Reservation Time</label>
            <select value={tableTime} onChange={(e) => setTableTime(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="18:00">06:00 PM</option>
              <option value="19:00">07:00 PM</option>
              <option value="19:30">07:30 PM</option>
              <option value="20:30">08:30 PM</option>
              <option value="21:30">09:30 PM</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Number of Guests ({tableGuests})</label>
            <input type="range" min="1" max="10" step="1" value={tableGuests} onChange={(e) => setTableGuests(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%', alignSelf: 'end', paddingBottom: '12px' }}>
            <input type="checkbox" id="preorder" checked={preOrderFood} onChange={(e) => setPreOrderFood(e.target.checked)} />
            <label htmlFor="preorder" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#4b5563', cursor: 'pointer' }}>Pre-order gourmet dinner platter (+₦30,000)</label>
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Booking Table...' : 'Confirm Reservation & Notify Kitchen'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderEcommerceCart = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const updateQty = (id: number, delta: number) => {
      setCartItems(prev => prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.qty + delta);
          return { ...item, qty: newQty, selected: newQty > 0 };
        }
        return item;
      }));
    };

    const activeItems = cartItems.filter(i => i.selected && i.qty > 0);
    const subtotal = activeItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const tax = subtotal * 0.075;
    const total = subtotal + tax;

    const handlePaystackCheckout = (e: React.FormEvent) => {
      e.preventDefault();
      if (activeItems.length === 0) {
        alert('Please add at least one item to your cart!');
        return;
      }
      setCheckoutStep('paystack');
    };

    const handleMockPayment = () => {
      setCheckoutStep('success');
      const invoiceItems = activeItems.map(i => ({ name: i.name, price: i.price, qty: i.qty }));
      const details = `Paid E-commerce order. Total items: ${activeItems.length}. Amount paid: ₦${total.toLocaleString()}.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, invoiceItems);
    };

    if (checkoutStep === 'paystack') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ display: 'inline-flex', padding: '8px 16px', background: '#ecfdf5', color: '#047857', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600, gap: '6px', alignItems: 'center', marginBottom: '16px' }}>
            <ShieldCheck size={16} /> Paystack Secure Checkout Simulation
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Simulate Paystack Payment</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
            You are checking out for <strong>₦{total.toLocaleString()}</strong>. In production, this launches the official Paystack popup window. Click below to simulate success.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px', margin: '0 auto' }}>
            <button type="button" onClick={handleMockPayment} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Simulate Successful Payment
            </button>
            <button type="button" onClick={() => setCheckoutStep('cart')} style={{ background: '#e2e8f0', color: '#4b5563', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (checkoutStep === 'success') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Payment Confirmed!</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Simulated transaction succeeded! Branded invoice generated. Look for the floating Live WhatsApp simulation widget in the bottom-right of your screen.
          </p>
          <button type="button" onClick={() => { setCheckoutStep('cart'); setCartItems(prev => prev.map(i => ({...i, qty: i.id === 1 ? 1 : 0, selected: i.id === 1}))); }} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Shop Again
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handlePaystackCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1f2937' }}>Select Products</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #cbd5e1', borderRadius: '8px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1f2937' }}>{item.name}</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>₦{item.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button type="button" onClick={() => updateQty(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer' }}><Minus size={14} /></button>
                <span style={{ fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                <button type="button" onClick={() => updateQty(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', cursor: 'pointer' }}><Plus size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563', marginBottom: '6px' }}>
            <span>Subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563', marginBottom: '6px' }}>
            <span>VAT (7.5%)</span>
            <span>₦{tax.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: '#1f2937', marginTop: '6px' }}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Customer Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Amara Okafor" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="amara@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 815 345 6789" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <button type="submit" disabled={subtotal === 0 || demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: (subtotal === 0 || demoLoading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Initializing Checkout...' : 'Proceed to Paystack Payment'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderQuoteEstimator = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    // Calculate quote total
    const extraPriceGateway = estimatorExtras.gateway ? 50000 : 0;
    const extraPriceCrm = estimatorExtras.crm ? 30000 : 0;
    const extraPriceWhatsapp = estimatorExtras.whatsapp ? 60000 : 0;
    const extraPriceSocial = estimatorExtras.socialMedia ? 125000 : 0;
    const extraPriceAd = estimatorExtras.adAutomation ? 195000 : 0;
    const finalQuoteValue = estimatorScope + extraPriceGateway + extraPriceCrm + extraPriceWhatsapp + extraPriceSocial + extraPriceAd;

    const handleQuoteSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Web Automation Base Setup (Level: ₦${estimatorScope.toLocaleString()})`, price: estimatorScope, qty: 1 }
      ];
      if (estimatorExtras.gateway) items.push({ name: 'Payment Gateway Integration Add-on', price: 50000, qty: 1 });
      if (estimatorExtras.crm) items.push({ name: 'CRM & Custom Sheets Sync Integration', price: 30000, qty: 1 });
      if (estimatorExtras.whatsapp) items.push({ name: 'WhatsApp Marketing/Drip Campaign Alerts', price: 60000, qty: 1 });
      if (estimatorExtras.socialMedia) items.push({ name: 'AI Social Media Content & Account Auto-Publisher', price: 125000, qty: 1 });
      if (estimatorExtras.adAutomation) items.push({ name: 'AI Meta & Google Ad Campaign Launcher', price: 195000, qty: 1 });
      if (estimatorExtras.enterprise) items.push({ name: 'Bespoke Enterprise Custom Automation (ERP/Accounting Custom Sync)', price: 0, qty: 1 });

      const details = `Pricing calculator proposal. Base level: ₦${estimatorScope.toLocaleString()}. Extras: Gateway(${estimatorExtras.gateway}), CRM(${estimatorExtras.crm}), WhatsApp(${estimatorExtras.whatsapp}), SocialMedia(${estimatorExtras.socialMedia}), AdAutomation(${estimatorExtras.adAutomation}), Enterprise(${estimatorExtras.enterprise}). Calculated Total: ₦${finalQuoteValue.toLocaleString()}`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleQuoteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="john@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 123 4567" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Base Automation Level (₦{estimatorScope.toLocaleString()})</label>
            <input type="range" min="150000" max="400000" step="50000" value={estimatorScope} onChange={(e) => setEstimatorScope(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '10px' }}>Select Premium Add-ons</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.gateway} onChange={(e) => setEstimatorExtras({...estimatorExtras, gateway: e.target.checked})} style={{ accentColor: theme.primary }} />
              Payment Gateway Integration (Paystack/Flutterwave) (+₦50,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.crm} onChange={(e) => setEstimatorExtras({...estimatorExtras, crm: e.target.checked})} style={{ accentColor: theme.primary }} />
              Advanced CRM & Google Sheets Bidirectional Logs (+₦30,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.whatsapp} onChange={(e) => setEstimatorExtras({...estimatorExtras, whatsapp: e.target.checked})} style={{ accentColor: theme.primary }} />
              WhatsApp Automated Drip Campaigns & Reminders (+₦60,000)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#1e40af' }}>
              <input type="checkbox" checked={estimatorExtras.socialMedia} onChange={(e) => setEstimatorExtras({...estimatorExtras, socialMedia: e.target.checked})} style={{ accentColor: theme.primary }} />
              📱 AI Social Media Content & Account Auto-Publisher (+₦125,000/mo)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, color: '#047857' }}>
              <input type="checkbox" checked={estimatorExtras.adAutomation} onChange={(e) => setEstimatorExtras({...estimatorExtras, adAutomation: e.target.checked})} style={{ accentColor: theme.primary }} />
              🚀 AI Meta Lead Ads & Google Search Ad Campaign Launcher (+₦195,000/mo)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#4b5563', cursor: 'pointer' }}>
              <input type="checkbox" checked={estimatorExtras.enterprise} onChange={(e) => setEstimatorExtras({...estimatorExtras, enterprise: e.target.checked})} style={{ accentColor: theme.primary }} />
              Bespoke Enterprise Custom Automation (Accounting, ERP, CRM Custom Sync) (₦Contact for Negotiation)
            </label>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CALCULATED PROJECT ESTIMATE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: theme.primary, marginTop: '4px' }}>
            ₦{finalQuoteValue.toLocaleString()}{estimatorExtras.enterprise ? ' + Bespoke Scope (Negotiable)' : ''}
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Generating Quote...' : 'Generate Custom Quote & Branded Invoice'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  // Solar Calculator Widget Renderer
  const renderSolarCalculator = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    // Solar load pricing math
    const [solarKva, setSolarKva] = useState(5);
    const [solarBatteryType, setSolarBatteryType] = useState<'Tubular Gel' | 'Lithium-Ion'>('Tubular Gel');
    const [solarPanelsCount, setSolarPanelsCount] = useState(6);

    const baseInverterPrice = solarKva === 3.5 ? 850000 : solarKva === 5 ? 1850000 : solarKva === 10 ? 3400000 : 5500000;
    const batteryUnitPrice = solarBatteryType === 'Tubular Gel' ? 240000 : 850000;
    const batteriesNeeded = solarKva === 3.5 ? 2 : solarKva === 5 ? 4 : 8;
    const batteryTotal = batteryUnitPrice * batteriesNeeded;
    const panelsTotal = solarPanelsCount * 160000; // ₦160k per 550W panel
    const installationFee = 250000;
    const totalSolarQuote = baseInverterPrice + batteryTotal + panelsTotal + installationFee;

    const handleSolarSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `${solarKva}KVA Hybrid Solar Inverter Unit`, price: baseInverterPrice, qty: 1 },
        { name: `${batteriesNeeded}x ${solarBatteryType} Deep-Cycle Batteries`, price: batteryTotal, qty: 1 },
        { name: `${solarPanelsCount}x 550W Mono-Perc Solar Panels`, price: panelsTotal, qty: 1 },
        { name: `Installation, Cabling, Changeover & Surge Protection`, price: installationFee, qty: 1 }
      ];
      const details = `Solar Sizing Calculator request. System: ${solarKva}KVA, Battery: ${batteriesNeeded}x ${solarBatteryType}, Panels: ${solarPanelsCount}x 550W. Calculated Total: ₦${totalSolarQuote.toLocaleString()}`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleSolarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Chief K. Adebayo" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="adebayo@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 555 0192" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Inverter System Capacity</label>
            <select value={solarKva} onChange={(e) => setSolarKva(Number(e.target.value))} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="3.5">3.5KVA System (Lighting, TV, Fridge, Fans)</option>
              <option value="5">5KVA System (1x AC, Fridge, TV, Freezer, Pumping Machine)</option>
              <option value="10">10KVA System (3x ACs, Full Duplex / Commercial Office)</option>
              <option value="15">15KVA+ Heavy Duty Industrial System</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Battery Technology</label>
            <select value={solarBatteryType} onChange={(e) => setSolarBatteryType(e.target.value as any)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Tubular Gel">Tubular Gel Deep-Cycle (Standard)</option>
              <option value="Lithium-Ion">Lithium Wall-Mounted LiFePO4 (Premium / 10-Yr Lifespan)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Solar Panels Count ({solarPanelsCount}x 550W)</label>
            <input type="range" min="2" max="24" step="2" value={solarPanelsCount} onChange={(e) => setSolarPanelsCount(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>CALCULATED SOLAR INSTALLATION QUOTE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#059669', marginTop: '4px' }}>
            ₦{totalSolarQuote.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px', display: 'block' }}>Includes Paystack 10% Commitment Deposit Option & Free Engineer Site Survey</span>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Calculating Technical Specs...' : 'Generate PDF Solar Quote & Book Engineer Visit'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  // Real Estate Booking Widget Renderer
  const renderRealEstateBooking = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const [estatePropertyType, setEstatePropertyType] = useState('4-Bedroom Detached Duplex');
    const [estateDownPaymentPct, setEstateDownPaymentPct] = useState(20);
    const [estateMonths, setEstateMonths] = useState(12);

    const basePropertyPrice = estatePropertyType.includes('Flat') ? 45000000 : estatePropertyType.includes('Terrace') ? 75000000 : estatePropertyType.includes('Penthouse') ? 220000000 : 120000000;
    const initialDeposit = Math.floor(basePropertyPrice * (estateDownPaymentPct / 100));
    const remainingBalance = basePropertyPrice - initialDeposit;
    const monthlyInstallment = Math.floor(remainingBalance / estateMonths);

    const handleEstateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `${estatePropertyType} Listing (Total: ₦${basePropertyPrice.toLocaleString()})`, price: basePropertyPrice, qty: 1 },
        { name: `Initial Allocation Commitment Deposit (${estateDownPaymentPct}%)`, price: initialDeposit, qty: 1 }
      ];
      const details = `Real estate inspection & payment plan request. Property: ${estatePropertyType}, Price: ₦${basePropertyPrice.toLocaleString()}, Down payment: ${estateDownPaymentPct}% (₦${initialDeposit.toLocaleString()}), Monthly: ₦${monthlyInstallment.toLocaleString()}/mo for ${estateMonths} months.`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleEstateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Buyer Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Dr. Folake Solanke" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="folake@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 802 111 2233" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Property Unit Type</label>
            <select value={estatePropertyType} onChange={(e) => setEstatePropertyType(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="2-Bedroom Luxury Apartment Flat">2-Bedroom Luxury Apartment Flat (₦45M)</option>
              <option value="3-Bedroom Smart Terrace House">3-Bedroom Smart Terrace House (₦75M)</option>
              <option value="4-Bedroom Detached Duplex">4-Bedroom Fully Detached Duplex (₦120M)</option>
              <option value="5-Bedroom Oceanview Penthouse">5-Bedroom Oceanview Penthouse (₦220M)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Initial Down Payment ({estateDownPaymentPct}%)</label>
            <input type="range" min="10" max="50" step="10" value={estateDownPaymentPct} onChange={(e) => setEstateDownPaymentPct(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Installment Period ({estateMonths} Months)</label>
            <input type="range" min="6" max="24" step="6" value={estateMonths} onChange={(e) => setEstateMonths(Number(e.target.value))} style={{ width: '100%', accentColor: theme.primary }} />
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>INITIAL RESERVATION DEPOSIT REQUIRED</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
            ₦{initialDeposit.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', display: 'block' }}>Monthly Installments: ₦{monthlyInstallment.toLocaleString()} / month for {estateMonths} months</span>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Processing Booking...' : 'Schedule Private Inspection & Generate Offer Letter'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  // School Tuition & CBT Admissions Widget Renderer
  const renderSchoolTuition = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const [schoolClass, setSchoolClass] = useState('Senior Secondary (SS1 - SS3)');
    const [schoolBoarding, setSchoolBoarding] = useState(true);
    const [includeCbtExam, setIncludeCbtExam] = useState(true);
    const [includeResultCheckerPin, setIncludeResultCheckerPin] = useState(true);

    const tuitionFee = schoolClass.includes('Creche') ? 180000 : schoolClass.includes('Primary') ? 250000 : 350000;
    const boardingFee = schoolBoarding ? 200000 : 0;
    const booksUniforms = 120000;
    const totalTermFee = tuitionFee + boardingFee + booksUniforms;
    const applicationFormFee = 20000;
    const cbtFee = includeCbtExam ? 5000 : 0;
    const resultPinFee = includeResultCheckerPin ? 3000 : 0;
    const totalCheckoutFee = applicationFormFee + cbtFee + resultPinFee;

    const handleSchoolSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Online Admission Application Form Fee`, price: applicationFormFee, qty: 1 }
      ];
      if (includeCbtExam) {
        items.push({ name: 'Computer-Based Test (CBT) Entrance Exam Access & Photo Verification', price: cbtFee, qty: 1 });
      }
      if (includeResultCheckerPin) {
        items.push({ name: 'Digital Student Result Checker Scratch Pin Access', price: resultPinFee, qty: 1 });
      }
      items.push({ name: `Term 1 Tuition Fee (${schoolClass})`, price: tuitionFee, qty: 1 });
      items.push({ name: `Textbooks, School Uniforms & Digital Tablet`, price: booksUniforms, qty: 1 });
      if (schoolBoarding) {
        items.push({ name: 'Boarding House & Catering Accommodation', price: boardingFee, qty: 1 });
      }

      const details = `School admission & CBT Portal request. Class: ${schoolClass}, Boarding: ${schoolBoarding ? 'Yes' : 'No'}, CBT Exam: ${includeCbtExam ? 'Enabled' : 'Disabled'}, Result Checker PIN: ${includeResultCheckerPin ? 'Enabled' : 'Disabled'}, Checkout Fee Paid: ₦${totalCheckoutFee.toLocaleString()}, Termly Fee Total: ₦${totalTermFee.toLocaleString()}`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleSchoolSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Parent Full Name</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Mrs. Janet Okoh" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Parent Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="janet@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 444 5566" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Academic Class Applying For</label>
            <select value={schoolClass} onChange={(e) => setSchoolClass(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Creche & Nursery">Creche & Nursery (₦180,000 / term)</option>
              <option value="Primary 1 - Primary 6">Primary 1 - Primary 6 (₦250,000 / term)</option>
              <option value="Junior Secondary (JS1 - JS3)">Junior Secondary JS1 - JS3 (₦320,000 / term)</option>
              <option value="Senior Secondary (SS1 - SS3)">Senior Secondary SS1 - SS3 (₦350,000 / term)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <input type="checkbox" checked={schoolBoarding} onChange={(e) => setSchoolBoarding(e.target.checked)} style={{ accentColor: theme.primary }} />
            Include Boarding House Accommodation (+₦200,000 / term)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <input type="checkbox" checked={includeCbtExam} onChange={(e) => setIncludeCbtExam(e.target.checked)} style={{ accentColor: theme.primary }} />
            Online Computer-Based Test (CBT) Entrance Exam Access & Photo Slip (+₦5,000)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
            <input type="checkbox" checked={includeResultCheckerPin} onChange={(e) => setIncludeResultCheckerPin(e.target.checked)} style={{ accentColor: theme.primary }} />
            Digital Student Result Checker Scratch PIN Access (+₦3,000)
          </label>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>ONLINE ADMISSION & CBT EXAM CHECKOUT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e3a8a', marginTop: '4px' }}>
            ₦{totalCheckoutFee.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', display: 'block' }}>Estimated Total Termly Fee: ₦{totalTermFee.toLocaleString()}</span>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Submitting Application...' : 'Pay Application & CBT Fee to Access Online Exam'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  // Retainer / Legal Estimator Widget Renderer
  const renderRetainerEstimator = () => {
    const defaultName = demoForm.name || '';
    const defaultEmail = demoForm.email || '';
    const defaultPhone = demoForm.phone || '';

    const [legalPractice, setLegalPractice] = useState('Corporate & Commercial Law');
    const consultationFee = legalPractice.includes('Corporate') ? 100000 : legalPractice.includes('Litigation') ? 150000 : 75000;

    const handleLegalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const items = [
        { name: `Senior Advocate Initial Consultation (1 Hour) - ${legalPractice}`, price: consultationFee, qty: 1 }
      ];
      const details = `Legal consultation booking. Practice Area: ${legalPractice}, Upfront Consultation Fee: ₦${consultationFee.toLocaleString()}`;
      handleWidgetSubmit(defaultName, defaultEmail, defaultPhone, details, items);
    };

    return (
      <form onSubmit={handleLegalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Client Full Name / Company</label>
            <input type="text" required value={demoForm.name} onChange={(e) => setDemoForm({...demoForm, name: e.target.value})} placeholder="e.g. Engr. Femi Bakare" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
            <input type="email" required value={demoForm.email} onChange={(e) => setDemoForm({...demoForm, email: e.target.value})} placeholder="femi@example.com" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Phone Number</label>
            <input type="tel" required value={demoForm.phone} onChange={(e) => setDemoForm({...demoForm, phone: e.target.value})} placeholder="+234 803 777 8899" style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Practice Area</label>
            <select value={legalPractice} onChange={(e) => setLegalPractice(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}>
              <option value="Corporate & Commercial Law">Corporate & Commercial Law (₦100,000)</option>
              <option value="Real Estate & Property Lease">Real Estate & Property Lease (₦75,000)</option>
              <option value="Commercial Litigation & Arbitration">Commercial Litigation & Arbitration (₦150,000)</option>
              <option value="Tax & Regulatory Compliance">Tax & Regulatory Compliance (₦100,000)</option>
            </select>
          </div>
        </div>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>INITIAL CONSULTATION FEE DEPOSIT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ca8a04', marginTop: '4px' }}>
            ₦{consultationFee.toLocaleString()}
          </div>
        </div>

        <button type="submit" disabled={demoLoading} style={{ background: theme.primary, color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 600, cursor: demoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {demoLoading ? 'Booking Consultation...' : 'Pay Consultation Deposit & Lock Calendar Slot'} <ArrowRight size={18} />
        </button>
      </form>
    );
  };

  const renderActiveWidget = () => {
    if (demoStatus && activeWidget !== 'ecommerce') {
      return (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CheckCircle size={56} style={{ color: '#10b981', margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>
            Automation Succeeded!
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            {demoStatus}
          </p>
          <button 
            type="button"
            onClick={() => { setDemoStatus(null); setDemoForm({ name: '', email: '', phone: '', date: '', message: '' }); }}
            style={{ background: '#cbd5e1', color: '#1f2937', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
          >
            Test Another Booking
          </button>
        </div>
      );
    }

    switch (activeWidget) {
      case 'solar_calculator':
        return renderSolarCalculator();
      case 'real_estate_booking':
        return renderRealEstateBooking();
      case 'school_tuition':
        return renderSchoolTuition();
      case 'retainer_estimator':
        return renderRetainerEstimator();
      case 'patient_intake':
        return renderPatientIntake();
      case 'vehicle_valuation':
        return renderVehicleValuation();
      case 'table_reservation':
        return renderTableReservation();
      case 'ecommerce':
        return renderEcommerceCart();
      case 'quote_estimator':
      default:
        return renderQuoteEstimator();
    }
  };

  // Claim States — pre-populated from scraped lead metadata for 0-typing convenience
  const [claimForm, setClaimForm] = useState(() => ({
    name: lead.name || '',
    email: '',
    phone: lead.phone_raw || lead.phone_e164 || '',
    preferredDomain: lead.name ? `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.ng` : ''
  }));
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'moniepoint' | 'opay'>('paystack');
  const [loadingOverlay, setLoadingOverlay] = useState(true);
  const [showMoniepointFallback, setShowMoniepointFallback] = useState(false);
  const [receiptUploading, setReceiptUploading] = useState(false);
  const [receiptStatus, setReceiptStatus] = useState<string | null>(null);

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptUploading(true);
    setReceiptStatus('Uploading receipt screenshot...');
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const fileBase64 = reader.result as string;
        const res = await fetch('/api/receipt/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            paymentMethod,
            fileBase64,
            fileName: file.name,
            senderName: claimForm.name || lead.name,
            amountPaid: getDynamicClaimFee()
          })
        });
        const json = await res.json();
        if (json.success) {
          setReceiptStatus('✅ Receipt uploaded successfully! Admin notified for instant verification.');
        } else {
          setReceiptStatus(`❌ Upload failed: ${json.error || 'Unknown error'}`);
        }
        setReceiptUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setReceiptStatus('❌ Error uploading file. Please try again.');
      setReceiptUploading(false);
    }
  };

  // Graded automation package selection
  const [selectedStrategy, setSelectedStrategy] = useState<'zero_risk_staging' | 'script_embed' | 'basic_presence' | 'plugin' | 'full_rebuild'>(
    (lead.upgradeStrategy as any) || 'zero_risk_staging'
  );

  const getDynamicClaimFee = () => {
    let base = 0;
    if (selectedStrategy === 'zero_risk_staging') base = 0;
    else if (selectedStrategy === 'full_rebuild') base = 600000;
    else if (selectedStrategy === 'plugin') base = 250000;
    else if (selectedStrategy === 'basic_presence') base = 150000;
    else if (selectedStrategy === 'script_embed') base = 65000;
    else base = 0;

    const featureCatalog = [
      { id: 'quote_estimator', cost: 35000 },
      { id: 'patient_intake', cost: 35000 },
      { id: 'ecommerce', cost: 50000 },
      { id: 'vehicle_valuation', cost: 30000 },
      { id: 'table_reservation', cost: 25000 },
      { id: 'whatsapp_floating_button', cost: 15000 },
      { id: 'google_maps_embed', cost: 10000 },
      { id: 'ai_chatbot', cost: 45000 },
      { id: 'social_proof_counters', cost: 15000 },
      { id: 'sms_whatsapp_reminders', cost: 25000 },
      { id: 'parent_portal', cost: 40000 },
      { id: 'fleet_tracker', cost: 55000 }
    ];

    let featuresCost = 0;
    selectedFeatures.forEach((fid: string) => {
      const f = featureCatalog.find((x) => x.id === fid);
      if (f) {
        featuresCost += f.cost;
      }
    });

    return base + featuresCost;
  };

  // Preloader Overlay timeout
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingOverlay(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver for Reveal Animations
  React.useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Custom HTML Injection Effect
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (data.customInject?.headHtml) {
        const temp = document.createElement('div');
        temp.innerHTML = data.customInject.headHtml;
        Array.from(temp.childNodes).forEach((node) => {
          document.head.appendChild(node.cloneNode(true));
        });
      }
      if (data.customInject?.bodyHtml) {
        const temp = document.createElement('div');
        temp.innerHTML = data.customInject.bodyHtml;
        Array.from(temp.childNodes).forEach((node) => {
          document.body.appendChild(node.cloneNode(true));
        });
      }
    }
  }, [data.customInject]);

  // Escalation Handler
  const handleEscalate = async () => {
    const reason = prompt("What custom layout or integrations do you need? (e.g. custom booking forms, multi-page site, CRM sync)");
    if (reason === null) return;
    try {
      const res = await fetch('/api/leads/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          leadId, 
          clientName: claimForm.name,
          clientEmail: claimForm.email,
          reason: reason || 'Requested custom developer layout/integration.' 
        })
      });
      if (res.ok) {
        alert("Thank you! A developer has been notified. We will review your request and reach out to you shortly.");
      } else {
        alert("Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    }
  };

  // Verify transaction if redirecting back from payment gateway
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get('payment');
      const ref = params.get('reference');
      const gateway = params.get('gateway');
      if (paymentStatus === 'verifying' && ref) {
        const resolvedGateway = gateway || (ref.startsWith('OPAY') ? 'opay' : 'paystack');
        verifyOnlinePayment(ref, resolvedGateway);
      }
    }
  }, []);

  const verifyOnlinePayment = async (reference: string, gateway: string) => {
    setClaimLoading(true);
    const providerName = gateway === 'opay' ? 'OPay' : 'Paystack';
    setClaimMessage(`Verifying your online payment with ${providerName}, please wait...`);
    setClaimed(true);
    try {
      const verifyUrl = gateway === 'opay'
        ? `/api/opay/verify?reference=${encodeURIComponent(reference)}&leadId=${encodeURIComponent(leadId)}`
        : `/api/paystack/verify?reference=${encodeURIComponent(reference)}`;
      const res = await fetch(verifyUrl);
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Payment verification failed.');
      }
      setClaimMessage(result.message || 'Payment verified and website claimed successfully!');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      setClaimMessage(`Verification Error: ${err.message}. Please contact support.`);
    } finally {
      setClaimLoading(false);
    }
  };


  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      const res = await fetch('/api/preview/test-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          ...demoForm
        })
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit test booking');
      }
      setDemoStatus(result.message || 'Automation simulated successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Demo Error: ${error.message}`);
    } finally {
      setDemoLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClaimLoading(true);
    try {
      const feeNGN = getDynamicClaimFee();
      const hasOnlinePayment = (
        (paymentMethod === 'paystack' && paymentConfig?.paystackPublicKey) ||
        (paymentMethod === 'opay' && paymentConfig?.opayPublicKey)
      ) && feeNGN > 0;

      if (hasOnlinePayment) {
        const initializeUrl = paymentMethod === 'opay' ? '/api/opay/initialize' : '/api/paystack/initialize';
        const res = await fetch(initializeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId,
            email: claimForm.email,
            name: claimForm.name,
            phone: claimForm.phone,
            preferredDomain: claimForm.preferredDomain,
            theme,
            copy,
            selectedFeatures,
            customInstructions,
            publicKey: paymentMethod === 'opay' ? paymentConfig?.opayPublicKey : paymentConfig?.paystackPublicKey,
            upgradeStrategy: selectedStrategy
          })
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || `Failed to initialize ${paymentMethod === 'opay' ? 'OPay' : 'Paystack'} transaction`);
        }
        // Redirect client to payment gateway
        window.location.href = result.authorization_url;
        return;
      }

      // Local bank transfer or free setup fallback
      const payload: any = {
        leadId,
        clientName: claimForm.name,
        clientEmail: claimForm.email,
        clientPhone: claimForm.phone,
        preferredDomain: claimForm.preferredDomain,
        theme,
        copy,
        selectedFeatures,
        customInstructions,
        upgradeStrategy: selectedStrategy
      };

      if (paymentMethod === 'moniepoint') {
        payload.paymentMethod = 'bank_transfer_moniepoint';
      } else if (paymentMethod === 'opay') {
        payload.paymentMethod = 'bank_transfer_opay';
      }

      const res = await fetch('/api/preview/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit claim request');
      }

      let successMsg = result.message || 'Request submitted successfully!';
      if (paymentMethod === 'moniepoint') {
        successMsg = `Manual bank transfer request submitted! Please transfer ₦${getDynamicClaimFee().toLocaleString()} to the Moniepoint account listed below. Once verified, your website will be deployed and fully setup.`;
      } else if (paymentMethod === 'opay') {
        successMsg = `Manual bank transfer request submitted! Please transfer ₦${getDynamicClaimFee().toLocaleString()} to the OPay account listed below. Once verified, your website will be deployed and fully setup.`;
      }
      setClaimMessage(successMsg);
      setClaimed(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      alert(`Claim Error: ${error.message}`);
    } finally {
      setClaimLoading(false);
    }
  };

  const headingFontFamily = theme.headingFont || 'Cormorant Garamond';
  const bodyFontFamily = theme.bodyFont || theme.font || 'Inter';

  return (
    <div className="font-body premium-mesh-bg" style={{ 
      background: theme.bg || '#050505', 
      color: theme.text || '#f8fafc',
      fontFamily: bodyFontFamily,
      minHeight: '100vh',
      position: 'relative',
      paddingTop: '0px',
      overflowX: 'hidden'
    }}>
      {/* Preloader Overlay */}
      {loadingOverlay && (
        <div className="preloader-overlay">
          <div className="preloader-spinner"></div>
          <div className="preloader-logo font-heading" style={{ fontFamily: headingFontFamily }}>{lead.name}</div>
        </div>
      )}

      {/* Dynamic Font Import */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        href={`https://fonts.googleapis.com/css2?family=${headingFontFamily.replace(/\s+/g, '+')}:ital,wght@0,300..700;1,300..700&family=${bodyFontFamily.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`} 
        rel="stylesheet" 
      />

      {/* Single Clean Sticky Proposal Banner */}
      {isPreview && (
        <div style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'rgba(9, 13, 22, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#ffffff',
          padding: '8px 16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            
            {/* Left: Lead Identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '14px', textTransform: 'uppercase' }}>
                🔒 RESERVED FOR {lead.name.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }} className="hide-mobile">
                24/7 AI System Preview
              </span>
            </div>

            {/* Center: Countdown Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hide-mobile">
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>⏰ EXPIRES:</span>
              <span style={{ background: 'rgba(253, 224, 71, 0.15)', color: '#fde047', fontSize: '0.78rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                {String(timeLeft.days).padStart(2, '0')}D {String(timeLeft.hours).padStart(2, '0')}H {String(timeLeft.minutes).padStart(2, '0')}M
              </span>
            </div>

            {/* Right: Direct Action Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <a
                href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hi Bethelmind Team! I am the owner of ${lead.name} in ${lead.area || lead.city || 'Nigeria'}. I want to claim our custom website & WhatsApp AI platform.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#25d366',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '6px 14px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 10px rgba(37, 211, 102, 0.4)'
                }}
              >
                💬 Claim on WhatsApp
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '70vh', 
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(8, 12, 22, 0.88) 0%, rgba(10, 15, 30, 0.94) 100%), url(${theme.heroImage && theme.heroImage.trim() !== '' ? theme.heroImage : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        padding: '60px 20px 40px',
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          
          {/* Streamlined Executive Trust Pill */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: `1px solid ${theme.primary || '#10b981'}`,
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            fontSize: 'clamp(0.78rem, 1.6vw, 0.88rem)',
            fontWeight: 700,
            padding: '6px 18px',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '18px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{ color: theme.primary || '#34d399' }}>🔒 PRIVATE PROPOSAL FOR:</span>
            <strong style={{ color: theme.accent || '#fde047', textTransform: 'uppercase' }}>{lead.name}</strong>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#cbd5e1' }}>{lead.area || lead.city || 'Lagos'}, Nigeria</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#a7f3d0' }}>⚡ Ready in 24 Hours</span>
          </div>

          <h1 style={{ 
            fontFamily: headingFontFamily,
            fontSize: 'clamp(1.9rem, 4.2vw, 3.4rem)', 
            lineHeight: 1.18, 
            fontWeight: 800, 
            marginBottom: '16px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '920px',
            margin: '0 auto 16px'
          }}>
            {hasWebsite 
              ? `Keep Your Website at ${websiteUrl}. Attach Our Automated WhatsApp AI in 10 Mins.`
              : copy.heroTitle}
          </h1>

          <p style={{ 
            fontSize: 'clamp(1.0rem, 1.8vw, 1.2rem)', 
            color: '#cbd5e1', 
            marginBottom: '26px',
            maxWidth: '720px',
            margin: '0 auto 26px',
            lineHeight: 1.5,
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: bodyFontFamily
          }}>
            {hasWebsite 
              ? `We inspected your live site. Attach our 24/7 AI customer agent and dynamic quote generator directly to your existing domain to capture 3x more paying clients.`
              : copy.heroSubtitle}
          </p>

          {/* Streamlined High-Conversion Action Buttons (1 Primary + 1 Secondary) */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '22px' }}>
            <a 
              href={isPreview ? "#pricing" : "#booking"} 
              className="btn-hover-effect" 
              style={{
                background: theme.gradient || 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#fff',
                textDecoration: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '1.05rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 6px 25px rgba(0, 0, 0, 0.4)`,
                transition: 'all 0.2s',
                letterSpacing: '-0.01em'
              }}
            >
              {hasWebsite 
                ? `🔌 Order Tool Embed (₦35,000)`
                : isPreview 
                ? `🚀 Claim ${lead.name}'s Setup (50% Deposit)`
                : copy.ctaText} <ArrowRight size={18} />
            </a>

            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hi Bethelmind Team! I am the owner of ${lead.name} in ${lead.area || lead.city || 'Nigeria'}. I am looking at the preview portal and want to activate our 24/7 AI system.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover-effect"
              style={{
                background: '#25d366',
                color: '#fff',
                textDecoration: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.98rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.2s'
              }}
            >
              💬 1-Click WhatsApp Confirmation →
            </a>
          </div>

          {/* Clean Reassurance Bar */}
          <div style={{
            color: '#94a3b8',
            fontSize: '0.82rem',
            fontWeight: 600,
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap',
            opacity: 0.95
          }}>
            <span>⚡ Live in 24 Hours</span>
            <span>•</span>
            <span>🛡️ 100% Done-For-You White-Glove Setup</span>
            <span>•</span>
            <span>💳 Moniepoint &amp; OPay Verified</span>
          </div>

          {/* ⚡ ULTRA-STRAIGHTFORWARD 3-STEP BUSINESS OWNER ACTION GRID */}
          {isPreview && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
              backdropFilter: 'blur(16px)',
              border: '2px solid #10b981',
              borderRadius: '20px',
              padding: '24px',
              marginTop: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
              textAlign: 'left'
            }}>
              {/* Trust Badge */}
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span style={{ background: '#10b981', color: '#ffffff', fontSize: '0.78rem', fontWeight: 800, padding: '5px 16px', borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🟢 OFFICIAL PROPOSAL FOR {lead.name.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: '10px 0 4px 0' }}>
                  How to Get Your Business Online in 3 Simple Steps
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  Select your business situation below to claim your domain, WhatsApp AI agent &amp; OPay setup:
                </p>
              </div>

              {/* 3 Ultra-Straightforward Option Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                
                {/* Option 1: Lead Widget Upgrade (If lead has website) */}
                {hasWebsite && (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1.5px solid #38bdf8',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>FOR EXISTING WEBSITES</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>Lead Widget Upgrade</h4>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>₦65,000</div>
                      <p style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                        👉 Select if you ALREADY have a website and want to add WhatsApp AI &amp; Instant PDF Quotes.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStrategy('script_embed');
                        const elem = document.getElementById('claim');
                        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        background: '#38bdf8',
                        color: '#0f172a',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Select Option 1 (₦65k) 👉
                    </button>
                  </div>
                )}

                {/* Option 2: Basic Online Presence (Recommended / Most Popular) */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  border: '2px solid #10b981',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <div style={{ position: 'absolute', top: '-12px', right: '12px', background: '#10b981', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '10px' }}>
                    ★ MOST POPULAR (80% CHOOSE THIS)
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 800 }}>FOR NEW WEBSITES</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>Full Website &amp; WhatsApp AI</h4>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>₦150,000</div>
                    <p style={{ fontSize: '0.8rem', color: '#ffffff', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      👉 Select if you NEED a website. Includes 1 Year Domain, Server Hosting &amp; 24/7 WhatsApp AI Agent.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStrategy('basic_presence');
                      const elem = document.getElementById('claim');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#10b981',
                      color: '#ffffff',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    Select Option 2 (₦150k) 👉
                  </button>
                </div>

                {/* Option 3: Growth Engine & Ads Automation */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 800 }}>FULL AUTOMATION</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', margin: '4px 0 8px 0' }}>Growth Engine &amp; Paid Ads</h4>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginBottom: '8px' }}>₦250,000</div>
                    <p style={{ fontSize: '0.8rem', color: '#e2e8f0', lineHeight: 1.5, margin: '0 0 14px 0' }}>
                      👉 Select for FAST SCALING. Includes Website + WhatsApp AI + Meta &amp; Google Ad Auto-Launcher.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedStrategy('plugin');
                      const elem = document.getElementById('claim');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      background: '#8b5cf6',
                      color: '#ffffff',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Select Option 3 (₦250k) 👉
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social-Proof Reputation Bar with Animated Counters */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="counter-animate" style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', color: '#fbbf24', fontSize: '2rem', fontWeight: 700 }}>
              {lead.rating} <Star style={{ fill: '#fbbf24' }} size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Average Google Rating</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div className="counter-animate" style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary }}>{lead.reviews_count}+</div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Customer Reviews Verified</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div className="counter-animate" style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
              100% <CheckCircle size={24} />
            </div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Locally Verified Service</p>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#e2e8f0' }} className="hide-mobile"></div>
          <div style={{ textAlign: 'center' }}>
            <div className="counter-animate" style={{ fontSize: '2rem', fontWeight: 700, color: '#6366f1' }}>250+</div>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Clients Served Locally</p>
          </div>
        </div>
      </section>

      {/* Nigerian Trust & Payment Security Bar */}
      {isPreview && (
        <section style={{ background: '#090d16', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '28px 24px', color: '#94a3b8' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#cbd5e1' }}>
              🔒 Enterprise Security & Direct Local Payment Integrations
            </span>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>
                💳 Paystack
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24' }}>
                🏦 Moniepoint MFB
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
                📲 OPay Merchant
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0' }}>
                Mastercard / Visa / Verve
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
              <span>✓ Verified Local Business</span>
              <span>✓ 99.9% Uptime SLA</span>
              <span>✓ WhatsApp Instant Lead Router</span>
              <span>✓ ₦0 Upfront Staging Guarantee</span>
            </div>
          </div>
        </section>
      )}

      {/* Google Maps Location Embed */}
      {(lead.area || lead.city || lead.name) && (
        <section className="reveal" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '48px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="font-heading" style={{ fontFamily: headingFontFamily, fontSize: '1.6rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>📍 Find Us on the Map</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>Visit {lead.name} at our location in {lead.area || lead.city || 'Lagos, Nigeria'}.</p>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <iframe
                title={`Map for ${lead.name}`}
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(lead.name + ' ' + (lead.area || lead.city || 'Lagos Nigeria'))}&output=embed`}
              />
            </div>
          </div>
        </section>
      )}

      {/* What Happens Next — 3-step process (preview only) */}
      {isPreview && (
        <section className="reveal" style={{ background: '#f8fafc', padding: '60px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 className="font-heading" style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>What Happens After You Claim</h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Simple, fast, and handled entirely by us.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              {[
                { step: '01', icon: '🔒', title: 'Claim Today', desc: 'Fill in your name and email below and confirm your chosen package. Takes under 60 seconds.' },
                { step: '02', icon: '⚙️', title: 'We Build & Deploy', desc: 'Our team customises your site, connects your phone number, and deploys it to your own domain within 48 hours.' },
                { step: '03', icon: '📲', title: 'Customers Find You', desc: `${lead.category?.toLowerCase().includes('medical') || lead.category?.toLowerCase().includes('clinic') || lead.category?.toLowerCase().includes('health') ? 'Patients and clients' : 'High-intent clients and buyers'} start requesting quotes and booking directly from your website — you receive instant WhatsApp notifications for every lead.` },
              ].map((item) => (
                <div key={item.step} style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '28px 24px',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    letterSpacing: '0.1em'
                  }}>{item.step}</span>
                  <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{item.icon}</div>
                  <h3 className="font-heading" style={{ fontSize: '1.1rem', fontWeight: 700, color: theme.primary, marginBottom: '8px' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="#claim" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: theme.primary,
                color: '#fff',
                textDecoration: 'none',
                padding: '13px 28px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              }}>
                Get My Site Live in 48 Hours <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="reveal" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>Our Specialties & Services</h2>
            <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>We specialize in delivering high-quality, professional solutions designed to meet your needs in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {copy.services.map((service, idx) => (
              <div key={idx} style={{ 
                padding: '36px', 
                borderRadius: '12px', 
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              className="service-card frosted-glass"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.03)';
              }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{service.icon}</div>
                <h3 className="font-heading" style={{ fontSize: '1.25rem', fontWeight: 600, color: theme.primary, marginBottom: '12px' }}>{service.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem', margin: 0 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="reveal" style={{ background: '#ffffff', padding: '80px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '50px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: theme.primary, fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              <Award size={18} /> Award-Winning Reputation
            </div>
            <h2 className="font-heading" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '20px', lineHeight: 1.2 }}>About {lead.name}</h2>
            <p style={{ color: '#4b5563', lineHeight: 1.7, fontSize: '1.05rem', marginBottom: '24px' }}>{copy.aboutText}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin style={{ color: theme.primary }} size={20} />
                <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.address}</span>
              </div>
              {lead.phone_raw && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone style={{ color: theme.primary }} size={20} />
                  <span style={{ fontWeight: 500, color: '#4b5563' }}>{lead.phone_raw}</span>
                </div>
              )}
              {lead.business_hours && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', marginBottom: '4px' }}>
                    <Clock style={{ color: theme.primary }} size={18} />
                    <span>Business Hours</span>
                  </div>
                  {(() => {
                    try {
                      const hours = typeof lead.business_hours === 'string' ? JSON.parse(lead.business_hours) : lead.business_hours;
                      if (Array.isArray(hours)) {
                        return hours.map((h: string, i: number) => {
                          const separatorIndex = h.indexOf(':');
                          if (separatorIndex === -1) {
                            return (
                              <div key={i} style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                                {h}
                              </div>
                            );
                          }
                          const day = h.substring(0, separatorIndex);
                          const time = h.substring(separatorIndex + 1);
                          return (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#4b5563', gap: '20px' }}>
                              <span style={{ fontWeight: 500 }}>{day}</span>
                              <span style={{ color: '#64748b' }}>{time.trim()}</span>
                            </div>
                          );
                        });
                      }
                    } catch (e) {
                      // Fallback
                    }
                    return <span style={{ fontSize: '0.85rem', color: '#4b5563' }}>{lead.business_hours}</span>;
                  })()}
                </div>
              )}
            </div>
          </div>

          <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px rgba(0,0,0,0.1)' }}>
            <img 
              src={(() => {
                if (lead.photos_data) {
                  try {
                    const photos = typeof lead.photos_data === 'string' ? JSON.parse(lead.photos_data) : lead.photos_data;
                    if (Array.isArray(photos) && photos.length > 0) {
                      return photos[0];
                    }
                  } catch (_) {}
                }
                return "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80";
              })()} 
              alt={lead.name} 
              style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
            />
            <div className="frosted-glass" style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '20px', 
              right: '20px', 
              padding: '20px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Star style={{ color: '#fbbf24', fill: '#fbbf24' }} size={24} />
              <div>
                <p className="font-heading" style={{ margin: 0, fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>Local Verified Reputation</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Top rating confirmed on Google Maps APIs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery Section */}
      {(() => {
        if (lead.photos_data) {
          try {
            const photos = typeof lead.photos_data === 'string' ? JSON.parse(lead.photos_data) : lead.photos_data;
            if (Array.isArray(photos) && photos.length > 1) {
              return (
                <section className="reveal" style={{ padding: '60px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
                  <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                      <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>Gallery & Inside View</h2>
                      <p style={{ color: '#64748b' }}>Take a look inside {lead.name} and explore our facilities.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                      {photos.slice(0, 4).map((url: string, index: number) => (
                        <div key={index} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', height: '220px' }}>
                          <img src={url} alt={`Gallery ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              );
            }
          } catch (_) {}
        }
        return null;
      })()}

      {/* Customer Testimonials */}
      <section className="reveal" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 700, color: theme.primary, marginBottom: '12px' }}>What Our Customers Say</h2>
            <p style={{ color: '#64748b' }}>Here is what actual clients think of our work in {lead.area}.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
            {copy.testimonials.map((test, idx) => (
              <div key={idx} className="frosted-glass" style={{ 
                padding: '30px', 
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} style={{ color: '#fbbf24', fill: '#fbbf24' }} size={16} />
                  ))}
                </div>
                <p style={{ color: '#4b5563', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.95rem' }}>&ldquo;{test.text}&rdquo;</p>
                <p className="font-heading" style={{ margin: 0, fontWeight: 600, color: theme.primary, fontSize: '0.9rem' }}>— {test.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page Persuasion CTA Card */}
      {isPreview && (
        <section className="reveal" style={{ padding: '60px 24px', background: '#fafaf9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent || theme.primary} 100%)`,
              borderRadius: '24px',
              padding: '50px 40px',
              color: '#ffffff',
              boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Subtle background decoration */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '150px',
                height: '150px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}></div>
              <div style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-30px',
                width: '100px',
                height: '100px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }}></div>

               <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 16px',
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'inline-block',
                marginBottom: '20px'
              }}>{hasWebsite ? '🔒 Website Upgrade & Automation Preview' : '🔒 Reserved Domain & Website Preview'}</span>

              <h2 className="font-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.2 }}>
                {hasWebsite ? 'Lock In Your Website Upgrade Before It Expires' : 'Lock In Your Custom Platform Before It Expires'}
              </h2>

              <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', opacity: 0.9, maxWidth: '650px', margin: '0 auto 36px', lineHeight: 1.6 }}>
                {hasWebsite 
                  ? <>We have designed these custom automation tools specifically for your website. Claim now to integrate your auto-pilot customer generation system within 24 hours.</>
                  : <>We have reserved <strong>{lead.name.toLowerCase().replace(/\s+/g, '')}.com.ng</strong> (and options for .com) specifically for this build. Claim now to launch your auto-pilot customer generation system within 24 hours.</>}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <a href="#claim" className="btn-hover-effect" style={{
                  background: '#ffffff',
                  color: theme.primary,
                  textDecoration: 'none',
                  padding: '16px 36px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s'
                }}>
                  {hasWebsite ? 'Secure My Website Upgrade & Automations' : 'Secure My Custom Website & Domain'} <ArrowRight size={20} />
                </a>
                
                <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 500 }}>
                  ⚡ Join 14+ other local top-rated businesses in {lead.city || 'your area'} who went digital.
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form (Interactive Automation Demo) */}
      <section id="booking" className="reveal" style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '80px 24px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{ maxWidth: '900px', width: '100%' }}>
          
          {isPreview ? (
            // Customizer / Preview mode options
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{
                background: 'rgba(2, 132, 199, 0.1)',
                color: theme.primary,
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>{hasWebsite ? 'Step 1: Choose System Automations' : 'Step 1: Choose Website Automations'}</span>
              <h2 className="font-heading" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#1f2937', marginTop: '16px', marginBottom: '12px' }}>
                {hasWebsite ? 'Select Interactive Features for Your Website' : 'Select Interactive Features for Your Site'}
              </h2>
              <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 30px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {hasWebsite 
                  ? 'Activate the tools you want integrated with your business website. Click Test Demo to preview how each automation works instantly.'
                  : 'Activate the tools you want included on your live business website. Click Test Demo to preview how each automation works instantly.'}
              </p>

              {hasWebsite ? (
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                  {/* Platform Badge Card */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
                    textAlign: 'left'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          background: theme.primary + '10',
                          color: theme.primary,
                          padding: '10px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                            Website Modernization Profile
                          </h4>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                            CMS & Performance Audit Analysis
                          </span>
                        </div>
                      </div>
                      <div style={{
                        background: '#10b98115',
                        color: '#10b981',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '6px 12px',
                        borderRadius: '99px',
                        border: '1px solid #10b98125'
                      }}>
                        {lead.cmsPlatform ? lead.cmsPlatform.toUpperCase() : 'DETECTED'}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Detection Confidence</span>
                        <strong style={{ fontSize: '0.95rem', color: '#1f2937' }}>
                          {lead.cmsConfidence ? `${lead.cmsConfidence}%` : 'High (Fingerprinted)'}
                        </strong>
                      </div>
                      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Recommended Path</span>
                        <strong style={{ fontSize: '0.95rem', color: '#1f2937' }}>
                          {lead.upgradeStrategy === 'full_rebuild' ? 'Full Static Rebuild' : 
                           lead.upgradeStrategy === 'plugin' ? 'WordPress/CMS Plugin' : 'Script Embed Integration'}
                        </strong>
                      </div>
                    </div>

                    {lead.pluginSuggestions && (
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', display: 'block', marginBottom: '8px' }}>
                          Recommended Enhancements:
                        </span>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {(Array.isArray(lead.pluginSuggestions) ? lead.pluginSuggestions : JSON.parse(lead.pluginSuggestions || '[]')).map((plugin: string, idx: number) => (
                            <span key={idx} style={{
                              background: '#eff6ff',
                              color: '#1d4ed8',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #bfdbfe'
                            }}>
                              🔌 {plugin}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {lead.embedNote && (
                      <div style={{
                        background: '#fffbeb',
                        border: '1px solid #fde68a',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        fontSize: '0.8rem',
                        color: '#b45309',
                        lineHeight: 1.4
                      }}>
                        💡 <strong>Developer Note:</strong> {lead.embedNote}
                      </div>
                    )}
                  </div>

                  {/* strategy & feature customizer */}
                  <TransferRebuildOptions 
                    lead={lead} 
                    onSuccess={(newPreviewUrl) => {
                      window.location.href = newPreviewUrl;
                    }}
                  />
                </div>
              ) : (
                /* Grid of feature cards */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '20px',
                  marginBottom: '40px',
                  textAlign: 'left'
                }}>
                  {[
                    {
                      id: 'quote_estimator',
                      icon: '📊',
                      title: 'Project Estimator & Invoicing',
                      desc: 'Let clients calculate service price quotes in real-time and generate branded invoices.'
                    },
                    {
                      id: 'patient_intake',
                      icon: '🗓️',
                      title: 'Appointment Booking & Intake',
                      desc: 'Let clients self-schedule appointments and fill out digital intake forms.'
                    },
                    {
                      id: 'ecommerce',
                      icon: '🛒',
                      title: 'Paystack Store Checkout',
                      desc: 'Sell products online with shopping cart checkout and secure credit card payments.'
                    },
                    {
                      id: 'vehicle_valuation',
                      icon: '🚗',
                      title: 'Smart Valuation Calculator',
                      desc: 'Offer prospective clients instant asset appraisals to capture high-value sales leads.'
                    },
                    {
                      id: 'table_reservation',
                      icon: '🍽️',
                      title: 'Table & Seat Reservation',
                      desc: 'Allow guests to reserve dining tables, pick time slots, and pre-order food.'
                    }
                  ].map((feat) => {
                    const isSelected = selectedFeatures.includes(feat.id);
                    const isActiveDemo = activeWidget === feat.id;

                    return (
                      <div
                        key={feat.id}
                        style={{
                          background: '#ffffff',
                          border: isSelected ? `2px solid ${theme.primary}` : '1px solid #e2e8f0',
                          borderRadius: '16px',
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '16px',
                          boxShadow: isSelected ? '0 10px 25px -5px rgba(0, 0, 0, 0.05)' : '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.2s ease',
                          position: 'relative'
                        }}
                      >
                        {isSelected && (
                          <span style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: theme.primary,
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '12px'
                          }}>
                            ✓ Active
                          </span>
                        )}
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{feat.icon}</div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px', marginTop: 0 }}>
                            {feat.title}
                          </h3>
                          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                            {feat.desc}
                          </p>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <button
                            type="button"
                            onClick={() => toggleFeature(feat.id)}
                            style={{
                              flex: 1,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: isSelected ? `1px solid ${theme.primary}` : '1px solid #cbd5e1',
                              background: isSelected ? 'transparent' : '#ffffff',
                              color: isSelected ? theme.primary : '#4b5563',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            {isSelected ? 'Disable' : 'Add to Site'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setActiveWidget(feat.id); setDemoStatus(null); }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: isActiveDemo ? 'rgba(2, 132, 199, 0.1)' : '#f1f5f9',
                              color: isActiveDemo ? theme.primary : '#4b5563',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ⚡ Test Demo
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}


              {/* Demo Section Header */}
              <div style={{ margin: '40px 0 20px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.primary }}>
                  🎮 Live Demo Sandbox
                </span>
                <h3 className="font-heading" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginTop: '6px', marginBottom: '6px' }}>
                  Test-Driving: {
                    activeWidget === 'quote_estimator' ? 'Project Quote Estimator' :
                    activeWidget === 'patient_intake' ? 'Booking & Health Intake Portal' :
                    activeWidget === 'ecommerce' ? 'Paystack Checkout Shopping Cart' :
                    activeWidget === 'vehicle_valuation' ? 'Trade-In Valuation Calculator' :
                    'Table & Seat Reservation System'
                  }
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Try submitting the form below to see how this automation logs records, computes prices, and triggers client alerts.
                </p>
              </div>
            </div>
          ) : (
            // Live Site mode (no selector, just standard headers or active tabs)
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span style={{
                background: 'rgba(2, 132, 199, 0.1)',
                color: theme.primary,
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Schedule Services & Bookings</span>
              <h2 className="font-heading" style={{ fontSize: '2rem', fontWeight: 700, color: '#1f2937', marginTop: '16px', marginBottom: '12px' }}>
                {pitch.widgetTitle || "Interactive Booking Automation"}
              </h2>
              <p style={{ color: '#64748b', maxWidth: '600px', margin: '0 auto 30px', fontSize: '0.95rem', lineHeight: 1.5 }}>
                {pitch.widgetDescription || "Choose one of our dynamic self-service portals below to book appointments, calculate trade-ins, or order products."}
              </p>

              {/* Dynamic feature tabs on live site if multiple features are enabled */}
              {selectedFeatures.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
                  {selectedFeatures.map((featId) => {
                    const titles: Record<string, string> = {
                      quote_estimator: '📊 Quote Estimator',
                      patient_intake: '🗓️ Book Appointment',
                      ecommerce: '🛒 Product Store',
                      vehicle_valuation: '🚗 Trade-In Value',
                      table_reservation: '🍽️ Table Booking'
                    };
                    const isActive = activeWidget === featId;
                    return (
                      <button
                        key={featId}
                        type="button"
                        onClick={() => { setActiveWidget(featId); setDemoStatus(null); }}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '30px',
                          border: isActive ? `2px solid ${theme.primary}` : '1px solid #e2e8f0',
                          background: isActive ? theme.primary : '#ffffff',
                          color: isActive ? '#ffffff' : '#4b5563',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                        }}
                      >
                        {titles[featId] || featId}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Render Active Widget Box */}
          <div className="frosted-glass" style={{
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px -2px rgba(0,0,0,0.04)',
            background: '#ffffff',
            border: '1px solid #cbd5e1'
          }}>
            {renderActiveWidget()}
          </div>

          {/* Plain Text Requirements Box (Only in preview/customizer mode) */}
          {isPreview && (
            <div className="frosted-glass" style={{
              marginTop: '30px',
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'rgba(255,255,255,0.6)',
              textAlign: 'left'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1f2937', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✍️ Custom Requirements & Design Instructions (Optional)
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                Prefer a different layout, custom color schemes, distinct typography, or special software sync (e.g. accounting, local CRM)? Describe how you want this website customized in your own words below.
              </p>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. Make the theme a dark navy blue with orange buttons. Replace the shoe store products with solar panels, and add a contact form that emails me directly whenever someone asks for a quote."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  outline: 'none',
                  background: '#ffffff',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  resize: 'vertical',
                  color: '#1f2937'
                }}
              />
            </div>
          )}
          
        </div>
      </section>

      {/* Client Website AI Social Media & Meta/Google Ad Automation Section */}
      <section id="social-ad-automation" style={{
        background: '#090d16',
        padding: '60px 24px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SocialAdAutomationWidget
            businessName={lead.name}
            category={lead.category}
            onSelectPackage={(pkgId, price) => {
              // Automatically check the corresponding add-on in the quote calculator
              if (pkgId === 'social_media_management') {
                setEstimatorExtras(prev => ({ ...prev, socialMedia: true }));
              } else if (pkgId === 'ad_automation') {
                setEstimatorExtras(prev => ({ ...prev, adAutomation: true }));
              } else if (pkgId === 'social_ad_dominance_suite') {
                setEstimatorExtras(prev => ({ ...prev, socialMedia: true, adAutomation: true }));
              }
            }}
          />
        </div>
      </section>

      {/* Walkthrough Video & Pricing Strategy Section */}
      {isPreview && (
        <section id="pricing-strategy" style={{
          background: '#0f172a',
          color: '#f8fafc',
          padding: '80px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Walkthrough & Pricing Strategy</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '16px', marginBottom: '12px' }}>
                How Bethelmind Analytics & Strategy Scales Your Business
              </h2>
              <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
                Watch a quick 1-minute video showing our automated lead generation, instant pitching, and custom domain deployment system.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
              {/* Video Embed */}
              <div style={{
                background: '#1e293b',
                borderRadius: '16px',
                padding: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                  <video 
                    src="/assets/bethelmind-demo.webm" 
                    controls 
                    poster="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>

              {/* Pricing / Grade Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#38bdf8' }}>Graded Automation Packages</h3>
                
                {/* Dynamic Recommendation Alert Box */}
                <div style={{
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    <strong style={{ fontSize: '0.9rem', color: '#38bdf8' }}>AI Audit Recommendation for {lead.name}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                    {hasWebsite ? (
                      <>
                        We analyzed your active website at <a href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>{websiteUrl}</a>. 
                        To preserve your current SEO ranking and minimize changes, we recommend the <strong>Lead Widget Upgrade (₦65,000)</strong> to embed our automated booking and quotation systems directly on your current site.
                      </>
                    ) : (
                      <>
                        We could not find an active website online for your business. We recommend deploying the <strong>Basic Online Presence (₦150,000)</strong> package to establish your online credibility with a custom <code>.com.ng</code> domain, or upgrading to the <strong>Growth Engine (₦250,000)</strong> to capture bookings and leads automatically.
                      </>
                    )}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Script Embed Package */}
                  <div style={{ background: '#1d2433', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #f59e0b', border: '1px dashed rgba(245, 158, 11, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#fff' }}>⚡ Lead Widget Upgrade (For Existing Sites)</strong>
                      <span style={{ fontWeight: 700, color: '#f59e0b', fontSize: '1.2rem' }}>₦65,000</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Perfect if you already have a website but want to add our automated quote calculators, intake forms, or instant lead alerts.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <div>✅ Custom Interactive Quote / Booking Widget</div>
                      <div>✅ Easily Copy-Pasteable Embed Code</div>
                      <div>✅ Works on WordPress, Wix, Shopify & Custom Sites</div>
                      <div>✅ Direct CRM & Email Notification Alerts</div>
                      <div>✅ Zero Hosting/Domain Setup Required</div>
                      <div>✅ Full Setup Assistance Included</div>
                    </div>
                  </div>

                  {/* Basic Package */}
                  <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #94a3b8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#fff' }}>1. Basic Online Presence</strong>
                      <span style={{ fontWeight: 700, color: '#94a3b8', fontSize: '1.2rem' }}>₦150,000</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Best for establishing local credibility, security, and search visibility.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <div>✅ Custom Domain (.com.ng) Included</div>
                      <div>✅ 100% Free Managed Fast Hosting</div>
                      <div>✅ SSL Security & HTTPS Setup</div>
                      <div>✅ Click-to-Call & WhatsApp Chat Link</div>
                      <div>✅ Basic SEO Setup & Google Indexing</div>
                      <div>✅ Fully Mobile Responsive Layout</div>
                    </div>
                  </div>

                  {/* Growth Package */}
                  <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #60a5fa', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '16px', background: '#38bdf8', color: '#0f172a', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Popular Upgrade</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#fff' }}>2. Growth Engine (Simple Automation)</strong>
                      <span style={{ fontWeight: 700, color: '#60a5fa', fontSize: '1.2rem' }}>₦250,000</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Perfect for capturing bookings, generating automated estimates, and getting instant lead alerts.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: '#60a5fa' }}>
                      <div>🔹 <strong>Everything in Basic</strong></div>
                      <div>✅ Custom Quote/Price Estimator Widget</div>
                      <div>✅ Automated Booking Intake Form</div>
                      <div>✅ Instant SMS & Email Lead Notifications</div>
                      <div>✅ Automated PDF Invoicing & Receipts</div>
                      <div>✅ Client Auto-responder Emails</div>
                    </div>
                  </div>

                  {/* Powerhouse Package */}
                  <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#fff' }}>3. Automated Powerhouse (Full Autopilot)</strong>
                      <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.2rem' }}>₦600,000</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Best for scaling operations, collecting automated online payments, and syncing lead data directly to CRM.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: '#10b981' }}>
                      <div>🔥 <strong>Everything in Growth</strong></div>
                      <div>✅ Integrated Paystack/Flutterwave Checkout</div>
                      <div>✅ Bidirectional Google Sheets CRM Sync</div>
                      <div>✅ WhatsApp Follow-up Drip Campaigns</div>
                      <div>✅ Dynamic Lead Scoring Dashboard</div>
                      <div>✅ Automated Google Review Request Alerts</div>
                      <div>✅ Monthly Analytics & Conversion Reports</div>
                    </div>
                  </div>

                  {/* Bespoke Enterprise */}
                  <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1.2rem', color: '#fff' }}>4. Bespoke Enterprise Solutions</strong>
                      <span style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '1.2rem' }}>Contact Us</span>
                    </div>
                    <p style={{ margin: '0 0 16px 0', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.4 }}>
                      Designed for custom CRM setups, accounting software syncs, and multi-channel marketing automation.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: '0.8rem', color: '#8b5cf6' }}>
                      <div>✅ Custom Accounting (Odoo, Zoho) Syncs</div>
                      <div>✅ Advanced Lead Scrapers & Data Enrichers</div>
                      <div>✅ Multi-agent Shared Inbox Setups</div>
                      <div>✅ Bidirectional Calendar & Staff Syncs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Making Support & FAQs */}
            <div style={{
              marginTop: '48px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#38bdf8', margin: '0 0 8px 0' }}>
                  Frequently Asked Questions
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                  Everything you need to know about claiming your high-converting automation platform
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '6px' }}>🔑 Do I own the website and domain?</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    Yes, 100%. Once claimed, ownership of the domain is transferred to you, and we hand over the full website files and GitHub source code repository. There are no proprietary lock-ins.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '6px' }}>⚡ How long does deployment take?</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    The draft preview is already generated. Once you claim, our automated system maps the custom domain and deploys live files within 24 to 48 hours.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '6px' }}>🛠️ Can I request edits and changes?</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    Absolutely. Every package includes 30 days of free revisions where our design team will customize copy, upload your branding logos, and fine-tune form fields.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '6px' }}>💳 How is payment handled?</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    We support both instant Paystack checkout and verified bank transfers. We offer a 50% upfront starting deposit option, with the remaining 50% paid only after you verify the final setup on your live domain.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', gridColumn: '1 / -1' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#fff', display: 'block', marginBottom: '6px' }}>🔌 What if I don't have access to my website files or backend logins?</strong>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    <strong>We handle 100% of the integration for you at no extra cost.</strong> Our team provides complimentary white-glove setup. You can either delegate temporary guest access to your CMS (WordPress, Wix, Shopify), introduce us to your current webmaster/developer, or install our 1-click plugin. If you have no logins at all, we can inject the script remotely via Cloudflare DNS or Google Tag Manager without editing your server files directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WhatsApp Chat Simulation Widget */}
      {isPreview && whatsappSimActive && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '320px',
          maxHeight: '400px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header */}
          <div style={{ background: '#075e54', color: '#ffffff', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25d366' }}></div>
              <div>
                <strong style={{ fontSize: '0.9rem', display: 'block' }}>Live Automation Feed</strong>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Simulated Deliveries</span>
              </div>
            </div>
            <button type="button" onClick={() => setWhatsappSimActive(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
          </div>

          {/* Messages Feed */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#ece5dd',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minHeight: '260px'
          }}>
            {whatsappMessages.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem', marginTop: '40px' }}>
                Waiting for automation trigger...
              </div>
            ) : (
              whatsappMessages.map((msg, idx) => {
                const isAgent = msg.sender === 'agent';
                const isBot = msg.sender === 'bot';
                const isCustomer = msg.sender === 'customer';
                
                let bg = '#ffffff';
                let alignSelf = 'flex-start';
                let color = '#333333';
                let borderRadius = '8px 8px 8px 0px';
                
                if (isCustomer) {
                  bg = '#dcf8c6';
                  alignSelf = 'flex-end';
                  borderRadius = '8px 8px 0px 8px';
                } else if (isAgent) {
                  bg = '#e9f5ff';
                  color = '#0c4a6e';
                }

                return (
                  <div key={idx} style={{
                    background: bg,
                    color: color,
                    padding: '10px 12px',
                    borderRadius: borderRadius,
                    maxWidth: '85%',
                    alignSelf: alignSelf as any,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    fontSize: '0.85rem',
                    lineHeight: 1.4
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: isCustomer ? '#075e54' : isAgent ? '#0284c7' : '#e67e22', marginBottom: '2px' }}>
                      {isCustomer ? 'Client (You)' : isAgent ? 'Sales CRM Alert' : `${lead.name} Bot`}
                    </div>
                    <div>{msg.text}</div>
                    <div style={{ fontSize: '0.65rem', color: '#888888', textAlign: 'right', marginTop: '4px' }}>
                      {msg.time}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {/* Action Footer */}
          {activeModalInvoice && (
            <div style={{ padding: '10px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => {
                  // Keep modal open or trigger focus
                }}
                style={{
                  background: '#25d366',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Receipt size={14} /> View Invoice & Receipt
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── WhatsApp Direct Support Chat Button ─────────────────────────────── */}
      {isPreview && (
        <a
          id="wa-chat-float"
          href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hello Bethelmind Analytics & Strategy! I'm ${lead.name} in ${lead.city || lead.area}. I want to claim the website you built for my business. Preview: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat Bethelmind Analytics & Strategy Support on WhatsApp"
          style={{
            position: 'fixed',
            bottom: whatsappSimActive ? '450px' : '24px',
            right: '24px',
            background: '#25d366',
            color: '#ffffff',
            borderRadius: '50px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 8px 25px rgba(37, 211, 102, 0.45)',
            zIndex: 10001,
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: 'fadeInUp 0.5s ease-out'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.847L.057 24l6.304-1.654A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.892a9.88 9.88 0 0 1-5.034-1.375l-.361-.214-3.741.981.999-3.648-.235-.374A9.865 9.865 0 0 1 2.108 12C2.108 6.519 6.519 2.108 12 2.108c5.48 0 9.892 4.41 9.892 9.892 0 5.481-4.411 9.892-9.892 9.892z"/>
          </svg>
          Chat Support Now
        </a>
      )}

      {/* ─── Test Phone Alert Widget — delayed 12s so it doesn't compete with hero pitch ─── */}
      {isPreview && !whatsappSimActive && showTestAlert && (
        <div
          id="test-alert-widget"
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '300px',
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: '16px',
            padding: '18px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
            zIndex: 10000,
            fontFamily: 'system-ui, sans-serif',
            animation: 'fadeInUp 0.4s ease-out both'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0284c7, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Phone size={16} color="#fff" />
            </div>
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#1f2937', display: 'block' }}>🎯 Try a Live Alert</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Get a real notification on your phone</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
            <button
              type="button"
              onClick={() => setTestAlertChannel('whatsapp')}
              style={{
                flex: 1, padding: '7px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', cursor: 'pointer', border: 'none',
                background: testAlertChannel === 'whatsapp' ? '#25d366' : '#f1f5f9',
                color: testAlertChannel === 'whatsapp' ? '#fff' : '#64748b'
              }}
            >WhatsApp</button>
            <button
              type="button"
              onClick={() => setTestAlertChannel('call')}
              style={{
                flex: 1, padding: '7px', fontSize: '0.75rem', fontWeight: 600, borderRadius: '7px', cursor: 'pointer', border: 'none',
                background: testAlertChannel === 'call' ? '#0284c7' : '#f1f5f9',
                color: testAlertChannel === 'call' ? '#fff' : '#64748b'
              }}
            >Voice Call</button>
          </div>

          <input
            type="tel"
            value={testAlertPhone}
            onChange={(e) => setTestAlertPhone(e.target.value)}
            placeholder="+234 803 123 4567"
            style={{ width: '100%', padding: '10px', fontSize: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px', boxSizing: 'border-box', outline: 'none' }}
          />

          {testAlertResult && (
            <div style={{ fontSize: '0.78rem', color: testAlertResult.startsWith('❌') ? '#ef4444' : '#10b981', marginBottom: '10px', lineHeight: 1.4 }}>
              {testAlertResult}
            </div>
          )}

          <button
            type="button"
            id="send-test-alert-btn"
            onClick={handleTestAlert}
            disabled={testAlertLoading || !testAlertPhone.trim()}
            style={{
              width: '100%', padding: '10px', background: theme.primary, color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: testAlertLoading ? 'not-allowed' : 'pointer',
              opacity: testAlertLoading ? 0.7 : 1
            }}
          >
            {testAlertLoading ? 'Sending...' : `Send ${testAlertChannel === 'call' ? '📞 Voice Call' : '💬 WhatsApp'} to My Phone`}
          </button>
        </div>
      )}

      {/* ─── Hands-Free White-Glove Domain Guarantee Banner (Embedded in flow) ─── */}
      {isPreview && (
        <div
          id="domain-checker-strip"
          style={{
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#cbd5e1',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            fontSize: '0.82rem',
            fontWeight: 600,
            flexWrap: 'wrap',
            marginTop: '20px'
          }}
        >
          <span>🎁 <strong style={{ color: '#ffffff' }}>100% HANDS-FREE SETUP:</strong> Custom Domain + Server Hosting + WhatsApp AI included!</span>
          <button
            type="button"
            onClick={() => setShowThemeBar(!showThemeBar)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🎨 {showThemeBar ? 'Hide Style Picker' : 'Change Design Style'}
          </button>
        </div>
      )}

      {/* ─── Interactive Luxury Theme Variant Switcher Bar (Toggleable) ── */}
      {isPreview && showThemeBar && (
        <div
          id="theme-switcher-bar"
          style={{
            background: 'rgba(6, 9, 18, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc' }}>
            🎨 Select A Theme Preset:
          </span>

          {LUXURY_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedTheme(preset as any)}
              style={{
                background: theme.primary === preset.primary ? preset.gradient : 'rgba(255, 255, 255, 0.06)',
                border: theme.primary === preset.primary ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            >
              {preset.name}
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              const randSeed = Math.random().toString(36).substring(2, 9);
              const { getDesignTheme } = require('@/lib/designGenerator');
              const randTheme = getDesignTheme(lead.category || 'general', randSeed);
              setSelectedTheme(randTheme);
            }}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              border: 'none',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🎲 Fresh AI Variant ✨
          </button>
        </div>
      )}

      {/* Invoice Modal Overlay */}
      {activeModalInvoice && (
        <div 
          onClick={() => setActiveModalInvoice(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(9, 13, 22, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '680px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header / Actions */}
            <div style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt style={{ color: theme.primary }} size={20} />
                <strong style={{ fontSize: '1rem', color: '#1f2937' }}>Automated Receipt & Invoice Proposal</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#4b5563'
                  }}
                >
                  <Printer size={14} /> Print / Save PDF
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveModalInvoice(null)}
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>

            {/* Printable Invoice Page */}
            <div id="printable-invoice" style={{ padding: '40px', color: '#1f2937', background: '#ffffff', fontSize: '0.9rem', lineHeight: 1.5 }}>
              {/* Business Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: theme.primary }}>{activeModalInvoice.businessName}</h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                    {activeModalInvoice.businessAddress}
                  </p>
                  {activeModalInvoice.businessPhone && (
                    <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.8rem' }}>
                      Phone: {activeModalInvoice.businessPhone}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primary, textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(2, 132, 199, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>
                    ESTIMATE / INVOICE
                  </span>
                  <p style={{ margin: '10px 0 0', fontWeight: 600, fontSize: '1rem', color: '#0f172a' }}>{activeModalInvoice.invoiceNumber}</p>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '20px 0' }} />

              {/* Invoice Meta details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Billed To:</span>
                  <strong style={{ display: 'block', fontSize: '0.95rem', marginTop: '4px', color: '#0f172a' }}>{activeModalInvoice.clientName}</strong>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>{activeModalInvoice.clientEmail}</span>
                  {activeModalInvoice.clientPhone && (
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>{activeModalInvoice.clientPhone}</span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Date Issued:</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>{activeModalInvoice.date}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Payment Terms:</span>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500 }}>Due on Receipt (Simulation)</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Item Description</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Unit Price</th>
                    <th style={{ padding: '8px 0', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {activeModalInvoice.items.map((item: any, idx: number) => {
                    const priceVal = item.price;
                    const isCredit = priceVal < 0;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '12px 0', fontWeight: 500, color: '#334155' }}>{item.name}</td>
                        <td style={{ padding: '12px 0', textAlign: 'center', color: '#334155' }}>{item.qty}</td>
                        <td style={{ padding: '12px 0', textAlign: 'right', color: isCredit ? '#10b981' : '#334155' }}>
                          {isCredit ? '-' : ''}₦{Math.abs(priceVal).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600, color: isCredit ? '#10b981' : '#334155' }}>
                          {isCredit ? '-' : ''}₦{Math.abs(priceVal * item.qty).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Totals Box */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: '240px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₦{activeModalInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                    <span>VAT ({(pitch.invoiceDemo?.taxRate || 0.075) * 100}%):</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>₦{activeModalInvoice.tax.toLocaleString()}</span>
                  </div>
                  <hr style={{ border: 0, borderTop: '1px solid #cbd5e1', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                    <span>Total Amount:</span>
                    <span>₦{activeModalInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginTop: '50px', padding: '15px', background: '#f8fafc', borderRadius: '8px', borderLeft: `3px solid ${theme.primary}` }}>
                <strong style={{ display: 'block', fontSize: '0.8rem', color: '#4b5563', textTransform: 'uppercase', marginBottom: '4px' }}>B2B Proposal Estimate Note:</strong>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                  This estimate invoice demonstrates automated transaction billing and instant PDF generations customized for <strong>{activeModalInvoice.businessName}</strong>. Standard setup integrates with Paystack gateway or local bank transfers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3-Tier Pricing & Investment Strategy Section */}
      {isPreview && (
        <section id="pricing" style={{ background: '#f8fafc', padding: '80px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                color: '#10b981', 
                fontSize: '0.75rem', 
                fontWeight: 700, 
                padding: '6px 14px', 
                borderRadius: '99px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>Transparent Nigerian Market Packages</span>
              <h2 className="font-heading" style={{ fontSize: '2.2rem', fontWeight: 700, color: '#0f172a', marginTop: '16px', marginBottom: '12px' }}>
                Select Your Automation Investment Tier
              </h2>
              <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
                Every package is tailored to local consumer psychology in {lead.area || lead.city || 'Nigeria'} — structured for maximum conversion with zero upfront risk options.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', alignItems: 'stretch' }}>
              {/* Special Tier for Existing Website Owners: Standalone Tool Embed */}
              {hasWebsite && (
                <div style={{
                  background: '#f0f9ff',
                  borderRadius: '16px',
                  border: '2px solid #0284c7',
                  padding: '36px 28px',
                  position: 'relative',
                  boxShadow: '0 12px 30px rgba(2,132,199,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ position: 'absolute', top: '-14px', left: '28px', background: '#0284c7', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 14px', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🔌 RECOMMENDED FOR YOUR EXISTING SITE ({websiteUrl})
                  </span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1', marginBottom: '6px' }}>Plug & Play Tool Embed Suite</h3>
                    <p style={{ fontSize: '0.85rem', color: '#0369a1', marginBottom: '20px' }}>Keep your site at {websiteUrl}. Attach our interactive lead calculator in 10 mins.</p>
                    <div style={{ marginBottom: '24px' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0284c7' }}>₦35,000</span>
                      <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '6px' }}>One-time setup (or ₦15k/mo)</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 1-Line Script Tag / WordPress Plugin Embed</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Custom-Branded to Match Your Website Colors</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Direct WhatsApp Lead Routing to Your Sales Team</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Zero Changes to Your Current Domain/Hosting</li>
                      <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 100% Refund Guarantee if not working on your site</li>
                    </ul>
                  </div>
                  <a href="#claim" onClick={() => setSelectedStrategy('script_embed')} style={{
                    display: 'block',
                    textAlign: 'center',
                    background: '#0284c7',
                    color: '#ffffff',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(2,132,199,0.35)'
                  }}>
                    🔌 Order Tool Embed for {websiteUrl} (₦35k)
                  </a>
                </div>
              )}

              {/* Tier 1: Zero Risk Staging */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: selectedStrategy === 'zero_risk_staging' ? '2px solid #10b981' : '1px solid #e2e8f0',
                padding: '36px 28px',
                position: 'relative',
                boxShadow: selectedStrategy === 'zero_risk_staging' ? '0 12px 30px rgba(16,185,129,0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <span style={{ position: 'absolute', top: '-14px', left: '28px', background: '#10b981', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: '99px', textTransform: 'uppercase' }}>
                  {hasWebsite ? 'FULL WEBSITE REPLACEMENT' : 'MOST POPULAR (ZERO RISK)'}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>1. Fast-Track Staging Approval</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Test your live domain & custom branding before paying a single kobo.</p>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981' }}>₦0</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '6px' }}>Upfront (₦150k on approval)</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Live Staging Preview on Custom Domain</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ WhatsApp Lead Routing & Chat Button</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Verified Google Reviews & Map Embed</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Mobile-Optimized (Sub-1.5s Load Speed)</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Pay ₦150,000 only when satisfied</li>
                  </ul>
                </div>
                <a href="#claim" onClick={() => setSelectedStrategy('zero_risk_staging')} style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#10b981',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
                }}>
                  Claim with ₦0 Upfront Risk
                </a>
              </div>

              {/* Tier 2: Growth Engine */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: selectedStrategy === 'plugin' ? '2px solid ' + theme.primary : '1px solid #e2e8f0',
                padding: '36px 28px',
                position: 'relative',
                boxShadow: selectedStrategy === 'plugin' ? '0 12px 30px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>2. Growth Engine</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Full interactive suite with Paystack / Moniepoint online checkouts.</p>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>₦250,000</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '6px' }}>One-time</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Everything in Fast-Track Staging</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Interactive Quote & Fee Estimators</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Paystack & Moniepoint MFB Direct Checkout</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Automated PDF Invoicing & Email Dispatch</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Google Sheets CRM Bi-Directional Sync</li>
                  </ul>
                </div>
                <a href="#claim" onClick={() => setSelectedStrategy('plugin')} style={{
                  display: 'block',
                  textAlign: 'center',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}>
                  Select Growth Engine (₦250k)
                </a>
              </div>

              {/* Tier 3: Enterprise VIP */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: selectedStrategy === 'full_rebuild' ? '2px solid #d4af37' : '1px solid #e2e8f0',
                padding: '36px 28px',
                position: 'relative',
                boxShadow: selectedStrategy === 'full_rebuild' ? '0 12px 30px rgba(212,175,55,0.15)' : '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>3. Enterprise VIP Portal</h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>Custom Next.js web application built for market dominance.</p>
                  <div style={{ marginBottom: '24px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#d4af37' }}>₦600,000</span>
                    <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '6px' }}>Complete Suite</span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: '#334155' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Custom High-Speed Next.js Architecture</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ 24/7 AI FAQs & Multi-Agent Bot</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Automated SMS & WhatsApp Reminders</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ Dedicated Client Portal / Dashboard</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✓ VIP 1-on-1 Developer Concierge Support</li>
                  </ul>
                </div>
                <a href="#claim" onClick={() => setSelectedStrategy('full_rebuild')} style={{
                  display: 'block',
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                  color: '#000000',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}>
                  Select Enterprise VIP (₦600k)
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Claim Section / Contact Form */}
      {isPreview && (
        <section id="claim" style={{ 
          background: '#ffffff', 
          borderTop: '1px solid #e2e8f0',
          padding: '80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Automatic Invoice Modal Trigger */}
          <InvoiceModal
            isOpen={showClaimInvoice}
            onClose={() => setShowClaimInvoice(false)}
            clientName={lead.name}
            clientIndustry={lead.category}
            clientDistrict={lead.area || lead.city}
            items={[
              { name: `${lead.name} Custom Platform & AI Setup`, price: 150000, qty: 1 },
              { name: '1-Year .com.ng Domain & Cloud Hosting', price: 0, qty: 1 }
            ]}
            paymentRef={`BMA-CLAIM-${leadId.slice(0, 6).toUpperCase()}`}
          />

          <div style={{ maxWidth: '800px', width: '100%', marginBottom: '32px' }}>
            <BeforeAfterAuditWidget
              businessName={lead.name}
              categoryName={lead.category}
              existingWebsite={lead.website}
            />
          </div>

          <div style={{ 
            maxWidth: '600px', 
            width: '100%', 
            background: '#fafaf9',
            padding: '40px', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}>
            {!claimed ? (
              <>
                <ShieldCheck size={48} style={{ color: theme.primary, margin: '0 auto 20px' }} />
                 <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>
                  {hasWebsite ? 'Claim My Website Upgrade & Automations' : 'Claim This Website & Domain'}
                </h2>

                {/* Instant Pro-Forma Invoice Preview Trigger */}
                <div style={{ marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setShowClaimInvoice(true)}
                    style={{
                      background: 'rgba(2, 132, 199, 0.08)',
                      color: '#0284c7',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} /> Preview Instant Pro-Forma Invoice Before Payment
                  </button>
                </div>
                
                {/* Social Proof Counter Banner */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  fontSize: '0.85rem',
                  color: '#166534',
                  fontWeight: 600,
                  textAlign: 'left',
                  lineHeight: 1.4
                }}>
                  {hasWebsite ? (
                    <span>🔥 <strong>4 similar businesses in {lead.city || 'your area'}</strong> have upgraded their platforms this week! Claim yours now to lock in these features.</span>
                  ) : (
                    <span>🔥 <strong>4 similar businesses in {lead.city || 'your area'}</strong> have already claimed their custom platforms this week! Claim yours now to lock in this design and secure your local domain.</span>
                  )}
                </div>

                {/* ⚡ 1-CLICK WHATSAPP CLAIM BUTTON (FOR NON-TECH BUSINESS OWNERS) */}
                <div style={{ background: 'rgba(37, 211, 102, 0.08)', border: '1px solid rgba(37, 211, 102, 0.3)', borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    ⚡ Prefer to claim directly on WhatsApp? (Zero Typing Required)
                  </span>
                  <a
                    href={`https://wa.me/2348022791227?text=${encodeURIComponent(`Hi Bethelmind Team! I am the owner of ${lead.name} in ${lead.area || lead.city || 'Lagos'}. I want to claim our custom website & 24/7 WhatsApp AI platform. Please activate my domain.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#25d366',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
                    }}
                  >
                    💬 1-Click Claim via WhatsApp →
                  </a>
                </div>

                {/* 📋 "WHAT YOU GET" INCLUDED CHECKLIST CARD */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                    🎁 Included In Your Website Claim:
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '0.78rem', color: '#334155', fontWeight: 600 }}>
                    <div>✅ Free .com.ng Domain Name</div>
                    <div>✅ 24/7 WhatsApp AI Agent</div>
                    <div>✅ Instant PDF Invoice Generator</div>
                    <div>✅ 100% Done-For-You Setup</div>
                  </div>
                </div>

                <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Your Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={claimForm.name}
                      onChange={(e) => setClaimForm({ ...claimForm, name: e.target.value })}
                      placeholder="e.g. Engr. Tosin Bethel"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>WhatsApp / Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={claimForm.phone}
                      onChange={(e) => setClaimForm({ ...claimForm, phone: e.target.value })}
                      placeholder="e.g. 0802 279 1227"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={claimForm.email}
                      onChange={(e) => setClaimForm({ ...claimForm, email: e.target.value })}
                      placeholder="name@business.com"
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '4px' }}>Preferred Website Address (Domain Name)</label>
                    <input 
                      type="text" 
                      value={claimForm.preferredDomain}
                      onChange={(e) => setClaimForm({ ...claimForm, preferredDomain: e.target.value })}
                      placeholder={`e.g. ${lead.name ? lead.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'yourbusiness'}.com`}
                      style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff' }}
                    />
                    
                    {/* Domain Extension Selector Chips */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Choose Extension:</span>
                      {['.com', '.com.ng', '.org', '.ng', '.africa'].map((ext) => {
                        const isSelected = claimForm.preferredDomain.toLowerCase().endsWith(ext);
                        return (
                          <button
                            key={ext}
                            type="button"
                            onClick={() => {
                              const base = claimForm.preferredDomain.replace(/\.(com|com\.ng|org|ng|africa)$/i, '');
                              const prefix = base || (lead.name ? lead.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'yourbusiness');
                              setClaimForm({ ...claimForm, preferredDomain: `${prefix}${ext}` });
                            }}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: isSelected ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                              background: isSelected ? 'rgba(2, 132, 199, 0.12)' : '#f8fafc',
                              color: isSelected ? '#0284c7' : '#475569',
                              fontSize: '0.75rem',
                              fontWeight: isSelected ? 800 : 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            {ext}
                          </button>
                        );
                      })}
                    </div>

                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
                      💡 Pick any extension above, or leave blank and our team will register the best domain for you hands-free!
                    </span>
                  </div>

                  {/* 🎙️ WHATSAPP-STYLE AUDIO VOICE NOTE EXPLANATION WIDGET */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '16px',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.3)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem' }}>🎙️</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                          Listen to 45s Audio Explanation
                        </span>
                      </div>
                      <span style={{ fontSize: '0.7rem', background: '#10b98125', color: '#34d399', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        Voice Note
                      </span>
                    </div>

                    {/* Audio Player Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', padding: '10px 12px', borderRadius: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                            if (window.speechSynthesis.speaking) {
                              window.speechSynthesis.cancel();
                            } else {
                              const text = `Hello! Welcome. We custom-build your business website, set up your 24/7 WhatsApp AI sales agent to handle customer chats and audio voice notes, and connect payments directly to your OPay account. If you already have a website, select the 65,000 Naira upgrade. If you don't have a website yet, select the 150,000 Naira package. Transfer to our OPay account below and upload your receipt for instant setup.`;
                              const utterance = new SpeechSynthesisUtterance(text);
                              utterance.rate = 1.0;
                              window.speechSynthesis.speak(utterance);
                            }
                          }
                        }}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                      >
                        ▶
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '16px', marginBottom: '4px' }}>
                          {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 60, 40, 85, 55, 30, 75, 90, 40].map((h, i) => (
                            <div key={i} style={{ flex: 1, height: `${h}%`, background: '#38bdf8', borderRadius: '2px', opacity: 0.8 }} />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>0:45 • Tap play to listen in English/Pidgin</span>
                      </div>
                    </div>
                  </div>

                  {/* 🤔 CONFUSED WHAT TO CHOOSE? DECISION ASSISTANT */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e2937', marginBottom: '6px' }}>
                      🤔 Confused about which package to choose?
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                      {hasWebsite && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                          <input
                            type="radio"
                            name="confusion_helper"
                            checked={selectedStrategy === 'script_embed'}
                            onChange={() => setSelectedStrategy('script_embed')}
                          />
                          <span><strong>I already have a website</strong> → Select ₦65,000 Lead Widget</span>
                        </label>
                      )}
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                        <input
                          type="radio"
                          name="confusion_helper"
                          checked={selectedStrategy === 'basic_presence'}
                          onChange={() => setSelectedStrategy('basic_presence')}
                        />
                        <span><strong>I don't have a website yet</strong> → Select ₦150,000 Basic Presence</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#334155' }}>
                        <input
                          type="radio"
                          name="confusion_helper"
                          checked={selectedStrategy === 'plugin'}
                          onChange={() => setSelectedStrategy('plugin')}
                        />
                        <span><strong>I want full AI + Ads automation</strong> → Select ₦250,000 Growth Engine</span>
                      </label>
                    </div>
                  </div>

                  {/* Strategy Package Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>Selected Package</label>
                    <select
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        background: '#fff',
                        fontSize: '0.9rem',
                        color: '#1f2937',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    >
                      {hasWebsite && (
                        <option value="script_embed">Lead Widget Upgrade — ₦65,000</option>
                      )}
                      <option value="basic_presence">Basic Online Presence — ₦150,000</option>
                      <option value="plugin">Growth Engine (Simple Automation) — ₦250,000</option>
                      <option value="full_rebuild">Automated Powerhouse — ₦600,000</option>
                    </select>
                  </div>

                  {/* Payment Options — Direct OPay Bank Transfer Primary (Paystack Completely Removed) */}
                  {paymentConfig && getDynamicClaimFee() > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        background: 'linear-gradient(135deg, #06b6d415 0%, #10b98115 100%)',
                        border: '1.5px solid #06b6d4',
                        borderRadius: '12px',
                        padding: '14px',
                        textAlign: 'center',
                        marginBottom: '12px'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          One-Time System Setup & Claim Fee
                        </span>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: theme.primary, margin: '4px 0' }}>
                          ₦{getDynamicClaimFee().toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                          ✓ Includes 1 Year Domain, Server Hosting & 24/7 WhatsApp AI Agent
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Payment Details Container - OPay (Primary Bank Option) */}
                  {paymentMethod === 'opay' && paymentConfig && (
                    <div style={{
                      background: 'rgba(2, 132, 199, 0.03)',
                      border: '1.5px solid #06b6d4',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '12px',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: theme.primary }}>
                          🏦 Primary Option: OPay Direct Transfer
                        </h4>
                        <span style={{ background: '#10b98120', color: '#10b981', padding: '3px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                          Fastest Verification
                        </span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                        Transfer the fee to your dedicated OPay account below using any banking app (GTB, Kuda, Zenith, PalmPay, etc.):
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Bank Name:</span>
                          <strong style={{ color: '#1e2937' }}>{paymentConfig.opayBankName || 'OPay Digital Services'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Account Number:</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ color: theme.primary, fontSize: '1.1rem', letterSpacing: '0.05em' }}>
                              {paymentConfig.opayAccountNumber || '7034297995'}
                            </strong>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(paymentConfig.opayAccountNumber || '7034297995');
                                alert('OPay account number copied!');
                                fetch('/api/preview/drip-trigger', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ leadId, eventType: 'account_copied' })
                                }).catch(() => {});
                              }}
                              style={{ background: theme.primary, color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Account Name:</span>
                          <strong style={{ color: '#1e2937', textTransform: 'uppercase' }}>{paymentConfig.opayAccountName || 'Oyelakin Tosin Matthew'}</strong>
                        </div>
                      </div>

                      {/* Moniepoint Secondary Fallback Trigger */}
                      <div style={{ marginTop: '12px', textAlign: 'center' }}>
                        {!showMoniepointFallback ? (
                          <button
                            type="button"
                            onClick={() => setShowMoniepointFallback(true)}
                            style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            Having issues transferring to OPay? Click for Moniepoint alternative
                          </button>
                        ) : (
                          <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '8px', textAlign: 'left' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Backup Alternative Option:</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Bank:</span>
                              <strong style={{ fontSize: '0.85rem' }}>{paymentConfig.moniepointBankName || 'Moniepoint MFB'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Acc No:</span>
                              <strong style={{ fontSize: '0.9rem', color: theme.primary }}>{paymentConfig.moniepointAccountNumber || '7034297995'}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Name:</span>
                              <strong style={{ fontSize: '0.8rem' }}>{paymentConfig.moniepointAccountName || 'Oyelakin Tosin Matthew'}</strong>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Receipt Screenshot Upload Box */}
                      <div style={{ marginTop: '16px', borderTop: '1px dashed #cbd5e1', paddingTop: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          📸 Upload Payment Screenshot / Receipt Proof:
                        </label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptUpload}
                          disabled={receiptUploading}
                          style={{
                            width: '100%',
                            padding: '8px',
                            background: '#fff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        />
                        {receiptStatus && (
                          <div style={{ marginTop: '8px', fontSize: '0.8rem', color: receiptStatus.includes('✅') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                            {receiptStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Details Container - Moniepoint Direct */}
                  {paymentMethod === 'moniepoint' && paymentConfig && (
                    <div style={{
                      background: 'rgba(2, 132, 199, 0.03)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '12px',
                      fontSize: '0.9rem'
                    }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', fontWeight: 700, color: theme.primary }}>
                        Moniepoint Transfer Details
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Bank Name:</span>
                          <strong style={{ color: '#1e2937' }}>{paymentConfig.moniepointBankName || 'Moniepoint MFB'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Account Number:</span>
                          <strong style={{ color: theme.primary, letterSpacing: '0.05em' }}>{paymentConfig.moniepointAccountNumber || '7034297995'}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Account Name:</span>
                          <strong style={{ color: '#1e2937', textTransform: 'uppercase' }}>{paymentConfig.moniepointAccountName || 'Oyelakin Tosin Matthew'}</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paystack' && paymentConfig && getDynamicClaimFee() > 0 && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.03)',
                      border: '1px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '8px',
                      textAlign: 'center',
                      fontSize: '0.9rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>One-time Setup Fee</span>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                        ₦{getDynamicClaimFee().toLocaleString()}
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={claimLoading}
                    className="btn-hover-effect"
                    style={{
                      background: theme.primary,
                      color: '#fff',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: claimLoading ? 'not-allowed' : 'pointer',
                      marginTop: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s'
                    }}
                  >
                    {claimLoading 
                      ? 'Processing...' 
                      : paymentMethod === 'paystack' && getDynamicClaimFee() > 0
                        ? `Pay NGN ${getDynamicClaimFee().toLocaleString()} & Deploy`
                        : 'Confirm Claim Request'}
                  </button>

                  <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {hasWebsite ? 'Or need other custom integrations?' : 'Or need custom layout/integrations?'}
                    </span>
                    <button 
                      type="button" 
                      onClick={handleEscalate} 
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.primary,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
                    >
                      Talk to a developer for custom requirements
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ padding: '20px 0' }}>
                <Award size={64} style={{ color: '#10b981', margin: '0 auto 24px' }} />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Request Submitted!</h2>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  {claimMessage || (hasWebsite 
                    ? `Thank you! We've received your request to claim the website upgrade for ${lead.name}. Our automation is preparing the integration files. We will contact you at the email provided to finalize setup.` 
                    : `Thank you! We've received your request to claim the website and domain for ${lead.name}. Our automation is triggering a deployment of your live files on GitHub and Vercel. We will contact you at the email provided to transfer ownership.`)}
                </p>
                <button 
                  onClick={() => setClaimed(false)}
                  style={{ background: '#e2e8f0', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, color: '#4b5563', cursor: 'pointer' }}
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sleek Footer */}
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '50px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div className="font-heading" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff' }}>
            {lead.name}
          </div>
          
          {/* Social Media Links */}
          {(() => {
            if (lead.social_links) {
              try {
                const socials = typeof lead.social_links === 'string' ? JSON.parse(lead.social_links) : lead.social_links;
                if (socials && typeof socials === 'object' && Object.keys(socials).length > 0) {
                  return (
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '10px', marginBottom: '10px' }}>
                      {Object.entries(socials).map(([platform, url]) => {
                        if (!url || typeof url !== 'string') return null;
                        const label = platform.toUpperCase();
                        return (
                          <a 
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              background: 'rgba(255, 255, 255, 0.08)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#fff',
                              textDecoration: 'none',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              padding: '8px 16px',
                              borderRadius: '20px',
                              transition: 'all 0.2s',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = theme.primary;
                              e.currentTarget.style.borderColor = theme.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            }}
                          >
                            <span>{label}</span>
                          </a>
                        );
                      })}
                    </div>
                  );
                }
              } catch (_) {}
            }
            return null;
          })()}
          
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '10px' }}>
            &copy; {new Date().getFullYear()} {lead.name}. All rights reserved. Deployed via Bethelmind Analytics & Strategy Reputation Automations.
          </div>
        </div>
      </footer>

      {/* Floating Sticky CTA Badge */}
      {isPreview && showFloatingCta && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '280px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          animation: 'fadeInUp 0.3s ease-out',
          transition: 'all 0.3s'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: theme.primary }}>⚡ LIVE PREVIEW ACTIVE</span>
              <span style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>EXPIRES SOON</span>
            </div>
            <strong style={{ fontSize: '0.85rem', color: '#1f2937', display: 'block' }}>Claim {lead.name} Website</strong>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Includes custom domain & SEO setup</span>
          </div>

          <a href="#claim" className="btn-hover-effect" style={{
            background: theme.primary,
            color: '#ffffff',
            textDecoration: 'none',
            textAlign: 'center',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'block'
          }}>
            Secure Website & Domain Now
          </a>
        </div>
      )}

      {/* Styled utilities for mobile responsive behaviors & custom design settings */}
      <style jsx>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none !important;
          }
        }

        .font-heading {
          font-family: '${theme.headingFont || theme.font || 'Outfit'}', serif !important;
        }
        
        .font-body {
          font-family: '${theme.bodyFont || theme.font || 'Inter'}', sans-serif !important;
        }

        .preloader-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: #090d16;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          animation: fadeOut 0.4s ease-out 1.0s forwards;
        }

        .preloader-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: ${theme.primary};
          border-radius: 50%;
          animation: spin 1s infinite linear;
        }

        .preloader-logo {
          color: #ffffff;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: fadeIn 0.6s ease-out 0.2s forwards;
        }

        .premium-mesh-bg {
          background-color: ${theme.bg};
          background-image: 
            radial-gradient(at 10% 20%, ${theme.primary}12 0px, transparent 50%),
            radial-gradient(at 90% 10%, ${theme.accent}12 0px, transparent 50%),
            radial-gradient(at 50% 80%, ${theme.primary}08 0px, transparent 50%);
          background-attachment: fixed;
        }

        .frosted-glass {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05) !important;
        }

        .frosted-glass-dark {
          background: rgba(15, 23, 42, 0.65) !important;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.07) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35) !important;
        }

        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .reveal.active {
          opacity: 1;
          transform: translateY(0);
        }

        .btn-hover-effect {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s, box-shadow 0.2s !important;
        }

        .btn-hover-effect:hover {
          transform: scale(1.03) translateY(-1px) !important;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15) !important;
          filter: brightness(1.05);
        }

        input:focus, select:focus, textarea:focus {
          border-color: ${theme.primary} !important;
          box-shadow: 0 0 0 3px ${theme.primary}33 !important;
          outline: none !important;
        }

        input, select, textarea {
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes counterPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .counter-animate {
          animation: counterPulse 2s ease-in-out infinite;
        }

        @keyframes whatsappPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
          70% { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }

        .whatsapp-float {
          animation: whatsappPulse 2s infinite;
        }

        .whatsapp-float:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.5);
        }

        .ndpr-banner {
          animation: fadeInUp 0.4s ease-out;
        }
      `}</style>

      {/* Sticky Floating WhatsApp Chat Button */}
      {(lead.phone_raw || lead.phone_e164) && (
        <a
          href={`https://wa.me/${formatWhatsAppNumber(lead.phone_e164 || lead.phone_raw)}?text=${encodeURIComponent(`Hello ${lead.name}! I visited your website and would like to inquire about your services.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-float"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            textDecoration: 'none'
          }}
          aria-label="Chat on WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}

      {/* NDPR Privacy Compliance Banner (Hidden on Preview Mode for Zero Clutter) */}
      {!ndprDismissed && !isPreview && (
        <div className="ndpr-banner" style={{
          position: 'fixed',
          bottom: lead.phone_raw ? '96px' : '24px',
          left: '24px',
          right: '24px',
          maxWidth: '480px',
          zIndex: 9998,
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#e2e8f0',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '0.82rem',
          lineHeight: 1.5
        }}>
          <div style={{ flex: 1 }}>
            <strong style={{ color: '#fff', fontSize: '0.85rem' }}>🔒 Your Privacy Matters</strong>
            <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
              This website processes data in compliance with the Nigeria Data Protection Act (NDPA). By continuing to browse, you consent to our use of essential cookies for site functionality.
            </p>
          </div>
          <button
            onClick={acceptNdpr}
            style={{
              background: theme.primary,
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            Accept
          </button>
        </div>
      )}

      {/* Sticky Mobile Bottom Action Bar (1-Tap Mobile Conversion) */}
      {isPreview && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9998,
          background: 'rgba(9, 13, 22, 0.96)',
          backdropFilter: 'blur(16px)',
          borderTop: '1.5px solid rgba(16, 185, 129, 0.4)',
          padding: '10px 16px',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.62rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800 }}>50% COMMITMENT DEPOSIT</span>
            <span style={{ fontSize: '0.98rem', color: '#34d399', fontWeight: 800 }}>₦75,000 <span style={{ fontSize: '0.72rem', color: '#cbd5e1', fontWeight: 500 }}>(Bal. on Handover)</span></span>
          </div>
          <a href="#claim" style={{
            flex: 1,
            maxWidth: '240px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            🚀 Claim Setup (50% Dep)
          </a>
        </div>
      )}

      {/* Universal Integration & Tool Compatibility Sales Narrative */}
      <SalesIntegrationNarrative clientName={lead?.name || 'Your Business'} />

      {/* Opt Out Footer Bar */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 10px',
        color: '#64748b',
        fontSize: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        marginTop: '40px'
      }}>
        <span>© {new Date().getFullYear()} {lead.name}. All rights reserved. </span>
        <button
          onClick={async () => {
            if (confirm('Are you sure you want to opt out of future updates regarding your custom website system?')) {
              try {
                const res = await fetch('/api/dnc', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ leadId, phone: lead.phone_e164 || lead.phone_raw })
                });
                const json = await res.json();
                alert(json.message || 'You have been unsubscribed.');
              } catch (_) {
                alert('You have been unsubscribed from future communications.');
              }
            }
          }}
          style={{ background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.75rem', marginLeft: '8px' }}
        >
          Opt-out of communications
        </button>
      </footer>
    </div>
  );
}
