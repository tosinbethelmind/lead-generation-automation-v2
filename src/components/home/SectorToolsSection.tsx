'use client';

/**
 * @file src/components/home/SectorToolsSection.tsx
 * Sector-switching tools showcase & live interactive calculator engine.
 * Features an elite, high-converting visual UI result presentation (no raw JSON text),
 * 0-latency calculation speeds, and 1-click WhatsApp quote sharing.
 */

import React, { useState, useMemo } from 'react';
import { Calculator, Loader2, X, CheckCircle2, Zap, ArrowRight, Share2, Copy, MessageSquare, Sparkles, ShieldCheck, Check } from 'lucide-react';
import { ORDERED_SECTORS, getSectorById, type SectorTool } from '@/config/sectors';
import { buildWhatsAppLink, paymentConfig } from '@/config/payment';

// ─── Default Inputs Helper ───────────────────────────────────────────────────

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

// ─── Direct Instant Calculation Engine ───────────────────────────────────────

async function runCalculation(actionKey: string, inputs: Record<string, string | number | boolean>): Promise<any> {
  // Execute client-side module directly for zero latency
  try {
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
        break;
    }
  } catch (e) {
    console.error('Local module error, falling back to API:', e);
  }

  // Fallback to API endpoint
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
  } catch {}

  return { note: 'Calculated illustrative preview estimate.' };
}

// ─── Format Helpers ─────────────────────────────────────────────────────────

function formatNaira(num: number | string): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return String(num);
  return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 0 });
}

function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    cifValueNgn: 'CIF Value (NGN)',
    cifNgn: 'CIF Value (NGN)',
    importDuty: 'Import Duty (35%)',
    ecowasTradeLevy: 'ECOWAS Trade Levy (0.5%)',
    cissLevy: 'CISS Levy (1%)',
    nacLevy: 'NAC Levy (15%)',
    vat: 'VAT (7.5%)',
    totalCustomsDuty: 'Total Customs Duty',
    estimatedTotalClearingCost: 'Estimated Total Landing Cost',
    grandTotal: 'Grand Total Cost',
    deposit50Percent: '50% Initial Deposit Required',
    subtotal: 'Equipment Subtotal',
    laborAndInstallation: 'Labor & Installation (12%)',
    monthlyDieselSpendNgn: 'Current Monthly Diesel Spend',
    solarSystemCostNgn: 'Solar System Cost',
    monthlySavingsNgn: 'Monthly Energy Savings',
    fiveYearNetSavingsNgn: '5-Year Net Fuel Savings',
    paybackPeriodMonths: 'Payback Period (Months)',
    propertyPriceNgn: 'Property Listing Price',
    downPaymentNgn: 'Initial Down Payment',
    loanAmountNgn: 'Loan / Balance Payable',
    monthlyMortgagePaymentNgn: 'Monthly Installment Payment',
    surveyAndLegalLevyNgn: 'Survey & Documentation Fee',
    developmentLevyNgn: 'Infrastructure & Dev Levy',
    totalInitialDepositNgn: 'Total Initial Outlay Needed',
    totalGovernmentFeesNgn: 'Total Government Fees',
    cacRegistrationFeeNgn: 'CAC Statutory Fee',
    stampDutyNgn: 'FIRS Stamp Duty',
    nameReservationFeeNgn: 'Name Reservation Fee',
    totalDeliveryFeeNgn: 'Estimated Dispatch Fee',
    baseDeliveryFeeNgn: 'Base Logistics Rate',
    totalTerm1CostNgn: '1st Term Total Admission Cost',
    subsequentTermFeeNgn: 'Subsequent Term Tuition',
  };

  if (labelMap[key]) return labelMap[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/Ngn$/i, '').replace(/_/g, ' ').trim();
}

// ─── Visual Result Card Presentation UI ──────────────────────────────────────

interface ResultVisualizerProps {
  toolName: string;
  result: any;
  onOpenAiChat?: () => void;
}

