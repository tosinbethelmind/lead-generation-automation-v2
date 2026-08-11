'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Sun,
  Building,
  Search,
  Filter,
  RefreshCw,
  Plus,
  Send,
  MessageCircle,
  Phone,
  Mail,
  Copy,
  Check,
  CheckCircle,
  Clock,
  ShieldAlert,
  Download,
  Terminal,
  Layers,
  Sparkles,
  Kanban,
  Table as TableIcon,
  X,
  UserCheck,
  Edit,
  Eye,
  Trash2,
  Globe
} from 'lucide-react';
import { PRE_SCRAPED_LEADS } from '@/lib/preScrapedLeads';
import AdminLeadRedesignStudio from '@/components/AdminLeadRedesignStudio';

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  city?: string;
  state?: string;
  contact_person?: string;
  project_scope?: string;
  status: string;
  notes?: string;
  created_at: string;
  type: 'homeowner' | 'enterprise' | 'nigeria_5k' | 'lagos_b2b' | 'ibadan_b2b' | 'lagos_10k' | 'ibadan_10k';
  engine: 'solar' | 'lagos' | 'ibadan';
  kva_recommended?: string;
  running_load_w?: number;
}

function detectLeadEngine(l: any): 'solar' | 'ibadan' | 'lagos' {
  if (l.engine === 'solar' || l.engine === 'ibadan' || l.engine === 'lagos') return l.engine;
  const id = (l.id || l.lead_id || '').toLowerCase();
  const cat = (l.category || '').toLowerCase();
  const seed = (l.source_query_or_seed || '').toLowerCase();
  const scope = (l.project_scope || l.business_summary || l.notes || '').toLowerCase();
  const name = (l.name || l.business_name || '').toLowerCase();
  const loc = `${l.city || ''} ${l.area || ''} ${l.location || ''} ${l.address || ''} ${seed}`.toLowerCase();

  if (
    id.startsWith('solar_') ||
    l.type === 'homeowner' ||
    l.type === 'enterprise' ||
    cat.includes('solar') ||
    cat.includes('inverter') ||
    seed.includes('solar') ||
    scope.includes('solar') ||
    name.includes('solar')
  ) {
    return 'solar';
  }

  if (
    id.startsWith('ibadan_') ||
    l.type === 'ibadan_10k' ||
    l.type === 'ibadan_b2b' ||
    seed.includes('ibadan') ||
    /ibadan|bodija|dugbe|ring road|challenge|mokola|agbowo|samonda|jericho|eleyele|oluyole|moniya|akobo|apata/i.test(loc)
  ) {
    return 'ibadan';
  }

  return 'lagos';
}

const INITIAL_SEEDED: LeadItem[] = (PRE_SCRAPED_LEADS || []).map((l: any, idx: number) => {
  const engine = detectLeadEngine(l);
  return {
    id: l.lead_id || l.id || `lead-${idx}`,
    name: l.business_name || l.name || 'Lagos Business Enterprise',
    phone: l.phone || l.phone_e164 || l.phone_raw || '',
    email: l.email || '',
    location: l.address ? l.address : `${l.city || 'Lagos'}, Nigeria`,
    city: l.city || (engine === 'ibadan' ? 'Ibadan' : 'Lagos'),
    state: l.district || l.area || l.city || 'Lagos',
    contact_person: l.contact_person || 'Commercial Director',
    project_scope: l.business_summary || l.category || 'B2B Enterprise Lead',
    status: (l.status || 'new').toLowerCase(),
    notes: l.notes || '',
    created_at: l.created_at || new Date().toISOString(),
    type: (l.type || 'nigeria_5k') as any,
    engine
  };
});

