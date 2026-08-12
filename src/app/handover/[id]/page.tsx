'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Shield, CheckCircle2, RefreshCw, Server, Star, Zap, ArrowRight, MessageSquare, PlusCircle, Sparkles, Send, Copy, AlertCircle, Info, Lock, CheckSquare, Square, Volume2, Bell, Cpu, Video, UserCheck, FileText, Users, Clock } from 'lucide-react';
import { copyToClipboard } from '@/lib/clipboard';

interface HandoverPageProps {
  params: Promise<{ id: string }>;
}

const MERGED_PACKAGES = [
  {
    id: 'express',
    name: 'Express Launch',
    price: '₦98,000',
    numericPrice: 98000,
    billingNote: 'Year 1 All-Inclusive (Website + Subdomain + Hosting)',
    renewalYear2: '₦35,000 / year starting in Year 2',
    features: [
      '⚡ Express WhatsApp Product & Service Catalog',
      '📲 1-Tap Direct WhatsApp Checkout',
      '📅 Express AI Appointment Booking Link',
      '⚡ Multi-Channel Autoresponder Engine',
      '🌐 Free Subdomain (.apexreach.site) + 1 Year Hosting',
      '🔒 SSL Security Certificate Included',
    ],
    color: '#10b981',
    recommended: false,
  },
  {
    id: 'growth',
    name: 'Business Growth & AI',
    price: '₦285,000',
    numericPrice: 285000,
    billingNote: 'Year 1 All-Inclusive (Domain + Hosting + AI Engine)',
    renewalYear2: '₦58,500 / year starting in Year 2',
    features: [
      '🤖 24/7 Customer AI Agent (Trained on Business Info)',
      '📱 AI Social Media Content Auto-Publisher (30-Day Post Schedule for IG, FB, TikTok, X)',
      '🚀 AI Meta Lead Ads & Google Search Ad Campaign Launcher',
      '📅 24/7 AI WhatsApp & Web Appointment Setter (Google Calendar Sync)',
      '📲 WhatsApp Critical Human Approval Center (Sends to Admin Phone)',
      '🌐 Custom .com.ng Domain INCLUDED (Year 1)',
      '🚀 1 Full Year High-Speed Server Hosting Included',
      '🏦 Moniepoint & OPay Direct Transfer Box',
      '🛡️ Lead Protection & Guarantee Shield Badge',
    ],
    color: '#06b6d4',
    recommended: true,
  },
  {
    id: 'vip',
    name: 'VIP AI Sales Suite',
    price: '₦650,000',
    numericPrice: 650000,
    billingNote: 'Year 1 All-Inclusive (Domain + Enterprise Hosting + Voice AI)',
    renewalYear2: '₦123,500 / year starting in Year 2',
    features: [
      'Everything in Business Growth Tier',
      '📱 AI Social Media Auto-Publisher (Dual-Tone Pidgin/English AI Writer)',
      '🎯 AI Meta Lead Ads & Google Search Ads Auto-Campaign Launcher',
      '📞 150 Mins Conversational Voice AI Phone Calling Agent (Inbound & Outbound Calls)',
      '📅 24/7 AI Appointment Setter & Calendar Booking Engine',
      '🌐 Custom .com Domain INCLUDED (Year 1)',
      '⚡ 1 Full Year VIP Enterprise High-Speed Hosting',
      '⭐ Google Review 5-Star Tap Card Auto-Requester',
      '📊 Weekly Managed Lead Reports via WhatsApp',
    ],
    color: '#8b5cf6',
    recommended: false,
  },
  {
    id: 'luxury',
    name: 'Apex Luxury Executive',
    price: '₦1,650,000',
    numericPrice: 1650000,
    billingNote: 'Year 1 All-Inclusive (White-Glove Setup + Dedicated Servers)',
    renewalYear2: '₦235,000 / year starting in Year 2',
    features: [
      '👑 100% White-Glove VIP Setup & Dedicated Account Director',
      '🤖 Enterprise AI Agent Trained on ERP/CRM Schemas',
      '📞 300 Mins Conversational Voice AI (Formal & Pidgin Tones)',
      '📅 Multi-Branch AI Appointment Router & Calendar Sync',
      '🌐 Premium .com Domain + Dedicated High-Speed CDN Routing',
      '🏢 Multi-Branch / Multi-Agent Lead Routing System',
    ],
    color: '#f59e0b',
    recommended: false,
  },
];

