'use client';

import React, { useEffect, useState } from 'react';
import { Globe, Shield, CheckCircle2, RefreshCw, Server, Star, Zap, ArrowRight } from 'lucide-react';

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
        // Pre-fill domain suggestion
        if (json.lead?.name) {
          const slug = json.lead.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          setDomainName(`${slug}.com`);
        }
        // Check if already claimed
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

  if (claimed) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white p-6">
        <div className="max-w-lg w-full bg-slate-900/60 border border-[#10b981]/20 p-10 rounded-2xl text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#10b981]/15 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
          </div>
          <h1 className="text-3xl font-bold">Website Claimed!</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            <strong className="text-white">{lead.name}</strong> has been successfully claimed. 
            Our team will set up your domain <strong className="text-[#06b6d4]">{domainName}</strong> and 
            reach out within 24 hours with next steps.
          </p>
          <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl px-6 py-4 text-xs text-slate-300 w-full">
            <p><strong>Lead ID:</strong> {leadId}</p>
            <p><strong>Selected Plan:</strong> {HOSTING_PLANS.find(p => p.id === selectedPlan)?.name}</p>
            <p><strong>Domain:</strong> {domainName}</p>
          </div>
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
              <span className="text-lg font-bold text-white block">Client Portal</span>
              <span className="text-xs text-slate-400">{lead.name}</span>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Ready to Claim
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12">
        {/* Lead Info Card */}
        <div className="bg-slate-900/60 border border-white/5 p-8 rounded-2xl mb-10">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#06b6d4]/20 to-[#8b5cf6]/20 flex items-center justify-center text-2xl font-bold text-[#06b6d4] border border-white/5 shrink-0">
              {lead.name?.charAt(0)?.toUpperCase() || 'B'}
            </div>
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-2xl font-bold text-white mb-1">{lead.name}</h1>
              <p className="text-sm text-slate-400">{lead.category} • {lead.area}, {lead.city}</p>
              {lead.phone_e164 && (
                <p className="text-xs text-slate-500 mt-2">📞 {lead.phone_e164}</p>
              )}
            </div>
            {lead.rating > 0 && (
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-xl border border-white/5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-white">{lead.rating}</span>
                <span className="text-xs text-slate-400">({lead.reviews_count} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Domain Selection */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#06b6d4]" /> Choose Your Domain
          </h2>
          <p className="text-sm text-slate-400 mb-5">Enter the preferred domain name for this website.</p>
          <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
            <label className="block text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-3">Preferred Domain Name</label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="e.g. mybusiness.com"
                  className="w-full bg-[#07090e] border border-white/10 px-4 py-3.5 rounded-xl outline-none text-sm text-slate-200 focus:border-[#06b6d4] transition-colors"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-3">
              We'll check availability and register this domain for you if it's available. You can also use a subdomain like <strong className="text-slate-400">{lead.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.netlify.app</strong> for free.
            </p>
          </div>
        </section>

        {/* Hosting Plan Selection */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Server className="w-5 h-5 text-[#8b5cf6]" /> Select a Hosting Plan
          </h2>
          <p className="text-sm text-slate-400 mb-5">Choose the plan that fits this business best.</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {HOSTING_PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-2xl border text-left flex flex-col gap-4 transition-all ${
                  selectedPlan === plan.id
                    ? `border-[${plan.color}] bg-[${plan.color}]/5 shadow-lg`
                    : 'border-white/5 bg-slate-900/40 hover:border-white/10'
                }`}
                style={selectedPlan === plan.id ? { borderColor: plan.color, backgroundColor: `${plan.color}10` } : {}}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-[#06b6d4] text-white uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${plan.color}15`, color: plan.color }}
                  >
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                    <p className="text-lg font-bold" style={{ color: plan.color }}>{plan.price}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        {/* Confirm & Claim Button */}
        <section>
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="w-full bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] hover:opacity-95 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#06b6d4]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {claiming ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" /> Claiming...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" /> Confirm & Claim Website
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-4">
            By clicking "Confirm & Claim", you agree to the selected plan and domain preference. Our team will begin setup immediately.
          </p>
        </section>
      </main>
    </div>
  );
}
