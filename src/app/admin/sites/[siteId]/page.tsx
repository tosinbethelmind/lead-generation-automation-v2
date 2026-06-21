'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Eye,
  Save,
  Send,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileText,
  Sliders,
  Palette,
  Terminal,
  Grid,
  MessageSquare,
  Globe,
  Settings
} from 'lucide-react';

interface Service {
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

interface SiteConfig {
  lead: {
    name: string;
    category: string;
    phone_raw?: string;
    email?: string;
    business_summary?: string;
    [key: string]: any;
  };
  theme: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
    font: string;
    headingFont?: string;
    bodyFont?: string;
    heroImage?: string;
    gradient?: string;
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    services: Service[];
    aboutText: string;
    testimonials: Testimonial[];
    ctaText: string;
  };
  visibility?: {
    hero?: boolean;
    services?: boolean;
    about?: boolean;
    testimonials?: boolean;
    booking?: boolean;
    claim?: boolean;
  };
  customInject?: {
    headHtml?: string;
    bodyHtml?: string;
  };
}

type FormTab = 'design' | 'copy' | 'services' | 'testimonials' | 'advanced';

export default function AdminSiteEditor() {
  const params = useParams();
  const router = useRouter();
  const siteId = params?.siteId as string;

  // Authentication state
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [authError, setAuthError] = useState('');

  // Editor states
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [activeFormTab, setActiveFormTab] = useState<FormTab>('design');
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');

  // Operation states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [aiApplying, setAiApplying] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Auto-login on mount
  useEffect(() => {
    const cached = sessionStorage.getItem('admin_password');
    if (cached) {
      verifyAndLoad(cached);
    }
  }, [siteId]);

  const verifyAndLoad = async (pwToVerify: string) => {
    setVerifying(true);
    setAuthError('');
    try {
      const resp = await fetch(`/api/admin/sites/${siteId}/config?siteId=${siteId}`, {
        headers: {
          'x-admin-password': pwToVerify
        }
      });

      if (resp.status === 401) {
        setAuthError('Invalid administrator password.');
        sessionStorage.removeItem('admin_password');
        setVerifying(false);
        return;
      }

      if (!resp.ok) {
        const data = await resp.json();
        throw new Error(data.error || 'Failed to load config');
      }

      const data = await resp.json();
      setConfig(data.config);
      setJsonText(JSON.stringify(data.config, null, 2));
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_password', pwToVerify);
      setPassword(pwToVerify);
    } catch (err: any) {
      setAuthError(`Connection error: ${err.message}`);
    } finally {
      setVerifying(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setAuthError('Password is required.');
      return;
    }
    verifyAndLoad(password);
  };

  // Sync Form State to JSON text when form changes
  const updateConfigState = (newConfig: SiteConfig) => {
    setConfig(newConfig);
    setJsonText(JSON.stringify(newConfig, null, 2));
    setJsonError('');
  };

  // Handle manual JSON change
  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setConfig(parsed);
      setJsonError('');
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  // Save changes locally
  const saveConfig = async (commitToGit: boolean) => {
    if (jsonError) {
      showToast('error', 'Cannot save config with JSON errors.');
      return;
    }
    if (commitToGit) setDeploying(true);
    else setSaving(true);

    try {
      const resp = await fetch(`/api/admin/sites/${siteId}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify({
          config,
          commitToGit
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to save configuration.');
      }

      if (commitToGit) {
        if (data.githubStatus === 'SUCCESS') {
          showToast('success', 'Changes deployed live successfully!');
        } else {
          showToast('success', `Changes saved locally, but Git deploy skipped: ${data.githubStatus}`);
        }
      } else {
        showToast('success', 'Changes saved locally.');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSaving(false);
      setDeploying(false);
    }
  };

  // Run AI Natural Language Updates
  const applyNaturalLanguageUpdate = async () => {
    if (!naturalLanguagePrompt.trim()) return;
    setAiApplying(true);
    try {
      const resp = await fetch('/api/sites/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteId,
          description: naturalLanguagePrompt
        })
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to apply AI changes');
      }

      // Reload config from API
      await verifyAndLoad(password);
      setNaturalLanguagePrompt('');
      showToast('success', `AI applied update: ${JSON.stringify(data.appliedDelta)}`);
    } catch (err: any) {
      showToast('error', `AI Refinement failed: ${err.message}`);
    } finally {
      setAiApplying(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_password');
    setIsAuthenticated(false);
    setConfig(null);
    setPassword('');
  };

  // Authentication Wall UI
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Sleek Background Gradient Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.08),transparent_50%)]" />

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Studio Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-1 text-center">
              Authenticate to edit website config <code className="text-indigo-300 font-mono text-xs">{siteId}</code>
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Administrator Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800/50 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Loaded Config Guard
  if (!config) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Website Override Studio
              <span className="text-xs font-mono font-normal bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">
                {siteId}
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live updates for <strong className="text-slate-300">{config.lead?.name}</strong> ({config.lead?.category})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/sites/${siteId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-sm font-semibold border border-slate-700/50 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span>View Site</span>
          </a>

          <button
            onClick={() => saveConfig(false)}
            disabled={saving || deploying}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-white rounded-xl text-sm font-semibold border border-slate-700 transition-all"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>Save Local</span>
          </button>

          <button
            onClick={() => saveConfig(true)}
            disabled={saving || deploying}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800/50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/15"
          >
            {deploying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            <span>Deploy Live</span>
          </button>

          <div className="h-8 w-px bg-slate-800" />

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-all"
          >
            Lock Studio
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-hidden">
        {/* Left Column: Visual Forms & Prompting */}
        <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-1">
          
          {/* AI Generator Box */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 backdrop-blur-md">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              AI Studio Override (Gemini Parser)
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder='e.g., "Change the primary color to deep emerald and write a punchy new hero title about luxury auto detailing."'
                value={naturalLanguagePrompt}
                onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
              />
              <button
                onClick={applyNaturalLanguageUpdate}
                disabled={aiApplying || !naturalLanguagePrompt.trim()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl text-sm transition-all flex items-center gap-1.5 shrink-0"
              >
                {aiApplying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span>Apply</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Changes will dynamically patch the theme and copy using AI.
            </p>
          </div>

          {/* Form Area */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md flex-1 min-h-[500px]">
            {/* Tabs Selector */}
            <div className="bg-slate-950/50 border-b border-slate-850 flex p-1.5 gap-1 shrink-0">
              <button
                onClick={() => setActiveFormTab('design')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeFormTab === 'design' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="h-3.5 w-3.5" />
                <span>Design & Branding</span>
              </button>
              <button
                onClick={() => setActiveFormTab('copy')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeFormTab === 'copy' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Page Copy</span>
              </button>
              <button
                onClick={() => setActiveFormTab('services')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeFormTab === 'services' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Services</span>
              </button>
              <button
                onClick={() => setActiveFormTab('testimonials')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeFormTab === 'testimonials' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Testimonials</span>
              </button>
              <button
                onClick={() => setActiveFormTab('advanced')}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeFormTab === 'advanced' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Advanced overrides</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              
              {/* Tab: Design & Colors */}
              {activeFormTab === 'design' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Primary Branding Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.theme.primary}
                          onChange={(e) => updateConfigState({
                            ...config,
                            theme: { ...config.theme, primary: e.target.value }
                          })}
                          className="h-9 w-9 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={config.theme.primary}
                          onChange={(e) => updateConfigState({
                            ...config,
                            theme: { ...config.theme, primary: e.target.value }
                          })}
                          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Accent Accent Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.theme.accent}
                          onChange={(e) => updateConfigState({
                            ...config,
                            theme: { ...config.theme, accent: e.target.value }
                          })}
                          className="h-9 w-9 bg-slate-950 border border-slate-800 rounded-lg cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={config.theme.accent}
                          onChange={(e) => updateConfigState({
                            ...config,
                            theme: { ...config.theme, accent: e.target.value }
                          })}
                          className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Header Font Name (Outfit, etc.)</label>
                      <input
                        type="text"
                        value={config.theme.headingFont || ''}
                        placeholder="Outfit"
                        onChange={(e) => updateConfigState({
                          ...config,
                          theme: { ...config.theme, headingFont: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold mb-1.5">Body Font Name (Inter, etc.)</label>
                      <input
                        type="text"
                        value={config.theme.bodyFont || ''}
                        placeholder="Inter"
                        onChange={(e) => updateConfigState({
                          ...config,
                          theme: { ...config.theme, bodyFont: e.target.value }
                        })}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Hero Image URL</label>
                    <input
                      type="text"
                      value={config.theme.heroImage || ''}
                      onChange={(e) => updateConfigState({
                        ...config,
                        theme: { ...config.theme, heroImage: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Hero Gradient Style</label>
                    <input
                      type="text"
                      value={config.theme.gradient || ''}
                      placeholder="linear-gradient(135deg, #1e1b4b 0%, #030712 100%)"
                      onChange={(e) => updateConfigState({
                        ...config,
                        theme: { ...config.theme, gradient: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Page Copy */}
              {activeFormTab === 'copy' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Hero Headline Title</label>
                    <input
                      type="text"
                      value={config.copy.heroTitle}
                      onChange={(e) => updateConfigState({
                        ...config,
                        copy: { ...config.copy, heroTitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={config.copy.heroSubtitle}
                      onChange={(e) => updateConfigState({
                        ...config,
                        copy: { ...config.copy, heroSubtitle: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">About Us Section Copy</label>
                    <textarea
                      rows={4}
                      value={config.copy.aboutText}
                      onChange={(e) => updateConfigState({
                        ...config,
                        copy: { ...config.copy, aboutText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">CTA Button text</label>
                    <input
                      type="text"
                      value={config.copy.ctaText}
                      onChange={(e) => updateConfigState({
                        ...config,
                        copy: { ...config.copy, ctaText: e.target.value }
                      })}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* Tab: Services Grid */}
              {activeFormTab === 'services' && (
                <div className="space-y-6">
                  {config.copy.services.map((srv, idx) => (
                    <div key={idx} className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Service #{idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Service Title</label>
                          <input
                            type="text"
                            value={srv.title}
                            onChange={(e) => {
                              const list = [...config.copy.services];
                              list[idx] = { ...list[idx], title: e.target.value };
                              updateConfigState({ ...config, copy: { ...config.copy, services: list } });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Lucide Icon</label>
                          <input
                            type="text"
                            value={srv.icon}
                            placeholder="Wrench, Car, Sparkles"
                            onChange={(e) => {
                              const list = [...config.copy.services];
                              list[idx] = { ...list[idx], icon: e.target.value };
                              updateConfigState({ ...config, copy: { ...config.copy, services: list } });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={srv.description}
                          onChange={(e) => {
                            const list = [...config.copy.services];
                            list[idx] = { ...list[idx], description: e.target.value };
                            updateConfigState({ ...config, copy: { ...config.copy, services: list } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Testimonials */}
              {activeFormTab === 'testimonials' && (
                <div className="space-y-6">
                  {config.copy.testimonials.map((test, idx) => (
                    <div key={idx} className="bg-slate-950/40 p-4 border border-slate-850 rounded-xl space-y-3">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Testimonial #{idx + 1}</span>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3">
                          <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Client Name</label>
                          <input
                            type="text"
                            value={test.name}
                            onChange={(e) => {
                              const list = [...config.copy.testimonials];
                              list[idx] = { ...list[idx], name: e.target.value };
                              updateConfigState({ ...config, copy: { ...config.copy, testimonials: list } });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Stars (1-5)</label>
                          <select
                            value={test.rating}
                            onChange={(e) => {
                              const list = [...config.copy.testimonials];
                              list[idx] = { ...list[idx], rating: Number(e.target.value) };
                              updateConfigState({ ...config, copy: { ...config.copy, testimonials: list } });
                            }}
                            className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none"
                          >
                            {[1,2,3,4,5].map((n) => (
                              <option key={n} value={n}>{n} Stars</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Client Review Content</label>
                        <textarea
                          rows={2}
                          value={test.text}
                          onChange={(e) => {
                            const list = [...config.copy.testimonials];
                            list[idx] = { ...list[idx], text: e.target.value };
                            updateConfigState({ ...config, copy: { ...config.copy, testimonials: list } });
                          }}
                          className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Advanced Settings */}
              {activeFormTab === 'advanced' && (
                <div className="space-y-4">
                  {/* Section Visibility overrides */}
                  <div>
                    <span className="block text-slate-400 text-xs font-semibold mb-2">Section Visibility Options</span>
                    <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-4 border border-slate-850 rounded-xl">
                      {[
                        { key: 'hero', label: 'Hero Banner' },
                        { key: 'services', label: 'Services Grid' },
                        { key: 'about', label: 'About Us Panel' },
                        { key: 'testimonials', label: 'Client Testimonials' },
                        { key: 'booking', label: 'Booking / Claim Form' },
                        { key: 'claim', label: 'Pre-claimed Verification Section' }
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 cursor-pointer py-1">
                          <input
                            type="checkbox"
                            checked={config.visibility?.[item.key as keyof typeof config.visibility] ?? true}
                            onChange={(e) => {
                              const visibilityObj = { ...(config.visibility || {}) };
                              // @ts-ignore
                              visibilityObj[item.key] = e.target.checked;
                              updateConfigState({
                                ...config,
                                visibility: visibilityObj
                              });
                            }}
                            className="h-4 w-4 bg-slate-950 rounded border-slate-800 accent-indigo-500 focus:ring-0 focus:ring-offset-0 focus:outline-none"
                          />
                          <span className="text-sm text-slate-300">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* HTML Script Injections */}
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Custom head-tag HTML Script Injection</label>
                    <textarea
                      rows={3}
                      placeholder="<!-- Inject SEO meta, pixel trackers, or font preloads here -->"
                      value={config.customInject?.headHtml || ''}
                      onChange={(e) => updateConfigState({
                        ...config,
                        customInject: { ...(config.customInject || {}), headHtml: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-xs font-semibold mb-1.5">Custom body-tag HTML Script Injection</label>
                    <textarea
                      rows={3}
                      placeholder="<!-- Inject support widget tools, live chat embeds, etc. -->"
                      value={config.customInject?.bodyHtml || ''}
                      onChange={(e) => updateConfigState({
                        ...config,
                        customInject: { ...(config.customInject || {}), bodyHtml: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Preview State */}
        <div className="lg:col-span-5 flex flex-col gap-6 overflow-hidden">
          {/* JSON Textarea panel */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl flex-1 flex flex-col overflow-hidden backdrop-blur-md">
            <div className="bg-slate-950/50 border-b border-slate-850 px-4 py-3 flex items-center justify-between shrink-0">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                Raw Settings JSON Override
              </span>
              {jsonError ? (
                <span className="text-[10px] font-semibold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  Invalid JSON Structure
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                  Syntax Validated
                </span>
              )}
            </div>

            <div className="flex-1 p-4 bg-slate-950/60 overflow-hidden flex">
              <textarea
                value={jsonText}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-xs text-slate-300 leading-relaxed overflow-y-auto"
                style={{ tabSize: 2 }}
              />
            </div>
            {jsonError && (
              <div className="p-3 bg-rose-500/10 border-t border-rose-500/20 text-xs text-rose-400 font-mono select-none">
                {jsonError}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Notifications Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
