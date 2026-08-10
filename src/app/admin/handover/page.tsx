'use client';

import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertTriangle, RefreshCw, Download, FileText, PlusCircle, MessageSquare, Sparkles, Send, ArrowRight, UserCheck } from 'lucide-react';

export default function AdminHandoverPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loadingDiag, setLoadingDiag] = useState(true);
  const [activeTab, setActiveTab] = useState<'audit' | 'revisions' | 'ip' | 'referrals' | 'docs'>('audit');

  // Client / IP Contract State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [signedDate, setSignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generatingBundle, setGeneratingBundle] = useState(false);
  const [bundleSuccess, setBundleSuccess] = useState(false);

  // Referral Modal State
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [refBusiness, setRefBusiness] = useState('');
  const [refContact, setRefContact] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refSubmitting, setRefSubmitting] = useState(false);
  const [refSuccess, setRefSuccess] = useState(false);

  // Revision Form State
  const [revCategory, setRevCategory] = useState<'Branding/Colors' | 'Text/Copy' | 'Logo/Images' | 'Layout/Features' | 'General'>('Branding/Colors');
  const [revNotes, setRevNotes] = useState('');
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revSuccess, setRevSuccess] = useState(false);
  const [loggedTickets, setLoggedTickets] = useState<any[]>([]);

  const fetchDiagnostics = async () => {
    setLoadingDiag(true);
    try {
      const res = await fetch('/api/handover/run');
      if (res.ok) {
        const json = await res.json();
        setDiagnostics(json);
      }
    } catch (err) {
      console.error('Failed to fetch diagnostics', err);
    } finally {
      setLoadingDiag(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleGenerateBundle = async () => {
    if (!clientName.trim()) return alert('Please enter client name for IP transfer.');
    setGeneratingBundle(true);
    try {
      const res = await fetch('/api/handover/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_bundle',
          clientName,
          clientEmail,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate bundle');
      setBundleSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGeneratingBundle(false);
    }
  };

  const handleAddRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revNotes.trim()) return alert('Please enter revision feedback.');
    setRevSubmitting(true);
    try {
      const res = await fetch('/api/handover/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_revision',
          feedback: `[Category: ${revCategory}] ${revNotes}`,
          clientName: clientName || 'Client',
          clientEmail,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit revision');
      const json = await res.json();
      if (json.ticket) {
        setLoggedTickets(prev => [json.ticket, ...prev]);
      }
      setRevSuccess(true);
      setRevNotes('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRevSubmitting(false);
    }
  };

  const handleAddReferral = async (e: React.FormEvent) => {
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
          referrerClient: clientName || 'Handover Admin Portal',
        }),
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

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Master Handover & Growth Engine
            </div>
            <h1 className="text-3xl font-bold text-white">Software & Website Handover Portal</h1>
            <p className="text-sm text-slate-400">Zero-error deployment auditing, IP contract generation, revision tracking, and pipeline growth.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setRefSuccess(false); setShowReferralModal(true); }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] text-white hover:opacity-90 flex items-center gap-2 shadow-lg shadow-[#06b6d4]/20"
            >
              <PlusCircle className="w-4 h-4" /> Build Another Website / Refer Lead
            </button>
          </div>
        </div>

        {/* Diagnostic Status Bar */}
        <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-[#06b6d4] ${loadingDiag ? 'animate-spin' : ''}`} />
              Pre-Flight System Health & Diagnostics
            </h3>
            <button onClick={fetchDiagnostics} className="text-xs text-[#06b6d4] hover:underline">Re-run Audit</button>
          </div>

          {loadingDiag ? (
            <div className="text-xs text-slate-400 py-4">Running AI & service diagnostics...</div>
          ) : diagnostics ? (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
              {Object.entries(diagnostics.services || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-slate-950/60 p-3 rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-slate-400 capitalize mb-1">{key}</span>
                  <div className="flex items-center gap-1.5 font-bold">
                    {value.status === 'OK' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10b981]" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className={value.status === 'OK' ? 'text-[#10b981]' : 'text-amber-400'}>{value.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'audit' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            1. Master Handover Bundle
          </button>
          <button
            onClick={() => setActiveTab('revisions')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'revisions' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            2. Revision Station & AI Tickets
          </button>
          <button
            onClick={() => setActiveTab('ip')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'ip' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            3. Legal IP Agreement Vault
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'docs' ? 'border-[#06b6d4] text-[#06b6d4]' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            4. Downloadable Docs & Walkthrough Hub
          </button>
        </div>

        {/* TAB 1: BUNDLE GENERATOR */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900/60 border border-white/5 p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Generate Client Handover Package</h2>
            <p className="text-xs text-slate-400 mb-6">Executes pre-flight audit, sanitizes `.env` variables, builds offline `HANDOVER_SUMMARY.html`, and generates the IP transfer agreement.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Client Business / Organization Name *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Apex Solar Ltd"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Client Email Address</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="client@apexsolar.com"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                />
              </div>
            </div>

            {bundleSuccess ? (
              <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                <h3 className="text-base font-bold text-white">Handover Bundle Ready!</h3>
                <p className="text-xs text-slate-300">All source code, database dumps, IP contracts, and environment templates have been packaged.</p>
                <a
                  href="/TRANSFER_OF_IP.md"
                  target="_blank"
                  className="px-6 py-3 rounded-xl text-xs font-bold bg-[#10b981] text-slate-950 hover:opacity-90 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Handover Package & IP Contract
                </a>
              </div>
            ) : (
              <button
                onClick={handleGenerateBundle}
                disabled={generatingBundle}
                className="px-6 py-3.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#06b6d4] to-[#10b981] text-slate-950 hover:opacity-90 flex items-center gap-2 shadow-lg shadow-[#06b6d4]/20"
              >
                {generatingBundle ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {generatingBundle ? 'Building Package...' : '1-Click Package Handover & IP Transfer'}
              </button>
            )}
          </div>
        )}

        {/* TAB 2: REVISION STATION */}
        {activeTab === 'revisions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-2">Submit New Revision Request</h3>
              <p className="text-xs text-slate-400 mb-4">Feedback is processed through AI QA validation and converted into dev tickets.</p>
              
              <form onSubmit={handleAddRevision} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <select
                    value={revCategory}
                    onChange={e => setRevCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  >
                    <option value="Branding/Colors">Branding & Color Scheme</option>
                    <option value="Text/Copy">Text Content & Copy Edits</option>
                    <option value="Logo/Images">Logo & Image Replacements</option>
                    <option value="Layout/Features">Layout & Feature Adjustments</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Revision Notes</label>
                  <textarea
                    rows={4}
                    required
                    value={revNotes}
                    onChange={e => setRevNotes(e.target.value)}
                    placeholder="Enter visual or copy feedback..."
                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={revSubmitting}
                  className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[#06b6d4] text-slate-950 hover:opacity-90 flex items-center justify-center gap-2"
                >
                  {revSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Submit to AI Ticket Queue
                </button>
              </form>
            </div>

            <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-4">Logged AI Dev Tickets ({loggedTickets.length})</h3>
              {loggedTickets.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No tickets logged yet. Submit feedback on the left.</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {loggedTickets.map((t, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-white/5 text-xs flex flex-col gap-1">
                      <div className="flex justify-between font-bold text-white">
                        <span className="text-[#06b6d4]">{t.category}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">{t.priority}</span>
                      </div>
                      <p className="text-slate-300 font-semibold">{t.summary}</p>
                      <p className="text-slate-400 text-[11px]">{t.suggestedAction}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: IP AGREEMENT */}
        {activeTab === 'ip' && (
          <div className="bg-slate-900/60 border border-white/5 p-8 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Transfer of Intellectual Property (IP) Contract</h2>
            <p className="text-xs text-slate-400 mb-6">Official IP transfer document waiving developer rights and granting full legal ownership to the client.</p>

            <div className="bg-slate-950 p-6 rounded-xl border border-white/10 text-xs font-mono text-slate-300 leading-relaxed max-w-2xl mb-6">
              <p className="font-bold text-white text-sm mb-4"># TRANSFER_OF_IP.md</p>
              <p>By executing this agreement, the client receiving this codebase receives **full ownership** of all source code, assets, and documentation contained herein.</p>
              <p className="my-3"><strong>Client:</strong> {clientName || '______________________'}</p>
              <p className="my-3"><strong>Date:</strong> {signedDate}</p>
              <p>The original author hereby waives all copyright claims and grants the client all rights to modify, distribute, and commercialize the software without any further obligations.</p>
            </div>
          </div>
        )}

        {/* TAB 4: DOWNLOADABLE DOCS & WALKTHROUGH HUB */}
        {activeTab === 'docs' && (
          <div className="bg-slate-900/60 border border-white/10 p-8 rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#06b6d4]" /> Official Platform Documents & Governance Hub
                </h2>
                <p className="text-xs text-slate-400">Download official policies, client agreements, AI disclaimers, and human assistant walkthroughs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'admin_assistant_walkthrough', title: '📖 Admin Assistant Operations Walkthrough', desc: 'Complete operational walkthrough covering prompt-based redesigns, feature customizer, and approval workflows.' },
                { key: 'ai_responsible_use_policy', title: '🛡️ AI Responsible Use & Safety Policy', desc: 'Rules for human oversight, anti-abuse protocols, AI transparency, and non-training privacy guarantees.' },
                { key: 'ai_disclaimer_policy', title: '⚠️ AI Disclaimer & Transparency Policy', desc: 'Accuracy limits, non-binding quote disclaimer, and human confirmation requirements.' },
                { key: 'client_ip_transfer', title: '📜 Client Software & IP Transfer Contract', desc: 'Legal transfer agreement for turnkey website assets, custom domain setups, and embed scripts.' },
                { key: 'responsible_outreach_policy', title: '⚖️ Responsible Outreach & NDPR Policy', desc: 'Outreach compliance rules, WhatsApp business policy adherence, and NDPR opt-out requirements.' },
                { key: 'sla_service_level_agreement', title: '⚡ Service Level Agreement (SLA) & Uptime', desc: '99.9% uptime target, maintenance windows, and emergency support response times.' },
                { key: 'client_onboarding_guide', title: '🚀 Client Web Portal Onboarding Guide', desc: 'Step-by-step onboarding walkthrough for clients claiming websites & pasting embed scripts.' },
                { key: 'terms_of_service', title: '📜 Master Terms of Service & Subscriptions', desc: 'Platform usage terms, recurring subscription billing rules, and acceptable conduct.' },
                { key: 'privacy_policy', title: '🔒 Privacy Policy & Data Protection', desc: 'NDPR compliance, data encryption standards, and user privacy rights statement.' },
                { key: 'partner_referral_agreement', title: '🤝 Agency & Partner Referral Terms', desc: '15% recurring commission structure, payout conditions, and partner agency terms.' },
              ].map((doc) => (
                <div key={doc.key} className="bg-slate-950 p-5 rounded-xl border border-white/5 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{doc.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{doc.desc}</p>
                  </div>
                  <a
                    href={`/api/admin/download-doc?doc=${doc.key}`}
                    download
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/30 hover:bg-[#06b6d4]/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Markdown (.md)
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERRAL MODAL */}
        {showReferralModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6 text-slate-100">
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#06b6d4]" /> Build Another Website / Refer
              </h3>
              <p className="text-xs text-slate-400 mb-4">Injects the referral lead directly into the Supabase database lead pipeline.</p>

              {refSuccess ? (
                <div className="bg-[#10b981]/15 border border-[#10b981]/30 p-6 rounded-xl text-center flex flex-col items-center gap-3">
                  <CheckCircle2 className="w-10 h-10 text-[#10b981]" />
                  <h4 className="font-bold text-white">Lead Added to Pipeline!</h4>
                  <p className="text-xs text-slate-300">Automated lead generation and outreach can now begin.</p>
                  <button
                    onClick={() => setShowReferralModal(false)}
                    className="mt-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddReferral} className="flex flex-col gap-3">
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
                      <label className="text-xs font-medium text-slate-400 block mb-1">Email</label>
                      <input
                        type="email"
                        value={refEmail}
                        onChange={e => setRefEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#06b6d4]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 block mb-1">Phone</label>
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
                      Inject to Lead Pipeline
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