interface EnterpriseAddon {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  badge?: string;
  icon: string;
}

const ENTERPRISE_ADDONS: EnterpriseAddon[] = [
  {
    id: 'voice_note_ai',
    name: 'WhatsApp AI Voice Note Transcriber & Audio Responder',
    price: 45000,
    priceFormatted: '+₦45,000',
    description: 'Transcribes customer WhatsApp audio voice notes and replies in natural English or Pidgin audio.',
    badge: '🔥 75%+ Buyer Demand',
    icon: '🎙️',
  },
  {
    id: 'human_escalation',
    name: 'WhatsApp Human Escalation Alert ("Hot Deal Admin Alert")',
    price: 35000,
    priceFormatted: '+₦35,000',
    description: 'Triggers instant red WhatsApp alert to owner phone when a high-ticket customer is ready to pay.',
    badge: '🚨 Close Deals Fast',
    icon: '🚨',
  },
  {
    id: 'pidgin_local_ai',
    name: 'English + Pidgin + Yoruba + Hausa AI Switcher',
    price: 25000,
    priceFormatted: '+₦25,000',
    description: '1-tap AI language toggle for wide reach across all Nigerian customer demographics.',
    icon: '🇳🇬',
  },
  {
    id: 'installment_drip',
    name: 'Automated Payment & Installment Drip Reminders',
    price: 35000,
    priceFormatted: '+₦35,000',
    description: 'Chases monthly/termly installment due dates with direct OPay transfer links on WhatsApp.',
    icon: '💳',
  },
  {
    id: 'virtual_inspection',
    name: 'Instant WebRTC 1-Click Virtual Inspection Video Call',
    price: 50000,
    priceFormatted: '+₦50,000',
    description: 'Browser video inspection calls for property, car engines & consultations without Zoom downloads.',
    icon: '📹',
  },
  {
    id: 'cac_nin_shield',
    name: 'CAC Registration & NIN Identity Verification Shield',
    price: 30000,
    priceFormatted: '+₦30,000',
    description: 'Verifies customer CAC RC numbers and NIN identity on high-ticket booking forms to block scammers.',
    icon: '🛡️',
  },
  {
    id: 'google_review',
    name: '1-Tap Google Review 5-Star Auto-Requester',
    price: 25000,
    priceFormatted: '+₦25,000',
    description: 'Automated 24h WhatsApp follow-up requesting 5-star Google Maps reviews from happy customers.',
    icon: '⭐',
  },
  {
    id: 'multi_agent_router',
    name: 'WhatsApp Multi-Agent Round-Robin Lead Router',
    price: 20000,
    priceFormatted: '+₦20,000',
    description: 'Rotates incoming sales chats fairly across 2 or more staff members so no lead is delayed.',
    icon: '👥',
  },
  {
    id: 'branded_pdf_invoice',
    name: 'Instant Branded PDF Proposal & Invoice Generator',
    price: 25000,
    priceFormatted: '+₦25,000',
    description: 'Generates instant downloadable PDF quotes w/ client logo, CAC info & OPay transfer details.',
    icon: '📄',
  },
  {
    id: 'social_proof_toast',
    name: 'Live Social Proof & FOMO Urgency Toast Widget',
    price: 15000,
    priceFormatted: '+₦15,000',
    description: 'Renders real-time notification toasts ("Chidi from Ikeja just booked 3 mins ago") to boost sales.',
    icon: '⚡',
  },
];

