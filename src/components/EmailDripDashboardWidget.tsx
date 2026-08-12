'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export default function EmailDripDashboardWidget() {
  const [testEmail, setTestEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleTestTrigger = async () => {
    if (!testEmail) return;
    setSending(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/email/trigger-drip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: 'test_lead_99',
          clientName: 'Valued Client',
          clientEmail: testEmail,
          stepIndex: 1
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(`⚡ Test Drip Step 1 successfully sent to ${testEmail}!`);
      } else {
        setStatusMsg(`Error sending drip: ${data.error}`);
      }
    } catch (err: any) {
      setStatusMsg(`Failed: ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const steps = [
    { step: 'Step 1 (Instant)', title: 'Welcome & Website Claim Confirmation', openRate: '78%' },
    { step: 'Step 2 (Day 1)', title: '3 Ways to Double Leads on your Portal', openRate: '64%' },
    { step: 'Step 3 (Day 3)', title: 'Dedicated Account Director Check-In', openRate: '59%' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              ✉️ Hands-Free Auto Follow-Up Emailer
              <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono">24/7 ACTIVE</span>
            </h3>
            <p className="text-xs text-slate-400">Automatically emails new leads welcome offers and warm-ups while you sleep.</p>
          </div>
        </div>
      </div>

      {/* Sequence Steps Breakdown */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Automated Drip Sequence Schedule</h4>
        {steps.map((s, idx) => (
          <div key={idx} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg text-blue-400 border border-slate-800">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{s.title}</p>
                <p className="text-[10px] text-slate-400">{s.step}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400">{s.openRate}</span>
              <span className="text-[10px] text-slate-400 block">Avg Open Rate</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Live Email Drip Tester */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h4 className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Send className="w-3.5 h-3.5 text-blue-400" />
          Test Instant Drip Dispatcher
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Enter your email to test drip sequence..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleTestTrigger}
            disabled={sending || !testEmail}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {sending ? 'Sending...' : 'Send Test Drip'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {statusMsg && (
          <p className={`text-xs mt-2.5 font-medium ${statusMsg.includes('⚡') ? 'text-emerald-400' : 'text-amber-400'}`}>
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  );
}
