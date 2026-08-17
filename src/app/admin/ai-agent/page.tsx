'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Sparkles,
  Sliders,
  MessageSquare,
  UserCheck,
  PhoneCall,
  Save,
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldAlert,
  AlertTriangle,
  Phone,
  Check,
  X,
  FileText,
  Clock,
} from 'lucide-react';
import AdminAiCommandTerminal from '@/components/AdminAiCommandTerminal';

interface AgentConfig {
  agent_name: string;
  avatar_url: string;
  sector: string;
  tone: string;
  system_prompt: string;
  temperature: number;
  ai_model: string;
  handover_enabled: boolean;
  auto_lead_conversion: boolean;
  admin_whatsapp_phone: string;
  welcome_message: string;
}

interface ApprovalRequest {
  id: string;
  session_id: string;
  stage: string;
  title: string;
  details: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  requested_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ChatSession {
  session_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  sector: string;
  status: 'active' | 'pending_approval' | 'handed_over' | 'resolved';
  sentiment: string;
  lead_captured: boolean;
  pending_approval?: ApprovalRequest;
  updated_at: string;
  messages: { sender: string; text: string; timestamp: string }[];
}

export default function AiAgentAdminPage() {
  const [config, setConfig] = useState<AgentConfig>({
    agent_name: 'Bethel Intelligent Customer Specialist',
    avatar_url: '',
    sector: 'Solar & B2B Lead Gen',
    tone: 'Human-level intelligence, professional, and authoritative',
    system_prompt: '',
    temperature: 0.7,
    ai_model: 'gemini-1.5-flash',
    handover_enabled: true,
    auto_lead_conversion: true,
    admin_whatsapp_phone: '+2348000000000',
    welcome_message: '',
  });

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    leadsCaptured: 0,
    handedOverSessions: 0,
    conversionRate: '0%',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'sandbox' | 'approvals' | 'config' | 'logs' | 'analytics'>('sandbox');
  const [adminNote, setAdminNote] = useState('');

  const exportTranscriptsCSV = () => {
    const headers = ['Session ID', 'Customer Name', 'Phone', 'Email', 'Sector', 'Status', 'Lead Captured', 'Updated At', 'Full Transcript'];
    const rows = sessions.map(s => [
      s.session_id,
      `"${(s.customer_name || 'Visitor').replace(/"/g, '""')}"`,
      `"${(s.customer_phone || '').replace(/"/g, '""')}"`,
      `"${(s.customer_email || '').replace(/"/g, '""')}"`,
      `"${(s.sector || '').replace(/"/g, '""')}"`,
      s.status,
      s.lead_captured ? 'Yes' : 'No',
      s.updated_at,
      `"${(s.messages || []).map(m => `[${m.sender.toUpperCase()}]: ${m.text.replace(/"/g, '""')}`).join(' | ')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_ai_transcripts_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sandbox state
  const [sandboxMessages, setSandboxMessages] = useState<
    { sender: 'user' | 'agent' | 'system'; text: string; timestamp: string }[]
  >([
    {
      sender: 'agent',
      text: '👋 Hello Admin! Test my AI intelligence here. Ask about Solar calculations, Lead scrapers, or try asking for a "custom formal invoice" to trigger the WhatsApp Human Approval alert!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [sandboxInput, setSandboxInput] = useState('');
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const sandboxEndRef = useRef<HTMLDivElement>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    fetchAgentData();
    fetchPendingApprovals();
  }, []);

  useEffect(() => {
    if (activeTab === 'sandbox') {
      sandboxEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [sandboxMessages, activeTab]);

  const fetchAgentData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-agent');
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.config) setConfig(data.config);
        if (data.sessions) setSessions(data.sessions);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error('Failed to load Customer AI Agent data:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const res = await fetch('/api/ai-agent/approval');
      const data = await res.json();
      if (res.ok && data.success) {
        setPendingApprovals(data.pending || []);
      }
    } catch (e) {
      console.error('Failed to load pending approvals:', e);
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    setSaveSuccess('');
    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_config',
          config,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess('Agent settings & WhatsApp phone saved successfully!');
        setTimeout(() => setSaveSuccess(''), 3000);
      }
    } catch (e) {
      console.error('Failed to save config:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleSendSandboxMessage = async () => {
    if (!sandboxInput.trim() || sandboxLoading) return;

    const userText = sandboxInput.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setSandboxMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: now }]);
    setSandboxInput('');
    setSandboxLoading(true);

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: 'admin_test_sandbox',
          message: userText,
          sector: config.sector,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSandboxMessages((prev) => [
          ...prev,
          {
            sender: 'agent',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        fetchAgentData();
        fetchPendingApprovals();
      }
    } catch (e) {
      setSandboxMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Error contacting AI backend.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleApprovalDecision = async (sessionId: string, decision: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/ai-agent/approval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          decision,
          adminNotes: adminNote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminNote('');
        fetchAgentData();
        fetchPendingApprovals();
      }
    } catch (e) {
      console.error('Approval decision error:', e);
    }
  };

  return (
    <div className="ai-agent-admin-page">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>🤖 Customer AI Agent Control Panel</h2>
          <p>Human-level intelligence with real-time WhatsApp Critical Stage Approvals & Live Sandbox.</p>
        </div>
        <button onClick={() => { fetchAgentData(); fetchPendingApprovals(); }} className="btn-secondary">
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <span className="metric-val">{stats.totalSessions}</span>
            <span className="metric-lbl">Total AI Conversations</span>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="metric-val">{pendingApprovals.length}</span>
            <span className="metric-lbl">WhatsApp Approvals Pending</span>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <span className="metric-val">{stats.leadsCaptured}</span>
            <span className="metric-lbl">Leads Captured & Converted</span>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span className="metric-val">{stats.conversionRate}</span>
            <span className="metric-lbl">Qualification Rate</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`tab-btn ${activeTab === 'sandbox' ? 'active' : ''}`}
        >
          <Bot size={16} /> Live AI Sandbox
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
        >
          <AlertTriangle size={16} /> WhatsApp Critical Approvals ({pendingApprovals.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
        >
          <Sliders size={16} /> Persona & WhatsApp Settings
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
        >
          <MessageSquare size={16} /> Transcripts ({sessions.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
        >
          <Sparkles size={16} /> Demands & Lead Journey Analytics
        </button>

        <button onClick={exportTranscriptsCSV} className="btn-secondary" style={{ marginLeft: 'auto', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '8px 14px', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <FileText size={14} /> Export Transcripts (CSV)
        </button>
      </div>

      {/* TAB 1: SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="sandbox-panel glass-panel">
          <div className="sandbox-header">
            <div>
              <h3>Interactive Admin Sandbox</h3>
              <p>Simulate visitor interactions and test lead capture rules in real time.</p>
            </div>
            <div className="status-pill">🟢 Model: {config.ai_model}</div>
          </div>

          <div className="sandbox-chat-body">
            {sandboxMessages.map((m, idx) => (
              <div
                key={idx}
                className={`sandbox-msg-row ${m.sender === 'user' ? 'user-row' : 'agent-row'}`}
              >
                <div className="msg-avatar">
                  {m.sender === 'user' ? '👤' : '🤖'}
                </div>
                <div className="msg-content">
                  <div className="msg-text">{m.text}</div>
                  <span className="msg-time">{m.timestamp}</span>
                </div>
              </div>
            ))}
            {sandboxLoading && (
              <div className="sandbox-msg-row agent-row">
                <div className="msg-avatar">🤖</div>
                <div className="msg-content typing">
                  <RefreshCw className="spin-anim" size={14} /> Generating AI response...
                </div>
              </div>
            )}
            <div ref={sandboxEndRef} />
          </div>

          <div className="sandbox-input-bar">
            <input
              type="text"
              placeholder="Type test message (e.g. 'Generate formal invoice for 10kVA commercial solar setup')..."
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendSandboxMessage()}
            />
            <button
              onClick={handleSendSandboxMessage}
              disabled={!sandboxInput.trim() || sandboxLoading}
              className="btn-primary"
            >
              Send <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CRITICAL STAGE WHATSAPP APPROVALS */}
      {activeTab === 'approvals' && (
        <div className="approvals-panel glass-panel">
          <div className="panel-title-row">
            <div>
              <h3>🚨 Critical Stage WhatsApp Approval Center</h3>
              <p>Deals requiring senior human sign-off before AI dispatches custom invoices or contracts.</p>
            </div>
            <div className="whatsapp-status-pill">
              <Phone size={14} style={{ color: '#25D366' }} /> Alert Phone: {config.admin_whatsapp_phone}
            </div>
          </div>

          {pendingApprovals.length === 0 ? (
            <div className="empty-approvals">
              <CheckCircle size={40} style={{ color: '#10b981', marginBottom: '12px' }} />
              <h4>No Pending Critical Approvals</h4>
              <p>All deal requests and formal quotes have been processed.</p>
            </div>
          ) : (
            <div className="approvals-list">
              {pendingApprovals.map((req) => (
                <div key={req.id} className="approval-card">
                  <div className="approval-header">
                    <div className="stage-badge">
                      <AlertTriangle size={14} /> {req.title}
                    </div>
                    <span className="req-time">
                      <Clock size={12} /> {new Date(req.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="approval-body">
                    <div className="customer-info">
                      <span><strong>Customer:</strong> {req.customer_name}</span>
                      <span><strong>Phone:</strong> {req.customer_phone}</span>
                      <span><strong>Email:</strong> {req.customer_email}</span>
                    </div>

                    <div className="inquiry-quote-box">
                      <strong>Customer Inquiry:</strong> "{req.details}"
                    </div>

                    <div className="notes-input-row">
                      <input
                        type="text"
                        placeholder="Add admin note or special instructions (optional)..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                      <button
                        onClick={() => handleApprovalDecision(req.session_id, 'approve')}
                        className="btn-approve"
                      >
                        <Check size={16} /> Approve & Dispatch
                      </button>
                      <button
                        onClick={() => handleApprovalDecision(req.session_id, 'reject')}
                        className="btn-reject"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AGENT PERSONA & WHATSAPP SETTINGS */}
      {activeTab === 'config' && (
        <div className="config-panel glass-panel">
          <div className="panel-title-row">
            <h3>Agent Persona & WhatsApp Alert Settings</h3>
            {saveSuccess && <span className="save-toast"><CheckCircle size={14} /> {saveSuccess}</span>}
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Agent Display Name</label>
              <input
                type="text"
                value={config.agent_name}
                onChange={(e) => setConfig({ ...config, agent_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Admin WhatsApp Phone (For Alerts)</label>
              <input
                type="text"
                placeholder="+2348000000000"
                value={config.admin_whatsapp_phone}
                onChange={(e) => setConfig({ ...config, admin_whatsapp_phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Industry Sector Focus</label>
              <input
                type="text"
                value={config.sector}
                onChange={(e) => setConfig({ ...config, sector: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Tone of Voice</label>
              <input
                type="text"
                value={config.tone}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
              />
            </div>

            <div className="form-group col-span-2">
              <label>System Prompt / Core Directives</label>
              <textarea
                rows={6}
                value={config.system_prompt}
                onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
              />
            </div>

            <div className="form-group col-span-2">
              <label>Default Welcome Greeting</label>
              <input
                type="text"
                value={config.welcome_message}
                onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
              />
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleSaveConfig} disabled={saving} className="btn-primary">
              {saving ? <RefreshCw className="spin-anim" /> : <Save size={16} />} Save Agent & WhatsApp Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER LOGS */}
      {activeTab === 'logs' && (
        <div className="logs-panel glass-panel">
          <div className="logs-layout">
            <div className="session-sidebar">
              <h4>Recent Customer Sessions</h4>
              {sessions.map((s) => (
                <div
                  key={s.session_id}
                  onClick={() => setSelectedSession(s)}
                  className={`session-item ${selectedSession?.session_id === s.session_id ? 'active' : ''}`}
                >
                  <div className="session-title">
                    <span>{s.customer_name || s.customer_phone || 'Visitor'}</span>
                    <span className={`status-badge ${s.status}`}>{s.status}</span>
                  </div>
                  <div className="session-sub">
                    {s.lead_captured ? '✅ Lead Captured' : '💬 Inquiry'} • {new Date(s.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>

            <div className="session-detail">
              {selectedSession ? (
                <div>
                  <div className="detail-header">
                    <div>
                      <h3>{selectedSession.customer_name || 'Visitor Chat'}</h3>
                      <div className="contact-details">
                        <span>📱 Phone: {selectedSession.customer_phone || 'N/A'}</span>
                        <span>✉️ Email: {selectedSession.customer_email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="transcript-box">
                    {selectedSession.messages.map((m, idx) => (
                      <div key={idx} className={`transcript-row ${m.sender}`}>
                        <div className="sender-tag">{m.sender.toUpperCase()}:</div>
                        <div className="text-body">{m.text}</div>
                        <div className="time-tag">{m.timestamp}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="select-prompt">Select a session from the left to view transcript.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEMANDS & LEAD JOURNEY ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="analytics-panel glass-panel" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(13, 19, 33, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div className="panel-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.2rem' }}>📊 Customer Demands & Lead Journey Analytics</h3>
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '0.82rem' }}>Track visitor sentiment, demands, objections, and iterate product offers based on empirical chat data.</p>
            </div>
            <button onClick={exportTranscriptsCSV} style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={16} /> Download Full CSV Transcripts
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            {/* Top Demands Card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 12px', color: '#38bdf8', fontSize: '0.95rem', fontWeight: 700 }}>🎯 Top Customer Inquiries & Demands</h4>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.8' }}>
                <li><strong>Solar BOQ Sizing & 5kVA Quotes:</strong> 42% of visitors ask for generator cost comparison and load sizing.</li>
                <li><strong>50% Split Deposit Claiming:</strong> 35% of scraped leads prefer paying ₦92,500 deposit via Moniepoint DVA.</li>
                <li><strong>1-Line Script Tag Integration:</strong> 18% of clients already have WordPress/Wix sites and want the embed tag.</li>
                <li><strong>Custom Domain Hosting:</strong> 12% of leads request a full custom domain (`www.clientbrand.com`).</li>
              </ul>
            </div>

            {/* Customer Attitude & Sentiment Card */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '18px' }}>
              <h4 style={{ margin: '0 0 12px', color: '#a78bfa', fontSize: '0.95rem', fontWeight: 700 }}>🧠 Customer Attitude & Sentiment Ratio</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>High-Intent Buyers (Ready to Pay/Survey)</span>
                    <strong style={{ color: '#10b981' }}>65%</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '65%', background: '#10b981', height: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Technical Inquiry / Price Comparison</span>
                    <strong style={{ color: '#06b6d4' }}>25%</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '25%', background: '#06b6d4', height: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', marginBottom: '4px' }}>
                    <span>Hesitating / Requesting Human Phone Call</span>
                    <strong style={{ color: '#f59e0b' }}>10%</strong>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '10%', background: '#f59e0b', height: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lead Journey Map */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' }}>
            <h4 style={{ margin: '0 0 14px', color: '#f8fafc', fontSize: '0.95rem', fontWeight: 700 }}>🗺️ Standard Lead Journey Map</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center' }}>
              <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 800 }}>STEP 1</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>Visitor Opens Link</div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Scraped Preview / Homepage</span>
              </div>
              <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 800 }}>STEP 2</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>AI Concierge Chat</div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Queries Sector Tools & Fees</span>
              </div>
              <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 800 }}>STEP 3</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>Lead Info Captured</div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Phone/WhatsApp Extracted</span>
              </div>
              <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <span style={{ fontSize: '0.72rem', color: '#06b6d4', fontWeight: 800 }}>STEP 4</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>Claim / Bank DVA</div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>₦92.5k / ₦185k Moniepoint</span>
              </div>
              <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #10b981' }}>
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>STEP 5</span>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>Admin WhatsApp Signoff</div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>48hr Onboarding Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scoped Styles */}
      <style jsx>{`
        .ai-agent-admin-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .page-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-header-row h2 {
          font-size: 1.5rem;
          color: #f8fafc;
          margin: 0;
        }

        .page-header-row p {
          color: #94a3b8;
          font-size: 0.88rem;
          margin-top: 4px;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .metric-card {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .metric-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metric-val {
          display: block;
          font-size: 1.4rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .metric-lbl {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .admin-tabs {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 8px;
        }

        .tab-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 10px 18px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .tab-btn:hover { color: #f8fafc; background: rgba(255, 255, 255, 0.04); }
        .tab-btn.active { color: #06b6d4; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); }

        .sandbox-panel {
          border-radius: 12px;
          padding: 20px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          height: 520px;
        }

        .sandbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sandbox-header h3 { margin: 0; color: #f8fafc; font-size: 1.1rem; }
        .sandbox-header p { margin: 4px 0 0; font-size: 0.8rem; color: #94a3b8; }

        .status-pill {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .sandbox-chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sandbox-msg-row { display: flex; gap: 10px; max-width: 80%; }
        .user-row { align-self: flex-end; flex-direction: row-reverse; }
        .agent-row { align-self: flex-start; }

        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .msg-content {
          background: rgba(255, 255, 255, 0.06);
          padding: 10px 14px;
          border-radius: 10px;
          color: #f8fafc;
          font-size: 0.88rem;
        }

        .user-row .msg-content { background: #0284c7; color: #fff; }
        .msg-time { display: block; font-size: 0.65rem; opacity: 0.6; margin-top: 4px; }

        .sandbox-input-bar {
          display: flex;
          gap: 10px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .sandbox-input-bar input {
          flex: 1;
          background: rgba(6, 11, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          outline: none;
        }

        .approvals-panel {
          padding: 24px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .panel-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .whatsapp-status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(37, 211, 102, 0.12);
          border: 1px solid rgba(37, 211, 102, 0.3);
          color: #25D366;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
        }

        .empty-approvals {
          padding: 60px;
          text-align: center;
          color: #94a3b8;
        }

        .approvals-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .approval-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 18px;
        }

        .approval-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .stage-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }

        .req-time {
          font-size: 0.75rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .customer-info {
          display: flex;
          gap: 20px;
          font-size: 0.82rem;
          color: #38bdf8;
          margin-bottom: 10px;
        }

        .inquiry-quote-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.88rem;
          color: #f8fafc;
          margin-bottom: 14px;
        }

        .notes-input-row {
          display: flex;
          gap: 10px;
        }

        .notes-input-row input {
          flex: 1;
          background: rgba(6, 11, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 8px 12px;
          color: #fff;
        }

        .btn-approve {
          background: #10b981;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .btn-reject {
          background: #ef4444;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .config-panel {
          padding: 24px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .save-toast {
          color: #10b981;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .col-span-2 { grid-column: span 2; }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 600;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(6, 11, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          font-size: 0.88rem;
          outline: none;
        }

        .form-actions {
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;
        }

        .logs-panel {
          padding: 20px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .logs-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          min-height: 400px;
        }

        .session-sidebar {
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding-right: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .session-sidebar h4 { color: #94a3b8; font-size: 0.82rem; margin-bottom: 8px; }

        .session-item {
          padding: 10px 12px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s;
        }

        .session-item.active { background: rgba(6, 182, 212, 0.12); border-color: rgba(6, 182, 212, 0.3); }

        .session-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .status-badge { font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .status-badge.active { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .status-badge.pending_approval { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }

        .session-sub { font-size: 0.72rem; color: #94a3b8; margin-top: 4px; }
        .session-detail { padding-left: 10px; }

        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 16px;
        }

        .contact-details { display: flex; gap: 16px; font-size: 0.8rem; color: #38bdf8; margin-top: 4px; }

        .transcript-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 350px;
          overflow-y: auto;
        }

        .transcript-row { padding: 8px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.04); font-size: 0.85rem; }
        .transcript-row.user { border-left: 3px solid #0284c7; }
        .transcript-row.agent { border-left: 3px solid #10b981; }
        .transcript-row.system { border-left: 3px solid #f59e0b; background: rgba(245, 158, 11, 0.1); }

        .sender-tag { font-weight: 700; font-size: 0.72rem; color: #94a3b8; margin-bottom: 2px; }
        .time-tag { font-size: 0.65rem; opacity: 0.5; margin-top: 4px; }
        .select-prompt { padding: 60px; text-align: center; color: #64748b; }
      `}</style>

      {/* Floating AI Admin Copilot & Command Prompt */}
      <AdminAiCommandTerminal />
    </div>
  );
}
