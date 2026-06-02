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
  AlertTriangle, 
  Info,
  MapPin,
  ExternalLink,
  Sliders,
  DollarSign,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  Flame,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LocalConfig } from '@/lib/localConfig';
import { Lead } from '@/lib/googleSheets';

type Tab = 'dashboard' | 'crm' | 'scrapers' | 'settings' | 'logs';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [config, setConfig] = useState<LocalConfig>({
    googleSpreadsheetId: '',
    apifyToken: '',
    apifyDatasetId: '',
    googlePlacesApiKey: '',
    whatsappPhoneNumberId: '',
    whatsappAccessToken: '',
    whatsappTemplateName: 'lead_outreach_1',
    whatsappTemplateLanguageCode: 'en_US',
    whatsappDailyCap: 50,
    whatsappEnabled: false,
    dryRun: true,
    businessSignature: 'Bethelmind Analytics'
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
    highRatingLeads: 0,
    noReviewLeads: 0,
  });
  const [logs, setLogs] = useState<any[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  
  // Scraper Forms
  const [gMapsQuery, setGMapsQuery] = useState('Car Dealers Lagos');
  const [gMapsLimit, setGMapsLimit] = useState(10);
  const [jijiUrl, setJijiUrl] = useState('https://jiji.ng/lagos/cars');
  const [jijiLimit, setJijiLimit] = useState(5);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
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

  useEffect(() => {
    fetchConfig();
    fetchStats();
    fetchLeads();
    fetchLogs();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoadingConfig(true);
      const resp = await fetch('/api/config');
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingConfig(false);
    }
  };

  const saveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setStatusMessage('Saving settings...');
      const resp = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      const data = await resp.json();
      if (data && !data.error) {
        setConfig(data);
        setStatusMessage('Settings saved successfully!');
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
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

  // Run Scraper Actions
  const runGMapsScraper = async () => {
    try {
      setScraping(true);
      setStatusMessage(`Scraping Google Maps for "${gMapsQuery}"...`);
      const resp = await fetch(`/api/scrape/maps?query=${encodeURIComponent(gMapsQuery)}&limit=${gMapsLimit}`);
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage(`Successfully imported ${data.added} new B2B leads. Skipped ${data.skipped} duplicates.`);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        handleRefreshAll();
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setScraping(false);
    }
  };

  const runJijiScraper = async () => {
    try {
      setScraping(true);
      setStatusMessage(`Running Playwright browser crawling on Jiji category URL...`);
      const resp = await fetch(`/api/scrape/jiji?url=${encodeURIComponent(jijiUrl)}&limit=${jijiLimit}`);
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage(`Successfully extracted contact details. Imported ${data.added} new Jiji leads. Skipped ${data.skipped} duplicates.`);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        handleRefreshAll();
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setScraping(false);
    }
  };

  const runApifyImport = async () => {
    try {
      setScraping(true);
      setStatusMessage(`Importing from Apify dataset ID: ${config.apifyDatasetId}...`);
      const resp = await fetch(`/api/apify`);
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Error: ${data.error}`);
      } else {
        setStatusMessage(`Apify import completed! Imported ${data.added} new leads. Skipped ${data.skipped} duplicates.`);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        handleRefreshAll();
      }
    } catch (e: any) {
      setStatusMessage(`Error: ${e.message}`);
    } finally {
      setScraping(false);
    }
  };

  // Run Outreach campaigns
  const runOutreach = async () => {
    if (selectedLeads.size === 0) {
      alert("Please select at least one lead from the table to enroll.");
      return;
    }
    
    try {
      setSendingOutreach(true);
      setStatusMessage(`Sending B2B WhatsApp campaign to ${selectedLeads.size} selected leads...`);
      
      const resp = await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: Array.from(selectedLeads)
        })
      });
      
      const data = await resp.json();
      if (data.error) {
        setStatusMessage(`Outreach failed: ${data.error}`);
      } else {
        setStatusMessage(`Outreach campaign completed successfully! Reviewed: ${data.results.length}`);
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

  // Lead selection helpers
  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedLeads);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedLeads(next);
  };

  const toggleSelectAll = (filteredLeads: Lead[]) => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(l => l.lead_id)));
    }
  };

  // Filters logic
  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.phone_e164.includes(searchTerm);
    const matchesSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

  // Apollo Message Template Builder Mock
  const renderTemplatePreview = (lead: Lead | null) => {
    if (!lead) return 'Select a lead to see custom outreach message variables';
    
    return `Hello ${lead.name || 'Business Owner'},

We saw your business listed under the "${lead.category || 'B2B Services'}" category in ${lead.area || 'Lagos'}.

Your profile description matches the exact target profiles we provide dedicated marketing pipelines for:
"${lead.business_summary || 'Local business expansion details'}"

Let's discuss how we can double your lead flows.

Best regards,
${config.businessSignature}`;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar navigation */}
      <aside style={{ width: '260px', borderRight: '1px solid var(--panel-border)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '30px' }} className="glass-panel">
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            <Database size={24} /> ApexReach
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>B2B Lead Engine</span>
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
            <Compass size={18} color={activeTab === 'scrapers' ? 'var(--primary)' : 'var(--text-secondary)'} /> Scraping Options
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
        
        {/* Dynamic bottom status */}
        <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.googleSpreadsheetId ? 'var(--success)' : 'var(--error)' }}></span>
            Sheets API: {config.googleSpreadsheetId ? 'Ready' : 'Setup Required'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.dryRun ? 'var(--warning)' : 'var(--primary)' }}></span>
            Campaign Mode: {config.dryRun ? 'Dry Run' : 'Production'}
          </div>
        </div>
      </aside>
      
      {/* Main page content area */}
      <main style={{ flexGrow: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Top greeting dashboard header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-title)', fontWeight: 800, textTransform: 'capitalize' }}>
              B2B Lead Outreach Sequencer
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Connected to sheet database: <span style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{config.googleSpreadsheetId || 'None'}</span>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleRefreshAll} disabled={loadingLeads} className="btn-secondary">
              <RefreshCw size={16} className={loadingLeads ? 'spin-anim' : ''} /> Sync Database
            </button>
          </div>
        </header>

        {/* Global Action Banner */}
        {statusMessage && (
          <div className="glass-panel" style={{ padding: '12px 18px', borderLeft: '4px solid var(--primary)', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '10px' }}>
            <Info size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{statusMessage}</span>
            <button onClick={() => setStatusMessage('')} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>×</button>
          </div>
        )}

        {/* TAB 1: DASHBOARD CONSOLE */}
        {activeTab === 'dashboard' && (
          <>
            {/* KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Total Extracted</span>
                <h3 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--text-primary)' }}>{stats.totalLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Active Leads in Sheet Pipeline
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Ready to Contact</span>
                <h3 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--primary)' }}>{stats.newLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Status = NEW (Opted-in)
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Enrolled & Contacted</span>
                <h3 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--success)' }}>{stats.contactedLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  WhatsApp Dispatch Succeeded
                </div>
              </div>
              
              <div className="glass-panel" style={{ padding: '20px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>Safe List (DNC / Opt-Outs)</span>
                <h3 style={{ fontSize: '2rem', marginTop: '10px', color: 'var(--warning)' }}>{stats.dncLeads}</h3>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', marginTop: '12px', paddingTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Protected by compliance rules
                </div>
              </div>
            </div>

            {/* Split layout: Quick actions + logs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Quick campaign startup */}
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Flame size={20} color="var(--primary)" /> Launch Outreach Campaign</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Quickly enroll all pending leads into the WhatsApp Outreach pipeline. This checks active DNC exclusions and cleans inputs.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Pending B2B Leads:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{stats.newLeads} leads</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Active Template:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{config.whatsappTemplateName} ({config.whatsappTemplateLanguageCode})</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span>Mode status:</span>
                    <span style={{ color: config.dryRun ? 'var(--warning)' : 'var(--error)', fontWeight: 600 }}>
                      {config.dryRun ? 'SIMULATION (Dry Run)' : 'LIVE OUTREACH DISPATCH'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button 
                    onClick={async () => {
                      if (stats.newLeads === 0) {
                        alert("No new leads found to enroll.");
                        return;
                      }
                      const newLeadIds = leads.filter(l => l.status === 'NEW').map(l => l.lead_id);
                      setSelectedLeads(new Set(newLeadIds));
                      setActiveTab('crm');
                    }}
                    className="btn-primary" 
                    style={{ flexGrow: 1, justifyItems: 'center', justifyContent: 'center' }}
                  >
                    View & Filter Leads <ArrowRight size={16} />
                  </button>
                </div>
              </section>

              {/* Real-time system log stream */}
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} color="var(--success)" /> Live Synchronization Stream</h3>
                <div style={{ height: '240px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {loadingLogs && <div style={{ color: 'var(--text-secondary)' }}>Streaming recent database audit logs...</div>}
                  {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No recent sheet logs found.</div>}
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

        {/* TAB 2: LEADS CRM TABLE */}
        {activeTab === 'crm' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Filter Bar */}
            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexGrow: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '6px 12px', alignItems: 'center', gap: '8px' }}>
                <Search size={16} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Search leads by name, phone, category..."
                  style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <select 
                  value={sourceFilter} 
                  onChange={(e) => setSourceFilter(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Sources</option>
                  <option value="GOOGLE">Google Maps</option>
                  <option value="JIJI">Jiji Scrapers</option>
                </select>

                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '8px 12px', outline: 'none' }}
                >
                  <option value="ALL">All Lifecycle Stages</option>
                  <option value="NEW">NEW (Uncontacted)</option>
                  <option value="CONTACTED">CONTACTED (Enrolled)</option>
                  <option value="DO_NOT_CONTACT">DO_NOT_CONTACT (DNC)</option>
                  <option value="ERROR">ERROR</option>
                </select>
              </div>
            </div>

            {/* Split CRM panel: Table + Apollo variable previewer */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
              
              {/* Leads Table Container */}
              <div className="glass-panel" style={{ overflowX: 'auto', minHeight: '400px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Leads Directory ({filteredLeads.length} matching)</h3>
                  {selectedLeads.size > 0 && (
                    <button 
                      onClick={runOutreach} 
                      disabled={sendingOutreach} 
                      className="btn-primary" 
                      style={{ fontSize: '0.85rem', padding: '8px 16px' }}
                    >
                      <Send size={14} /> Send WhatsApp Outreach ({selectedLeads.size})
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
                      <th style={{ padding: '14px' }}>Phone Number</th>
                      <th style={{ padding: '14px' }}>Rating</th>
                      <th style={{ padding: '14px' }}>Stage</th>
                      <th style={{ padding: '14px 20px' }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingLeads && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                          Retrieving lead directory from Google Sheets...
                        </td>
                      </tr>
                    )}
                    {!loadingLeads && filteredLeads.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                          No leads found in CRM database matching current filters.
                        </td>
                      </tr>
                    )}
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.lead_id} 
                        onClick={() => setPreviewLead(lead)}
                        className={previewLead?.lead_id === lead.lead_id ? 'active-row' : ''}
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
                        <td style={{ padding: '14px', fontFamily: 'monospace' }}>{lead.phone_e164}</td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ color: 'var(--warning)', fontWeight: 600 }}>★ {lead.rating ? lead.rating.toFixed(1) : 'N/A'}</span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '4px' }}>({lead.reviews_count})</span>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${lead.status === 'NEW' ? 'badge-new' : lead.status === 'CONTACTED' ? 'badge-contacted' : lead.status === 'DO_NOT_CONTACT' ? 'badge-dnc' : 'badge-error'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          {lead.profile_url && (
                            <a href={lead.profile_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none' }}>
                              Link <ExternalLink size={12} />
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Apollo Outreach Template Variable Previewer Panel */}
              <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
                  <UserCheck size={18} color="var(--primary)" /> Apollo Outreach Variable Builder
                </h3>

                {previewLead ? (
                  <>
                    <div style={{ fontSize: '0.85rem' }}>
                      <div style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-secondary)' }}>Active Lead Name:</strong> {previewLead.name}</div>
                      <div style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-secondary)' }}>Extracted Industry:</strong> {previewLead.category}</div>
                      <div style={{ marginBottom: '8px' }}><strong style={{ color: 'var(--text-secondary)' }}>Region Target:</strong> {previewLead.area || 'Lagos'}</div>
                    </div>
                    
                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', padding: '14px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '200px' }}>
                      {renderTemplatePreview(previewLead)}
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Info size={12} /> Outreach sequences automatically inject lead properties into standard templates to avoid WhatsApp spam triggers.
                    </div>
                  </>
                ) : (
                  <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                    Select a lead row from the CRM directory to preview automated template generation variables.
                  </div>
                )}
              </section>

            </div>
          </div>
        )}

        {/* TAB 3: SCRAPERS CONSOLE */}
        {activeTab === 'scrapers' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* OPTION 1: Apify Dataset Importer */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Option 1: Apify Ingest</h3>
                <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>API Automated</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Ingest lead data directly from completed Apify Actors (like Google Maps Scraper or Jiji Scraper datasets).
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Apify Dataset ID</label>
                  <input 
                    type="text" 
                    value={config.apifyDatasetId} 
                    onChange={(e) => setConfig({ ...config, apifyDatasetId: e.target.value })}
                    placeholder="Enter Apify Dataset ID"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              
              <button 
                onClick={runApifyImport} 
                disabled={scraping || !config.apifyToken || !config.apifyDatasetId} 
                className="btn-primary" 
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                <Compass size={16} /> Import Dataset Leads
              </button>
            </div>

            {/* OPTION 2: Google Maps Places API Scraper */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Option 2: Google Maps Search</h3>
                <span className="badge badge-new" style={{ fontSize: '0.7rem' }}>API Automated</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Leverage Google Places API to search for specific industries in any location and extract verified coordinates and phone listings.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Search Query</label>
                  <input 
                    type="text" 
                    value={gMapsQuery} 
                    onChange={(e) => setGMapsQuery(e.target.value)}
                    placeholder="e.g. Real Estate Lagos"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Limit Results</label>
                  <input 
                    type="number" 
                    value={gMapsLimit} 
                    onChange={(e) => setGMapsLimit(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              
              <button 
                onClick={runGMapsScraper} 
                disabled={scraping || !config.googlePlacesApiKey} 
                className="btn-primary" 
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                <Search size={16} /> Execute Places Scrape
              </button>
            </div>

            {/* OPTION 3: Playwright headless Jiji Scraper */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Option 3: Local Playwright Crawler</h3>
                <span className="badge badge-contacted" style={{ fontSize: '0.7rem' }}>Local Headless Shell</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Execute a local headless browser crawler to search Jiji.ng. This launches an automated browser that clicks Jiji contact buttons.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Jiji Category URL</label>
                  <input 
                    type="text" 
                    value={jijiUrl} 
                    onChange={(e) => setJijiUrl(e.target.value)}
                    placeholder="https://jiji.ng/lagos/cars"
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Max Listings</label>
                  <input 
                    type="number" 
                    value={jijiLimit} 
                    onChange={(e) => setJijiLimit(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              
              <button 
                onClick={runJijiScraper} 
                disabled={scraping} 
                className="btn-primary" 
                style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
              >
                <Compass size={16} /> Launch Playwright Scraper
              </button>
            </div>

            {/* OPTION 4: No-Code Visual Browser Scraper */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Option 4: Visual Extension Scraper</h3>
                <span className="badge badge-dnc" style={{ fontSize: '0.7rem' }}>No-Code Manual</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Import visual sitemaps into the free Web Scraper browser extension for full visual manual scraping. Perfect for zero-budget setup.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span>Visual Sitemap Config:</span>
                  <a href="/web_scraper_sitemaps.json" download style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                    Download web_scraper_sitemaps.json <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Download the JSON sitemap, import it into the Web Scraper Chrome extension, extract target leads to CSV, and paste directly into Google Sheets!
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: SYNC LOGS TIMELINE */}
        {activeTab === 'logs' && (
          <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>System Audit Logs</h3>
              <button onClick={fetchLogs} disabled={loadingLogs} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                Refresh Logs
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '400px' }}>
              {loadingLogs && <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '40px' }}>Streaming sync logs...</div>}
              {!loadingLogs && logs.length === 0 && <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No system logs found in the Google Sheet.</div>}
              
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

        {/* TAB 5: SYSTEM SETTINGS CONFIG */}
        {activeTab === 'settings' && (
          <form onSubmit={saveConfig} className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px' }}>System Variables Panel</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Google Spreadsheet ID</label>
                <input 
                  type="text" 
                  value={config.googleSpreadsheetId} 
                  onChange={(e) => setConfig({ ...config, googleSpreadsheetId: e.target.value })}
                  placeholder="Paste Spreadsheet ID"
                  required
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Google Places API Key</label>
                <input 
                  type="password" 
                  value={config.googlePlacesApiKey} 
                  onChange={(e) => setConfig({ ...config, googlePlacesApiKey: e.target.value })}
                  placeholder="Paste Google Maps API Key"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Apify Personal API Token</label>
                <input 
                  type="password" 
                  value={config.apifyToken} 
                  onChange={(e) => setConfig({ ...config, apifyToken: e.target.value })}
                  placeholder="Paste Apify token"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>WhatsApp Phone Number ID</label>
                <input 
                  type="text" 
                  value={config.whatsappPhoneNumberId} 
                  onChange={(e) => setConfig({ ...config, whatsappPhoneNumberId: e.target.value })}
                  placeholder="Enter Phone Number ID"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>WhatsApp Access Token</label>
                <input 
                  type="password" 
                  value={config.whatsappAccessToken} 
                  onChange={(e) => setConfig({ ...config, whatsappAccessToken: e.target.value })}
                  placeholder="Enter WhatsApp System Token"
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>WhatsApp Outreach Template Name</label>
                <input 
                  type="text" 
                  value={config.whatsappTemplateName} 
                  onChange={(e) => setConfig({ ...config, whatsappTemplateName: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>WhatsApp Template Language Code</label>
                <input 
                  type="text" 
                  value={config.whatsappTemplateLanguageCode} 
                  onChange={(e) => setConfig({ ...config, whatsappTemplateLanguageCode: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Outreach Signature</label>
                <input 
                  type="text" 
                  value={config.businessSignature} 
                  onChange={(e) => setConfig({ ...config, businessSignature: e.target.value })}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', background: 'rgba(0,0,0,0.1)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input 
                  type="checkbox" 
                  checked={config.dryRun} 
                  onChange={(e) => setConfig({ ...config, dryRun: e.target.checked })}
                  style={{ cursor: 'pointer' }}
                />
                Enable Dry Run Simulation Mode (WhatsApp safe-mode)
              </label>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }}>
              Save Configuration Settings
            </button>
          </form>
        )}

      </main>
    </div>
  );
}
