'use client';

import React, { useState } from 'react';
import { Smartphone, Send, CheckCircle2, Sparkles, AlertCircle, X, Loader2 } from 'lucide-react';

interface ZeroAgentSandboxingWidgetProps {
  businessName: string;
  leadId?: string;
  category?: string;
}

export function ZeroAgentSandboxingWidget({ businessName, leadId, category }: ZeroAgentSandboxingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendTestOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid WhatsApp phone number');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/preview/test-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          phone,
          sector: category,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to trigger test simulation');
      }

      setSuccessResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error sending test simulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Floating Notification Banner */}
      <div style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        borderBottom: '1px solid rgba(129, 140, 248, 0.3)',
        color: '#fff',
        padding: '10px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.2)',
            padding: '6px',
            borderRadius: '50%',
            color: '#818cf8',
            display: 'flex',
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
              LIVE PREVIEW FOR {businessName.toUpperCase()}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '10px', display: 'inline-block' }}>
              ⚡ Test how real customers will order & pay via your WhatsApp
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Smartphone size={16} />
          Send Test Order To My WhatsApp
        </button>
      </div>

      {/* Interactive Sandboxing Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            color: '#f8fafc',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            {!successResult ? (
              <form onSubmit={handleSendTestOrder}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Smartphone size={24} style={{ color: '#818cf8' }} />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                    Test Live Order Simulation
                  </h3>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>
                  Enter your WhatsApp phone number below. We will send a live customer inquiry simulation directly to your phone so you can feel how leads arrive when your system goes live!
                </p>

                {errorMsg && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#fca5a5',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <AlertCircle size={16} />
                    {errorMsg}
                  </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    YOUR WHATSAPP NUMBER
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08031234567 or 2348031234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending Simulation to WhatsApp...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Live Test Order To My Phone Now
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <CheckCircle2 size={56} style={{ color: '#22c55e', margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
                  Simulation Dispatched!
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                  {successResult.waSent
                    ? `Check your WhatsApp phone (${successResult.sentToPhone})! A live simulated customer invoice has been delivered to your phone.`
                    : `Simulation payload generated for ${successResult.sentToPhone}. Review the live customer order format below:`}
                </p>

                <div style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  color: '#e2e8f0',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                }}>
                  {successResult.simulatedPayload?.message}
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: '10px 24px',
                    background: '#334155',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Back To Live Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
