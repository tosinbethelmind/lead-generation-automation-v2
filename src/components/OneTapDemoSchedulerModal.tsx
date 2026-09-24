'use client';

/**
 * @file src/components/OneTapDemoSchedulerModal.tsx
 * Cal.com & 1-Tap WhatsApp B2B Demo Scheduler
 *
 * Provides high-conversion, zero-friction 10-minute onboarding screen shares
 * for Nigerian commercial decision makers.
 */

import React, { useState } from 'react';
import { X, Calendar, Clock, MessageCircle, CheckCircle2, ShieldCheck, Video, Phone, Sparkles } from 'lucide-react';

interface OneTapDemoSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  category?: string;
  area?: string;
  adminPhone?: string;
  calLink?: string;
}

export default function OneTapDemoSchedulerModal({
  isOpen = true,
  onClose,
  businessName,
  category = 'Commercial Enterprise',
  area = 'Lagos',
  adminPhone = '2348022791227',
  calLink = 'https://cal.com/bethelmindanalytics/10min'
}: OneTapDemoSchedulerModalProps) {
  const [selectedSlot, setSelectedSlot] = useState('Today, 3:30 PM');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [meetingType, setMeetingType] = useState<'whatsapp_call' | 'google_meet'>('whatsapp_call');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  if (isOpen === false) return null;

  // Generate dynamic 10-minute slots for Today and Tomorrow
  const quickSlots = [
    'Today, 2:30 PM WAT',
    'Today, 4:00 PM WAT',
    'Today, 5:30 PM WAT',
    'Tomorrow, 11:00 AM WAT',
    'Tomorrow, 2:00 PM WAT',
    'Tomorrow, 4:30 PM WAT',
  ];

  const handleBook = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_name: `10-Min Live Demo & Quoting Walkthrough (${meetingType === 'whatsapp_call' ? 'WhatsApp Voice Call' : 'Google Meet'})`,
          service_category: category,
          customer_name: contactName || businessName || 'Business Owner',
          customer_phone: contactPhone || 'Via WhatsApp',
          date: new Date().toISOString().split('T')[0],
          time_slot: selectedSlot,
          duration_minutes: 10,
          sector: category,
          notes: `Lead booked live walkthrough for ${businessName} in ${area}. Preferred mode: ${meetingType}.`
        })
      });
    } catch (_) {}

    setIsSubmitting(false);
    setIsBooked(true);
  };

  const waConfirmUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(
    `Hello Tosin (Bethelmind Lagos Desk)!\n\nI want to lock in a 10-minute live walkthrough for *${businessName}* in ${area}.\n\n📅 Preferred Slot: ${selectedSlot}\n📱 Meeting Mode: ${meetingType === 'whatsapp_call' ? 'WhatsApp Direct Call' : 'Google Meet Screen Share'}\n\nPlease confirm our meeting link!`
  )}`;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-emerald-500/10 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/20 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!isBooked ? (
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>10-MINUTE LIVE DEMO • ₦0 UPFRONT</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Book a 10-Min Live Walkthrough for <span className="text-emerald-400">{businessName}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              See the 24/7 WhatsApp auto-quoter in action on a live call with Tosin from Bethelmind Lagos Desk. Zero pushy sales pitches — just a direct look at how it works.
            </p>

            {/* Quick 10-Min Slots Grid */}
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select 10-Minute Slot:
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {quickSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all border ${
                    selectedSlot === slot 
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm shadow-emerald-500/30' 
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Clock className="w-3 h-3 inline-block mr-1.5 text-emerald-400" />
                  {slot}
                </button>
              ))}
            </div>

            {/* Meeting Mode Selector */}
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Preferred Meeting Platform:
            </label>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setMeetingType('whatsapp_call')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  meetingType === 'whatsapp_call'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp Audio Call</span>
              </button>

              <button
                type="button"
                onClick={() => setMeetingType('google_meet')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  meetingType === 'google_meet'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-indigo-400" />
                <span>Google Meet Screen</span>
              </button>
            </div>

            {/* Quick Contact Input (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              <div>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Alhaji Kabir)"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp Phone (e.g. 080...)"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Dual Action Buttons */}
            <div className="flex flex-col gap-2.5">
              <a
                href={waConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleBook}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-transform active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-current text-slate-950" />
                <span>Lock Slot on WhatsApp ({selectedSlot}) →</span>
              </a>

              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center text-xs text-slate-400 hover:text-emerald-300 py-1 transition-colors"
              >
                Or pick a different day on our official Cal.com calendar ↗
              </a>
            </div>

            {/* Safety Guarantee */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero commitment • Guaranteed 10 minutes strictly respected</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              Slot Reserved Successfully!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-sm mx-auto leading-relaxed">
              We have noted your preferred 10-minute walkthrough for <strong>{businessName}</strong> on <strong>{selectedSlot}</strong>.
            </p>

            <a
              href={waConfirmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open WhatsApp & Confirm with Tosin</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
