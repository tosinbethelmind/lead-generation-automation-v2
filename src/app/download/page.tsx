import React from 'react';
import Link from 'next/link';
import {
  Download,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Layers,
  Laptop
} from 'lucide-react';

export const metadata = {
  title: 'Download Bethelmind Mobile Business OS (.APK)',
  description: 'Download Bethelmind Business OS for Android (.APK) or install directly on mobile home screen. CAC Certified Reg 9912717.'
};

export default function DownloadAppHub() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950 pb-20">
      {/* 🧭 HEADER */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20 text-sm">
              BM
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wide">
                BETHELMIND DIGITAL SOLUTIONS
              </h1>
              <p className="text-[11px] text-slate-400">
                CAC Certified: Reg 9912717 • Moniepoint MFB: 6805375225
              </p>
            </div>
          </div>

          <Link
            href="/admin/mobile"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-1 transition"
          >
            <span>Open Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 📦 HERO SECTION */}
      <main className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        <div className="text-center space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OFFICIAL CERTIFIED RELEASE • V1.0.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Download Bethelmind Business OS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            The all-in-one mobile command center for Nigerian Commercial Growth: B2B SME Lead Radar, Live Prototype Staging, and 24/7 AI WhatsApp Closer.
          </p>
        </div>

        {/* 📥 SECTION 1: PRIMARY ANDROID APK DOWNLOAD CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/50 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>NATIVE ANDROID RELEASE (.APK)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Bethelmind Mobile Business OS App
              </h2>
              <p className="text-xs text-slate-300">
                Package: <code className="text-cyan-300">com.bethelmind.app</code> • Built for Android 10 to 15
              </p>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-right">
              <span className="text-xs text-slate-400">File Size</span>
              <span className="text-lg font-mono font-bold text-white">~4.8 MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Network Usage</span>
              <span className="font-semibold text-emerald-400">Micro-Payload &lt; 15KB</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">SME Quoter</span>
              <span className="font-semibold text-cyan-400">1-Tap Prototype Deploy</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Security & Integrity</span>
              <span className="font-semibold text-blue-400">OWASP Hardened</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a
              href="/downloads/Bethelmind_Business_OS_v1.0.apk"
              download="Bethelmind_Business_OS_v1.0.apk"
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>Download Android .APK File (~4.8MB)</span>
            </a>
          </div>
        </div>

        {/* 📲 SECTION 2: INSTANT PWA BROWSER INSTALLATION */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Instant Install via Google Chrome (0MB Download)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Open Bethelmind in Google Chrome on your phone, tap the <b>3 dots (⋮)</b> in the top right, and choose <b>"Add to Home screen"</b> or <b>"Install app"</b>.
            </p>
          </div>

          <Link
            href="/admin/mobile"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-500/30 shrink-0 transition"
          >
            <span>Open in Chrome</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
