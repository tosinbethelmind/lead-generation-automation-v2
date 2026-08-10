'use client';

/**
 * @file src/components/home/SectorToolsSection.tsx
 * Sector-switching tools showcase. Preserves the existing interactive
 * sector-tab UI and live API calculator functionality.
 * All copy updated — no false guarantees or unconfigured integration claims.
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Loader2, X, CheckCircle, Zap } from 'lucide-react';
import { ORDERED_SECTORS, getSectorById, type SectorTool } from '@/config/sectors';

// ─── Tool Calculator Modal ────────────────────────────────────────────────────

interface ModalState {
  tool: SectorTool;
  inputs: Record<string, string | number | boolean>;
  result: any;
  loading: boolean;
}

function getDefaultInputs(actionKey: string): Record<string, string | number | boolean> {
  switch (actionKey) {
    case 'solar_boq': return { kva: 5, batteryType: 'lithium', backupHours: 12 };
    case 'diesel_roi': return { monthlyDieselLiters: 200, pricePerLiter: 1350 };
    case 'tokunbo_duty': return { year: 2018, engineCc: 2500, cifNgn: 8500000 };
    case 'tokunbo_port_clearing': return { year: 2018, engineCc: 2500, cifNgn: 8500000 };
    case 'mortgage_amortization': return { propertyPriceNgn: 45000000, downPaymentPercent: 20, interestRatePercent: 18, tenureYears: 10 };
    case 'healthcare_hmo': return { hmoProvider: 'Reliance HMO', procedureName: 'General Consultation', totalProcedureCostNgn: 25000 };
    case 'cac_fees': return { entityType: 'company_ltd', shareCapital: 1000000 };
    case 'cac_name_check': return { proposedName: 'Example Business Limited' };
    case 'logistics_delivery': return { originCity: 'Lagos (Ikeja)', destinationCity: 'Lagos (Lekki)', weightKg: 5 };
    case 'whatsapp_cart': return { productName: 'Sample Product', quantity: 1 };
    case 'school_tuition': return { gradeLevel: 'JSS 1', isBoarder: false, termCount: 3 };
    default: return { businessName: 'My Business' };
  }
}

async function runCalculation(actionKey: string, inputs: Record<string, string | number | boolean>): Promise<any> {
  // Try the backend first
  try {
    const res = await fetch('/api/sector-tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionKey, ...inputs }),
    });
    if (res.ok) {
      const data = await res.json() as { result?: unknown; success?: boolean };
      if (data && (data.result || data.success)) return data.result ?? data;
    }
  } catch { /* fall through to client-side */ }

  // Client-side fallback
  const {
    generateSolarBOQ,
    calculateDieselVsSolarROI,
    calculateCustomsDutyTokunbo,
    calculateCacFilingFees,
    calculateMortgageAmortization,
    calculateLogisticsDeliveryFee,
    calculateSchoolTuitionAndPin,
  } = await import('@/lib/sectorModules');

  switch (actionKey) {
    case 'solar_boq':
      return generateSolarBOQ(Number(inputs.kva || 5), (inputs.batteryType as 'gel' | 'lithium') || 'lithium', Number(inputs.backupHours || 12));
    case 'diesel_roi':
      return calculateDieselVsSolarROI(Number(inputs.monthlyDieselLiters || 200), Number(inputs.pricePerLiter || 1350));
    case 'tokunbo_duty':
    case 'tokunbo_port_clearing':
      return calculateCustomsDutyTokunbo(Number(inputs.year || 2018), Number(inputs.engineCc || 2500), Number(inputs.cifNgn || 8500000));
    case 'mortgage_amortization':
      return calculateMortgageAmortization(Number(inputs.propertyPriceNgn || 45000000), Number(inputs.downPaymentPercent || 20), Number(inputs.interestRatePercent || 18), Number(inputs.tenureYears || 10));
    case 'cac_fees':
      return calculateCacFilingFees((inputs.entityType as 'business_name' | 'company_ltd' | 'incorporated_trustee') || 'company_ltd', Number(inputs.shareCapital || 1000000));
    case 'logistics_delivery':
      return calculateLogisticsDeliveryFee(String(inputs.originCity || 'Lagos (Ikeja)'), String(inputs.destinationCity || 'Lagos (Lekki)'), Number(inputs.weightKg || 5));
    case 'school_tuition':
      return calculateSchoolTuitionAndPin(String(inputs.gradeLevel || 'JSS 1'), Boolean(inputs.isBoarder), Number(inputs.termCount || 3));
    default:
      return { note: 'Calculation preview. Contact us for a tailored estimate for your business.' };
  }
}

// ─── Main Section ─────────────────────────────────────────────────────────────

interface SectorToolsSectionProps {
  selectedIndustry: string;
  setSelectedIndustry: (id: string) => void;
}