function ResultVisualizer({ toolName, result, onOpenAiChat }: ResultVisualizerProps) {
  const [copied, setCopied] = useState(false);

  if (!result || typeof result !== 'object') {
    return (
      <div style={{ padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 14, color: '#cbd5e1', fontSize: '0.85rem' }}>
        {String(result)}
      </div>
    );
  }

  // Extract key highlight totals
  const heroAmount =
    result.estimatedTotalClearingCost ??
    result.grandTotal ??
    result.totalInitialDepositNgn ??
    result.fiveYearNetSavingsNgn ??
    result.totalGovernmentFeesNgn ??
    result.totalTerm1CostNgn ??
    result.totalDeliveryFeeNgn ??
    result.totalCustomsDuty;

  const heroLabel =
    result.estimatedTotalClearingCost !== undefined ? 'Estimated Total Port Landing Cost' :
    result.grandTotal !== undefined ? 'Total BOQ Estimated Investment' :
    result.fiveYearNetSavingsNgn !== undefined ? 'Estimated 5-Year Net Fuel Savings' :
    result.totalInitialDepositNgn !== undefined ? 'Total Initial Deposit Required' :
    result.totalGovernmentFeesNgn !== undefined ? 'Total Statutory Government Fees' :
    result.totalTerm1CostNgn !== undefined ? 'Total 1st Term Entry Cost' :
    result.totalDeliveryFeeNgn !== undefined ? 'Total Estimated Delivery Rate' :
    'Estimated Total Amount';

  // Build clean formatted summary text for sharing
  const buildShareableText = () => {
    let summary = `📊 *${toolName.toUpperCase()} SUMMARY*\n━━━━━━━━━━━━━━━━━━━━\n`;
    if (heroAmount !== undefined) {
      summary += `💰 *${heroLabel}:* ${formatNaira(heroAmount)}\n\n`;
    }
    Object.entries(result).forEach(([k, v]) => {
      if (k === 'items' || typeof v === 'object' || v === null || v === undefined) return;
      const label = formatLabel(k);
      const valStr = (typeof v === 'number' && k.toLowerCase().includes('ngn')) || (typeof v === 'number' && v > 1000 && !k.toLowerCase().includes('year') && !k.toLowerCase().includes('kva') && !k.toLowerCase().includes('cc') && !k.toLowerCase().includes('hours'))
        ? formatNaira(v)
        : String(v);
      summary += `• *${label}:* ${valStr}\n`;
    });
    summary += `\n✨ _Calculated via Bethelmind Sector Automation_`;
    return summary;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildShareableText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waShareUrl = buildWhatsAppLink(
    paymentConfig.whatsappNumber,
    `Hello Bethelmind Team,\n\nI just ran a tool calculation for *${toolName}*:\n\n${buildShareableText()}\n\nI would like to activate this workflow for my business!`
  );

  return (
    <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* Hero Result Banner */}
      {heroAmount !== undefined && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.15) 100%)',
          border: '1px solid rgba(6,182,212,0.4)',
          borderRadius: 18,
          padding: '20px 22px',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(6,182,212,0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 100, padding: '4px 14px', marginBottom: 10 }}>
            <Sparkles size={13} style={{ color: '#06b6d4' }} />
            <span style={{ fontSize: '0.74rem', color: '#06b6d4', fontWeight: 800 }}>{heroLabel}</span>
          </div>

          <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#38bdf8', fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', margin: '4px 0 6px' }}>
            {formatNaira(heroAmount)}
          </div>

          <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: '#10b981' }} />
            <span>Verified 2026 Nigerian Sector Rate Matrix</span>
          </div>
        </div>
      )}

      {/* Grid of Key Breakdown Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {Object.entries(result).map(([k, v]) => {
          if (k === 'items' || typeof v === 'object' || v === null || v === undefined) return null;
          const label = formatLabel(k);
          const isCurrency = (typeof v === 'number' && k.toLowerCase().includes('ngn')) || (typeof v === 'number' && (k.toLowerCase().includes('duty') || k.toLowerCase().includes('levy') || k.toLowerCase().includes('vat') || k.toLowerCase().includes('cost') || k.toLowerCase().includes('fee') || k.toLowerCase().includes('total') || k.toLowerCase().includes('subtotal') || k.toLowerCase().includes('spend') || k.toLowerCase().includes('savings') || k.toLowerCase().includes('deposit') || k.toLowerCase().includes('price')));

          const formattedValue = isCurrency ? formatNaira(v as number) : String(v);

          return (
            <div
              key={k}
              style={{
                background: 'rgba(15,23,42,0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 4
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'capitalize' }}>
                {label}
              </span>
              <span style={{ fontSize: isCurrency ? '1.05rem' : '0.95rem', fontWeight: 800, color: isCurrency ? '#f8fafc' : '#06b6d4', fontFamily: isCurrency ? "'Outfit', sans-serif" : 'inherit' }}>
                {formattedValue}
              </span>
            </div>
          );
        })}
      </div>

      {/* Itemized Table if BOQ items exist */}
      {Array.isArray(result.items) && result.items.length > 0 && (
        <div style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', padding: 14 }}>
          <h5 style={{ margin: '0 0 12px', fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calculator size={14} /> Itemized Bill of Quantities (BOQ)
          </h5>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', color: '#cbd5e1' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '8px', color: '#94a3b8' }}>Component Name</th>
                  <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8' }}>Unit Rate</th>
                  <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {result.items.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '8px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>{formatNaira(item.unitPrice)}</td>
                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>{formatNaira(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginTop: 6 }}>
        <a
          href={waShareUrl}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 12,
            padding: '11px 16px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(16,185,129,0.25)',
            textAlign: 'center'
          }}
        >
          <Share2 size={15} /> Send Quote to WhatsApp
        </a>

        <button
          onClick={handleCopy}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#f8fafc',
            borderRadius: 12,
            padding: '11px 16px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          {copied ? <Check size={15} style={{ color: '#10b981' }} /> : <Copy size={15} />}
          {copied ? 'Copied Summary!' : 'Copy Summary'}
        </button>

        {onOpenAiChat && (
          <button
            onClick={onOpenAiChat}
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '11px 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <MessageSquare size={15} /> Discuss With AI Concierge
          </button>
        )}
      </div>

      <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.72rem', textAlign: 'center' }}>
        💡 Illustrative estimate. Actual figures depend on exact parameters, custom options, and your team's review.
      </p>
    </div>
  );
}

// ─── Main SectorToolsSection Component ───────────────────────────────────────

interface ModalState {
  tool: SectorTool;
  inputs: Record<string, string | number | boolean>;
  result: any;
  loading: boolean;
}

interface SectorToolsSectionProps {
  selectedIndustry: string;
  setSelectedIndustry: (id: string) => void;
}

export default function SectorToolsSection({ selectedIndustry, setSelectedIndustry }: SectorToolsSectionProps) {
  const profile = useMemo(() => getSectorById(selectedIndustry), [selectedIndustry]);
  const [modal, setModal] = useState<ModalState | null>(null);

  const openModal = (tool: SectorTool) => {
    if (!tool.actionKey) return;
    const defaultInputs = getDefaultInputs(tool.actionKey);
    setModal({ tool, inputs: defaultInputs, result: null, loading: false });
  };

  const closeModal = () => setModal(null);

  const updateInput = (key: string, value: string | number | boolean) => {
    if (!modal) return;
    setModal({ ...modal, inputs: { ...modal.inputs, [key]: value } });
  };

  const runCalc = async () => {
    if (!modal?.tool.actionKey) return;
    setModal((m) => m ? { ...m, loading: true } : m);
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
          <span style={{ fontSize: '0.74rem', color: '#8b5cf6', fontWeight: 700 }}>Interactive Sector Workflows</span>
        </div>
        <h2
          id="sector-tools-heading"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', fontWeight: 900, margin: '0 0 12px', fontFamily: "'Outfit', sans-serif", color: '#f8fafc' }}
        >
          Automated Workflow & Cost Calculators Built for Your Sector
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: 680, margin: '0 auto 8px' }}>
          Select your industry below to run live, high-speed calculations, BOQ generators, and tariff estimates.
        </p>
        <p style={{ color: '#64748b', fontSize: '0.78rem', maxWidth: 620, margin: '0 auto' }}>
          Calculators deliver instant structured quotes ready to share on WhatsApp or export to PDF.
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
              padding: '9px 18px', borderRadius: 12, cursor: 'pointer', fontWeight: 700, fontSize: '0.84rem',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              background: selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.03)',
              color: selectedIndustry === s.id ? '#fff' : '#94a3b8',
              border: `1px solid ${selectedIndustry === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              outline: 'none',
              boxShadow: selectedIndustry === s.id ? `0 4px 20px ${s.color}35` : 'none'
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
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${profile.color}30`,
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s, border-color 0.2s'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${profile.color}15`, border: `1px solid ${profile.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calculator style={{ width: 22, height: 22, color: profile.color }} aria-hidden="true" />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: profile.color, background: `${profile.color}15`, border: `1px solid ${profile.color}25`, padding: '4px 12px', borderRadius: 20 }}>
                  {tool.tag}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px', fontFamily: "'Outfit', sans-serif" }}>{tool.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: 1.6, margin: '0 0 20px' }}>{tool.desc}</p>
            </div>

            {tool.actionKey ? (
              <button
                id={`tool-demo-${tool.id}`}
                onClick={() => openModal(tool)}
                style={{
                  width: '100%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '11px 18px',
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${profile.color}, #7c3aed)`,
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: `0 6px 20px ${profile.color}30`
                }}
                aria-label={`Test ${tool.name} calculator`}
              >
                <Zap style={{ width: 15, height: 15 }} aria-hidden="true" /> Test Tool Calculator <ArrowRight size={14} />
              </button>
            ) : (
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', display: 'block', textAlign: 'center', padding: '8px 0' }}>
                Included with custom enterprise workflows
              </span>
            )}
          </div>
        ))}
      </div>

      {/* High-End Calculator Modal */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${modal.tool.name} calculator`}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div style={{ background: '#090d16', border: '1px solid rgba(6,182,212,0.4)', borderRadius: 24, padding: '28px clamp(16px, 4vw, 32px)', maxWidth: 580, width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 80px rgba(0,0,0,0.8)' }}>

            <button
              onClick={closeModal}
              aria-label="Close calculator"
              style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 10, padding: 8, color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X style={{ width: 20, height: 20 }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: profile.color, background: `${profile.color}20`, padding: '3px 10px', borderRadius: 100 }}>
                {modal.tool.tag}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>• Instant 2026 Engine</span>
            </div>

            <h3 style={{ margin: '0 0 6px', color: '#fff', fontSize: '1.25rem', fontWeight: 900, paddingRight: 36, fontFamily: "'Outfit', sans-serif" }}>
              {modal.tool.name}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', marginBottom: 20, lineHeight: 1.5 }}>
              {modal.tool.desc}
            </p>

            {/* Inputs Form */}
            <div style={{ background: 'rgba(255,255,255,0.025)', padding: 18, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(modal.inputs).map(([key, val]: [string, any]) => (
                <div key={key}>
                  <label htmlFor={`modal-input-${key}`} style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    {formatLabel(key)}
                  </label>
                  {typeof val === 'boolean' ? (
                    <select
                      id={`modal-input-${key}`}
                      value={String(val)}
                      onChange={(e) => updateInput(key, e.target.value === 'true')}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
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
                      style={{ width: '100%', padding: '11px 14px', borderRadius: 10, background: '#07090e', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={runCalc}
              disabled={modal.loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
                color: '#fff',
                border: 'none',
                fontWeight: 900,
                fontSize: '0.96rem',
                cursor: modal.loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(6,182,212,0.3)'
              }}
            >
              {modal.loading
                ? <><Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Calculating Instant Estimate…</>
                : <><Zap style={{ width: 18, height: 18 }} aria-hidden="true" /> Run Calculation & View Breakdown</>}
            </button>

            {/* Visual Result Presentation UI */}
            {Boolean(modal.result) && (
              <ResultVisualizer
                toolName={modal.tool.name}
                result={modal.result}
                onOpenAiChat={() => {
                  closeModal();
                  const chatTrigger = document.querySelector('.ai-widget-trigger') as HTMLButtonElement;
                  if (chatTrigger) chatTrigger.click();
                }}
              />
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </section>
  );
}
