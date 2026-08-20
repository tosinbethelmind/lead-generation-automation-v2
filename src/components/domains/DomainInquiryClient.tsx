'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * @file src/components/domains/DomainInquiryClient.tsx
 * 
 * Interactive Client-Side Component for Domain Parking & Instant Custody Inquiry.
 * Includes both 1-Tap WhatsApp Fast Bridge and Direct Instant On-Page Reclaim Form.
 */

interface DomainInquiryClientProps {
  decodedDomain: string;
  waUrl: string;
}

export default function DomainInquiryClient({ decodedDomain, waUrl }: DomainInquiryClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [offer, setOffer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMessage('Please enter a valid phone number so our transfer desk can reach you.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/domains/reclaim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: decodedDomain,
          requesterName: name,
          requesterPhone: phone,
          requesterEmail: email,
          offerAmountNGN: offer
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit inquiry. Please try WhatsApp directly.');
      }
    } catch (_) {
      setErrorMessage('Network error. Please tap WhatsApp to contact the transfer desk directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl mb-10 text-left">
      <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        Are you the business owner or authorized management?
      </h2>

      <ul className="space-y-3 text-sm text-slate-300 mb-6">
        <li className="flex items-start gap-2.5">
          <span className="text-emerald-400 font-bold">✓</span>
          <span><strong>Fast-Track Reinstatement:</strong> Instant Authorization Code (EPP/Auth-Info) delivered in under 2 hours.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-emerald-400 font-bold">✓</span>
          <span><strong>Corporate Email & SEO Protection:</strong> Recover your business email deliverability and historic Google Maps rankings.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-emerald-400 font-bold">✓</span>
          <span><strong>Official Verification Escrow:</strong> Verified ownership handover via Bethelmind Analytics Admin Desk.</span>
        </li>
      </ul>

      {isSubmitted ? (
        <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-5 text-center">
          <div className="text-emerald-400 text-3xl mb-2">✓</div>
          <h3 className="text-base font-bold text-white mb-1">Reinstatement Claim Received</h3>
          <p className="text-xs text-slate-300 mb-4">
            Our domain transfer desk has received your request for <strong>{decodedDomain}</strong>. A specialist will call or WhatsApp you within 2 hours.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all"
          >
            💬 Open Fast-Track WhatsApp Priority Desk
          </a>
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name / Designation</label>
            <input
              type="text"
              placeholder="e.g. Managing Director / IT Officer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">WhatsApp / Phone Number <span className="text-emerald-400">*</span></label>
            <input
              type="tel"
              placeholder="e.g. 0802 279 1227"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Corporate Email (Optional)</label>
            <input
              type="email"
              placeholder="e.g. contact@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400">{errorMessage}</p>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Claim...' : 'Submit Reinstatement Request'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-800 text-slate-300 text-xs px-4 py-3 rounded-lg hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 text-center transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>💬</span>
            <span>1-Tap Reclaim on WhatsApp (Instant)</span>
          </a>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-700 text-center transition-all"
          >
            Submit Web Claim
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>Corporate Desk: <strong className="text-slate-200">+234 802 279 1227</strong></span>
        <span>Escrow Protocol: <strong className="text-emerald-400">EPP Fast-Track</strong></span>
      </div>
    </div>
  );
}