export default function SectorToolsSection({ selectedIndustry, setSelectedIndustry }: SectorToolsSectionProps) {
  const profile = useMemo(() => getSectorById(selectedIndustry), [selectedIndustry]);
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = (tool: SectorTool) => {
    if (!tool.actionKey) return;
    setModal({ tool, inputs: getDefaultInputs(tool.actionKey), result: null, loading: false });
  };

  const closeModal = () => setModal(null);

  const updateInput = (key: string, value: string | number | boolean) => {
    if (!modal) return;
    setModal({ ...modal, inputs: { ...modal.inputs, [key]: value } });
  };

  const runCalc = async () => {
    if (!modal?.tool.actionKey) return;
    setModal((m) => m ? { ...m, loading: true, result: null } : m);
    const result = await runCalculation(modal.tool.actionKey, modal.inputs);
    setModal((m) => m ? { ...m, loading: false, result } : m);
  };

  return (
    <section
      id="sector-tools"
      aria-labelledby="sector-tools-heading"
      style={{ padding: '72px clamp(16px, 4vw, 40px)', maxWidth: 1200, margin: '0 auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 100, padding: '5px 14px', marginBottom: 14 }}>
          <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 700 }}>Sector Tools</span>
        </div>
        <h2
          id="sector-tools-heading"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
        >
          Workflow Tools Built for Your Industry
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 620, margin: '0 auto 8px' }}>
          Select your sector below to see recommended workflow tools. Calculators are illustrative — your team reviews and confirms all outputs.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.78rem', maxWidth: 620, margin: '0 auto' }}>
          Tools, implementation scope, and available integrations vary by package and business requirements.
        </p>
      </div>

      {/* Sector Tabs */}
      <div
        role="tablist"
        aria-label="Select your industry sector"
        style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 12, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        {ORDERED_SECTORS.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={selectedIndustry === s.id}
            aria-controls={`sector-panel-${s.id}`}
            id={`sector-tab-${s.id}`}
            onClick={() => setSelectedIndustry(s.id)}
            style={{
              padding: '8px 16px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
              background: selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.03)',
              color: selectedIndustry === s.id ? '#fff' : '#94a3b8',
              border: `1px solid ${selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              outline: 'none',
            }}
          >
            <span aria-hidden="true">{s.emoji}</span> {s.name}
          </button>
        ))}
      </div>

      {/* Tool Cards */}
      <div
        id={`sector-panel-${selectedIndustry}`}
        role="tabpanel"
        aria-labelledby={`sector-tab-${selectedIndustry}`}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}
      >
        {profile.tools.map((tool) => (
          <div
            key={tool.id}
            style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${profile.color}25`, borderRadius: 18, padding: 24 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${profile.color}12`, border: `1px solid ${profile.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator style={{ width: 20, height: 20, color: profile.color }} aria-hidden="true" />
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: profile.color, background: `${profile.color}12`, padding: '3px 10px', borderRadius: 20 }}>
                {tool.tag}
              </span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px' }}>{tool.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 16px' }}>{tool.desc}</p>

            {tool.actionKey ? (
              <button
                id={`tool-demo-${tool.id}`}
                onClick={() => openModal(tool)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: `linear-gradient(135deg, ${profile.color}, #7c3aed)`, color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                aria-label={`Try ${tool.name} calculator`}
              >
                <Zap style={{ width: 13, height: 13 }} aria-hidden="true" /> Try Calculator
              </button>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic' }}>
                Available based on business requirements
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Calculator Modal */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modal.tool.name} calculator`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div style={{ background: '#0f172a', border: '1px solid rgba(6,182,212,0.35)', borderRadius: 24, padding: 28, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

            <button
              onClick={closeModal}
              aria-label="Close calculator"
              style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 6, color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.1rem', fontWeight: 800, paddingRight: 36, fontFamily: "'Outfit', sans-serif" }}>
              {modal.tool.name}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.78rem', marginBottom: 6 }}>
              Illustrative calculator — outputs are estimates for guidance only. Your team reviews and confirms all quotes.
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 20 }}>
              {modal.tool.desc}
            </p>

            {/* Inputs */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(modal.inputs).map(([key, val]: [string, any]) => (
                <div key={key}>
                  <label htmlFor={`modal-input-${key}`} style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'block', marginBottom: 4, textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                  </label>
                  {typeof val === 'boolean' ? (
                    <select
                      id={`modal-input-${key}`}
                      value={String(val)}
                      onChange={(e) => updateInput(key, e.target.value === 'true')}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem' }}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  ) : (
                    <input
                      id={`modal-input-${key}`}
                      type={typeof val === 'number' ? 'number' : 'text'}
                      value={String(val)}
                      onChange={(e) => updateInput(key, typeof val === 'number' ? Number(e.target.value) : e.target.value)}
                      style={{ width: '100%', padding: '9px 10px', borderRadius: 8, background: '#07090e', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={runCalc}
              disabled={modal.loading}
              style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.92rem', cursor: modal.loading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {modal.loading
                ? <><Loader2 style={{ width: 17, height: 17, animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Calculating…</>
                : <><Zap style={{ width: 17, height: 17 }} aria-hidden="true" /> Run Calculation</>}
            </button>

            {Boolean(modal.result) && (
              <div style={{ marginTop: 18, background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: 14, padding: 16 }}>
                <h4 style={{ margin: '0 0 8px', color: '#06b6d4', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle style={{ width: 15, height: 15 }} aria-hidden="true" /> Calculation Result (Estimate)
                </h4>
                <pre style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', background: 'rgba(7,9,14,0.8)', padding: 12, borderRadius: 10, maxHeight: 220, overflowY: 'auto' }}>
                  {Boolean(modal.result) && JSON.stringify(modal.result, null, 2)}
                </pre>
                <p style={{ margin: '10px 0 0', color: '#64748b', fontSize: '0.72rem' }}>
                  This is an illustrative estimate. Actual figures depend on current market rates, your specific requirements, and your team's review.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </section>
  );
}
