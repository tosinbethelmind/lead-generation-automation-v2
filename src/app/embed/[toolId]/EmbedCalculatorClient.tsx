'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Zap, Loader2, Share2, Copy, Check, ExternalLink } from 'lucide-react';

interface EmbedCalculatorClientProps {
  toolId: string;
}

export default function EmbedCalculatorClient({ toolId }: EmbedCalculatorClientProps) {
  const searchParams = useSearchParams();
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engineMeta, setEngineMeta] = useState<{ name: string; tag: string; color: string; desc: string }>({
    name: toolId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    tag: '2026 Engine',
    color: '#06b6d4',
    desc: 'Instant 2026 Nigerian Business Calculation Engine',
  });

  useEffect(() => {
    // Initial fetch to get default inputs and compute initial state
    fetch('/api/sector-tools')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.sectors) {
          for (const s of Object.values(data.sectors) as any[]) {
            const foundTool = s.tools?.find((t: any) => t.actionKey === toolId || t.id === toolId);
            if (foundTool) {
              setEngineMeta({
                name: foundTool.name,
                tag: foundTool.tag || s.badge,
                color: s.color || '#06b6d4',
                desc: foundTool.desc || s.topToolDesc,
              });
              break;
            }
          }
        }
      })
      .catch(() => {});

    // Set initial sample inputs based on query params or defaults
    const initialInputs: Record<string, any> = {};
    searchParams.forEach((val, key) => {
      if (val === 'true') initialInputs[key] = true;
      else if (val === 'false') initialInputs[key] = false;
      else if (!isNaN(Number(val)) && val.trim() !== '') initialInputs[key] = Number(val);
      else initialInputs[key] = val;
    });

    // Run initial calculation
    runCalculation(initialInputs);
  }, [toolId]);

  const runCalculation = async (currentInputs = inputs) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sector-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: toolId, ...currentInputs }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.result) {
          setResult(data.result);
          // Set inputs if not yet set
          if (Object.keys(inputs).length === 0 && data.result) {
            const filteredInputs: Record<string, any> = {};
            Object.entries(data.result).forEach(([k, v]) => {
              if (
                typeof v !== 'object' &&
                !k.toLowerCase().includes('status') &&
                !k.toLowerCase().includes('remark') &&
                !k.toLowerCase().includes('note') &&
                !k.toLowerCase().includes('total') &&
                !k.toLowerCase().includes('subtotal')
              ) {
                filteredInputs[k] = v;
              }
            });
            setInputs({ ...filteredInputs, ...currentInputs });
          }
        }
      }
    } catch (e) {
      console.error('Calculation error:', e);
    } finally {
      setLoading(false);
    }
  };

  const updateInput = (key: string, val: any) => {
    const updated = { ...inputs, [key]: val };
    setInputs(updated);
  };

  const formatNaira = (num: number | string) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(n)) return String(num);
    return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/Ngn$/i, '')
      .replace(/_/g, ' ')
      .trim();
  };

  const handleCopy = () => {
    if (!result) return;
    const summary = Object.entries(result)
      .map(([k, v]) => `${formatLabel(k)}: ${typeof v === 'number' && k.toLowerCase().includes('ngn') ? formatNaira(v) : v}`)
      .join('\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waShareUrl = result
    ? `https://wa.me/?text=${encodeURIComponent(
        `*${engineMeta.name} — Quote Estimate*\n\n` +
          Object.entries(result)
            .filter(([k, v]) => typeof v !== 'object')
            .map(([k, v]) => `• ${formatLabel(k)}: ${typeof v === 'number' && k.toLowerCase().includes('ngn') ? formatNaira(v) : v}`)
            .join('\n') +
          `\n\n_Powered by Bethelmind Analytics_`
      )}`
    : '#';

  return (
    <div
      style={{
        fontFamily: "'Outfit', Inter, -apple-system, sans-serif",
        background: '#070a12',
        color: '#f8fafc',
        padding: '24px clamp(16px, 4vw, 28px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        maxWidth: 600,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: engineMeta.color,
            background: `${engineMeta.color}15`,
            border: `1px solid ${engineMeta.color}30`,
            padding: '3px 10px',
            borderRadius: 100,
          }}
        >
          {engineMeta.tag}
        </span>
        <a
          href="https://www.bethelmindanalytics.com"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.72rem', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          Bethelmind Analytics <ExternalLink size={11} />
        </a>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0 0 6px', color: '#fff', letterSpacing: '-0.01em' }}>
        {engineMeta.name}
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: '0 0 20px', lineHeight: 1.5 }}>
        {engineMeta.desc}
      </p>

      {/* Input Fields */}
      {Object.keys(inputs).length > 0 && (
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: 18,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {Object.entries(inputs).map(([key, val]) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: '0.76rem', color: '#cbd5e1', fontWeight: 600, marginBottom: 5 }}>
                {formatLabel(key)}
              </label>
              {typeof val === 'boolean' ? (
                <select
                  value={String(val)}
                  onChange={(e) => updateInput(key, e.target.value === 'true')}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#0c101c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <input
                  type={typeof val === 'number' ? 'number' : 'text'}
                  value={String(val)}
                  onChange={(e) => updateInput(key, typeof val === 'number' ? Number(e.target.value) : e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: '#0c101c',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>
          ))}

          <button
            onClick={() => runCalculation(inputs)}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: 6,
              padding: '13px',
              borderRadius: 12,
              background: `linear-gradient(135deg, ${engineMeta.color}, #7c3aed)`,
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: `0 8px 24px ${engineMeta.color}35`,
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Calculating…
              </>
            ) : (
              <>
                <Zap size={16} /> Recalculate Estimate
              </>
            )}
          </button>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
            {Object.entries(result).map(([k, v]) => {
              if (typeof v === 'object' || v === null || v === undefined) return null;
              const isCurrency =
                typeof v === 'number' &&
                (k.toLowerCase().includes('ngn') ||
                  k.toLowerCase().includes('total') ||
                  k.toLowerCase().includes('subtotal') ||
                  k.toLowerCase().includes('fee') ||
                  k.toLowerCase().includes('duty') ||
                  k.toLowerCase().includes('cost') ||
                  k.toLowerCase().includes('payout'));

              return (
                <div
                  key={k}
                  style={{
                    background: 'rgba(15,23,42,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{formatLabel(k)}</span>
                  <span style={{ fontSize: isCurrency ? '1rem' : '0.9rem', fontWeight: 800, color: isCurrency ? '#f8fafc' : '#38bdf8', marginTop: 4 }}>
                    {isCurrency ? formatNaira(v as number) : String(v)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
            <a
              href={waShareUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
              }}
            >
              <Share2 size={14} /> Send to WhatsApp
            </a>

            <button
              onClick={handleCopy}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#f8fafc',
                borderRadius: 10,
                padding: '10px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Summary'}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
