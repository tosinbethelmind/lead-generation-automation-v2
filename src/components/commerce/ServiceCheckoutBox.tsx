'use client';

import React, { useState } from 'react';
import {
  Building2,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { BRAND_IDENTITY, type CommercialProduct } from '@/lib/commerce/brandIdentity';
import { trackConversionEvent } from '@/lib/commerce/googleTracking';

interface ServiceCheckoutBoxProps {
  product: CommercialProduct;
  onRequestCustomQuote?: () => void;
}

export default function ServiceCheckoutBox({
  product,
  onRequestCustomQuote,
}: ServiceCheckoutBoxProps) {
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [paymentStage, setPaymentStage] = useState<'deposit' | 'full'>(
    product.depositPercent < 100 ? 'deposit' : 'full'
  );
  const [paymentProvider, setPaymentProvider] = useState<'moniepoint' | 'paystack'>('moniepoint');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);

  if (product.pricingMode === 'custom_quote' || product.priceNgn <= 0) {
    return (
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Custom Assessment Required</span>
        </div>
        <h3 className="text-xl font-black text-white">Request a Custom Quote</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {product.description}
        </p>
        {product.milestonesDescription && (
          <p className="text-xs text-slate-400">{product.milestonesDescription}</p>
        )}
        <button
          type="button"
          onClick={() => {
            trackConversionEvent('cta_click', { cta: 'request_custom_quote', product_id: product.id });
            onRequestCustomQuote?.();
          }}
          className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-xs uppercase tracking-wider transition"
        >
          Request a Custom Quote
        </button>
      </div>
    );
  }

  const hasPromo =
    Boolean(product.promoPriceNgn) &&
    Number(product.promoPriceNgn) > 0 &&
    Number(product.promoPriceNgn) < product.priceNgn;
  const baseNgn = hasPromo ? Number(product.promoPriceNgn) : product.priceNgn;

  const activeAddOns = (product.addOns || []).filter((a) => selectedAddOnIds.includes(a.id));
  const addOnsOneTime = activeAddOns.reduce((s, a) => s + Number(a.priceNgn || 0), 0);
  const addOnsMonthly = activeAddOns.reduce((s, a) => s + Number(a.recurringMonthlyNgn || 0), 0);

  const totalNgn = baseNgn + addOnsOneTime;
  const depositNgn = Math.round((totalNgn * (product.depositPercent || 60)) / 100);
  const balanceNgn = Math.max(0, totalNgn - depositNgn);
  const dueNowNgn = paymentStage === 'full' ? totalNgn : depositNgn;
  const recurringMonthlyNgn = Number(product.monthlyMaintenanceNgn || 0) + addOnsMonthly;

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrderResult(null);
    setBusy(true);

    try {
      trackConversionEvent('begin_checkout', {
        package_id: product.id,
        package_name: product.name,
        value: dueNowNgn,
        currency: 'NGN',
      });

      const res = await fetch('/api/commerce/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerWhatsapp: customerWhatsapp.trim() || undefined,
          companyName: companyName.trim() || undefined,
          paymentStage,
          paymentProvider,
          selectedAddOnIds,
        }),
      });
      const data = await res.json();

      if ((!res.ok || !data.success) && paymentProvider === 'paystack') {
        const fbRes = await fetch('/api/commerce/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerWhatsapp: customerWhatsapp.trim() || undefined,
            companyName: companyName.trim() || undefined,
            paymentStage,
            paymentProvider: 'moniepoint',
            selectedAddOnIds,
          }),
        });
        const fbData = await fbRes.json();
        if (fbRes.ok && fbData.success) {
          setOrderResult(fbData);
          return;
        }
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not initialize checkout.');
      }

      if (data.provider === 'paystack' && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      setOrderResult(data);
    } catch (err: any) {
      setError(err.message || 'Payment initialization failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
            Order &amp; Deposit Checkout
          </div>
          <h3 className="text-xl font-black text-white mt-0.5">{product.name}</h3>
        </div>
        <div className="text-right">
          {hasPromo && (
            <div className="text-xs text-slate-400 line-through">
              ₦{product.priceNgn.toLocaleString()}
            </div>
          )}
          <div className="text-2xl font-black text-[#d4af37]">
            {product.pricingMode === 'starting_from' ? 'From ' : ''}₦{baseNgn.toLocaleString()}
          </div>
          {hasPromo && product.promoLabel && (
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
              {product.promoLabel}
            </span>
          )}
        </div>
      </div>

      {/* Optional Add-ons */}
      {product.addOns && product.addOns.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Optional Add-Ons</div>
          <div className="space-y-2">
            {product.addOns.map((addon) => {
              const checked = selectedAddOnIds.includes(addon.id);
              return (
                <label
                  key={addon.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                    checked
                      ? 'bg-[#d4af37]/10 border-[#d4af37]/60 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAddOn(addon.id)}
                    className="mt-0.5 accent-[#d4af37]"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{addon.name}</div>
                    {addon.description && (
                      <div className="text-[11px] text-slate-400 mt-0.5">{addon.description}</div>
                    )}
                  </div>
                  <div className="font-bold text-[#d4af37] whitespace-nowrap">
                    {addon.priceNgn > 0 ? `+₦${addon.priceNgn.toLocaleString()}` : ''}
                    {addon.recurringMonthlyNgn
                      ? `${addon.priceNgn > 0 ? ' + ' : ''}₦${addon.recurringMonthlyNgn.toLocaleString()}/mo`
                      : ''}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Pre-Payment Transparency: Deliverables, Timeline, Exclusions & Recurring Charges */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span>Turnaround Timeline:</span>
          <strong className="text-white">{product.turnaroundTime}</strong>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Recurring Monthly Charge:</span>
          <strong className={recurringMonthlyNgn > 0 ? 'text-amber-300' : 'text-emerald-400'}>
            {recurringMonthlyNgn > 0 ? `₦${recurringMonthlyNgn.toLocaleString()} / month` : '₦0 / month'}
          </strong>
        </div>
        {product.recurringCostNotes && (
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
            {product.recurringCostNotes}
          </div>
        )}
        <div className="pt-2 border-t border-slate-800 space-y-1">
          <div className="font-bold text-slate-200">Included Deliverables:</div>
          {product.deliverables.map((d, i) => (
            <div key={i} className="flex items-start gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{d}</span>
            </div>
          ))}
        </div>
        {product.exclusions && product.exclusions.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="font-bold text-slate-300">Exclusions &amp; Scope Limits:</div>
            {product.exclusions.map((ex, i) => (
              <div key={i} className="flex items-start gap-1.5 text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span>{ex}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Stage Toggle */}
      {product.depositPercent < 100 && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPaymentStage('deposit')}
            className={`p-3 rounded-xl border text-left transition ${
              paymentStage === 'deposit'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold">{product.depositPercent}% Initial Deposit</div>
            <div className="text-sm font-black text-emerald-400 mt-0.5">
              ₦{depositNgn.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">
              Balance ₦{balanceNgn.toLocaleString()} on approval
            </div>
          </button>
          <button
            type="button"
            onClick={() => setPaymentStage('full')}
            className={`p-3 rounded-xl border text-left transition ${
              paymentStage === 'full'
                ? 'bg-[#d4af37]/15 border-[#d4af37] text-white'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            <div className="font-bold">100% Full Payment</div>
            <div className="text-sm font-black text-white mt-0.5">
              ₦{totalNgn.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400">Single settlement</div>
          </button>
        </div>
      )}

      {orderResult ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 text-xs">
          <div className="font-bold text-emerald-400">
            Order Created: {orderResult.orderReference}
          </div>
          <div className="space-y-1 text-slate-200">
            <div>Bank: <strong>{BRAND_IDENTITY.settlementBank}</strong></div>
            <div>Account: <strong>{BRAND_IDENTITY.settlementAccountNumber}</strong></div>
            <div>Account Name: <strong>{BRAND_IDENTITY.settlementAccountName}</strong> ({BRAND_IDENTITY.cacReg})</div>
            <div>Amount Due Now: <strong className="text-emerald-400">₦{Number(orderResult.amountDueNgn || dueNowNgn).toLocaleString()}</strong></div>
          </div>
          <p className="text-[11px] text-slate-400">
            Payments are verified server-side / by our corporate desk before onboarding begins.
          </p>
          <a
            href={`https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
              `Hello Bethelmind! I created Order ${orderResult.orderReference} for ${product.name} (₦${Number(orderResult.amountDueNgn || dueNowNgn).toLocaleString()}). Please confirm my Moniepoint transfer.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackConversionEvent('click_whatsapp', { cta: 'order_transfer_confirm' })}
            className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Confirm Transfer on WhatsApp</span>
          </a>
        </div>
      ) : (
        <form onSubmit={handleCheckout} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentProvider('moniepoint')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                paymentProvider === 'moniepoint'
                  ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Moniepoint Transfer</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentProvider('paystack')}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                paymentProvider === 'paystack'
                  ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Paystack Card/Bank</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <input
              type="email"
              required
              placeholder="Email for Receipt *"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <input
              type="tel"
              placeholder="WhatsApp Number"
              value={customerWhatsapp}
              onChange={(e) => setCustomerWhatsapp(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Business Name (Optional)"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
          </div>

          {error && (
            <div className="text-xs text-rose-300 bg-rose-500/10 p-2.5 rounded-lg">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>
              {paymentProvider === 'moniepoint'
                ? `Generate Order & Pay ₦${dueNowNgn.toLocaleString()} via Moniepoint`
                : `Pay ₦${dueNowNgn.toLocaleString()} Securely via Paystack`}
            </span>
          </button>
        </form>
      )}
    </div>
  );
}
