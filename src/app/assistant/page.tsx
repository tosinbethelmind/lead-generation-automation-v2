'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell, CheckCircle, Globe, MessageCircle, Copy, Check,
  RefreshCw, ExternalLink, X, Phone, UserCheck, ShieldCheck,
  AlertTriangle, Sparkles, Wrench
} from 'lucide-react';
import AdminAiCommandTerminal from '@/components/AdminAiCommandTerminal';
import { copyToClipboard } from '@/lib/clipboard';

interface AssignedLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  notes: string;
  taskType: 'claim' | 'redesign' | 'tool_integration';
}

const TASK_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  claim: { label: 'Website Claim', color: '#10b981', icon: <CheckCircle style={{ width: 12, height: 12 }} /> },
  redesign: { label: 'AI Redesign', color: '#f59e0b', icon: <Sparkles style={{ width: 12, height: 12 }} /> },
  tool_integration: { label: 'Tool Setup', color: '#6366f1', icon: <Wrench style={{ width: 12, height: 12 }} /> },
};

export default function AssistantDeskPage() {
  const [leads, setLeads] = useState<AssignedLead[]>([]);
  const [stats, setStats] = useState({ claims: 0, redesigns: 0, tools: 0 });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; lead: AssignedLead | null; action: 'verify' | 'domain' | 'link' }>({ open: false, lead: null, action: 'verify' });
  const [customDomain, setCustomDomain] = useState('');
  const [claimFee, setClaimFee] = useState('98000');
  const [assistLink, setAssistLink] = useState('');
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const d = phone.replace(/\D/g, '');
    if (d.startsWith('0') && d.length === 11) return '234' + d.slice(1);
    return d;
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks');
      const data = await res.json();
      if (res.ok && data.success) {
        const mapped: AssignedLead[] = (data.alerts || []).map((l: any) => {
          const notes = (l.notes || '').toLowerCase();
          let taskType: 'claim' | 'redesign' | 'tool_integration' = 'claim';
          if (notes.includes('[redesign_pending: true]') || notes.includes('custom instructions')) taskType = 'redesign';
          else if (notes.includes('tool') || notes.includes('widget') || notes.includes('integration')) taskType = 'tool_integration';
          return { ...l, taskType };
        });
        setLeads(mapped);
        setStats({
          claims: mapped.filter(l => l.taskType === 'claim').length,
          redesigns: mapped.filter(l => l.taskType === 'redesign').length,
          tools: mapped.filter(l => l.taskType === 'tool_integration').length,
        });
      }
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleVerify = async (lead: AssignedLead) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_claim', leadId: lead.id })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setModal({ open: false, lead: null, action: 'verify' });
        fetchLeads();
      } else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Connection error', 'error'); } finally { setProcessing(false); }
  };

  const handleDomain = async (lead: AssignedLead) => {
    if (!customDomain.trim()) { showToast('Enter a domain name', 'error'); return; }
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'bind_domain', leadId: lead.id, customDomain: customDomain.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message);
        setModal({ open: false, lead: null, action: 'verify' });
        setCustomDomain('');
        fetchLeads();
      } else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Connection error', 'error'); } finally { setProcessing(false); }
  };

  const handleGenLink = async (lead: AssignedLead) => {
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/assistant-tasks', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_assist_link', leadId: lead.id, claimFeeNGN: parseInt(claimFee) || 98000 })
      });
      const data = await res.json();
      if (res.ok && data.success) { setAssistLink(data.assistLink); showToast('Claim link generated!'); }
      else showToast(data.error || 'Failed', 'error');
    } catch { showToast('Connection error', 'error'); } finally { setProcessing(false); }
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    showToast('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          padding: '12px 18px', borderRadius: 12,
          background: toast.type === 'success' ? 'rgba(4,40,20,0.98)' : 'rgba(40,4,4,0.98)',
          border: `1px solid ${toast.type === 'success' ? '#10b981' : '#ef4444'}`,
          color: toast.type === 'success' ? '#4ade80' : '#fca5a5',
          fontSize: '0.8rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          {toast.type === 'success' ? <CheckCircle style={{ width: 14, height: 14 }} /> : <AlertTriangle style={{ width: 14, height: 14 }} />}
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.15)',
        borderRadius: 16, padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Bell style={{ width: 16, height: 16, color: '#10b981' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Real-Time Duty Alert Desk
              </span>
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f0fdf4', margin: 0 }}>
              Your Assigned Leads & Action Queue
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '4px 0 0' }}>
              These are leads that need your help — claim verifications, website redesigns, and tool installations.
              Your manager will alert you when a new task is assigned.
            </p>
          </div>
          <button
            id="assistant-refresh-btn"
            onClick={fetchLeads}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 10,
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: '#10b981', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <RefreshCw style={{ width: 13, height: 13, animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: '🌐 Claims to Verify', value: stats.claims, color: '#10b981' },
          { label: '🎨 Redesign Tasks', value: stats.redesigns, color: '#f59e0b' },
          { label: '🔧 Tool Setups', value: stats.tools, color: '#6366f1' },
        ].map(card => (
          <div key={card.label} style={{
            background: 'rgba(4,20,12,0.8)', border: `1px solid ${card.color}30`,
            borderRadius: 14, padding: '16px 18px'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: card.color, textTransform: 'uppercase', marginBottom: 4 }}>
              {card.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#f0fdf4' }}>{card.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#4b5563' }}>Pending your action</div>
          </div>
        ))}
      </div>

      {/* Lead Queue */}
      <div style={{
        background: 'rgba(4,20,12,0.8)', border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: 16, overflow: 'hidden'
      }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid rgba(16,185,129,0.1)',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <UserCheck style={{ width: 15, height: 15, color: '#10b981' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f0fdf4', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Action Queue — {leads.length} Leads Assigned
          </span>
        </div>

        {leads.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#374151' }}>
            <CheckCircle style={{ width: 36, height: 36, color: '#10b981', margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>No tasks in your queue right now.</p>
            <p style={{ fontSize: '0.72rem', color: '#1f2937', margin: '4px 0 0' }}>
              Your manager will send you a message when a new lead is assigned.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.08)' }}>
                  {['Business / Lead', 'Task Type', 'Phone / Contact', 'Notes Snippet', 'Your Actions'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '0.67rem', fontWeight: 700, color: '#4b5563',
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => {
                  const task = TASK_LABELS[lead.taskType];
                  return (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#f0fdf4' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.65rem', color: '#4b5563', fontFamily: 'monospace' }}>{lead.id}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '4px 10px', borderRadius: 20,
                          background: `${task.color}15`,
                          border: `1px solid ${task.color}30`,
                          color: task.color, fontSize: '0.68rem', fontWeight: 700
                        }}>
                          {task.icon} {task.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {lead.phone ? (
                          <span style={{ color: '#4ade80', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                            {lead.phone}
                          </span>
                        ) : <span style={{ color: '#374151' }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px', maxWidth: 200 }}>
                        <div style={{
                          fontSize: '0.68rem', color: '#6b7280', fontFamily: 'monospace',
                          background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: 6,
                          maxHeight: 40, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                        }}>
                          {lead.notes || '—'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                          {/* Verify Claim */}
                          <button
                            id={`verify-btn-${lead.id}`}
                            onClick={() => setModal({ open: true, lead, action: 'verify' })}
                            title="Verify & Activate Website Claim"
                            style={actionBtn('#10b981')}
                          >
                            <CheckCircle style={{ width: 13, height: 13 }} />
                          </button>

                          {/* WhatsApp */}
                          {lead.phone && (
                            <a
                              id={`wa-btn-${lead.id}`}
                              href={`https://wa.me/${formatPhone(lead.phone)}?text=${encodeURIComponent(`Hello ${lead.name}! I am your assigned Bethelmind Admin Support. I can see your website is ready and I'm here to help you activate your domain, set up your tools, or finalize your website claim. Please let me know how to assist you! 🚀`)}`}
                              target="_blank" rel="noopener noreferrer"
                              title="WhatsApp Support"
                              style={{ ...actionBtn('#25d366'), textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                            >
                              <MessageCircle style={{ width: 13, height: 13 }} />
                            </a>
                          )}

                          {/* Domain Binding */}
                          <button
                            id={`domain-btn-${lead.id}`}
                            onClick={() => setModal({ open: true, lead, action: 'domain' })}
                            title="Bind Custom Domain"
                            style={actionBtn('#6366f1')}
                          >
                            <Globe style={{ width: 13, height: 13 }} />
                          </button>

                          {/* Generate Claim Link */}
                          <button
                            id={`link-btn-${lead.id}`}
                            onClick={() => { setModal({ open: true, lead, action: 'link' }); setAssistLink(''); }}
                            title="Generate Claim Link"
                            style={actionBtn('#06b6d4')}
                          >
                            <ExternalLink style={{ width: 13, height: 13 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Action Modal ─── */}
      {modal.open && modal.lead && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{
            background: 'rgba(4,20,12,0.98)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 20, padding: '28px 32px', maxWidth: 440, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <ShieldCheck style={{ width: 18, height: 18, color: '#10b981' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f0fdf4' }}>
                  {modal.action === 'verify' && 'Verify & Activate Claim'}
                  {modal.action === 'domain' && 'Bind Custom Domain'}
                  {modal.action === 'link' && 'Generate Claim Link'}
                </span>
              </div>
              <button onClick={() => setModal({ open: false, lead: null, action: 'verify' })}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            <div style={{
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: '0.78rem', color: '#86efac'
            }}>
              Client: <strong>{modal.lead.name}</strong> &nbsp;|&nbsp; Phone: {modal.lead.phone || '—'}
            </div>

            {modal.action === 'verify' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: '0.78rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                  Click below to confirm that this client's payment has been verified. This will activate their website and mark the lead as <strong style={{ color: '#10b981' }}>CLAIMED</strong> in the CRM.
                </p>
                <button onClick={() => handleVerify(modal.lead!)} disabled={processing} style={primaryBtn('#10b981', processing)}>
                  {processing ? <RefreshCw style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite' }} /> : <CheckCircle style={{ width: 14, height: 14 }} />}
                  Confirm & Activate Website
                </button>
              </div>
            )}

            {modal.action === 'domain' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700 }}>
                  Custom Domain (e.g. clientbusiness.com)
                </label>
                <input
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  placeholder="clientbusiness.com"
                  style={inputStyle}
                />
                <button onClick={() => handleDomain(modal.lead!)} disabled={processing} style={primaryBtn('#6366f1', processing)}>
                  {processing ? <RefreshCw style={{ width: 14, height: 14, animation: 'spin 0.8s linear infinite' }} /> : <Globe style={{ width: 14, height: 14 }} />}
                  Bind Domain & Update Records
                </button>
              </div>
            )}

            {modal.action === 'link' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <label style={{ fontSize: '0.72rem', color: '#86efac', fontWeight: 700 }}>
                  Claim Fee (₦ NGN)
                </label>
                <input type="number" value={claimFee} onChange={e => setClaimFee(e.target.value)} style={inputStyle} />
                <button onClick={() => handleGenLink(modal.lead!)} disabled={processing} style={primaryBtn('#06b6d4', processing)}>
                  Generate Personalized Claim Link
                </button>
                {assistLink && (
                  <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#06b6d4', wordBreak: 'break-all' }}>{assistLink}</div>
                    <button onClick={() => handleCopy(assistLink)} style={primaryBtn(copied ? '#10b981' : '#374151', false)}>
                      {copied ? <Check style={{ width: 13, height: 13 }} /> : <Copy style={{ width: 13, height: 13 }} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginTop: 16, textAlign: 'right' }}>
              <button onClick={() => setModal({ open: false, lead: null, action: 'verify' })}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: '0.78rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Admin Copilot & Command Prompt */}
      <AdminAiCommandTerminal />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function actionBtn(color: string) {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 28, height: 28, borderRadius: 7,
    background: `${color}12`, border: `1px solid ${color}30`,
    color, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s'
  } as React.CSSProperties;
}

function primaryBtn(color: string, loading: boolean) {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '12px', borderRadius: 10, width: '100%',
    background: loading ? `${color}30` : color === '#374151' ? 'rgba(55,65,81,0.5)' : `${color}`,
    border: 'none', color: '#fff', fontSize: '0.82rem', fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer'
  } as React.CSSProperties;
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(16,185,129,0.2)',
  borderRadius: 10, padding: '10px 14px',
  color: '#f0fdf4', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box'
};
