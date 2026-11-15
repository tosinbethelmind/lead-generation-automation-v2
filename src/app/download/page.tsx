import React from 'react';
import Link from 'next/link';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  FileText, 
  Scale, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Building
} from 'lucide-react';

export const metadata = {
  title: 'Download Bethelmind Business OS & Documents | Android App (.apk)',
  description: 'Download the official Bethelmind Business OS Android App (.apk) and all statutory legal documents, LASRERA mandate packs, and lawyer briefs.',
};

export default function DownloadCenterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 pb-20">
      {/* 🚀 TOP HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/20 px-4 py-3 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Smartphone className="w-5 h-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">Bethelmind</span>
                <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                  Download Hub
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                CAC Certified: Reg 9912717 • Moniepoint MFB: 6805375225
              </p>
            </div>
          </div>

          <Link
            href="/pillar2"
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 flex items-center gap-1 transition"
          >
            <span>Open App</span>
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
            The all-in-one mobile command center for Nigerian Commercial Growth: Luxury Real Estate Deal Desk, SME Automation, and Statutory LASRERA Mandates.
          </p>
        </div>

        {/* 📥 SECTION 1: PRIMARY ANDROID APK DOWNLOAD CARD */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>Android App (.APK Package)</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                    5.84 MB
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Direct standalone installer for all Android phones (MTN, Airtel, Glo, 9mobile compatible)
                </p>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="space-y-3">
            <a
              href="/downloads/bethelmind_business_os.apk"
              download="bethelmind_business_os.apk"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 font-extrabold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition transform active:scale-[0.98]"
            >
              <Download className="w-5 h-5 font-black" />
              <span>Direct Fast Download (.APK) — 5.8 MB</span>
            </a>

            <div className="text-center">
              <a
                href="https://github.com/tosinbethelmind/lead-generation-automation-v2/releases/download/mobile-apk-v1.0/bethelmind_business_os-debug.apk"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-emerald-400 underline font-medium inline-flex items-center gap-1 transition"
              >
                <span>Alternate Cloud Mirror (GitHub Releases)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 3-Step Installation Guide */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              How to Install on Your Android Phone:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-1 text-[11px]">1</span>
                <span className="font-semibold text-white block">Download File</span>
                <span className="text-slate-400 text-[11px]">Tap the green download button above. If Chrome shows a warning, tap <b>"Download anyway"</b>.</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-1 text-[11px]">2</span>
                <span className="font-semibold text-white block">Tap Install</span>
                <span className="text-slate-400 text-[11px]">Open your phone notification shade or Downloads folder and tap <b>bethelmind_business_os.apk</b> to install.</span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center mb-1 text-[11px]">3</span>
                <span className="font-semibold text-white block">Launch App</span>
                <span className="text-slate-400 text-[11px]">The gold Bethelmind app icon is now on your home screen for instant 24/7 access!</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🌐 SECTION 2: INSTANT HOME SCREEN INSTALL (CHROME PWA) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Option B: Instant Install via Google Chrome (0MB Download)
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
              Prefer not to download an APK file? Open Bethelmind in Google Chrome on your phone, tap the <b>3 dots (⋮)</b> in the top right, and choose <b>"Add to Home screen"</b> or <b>"Install app"</b>.
            </p>
          </div>

          <Link
            href="/pillar2"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-500/30 shrink-0 transition"
          >
            <span>Open in Chrome</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 📄 SECTION 3: ALL DOWNLOADABLE DOCUMENTS & LEGAL INSTRUMENTS */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Statutory Legal Documents & Mandate Packs</span>
            </h2>
            <p className="text-xs text-slate-400">
              Download official compliance instruments under Section 84 of the Evidence Act 2011 and LASRERA guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Document 1: Master 4-in-1 Pack */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                    MASTER A4 PDF
                  </span>
                  <span className="text-xs text-slate-400">Evidence Act Sec 84</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Master Statutory Legal Pack (4-in-1 Pack)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Includes all 4 bilateral legal instruments: Retainership Agreement, LASRERA 80/20 Co-Brokerage, Statutory JIM, Diaspora Mandate, and Section 84 Certificate.
                </p>
              </div>
              <a
                href="/api/mandate/download-pack"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download 4-in-1 Legal Pack (PDF)</span>
              </a>
            </div>

            {/* Document 2: Lawyer & Legal Counsel Brief */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                    LEGAL COUNSEL
                  </span>
                  <span className="text-xs text-slate-400">20% Counsel Share</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Lawyer & Legal Counsel Brief
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Full chambers retainership brief, operational modus operandi, Alausa title search protocols, and 20% counsel commission revenue share table.
                </p>
              </div>
              <Link
                href="/mandate/brief"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-500/30 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View & Read Lawyer Brief</span>
              </Link>
            </div>

            {/* Document 3: Printable Mandate */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    PRINTABLE A4
                  </span>
                  <span className="text-xs text-slate-400">Corporate Seal</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Printable Mandate & Forensic Certificate
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clean A4 printable layout for physical company stamping, ink signatures, and official legal filing at the lands registry or court.
                </p>
              </div>
              <Link
                href="/mandate/print"
                target="_blank"
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Printable A4 Mandate</span>
              </Link>
            </div>

            {/* Document 4: Online E-Sign Portal */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    DIGITAL ASSENT
                  </span>
                  <span className="text-xs text-slate-400">60-Second Signing</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Digital E-Sign Mandate Portal
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sign bilateral agreements and Joint Inspection Memorandums (JIM) on your mobile touchscreen with instant SHA-256 evidence hashing.
                </p>
              </div>
              <Link
                href="/mandate"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Open E-Sign Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
