'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  UserCheck, 
  Clock, 
  ShieldAlert, 
  Filter, 
  Check, 
  Copy, 
  Settings,
  Building,
  Home,
  MessageCircle,
  Database,
  Zap
} from 'lucide-react';

interface SolarLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  running_load_w?: number;
  kva_recommended?: string;
  monthly_savings_ngn?: number;
  monthly_fuel_spend?: number;
  city_disco?: string;
  estimated_system_size?: string;
  project_scope?: string;
  contact_person?: string;
  status: string;
  notes: string;
  created_at: string;
  type: 'homeowner' | 'enterprise';
}

export default function SolarPipelineDashboard() {
  const [leads, setLeads] = useState<SolarLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<SolarLead | null>(null);
  
  // Outreach Modal states
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [outreachChannel, setOutreachChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [customSubject, setCustomSubject] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState('');
  const [outreachError, setOutreachError] = useState('');

  // Status edit notes
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [updatingLead, setUpdatingLead] = useState(false);

  // Copy indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Harvesting state
  const [harvesting, setHarvesting] = useState(false);
  const [scrapingDryRun, setScrapingDryRun] = useState(false);
  const [generatingSynthetic, setGeneratingSynthetic] = useState(false);
  const [scrapingLiveSolar, setScrapingLiveSolar] = useState(false);

  // Active Job states
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const [pollingActive, setPollingActive] = useState(false);
  const logEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchLeads();
    checkActiveJobs();
  }, []);

  const checkActiveJobs = async () => {
    try {
      const res = await fetch('/api/admin/solar-pipeline?activeCheck=true');
      const data = await res.json();
      if (res.ok && data.success && data.active) {
        setActiveJobId(data.jobId);
        setJobStatus(data.status);
        setJobLogs(data.logs || []);
        setPollingActive(true);

        const mode = data.payload?.mode;
        if (mode === 'dry-run') setScrapingDryRun(true);
        else if (mode === 'synthetic') setGeneratingSynthetic(true);
        else if (mode === 'live-solar') setScrapingLiveSolar(true);
      }
    } catch (err) {
      console.error('Error recovering active scraper jobs:', err);
    }
  };

  // SSE streaming listener for active jobs — replaces the setInterval polling loop
  useEffect(() => {
    if (!pollingActive || !activeJobId) return;

    const streamUrl = `/api/logs/stream?jobIds=${activeJobId}`;
    const es = new EventSource(streamUrl);

    es.addEventListener('status', (e: MessageEvent) => {
      try {
        const { status, error } = JSON.parse(e.data);
        setJobStatus(status);

        if (status === 'completed' || status === 'failed') {
          setPollingActive(false);
          setActiveJobId(null);
          setScrapingDryRun(false);
          setGeneratingSynthetic(false);
          setScrapingLiveSolar(false);

          fetchLeads(true);

          if (status === 'completed') {
            alert('Scraper completed successfully');
          } else {
            alert(`Scraper failed: ${error || 'Unknown error'}`);
          }
        }
      } catch (_) {}
    });

    es.addEventListener('log', (e: MessageEvent) => {
      try {
        const newLines: any[] = JSON.parse(e.data);
        if (newLines.length > 0) {
          // Convert array rows to log objects the template already knows about
          const mapped = newLines.map(row => ({
            run_id: row[0],
            timestamp: row[1],
            step: row[2],
            status: row[4],
            message: row[5],
          }));
          setJobLogs(prev => [...prev, ...mapped]);
        }
      } catch (_) {}
    });

    es.addEventListener('done', () => {
      es.close();
    });

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, [pollingActive, activeJobId]);


  // Monospace Terminal Auto Scroll Effect
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [jobLogs]);

  // Progress Percent calculation helper
  const getProgressPercentage = () => {
    if (jobStatus === 'completed') return 100;
    if (jobStatus === 'failed') return 100;
    for (let i = jobLogs.length - 1; i >= 0; i--) {
      const msg = jobLogs[i].message || '';
      const match = msg.match(/(Homeowner|Commercial) syncing progress:\s*(\d+)\/(\d+)/i);
      if (match) {
        const current = parseInt(match[2], 10);
        const total = parseInt(match[3], 10);
        if (total > 0) return Math.min(100, Math.round((current / total) * 100));
      }
    }
    return null;
  };

  const handleTriggerScrape = async (mode: 'dry-run' | 'synthetic' | 'live-solar') => {
    if (mode === 'dry-run') setScrapingDryRun(true);
    else if (mode === 'synthetic') setGeneratingSynthetic(true);
    else setScrapingLiveSolar(true);

    setJobStatus('running');
    setJobLogs([]);
    setActiveJobId(null);
    setPollingActive(false);

    try {
      const res = await fetch('/api/admin/solar-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scrape',
          mode,
          count: mode === 'synthetic' ? 1000 : undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveJobId(data.jobId);
        setPollingActive(true);
      } else {
        alert(`Error starting scraper: ${data.error || 'Failed to trigger scraper'}`);
        if (mode === 'dry-run') setScrapingDryRun(false);
        else if (mode === 'synthetic') setGeneratingSynthetic(false);
        else setScrapingLiveSolar(false);
      }
    } catch (err: any) {
      alert(`Network error triggering scraper: ${err.message}`);
      if (mode === 'dry-run') setScrapingDryRun(false);
      else if (mode === 'synthetic') setGeneratingSynthetic(false);
      else setScrapingLiveSolar(false);
    }
  };

  const handleHarvestLeads = async () => {
    setHarvesting(true);
    try {
      const res = await fetch('/api/admin/solar-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || 'Leads harvested successfully!');
        await fetchLeads();
      } else {
        alert(data.error || 'Failed to harvest solar leads.');
      }
    } catch (err) {
      alert('Network error harvesting solar leads.');
    } finally {
      setHarvesting(false);
    }
  };

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch('/api/admin/solar-pipeline');
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(data.leads);
        if (data.leads.length > 0) {
          // Keep selection if it already exists, otherwise pick first
          setSelectedLead(prev => {
            const found = data.leads.find((l: SolarLead) => l.id === prev?.id);
            return found || data.leads[0];
          });
        }
      } else {
        console.error('Failed to fetch leads:', data.error);
      }
    } catch (err) {
      console.error('Network error fetching solar leads:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead) return;
    setUpdatingLead(true);
    try {
      const res = await fetch('/api/admin/solar-pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedLead.id,
          type: selectedLead.type,
          status: editStatus,
          notes: editNotes
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local list
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: editStatus, notes: editNotes, project_scope: selectedLead.type === 'enterprise' ? editNotes : undefined } : l));
        setSelectedLead(prev => prev ? { ...prev, status: editStatus, notes: editNotes } : null);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Network error updating status');
    } finally {
      setUpdatingLead(false);
    }
  };

  const handleSendOutreach = async () => {
    if (!selectedLead) return;
    setOutreachLoading(true);
    setOutreachMessage('');
    setOutreachError('');

    try {
      const res = await fetch('/api/admin/solar-pipeline/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          type: selectedLead.type,
          channel: outreachChannel,
          customMessage: customMessage || undefined,
          customSubject: outreachChannel === 'email' ? (customSubject || undefined) : undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOutreachMessage(data.message || 'Outreach sent successfully!');
        // Refresh leads to get new notes/status
        await fetchLeads(true);
        setTimeout(() => {
          setOutreachModalOpen(false);
          setOutreachMessage('');
        }, 2000);
      } else {
        setOutreachError(data.error || 'Failed to trigger outreach. Check channel settings.');
      }
    } catch (err) {
      setOutreachError('Network failure sending message.');
    } finally {
      setOutreachLoading(false);
    }
  };

  // Sync edit fields when selection changes
  useEffect(() => {
    if (selectedLead) {
      setEditStatus(selectedLead.status);
      setEditNotes(selectedLead.notes || selectedLead.project_scope || '');
      
      // Pre-fill default templates based on channel
      const defaultTemplates = {
        whatsapp: `Hi ${selectedLead.name},\n\nWe prepared a custom residential solar proposal for your property. View details: {{previewUrl}}\n\nBest regards,\nBethelmind Analytics`,
        sms: `Hello ${selectedLead.name}, your custom solar estimate is ready. View at: {{previewUrl}}`,
        email: `Hello ${selectedLead.name},\n\nThank you for reaching out regarding a custom solar installation. We have prepared your design recommendation with ROI savings projection.\n\nView complete proposal here: {{previewUrl}}\n\nWarm regards,\nBethelmind Analytics`
      };
      setCustomMessage(defaultTemplates[outreachChannel]);
      setCustomSubject(selectedLead.type === 'enterprise' ? 'Commercial Solar ROI Proposal' : 'Home Solar Power Quote');
    }
  }, [selectedLead, outreachChannel]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'contacted':
        return 'status-contacted';
      case 'converted':
      case 'qualified':
      case 'won':
        return 'status-won';
      case 'lost':
        return 'status-lost';
      default:
        return 'status-new';
    }
  };

  // Filter computation
  const filteredLeads = leads.filter(lead => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(query) ||
      lead.phone.includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.location.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || lead.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="solar-pipeline-container">
      {/* Header Bento Card */}
      <div className="bento-card header-card glass-panel">
        <div className="header-content">
          <div className="brand-badge-row">
            <Sun className="sun-icon spin-slow" />
            <span className="badge">Specialise Solar Pipeline</span>
          </div>
          <h1>SolarQuotePro Production Gateway</h1>
          <p>
            Real-time synchronization of residential (B2C) homeowner estimator funnels and commercial (B2B) enterprise lead requests. Launch outreach and update lead records instantly.
          </p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleTriggerScrape('dry-run')} 
            disabled={scrapingDryRun || generatingSynthetic || harvesting}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <Search className={scrapingDryRun ? 'spin-anim' : ''} size={16} />
            {scrapingDryRun ? 'Scraping...' : 'Scrape (Dry Run)'}
          </button>

          <button 
            onClick={() => handleTriggerScrape('synthetic')} 
            disabled={scrapingDryRun || generatingSynthetic || scrapingLiveSolar || harvesting}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'var(--panel-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <Database className={generatingSynthetic ? 'spin-anim' : ''} size={16} />
            {generatingSynthetic ? 'Generating...' : 'Generate 1K Synthetic'}
          </button>

          <button 
            onClick={() => handleTriggerScrape('live-solar')} 
            disabled={scrapingDryRun || generatingSynthetic || scrapingLiveSolar || harvesting}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'linear-gradient(135deg, #FF9900 0%, #FF5E00 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              color: '#FFFFFF',
              fontWeight: '600'
            }}
          >
            <Zap className={scrapingLiveSolar ? 'spin-anim' : ''} size={16} />
            {scrapingLiveSolar ? 'Scraping Live...' : 'Scrape Solar Companies'}
          </button>

          <button 
            onClick={handleHarvestLeads} 
            disabled={scrapingDryRun || generatingSynthetic || scrapingLiveSolar || harvesting}
            className="btn-secondary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'var(--toggle-bg)',
              border: '1px solid var(--panel-border)',
              borderRadius: '8px',
              padding: '10px 16px',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
          >
            <Building className={harvesting ? 'spin-anim' : ''} size={16} />
            {harvesting ? 'Harvesting...' : 'Harvest Scraped Solar Leads'}
          </button>

          <button 
            onClick={() => fetchLeads(true)} 
            disabled={refreshing}
            className="btn-primary refresh-btn"
          >
            <RefreshCw className={refreshing ? 'spin-anim' : ''} />
            {refreshing ? 'Syncing...' : 'Sync Database'}
          </button>
        </div>
      </div>

      {/* Live Scraper Progress Monitor */}
      {(jobStatus === 'running' || jobStatus === 'queued' || (jobLogs && jobLogs.length > 0)) && (
        <div className="bento-card progress-monitor-card glass-panel" style={{
          background: 'linear-gradient(135deg, rgba(8, 14, 24, 0.95) 0%, rgba(4, 8, 14, 0.9) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.15)',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={`status-dot ${jobStatus === 'running' ? 'pulse-green' : ''}`} style={{
                height: '10px',
                width: '10px',
                borderRadius: '50%',
                background: jobStatus === 'running' ? '#10b981' : jobStatus === 'completed' ? '#10b981' : jobStatus === 'failed' ? '#ef4444' : '#3b82f6',
                boxShadow: jobStatus === 'running' ? '0 0 10px #10b981' : 'none'
              }} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>
                Scraper Run Tracking: <span style={{ color: '#06b6d4', textTransform: 'uppercase' }}>{jobStatus}</span>
              </h3>
            </div>
            {getProgressPercentage() !== null && (
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#10b981' }}>
                {getProgressPercentage()}% Synced
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '3px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              width: getProgressPercentage() !== null ? `${getProgressPercentage()}%` : '100%',
              height: '100%',
              background: getProgressPercentage() !== null 
                ? 'linear-gradient(90deg, #06b6d4 0%, #10b981 100%)' 
                : 'linear-gradient(90deg, #1e293b 0%, #06b6d4 50%, #1e293b 100%)',
              backgroundSize: getProgressPercentage() !== null ? 'auto' : '200% 100%',
              borderRadius: '3px',
              transition: 'width 0.4s ease-out',
              animation: getProgressPercentage() === null ? 'pulse-bar 2s linear infinite' : 'none'
            }} />
          </div>

          {/* Monospace terminal-style Log Monitor */}
          <div className="terminal-log-console" style={{
            background: '#020617',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            padding: '12px 16px',
            height: '160px',
            overflowY: 'auto',
            fontFamily: 'Consolas, Monaco, "Courier New", Courier, monospace',
            fontSize: '0.8rem',
            color: '#34d399',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.5)'
          }}>
            {jobLogs.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>Reading pipeline activity logs database...</div>
            ) : (
              jobLogs.map((log: any, idx: number) => {
                let color = '#34d399'; // default info
                if (log.status === 'ERROR') color = '#f87171'; // red for errors
                else if (log.status === 'SUCCESS') color = '#60a5fa'; // blue for success
                else if (log.status === 'START') color = '#fbbf24'; // amber for start
                
                return (
                  <div key={log.id || idx} style={{ color, display: 'flex', gap: '8px' }}>
                    <span style={{ color: '#64748b', userSelect: 'none' }}>
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span>{log.message}</span>
                  </div>
                );
              })
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      )}

      {/* Stats Summary Panel */}
      <div className="stats-row">
        <div className="stat-box glass-panel">
          <span className="label">Total Solar Leads</span>
          <span className="value">{leads.length}</span>
        </div>
        <div className="stat-box glass-panel">
          <span className="label">New / Inbox</span>
          <span className="value text-cyan">{leads.filter(l => l.status === 'new').length}</span>
        </div>
        <div className="stat-box glass-panel">
          <span className="label">Contacted / Engaged</span>
          <span className="value text-amber">{leads.filter(l => l.status === 'contacted').length}</span>
        </div>
        <div className="stat-box glass-panel">
          <span className="label">Converted Contracts</span>
          <span className="value text-green">{leads.filter(l => ['converted', 'won'].includes(l.status)).length}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="filters-bar glass-panel">
        <div className="search-wrapper">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search leads by name, email, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="select-filters">
          <div className="filter-group">
            <Filter className="icon" />
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Segments</option>
              <option value="homeowner">Residential B2C</option>
              <option value="enterprise">Commercial B2B</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Leads Table Card */}
        <div className="bento-card list-card glass-panel">
          <h2>Leads Stream ({filteredLeads.length})</h2>
          {loading ? (
            <div className="table-loader">
              <RefreshCw className="spin-anim big" />
              <span>Fetching secure records...</span>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="empty-state">
              <ShieldAlert className="empty-icon" />
              <p>No leads match your filter parameters.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Segment</th>
                    <th>Contact Details</th>
                    <th>Status</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id}
                      className={selectedLead?.id === lead.id ? 'selected-row' : ''}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td>
                        <div className="lead-name-cell">
                          <span className="lead-name">{lead.name}</span>
                          {lead.type === 'homeowner' ? (
                            <span className="type-badge homeowner">B2C</span>
                          ) : (
                            <span className="type-badge enterprise">B2B</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {lead.type === 'homeowner' ? (
                          <div className="segment-detail">
                            <Home className="detail-icon" />
                            <span>{lead.kva_recommended || 'Residential'}</span>
                          </div>
                        ) : (
                          <div className="segment-detail">
                            <Building className="detail-icon" />
                            <span>{lead.contact_person || 'Commercial'}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="contact-details-cell">
                          {lead.phone && <span className="detail"><Phone className="tiny-icon" /> {lead.phone}</span>}
                          {lead.email && <span className="detail"><Mail className="tiny-icon" /> {lead.email}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`status-chip ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td>
                        <span className="date-added">
                          {new Date(lead.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Selected Lead Details Sidebar */}
        {selectedLead && (
          <div className="bento-card details-card glass-panel">
            <div className="details-header">
              <div className="name-badge-row">
                <h2>{selectedLead.name}</h2>
                <span className={`status-chip ${getStatusColor(selectedLead.status)}`}>
                  {selectedLead.status}
                </span>
              </div>
              <p className="sub">ID: {selectedLead.id.substring(0, 8)}...</p>
            </div>

            <div className="details-body">
              {/* Quick Action bar */}
              <div className="action-buttons-row">
                <button 
                  onClick={() => setOutreachModalOpen(true)}
                  className="btn-primary action-btn"
                >
                  <MessageSquare /> Send Outreach Campaign
                </button>
              </div>

              {/* Data specifications based on segment */}
              <div className="specifications-box">
                <h3>Lead Information</h3>
                <div className="spec-grid">
                  <div className="spec-item">
                    <span className="label">Segment Type:</span>
                    <span className="val text-capitalize">{selectedLead.type === 'homeowner' ? 'B2C Homeowner' : 'B2B Enterprise'}</span>
                  </div>
                  {selectedLead.location && (
                    <div className="spec-item">
                      <span className="label"><MapPin className="tiny-icon inline" /> Location:</span>
                      <span className="val">{selectedLead.location}</span>
                    </div>
                  )}
                  {selectedLead.phone && (
                    <div className="spec-item">
                      <span className="label">Phone:</span>
                      <span className="val phone-val">
                        {selectedLead.phone}
                        <button className="copy-btn" onClick={() => copyToClipboard(selectedLead.phone, 'phone')}>
                          {copiedId === 'phone' ? <Check className="green-tick" /> : <Copy />}
                        </button>
                      </span>
                    </div>
                  )}
                  {selectedLead.email && (
                    <div className="spec-item">
                      <span className="label">Email:</span>
                      <span className="val email-val">
                        {selectedLead.email}
                        <button className="copy-btn" onClick={() => copyToClipboard(selectedLead.email, 'email')}>
                          {copiedId === 'email' ? <Check className="green-tick" /> : <Copy />}
                        </button>
                      </span>
                    </div>
                  )}

                  {selectedLead.type === 'homeowner' ? (
                    <>
                      <div className="spec-item">
                        <span className="label">Monthly Fuel Spend:</span>
                        <span className="val">₦{(selectedLead.monthly_fuel_spend || 0).toLocaleString()}</span>
                      </div>
                      <div className="spec-item">
                        <span className="label">Running Load (W):</span>
                        <span className="val">{selectedLead.running_load_w || 0} W</span>
                      </div>
                      <div className="spec-item">
                        <span className="label">Recommended Load:</span>
                        <span className="val text-cyan">{selectedLead.kva_recommended || 'N/A'}</span>
                      </div>
                      <div className="spec-item">
                        <span className="label">Monthly Savings Estimate:</span>
                        <span className="val text-green">₦{(selectedLead.monthly_savings_ngn || 0).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="spec-item">
                        <span className="label">Contact Person:</span>
                        <span className="val">{selectedLead.contact_person || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status Update / Sync Overrides Form */}
              <div className="status-update-box">
                <h3>Pipeline Status & Internal Notes</h3>
                <div className="form-group">
                  <label>Update Pipeline Stage</label>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="new">New Lead</option>
                    <option value="contacted">Contacted / Engaged</option>
                    <option value="converted">Converted / Won</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>CRM Ingestion Notes</label>
                  <textarea 
                    value={editNotes} 
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter customer call details, outreach updates or specific requirements..."
                    rows={4}
                  />
                </div>
                <button 
                  onClick={handleUpdateStatus}
                  disabled={updatingLead}
                  className="btn-secondary save-notes-btn"
                >
                  {updatingLead ? 'Syncing...' : 'Save & Sync to SolarQuotePro'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Outreach Campaign Modal */}
      {outreachModalOpen && selectedLead && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Launch Outbound Campaign</h2>
              <button className="close-btn" onClick={() => setOutreachModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="lead-target">Target recipient: <strong>{selectedLead.name}</strong> ({selectedLead.phone || selectedLead.email})</p>
              
              <div className="channel-tabs">
                <button 
                  onClick={() => setOutreachChannel('whatsapp')}
                  className={`channel-tab ${outreachChannel === 'whatsapp' ? 'active' : ''}`}
                >
                  <MessageCircle /> WhatsApp
                </button>
                <button 
                  onClick={() => setOutreachChannel('sms')}
                  className={`channel-tab ${outreachChannel === 'sms' ? 'active' : ''}`}
                >
                  <Phone /> Carrier SMS
                </button>
                <button 
                  onClick={() => setOutreachChannel('email')}
                  className={`channel-tab ${outreachChannel === 'email' ? 'active' : ''}`}
                >
                  <Mail /> Rich Email
                </button>
              </div>

              {outreachChannel === 'email' && (
                <div className="form-group">
                  <label>Subject Header</label>
                  <input 
                    type="text" 
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label>Outreach Message Template (Supports spintax and placeholders)</label>
                <textarea 
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={6}
                />
              </div>

              {outreachMessage && <div className="banner success">{outreachMessage}</div>}
              {outreachError && <div className="banner error">{outreachError}</div>}

              <div className="modal-footer">
                <button 
                  onClick={() => setOutreachModalOpen(false)}
                  className="btn-secondary"
                  disabled={outreachLoading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendOutreach}
                  className="btn-primary send-btn"
                  disabled={outreachLoading}
                >
                  {outreachLoading ? (
                    <>
                      <RefreshCw className="spin-anim" /> Sending Outreach...
                    </>
                  ) : (
                    <>
                      Trigger Outreach <Send />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .solar-pipeline-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .bento-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .header-card {
          background: linear-gradient(135deg, rgba(15, 22, 36, 0.8) 0%, rgba(10, 15, 26, 0.6) 100%);
          border-left: 4px solid var(--primary, #06b6d4);
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          max-width: 80%;
        }

        .brand-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .sun-icon {
          color: #f59e0b;
          width: 24px;
          height: 24px;
        }

        .badge {
          font-size: 0.75rem;
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .header-card h1 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(90deg, #fff 0%, #94a3b8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .header-card p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .pulse-green {
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        @keyframes pulse-bar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .stat-box {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .stat-box .label {
          color: #64748b;
          font-size: 0.75rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stat-box .value {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-title, 'Outfit', sans-serif);
        }

        .text-cyan { color: #06b6d4; }
        .text-amber { color: #f59e0b; }
        .text-green { color: #10b981; }

        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          gap: 20px;
        }

        .search-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 8px 16px;
          gap: 12px;
        }

        .search-icon {
          color: #64748b;
          width: 18px;
          height: 18px;
        }

        .search-wrapper input {
          background: transparent;
          border: none;
          color: #fff;
          outline: none;
          width: 100%;
          font-size: 0.9rem;
        }

        .select-filters {
          display: flex;
          gap: 16px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 8px 16px;
          gap: 8px;
        }

        .filter-group select {
          background: transparent;
          border: none;
          color: #94a3b8;
          outline: none;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .filter-group select option {
          background: #0f172a;
          color: #fff;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 24px;
        }

        .list-card h2, .details-card h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .table-loader {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 60px 0;
          color: #64748b;
        }

        .spin-anim {
          animation: spin 1s linear infinite;
        }

        .spin-anim.big {
          width: 32px;
          height: 32px;
          color: var(--primary, #06b6d4);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .leads-table th {
          text-align: left;
          padding: 12px 16px;
          color: #64748b;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .leads-table td {
          padding: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          cursor: pointer;
        }

        .leads-table tr {
          transition: background 0.2s;
        }

        .leads-table tr:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .leads-table tr.selected-row {
          background: rgba(6, 182, 212, 0.08);
          border-left: 2px solid var(--primary, #06b6d4);
        }

        .lead-name-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .lead-name {
          font-weight: 600;
          color: #fff;
        }

        .type-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 700;
        }

        .type-badge.homeowner {
          background: rgba(6, 182, 212, 0.15);
          color: #06b6d4;
        }

        .type-badge.enterprise {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .segment-detail {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
        }

        .detail-icon {
          width: 14px;
          height: 14px;
          color: #64748b;
        }

        .contact-details-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-details-cell .detail {
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tiny-icon {
          width: 12px;
          height: 12px;
          color: #64748b;
        }

        .status-chip {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 8px;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .status-new {
          background: rgba(59, 130, 246, 0.12);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .status-contacted {
          background: rgba(245, 158, 11, 0.12);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .status-won {
          background: rgba(16, 185, 129, 0.12);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-lost {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .date-added {
          color: #64748b;
        }

        /* Sidebar Details Panel */
        .details-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 16px;
          margin-bottom: 16px;
        }

        .name-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .details-header .sub {
          color: #64748b;
          font-size: 0.75rem;
        }

        .details-body {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .action-buttons-row {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 0.9rem;
        }

        .specifications-box, .status-update-box {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          padding: 16px;
        }

        .specifications-box h3, .status-update-box h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .spec-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.02);
          padding-bottom: 8px;
        }

        .spec-item:last-child {
          border: none;
          padding: 0;
        }

        .spec-item .label {
          color: #94a3b8;
        }

        .spec-item .val {
          color: #fff;
          font-weight: 500;
        }

        .phone-val, .email-val {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }

        .copy-btn:hover {
          color: #fff;
        }

        .green-tick {
          color: #10b981;
        }

        .status-update-box {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .status-select {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px;
          color: #fff;
          outline: none;
        }

        .status-select option {
          background: #0f172a;
        }

        .status-update-box textarea {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 10px;
          color: #fff;
          outline: none;
          resize: none;
          font-family: inherit;
          font-size: 0.85rem;
        }

        .save-notes-btn {
          margin-top: 6px;
          padding: 10px;
          justify-content: center;
        }

        /* Modal styling */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          width: 100%;
          max-width: 600px;
          border-radius: 16px;
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.5rem;
          font-weight: 700;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
        }

        .close-btn:hover {
          color: #fff;
        }

        .lead-target {
          font-size: 0.9rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .channel-tabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 8px;
        }

        .channel-tab {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          border-radius: 10px;
          padding: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .channel-tab:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
        }

        .channel-tab.active {
          color: #fff;
          background: rgba(6, 182, 212, 0.1);
          border-color: var(--primary, #06b6d4);
        }

        .banner {
          padding: 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          line-height: 1.4;
        }

        .banner.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .banner.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        .send-btn {
          gap: 8px;
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .header-content {
            max-width: 100%;
          }
          .filters-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
