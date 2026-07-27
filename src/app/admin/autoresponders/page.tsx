'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Zap,
  Plus,
  Trash2,
  Edit2,
  Play,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sliders,
  Send,
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Radio,
} from 'lucide-react';

interface AutoresponderRule {
  id: string;
  name: string;
  channel: 'all' | 'whatsapp' | 'sms' | 'email' | 'webchat';
  trigger_type: 'keyword' | 'contains' | 'default_welcome' | 'outside_hours';
  keywords: string[];
  response_type: 'template' | 'ai_generated' | 'drip';
  response_text: string;
  priority: number;
  enabled: boolean;
  reply_count: number;
}

export default function AutorespondersAdminPage() {
  const [rules, setRules] = useState<AutoresponderRule[]>([]);
  const [totalReplies, setTotalReplies] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<AutoresponderRule>>({
    name: '',
    channel: 'all',
    trigger_type: 'contains',
    keywords: [],
    response_type: 'template',
    response_text: '',
    priority: 5,
    enabled: true,
  });
  const [keywordInput, setKeywordInput] = useState('');

  // Tester State
  const [testMsg, setTestMsg] = useState('');
  const [testChannel, setTestChannel] = useState<'whatsapp' | 'sms' | 'email' | 'webchat'>('webchat');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/autoresponders');
      const data = await res.json();
      if (res.ok && data.success) {
        setRules(data.rules || []);
        setTotalReplies(data.totalReplies || 0);
      }
    } catch (e) {
      console.error('Failed to load autoresponders:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (rule?: AutoresponderRule) => {
    if (rule) {
      setEditingRule(rule);
      setKeywordInput(rule.keywords.join(', '));
    } else {
      setEditingRule({
        name: '',
        channel: 'all',
        trigger_type: 'contains',
        keywords: [],
        response_type: 'template',
        response_text: '',
        priority: 5,
        enabled: true,
      });
      setKeywordInput('');
    }
    setShowModal(true);
  };

  const handleSaveRule = async () => {
    if (!editingRule.name || !editingRule.response_text) return;
    setSaving(true);

    const parsedKeywords = keywordInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/autoresponders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingRule,
          keywords: parsedKeywords,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        fetchRules();
      }
    } catch (e) {
      console.error('Save rule error:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRule = async (rule: AutoresponderRule) => {
    try {
      const res = await fetch('/api/autoresponders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...rule,
          enabled: !rule.enabled,
        }),
      });
      if (res.ok) fetchRules();
    } catch (e) {
      console.error('Toggle error:', e);
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Are you sure you want to delete this autoresponder rule?')) return;
    try {
      const res = await fetch(`/api/autoresponders?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchRules();
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const handleRunTest = async () => {
    if (!testMsg.trim() || testing) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/autoresponders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: testMsg,
          channel: testChannel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult(data.result);
      }
    } catch (e) {
      console.error('Test run failed:', e);
    } finally {
      setTesting(false);
    }
  };

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case 'whatsapp': return <MessageCircle size={14} style={{ color: '#25D366' }} />;
      case 'sms': return <Phone size={14} style={{ color: '#38bdf8' }} />;
      case 'email': return <Mail size={14} style={{ color: '#f59e0b' }} />;
      case 'webchat': return <Globe size={14} style={{ color: '#8b5cf6' }} />;
      default: return <Radio size={14} style={{ color: '#06b6d4' }} />;
    }
  };

  return (
    <div className="autoresponders-admin-page">
      {/* Page Header */}
      <div className="header-row">
        <div>
          <h2>⚡ Multi-Channel Autoresponders</h2>
          <p>Set up automated instant triggers for WhatsApp, SMS, Email, and Web Chat inquiries.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus size={16} /> Create Autoresponder Rule
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="metrics-banner glass-panel">
        <div className="metric-box">
          <span className="metric-num">{rules.length}</span>
          <span className="metric-tag">Total Rules</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">{rules.filter((r) => r.enabled).length}</span>
          <span className="metric-tag">Active Rules</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">{totalReplies}</span>
          <span className="metric-tag">Auto-Replies Triggered</span>
        </div>
        <div className="metric-box">
          <span className="metric-num">4 Channels</span>
          <span className="metric-tag">WhatsApp • SMS • Email • Web</span>
        </div>
      </div>

      {/* Rule List & Management */}
      <div className="rules-section glass-panel">
        <div className="section-title">
          <h3>Configured Autoresponder Triggers</h3>
          <button onClick={fetchRules} className="btn-icon">
            <RefreshCw size={14} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <RefreshCw className="spin-anim" /> Loading Autoresponders...
          </div>
        ) : rules.length === 0 ? (
          <div className="empty-state">No autoresponder rules defined. Click "Create Autoresponder Rule" to add one!</div>
        ) : (
          <div className="rules-list">
            {rules.map((rule) => (
              <div key={rule.id} className={`rule-card ${!rule.enabled ? 'disabled' : ''}`}>
                <div className="rule-header">
                  <div className="rule-title-group">
                    <span className="channel-badge">
                      {getChannelIcon(rule.channel)} {rule.channel.toUpperCase()}
                    </span>
                    <h4>{rule.name}</h4>
                  </div>
                  <div className="rule-actions">
                    <button
                      onClick={() => handleToggleRule(rule)}
                      className={`toggle-btn ${rule.enabled ? 'on' : 'off'}`}
                    >
                      {rule.enabled ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </button>
                    <button onClick={() => handleOpenModal(rule)} className="btn-icon">
                      <Edit2 size={15} />
                    </button>
                    <button onClick={() => handleDeleteRule(rule.id)} className="btn-icon delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="rule-body">
                  <div className="rule-details">
                    <span className="detail-tag">Condition: <strong>{rule.trigger_type}</strong></span>
                    <span className="detail-tag">Priority: <strong>P{rule.priority}</strong></span>
                    <span className="detail-tag">Trigger Count: <strong>{rule.reply_count || 0} replies</strong></span>
                  </div>

                  {rule.keywords.length > 0 && (
                    <div className="keywords-row">
                      <span className="kw-lbl">Keywords:</span>
                      {rule.keywords.map((kw, idx) => (
                        <span key={idx} className="kw-chip">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="response-preview">
                    <strong>Auto-Reply Preview:</strong> "{rule.response_text}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Autoresponder Tester */}
      <div className="tester-section glass-panel">
        <div className="section-title">
          <h3>🧪 Interactive Rule Simulator</h3>
          <p>Test sample incoming customer messages to verify which autoresponder rule triggers.</p>
        </div>

        <div className="tester-form">
          <div className="tester-inputs">
            <select
              value={testChannel}
              onChange={(e) => setTestChannel(e.target.value as any)}
              className="channel-select"
            >
              <option value="webchat">Web Chat</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
            <input
              type="text"
              placeholder="Enter test message (e.g. 'Hi, send me your solar installation pricing')..."
              value={testMsg}
              onChange={(e) => setTestMsg(e.target.value)}
              className="test-input"
            />
            <button onClick={handleRunTest} disabled={!testMsg.trim() || testing} className="btn-primary">
              {testing ? <RefreshCw className="spin-anim" /> : <Play size={15} />} Test Trigger
            </button>
          </div>

          {testResult && (
            <div className={`test-output-box ${testResult.matched ? 'matched' : 'fallback'}`}>
              <div className="output-status">
                {testResult.matched ? '✅ MATCHED AUTORESPONDER RULE' : '⚠️ NO SPECIFIC RULE MATCHED (FALLBACK REPLY)'}
              </div>
              <div className="output-reply">
                <strong>Simulated Response:</strong> "{testResult.replyText}"
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rule Edit/Create Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>{editingRule.id ? 'Edit Autoresponder Rule' : 'Create New Autoresponder Rule'}</h3>
              <button onClick={() => setShowModal(false)} className="btn-icon">✕</button>
            </div>

            <div className="modal-form">
              <div className="form-group">
                <label>Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Pricing Auto-reply"
                  value={editingRule.name || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Channel</label>
                  <select
                    value={editingRule.channel || 'all'}
                    onChange={(e) => setEditingRule({ ...editingRule, channel: e.target.value as any })}
                  >
                    <option value="all">All Channels</option>
                    <option value="whatsapp">WhatsApp Only</option>
                    <option value="sms">SMS Only</option>
                    <option value="email">Email Only</option>
                    <option value="webchat">Web Chat Only</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Trigger Condition</label>
                  <select
                    value={editingRule.trigger_type || 'contains'}
                    onChange={(e) => setEditingRule({ ...editingRule, trigger_type: e.target.value as any })}
                  >
                    <option value="contains">Message Contains Keywords</option>
                    <option value="keyword">Exact Keyword Match</option>
                    <option value="default_welcome">First Welcome Message</option>
                    <option value="outside_hours">Outside Business Hours</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Trigger Keywords (comma separated)</label>
                <input
                  type="text"
                  placeholder="price, cost, quote, solar, inverter, package"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Auto-Reply Content / Template</label>
                <textarea
                  rows={4}
                  placeholder="Type the message that will be sent back automatically..."
                  value={editingRule.response_text || ''}
                  onChange={(e) => setEditingRule({ ...editingRule, response_text: e.target.value })}
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Execution Priority (1 - 10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={editingRule.priority || 5}
                    onChange={(e) => setEditingRule({ ...editingRule, priority: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group toggle-field">
                  <label className="checkbox-lbl">
                    <input
                      type="checkbox"
                      checked={editingRule.enabled}
                      onChange={(e) => setEditingRule({ ...editingRule, enabled: e.target.checked })}
                    />
                    Enable Rule Immediately
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSaveRule} disabled={saving} className="btn-primary">
                {saving ? <RefreshCw className="spin-anim" /> : null} Save Autoresponder Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoped Styles */}
      <style jsx>{`
        .autoresponders-admin-page {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-row h2 {
          font-size: 1.5rem;
          color: #f8fafc;
          margin: 0;
        }

        .header-row p {
          color: #94a3b8;
          font-size: 0.88rem;
          margin-top: 4px;
        }

        .metrics-banner {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          padding: 20px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .metric-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .metric-num {
          font-size: 1.5rem;
          font-weight: 800;
          color: #06b6d4;
        }

        .metric-tag {
          font-size: 0.78rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .rules-section {
          padding: 20px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 1.1rem;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .rule-card {
          padding: 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.2s;
        }

        .rule-card.disabled {
          opacity: 0.5;
        }

        .rule-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .rule-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .channel-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          background: rgba(255, 255, 255, 0.06);
          padding: 4px 10px;
          border-radius: 20px;
          color: #f8fafc;
        }

        .rule-title-group h4 {
          margin: 0;
          font-size: 1rem;
          color: #f8fafc;
        }

        .rule-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }

        .toggle-btn.on { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .toggle-btn.off { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

        .btn-icon {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-icon:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
        .btn-icon.delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

        .rule-details {
          display: flex;
          gap: 16px;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 8px;
        }

        .keywords-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .kw-lbl {
          font-size: 0.75rem;
          color: #64748b;
        }

        .kw-chip {
          background: rgba(6, 182, 212, 0.15);
          color: #38bdf8;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .response-preview {
          background: rgba(0, 0, 0, 0.3);
          padding: 10px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #e2e8f0;
          border-left: 3px solid #06b6d4;
        }

        .tester-section {
          padding: 20px;
          border-radius: 12px;
          background: rgba(13, 19, 33, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .tester-inputs {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }

        .channel-select {
          background: rgba(6, 11, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          color: #fff;
          padding: 0 12px;
        }

        .test-input {
          flex: 1;
          background: rgba(6, 11, 22, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 14px;
          color: #fff;
          outline: none;
        }

        .test-output-box {
          margin-top: 14px;
          padding: 14px;
          border-radius: 8px;
        }

        .test-output-box.matched {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
        }

        .test-output-box.fallback {
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fbbf24;
        }

        .output-status {
          font-weight: 700;
          font-size: 0.82rem;
          margin-bottom: 6px;
        }

        .output-reply {
          font-size: 0.88rem;
          color: #f8fafc;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          width: 540px;
          max-width: 90vw;
          background: #0b1120;
          border: 1px solid rgba(6, 182, 212, 0.3);
          border-radius: 14px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          margin: 0;
          color: #f8fafc;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          background: rgba(6, 11, 22, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          padding: 10px 12px;
          color: #fff;
          outline: none;
        }

        .toggle-field {
          justify-content: flex-end;
        }

        .checkbox-lbl {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #f8fafc;
          cursor: pointer;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
