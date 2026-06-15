'use client';

import React, { useEffect, useState } from 'react';
import { Download, Globe, Database, Mail, FileSpreadsheet, ArrowRight, ShieldCheck, CheckCircle2, Copy, ExternalLink, RefreshCw } from 'lucide-react';

interface HandoverProps {
  params: {
    lead_id: string;
  };
}

export default function ClientHandover({ params }: HandoverProps) {
  const leadId = params.lead_id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hosting' | 'form' | 'file'>('hosting');
  const [formPreference, setFormPreference] = useState<'central' | 'web3forms' | 'sheets' | 'supabase'>('central');
  const [submissionKey, setSubmissionKey] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/preview/generate?leadId=${leadId}`);
        if (!res.ok) {
          throw new Error('Failed to load lead details.');
        }
        const json = await res.json();
        setData(json);
        
        // Parse scaling tags from notes
        if (json.lead && json.lead.notes) {
          const notes = json.lead.notes;
          const typeMatch = notes.match(/\[SUBMISSION_TYPE:\s*(central|web3forms|sheets|supabase)\]/i);
          const keyMatch = notes.match(/\[SUBMISSION_KEY:\s*([^\]]+)\]/i);
          if (typeMatch) setFormPreference(typeMatch[1].toLowerCase() as any);
          if (keyMatch) setSubmissionKey(keyMatch[1].trim());
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [leadId]);

  const handleSaveFormConfig = async () => {
    setSavingConfig(true);
    try {
      // Fetch current notes, strip previous tags, append new ones
      const currentNotes = data?.lead?.notes || '';
      let cleanNotes = currentNotes
        .replace(/\[SUBMISSION_TYPE:\s*[^\]]+\]/gi, '')
        .replace(/\[SUBMISSION_KEY:\s*[^\]]+\]/gi, '')
        .trim();

      const newTags = ` [SUBMISSION_TYPE: ${formPreference}]` + (submissionKey ? ` [SUBMISSION_KEY: ${submissionKey}]` : '');
      const updatedNotes = (cleanNotes + newTags).trim();

      const patchRes = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: leadId,
          notes: updatedNotes
        })
      });

      if (!patchRes.ok) {
        throw new Error('Failed to save settings.');
      }

      // Update local state
      setData((prev: any) => ({
        ...prev,
        lead: {
          ...prev.lead,
          notes: updatedNotes
        }
      }));

      triggerToast('settings', 'Form settings updated successfully!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  const triggerToast = (id: string, text: string) => {
    setCopied(id);
    setTimeout(() => setCopied(null), 3000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(id, 'Copied to clipboard!');
  };

  const googleSheetsCode = `// 1. Open your Google Sheet
// 2. Click Extensions > Apps Script
// 3. Delete any default code and paste this script:

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Message"]);
    }
    
    sheet.appendRow([
      new Date(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.message || ""
    ]);
    
    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch(error) {
    return ContentService.createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// 4. Click 'Deploy' > 'New Deployment'
// 5. Select 'Web App' type
// 6. Set Execute As: "Me"
// 7. Set Who Has Access: "Anyone"
// 8. Copy the Web App URL and paste it into the Webhook Key field above!`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-white flex-col gap-4">
        <RefreshCw className="w-8 h-8 text-[#06b6d4] animate-spin" />
        <p className="text-sm font-semibold tracking-wider text-slate-400">LOADING HANDOVER PORTAL...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center text-red-400 p-6">
        <div className="max-w-md w-full bg-slate-900/40 p-6 rounded-2xl border border-red-500/20 text-center">
          <h2 className="text-xl font-bold mb-2">Error Loading Portal</h2>
          <p className="text-sm text-slate-400 mb-4">{error || 'Lead not found.'}</p>
        </div>
      </div>
    );
  }

  const lead = data.lead;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans relative overflow-x-hidden pb-12">
      {/* Glow background bubbles */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#06b6d4]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#8b5cf6]/5 blur-3xl pointer-events-none"></div>

      <header className="border-b border-white/5 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-lg font-title">
              A
            </div>
            <div>
              <span className="font-title text-lg font-bold text-white block">Handover Portal</span>
              <span className="text-xs text-slate-400 font-medium">{lead.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Claim Ready
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-12 grid md:grid-cols-12 gap-8">
        
        {/* Left Side: Summary & Actions */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900/60 border border-white/5 p-6 rounded-2xl flex flex-col gap-4">
            <span className="text-xs font-bold text-[#06b6d4] uppercase tracking-wider">Site Ownership Profile</span>
            <h1 className="text-2xl font-title font-extrabold text-white leading-tight">{lead.name}</h1>
            <p className="text-sm text-slate-400">{lead.category} • {lead.area}, {lead.city}</p>
            
            <div className="h-px bg-white/5 my-2"></div>
            
            <a 
              href={`/api/preview/export?leadId=${leadId}`}
              className="w-full bg-[#06b6d4] hover:opacity-95 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#06b6d4]/15"
            >
              <Download className="w-5 h-5" /> Download Site Code (HTML)
            </a>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-xl overflow-hidden">
            <button 
              onClick={() => setActiveTab('hosting')}
              className={`w-full text-left px-5 py-4 border-l-2 text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'hosting' ? 'border-[#06b6d4] bg-slate-800/40 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Globe className="w-4 h-4" /> 1-Click Hosting Assist
            </button>
            <button 
              onClick={() => setActiveTab('form')}
              className={`w-full text-left px-5 py-4 border-l-2 text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'form' ? 'border-[#06b6d4] bg-slate-800/40 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <Database className="w-4 h-4" /> Form Submission Settings
            </button>
            <button 
              onClick={() => setActiveTab('file')}
              className={`w-full text-left px-5 py-4 border-l-2 text-sm font-semibold transition-all flex items-center gap-3 ${activeTab === 'file' ? 'border-[#06b6d4] bg-slate-800/40 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
            >
              <FileSpreadsheet className="w-4 h-4" /> Google Sheet Script
            </button>
          </div>
        </div>

        {/* Right Side: Tab Contents */}
        <div className="md:col-span-8 bg-slate-900/60 border border-white/5 p-8 rounded-2xl">
          
          {/* HOSTING TAB */}
          {activeTab === 'hosting' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-title font-bold text-white mb-2">Simplified Hosting Options</h2>
                <p className="text-sm text-slate-400">Launch the client's website for free on Netlify or Vercel. Choose the method below:</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                
                {/* Netlify Drop */}
                <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5 flex flex-col justify-between gap-6 group hover:border-[#06b6d4]/20 transition-all">
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-title">Option A: Netlify Drop</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Drag-and-drop the downloaded index.html file to deploy the site instantly. Zero setup, no billing, completely free.</p>
                  </div>
                  <a 
                    href="https://app.netlify.com/drop" 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-2 text-xs font-bold text-[#06b6d4] flex items-center gap-1 group-hover:underline"
                  >
                    Open Netlify Drop <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Vercel Clone */}
                <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5 flex flex-col justify-between gap-6 group hover:border-[#8b5cf6]/20 transition-all">
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-title">Option B: Vercel Deploy</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Connect to Vercel for continuous deployment. Click Vercel's clone button to host their static project repository in one step.</p>
                  </div>
                  <a 
                    href={`https://vercel.com/new/clone?repository-url=https://github.com/tosinbethelmind/lead-generation-automation`}
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-2 text-xs font-bold text-[#8b5cf6] flex items-center gap-1 group-hover:underline"
                  >
                    Deploy to Vercel <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>

              <div className="bg-[#10b981]/5 p-5 rounded-xl border border-[#10b981]/15 flex gap-4 items-start mt-4">
                <div className="w-8 h-8 rounded-full bg-[#10b981]/15 text-[#10b981] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Database-Free Deployment</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">This site does not need a local database or a Supabase account for the client. All customer booking submissions are routed dynamically via Webhook / Email, ensuring their hosting setup remains completely free.</p>
                </div>
              </div>
            </div>
          )}

          {/* FORM TAB */}
          {activeTab === 'form' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-title font-bold text-white mb-2">Form Submission Preference</h2>
                <p className="text-sm text-slate-400">Choose where customers' form bookings are sent when they fill out the form on the landing page.</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Central CRM */}
                <button 
                  onClick={() => setFormPreference('central')}
                  className={`p-5 rounded-xl border text-left flex gap-4 items-start transition-all ${formPreference === 'central' ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-white/5 bg-slate-950/20 hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Central CRM</h3>
                    <p className="text-xs text-slate-400 mt-1">Submit bookings to your platform's main dashboard inbox.</p>
                  </div>
                </button>

                {/* Web3Forms */}
                <button 
                  onClick={() => setFormPreference('web3forms')}
                  className={`p-5 rounded-xl border text-left flex gap-4 items-start transition-all ${formPreference === 'web3forms' ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-white/5 bg-slate-950/20 hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Email (Web3Forms)</h3>
                    <p className="text-xs text-slate-400 mt-1">Deliver bookings directly to the client's inbox for free.</p>
                  </div>
                </button>

                {/* Google Sheets */}
                <button 
                  onClick={() => setFormPreference('sheets')}
                  className={`p-5 rounded-xl border text-left flex gap-4 items-start transition-all ${formPreference === 'sheets' ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-white/5 bg-slate-950/20 hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Direct Google Sheet</h3>
                    <p className="text-xs text-slate-400 mt-1">Post data directly to client's personal Google Sheet Webhook.</p>
                  </div>
                </button>

                {/* Supabase */}
                <button 
                  onClick={() => setFormPreference('supabase')}
                  className={`p-5 rounded-xl border text-left flex gap-4 items-start transition-all ${formPreference === 'supabase' ? 'border-[#06b6d4] bg-[#06b6d4]/5' : 'border-white/5 bg-slate-950/20 hover:border-white/10'}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Supabase Client-Direct</h3>
                    <p className="text-xs text-slate-400 mt-1">Insert bookings straight to their custom SQL database.</p>
                  </div>
                </button>

              </div>

              {formPreference !== 'central' && (
                <div className="bg-slate-950/50 p-6 rounded-xl border border-white/5 mt-4">
                  <label className="block text-xs font-bold text-[#06b6d4] uppercase tracking-wider mb-2">
                    {formPreference === 'web3forms' && 'Web3Forms Access Key'}
                    {formPreference === 'sheets' && 'Google Sheets Script URL'}
                    {formPreference === 'supabase' && 'Supabase Key (format: PROJECT_URL::ANON_KEY)'}
                  </label>
                  <input 
                    type="text" 
                    value={submissionKey}
                    onChange={(e) => setSubmissionKey(e.target.value)}
                    placeholder={
                      formPreference === 'web3forms' ? 'e.g. a1b2c3d4-e5f6-7a8b...' :
                      formPreference === 'sheets' ? 'https://script.google.com/macros/s/...' :
                      'https://xyz.supabase.co::eyJhbGciOi...'
                    }
                    className="w-full bg-[#07090e] border border-white/10 px-4 py-3 rounded-lg outline-none text-sm text-slate-200 focus:border-[#06b6d4]"
                  />
                  {formPreference === 'web3forms' && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      Get a free key in 5 seconds by typing the client email at <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="underline text-[#06b6d4] hover:text-[#22d3ee]">web3forms.com</a>.
                    </p>
                  )}
                </div>
              )}

              <button 
                onClick={handleSaveFormConfig}
                disabled={savingConfig}
                className="w-full bg-[#06b6d4] hover:opacity-95 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-4"
              >
                {savingConfig ? 'Saving Settings...' : 'Save Form Routing Preference'}
              </button>

              {copied === 'settings' && (
                <p className="text-xs text-green-400 text-center font-semibold">✓ Routing preference saved! Download the updated file in the left panel.</p>
              )}
            </div>
          )}

          {/* SCRIPT TAB */}
          {activeTab === 'file' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-title font-bold text-white mb-2">Google Sheets Script Setup</h2>
                <p className="text-sm text-slate-400">Copy this lightweight Google Apps Script to link the client's booking forms directly to their Google Sheet.</p>
              </div>

              <div className="relative">
                <pre className="bg-slate-950/80 p-5 rounded-xl border border-white/5 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[300px] leading-relaxed">
                  {googleSheetsCode}
                </pre>
                <button 
                  onClick={() => handleCopy('script', googleSheetsCode)}
                  className="absolute top-4 right-4 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 p-2 rounded-lg transition-all"
                >
                  {copied === 'script' ? 'Copied!' : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
