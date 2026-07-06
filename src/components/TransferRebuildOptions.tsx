import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle, Smartphone, Globe, Code, ArrowRight } from 'lucide-react';

interface TransferRebuildOptionsProps {
  lead: any;
  onSuccess?: (previewUrl: string) => void;
}

// Features aligned with LandingPage's interactive automation demos
const FEATURE_CATALOG = [
  { id: 'quote_estimator', label: 'Smart Project Estimator & Invoicing', cost: 35000, desc: 'Clients calculate service price quotes in real-time and generate branded invoices.' },
  { id: 'patient_intake', label: 'Appointment Booking & Intake Portal', cost: 35000, desc: 'Clients self-schedule appointments and fill out digital intake forms.' },
  { id: 'ecommerce', label: 'Paystack Shopping Checkout Integration', cost: 50000, desc: 'Sell products online with shopping cart checkout and secure payments.' },
  { id: 'vehicle_valuation', label: 'Smart Asset Valuation Calculator', cost: 30000, desc: 'Offer prospective clients instant asset appraisals to capture high-value sales leads.' },
  { id: 'table_reservation', label: 'Table & Seat Reservation System', cost: 25000, desc: 'Allow guests to reserve dining tables, pick time slots, and pre-order food.' }
];

export const TransferRebuildOptions: React.FC<TransferRebuildOptionsProps> = ({ lead, onSuccess }) => {
  const [strategy, setStrategy] = useState<'full_rebuild' | 'plugin' | 'script_embed'>('full_rebuild');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [cost, setCost] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize selected features from lead's existing suggestions or selections
  useEffect(() => {
    if (lead?.selectedFeatures && Array.isArray(lead.selectedFeatures)) {
      setSelectedFeatures(lead.selectedFeatures);
    } else if (lead?.pluginSuggestions) {
      try {
        const parsed = Array.isArray(lead.pluginSuggestions)
          ? lead.pluginSuggestions
          : JSON.parse(lead.pluginSuggestions);
        // Map common suggestions to FEATURE_CATALOG IDs
        const initial: string[] = [];
        if (parsed.some((p: string) => p.toLowerCase().includes('form') || p.toLowerCase().includes('book'))) {
          initial.push('patient_intake');
        }
        if (parsed.some((p: string) => p.toLowerCase().includes('pay') || p.toLowerCase().includes('store'))) {
          initial.push('ecommerce');
        }
        if (parsed.some((p: string) => p.toLowerCase().includes('quote') || p.toLowerCase().includes('estimate'))) {
          initial.push('quote_estimator');
        }
        setSelectedFeatures(initial);
      } catch (e) {
        // Fallback
      }
    }
  }, [lead]);

  // Set initial strategy based on lead recommendation
  useEffect(() => {
    if (lead?.upgradeStrategy && ['full_rebuild', 'plugin', 'script_embed'].includes(lead.upgradeStrategy)) {
      setStrategy(lead.upgradeStrategy);
    }
  }, [lead]);

  // Re-calculate cost whenever strategy or features change
  useEffect(() => {
    let base = 0;
    if (strategy === 'full_rebuild') base = 600000;
    else if (strategy === 'plugin') base = 250000;
    else base = 65000; // script_embed

    const featuresCost = selectedFeatures.reduce((sum, fid) => {
      const f = FEATURE_CATALOG.find((x) => x.id === fid);
      return sum + (f?.cost || 0);
    }, 0);
    setCost(base + featuresCost);
  }, [strategy, selectedFeatures]);

  const toggleFeature = (fid: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(fid) ? prev.filter((x) => x !== fid) : [...prev, fid]
    );
  };

  const handleProceed = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch('/api/transfer-rebuild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.lead_id || lead.id,
          strategy,
          selectedFeatures,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || 'Failed to start transfer');
      }
      const data = await resp.json();
      if (onSuccess) {
        onSuccess(data.previewUrl);
      } else {
        alert(`Transfer setup updated! Estimated cost: ₦${cost.toLocaleString()}`);
        window.location.reload();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      padding: '32px',
      marginTop: '24px',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
      textAlign: 'left'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1f2937', marginBottom: '8px', marginTop: 0 }}>
        Customize Upgrade Path & Options
      </h3>
      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
        Choose your integration model and toggle the features you want activated. Our automated pipeline handles the setup.
      </p>

      {/* Strategy Selector Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {[
          {
            value: 'full_rebuild',
            label: 'Full Rebuild',
            price: '₦600,000',
            desc: 'Complete static Next.js rebuild. Ultra-fast speeds & modern design.',
            icon: <Globe size={20} />
          },
          {
            value: 'plugin',
            label: 'Plugin Integration',
            price: '₦250,000',
            desc: 'Direct CMS plugin/shortcode integration for WordPress & Shopify.',
            icon: <Smartphone size={20} />
          },
          {
            value: 'script_embed',
            label: 'Script Embed',
            price: '₦65,000',
            desc: 'Lightweight JavaScript embed code. Fits any custom HTML/JS site.',
            icon: <Code size={20} />
          }
        ].map((opt) => {
          const isSelected = strategy === opt.value;
          return (
            <div
              key={opt.value}
              onClick={() => setStrategy(opt.value as any)}
              style={{
                border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background: isSelected ? '#f0f9ff' : '#ffffff',
                transition: 'all 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  color: isSelected ? '#0284c7' : '#4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {opt.icon}
                  <strong style={{ fontSize: '0.95rem' }}>{opt.label}</strong>
                </span>
                <input
                  type="radio"
                  name="upgradeStrategy"
                  value={opt.value}
                  checked={isSelected}
                  onChange={() => setStrategy(opt.value as any)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                {opt.desc}
              </p>
              <span style={{
                marginTop: 'auto',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isSelected ? '#0369a1' : '#1f2937'
              }}>
                Base: {opt.price}
              </span>
            </div>
          );
        })}
      </div>

      {/* Feature Selection checklist */}
      <div style={{ marginBottom: '28px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '12px', marginTop: 0 }}>
          Select Add-on Features:
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {FEATURE_CATALOG.map((f) => {
            const isSelected = selectedFeatures.includes(f.id);
            return (
              <label
                key={f.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '12px 16px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  background: isSelected ? '#f8fafc' : '#ffffff',
                  transition: 'background 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleFeature(f.id)}
                  style={{ marginTop: '3px', marginRight: '12px', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1f2937' }}>{f.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0ea5e9' }}>+₦{f.cost.toLocaleString()}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.3 }}>
                    {f.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Cost summary and submit */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '20px',
        borderTop: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f766e' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Guaranteed Safe Delivery</span>
          </div>
          <div style={{ marginTop: '4px' }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Estimated Setup: </span>
            <strong style={{ fontSize: '1.4rem', color: '#0f766e' }}>₦{cost.toLocaleString()}</strong>
          </div>
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0 }}>{error}</p>}

        <button
          onClick={handleProceed}
          disabled={submitting}
          style={{
            background: '#0ea5e9',
            border: 'none',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s',
            fontSize: '0.95rem'
          }}
          onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {submitting ? 'Updating Setup...' : 'Lock In Configuration'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