export default function HandoverPage({ params }: HandoverPageProps) {
  const [leadId, setLeadId] = useState<string>('');
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('growth');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['human_escalation', 'google_review']);
  const [domainName, setDomainName] = useState('');
  const [opayRef, setOpayRef] = useState('');
  const [clientEmailInput, setClientEmailInput] = useState('');
  const [clientNameInput, setClientNameInput] = useState('');
  const [copyToast, setCopyToast] = useState(false);

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // OPay Account Details (Configurable default)
  const opayDetails = {
    bankName: 'OPay Digital Services (Merchant)',
    accountNumber: '8061234567',
    accountName: 'Bethelmind Analytics & Strategy (OPay)',
  };

  // Modals state
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  // Referral form state
  const [refBusiness, setRefBusiness] = useState('');
  const [refContact, setRefContact] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refSubmitting, setRefSubmitting] = useState(false);
  const [refSuccess, setRefSuccess] = useState(false);

  // Revision form state
  const [revCategory, setRevCategory] = useState<'Branding/Colors' | 'Text/Copy' | 'Logo/Images' | 'Layout/Features' | 'General'>('Branding/Colors');
  const [revNotes, setRevNotes] = useState('');
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revSuccess, setRevSuccess] = useState(false);

  useEffect(() => {
    Promise.resolve(params).then(p => {
      if (p && p.id) {
        setLeadId(p.id);
      } else {
        setError('Invalid route parameter: Lead ID missing.');
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Failed to resolve page params:', err);
      setError('Failed to resolve route parameter.');
      setLoading(false);
    });
  }, [params]);

  useEffect(() => {
    if (!leadId) return;
    async function fetchLead() {
      try {
        const res = await fetch(`/api/preview/generate?leadId=${encodeURIComponent(leadId)}`);
        if (!res.ok) throw new Error('Lead not found or invalid.');
        const json = await res.json();
        if (!json.lead) throw new Error('Requested lead data is not available.');
        setLead(json.lead);
        if (json.lead?.name) {
          const slug = json.lead.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          setDomainName(`${slug}.com.ng`);
          setClientNameInput(json.lead.name);
        }
        if (json.lead?.email) {
          setClientEmailInput(json.lead.email);
        }
        if (json.lead?.status === 'CONTACTED' && json.lead?.notes?.includes('CLAIMED')) {
          setClaimed(true);
        }
      } catch (err: any) {
        setError(err.message || 'Error loading lead details.');
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev =>
      prev.includes(addonId) ? prev.filter(id => id !== addonId) : [...prev, addonId]
    );
  };

  const copyAccountToClipboard = async () => {
    const success = await copyToClipboard(opayDetails.accountNumber);
    if (success) {
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 3000);
    }
  };

  // Pricing calculations
  const selectedPkg = MERGED_PACKAGES.find(p => p.id === selectedPlan) || MERGED_PACKAGES[1];
  const basePrice = selectedPkg.numericPrice;
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = ENTERPRISE_ADDONS.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const grandTotal = basePrice + addonsTotal;
  const grandTotalFormatted = `₦${grandTotal.toLocaleString()}`;

  const handleClaim = async () => {
    if (!domainName.trim()) {
      alert('Please enter your preferred domain name (e.g. mybusiness.com.ng).');
      return;
    }

    if (!domainName.includes('.')) {
      alert('Please enter a valid domain extension (e.g. .com or .com.ng).');
      return;
    }

    if (selectedPlan !== 'express' && !opayRef.trim()) {
      alert('Please enter your OPay payment reference / transaction note after transferring.');
      return;
    }

    setClaiming(true);
    try {
      const activeAddonNames = selectedAddons.map(id => ENTERPRISE_ADDONS.find(a => a.id === id)?.name).filter(Boolean);
      const res = await fetch('/api/preview/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          clientName: clientNameInput || lead?.name || 'Client',
          clientEmail: clientEmailInput || 'client@business.com',
          paymentMethod: 'bank_transfer_opay',
          selectedFeatures: activeAddonNames,
          customInstructions: `[CLAIMED ALL-IN-ONE + ADDONS] Base Plan: ${selectedPkg.name} (${selectedPkg.price}). Addons: ${activeAddonNames.join(', ') || 'None'}. Grand Total: ${grandTotalFormatted}. Domain: ${domainName}. OPay Ref: ${opayRef || 'N/A'}. Agreed Year 2 Renewal: ${selectedPkg.renewalYear2}.`
        })
      });

      if (!res.ok) throw new Error('Failed to submit claim request. Please try again.');
      setClaimed(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClaiming(false);
    }
  };

  const submitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refBusiness.trim()) return alert('Business name is required.');
    setRefSubmitting(true);
    try {
      const res = await fetch('/api/handover/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: refBusiness,
          contactName: refContact,
          email: refEmail,
          phone: refPhone,
          referrerClient: lead?.name || 'Handover Client',
        })
      });
      if (!res.ok) throw new Error('Failed to submit referral');
      setRefSuccess(true);
      setRefBusiness('');
      setRefContact('');
      setRefEmail('');
      setRefPhone('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRefSubmitting(false);
    }
  };

  const submitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revNotes.trim()) return alert('Please enter revision notes.');
    setRevSubmitting(true);
    try {
      const res = await fetch('/api/handover/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_revision',
          feedback: `[Category: ${revCategory}] ${revNotes}`,
          clientName: lead?.name || 'Handover Client',
        })
      });
      if (!res.ok) throw new Error('Failed to submit revision');
      setRevSuccess(true);
      setRevNotes('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRevSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white flex-col gap-4">
        <RefreshCw className="w-8 h-8 text-[#06b6d4] animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-slate-400">LOADING CLIENT HANDOVER PORTAL...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-red-400 p-6">
        <div className="max-w-md w-full bg-slate-900/40 p-8 rounded-2xl border border-red-500/20 text-center">
          <h2 className="text-xl font-bold mb-2">Lead Not Found</h2>
          <p className="text-sm text-slate-400">{error || 'The requested lead ID does not exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative overflow-x-hidden pb-16">
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#06b6d4]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#8b5cf6]/5 blur-3xl pointer-events-none"></div>

      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed top-6 right-6 bg-[#10b981] text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> OPay Account Number Copied to Clipboard!
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-[#06b6d4]/20">
              A
            </div>
            <div>
              <span className="text-lg font-bold text-white block">Client Handover Portal</span>
              <span className="text-xs text-slate-400">{lead.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRevSuccess(false); setShowRevisionModal(true); }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#06b6d4]" /> Request Revisions
            </button>
            <button
              onClick={() => { setRefSuccess(false); setShowReferralModal(true); }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-90 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-[#06b6d4]/20"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Refer / Build New Website
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* CLAIMED POST-HANDOVER VIEW */}
        {claimed ? (
          <div className="flex flex-col gap-8">
            <div className="bg-slate-900/60 border border-[#10b981]/30 p-10 rounded-2xl text-center flex flex-col items-center gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="w-20 h-20 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center shadow-lg shadow-[#10b981]/20">
                <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
              </div>
              <h1 className="text-3xl font-bold text-white">🎉 Website Successfully Claimed!</h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-lg">
                <strong className="text-white">{lead.name}</strong> is now registered for launch.
                Our engineering team will verify your OPay payment reference, register domain <strong className="text-[#06b6d4]">{domainName}</strong>, and send your admin credentials within 24 hours.
              </p>
              
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-6 text-xs text-slate-300 w-full max-w-lg text-left flex flex-col gap-3">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Lead ID</span>
                  <span className="font-mono text-white">{leadId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Base Package</span>
                  <span className="text-[#10b981] font-semibold">{selectedPkg?.name} ({selectedPkg?.price})</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Active Add-Ons ({selectedAddons.length})</span>
                  <span className="text-cyan-400 font-semibold">+₦{addonsTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Grand Total Amount</span>
                  <span className="text-emerald-400 font-bold text-sm">{grandTotalFormatted}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Target Domain</span>
                  <span className="text-[#06b6d4] font-semibold">{domainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Year 2 Renewal Locked Rate</span>
                  <span className="text-purple-400 font-semibold">{selectedPkg?.renewalYear2}</span>
                </div>
              </div>
            </div>

            {/* REFERRAL CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#8b5cf6]/20 border border-[#8b5cf6]/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8b5cf6] uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> Next Steps & Expansion
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Need Another Website or Have a Business Friend?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Enter their business into our automated pipeline. We will generate an AI preview and deliver a ready-to-launch site!
                </p>
              </div>
              <button
                onClick={() => { setRefSuccess(false); setShowReferralModal(true); }}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:opacity-90 transition-all shrink-0 shadow-lg shadow-[#06b6d4]/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Order Another Website
              </button>
            </div>
          </div>
        ) : (
          /* UNCLAIMED HANDOVER REVIEW VIEW */
          <div>
            {/* Lead Header */}
            <div className="bg-slate-900/60 border border-white/5 p-8 rounded-2xl mb-10 flex items-start gap-6 flex-wrap">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 flex items-center justify-center text-2xl font-bold text-[#06b6d4] border border-white/5 shrink-0">
                {lead.name?.charAt(0)?.toUpperCase() || 'B'}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl font-bold text-white mb-1">{lead.name}</h1>
                <p className="text-sm text-slate-400">{lead.category} • {lead.area}, {lead.city}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-300">
                  <span>📍 {lead.city || 'Local Region'}</span>
                  <span>📞 {lead.phone || 'Phone verified'}</span>
                </div>
              </div>
              <button
                onClick={() => { setRevSuccess(false); setShowRevisionModal(true); }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-[#06b6d4]" /> Request Revisions
              </button>
            </div>

            {/* Merged Package Selector */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-1">1. Select Merged All-In-One Package (Year 1 All-Inclusive)</h2>
              <p className="text-xs text-slate-400 mb-6">Website Build + Custom Domain Registration + 1 Full Year High-Speed Hosting Included.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MERGED_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPlan(pkg.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedPlan === pkg.id
                        ? 'bg-slate-900 border-[#06b6d4] shadow-xl shadow-[#06b6d4]/10 scale-[1.01]'
                        : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {pkg.recommended && (
                      <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold bg-[#06b6d4] text-slate-950 uppercase tracking-wider shadow-md">
                        Most Popular (70% Choice)
                      </span>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                      <div className="text-3xl font-extrabold text-[#06b6d4] mb-1">{pkg.price}</div>
                      <div className="text-[11px] font-semibold text-slate-400 mb-4">{pkg.billingNote}</div>
                      
                      <ul className="flex flex-col gap-2.5 mb-6 text-xs text-slate-300">
                        {pkg.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-white/5 text-[11px] text-purple-300 flex items-center gap-1.5 font-medium">
                      <Lock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{pkg.renewalYear2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* INTERACTIVE SELECTABLE ENTERPRISE ADD-ONS SECTION */}
            <div className="mb-10 bg-slate-950/60 border border-white/10 p-8 rounded-2xl">
              <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#06b6d4]" /> 2. Customize Enterprise Add-On Modules (Select / Deselect)
                  </h2>
                  <p className="text-xs text-slate-400">Toggle high-value automation features on or off. Price updates automatically.</p>
                </div>
                <div className="bg-slate-900 border border-[#06b6d4]/30 px-4 py-2 rounded-xl text-xs font-bold text-[#06b6d4]">
                  Selected Add-Ons: +₦{addonsTotal.toLocaleString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {ENTERPRISE_ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-slate-900/90 border-[#06b6d4]/60 shadow-md shadow-[#06b6d4]/5'
                          : 'bg-slate-950/30 border-white/5 hover:border-white/10 opacity-75'
                      }`}
                    >
                      <div className="mt-0.5 text-[#06b6d4]">
                        {isChecked ? <CheckSquare className="w-5 h-5 text-[#06b6d4]" /> : <Square className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{addon.icon}</span> {addon.name}
                          </span>
                          <span className="text-xs font-mono font-bold text-[#10b981] shrink-0">{addon.priceFormatted}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-1.5">{addon.description}</p>
                        {addon.badge && (
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {addon.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Year 2 Transparency, AI Usage & Zero Lock-In Guarantee Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-900/60 border border-purple-500/20 p-6 rounded-2xl flex items-start gap-3">
                <Shield className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">🔒 Year 2 Pricing Transparency</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Year 1 includes **Custom Domain, SSL & High-Speed Hosting FREE**.
                    Starting in Year 2, your locked renewal rate is <strong className="text-purple-300">{selectedPkg?.renewalYear2}</strong>. Zero hidden fees.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-[#06b6d4]/20 p-6 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-[#06b6d4] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">🤖 Google Gemini AI Usage</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Includes **100% Free API Tier** (up to 15 responses/min), fully covering visitor & WhatsApp chats. You can also plug in your own free Gemini API key anytime.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-[#10b981]/20 p-6 rounded-2xl flex items-start gap-3">
                <Globe className="w-6 h-6 text-[#10b981] shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">🛡️ Zero Lock-In & Full Independence</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Your website is **100% self-contained**. Even if our platform is offline or undergoes maintenance, your domain, website, and WhatsApp order buttons run 24/7/365 without interruption. You own your code & domain 100%.
                  </p>
                </div>
              </div>
            </div>

            {/* Domain & Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Domain Entry */}
              <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-1">3. Preferred Custom Domain Name</h2>
                  <p className="text-xs text-slate-400 mb-4">We configure DNS and SSL automatically for your target domain.</p>
                  <input
                    type="text"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="mybusiness.com.ng"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#06b6d4]" /> Free domain registration included in your package.
                </p>
              </div>

              {/* OPay Payment Account Box */}
              <div className="bg-slate-900/80 border border-[#10b981]/30 p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-[#10b981]/20 border-b border-l border-[#10b981]/30 rounded-bl-xl text-[10px] font-bold text-[#10b981] uppercase tracking-wider">
                  OPay Direct Transfer
                </div>

                <div>
                  <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#10b981]" /> 4. OPay Bank Account Details
                  </h2>
                  <p className="text-xs text-slate-400 mb-2">Transfer total checkout amount (<strong className="text-emerald-400">{grandTotalFormatted}</strong>) to our official OPay account:</p>

                  <div className="bg-slate-950 p-4 rounded-xl border border-white/10 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="text-slate-400">Bank Name</span>
                      <span className="text-white font-semibold">{opayDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5 items-center">
                      <span className="text-slate-400">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-[#10b981]">{opayDetails.accountNumber}</span>
                        <button
                          onClick={copyAccountToClipboard}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 transition-all border border-white/10"
                        >
                          <Copy className="w-3 h-3 text-[#10b981]" /> Copy
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name</span>
                      <span className="text-white font-semibold">{opayDetails.accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Enter OPay Payment Reference / Sender Name *
                  </label>
                  <input
                    type="text"
                    value={opayRef}
                    onChange={(e) => setOpayRef(e.target.value)}
                    placeholder="e.g. OPay Ref 1004829381 / Sender: John Doe"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>
            </div>

            {/* Claim Action Summary Bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-slate-900 border border-[#06b6d4]/40 p-6 rounded-2xl flex-wrap gap-4 shadow-xl">
              <div>
                <span className="text-xs text-slate-400 block">Total Package + Add-Ons ({selectedAddons.length} selected):</span>
                <span className="text-2xl font-extrabold text-emerald-400">{grandTotalFormatted}</span>
                <span className="text-xs text-slate-400 ml-2 font-medium">({selectedPkg.name})</span>
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-slate-950 hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#06b6d4]/20"
              >
                {claiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {claiming ? 'Processing Claim...' : `Claim & Launch Website Now (${grandTotalFormatted})`}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* REFERRAL MODAL */}
      {showReferralModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 text-slate-100">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#06b6d4]" /> Build Another Website / Refer
            </h3>
            <p className="text-xs text-slate-400 mb-4">Enter business details to add them directly into our priority automated pipeline.</p>

            {refSuccess ? (
              <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                <h4 className="font-bold text-white">Referral Submitted!</h4>
                <p className="text-xs text-slate-300">New lead successfully injected into the automated pipeline.</p>
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitReferral} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={refBusiness}
                    onChange={e => setRefBusiness(e.target.value)}
                    placeholder="e.g. Apex Solar Solutions"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Contact Name</label>
                  <input
                    type="text"
                    value={refContact}
                    onChange={e => setRefContact(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={refEmail}
                      onChange={e => setRefEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={refPhone}
                      onChange={e => setRefPhone(e.target.value)}
                      placeholder="+234..."
                      className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowReferralModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={refSubmitting}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:opacity-90 flex items-center gap-1.5"
                  >
                    {refSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit to Pipeline
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REVISION MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 text-slate-100">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#06b6d4]" /> Submit Design Revisions
            </h3>
            <p className="text-xs text-slate-400 mb-4">Our AI & dev team will process your adjustment requests within 24 hours.</p>

            {revSuccess ? (
              <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                <h4 className="font-bold text-white">Revision Request Received!</h4>
                <p className="text-xs text-slate-300">Your feedback has been logged and assigned to the development queue.</p>
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submitRevision} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Revision Category</label>
                  <select
                    value={revCategory}
                    onChange={e => setRevCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="Branding/Colors">Branding & Color Scheme</option>
                    <option value="Text/Copy">Text Content & Copy Edits</option>
                    <option value="Logo/Images">Logo & Image Replacements</option>
                    <option value="Layout/Features">Layout & Feature Adjustments</option>
                    <option value="General">General Questions</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">Detailed Instructions *</label>
                  <textarea
                    required
                    rows={4}
                    value={revNotes}
                    onChange={e => setRevNotes(e.target.value)}
                    placeholder="Describe the exact changes you want (e.g. Change primary button color to navy blue, update business phone number to +234...)"
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowRevisionModal(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={revSubmitting}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#06b6d4] text-slate-950 hover:opacity-90 flex items-center gap-1.5"
                  >
                    {revSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Submit Feedback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
