'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Shield, CheckCircle2, RefreshCw, Server, Star, Zap, ArrowRight, MessageSquare, PlusCircle, Sparkles, Send } from 'lucide-react';

interface HandoverPageProps {
  params: Promise<{ id: string }>;
}

const HOSTING_PLANS = [
  {
    id: 'free',
    name: 'Starter (Free)',
    price: '₦0/mo',
    features: ['Netlify/Vercel free tier', 'SSL Certificate', 'Custom subdomain', '100GB bandwidth'],
    color: '#10b981',
    recommended: false,
  },
  {
    id: 'basic',
    name: 'Business Basic',
    price: '₦5,000/mo',
    features: ['Custom .com domain', 'SSL Certificate', 'Unlimited bandwidth', 'Priority support'],
    color: '#06b6d4',
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Business Premium',
    price: '₦15,000/mo',
    features: ['Custom domain + email', 'SSL + CDN', 'SEO optimization', 'Analytics dashboard', 'Dedicated support'],
    color: '#8b5cf6',
    recommended: false,
  },
];

export default function HandoverPage({ params }: HandoverPageProps) {
  const [leadId, setLeadId] = useState<string>('');
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [domainName, setDomainName] = useState('');
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

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
    params.then(p => {
      setLeadId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (!leadId) return;
    async function fetchLead() {
      try {
        const res = await fetch(`/api/preview/generate?leadId=${leadId}`);
        if (!res.ok) throw new Error('Lead not found.');
        const json = await res.json();
        setLead(json.lead);
        if (json.lead?.name) {
          const slug = json.lead.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          setDomainName(`${slug}.com`);
        }
        if (json.lead?.status === 'CLAIMED') {
          setClaimed(true);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [leadId]);

  const handleClaim = async () => {
    if (!domainName.trim()) {
      alert('Please enter a preferred domain name.');
      return;
    }
    setClaiming(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          status: 'CLAIMED',
          notes: `${lead?.notes || ''}\n[${new Date().toISOString()}] CLAIMED via Handover Portal. Domain: ${domainName}. Plan: ${selectedPlan}.`
        })
      });
      if (!res.ok) throw new Error('Failed to claim lead.');
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
        <p className="text-sm font-semibold tracking-wider text-slate-400">LOADING CLIENT PORTAL...</p>
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

      {/* Header */}
      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-lg">
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
                <strong className="text-white">{lead.name}</strong> is now officially registered in our deployment pipeline.
                Our engineering team will map your domain <strong className="text-[#06b6d4]">{domainName}</strong> and send your admin credentials within 24 hours.
              </p>
              
              <div className="bg-slate-950/60 border border-white/10 rounded-xl p-6 text-xs text-slate-300 w-full max-w-lg text-left flex flex-col gap-2">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Lead ID</span>
                  <span className="font-mono text-white">{leadId}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-400">Selected Hosting Plan</span>
                  <span className="text-[#10b981] font-semibold">{HOSTING_PLANS.find(p => p.id === selectedPlan)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Domain</span>
                  <span className="text-[#06b6d4] font-semibold">{domainName}</span>
                </div>
              </div>
            </div>

            {/* PERVASIVE REFERRAL & SECONDARY WEBSITE CTA CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#8b5cf6]/20 border border-[#8b5cf6]/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8b5cf6] uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" /> Next Steps & Business Expansion
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Have Another Business or Friend Needing a Website?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Enter their business into our priority build pipeline. We will generate an AI landing page preview and deliver a ready-to-launch website!
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
          /* REGULAR UNCLAIMED HANDOVER REVIEW VIEW */
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

            {/* Hosting Plan Selector */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-white mb-4">1. Select Hosting & Deployment Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {HOSTING_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      selectedPlan === plan.id
                        ? 'bg-slate-900 border-[#06b6d4] shadow-lg shadow-[#06b6d4]/10'
                        : 'bg-slate-950/40 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold bg-[#06b6d4] text-slate-950 uppercase tracking-wider">
                        Recommended
                      </span>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                      <div className="text-2xl font-bold text-[#06b6d4] mb-4">{plan.price}</div>
                      <ul className="flex flex-col gap-2 mb-6 text-xs text-slate-300">
                        {plan.features.map((feat, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Domain Setup */}
            <div className="bg-slate-900/60 border border-white/5 p-8 rounded-2xl mb-10">
              <h2 className="text-lg font-bold text-white mb-2">2. Enter Preferred Domain Name</h2>
              <p className="text-xs text-slate-400 mb-4">We will configure DNS and SSL certificates for your custom domain automatically.</p>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="mybusiness.com"
                  className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>
            </div>

            {/* Claim Action */}
            <div className="flex items-center justify-between bg-gradient-to-r from-slate-950 to-slate-900 border border-white/10 p-6 rounded-2xl">
              <div>
                <span className="text-xs text-slate-400 block">Ready to accept handover?</span>
                <span className="text-sm font-bold text-white">Transfer full ownership & launch site</span>
              </div>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-slate-950 hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-[#06b6d4]/20"
              >
                {claiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {claiming ? 'Processing Claim...' : 'Claim Website Now'}
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
