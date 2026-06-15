'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Compass, 
  Settings, 
  FileText, 
  Search, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  Info,
  MapPin,
  ExternalLink,
  Database,
  ArrowRight,
  ShieldCheck,
  Flame,
  UserCheck,
  LogOut,
  Mail,
  Eye,
  Palette,
  Sliders,
  Terminal,
  Share2,
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RuntimeConfig } from '@/lib/localConfig';
import { Lead } from '@/lib/googleSheets';

type Tab = 'dashboard' | 'crm' | 'scrapers' | 'settings' | 'logs';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [config, setConfig] = useState<RuntimeConfig>({
    googleSpreadsheetId: '',
    googlePlacesApiKey: '',
    googleClientId: '',
    googleClientSecret: '',
    googleProjectId: '',
    googleAccessToken: '',
    googleRefreshToken: '',
    googleTokenExpiry: 0,
    googleUserEmail: '',
    dryRun: true,
    businessSignature: 'ApexReach',
    outreachChannel: 'gmail',
    apifyToken: '',
    apifyDatasetId: '',
    whatsappPhoneNumberId: '',
    whatsappAccessToken: '',
    whatsappTemplateName: 'lead_outreach_1',
    whatsappTemplateLanguageCode: 'en_US',
    whatsappDailyCap: 50,
    whatsappEnabled: false,
    supabaseUrl: '',
    supabaseKey: '',
    geminiApiKey: '',
    storageMode: 'hybrid',
    emailProvider: 'gmail',
    resendApiKey: '',
    resendFromEmail: '',
    brevoApiKey: '',
    brevoSenderName: 'ApexReach',
    brevoSenderEmail: '',
    whatsappProvider: 'cloud',
    evolutionApiUrl: '',
    evolutionApiKey: '',
    evolutionInstanceName: '',
    whapiToken: '',
    whatsappMessageTemplate: '',
    jijiEmail: '',
    jijiPassword: '',
    jijiMessageTemplate: '',
    instagramMessageTemplate: '',
    facebookMessageTemplate: '',
    tiktokMessageTemplate: '',
    linkedinMessageTemplate: '',
    smsProvider: 'gateway',
    smsMessageTemplate: '',
    smsGatewayUrl: '',
    termiiApiKey: '',
    termiiSenderId: '',
    africastalkingUsername: '',
    africastalkingApiKey: '',
    africastalkingSenderId: ''
  });
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    dncLeads: 0,
    errorLeads: 0,
    googleLeads: 0,
    jijiLeads: 0,
    mapsFreeLeads: 0,
    duckduckgoLeads: 0,
    osmLeads: 0,
    instagramLeads: 0,
    facebookLeads: 0,
    tiktokLeads: 0,
    linkedinLeads: 0,
    highRatingLeads: 0,
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  
  // Scraper Forms
  const [selectedScraper, setSelectedScraper] = useState<'google' | 'jiji' | 'osm' | 'apify' | 'maps-free' | 'duckduckgo' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin'>('google');
  const [gMapsQuery, setGMapsQuery] = useState('Car Dealers Lagos');
  const [gMapsLimit, setGMapsLimit] = useState(10);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Loading states
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [sendingOutreach, setSendingOutreach] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Selected Lead for Outreach preview
  const [previewLead, setPreviewLead] = useState<Lead | null>(null);

  // Dynamic state query param login helper
  const [customLoginProjectId, setCustomLoginProjectId] = useState('');

  // Custom Outreach Message overrides
  const [useCustomMessage, setUseCustomMessage] = useState(false);
  const [customMessageText, setCustomMessageText] = useState('');
  const [customSubjectText, setCustomSubjectText] = useState('');

  // Video Demo states
  const [videoPlaying, setVideoPlaying] = useState(false);

  // CRM preview sidebar tabs
  const [crmPreviewTab, setCrmPreviewTab] = useState<'outreach' | 'customizer' | 'tasks' | 'handover'>('outreach');

  // Customizer visual overrides states
  const [overridePrimary, setOverridePrimary] = useState('');
  const [overrideAccent, setOverrideAccent] = useState('');
  const [overrideBg, setOverrideBg] = useState('');
  const [overrideText, setOverrideText] = useState('');
  const [overrideFont, setOverrideFont] = useState('');
  const [overrideHeroTitle, setOverrideHeroTitle] = useState('');
  const [overrideHeroSubtitle, setOverrideHeroSubtitle] = useState('');
  const [overrideCtaText, setOverrideCtaText] = useState('');
  const [overrideAboutText, setOverrideAboutText] = useState('');
  const [overrideShowServices, setOverrideShowServices] = useState(true);
  const [overrideShowTestimonials, setOverrideShowTestimonials] = useState(true);
  const [overrideShowEstimator, setOverrideShowEstimator] = useState(true);
  const [overrideShowAbout, setOverrideShowAbout] = useState(true);
  
  // AI Redesign states
  const [aiRedesignPrompt, setAiRedesignPrompt] = useState('');
  const [aiRedesignLoading, setAiRedesignLoading] = useState(false);

  // Antigravity tasks states
  const [taskQueuePrompt, setTaskQueuePrompt] = useState('');
  const [taskQueuePriority, setTaskQueuePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskQueueLoading, setTaskQueueLoading] = useState(false);

  // Turnout state
  const [turnoutMode, setTurnoutMode] = useState<'dynamic' | 'n8n' | 'git'>('dynamic');

  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchLeads();
    fetchLogs();
  }, []);

  // Fetch overrides and turnout settings on Lead select
  useEffect(() => {
    if (!previewLead) return;

    // Reset customization inputs first to prevent bleed from previous lead
    setOverridePrimary('');
    setOverrideAccent('');
    setOverrideBg('');
    setOverrideText('');
    setOverrideFont('');
    setOverrideHeroTitle('');
    setOverrideHeroSubtitle('');
    setOverrideCtaText('');
    setOverrideAboutText('');
    setOverrideShowServices(true);
    setOverrideShowTestimonials(true);
    setOverrideShowEstimator(true);
    setOverrideShowAbout(true);
    
    // Parse turnout mode from lead's notes using scalingHelper syntax
    let mode: 'dynamic' | 'n8n' | 'git' = 'dynamic';
    if (previewLead.notes) {
      if (previewLead.notes.includes('[scaling: n8n]')) {
        mode = 'n8n';
      } else if (previewLead.notes.includes('[scaling: git]')) {
        mode = 'git';
      }
    }
    setTurnoutMode(mode);

    // Fetch existing overrides
    fetch(`/api/preview/override?leadId=${encodeURIComponent(previewLead.lead_id)}`)
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          if (data.theme) {
            setOverridePrimary(data.theme.primary || '');
            setOverrideAccent(data.theme.accent || '');
            setOverrideBg(data.theme.bg || '');
            setOverrideText(data.theme.text || '');
            setOverrideFont(data.theme.font || '');
          }
          if (data.copy) {
            setOverrideHeroTitle(data.copy.heroTitle || '');
            setOverrideHeroSubtitle(data.copy.heroSubtitle || '');
            setOverrideCtaText(data.copy.ctaText || '');
            setOverrideAboutText(data.copy.aboutText || '');
          }
          if (data.visibility) {
            setOverrideShowServices(data.visibility.showServices !== false);
            setOverrideShowTestimonials(data.visibility.showTestimonials !== false);
            setOverrideShowEstimator(data.visibility.showEstimator !== false);
            setOverrideShowAbout(data.visibility.showAbout !== false);
          }
        }
      })
      .catch(err => console.error('Error fetching overrides:', err));
  }, [previewLead]);

  const saveOverrides = async () => {
    if (!previewLead) return;
    try {
      setStatusMessage('Saving custom website overrides...');
      const response = await fetch('/api/preview/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          overrides: {
            theme: {
              primary: overridePrimary,
              accent: overrideAccent,
              bg: overrideBg,
              text: overrideText,
              font: overrideFont,
            },
            copy: {
              heroTitle: overrideHeroTitle,
              heroSubtitle: overrideHeroSubtitle,
              ctaText: overrideCtaText,
              aboutText: overrideAboutText,
            },
            visibility: {
              showServices: overrideShowServices,
              showTestimonials: overrideShowTestimonials,
              showEstimator: overrideShowEstimator,
              showAbout: overrideShowAbout,
            }
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('Website overrides saved successfully!');
        confetti({ particleCount: 30, spread: 50 });
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to save'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const handleAiRedesign = async () => {
    if (!previewLead || !aiRedesignPrompt) return;
    try {
      setAiRedesignLoading(true);
      setStatusMessage('Calling Gemini Vertex AI to compile redesign...');
      const response = await fetch('/api/preview/ai-redesign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          prompt: aiRedesignPrompt
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('AI redesign completed! Reloading overrides...');
        setAiRedesignPrompt('');
        
        // Reload overrides
        const res = await fetch(`/api/preview/override?leadId=${encodeURIComponent(previewLead.lead_id)}`);
        const ov = await res.json();
        if (ov && !ov.error) {
          if (ov.theme) {
            setOverridePrimary(ov.theme.primary || '');
            setOverrideAccent(ov.theme.accent || '');
            setOverrideBg(ov.theme.bg || '');
            setOverrideText(ov.theme.text || '');
            setOverrideFont(ov.theme.font || '');
          }
          if (ov.copy) {
            setOverrideHeroTitle(ov.copy.heroTitle || '');
            setOverrideHeroSubtitle(ov.copy.heroSubtitle || '');
            setOverrideCtaText(ov.copy.ctaText || '');
            setOverrideAboutText(ov.copy.aboutText || '');
          }
          if (ov.visibility) {
            setOverrideShowServices(ov.visibility.showServices !== false);
            setOverrideShowTestimonials(ov.visibility.showTestimonials !== false);
            setOverrideShowEstimator(ov.visibility.showEstimator !== false);
            setOverrideShowAbout(ov.visibility.showAbout !== false);
          }
        }
        confetti({ particleCount: 40, spread: 60 });
      } else {
        setStatusMessage(`AI Error: ${data.error || 'Failed to execute redesign'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setAiRedesignLoading(false);
    }
  };

  const queueTask = async () => {
    if (!previewLead || !taskQueuePrompt) return;
    try {
      setTaskQueueLoading(true);
      setStatusMessage('Logging autonomous coding task to Antigravity queue...');
      const response = await fetch('/api/preview/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: previewLead.lead_id,
          task: taskQueuePrompt,
          priority: taskQueuePriority
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage('Task successfully queued for Antigravity autonomous developer!');
        setTaskQueuePrompt('');
        confetti({ particleCount: 30, spread: 40 });
      } else {
        setStatusMessage(`Error: ${data.error || 'Failed to queue task'}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setTaskQueueLoading(false);
    }
  };

  const updateTurnoutMode = async (mode: 'dynamic' | 'n8n' | 'git') => {
    if (!previewLead) return;
    try {
      setStatusMessage('Updating turnout mode configuration...');
      setTurnoutMode(mode);
      
      let newNotes = previewLead.notes || '';
      const scalingRegex = /\[scaling:\s*[^\]]+\]/;
      if (scalingRegex.test(newNotes)) {
        newNotes = newNotes.replace(scalingRegex, `[scaling: ${mode}]`);
      } else {
        newNotes = newNotes ? `${newNotes} [scaling: ${mode}]` : `[scaling: ${mode}]`;
      }

      const response = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: previewLead.lead_id,
          notes: newNotes
        })
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage(`Turnout mode updated to ${mode.toUpperCase()}!`);
        setPreviewLead({
          ...previewLead,
          notes: newNotes
        });
        fetchLeads();
      } else {
        setStatusMessage('Failed to update turnout mode.');
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const resp = await fetch('/api/config');
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        if (data.googleProjectId) {
          setCustomLoginProjectId(data.googleProjectId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConfig(false);
    }
  };

  const saveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setStatusMessage('Saving configurations...');
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        setStatusMessage('Settings updated successfully!');
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      } else {
        setStatusMessage(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    }
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const resp = await fetch('/api/leads?stats=true');
      const data = await resp.json();
      if (data && !data.error) {
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoadingLeads(true);
      const resp = await fetch('/api/leads');
      const data = await resp.json();
      if (Array.isArray(data)) {
        // Enforce lead order / display
        setLeads(data);
        if (data.length > 0) setPreviewLead(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLeads(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const resp = await fetch('/api/logs');
      const data = await resp.json();
      if (Array.isArray(data)) {
        setLogs(data.reverse()); // show newest first
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRefreshAll = () => {
    fetchStats();
    fetchLeads();
    fetchLogs();
  };

  // Run selected Lead Scraper
  const runScraper = async () => {
    try {
      setScraping(true);
      let endpoint = '/api/scrape/maps';
      let payload: any = { query: gMapsQuery, limit: gMapsLimit };
      let scraperName = 'Google Places API';

      if (selectedScraper === 'jiji') {
        endpoint = '/api/scrape/jiji';
        const searchSlug = gMapsQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        payload = { 
          url: gMapsQuery.startsWith('http') ? gMapsQuery : `https://jiji.ng/lagos/${searchSlug}`, 
          limit: gMapsLimit 
        };
        scraperName = 'Jiji.ng Crawler';
      } else if (selectedScraper === 'osm') {
        endpoint = '/api/scrape/osm';
        payload = { query: gMapsQuery, limit: gMapsLimit };
        scraperName = 'OpenStreetMap (OSM)';
      } else if (selectedScraper === 'apify') {
        endpoint = '/api/apify';
        payload = { query: gMapsQuery, limit: gMapsLimit };
        scraperName = 'Apify Google Maps';
      } else if (selectedScraper === 'maps-free') {
        endpoint = '/api/scrape/maps-free';
        payload = { query: gMapsQuery, limit: gMapsLimit };
        scraperName = 'Google Maps Free';
      } else if (selectedScraper === 'duckduckgo') {
        endpoint = '/api/scrape/duckduckgo';
        payload = { query: gMapsQuery, limit: gMapsLimit };
        scraperName = 'DuckDuckGo Scraper';
      } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(selectedScraper)) {
        endpoint = '/api/scrape/social';
        payload = { platform: selectedScraper, query: gMapsQuery, limit: gMapsLimit };
        scraperName = selectedScraper.charAt(0).toUpperCase() + selectedScraper.slice(1) + ' Scraper';
      }

      setStatusMessage(`Executing ${scraperName} scrape for "${payload.query || payload.url}"...`);
      
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage(`${scraperName} completed! Added ${data.added} new leads, skipped ${data.skipped} duplicates.`);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        handleRefreshAll();
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setScraping(false);
    }
  };

  // Run Dynamic Outreach Campaign
  const runOutreach = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead from the CRM table.");
      return;
    }
    
    const channel = config.outreachChannel || 'gmail';
    const emailProvider = config.emailProvider || 'gmail';
    
    let endpoint = '/api/outreach';
    let channelName = 'Email';
    
    if (channel === 'whatsapp') {
      endpoint = '/api/whatsapp';
      channelName = 'WhatsApp';
    } else if (channel === 'sms') {
      endpoint = '/api/sms';
      channelName = 'SMS';
    } else if (channel === 'coldcall') {
      endpoint = '/api/calls';
      channelName = 'Twilio Cold Call';
    } else if (channel === 'jiji') {
      endpoint = '/api/jiji';
      channelName = 'Jiji Auto-Message';
    } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(channel)) {
      endpoint = '/api/social-outreach';
      channelName = channel.charAt(0).toUpperCase() + channel.slice(1) + ' Auto-Message';
    } else {
      channelName = `Email (${emailProvider.toUpperCase()})`;
    }
    
    try {
      setSendingOutreach(true);
      setStatusMessage(`Launching personalized ${channelName} outreach to ${selectedLeads.size} leads...`);
      
      const payload: any = {
        leadIds: Array.from(selectedLeads)
      };

      if (useCustomMessage) {
        payload.customMessage = customMessageText;
        if (channel === 'gmail' || channelName.toLowerCase().includes('email')) {
          payload.customSubject = customSubjectText;
        }
      }

      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`${channelName} Outreach failed: ${data.error}`);
      } else {
        const sentCount = data.results ? data.results.filter((r: any) => r.status === 'SUCCESS' || r.status === 'CONTACTED').length : 0;
        setStatusMessage(`${channelName} outreach campaign completed! Successful dispatches: ${sentCount}`);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        setSelectedLeads(new Set());
        handleRefreshAll();
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setSendingOutreach(false);
    }
  };

  const getOutreachDetails = () => {
    const channel = config.outreachChannel || 'gmail';
    const emailProvider = config.emailProvider || 'gmail';
    
    let label = 'Send Email Outreach';
    let isDisabled = false;
    let icon = <Mail size={14} />;
    
    if (channel === 'whatsapp') {
      const whatsappProvider = config.whatsappProvider || 'cloud';
      label = `Send WhatsApp Outreach (${whatsappProvider.toUpperCase()})`;
      icon = <Send size={14} />;
      
      if (whatsappProvider === 'cloud') {
        isDisabled = !config.whatsappAccessToken || !config.whatsappPhoneNumberId;
      } else if (whatsappProvider === 'evolution') {
        isDisabled = !config.evolutionApiUrl || !config.evolutionApiKey || !config.evolutionInstanceName;
      } else if (whatsappProvider === 'whapi') {
        isDisabled = !config.whapiToken;
      }
    } else if (channel === 'sms') {
      const smsProvider = config.smsProvider || 'gateway';
      label = `Send SMS Outreach (${smsProvider.toUpperCase()})`;
      icon = <Send size={14} />;
      
      if (smsProvider === 'gateway') {
        isDisabled = !config.smsGatewayUrl;
      } else if (smsProvider === 'termii') {
        isDisabled = !config.termiiApiKey;
      } else if (smsProvider === 'africastalking') {
        isDisabled = !config.africastalkingUsername || !config.africastalkingApiKey;
      } else if (smsProvider === 'twilio') {
        isDisabled = !config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber;
      }
    } else if (channel === 'coldcall') {
      label = 'Trigger Twilio Calls';
      icon = <Send size={14} />;
      isDisabled = !config.twilioAccountSid || !config.twilioAuthToken || !config.twilioFromNumber;
    } else if (channel === 'jiji') {
      label = 'Send Jiji Inbox Messages';
      icon = <Send size={14} />;
      isDisabled = false;
    } else if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(channel)) {
      label = `Send ${channel.charAt(0).toUpperCase() + channel.slice(1)} Message`;
      icon = <Send size={14} />;
      isDisabled = false;
    } else {
      if (emailProvider === 'gmail') {
        label = 'Send Gmail Outreach';
        isDisabled = !config.googleUserEmail;
      } else if (emailProvider === 'resend') {
        label = 'Send Resend Outreach';
        isDisabled = !config.resendApiKey;
      } else if (emailProvider === 'brevo') {
        label = 'Send Brevo Outreach';
        isDisabled = !config.brevoApiKey || !config.brevoSenderEmail;
      }
    }
    
    return { label, isDisabled: isDisabled || sendingOutreach, icon };
  };
  
  const outreachDetails = getOutreachDetails();

  const handleGoogleSignIn = () => {
    if (!config.googleClientId) {
      alert("Please configure your Google Client ID in the Settings tab first.");
      setActiveTab('settings');
      return;
    }
    // Save project ID beforehand so it persists
    if (customLoginProjectId) {
      config.googleProjectId = customLoginProjectId;
    }
    // Direct OAuth flow initiation carrying the Project ID as state
    const authUrl = `/api/auth/google?state=${encodeURIComponent(customLoginProjectId || config.googleProjectId || '')}`;
    window.location.href = authUrl;
  };

  const handleSignOut = async () => {
    try {
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          googleAccessToken: '',
          googleRefreshToken: '',
          googleTokenExpiry: 0,
          googleUserEmail: ''
        })
      });
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        setStatusMessage('Signed out successfully.');
      }
    } catch (e: any) {
      setStatusMessage(`Sign out failed: ${e.message}`);
    }
  };

  // Selection helpers
  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedLeads(next);
  };

  const toggleSelectAll = (filtered: Lead[]) => {
    if (selectedLeads.size === filtered.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filtered.map(l => l.lead_id)));
    }
  };

  // Lead filter
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.phone_e164.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderTemplatePreview = (lead: Lead | null) => {
    if (!lead) return 'Select a lead to see custom outreach message variables';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apexreach.net';
    
    if (config.outreachChannel === 'sms') {
      const smsTemplate = config.smsMessageTemplate || 
        "Hello {{lead.name}}, please review the custom landing page designed for your business: {{previewUrl}} - {{signature}}";
      let msg = smsTemplate;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'ApexReach');
      return msg;
    }

    if (config.outreachChannel === 'jiji') {
      const jijiTemplate = config.jijiMessageTemplate || 
        "Hello {{lead.name}},\n\nI noticed your listing on Jiji with an impressive {{lead.rating}}★ rating! Since you don't currently have a website, I built a personalized landing page preview for you to check out: {{previewUrl}}\n\nLet me know if you would like to go live with this!\n\nBest regards,\n{{signature}}";
      let msg = jijiTemplate;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'ApexReach');
      return msg;
    }

    if (['instagram', 'facebook', 'tiktok', 'linkedin'].includes(config.outreachChannel || '')) {
      const channel = config.outreachChannel || 'instagram';
      let template = '';
      if (channel === 'instagram') {
        template = config.instagramMessageTemplate || "Hi {{lead.name}},\n\nI found your amazing e-commerce profile on Instagram! Since you don't have a standalone website for checkout, I built a personalized landing page preview for you: {{previewUrl}}\n\nLet me know if you would like to launch this!\n\nBest regards,\n{{signature}}";
      } else if (channel === 'facebook') {
        template = config.facebookMessageTemplate || "Hello {{lead.name}},\n\nI saw your store page on Facebook. I put together a custom checkout website preview to help you capture more sales: {{previewUrl}}\n\nCheck it out and let me know your thoughts!\n\nBest,\n{{signature}}";
      } else if (channel === 'tiktok') {
        template = config.tiktokMessageTemplate || "Hey {{lead.name}},\n\nI saw your product videos on TikTok. I created a custom web store preview for your business link-in-bio: {{previewUrl}}\n\nClick the link above to check it out!\n\nCheers,\n{{signature}}";
      } else if (channel === 'linkedin') {
        template = config.linkedinMessageTemplate || "Hi {{lead.name}},\n\nI noticed your professional services profile on LinkedIn. Since you don't have a personal portfolio website listed, I custom-built a landing page preview showcasing your expertise: {{previewUrl}}\n\nWould you like to connect this to your custom domain?\n\nBest regards,\n{{signature}}";
      }
      let msg = template;
      msg = msg.replace(/\{\{lead\.name\}\}/g, lead.name || 'Vendor');
      msg = msg.replace(/\{\{lead\.rating\}\}/g, String(lead.rating || '4.0'));
      msg = msg.replace(/\{\{lead\.reviews_count\}\}/g, String(lead.reviews_count || '0'));
      msg = msg.replace(/\{\{previewUrl\}\}/g, `${origin}/preview/${lead.lead_id}`);
      msg = msg.replace(/\{\{signature\}\}/g, config.businessSignature || 'ApexReach');
      return msg;
    }

    return `Subject: Custom Web Design Proposal for ${lead.name}
    
Hi Team,

We saw you have an outstanding rating of ${lead.rating} stars with ${lead.reviews_count} reviews on Google Maps, but your business does not have a web address connected yet.

To help you grow, we've custom-designed a landing page for you to review:
${origin}/preview/${lead.lead_id}

This page was auto-generated by ApexReach based on your top-rated local presence in ${lead.area || 'Lagos'}. If you like the design, you can claim it and connect it to your own custom domain.

Best regards,
${config.businessSignature}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '280px', borderRight: '1px solid var(--panel-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="glass-panel">
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            <Database size={24} /> ApexReach
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>B2B Lead Engine</span>
        </div>

        {/* Dynamic Sign-In / Account block */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          {config.googleUserEmail ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Google Identity Linked</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#fff', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {config.googleUserEmail}
              </div>
              <button onClick={handleSignOut} className="btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '6px', justifyContent: 'center', gap: '4px', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                <LogOut size={12} /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Google Cloud Integration</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Google Project ID (optional)</label>
                <input 
                  type="text" 
                  value={customLoginProjectId} 
                  onChange={(e) => setCustomLoginProjectId(e.target.value)}
                  placeholder="e.g. vertex-ai-leadgen"
                  style={{ width: '100%', padding: '6px 8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                />
              </div>

              <button 
                onClick={handleGoogleSignIn} 
                className="btn-primary" 
                style={{ 
                  width: '100%', 
                  fontSize: '0.8rem', 
                  padding: '8px', 
                  justifyContent: 'center', 
                  gap: '6px',
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
                  boxShadow: '0 4px 10px rgba(66, 133, 244, 0.25)'
                }}
              >
                <ShieldCheck size={14} /> Sign In with Google
              </button>
            </div>
          )}
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'dashboard' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'dashboard' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <LayoutDashboard size={18} color={activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)'} /> Console
          </button>
          
          <button 
            onClick={() => setActiveTab('crm')} 
            className={`btn-secondary ${activeTab === 'crm' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'crm' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'crm' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Users size={18} color={activeTab === 'crm' ? 'var(--primary)' : 'var(--text-secondary)'} /> Leads CRM
          </button>
          
          <button 
            onClick={() => setActiveTab('scrapers')} 
            className={`btn-secondary ${activeTab === 'scrapers' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'scrapers' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'scrapers' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Compass size={18} color={activeTab === 'scrapers' ? 'var(--primary)' : 'var(--text-secondary)'} /> Maps Scraper
          </button>
          
          <button 
            onClick={() => setActiveTab('logs')} 
            className={`btn-secondary ${activeTab === 'logs' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'logs' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'logs' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <FileText size={18} color={activeTab === 'logs' ? 'var(--primary)' : 'var(--text-secondary)'} /> Sync Logs
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`btn-secondary ${activeTab === 'settings' ? 'active' : ''}`}
            style={{ justifyContent: 'flex-start', background: activeTab === 'settings' ? 'var(--primary-glow)' : 'transparent', borderColor: activeTab === 'settings' ? 'var(--primary)' : 'transparent', width: '100%' }}
          >
            <Settings size={18} color={activeTab === 'settings' ? 'var(--primary)' : 'var(--text-secondary)'} /> Settings
          </button>
        </nav>
        
        {/* Connection status */}
        <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.googleSpreadsheetId ? 'var(--success)' : 'var(--error)' }}></span>
            Sheets DB: {config.googleSpreadsheetId ? 'Connected' : 'Setup Required'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.googleProjectId ? 'var(--success)' : 'var(--warning)' }}></span>
            Vertex AI: {config.googleProjectId ? 'Configured' : 'Fallback Active'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.dryRun ? 'var(--warning)' : 'var(--primary)' }}></span>
            Campaigns: {config.dryRun ? 'Dry Run Sim' : config.outreachChannel === 'whatsapp' ? `WhatsApp (${config.whatsappProvider})` : config.outreachChannel === 'sms' ? `SMS (${config.smsProvider})` : config.outreachChannel === 'coldcall' ? 'Twilio Call' : `Email (${config.emailProvider})`}
          </div>
        </div>
      </aside>
      
      {/* Main Panel */}
      <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', fontWeight: 800 }}>
              Lead Generation & Website Builder Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              B2B website proposal pipeline powered exclusively by <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Google Cloud Workspace APIs</span>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleRefreshAll} disabled={loadingLeads} className="btn-secondary">
              <RefreshCw size={16} className={loadingLeads ? 'spin-anim' : ''} /> Sync Pipeline
            </button>
          </div>
        </header>

        {statusMessage && (
          <div className="glass-panel" style={{ padding: '12px 18px', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Info size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* VIDEO DEMO SECTION */}
        {activeTab === 'dashboard' && (
          <section className="glass-panel" style={{ padding: '24px', marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Platform Walkthrough Demo
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Watch a complete voiced tour of every feature in the ApexReach Lead Engine
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href="/assets/apexreach-demo.webm"
                  download="ApexReach-Platform-Demo.webm"
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    textDecoration: 'none'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Video
                </a>
                <span className="badge badge-new">VOICED DEMO</span>
              </div>
            </div>
            <div
              className="video-demo-wrapper"
              onClick={() => {
                const vid = document.getElementById('demoVideo') as HTMLVideoElement;
                if (vid) {
                  if (vid.paused) {
                    vid.play();
                    setVideoPlaying(true);
                  } else {
                    vid.pause();
                    setVideoPlaying(false);
                  }
                }
              }}
            >
              <video
                id="demoVideo"
                poster="/assets/video-thumbnail.png"
                preload="metadata"
                controls={videoPlaying}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
                style={{ background: '#000', width: '100%', height: '100%' }}
              >
                <source src="/assets/apexreach-demo.webm" type="video/webm" />
              </video>
              <div className={`video-play-overlay ${videoPlaying ? 'hidden' : ''}`}>
                <div className="video-play-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" stroke="none"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 1: CONSOLE */}
        {activeTab === 'dashboard' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Leads Ingested</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', fontWeight: 700 }}>{stats.totalLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total businesses found on Google Maps
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Ready for Proposal</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--primary)', fontWeight: 700 }}>{stats.newLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Businesses with no website listed
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Outreach Sent</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--success)', fontWeight: 700 }}>{stats.contactedLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Proposals successfully emailed
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Highly Rated Leads</span>
                <h3 style={{ fontSize: '2.2rem', marginTop: '10px', color: 'var(--warning)', fontWeight: 700 }}>{stats.highRatingLeads || leads.filter(l => l.rating >= 4.0).length}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Google rating floor threshold &gt;= 4.0
                </div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={20} color="var(--primary)" /> Launch Outreach Campaign
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {config.outreachChannel === 'whatsapp' 
                    ? `Send personalized WhatsApp messages using your configured ${config.whatsappProvider?.toUpperCase() || 'Meta Cloud'} provider.` 
                    : config.outreachChannel === 'sms'
                    ? `Send bulk text messages (SMS) using your configured ${config.smsProvider?.toUpperCase() || 'Android Gateway'} provider.`
                    : config.outreachChannel === 'coldcall' 
                    ? 'Trigger automated Twilio cold-calls with interactive voice text-to-speech to prospective leads.' 
                    : `Send personalized email proposals using your configured ${config.emailProvider?.toUpperCase() || 'Gmail'} provider.`
                  }
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Pending B2B website proposals:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{stats.newLeads} leads</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Outreach Channel:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                      {config.outreachChannel || 'gmail'}
                    </span>
                  </div>
                  {config.outreachChannel === 'gmail' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>Email Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.emailProvider || 'gmail'}
                      </span>
                    </div>
                  )}
                  {config.outreachChannel === 'whatsapp' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>WhatsApp Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.whatsappProvider || 'cloud'}
                      </span>
                    </div>
                  )}
                  {config.outreachChannel === 'sms' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span>SMS Provider:</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {config.smsProvider || 'gateway'}
                      </span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Outreach dispatch mode:</span>
                    <span style={{ color: config.dryRun ? 'var(--warning)' : 'var(--error)', fontWeight: 600 }}>
                      {config.dryRun ? 'SIMULATION (Dry Run)' : 'LIVE OUTREACH (Real dispatch)'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    const pending = leads.filter(l => l.status === 'NEW').map(l => l.lead_id);
                    setSelectedLeads(new Set(pending));
                    setActiveTab('crm');
                  }}
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Configure & Launch <ArrowRight size={16} />
                </button>
              </section>

              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} color="var(--success)" /> Pipeline Execution Log</h3>
                <div style={{ height: '220px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {loadingLogs && <div style={{ color: 'var(--text-secondary)' }}>Retrieving sync logs...</div>}
                  {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No logs logged in Google Sheets.</div>}
                  {logs.slice(0, 10).map((log, idx) => (
                    <div key={idx} style={{ paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>[{new Date(log[1]).toLocaleTimeString()}]</span>{' '}
                      <span style={{ color: log[4] === 'ERROR' ? 'var(--error)' : log[4] === 'SUCCESS' ? 'var(--success)' : 'var(--primary)' }}>
                        [{log[4]}]
                      </span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>({log[2]}):</span> {log[5]}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}

        {/* TAB 2: CRM */}
        {activeTab === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexGrow: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search leads by name, category, area..."
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', width: '100%' }}
                />
              </div>

              <div>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Lifecycle Stages</option>
                  <option value="NEW">NEW (Uncontacted)</option>
                  <option value="CONTACTED">CONTACTED (Emailed)</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
              <div className="glass-panel" style={{ overflowX: 'auto', minHeight: '400px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Leads Directory ({filteredLeads.length} matching)</h3>
                  {selectedLeads.size > 0 && (
                    <button 
                      onClick={runOutreach} 
                      disabled={outreachDetails.isDisabled} 
                      className="btn-primary" 
                      style={{ fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {outreachDetails.icon} {outreachDetails.label} ({selectedLeads.size})
                    </button>
                  )}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <th style={{ padding: '14px 20px', width: '40px' }}>
                        <input 
                          type="checkbox" 
                          checked={filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length} 
                          onChange={() => toggleSelectAll(filteredLeads)}
                          style={{ cursor: 'pointer' }}
                        />
                      </th>
                      <th style={{ padding: '14px 20px' }}>Business Name</th>
                      <th style={{ padding: '14px' }}>Category</th>
                      <th style={{ padding: '14px' }}>Rating</th>
                      <th style={{ padding: '14px' }}>Area</th>
                      <th style={{ padding: '14px' }}>Email</th>
                      <th style={{ padding: '14px' }}>Stage</th>
                      <th style={{ padding: '14px 20px' }}>Previews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingLeads && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          Retrieving lead directory from Sheets database...
                        </td>
                      </tr>
                    )}
                    {!loadingLeads && filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No leads match the selected criteria.
                        </td>
                      </tr>
                    )}
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.lead_id} 
                        onClick={() => setPreviewLead(lead)}
                        style={{ 
                          borderBottom: '1px solid rgba(255,255,255,0.02)', 
                          cursor: 'pointer',
                          backgroundColor: previewLead?.lead_id === lead.lead_id ? 'rgba(6, 182, 212, 0.04)' : 'transparent',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={selectedLeads.has(lead.lead_id)} 
                            onChange={() => toggleSelectLead(lead.lead_id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600 }}>{lead.name}</td>
                        <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{lead.category}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ color: 'var(--warning)', fontWeight: 600 }}>★ {lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>({lead.reviews_count})</span>
                        </td>
                        <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>{lead.area}</td>
                        <td style={{ padding: '14px', fontFamily: 'monospace' }}>{lead.email || 'N/A'}</td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${lead.status === 'NEW' ? 'badge-new' : lead.status === 'CONTACTED' ? 'badge-contacted' : 'badge-error'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }} onClick={(e) => e.stopPropagation()}>
                          <a 
                            href={`/preview/${lead.lead_id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-secondary" 
                            style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                          >
                            <Eye size={12} /> View Web Page
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Template Preview Panel */}
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', margin: 0 }}>
                  <UserCheck size={18} color="var(--primary)" /> Client Site Customizer & Outreach
                </h3>

                {previewLead ? (
                  <>
                    {/* Tab Navigation */}
                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('outreach')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'outreach' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'outreach' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Mail size={12} /> Outreach
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('customizer')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'customizer' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'customizer' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Palette size={12} /> Customizer
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('tasks')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'tasks' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'tasks' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Terminal size={12} /> Tasks
                      </button>
                      <button 
                        type="button"
                        onClick={() => setCrmPreviewTab('handover')}
                        style={{ 
                          flex: 1, 
                          padding: '8px 4px', 
                          background: crmPreviewTab === 'handover' ? 'rgba(6, 182, 212, 0.15)' : 'transparent', 
                          border: 'none', 
                          borderRadius: '6px',
                          color: crmPreviewTab === 'handover' ? '#fff' : 'var(--text-secondary)', 
                          fontWeight: 600, 
                          cursor: 'pointer', 
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Share2 size={12} /> Handover
                      </button>
                    </div>

                    {/* TAB CONTENT: OUTREACH */}
                    {crmPreviewTab === 'outreach' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '0.85rem' }}>
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Send To:</strong> {previewLead.email || previewLead.phone_raw || previewLead.profile_url || 'N/A'}</div>
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Business:</strong> {previewLead.name}</div>
                          <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--text-secondary)' }}>Rating:</strong> {previewLead.rating} Stars</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <input 
                            type="checkbox" 
                            id="useCustomMessage" 
                            checked={useCustomMessage} 
                            onChange={(e) => {
                              setUseCustomMessage(e.target.checked);
                              if (e.target.checked && !customMessageText) {
                                setCustomMessageText(renderTemplatePreview(previewLead));
                                const channel = config.outreachChannel || 'gmail';
                                if (['gmail', 'email'].includes(channel)) {
                                  setCustomSubjectText(`Custom Web Design Proposal for ${previewLead.name}`);
                                }
                              }
                            }}
                            style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
                          />
                          <label htmlFor="useCustomMessage" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', userSelect: 'none' }}>
                            Send a custom message override instead of template
                          </label>
                        </div>

                        {useCustomMessage ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(config.outreachChannel === 'gmail' || !config.outreachChannel) && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Custom Subject Line</label>
                                <input 
                                  type="text" 
                                  value={customSubjectText} 
                                  onChange={(e) => setCustomSubjectText(e.target.value)} 
                                  placeholder="e.g. Unique proposal for {{lead.name}}"
                                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                                />
                              </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Custom Message Body</label>
                              <textarea 
                                rows={8}
                                value={customMessageText} 
                                onChange={(e) => setCustomMessageText(e.target.value)} 
                                placeholder="Type your custom outreach message here..."
                                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
                              />
                            </div>

                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                              <span>Click tags to insert:</span>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{lead.name}}')}>{"{{lead.name}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{previewUrl}}')}>{"{{previewUrl}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{lead.rating}}')}>{"{{lead.rating}}"}</button>
                              <button type="button" style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '3px 6px', borderRadius: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem' }} onClick={() => setCustomMessageText(prev => prev + ' {{signature}}')}>{"{{signature}}"}</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '14px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '220px' }}>
                            {renderTemplatePreview(previewLead)}
                          </div>
                        )}
                        
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Info size={12} />
                          {(!config.outreachChannel || config.outreachChannel === 'gmail') && "Make sure the business has an email saved in Google Sheets before clicking Outreach Send."}
                          {config.outreachChannel === 'whatsapp' && "Make sure the business has a valid phone number before clicking Outreach Send."}
                          {config.outreachChannel === 'sms' && "Make sure the business has a valid phone number before clicking Outreach Send."}
                          {config.outreachChannel === 'coldcall' && "Twilio will call the business phone number using synthetic AI voice speech."}
                          {config.outreachChannel === 'jiji' && "Jiji automated dispatcher will open the Jiji profile link and submit the chat."}
                          {['instagram', 'facebook', 'tiktok', 'linkedin'].includes(config.outreachChannel || '') && "Social outreach will flag lead status contacted and redirect you to the direct chat page."}
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: CUSTOMIZER */}
                    {crmPreviewTab === 'customizer' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Gemini AI Redesign Prompt */}
                        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', margin: 0 }}>
                            <Sparkles size={14} /> AI Web Redesign Prompt (Gemini Vertex)
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                            <input 
                              type="text" 
                              value={aiRedesignPrompt} 
                              onChange={(e) => setAiRedesignPrompt(e.target.value)} 
                              placeholder="e.g. elegant dark theme with gold accents"
                              style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                            />
                            <button 
                              type="button" 
                              onClick={handleAiRedesign}
                              disabled={aiRedesignLoading || !aiRedesignPrompt}
                              className="btn-primary"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '10px 14px' }}
                            >
                              {aiRedesignLoading ? <Loader2 className="spin-anim" size={14} /> : <Sparkles size={14} />} Redesign
                            </button>
                          </div>
                        </div>

                        {/* Manual Customization Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, margin: 0 }}>
                            Manual Styles & Content Overrides
                          </h4>

                          {/* Theme Colors Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Primary Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overridePrimary || '#1e3a8a'} 
                                  onChange={(e) => setOverridePrimary(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overridePrimary} 
                                  onChange={(e) => setOverridePrimary(e.target.value)} 
                                  placeholder="#1e3a8a"
                                  style={{ flex: 1, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Accent Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideAccent || '#60a5fa'} 
                                  onChange={(e) => setOverrideAccent(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideAccent} 
                                  onChange={(e) => setOverrideAccent(e.target.value)} 
                                  placeholder="#60a5fa"
                                  style={{ flex: 1, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Background Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideBg || '#eff6ff'} 
                                  onChange={(e) => setOverrideBg(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideBg} 
                                  onChange={(e) => setOverrideBg(e.target.value)} 
                                  placeholder="#eff6ff"
                                  style={{ flex: 1, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Text Color</label>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <input 
                                  type="color" 
                                  value={overrideText || '#1e3a8a'} 
                                  onChange={(e) => setOverrideText(e.target.value)} 
                                  style={{ width: '32px', height: '32px', border: 'none', borderRadius: '4px', background: 'none', cursor: 'pointer' }}
                                />
                                <input 
                                  type="text" 
                                  value={overrideText} 
                                  onChange={(e) => setOverrideText(e.target.value)} 
                                  placeholder="#1e3a8a"
                                  style={{ flex: 1, padding: '6px 8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', width: '0' }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Font Selector */}
                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Typography Font</label>
                            <select 
                              value={overrideFont} 
                              onChange={(e) => setOverrideFont(e.target.value)}
                              style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                            >
                              <option value="">Default theme font</option>
                              <option value="Inter">Inter (Modern Clean)</option>
                              <option value="Space Grotesk">Space Grotesk (Tech Editorial)</option>
                              <option value="Playfair Display">Playfair Display (Luxury Serif)</option>
                              <option value="DM Serif Display">DM Serif Display (Classic Bold)</option>
                              <option value="Outfit">Outfit (Premium Rounded)</option>
                            </select>
                          </div>

                          {/* Section Visibility Switches */}
                          <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Section Visibility</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}>
                                <input type="checkbox" checked={overrideShowServices} onChange={(e) => setOverrideShowServices(e.target.checked)} /> Show Services
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}>
                                <input type="checkbox" checked={overrideShowTestimonials} onChange={(e) => setOverrideShowTestimonials(e.target.checked)} /> Show Testimonials
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}>
                                <input type="checkbox" checked={overrideShowEstimator} onChange={(e) => setOverrideShowEstimator(e.target.checked)} /> Show Booking/Estimator
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}>
                                <input type="checkbox" checked={overrideShowAbout} onChange={(e) => setOverrideShowAbout(e.target.checked)} /> Show About Us
                              </label>
                            </div>
                          </div>

                          {/* Copy Content Overrides */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Hero Title (Tagline)</label>
                              <input 
                                type="text" 
                                value={overrideHeroTitle} 
                                onChange={(e) => setOverrideHeroTitle(e.target.value)} 
                                placeholder="Enter custom tagline..."
                                style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Hero Subtitle</label>
                              <textarea 
                                rows={2}
                                value={overrideHeroSubtitle} 
                                onChange={(e) => setOverrideHeroSubtitle(e.target.value)} 
                                placeholder="Enter custom subtitle value prop..."
                                style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>About Text</label>
                              <textarea 
                                rows={3}
                                value={overrideAboutText} 
                                onChange={(e) => setOverrideAboutText(e.target.value)} 
                                placeholder="Enter custom about section content..."
                                style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none', resize: 'vertical' }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>CTA Button Text</label>
                              <input 
                                type="text" 
                                value={overrideCtaText} 
                                onChange={(e) => setOverrideCtaText(e.target.value)} 
                                placeholder="e.g. Book Appointment"
                                style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', outline: 'none' }}
                              />
                            </div>
                          </div>

                          <button 
                            type="button" 
                            onClick={saveOverrides}
                            className="btn-primary"
                            style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 600, marginTop: '8px', cursor: 'pointer' }}
                          >
                            Save Design Overrides
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: TASKS */}
                    {crmPreviewTab === 'tasks' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 4px 0' }}>
                            <Terminal size={14} /> Antigravity Developer Task Queue
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>
                            Submit complex coding modifications (e.g. adding features, page layout changes) for the background CLI agent to execute directly on the codebase.
                          </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Describe Modification / Feature Prompt</label>
                            <textarea 
                              rows={5}
                              value={taskQueuePrompt} 
                              onChange={(e) => setTaskQueuePrompt(e.target.value)} 
                              placeholder="e.g. Add a beautiful Google Maps iframe section and a multi-step booking wizard for this Dentist site."
                              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'vertical', fontFamily: 'monospace' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Task Priority</label>
                            <select 
                              value={taskQueuePriority} 
                              onChange={(e) => setTaskQueuePriority(e.target.value as any)}
                              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                            >
                              <option value="low">Low Priority</option>
                              <option value="medium">Medium Priority</option>
                              <option value="high">High Priority</option>
                            </select>
                          </div>

                          <button 
                            type="button" 
                            onClick={queueTask}
                            disabled={taskQueueLoading || !taskQueuePrompt}
                            className="btn-primary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            {taskQueueLoading ? <Loader2 className="spin-anim" size={16} /> : <Send size={16} />} Queue Code Modification
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: HANDOVER */}
                    {crmPreviewTab === 'handover' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                          <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, margin: '0 0 4px 0' }}>
                            Client Hosting & Database Options
                          </h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', margin: 0 }}>
                            Configure where leads should submit bookings and how the client hosting should be managed when claiming this website.
                          </p>
                        </div>

                        {/* Turnout Scaling Selector */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px', fontWeight: 600 }}>Lead Turnout Mode</label>
                          <select 
                            value={turnoutMode} 
                            onChange={(e) => updateTurnoutMode(e.target.value as any)}
                            style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', outline: 'none', fontWeight: 600 }}
                          >
                            <option value="dynamic">Central CRM Database Mode</option>
                            <option value="n8n">Direct n8n automation webhook redirection</option>
                            <option value="git">Independent HTML / Git export client package</option>
                          </select>

                          {turnoutMode === 'dynamic' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Form submissions route back directly to this admin console's main CRM pipeline and Google Sheets.
                            </p>
                          )}
                          {turnoutMode === 'n8n' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Form submissions bypass this console and route directly to the webhook URL set in Settings.
                            </p>
                          )}
                          {turnoutMode === 'git' && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>
                              Claiming the site will export and publish code to GitHub / Netlify. Forms submit to independent client keys (Web3Forms/Supabase).
                            </p>
                          )}
                        </div>

                        {/* Handover Portal Button */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                          <a 
                            href={`/handover/${previewLead.lead_id}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn-secondary"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', width: '100%', textAlign: 'center' }}
                          >
                            <ExternalLink size={16} /> Open Client Handover Portal
                          </a>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Send this secure portal link to the client to let them handle hosting setup independently.
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                    Select a lead in the CRM directory to preview website overrides and outreach options.
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* TAB 3: SCRAPERS CONTROL */}
        {activeTab === 'scrapers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Multi-Source Lead Scrapers</h3>
                <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>Multiple Providers</span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select a lead scraper provider. All providers automatically filter out businesses that already have websites and insert new qualified leads directly into your database.
              </p>
              
              <div style={{ marginBottom: '8px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Scraper Provider</label>
                <select 
                  value={selectedScraper} 
                  onChange={(e) => setSelectedScraper(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                >
                  <option value="google">Google Places API (Has Free Tier / High Quality)</option>
                  <option value="maps-free">Google Maps Free Web Scraper (Playwright / Free)</option>
                  <option value="duckduckgo">DuckDuckGo Search Scraper (HTML Crawler / Free)</option>
                  <option value="osm">OpenStreetMap Overpass API (100% Free / No API Key)</option>
                  <option value="jiji">Jiji.ng Crawler (100% Free Playwright Headless Browser)</option>
                  <option value="apify">Apify Google Maps Actor (High Scale / Paid API)</option>
                  <option value="instagram">Instagram Scraper (100% Free Web Scraper)</option>
                  <option value="facebook">Facebook Scraper (100% Free Web Scraper)</option>
                  <option value="tiktok">TikTok Scraper (100% Free Web Scraper)</option>
                  <option value="linkedin">LinkedIn Scraper (100% Free Web Scraper)</option>
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    {selectedScraper === 'jiji' ? 'Jiji Category, Keyword or URL' : 'Industry / Keyword Search Query'}
                  </label>
                  <input 
                    type="text" 
                    value={gMapsQuery} 
                    onChange={(e) => setGMapsQuery(e.target.value)}
                    placeholder={
                      selectedScraper === 'jiji' 
                        ? 'e.g. cars or https://jiji.ng/cars' 
                        : selectedScraper === 'osm'
                        ? 'e.g. Dentists Ikeja'
                        : 'e.g. Dentists Ikeja'
                    }
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Max Results</label>
                  <input 
                    type="number" 
                    value={gMapsLimit} 
                    onChange={(e) => setGMapsLimit(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              
              <button 
                onClick={runScraper} 
                disabled={
                  scraping || 
                  (selectedScraper === 'google' && !config.googlePlacesApiKey && config.storageMode !== 'local') ||
                  (selectedScraper === 'apify' && !config.apifyToken)
                } 
                className="btn-primary" 
                style={{ marginTop: '12px', alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Search size={16} /> Execute {
                  selectedScraper === 'google' ? 'Google Places' 
                  : selectedScraper === 'maps-free' ? 'Google Maps Free' 
                  : selectedScraper === 'duckduckgo' ? 'DuckDuckGo' 
                  : selectedScraper === 'jiji' ? 'Jiji' 
                  : selectedScraper === 'osm' ? 'OSM' 
                  : selectedScraper === 'apify' ? 'Apify'
                  : selectedScraper.charAt(0).toUpperCase() + selectedScraper.slice(1)
                } Scrape
              </button>

              {selectedScraper === 'google' && !config.googlePlacesApiKey && (
                <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '8px' }}>
                  ⚠️ No Google Places API Key configured. Google scraper will run in local sandbox mode with simulated leads.
                </div>
              )}
              {selectedScraper === 'apify' && !config.apifyToken && (
                <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '8px' }}>
                  ⚠️ No Apify Token configured. Apify scraper is disabled. Please configure your token in settings.
                </div>
              )}
              {selectedScraper === 'osm' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px' }}>
                  ✨ OpenStreetMap requires no API Keys and is 100% free to search local business registers.
                </div>
              )}
              {selectedScraper === 'jiji' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px' }}>
                  ✨ Jiji scraper crawls live listings using a local Playwright headless browser for free.
                </div>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--primary)' }}>Verification Rules</h4>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Website Check:</strong> Skips businesses with an existing web domain list to target low online presence.</li>
                <li><strong>Outreach Sync:</strong> Automatically normalizes phone numbers and syncs target lists to Google Sheets in real-time.</li>
                <li><strong>Rating Floor:</strong> Defaults to high ratings or checks Maps rating thresholds.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM SYNC LOGS */}
        {activeTab === 'logs' && (
          <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>System Audit Logs</h3>
              <button onClick={fetchLogs} disabled={loadingLogs} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                Refresh Timeline
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '400px' }}>
              {loadingLogs && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Syncing audit logs timeline...</div>}
              {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No system logs found in Google Sheets.</div>}
              
              {logs.map((log, index) => (
                <div key={index} style={{ padding: '16px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{log[2]}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(log[1]).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span className={`badge ${log[4] === 'SUCCESS' ? 'badge-contacted' : log[4] === 'ERROR' ? 'badge-error' : 'badge-new'}`} style={{ fontSize: '0.7rem' }}>
                      {log[4]}
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{log[5]}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 5: SYSTEM VARIABLES */}
        {activeTab === 'settings' && (
          <form onSubmit={saveConfig} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>System Settings & API Integrations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>Configure your databases, scraping APIs, and multi-channel outreach options.</p>
            </div>

            {/* Section A: Global & Data Store */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: '#fff' }}>1. Global Configuration</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Storage Backend Mode</label>
                  <select 
                    value={config.storageMode || 'hybrid'} 
                    onChange={(e) => setConfig({ ...config, storageMode: e.target.value as any })}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  >
                    <option value="hybrid">Hybrid Mode (Google Sheets + fallback)</option>
                    <option value="local">Local Mode (JSON file DB)</option>
                    <option value="supabase">Supabase Database (Postgres)</option>
                    <option value="cloud">Google Sheets Database Only</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Default Outreach Channel</label>
                  <select 
                    value={config.outreachChannel || 'gmail'} 
                    onChange={(e) => setConfig({ ...config, outreachChannel: e.target.value as any })}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  >
                    <option value="gmail">Email Outreach</option>
                    <option value="whatsapp">WhatsApp Outreach</option>
                    <option value="sms">SMS Text Outreach</option>
                    <option value="coldcall">Twilio Cold Call</option>
                    <option value="jiji">Jiji Chat Outreach</option>
                    <option value="instagram">Instagram Chat Outreach</option>
                    <option value="facebook">Facebook Chat Outreach</option>
                    <option value="tiktok">TikTok Chat Outreach</option>
                    <option value="linkedin">LinkedIn Chat Outreach</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Outreach Business Signature</label>
                  <input 
                    type="text" 
                    value={config.businessSignature} 
                    onChange={(e) => setConfig({ ...config, businessSignature: e.target.value })}
                    placeholder="e.g. ApexReach Team"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Google Spreadsheet ID</label>
                  <input 
                    type="text" 
                    value={config.googleSpreadsheetId} 
                    onChange={(e) => setConfig({ ...config, googleSpreadsheetId: e.target.value })}
                    placeholder="Paste Spreadsheet ID"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Google Places API Key (Scraper)</label>
                  <input 
                    type="password" 
                    value={config.googlePlacesApiKey} 
                    onChange={(e) => setConfig({ ...config, googlePlacesApiKey: e.target.value })}
                    placeholder="Paste Google Cloud API key"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Gemini AI API Key (Copywriting)</label>
                  <input 
                    type="password" 
                    value={config.geminiApiKey} 
                    onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                    placeholder="Paste Gemini API Key"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Section B: Email Provider */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff' }}>2. Email Outreach Provider</h4>
                <select 
                  value={config.emailProvider || 'gmail'} 
                  onChange={(e) => setConfig({ ...config, emailProvider: e.target.value as any })}
                  style={{ padding: '8px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', color: '#fff', fontWeight: 600, outline: 'none' }}
                >
                  <option value="gmail">Google Workspace (Gmail OAuth)</option>
                  <option value="resend">Resend.com API</option>
                  <option value="brevo">Brevo.com API (SMTP)</option>
                </select>
              </div>

              {config.emailProvider === 'gmail' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google OAuth Client ID</label>
                    <input 
                      type="text" 
                      value={config.googleClientId || ''} 
                      onChange={(e) => setConfig({ ...config, googleClientId: e.target.value })}
                      placeholder="Enter Google Client ID"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google OAuth Client Secret</label>
                    <input 
                      type="password" 
                      value={config.googleClientSecret || ''} 
                      onChange={(e) => setConfig({ ...config, googleClientSecret: e.target.value })}
                      placeholder="Enter Google Client Secret"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Google Cloud Project ID</label>
                    <input 
                      type="text" 
                      value={config.googleProjectId || ''} 
                      onChange={(e) => setConfig({ ...config, googleProjectId: e.target.value })}
                      placeholder="e.g. leadgen-console"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.emailProvider === 'resend' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Resend API Key</label>
                    <input 
                      type="password" 
                      value={config.resendApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, resendApiKey: e.target.value })}
                      placeholder="re_..."
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>From Email Address (Verified Domain)</label>
                    <input 
                      type="text" 
                      value={config.resendFromEmail || ''} 
                      onChange={(e) => setConfig({ ...config, resendFromEmail: e.target.value })}
                      placeholder="onboarding@resend.dev or hello@yourdomain.com"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.emailProvider === 'brevo' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Brevo API Key (V3)</label>
                    <input 
                      type="password" 
                      value={config.brevoApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, brevoApiKey: e.target.value })}
                      placeholder="xkeysib-..."
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender Display Name</label>
                    <input 
                      type="text" 
                      value={config.brevoSenderName || ''} 
                      onChange={(e) => setConfig({ ...config, brevoSenderName: e.target.value })}
                      placeholder="e.g. ApexReach Support"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender Verified Email</label>
                    <input 
                      type="text" 
                      value={config.brevoSenderEmail || ''} 
                      onChange={(e) => setConfig({ ...config, brevoSenderEmail: e.target.value })}
                      placeholder="hello@yourdomain.com"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section C: WhatsApp Provider */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>3. WhatsApp Outreach Provider</h4>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <input 
                      type="checkbox" 
                      checked={config.whatsappEnabled || false} 
                      onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    <span>Enable WhatsApp sending endpoint</span>
                  </label>
                </div>
                <select 
                  value={config.whatsappProvider || 'cloud'} 
                  onChange={(e) => setConfig({ ...config, whatsappProvider: e.target.value as any })}
                  style={{ padding: '8px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', color: '#fff', fontWeight: 600, outline: 'none' }}
                >
                  <option value="cloud">Meta Business WhatsApp API</option>
                  <option value="evolution">Evolution API (QR Code / Baileys)</option>
                  <option value="whapi">Whapi.cloud API (QR Code / Web)</option>
                </select>
              </div>

              {config.whatsappProvider === 'cloud' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Phone Number ID</label>
                    <input 
                      type="text" 
                      value={config.whatsappPhoneNumberId || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                      placeholder="Enter Phone Number ID"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>System Access Token</label>
                    <input 
                      type="password" 
                      value={config.whatsappAccessToken || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappAccessToken: e.target.value })}
                      placeholder="EAAB..."
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Template Name</label>
                    <input 
                      type="text" 
                      value={config.whatsappTemplateName || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappTemplateName: e.target.value })}
                      placeholder="e.g. lead_outreach_1"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Template Language Code</label>
                    <input 
                      type="text" 
                      value={config.whatsappTemplateLanguageCode || ''} 
                      onChange={(e) => setConfig({ ...config, whatsappTemplateLanguageCode: e.target.value })}
                      placeholder="e.g. en_US"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.whatsappProvider === 'evolution' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Evolution API Base URL</label>
                    <input 
                      type="text" 
                      value={config.evolutionApiUrl || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionApiUrl: e.target.value })}
                      placeholder="https://api.myserver.com"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Instance apikey</label>
                    <input 
                      type="password" 
                      value={config.evolutionApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionApiKey: e.target.value })}
                      placeholder="apikey token"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Instance Name</label>
                    <input 
                      type="text" 
                      value={config.evolutionInstanceName || ''} 
                      onChange={(e) => setConfig({ ...config, evolutionInstanceName: e.target.value })}
                      placeholder="e.g. MyPersonalPhone"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.whatsappProvider === 'whapi' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Whapi Token</label>
                    <input 
                      type="password" 
                      value={config.whapiToken || ''} 
                      onChange={(e) => setConfig({ ...config, whapiToken: e.target.value })}
                      placeholder="Whapi.cloud bearer token"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {/* Text Message Template input for Evolution/Whapi */}
              {(config.whatsappProvider === 'evolution' || config.whatsappProvider === 'whapi') && (
                <div style={{ marginTop: '16px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Custom Text Message Template</label>
                  <textarea 
                    value={config.whatsappMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, whatsappMessageTemplate: e.target.value })}
                    placeholder={`Hi {{lead.name}},\n\nWe generated a custom landing page for your business. Check it out: {{previewUrl}}\n\nBest, {{businessSignature}}`}
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{businessSignature}}`}</code>
                  </div>
                </div>
              )}
            </div>

            {/* Section D: Twilio Calls (Optional) */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: '#fff' }}>4. Twilio Voice Cold Calling (Optional)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Twilio Account SID</label>
                  <input 
                    type="text" 
                    value={config.twilioAccountSid || ''} 
                    onChange={(e) => setConfig({ ...config, twilioAccountSid: e.target.value })}
                    placeholder="AC..."
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Twilio Auth Token</label>
                  <input 
                    type="password" 
                    value={config.twilioAuthToken || ''} 
                    onChange={(e) => setConfig({ ...config, twilioAuthToken: e.target.value })}
                    placeholder="Auth Token"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Twilio From Phone Number</label>
                  <input 
                    type="text" 
                    value={config.twilioFromNumber || ''} 
                    onChange={(e) => setConfig({ ...config, twilioFromNumber: e.target.value })}
                    placeholder="+1234567890"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Twilio Call Message Template</label>
                  <textarea 
                    value={config.twilioCallMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, twilioCallMessageTemplate: e.target.value })}
                    placeholder="Hello, this is a call from ApexReach to let you know we custom designed a web page for your business..."
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* Section E: SMS Outreach (Low Cost / Free) */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fff', margin: 0 }}>4.5. Bulk SMS Outreach Settings</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Choose a free Android Carrier Gateway or low-cost African direct providers.</p>
                </div>
                <select 
                  value={config.smsProvider || 'gateway'} 
                  onChange={(e) => setConfig({ ...config, smsProvider: e.target.value as any })}
                  style={{ padding: '8px 12px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid var(--primary)', borderRadius: '6px', color: '#fff', fontWeight: 600, outline: 'none' }}
                >
                  <option value="gateway">Android Gateway (Free ₦0.00)</option>
                  <option value="termii">Termii SMS (Nigeria ₦2.00 - ₦4.50)</option>
                  <option value="africastalking">Africa's Talking (Africa ₦2.50 - ₦5.00)</option>
                  <option value="twilio">Twilio SMS ($0.05 - $0.10)</option>
                </select>
              </div>

              {config.smsProvider === 'gateway' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Android SMS Gateway IP / URL</label>
                    <input 
                      type="url" 
                      value={config.smsGatewayUrl || ''} 
                      onChange={(e) => setConfig({ ...config, smsGatewayUrl: e.target.value })}
                      placeholder="e.g. http://192.168.1.5:8080/send or https://my-ngrok-tunnel.ngrok-free.app/send"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Install any free SMS Gateway app on an Android phone, keep it connected to the internet/WiFi, and paste the endpoint URL here.
                    </div>
                  </div>
                </div>
              )}

              {config.smsProvider === 'termii' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Termii API Key</label>
                    <input 
                      type="password" 
                      value={config.termiiApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, termiiApiKey: e.target.value })}
                      placeholder="Enter Termii API Key"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender ID / Signature</label>
                    <input 
                      type="text" 
                      value={config.termiiSenderId || ''} 
                      onChange={(e) => setConfig({ ...config, termiiSenderId: e.target.value })}
                      placeholder="e.g. Sandbox or registered Sender ID"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.smsProvider === 'africastalking' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Username</label>
                    <input 
                      type="text" 
                      value={config.africastalkingUsername || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingUsername: e.target.value })}
                      placeholder="e.g. sandbox or production username"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>API Key</label>
                    <input 
                      type="password" 
                      value={config.africastalkingApiKey || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingApiKey: e.target.value })}
                      placeholder="Enter Africa's Talking API Key"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Sender ID / Shortcode (Optional)</label>
                    <input 
                      type="text" 
                      value={config.africastalkingSenderId || ''} 
                      onChange={(e) => setConfig({ ...config, africastalkingSenderId: e.target.value })}
                      placeholder="e.g. brand name or shortcode"
                      style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {config.smsProvider === 'twilio' && (
                <div style={{ background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Uses credentials from section <strong>4. Twilio Voice Cold Calling</strong> (SID, Auth Token, and From Phone Number) for sending text messages.
                </div>
              )}

              <div style={{ marginTop: '16px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Default SMS Message Template</label>
                <textarea 
                  value={config.smsMessageTemplate || ''} 
                  onChange={(e) => setConfig({ ...config, smsMessageTemplate: e.target.value })}
                  placeholder="Hello {{lead.name}}, please review the custom landing page designed for your business: {{previewUrl}} - {{signature}}"
                  rows={3}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '6px', color: '#fff', outline: 'none', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical' }}
                />
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                </div>
              </div>
            </div>

            {/* Section E: Supabase DB Store (Optional) */}
            {config.storageMode === 'supabase' && (
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: '#fff' }}>5. Supabase Configuration</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Supabase URL</label>
                    <input 
                      type="text" 
                      value={config.supabaseUrl || ''} 
                      onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
                      placeholder="https://yourproject.supabase.co"
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Supabase Service Key</label>
                    <input 
                      type="password" 
                      value={config.supabaseKey || ''} 
                      onChange={(e) => setConfig({ ...config, supabaseKey: e.target.value })}
                      placeholder="Service role key for server bypass"
                      style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section F: n8n Integration */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: '#fff' }}>5. n8n Automation Webhook</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Global n8n Webhook URL</label>
                  <input 
                    type="url" 
                    value={config.n8nWebhookUrl || ''} 
                    onChange={(e) => setConfig({ ...config, n8nWebhookUrl: e.target.value })}
                    placeholder="https://primary-n8n.yourdomain.com/webhook/..."
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Websites configured in "Direct n8n automation webhook redirection" turnout mode will post client contact submissions here.
                  </div>
                </div>
              </div>
            </div>

            {/* Section G: Jiji Bulk Messaging Outreach */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '16px', fontWeight: 600, color: '#fff' }}>6. Jiji Bulk Messaging Outreach</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Email or Phone</label>
                  <input 
                    type="text" 
                    value={config.jijiEmail || ''} 
                    onChange={(e) => setConfig({ ...config, jijiEmail: e.target.value })}
                    placeholder="e.g. jijiuser@email.com"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Password</label>
                  <input 
                    type="password" 
                    value={config.jijiPassword || ''} 
                    onChange={(e) => setConfig({ ...config, jijiPassword: e.target.value })}
                    placeholder="Jiji Password"
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Jiji Message Template</label>
                  <textarea 
                    value={config.jijiMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, jijiMessageTemplate: e.target.value })}
                    placeholder="Hello {{lead.name}}, I saw your Jiji listing and built a preview site for you: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Instagram Message Template</label>
                  <textarea 
                    value={config.instagramMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, instagramMessageTemplate: e.target.value })}
                    placeholder="Hi {{lead.name}}, I found your e-commerce store on Instagram and built a preview website: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Facebook Message Template</label>
                  <textarea 
                    value={config.facebookMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, facebookMessageTemplate: e.target.value })}
                    placeholder="Hello {{lead.name}}, I saw your shop page on Facebook and made a personalized web storefront preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>TikTok Message Template</label>
                  <textarea 
                    value={config.tiktokMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, tiktokMessageTemplate: e.target.value })}
                    placeholder="Hey {{lead.name}}, I checked out your shop videos on TikTok and created a custom web store preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '16px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>LinkedIn Message Template</label>
                  <textarea 
                    value={config.linkedinMessageTemplate || ''} 
                    onChange={(e) => setConfig({ ...config, linkedinMessageTemplate: e.target.value })}
                    placeholder="Hi {{lead.name}}, I noticed your professional profile on LinkedIn and created a custom web store preview: {{previewUrl}}"
                    rows={3}
                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Supported placeholders: <code>{`{{lead.name}}`}</code>, <code>{`{{lead.rating}}`}</code>, <code>{`{{lead.reviews_count}}`}</code>, <code>{`{{previewUrl}}`}</code>, <code>{`{{signature}}`}</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={config.dryRun} 
                  onChange={(e) => setConfig({ ...config, dryRun: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 500 }}>Enable Dry Run Simulation Mode (Do not send real APIs)</span>
              </label>

              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', fontWeight: 600 }}>
                Save Configuration Settings
              </button>
            </div>
          </form>
        )}

      </main>
    </div>
  );
}
