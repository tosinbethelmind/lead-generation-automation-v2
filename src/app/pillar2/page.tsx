'use client';

/**
 * @file src/app/pillar2/page.tsx
 * 
 * 🏛️ BETHELMIND DIGITAL SOLUTIONS — PILLAR 2 DEDICATED APP INTERFACE
 * Luxury Real Estate Deal Wire & 80/20 LASRERA Brokerage Command Center
 * CAC Certified: Reg 9912717 | Settlement: Moniepoint MFB (6805375225)
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  Building, 
  Briefcase, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Layers, 
  PhoneCall, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download
} from 'lucide-react';

const Pillar2ControlView = dynamic(
  () => import('@/components/admin/Pillar2ControlView'),
  { ssr: false, loading: () => (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
      <p className="text-sm font-semibold">Loading Pillar 2 Luxury Deal Desk...</p>
    </div>
  )}
);

export default function Pillar2AppPage() {
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/admin/mobile-control', {
        headers: { 'x-admin-token': 'bethelmind_admin_2026' }
      });
      const data = await res.json();
      setTelemetry(data);
    } catch (err: any) {
      console.error('Failed to load telemetry in Pillar 2 app:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 20000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const copyToClipboard = (text: string, label: string = 'Copied') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`✅ ${label} copied to clipboard!`);
    }
  };

  const handleApproveTicket = async (ticketId: string) => {
    setTriggerLoading(ticketId);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'approve_pillar2_ticket', ticketId })
      });
      const data = await res.json();
      showToast(data.message || `Ticket ${ticketId} approved!`);
      fetchTelemetry();
      return data;
    } catch (err: any) {
      showToast(`Error approving: ${err.message}`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleRejectTicket = async (ticketId: string) => {
    setTriggerLoading(ticketId);
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'reject_pillar2_ticket', ticketId })
      });
      const data = await res.json();
      showToast(data.message || `Ticket ${ticketId} rejected`);
      fetchTelemetry();
    } catch (err: any) {
      showToast(`Error rejecting: ${err.message}`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleRunDiscovery = async () => {
    setTriggerLoading('discovery');
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'run_pillar2_discovery' })
      });
      const data = await res.json();
      showToast(`🔍 Discovery Complete: ${data.message || 'Scanned luxury portals'}`);
      fetchTelemetry();
    } catch (err: any) {
      showToast(`Discovery error: ${err.message}`);
    } finally {
      setTriggerLoading(null);
    }
  };

  const handleProcessQueue = async () => {
    setTriggerLoading('queue');
    try {
      const res = await fetch('/api/admin/mobile-control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': 'bethelmind_admin_2026'
        },
        body: JSON.stringify({ action: 'process_pillar2_queue' })
      });
      const data = await res.json();
      showToast(`⚡ Dispatched: ${data.message || 'Queue processed'}`);
      fetchTelemetry();
    } catch (err: any) {
      showToast(`Queue error: ${err.message}`);
    } finally {
      setTriggerLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      {/* 🚀 APP TOP MASTER BAR */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Briefcase className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">Bethelmind</span>
                <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Pillar 2 App
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Luxury Real Estate Deal Wire • CAC 9912717
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/admin/mobile?pillar=pillar1"
              className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 flex items-center gap-1 transition-all"
              title="Switch to Pillar 1 SME Engine"
            >
              <Building className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Switch to</span> SME
            </Link>

            <button
              onClick={fetchTelemetry}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Pillar Switcher Pill Bar */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 max-w-5xl mx-auto">
          <Link
            href="/admin/mobile?pillar=pillar1"
            className="py-1.5 px-3 rounded-lg text-center font-bold text-xs bg-slate-900 border border-slate-800 text-slate-400 hover:text-sky-400 hover:border-sky-500/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Building className="w-3.5 h-3.5" />
            <span>🏢 PILLAR 1: SME Engine</span>
          </Link>

          <div
            className="py-1.5 px-3 rounded-lg text-center font-bold text-xs bg-gradient-to-r from-amber-600/30 to-yellow-500/20 border-2 border-amber-500 text-amber-300 flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>🏛️ PILLAR 2: Deal Wire (Active)</span>
          </div>
        </div>
      </header>

      {/* Action Toast */}
      {feedbackMsg && (
        <div className="bg-amber-500/90 text-slate-950 font-bold text-xs py-2 px-4 text-center sticky top-[95px] z-40 shadow-md">
          {feedbackMsg}
        </div>
      )}

      {/* Main App Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 pb-24">
        <Pillar2ControlView
          pillar2Data={telemetry?.pillar2}
          triggerLoading={triggerLoading}
          onApproveTicket={handleApproveTicket}
          onRejectTicket={handleRejectTicket}
          onRunDiscovery={handleRunDiscovery}
          onProcessQueue={handleProcessQueue}
          onRefresh={fetchTelemetry}
          onCopyText={copyToClipboard}
        />
      </main>

      {/* 📱 STICKY BOTTOM APP NAVIGATION DOCK */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 shadow-2xl">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          <Link
            href="/pillar2"
            className="flex flex-col items-center py-1 rounded-lg text-amber-400 bg-amber-500/10 font-bold"
          >
            <Briefcase className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Deal Desk</span>
          </Link>

          <Link
            href="/mandate"
            className="flex flex-col items-center py-1 rounded-lg text-slate-400 hover:text-white"
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Mandate Hub</span>
          </Link>

          <Link
            href="/api/mandate/download-pack"
            target="_blank"
            className="flex flex-col items-center py-1 rounded-lg text-slate-400 hover:text-white"
          >
            <Download className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Legal Pack</span>
          </Link>

          <Link
            href="/admin/mobile?pillar=pillar1"
            className="flex flex-col items-center py-1 rounded-lg text-sky-400 hover:text-sky-300"
          >
            <Building className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">SME Engine</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