export default function AdminCrmDualEnginePage() {
  const [activeEngine, setActiveEngine] = useState<'all' | 'solar' | 'lagos' | 'ibadan'>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('table');
  const [leads, setLeads] = useState<LeadItem[]>(INITIAL_SEEDED);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(INITIAL_SEEDED[0] || null);

  // Scraper control states
  const [scrapingSolar, setScrapingSolar] = useState(false);
  const [scrapingLagos, setScrapingLagos] = useState(false);
  const [scrapingIbadan, setScrapingIbadan] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobLogs, setJobLogs] = useState<any[]>([]);
  const [pollingActive, setPollingActive] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Modals
  const [outreachModalOpen, setOutreachModalOpen] = useState(false);
  const [redesignModalOpen, setRedesignModalOpen] = useState(false);
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false);

  // Outreach form
  const [outreachChannel, setOutreachChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [customMessage, setCustomMessage] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [outreachSending, setOutreachSending] = useState(false);
  const [outreachNotice, setOutreachNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New lead form
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    city: 'Lagos',
    engine: 'solar' as 'solar' | 'lagos' | 'ibadan',
    type: 'enterprise' as 'homeowner' | 'enterprise' | 'lagos_b2b' | 'ibadan_b2b',
    notes: ''
  });
  const [addingLead, setAddingLead] = useState(false);

  // Bulk selection & notification states
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    try {
      // Fast single unified fetch from /api/admin/crm-leads (<100ms)
      const res = await fetch('/api/admin/crm-leads');
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (!selectedLead && data.leads.length > 0) {
          setSelectedLead(data.leads[0]);
        }
      }
    } catch (err) {
      console.error('Error loading CRM leads:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Trigger Scraper
  const handleTriggerScraper = async (engine: 'solar' | 'lagos' | 'ibadan') => {
    if (engine === 'solar') setScrapingSolar(true);
    else if (engine === 'lagos') setScrapingLagos(true);
    else setScrapingIbadan(true);

    setJobStatus('running');
    setJobLogs([]);

    try {
      const endpoint = engine === 'solar' 
        ? '/api/admin/solar-pipeline' 
        : engine === 'lagos' 
        ? '/api/admin/lagos-pipeline' 
        : '/api/outreach/ibadan10k';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scrape',
          mode: engine === 'solar' ? 'live-solar' : engine === 'lagos' ? 'lagos-10k' : 'ibadan-10k',
          count: 500
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveJobId(data.jobId || `job-${Date.now()}`);
        setPollingActive(true);
        alert(`🏛️ ${engine.toUpperCase()} Scraper Engine Triggered Successfully! Extracting leads in background...`);
      } else {
        alert(`Error starting ${engine} scraper: ${data.error || 'Failed'}`);
        setScrapingSolar(false);
        setScrapingLagos(false);
        setScrapingIbadan(false);
      }
    } catch (err: any) {
      alert(`Network error starting ${engine} scraper: ${err.message}`);
      setScrapingSolar(false);
      setScrapingLagos(false);
      setScrapingIbadan(false);
    }
  };

  // Status quick update
  const handleQuickStatusChange = async (lead: LeadItem, newStatus: string) => {
    try {
      const endpoint = '/api/admin/crm-leads';
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lead.id,
          status: newStatus
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
        if (selectedLead?.id === lead.id) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showToast(`Lead status updated to ${newStatus.toUpperCase()}`);
      } else {
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Network error updating lead status', 'error');
    }
  };

  // Bulk Status Update
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedLeadIds.length === 0) return;
    try {
      const res = await fetch('/api/admin/crm-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeadIds, status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLeads(prev => prev.map(l => selectedLeadIds.includes(l.id) ? { ...l, status: newStatus } : l));
        showToast(`Updated ${selectedLeadIds.length} lead(s) to ${newStatus.toUpperCase()}`);
        setSelectedLeadIds([]);
      } else {
        showToast(data.error || 'Failed bulk status update', 'error');
      }
    } catch (err) {
      showToast('Network error on bulk status update', 'error');
    }
  };

  // Execute Live Outreach
  const handleExecuteOutreach = async (targetIds?: string[]) => {
    const idsToOutreach = targetIds || (selectedLeadIds.length > 0 ? selectedLeadIds : selectedLead ? [selectedLead.id] : []);
    if (idsToOutreach.length === 0) {
      showToast('No prospect selected for outreach', 'error');
      return;
    }

    setOutreachSending(true);
    setOutreachNotice(null);

    try {
      const res = await fetch('/api/admin/crm-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'outreach',
          leadIds: idsToOutreach,
          channel: outreachChannel,
          message: customMessage,
          subject: customSubject
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Mark targeted leads as 'contacted'
        setLeads(prev => prev.map(l => idsToOutreach.includes(l.id) ? { ...l, status: 'contacted' } : l));
        showToast(`🚀 Live ${outreachChannel.toUpperCase()} Campaign Dispatched to ${idsToOutreach.length} prospect(s)!`);
        setOutreachModalOpen(false);
        setSelectedLeadIds([]);
      } else {
        showToast(data.error || 'Failed to dispatch outreach', 'error');
      }
    } catch (err: any) {
      showToast(`Network error triggering outreach: ${err.message}`, 'error');
    } finally {
      setOutreachSending(false);
    }
  };

  // Add Manual Lead
  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name.trim() || !newLeadForm.phone.trim()) {
      alert('Please enter Business Name and Phone number.');
      return;
    }
    setAddingLead(true);

    try {
      const newLead: LeadItem = {
        id: `manual-${Date.now()}`,
        name: newLeadForm.name.trim(),
        phone: newLeadForm.phone.trim(),
        email: newLeadForm.email.trim(),
        location: newLeadForm.location.trim() || `${newLeadForm.city}, Nigeria`,
        city: newLeadForm.city,
        engine: newLeadForm.engine,
        type: newLeadForm.type,
        status: 'new',
        notes: newLeadForm.notes.trim(),
        created_at: new Date().toISOString()
      };

      setLeads(prev => [newLead, ...prev]);
      setSelectedLead(newLead);
      setAddLeadModalOpen(false);
      setNewLeadForm({ name: '', phone: '', email: '', location: '', city: 'Lagos', engine: 'solar', type: 'enterprise', notes: '' });
      alert('Lead added successfully!');
    } catch (err) {
      alert('Failed to add lead.');
    } finally {
      setAddingLead(false);
    }
  };

  // Filtered list
  const filteredLeads = leads.filter(lead => {
    // Engine filter
    if (activeEngine === 'solar' && lead.engine !== 'solar') return false;
    if (activeEngine === 'lagos' && lead.engine !== 'lagos') return false;
    if (activeEngine === 'ibadan' && lead.engine !== 'ibadan') return false;

    // Status filter
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;

    // City filter
    if (cityFilter !== 'all' && (lead.city || '').toLowerCase() !== cityFilter.toLowerCase()) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.name.toLowerCase().includes(q);
      const matchPhone = lead.phone.includes(q);
      const matchEmail = lead.email.toLowerCase().includes(q);
      const matchLocation = lead.location.toLowerCase().includes(q);
      return matchName || matchPhone || matchEmail || matchLocation;
    }

    return true;
  });

  // Unique cities for filter
  const uniqueCities = Array.from(new Set(leads.map(l => l.city).filter(Boolean)));

  // KPI Calculations
  const totalLeadsCount = filteredLeads.length;
  const solarCount = leads.filter(l => l.engine === 'solar').length;
  const lagosCount = leads.filter(l => l.engine === 'lagos').length;
  const ibadanCount = leads.filter(l => l.engine === 'ibadan').length;
  const contactedCount = leads.filter(l => l.status === 'contacted' || l.status === 'proposal_sent' || l.status === 'closed_won').length;
  const closedWonCount = leads.filter(l => l.status === 'closed_won').length;
  const conversionRate = totalLeadsCount > 0 ? ((closedWonCount / totalLeadsCount) * 100).toFixed(1) : '0.0';

  // Export CSV
  const exportCsv = () => {
    if (filteredLeads.length === 0) {
      alert('No leads match current filter criteria.');
      return;
    }
    const headers = ['ID', 'Engine', 'Name', 'Phone', 'Email', 'Location', 'City', 'Status', 'Created At'];
    const rows = filteredLeads.map(l => [
      `"${l.id}"`,
      `"${l.engine.toUpperCase()}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${(l.city || '').replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.created_at}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `multi_engine_crm_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case 'new': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'contacted': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'qualified': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'proposal_sent': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'closed_won': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'lost': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-800 text-slate-300 border-white/10';
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map(l => l.id));
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen text-slate-100 relative">
      
      {/* 🔔 LIVE TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border text-xs font-extrabold flex items-center gap-2 animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-400' : 'bg-rose-950 border-rose-500/50 text-rose-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-rose-400" />}
          {toast.message}
        </div>
      )}
      
      {/* 🚀 TOP NAVIGATION & MULTI ENGINE SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-950/80 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Multi-Scraper Lead Management & CRM Suite
          </div>
          <h1 className="text-2xl font-extrabold text-white">Central Lead Administration Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Control, harvest, outreach, and manage prospects across <strong>SolarQuotePro</strong>, <strong>Lagos 10K B2B</strong>, and <strong>Ibadan 10K B2B</strong> engines.
          </p>
        </div>

        {/* Engine Switcher Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-white/10 flex-wrap">
          <button
            onClick={() => setActiveEngine('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeEngine === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> All Engines ({leads.length})
          </button>
          
          <button
            onClick={() => setActiveEngine('solar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeEngine === 'solar'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" /> Solar ({solarCount})
          </button>

          <button
            onClick={() => setActiveEngine('lagos')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeEngine === 'lagos'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-emerald-400" /> Lagos 10K ({lagosCount})
          </button>

          <button
            onClick={() => setActiveEngine('ibadan')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeEngine === 'ibadan'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-indigo-400" /> Ibadan 10K ({ibadanCount})
          </button>
        </div>
      </div>

      {/* 📊 KPI STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-xs font-bold text-slate-400 uppercase">Filtered Prospects</div>
          <div className="text-2xl font-extrabold text-white mt-1">{totalLeadsCount}</div>
          <div className="text-[11px] text-cyan-400 mt-1 font-semibold">Active in CRM table</div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-xs font-bold text-slate-400 uppercase">Solar Quote Leads</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">{solarCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">SolarQuotePro Engine</div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-xs font-bold text-slate-400 uppercase">Lagos B2B Merchants</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{lagosCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 font-semibold">Lagos 10K Engine</div>
        </div>

        <div className="bg-slate-900/70 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="text-xs font-bold text-slate-400 uppercase">Ibadan B2B Merchants</div>
          <div className="text-2xl font-extrabold text-indigo-400 mt-1">{ibadanCount}</div>
          <div className="text-[11px] text-indigo-400 mt-1 font-semibold">Ibadan 10K Engine</div>
        </div>
      </div>

      {/* ⚡ SCRAPER CONTROLLER BAR */}
      <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Scraper Engine Harvesters</h3>
              <p className="text-xs text-slate-400">Launch live automated lead generation runs across all 3 engines.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleTriggerScraper('solar')}
              disabled={scrapingSolar || scrapingLagos || scrapingIbadan}
              className="accessible-btn accessible-btn-amber text-xs"
            >
              {scrapingSolar ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sun className="w-3.5 h-3.5" />}
              Scrape Solar
            </button>

            <button
              onClick={() => handleTriggerScraper('lagos')}
              disabled={scrapingSolar || scrapingLagos || scrapingIbadan}
              className="accessible-btn accessible-btn-cyan text-xs"
            >
              {scrapingLagos ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Building className="w-3.5 h-3.5" />}
              Scrape Lagos 10K
            </button>

            <button
              onClick={() => handleTriggerScraper('ibadan')}
              disabled={scrapingSolar || scrapingLagos || scrapingIbadan}
              className="accessible-btn accessible-btn-indigo text-xs"
            >
              {scrapingIbadan ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Building className="w-3.5 h-3.5" />}
              Scrape Ibadan 10K
            </button>

            <button
              onClick={() => handleTriggerScraper('lagos')}
              disabled={scrapingSolar || scrapingLagos}
              className="accessible-btn accessible-btn-cyan text-xs"
            >
              {scrapingLagos ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Building className="w-4 h-4" />}
              Scrape Lagos 10K B2B
            </button>

            <button
              onClick={() => fetchLeads(true)}
              disabled={refreshing}
              className="accessible-btn accessible-btn-ghost text-xs"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh CRM
            </button>

            <button
              onClick={() => setAddLeadModalOpen(true)}
              className="accessible-btn accessible-btn-emerald text-xs"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>

            <button
              onClick={exportCsv}
              className="accessible-btn accessible-btn-ghost text-xs"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Live Scraper Output Log Window if active */}
        {activeJobId && (
          <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Scraper Terminal Output (Job #{activeJobId.slice(0, 8)})</span>
              <span className="capitalize text-slate-300">Status: {jobStatus}</span>
            </div>
            <pre className="bg-black/70 p-3 rounded-lg text-[11px] text-emerald-400 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
              {jobLogs.length > 0 ? jobLogs.map((l, i) => `[${l.timestamp?.slice(11, 19)}] ${l.step || 'RUN'}: ${l.message}`).join('\n') : 'Initializing scraper process...'}
              <div ref={logEndRef} />
            </pre>
          </div>
        )}
      </div>

      {/* ⚡ BULK ACTION COMMAND TOOLBAR */}
      {selectedLeadIds.length > 0 && (
        <div className="bg-cyan-950/80 border border-cyan-500/50 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>{selectedLeadIds.length} Lead(s) Selected for Bulk Actions</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setOutreachModalOpen(true);
              }}
              className="accessible-btn accessible-btn-cyan text-xs"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Bulk Outreach ({selectedLeadIds.length})
            </button>

            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStatusChange(e.target.value);
                  e.target.value = '';
                }
              }}
              className="bg-slate-900 border border-cyan-500/40 text-xs text-cyan-200 rounded-xl px-3 py-2 font-bold focus:outline-none"
            >
              <option value="">Bulk Status Change...</option>
              <option value="new">Mark NEW</option>
              <option value="contacted">Mark CONTACTED</option>
              <option value="qualified">Mark QUALIFIED</option>
              <option value="proposal_sent">Mark PROPOSAL SENT</option>
              <option value="closed_won">Mark CLOSED WON</option>
              <option value="lost">Mark LOST</option>
            </select>

            <button
              onClick={() => setSelectedLeadIds([])}
              className="accessible-btn accessible-btn-ghost text-xs text-slate-400 hover:text-white"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* 🔍 SEARCH, FILTER & VIEW MODE TOGGLE BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-white/10">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, phone, email, location..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="closed_won">Closed Won</option>
            <option value="lost">Lost</option>
          </select>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Locations</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Pipeline View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 📋 MAIN CONTENT: TABLE VS KANBAN */}
      {viewMode === 'table' ? (
        <div className="bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-slate-400 font-bold border-b border-white/10 uppercase tracking-wider">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={filteredLeads.length > 0 && selectedLeadIds.length === filteredLeads.length}
                      onChange={handleToggleSelectAll}
                      className="rounded accent-cyan-500 cursor-pointer w-4 h-4"
                    />
                  </th>
                  <th className="p-4">Engine</th>
                  <th className="p-4">Business / Lead Name</th>
                  <th className="p-4">Phone / Contact</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date Added</th>
                  <th className="p-4 text-right">Accessible Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-semibold">
                      No leads match your active filters or search term.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-900/50 transition-colors ${
                        selectedLeadIds.includes(lead.id) ? 'bg-cyan-500/10 border-l-4 border-cyan-400' : selectedLead?.id === lead.id ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                          className="rounded accent-cyan-500 cursor-pointer w-4 h-4"
                        />
                      </td>
                      {/* Engine Tag */}
                      <td className="p-4 whitespace-nowrap">
                        {lead.engine === 'solar' ? (
                          <span className="engine-badge engine-badge-solar">
                            <Sun className="w-3 h-3" /> Solar
                          </span>
                        ) : lead.engine === 'ibadan' ? (
                          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1">
                            <Building className="w-3 h-3" /> Ibadan 10K
                          </span>
                        ) : (
                          <span className="engine-badge engine-badge-lagos">
                            <Building className="w-3 h-3" /> Lagos 10K
                          </span>
                        )}
                      </td>

                      {/* Name & Contact Person */}
                      <td className="p-4 font-semibold text-white">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white">{lead.name}</span>
                          <span className="text-[11px] text-slate-400">{lead.contact_person || lead.project_scope || 'Prospect'}</span>
                        </div>
                      </td>

                      {/* Phone & Email */}
                      <td className="p-4">
                        <div className="flex flex-col space-y-1">
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-cyan-400 font-mono">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          )}
                          {lead.email && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 text-slate-300">
                        {lead.location}
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead, e.target.value)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border focus:outline-none cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                        >
                          <option value="new">NEW</option>
                          <option value="contacted">CONTACTED</option>
                          <option value="qualified">QUALIFIED</option>
                          <option value="proposal_sent">PROPOSAL SENT</option>
                          <option value="closed_won">CLOSED WON</option>
                          <option value="lost">LOST</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {lead.created_at ? lead.created_at.slice(0, 10) : 'Recent'}
                      </td>

                      {/* 1-CLICK ACCESSIBLE ACTION BUTTONS */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Direct */}
                          {lead.phone && (
                            <a
                              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${lead.name}, regarding your business quote proposal: ${(typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com')}/preview/${encodeURIComponent(lead.id)}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all"
                              title="1-Click WhatsApp Direct Message"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}

                          {/* Email / Outreach Trigger */}
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setOutreachModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all"
                            title="Send Email / SMS Outreach"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          {/* AI Website Redesign & Pricing Binder */}
                          <button
                            onClick={() => {
                              setSelectedLead(lead);
                              setRedesignModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition-all"
                            title="Prompt AI Redesign & Pricing Studio"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => copyText(`${(typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com')}/preview/${encodeURIComponent(lead.id)}`, lead.id)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-all"
                            title="Copy Live Preview Link"
                          >
                            {copiedId === lead.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {['new', 'contacted', 'qualified', 'proposal_sent', 'closed_won'].map((colStatus) => {
            const colLeads = filteredLeads.filter(l => l.status === colStatus);
            return (
              <div key={colStatus} className="bg-slate-950/80 rounded-2xl border border-white/10 p-4 space-y-3 min-w-[260px]">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-extrabold uppercase text-slate-300">
                    {colStatus.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-slate-900 p-4 rounded-xl border border-white/5 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-white leading-snug">{lead.name}</h4>
                        {lead.engine === 'solar' ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            SOLAR
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            LAGOS B2B
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="flex items-center gap-1 text-slate-300">
                          <Phone className="w-3 h-3 text-cyan-400" /> {lead.phone || 'No phone'}
                        </div>
                        <div>{lead.location}</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleQuickStatusChange(lead, e.target.value)}
                          className="bg-slate-950 text-[10px] text-slate-300 border border-white/10 rounded px-2 py-1"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="proposal_sent">Proposal</option>
                          <option value="closed_won">Closed Won</option>
                          <option value="lost">Lost</option>
                        </select>

                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setRedesignModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                          title="Prompt AI Redesign"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🔮 MODAL 1: OUTREACH DISPATCH */}
      {outreachModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" /> Send Outreach to {selectedLead.name}
              </h3>
              <button onClick={() => setOutreachModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Channel</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setOutreachChannel('whatsapp')}
                    className={`py-2 rounded-xl text-xs font-bold border ${outreachChannel === 'whatsapp' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setOutreachChannel('email')}
                    className={`py-2 rounded-xl text-xs font-bold border ${outreachChannel === 'email' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setOutreachChannel('sms')}
                    className={`py-2 rounded-xl text-xs font-bold border ${outreachChannel === 'sms' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                  >
                    SMS
                  </button>
                </div>
              </div>

              {outreachChannel === 'email' && (
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Subject</label>
                  <input
                    type="text"
                    value={customSubject || `Quote Proposal for ${selectedLead.name}`}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 block mb-1">Message Body</label>
                <textarea
                  rows={4}
                  value={customMessage || `Hello ${selectedLead.name}, your custom proposal is ready to view online: ${(typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com')}/preview/${selectedLead.id}`}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button onClick={() => setOutreachModalOpen(false)} className="accessible-btn accessible-btn-ghost text-xs">
                Cancel
              </button>
              
              {outreachChannel === 'whatsapp' && selectedLead.phone && (
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessage || `Hello ${selectedLead.name}, your custom quote proposal is ready: ${(typeof window !== 'undefined' ? window.location.origin : 'https://www.bethelmindanalytics.com')}/preview/${selectedLead.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    handleQuickStatusChange(selectedLead, 'contacted');
                    setOutreachModalOpen(false);
                  }}
                  className="accessible-btn accessible-btn-emerald text-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Web Direct
                </a>
              )}

              <button
                onClick={() => handleExecuteOutreach()}
                disabled={outreachSending}
                className="accessible-btn accessible-btn-cyan text-xs"
              >
                {outreachSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Dispatch Live Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔮 MODAL 2: PROMPT-BASED AI REDESIGN STUDIO */}
      {redesignModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full relative">
            <button
              onClick={() => setRedesignModalOpen(false)}
              className="absolute right-4 top-4 z-10 text-slate-400 hover:text-white p-2 rounded-full bg-slate-950"
            >
              <X className="w-5 h-5" />
            </button>
            <AdminLeadRedesignStudio
              initialLeadId={selectedLead.id}
              initialBusinessName={selectedLead.name}
            />
          </div>
        </div>
      )}

      {/* 🔮 MODAL 3: MANUAL LEAD CREATION */}
      {addLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddLeadSubmit} className="bg-slate-950 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Add New Lead to CRM
              </h3>
              <button type="button" onClick={() => setAddLeadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Target Engine</label>
                <select
                  value={newLeadForm.engine}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, engine: e.target.value as any })}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="solar">☀️ Engine 1: Solar & Energy Lead</option>
                  <option value="lagos">🏢 Engine 2: Lagos 10K B2B Commercial</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Ikeja Solar Systems or Lekki Plaza"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  placeholder="e.g. +2348012345678"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="info@business.com"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Location / Address</label>
                <input
                  type="text"
                  value={newLeadForm.location}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                  placeholder="e.g. Victoria Island, Lagos"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button type="button" onClick={() => setAddLeadModalOpen(false)} className="accessible-btn accessible-btn-ghost text-xs">
                Cancel
              </button>
              <button type="submit" disabled={addingLead} className="accessible-btn accessible-btn-emerald text-xs">
                {addingLead ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Save Lead
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
