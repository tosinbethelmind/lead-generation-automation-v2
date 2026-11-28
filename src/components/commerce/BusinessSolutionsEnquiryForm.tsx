'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, MessageCircle, CheckCircle2 } from 'lucide-react';
import { BRAND_IDENTITY } from '@/lib/commerce/brandIdentity';
import { SERVICE_DEFINITIONS } from '@/lib/commerce/servicesCatalog';
import { getStoredAttribution, trackConversionEvent } from '@/lib/commerce/googleTracking';
import type { PreferredContactMethod } from '@/lib/commerce/enquiries';

interface BusinessSolutionsEnquiryFormProps {
  defaultServiceTitle?: string;
  defaultPackageName?: string;
  sourceTag?: string;
  compact?: boolean;
}

export default function BusinessSolutionsEnquiryForm({
  defaultServiceTitle,
  defaultPackageName,
  sourceTag = 'business_solutions_enquiry',
  compact = false,
}: BusinessSolutionsEnquiryFormProps) {
  const formStartedRef = useRef(false);

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [selectedService, setSelectedService] = useState(
    defaultServiceTitle || SERVICE_DEFINITIONS[0].title
  );
  const [description, setDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] =
    useState<PreferredContactMethod>('WhatsApp');

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    id: string;
    whatsappUrl: string;
    service: string;
  } | null>(null);

  useEffect(() => {
    if (defaultServiceTitle) {
      setSelectedService(defaultServiceTitle);
    }
  }, [defaultServiceTitle]);

  const handleFocus = () => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackConversionEvent('form_start', { form_name: sourceTag });
    }
  };

  const buildWhatsAppUrl = (refId: string) => {
    const msg = `Hello ${BRAND_IDENTITY.companyName}! My name is ${name}${
      businessName ? ` (${businessName})` : ''
    }. Enquiry Ref: ${refId}. Service: ${selectedService}${
      defaultPackageName ? ` (${defaultPackageName})` : ''
    }.${estimatedBudget ? ` Estimated budget: ${estimatedBudget}.` : ''}${
      description ? ` Need: ${description}` : ''
    }`;
    return `https://wa.me/${BRAND_IDENTITY.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const attr = getStoredAttribution();
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          businessName,
          whatsapp,
          email: email || undefined,
          selectedService,
          selectedPackage: defaultPackageName || undefined,
          message: description || `Enquiry for ${selectedService}`,
          estimatedBudget: estimatedBudget || undefined,
          preferredContactMethod,
          source: sourceTag,
          gclid: attr.gclid,
          gbraid: attr.gbraid,
          wbraid: attr.wbraid,
          utmSource: attr.utm_source,
          utmMedium: attr.utm_medium,
          utmCampaign: attr.utm_campaign,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Please check your details and try again.');
      }

      trackConversionEvent(
        'generate_lead',
        {
          lead_id: data.enquiryId,
          service: selectedService,
          package: defaultPackageName || selectedService,
          currency: 'NGN',
        },
        {
          dedupeKey: `lead-${data.enquiryId}`,
          userData: {
            email: email || undefined,
            phone_number: whatsapp,
          },
        }
      );

      setSubmitted({
        id: data.enquiryId,
        whatsappUrl: buildWhatsAppUrl(data.enquiryId),
        service: selectedService,
      });
    } catch (err: any) {
      setFormError(err.message || 'Unable to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 text-sm">
        <div className="flex items-center gap-2 font-bold text-emerald-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Enquiry Confirmed (Ref: {submitted.id})</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          Thank you, <strong>{name}</strong>. Your request for{' '}
          <strong>{submitted.service}</strong> has been saved and our team has been notified.
          Preferred contact: <strong>{preferredContactMethod}</strong>.
        </p>
        <a
          href={submitted.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackConversionEvent('click_whatsapp', {
              cta: 'enquiry_confirmation_whatsapp',
              service: submitted.service,
            })
          }
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Continue on WhatsApp ({BRAND_IDENTITY.whatsappDisplay})</span>
        </a>
        <button
          type="button"
          onClick={() => setSubmitted(null)}
          className="w-full text-xs text-slate-400 hover:text-white underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={handleFocus}
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3.5 ${compact ? '' : 'text-sm'}`}
    >
      <div>
        <label htmlFor="enq-name" className="block text-xs text-slate-300 mb-1">
          Full Name *
        </label>
        <input
          id="enq-name"
          type="text"
          required
          placeholder="e.g. Chinedu Okafor"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="enq-business" className="block text-xs text-slate-300 mb-1">
          Business Name
        </label>
        <input
          id="enq-business"
          type="text"
          placeholder="e.g. Zenith Care Clinic Ltd"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="enq-phone" className="block text-xs text-slate-300 mb-1">
          Phone / WhatsApp Number *
        </label>
        <input
          id="enq-phone"
          type="tel"
          required
          placeholder="e.g. 0803 123 4567"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="enq-email" className="block text-xs text-slate-300 mb-1">
          Email Address (Optional)
        </label>
        <input
          id="enq-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="enq-service" className="block text-xs text-slate-300 mb-1">
          Service Required *
        </label>
        <select
          id="enq-service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        >
          {SERVICE_DEFINITIONS.map((svc) => (
            <option key={svc.slug} value={svc.title}>
              {svc.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="enq-budget" className="block text-xs text-slate-300 mb-1">
          Estimated Budget (Optional)
        </label>
        <select
          id="enq-budget"
          value={estimatedBudget}
          onChange={(e) => setEstimatedBudget(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        >
          <option value="">Select budget range (optional)</option>
          <option value="Under ₦50,000">Under ₦50,000</option>
          <option value="₦50,000 – ₦120,000">₦50,000 – ₦120,000</option>
          <option value="₦120,000 – ₦250,000">₦120,000 – ₦250,000</option>
          <option value="₦250,000 – ₦500,000">₦250,000 – ₦500,000</option>
          <option value="₦500,000+">₦500,000+</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="enq-need" className="block text-xs text-slate-300 mb-1">
          Brief Description of Your Business Need *
        </label>
        <textarea
          id="enq-need"
          rows={3}
          required
          placeholder="Briefly describe what you want to achieve (e.g. corporate website with WhatsApp booking, 200 Lagos logistics leads, or sales dashboard)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:border-[#d4af37] focus:outline-none"
        />
      </div>

      <div className="sm:col-span-2">
        <span className="block text-xs text-slate-300 mb-1.5">Preferred Contact Method</span>
        <div className="grid grid-cols-3 gap-2">
          {(['WhatsApp', 'Phone Call', 'Email'] as PreferredContactMethod[]).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setPreferredContactMethod(method)}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                preferredContactMethod === method
                  ? 'bg-[#d4af37]/15 border-[#d4af37] text-[#d4af37]'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {formError && (
        <div className="sm:col-span-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {formError}
        </div>
      )}

      <div className="sm:col-span-2 space-y-2 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#e5c158] text-[#070b14] font-black text-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>GET A BUSINESS SOLUTION &amp; QUOTE</span>
        </button>
        <p className="text-[11px] text-center text-slate-400">
          No obligation. Direct support on {BRAND_IDENTITY.whatsappDisplay}.
        </p>
      </div>
    </form>
  );
}
