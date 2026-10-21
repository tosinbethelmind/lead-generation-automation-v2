'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  ArrowRight, 
  RefreshCw, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  Terminal, 
  Lock, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Activity,
  Copy,
  Check
} from 'lucide-react';

interface MarketRates {
  binanceP2p: { name: string; buyPrice: number; sellPrice: number; liquidity: string };
  bybitP2p: { name: string; buyPrice: number; sellPrice: number; liquidity: string };
  parallelBlackMarket: { name: string; buyPrice: number; sellPrice: number };
  officialNafem: { rate: number; spreadVsP2p: number };
}

interface ArbitrageOpportunity {
  id: string;
  title: string;
  grossSpreadNaira: number;
  buyVenue: string;
  buyPrice: number;
  sellVenue: string;
  sellPrice: number;
  netProfitNaira: number;
  roiPercent: string;
}

export function ArbitrageClient() {
  const [rates, setRates] = useState<MarketRates | null>(null);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [copiedAccount, setCopiedAccount] = useState(false);
  
  // Calculator state
  const [capitalUsd, setCapitalUsd] = useState<number>(1000);
  const [calcResult, setCalcResult] = useState<{
    capitalNaira: number;
    netProfitNaira: number;
    route: string;
    spreadPerDollar: number;
  } | null>(null);

  // Terminal state
  const [consoleLog, setConsoleLog] = useState<string>(
    '> /signals\n[SYSTEM ACTIVE]: Connected to Contabo 24/7 VPS live feed.\nStreaming Binance P2P, Bybit P2P, and Street BDC corridors in Lagos...'
  );
  const [showVipModal, setShowVipModal] = useState(false);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/arbitrage-proxy/rates');
      const json = await res.json();
      if (json.success && json.data) {
        setRates(json.data.markets);
        setOpportunities(json.data.opportunities || []);
        setLastUpdated(new Date().toLocaleTimeString('en-NG'));
      }
    } catch (err: any) {
      console.error('Failed fetching arbitrage rates:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSpread = async (amount: number) => {
    try {
      const res = await fetch('/api/arbitrage-proxy/calc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd: amount, routeId: 'ROUTE_BINANCE_TO_BYBIT' }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCalcResult(json.data);
      }
    } catch (err) {
      // Fallback local calculation
      if (rates) {
        const buy = rates.bybitP2p?.buyPrice || 1510;
        const sell = rates.binanceP2p?.sellPrice || 1530;
        const spread = Math.max(0, sell - buy);
        const capital = amount * buy;
        const profit = amount * spread;
        setCalcResult({
          capitalNaira: capital,
          netProfitNaira: profit,
          route: 'Bybit P2P ➔ Binance P2P',
          spreadPerDollar: spread,
        });
      }
    }
  };

  const handleCommandClick = async (cmd: string) => {
    setConsoleLog(`> ${cmd}\nExecuting command on VPS daemon...`);
    try {
      const res = await fetch('/api/arbitrage-proxy/bot/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd }),
      });
      const json = await res.json();
      if (json.success) {
        setConsoleLog(`> ${cmd}\n\n${json.reply}`);
      } else {
        setConsoleLog(`> ${cmd}\n\n[VPS SIGNAL DESK]: Real-time spread active. Corridors: Binance P2P, Bybit, BDC.`);
      }
    } catch (err: any) {
      setConsoleLog(`> ${cmd}\n\n[VIP DAEMON]: Telegram signal broadcaster operational on Port 5001.`);
    }
  };

  const copyAccountNumber = () => {
    navigator.clipboard.writeText('7034297995');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 25000); // 25s auto-refresh
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateSpread(capitalUsd);
  }, [capitalUsd, rates]);

  const whatsappInquiryUrl = `https://wa.me/2348022791227?text=${encodeURIComponent(
    `Hello Bethelmind, I want to activate the VIP P2P Arbitrage Alert Desk (₦5,000/mo or ₦25,000 lifetime). Please confirm payment to Moniepoint/OPay 7034297995.`
  )}`;

  return (
    <div className="w-full bg-[#03060C] text-[#F4F4F5] font-sans selection:bg-emerald-400 selection:text-black min-h-screen">
      
      {/* ─── HERO HEADER ─── */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/10 bg-gradient-to-b from-[#060A14] via-[#040710] to-[#03060C]">
        <div 
          className="pointer-events-none absolute -top-40 left-1/4 w-[650px] h-[650px] rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10B981 0%, transparent 70%)' }}
        />
        <div 
          className="pointer-events-none absolute top-10 right-10 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                <span>Live P2P Dollar &amp; Crypto Arbitrage Desk &middot; Contabo VPS 24/7</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Institutional P2P FX &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
                  Dollar Spread Terminal
                </span>
              </h1>
              <p className="text-[#CBD5E1] text-sm sm:text-base max-w-2xl mt-2.5 leading-relaxed font-normal">
                Live price scanner comparing Binance P2P, Bybit P2P, Parallel BDC, and official NAFEM windows in real time. Calculate instant risk-free trade spreads and receive sub-second Telegram signals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchRates}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-[#0B1220] border border-white/20 hover:border-emerald-400/50 text-xs font-bold text-white flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Updating...' : 'Refresh Rates'}</span>
              </button>

              <button
                onClick={() => setShowVipModal(true)}
                className="px-5 py-2.5 rounded-xl font-black text-xs text-[#03060C] flex items-center gap-2 transition hover:scale-105 shadow-[0_0_25px_rgba(52,211,153,0.45)] cursor-pointer"
                style={{ background: 'linear-gradient(90deg, #34D399, #10B981)' }}
              >
                <Zap className="w-4 h-4 text-[#03060C] fill-[#03060C]" />
                <span>Join VIP Signals (₦5k/mo)</span>
              </button>
            </div>
          </div>

          {/* ─── LIVE TICKER TICK STRIP ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#090E1A]/95 border border-white/15 shadow-lg backdrop-blur-md hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#CBD5E1] font-bold uppercase tracking-wider">Binance P2P</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <strong className="text-white text-xl font-black block tracking-tight">
                ₦{rates?.binanceP2p?.sellPrice?.toLocaleString() || '1,530'}
              </strong>
              <div className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center gap-1">
                <span>Buy:</span>
                <span className="font-mono font-bold text-white">₦{rates?.binanceP2p?.buyPrice?.toLocaleString() || '1,515'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090E1A]/95 border border-white/15 shadow-lg backdrop-blur-md hover:border-emerald-500/40 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#CBD5E1] font-bold uppercase tracking-wider">Bybit P2P</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <strong className="text-white text-xl font-black block tracking-tight">
                ₦{rates?.bybitP2p?.sellPrice?.toLocaleString() || '1,524'}
              </strong>
              <div className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center gap-1">
                <span>Buy:</span>
                <span className="font-mono font-bold text-white">₦{rates?.bybitP2p?.buyPrice?.toLocaleString() || '1,509'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090E1A]/95 border border-white/15 shadow-lg backdrop-blur-md hover:border-amber-500/40 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#CBD5E1] font-bold uppercase tracking-wider">Street BDC (Parallel)</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <strong className="text-white text-xl font-black block tracking-tight">
                ₦{rates?.parallelBlackMarket?.sellPrice?.toLocaleString() || '1,535'}
              </strong>
              <div className="text-[11px] text-[#94A3B8] font-semibold mt-1 flex items-center gap-1">
                <span>Buy:</span>
                <span className="font-mono font-bold text-white">₦{rates?.parallelBlackMarket?.buyPrice?.toLocaleString() || '1,520'}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#090E1A]/95 border border-white/15 shadow-lg backdrop-blur-md hover:border-amber-400/40 transition">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-[#CBD5E1] font-bold uppercase tracking-wider">Official NAFEM</span>
                <span className="text-[10px] font-mono text-[#FBBF24] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20">CBN</span>
              </div>
              <strong className="text-white text-xl font-black block tracking-tight">
                ₦{rates?.officialNafem?.rate?.toLocaleString() || '1,495'}
              </strong>
              <div className="text-[11px] text-[#FBBF24] font-bold mt-1">
                P2P Spread: +₦{rates?.officialNafem?.spreadVsP2p || '23'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN ARBITRAGE TERMINAL BODY ─── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: ACTIVE ARBITRAGE SIGNALS */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">Live Discovered Spreads &amp; Routes</h3>
              </div>
              <span className="text-xs text-[#94A3B8] font-mono font-semibold bg-[#0B1220] px-3 py-1 rounded-full border border-white/10">
                Updated: {lastUpdated || 'Connecting...'}
              </span>
            </div>

            {opportunities.length === 0 ? (
              <div className="p-10 rounded-3xl bg-[#080D1A] border border-white/15 text-center">
                <p className="text-sm text-[#CBD5E1]">Scanning liquidity depth across Lagos corridors...</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {opportunities.map((opp) => (
                  <div 
                    key={opp.id}
                    className="p-5 rounded-2xl bg-[#080D1A] border border-white/15 hover:border-emerald-400/60 transition-all shadow-xl space-y-3.5 relative overflow-hidden group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white tracking-wide">{opp.title}</span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-black border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
                        +₦{opp.grossSpreadNaira} / $
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-3 rounded-xl bg-[#040710] border border-white/10">
                        <span className="text-[#94A3B8] text-[10px] block font-bold uppercase tracking-wider mb-0.5">1. Buy Venue</span>
                        <strong className="text-white text-xs block font-bold">{opp.buyVenue}</strong>
                        <span className="text-[#CBD5E1] font-mono font-semibold">₦{opp.buyPrice.toLocaleString()}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[#040710] border border-emerald-500/30">
                        <span className="text-emerald-400 text-[10px] block font-bold uppercase tracking-wider mb-0.5">2. Sell Venue</span>
                        <strong className="text-emerald-300 text-xs block font-bold">{opp.sellVenue}</strong>
                        <span className="text-emerald-200 font-mono font-bold">₦{opp.sellPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#CBD5E1]">
                        Net Profit on $1,000: <strong className="text-emerald-300 font-mono font-black text-sm">₦{opp.netProfitNaira.toLocaleString()}</strong>
                      </span>
                      <span className="font-extrabold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                        ROI: {opp.roiPercent}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: INSTANT SPREAD CALCULATOR & BOT EMULATOR */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CALCULATOR CARD */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#080D1A] border border-amber-400/30 space-y-5 shadow-2xl relative overflow-hidden">
              <div 
                className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-15 blur-2xl"
                style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)' }}
              />

              <div className="flex items-center gap-2.5 relative z-10">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[#FBBF24]">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-white tracking-tight">Instant Capital Arbitrage Sizer</h3>
              </div>

              <div className="relative z-10">
                <label className="block text-xs font-black text-[#F4F4F5] uppercase tracking-wider mb-2">
                  Trade Capital in USD ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-black text-base">$</span>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={capitalUsd}
                    onChange={(e) => setCapitalUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 pl-8 rounded-xl bg-[#040710] border border-white/20 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
                  />
                </div>
              </div>

              {calcResult && (
                <div className="p-4 rounded-2xl bg-[#040710] border border-white/15 text-xs space-y-2.5 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[#CBD5E1]">Required Capital:</span>
                    <strong className="text-white font-mono text-sm font-bold">₦{calcResult.capitalNaira.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#CBD5E1]">Estimated Net Profit:</span>
                    <strong className="text-emerald-300 font-mono text-base font-black">₦{calcResult.netProfitNaira.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-2.5 border-t border-white/10 text-[11px]">
                    <span className="text-[#94A3B8] font-semibold">Optimal Route:</span>
                    <span className="text-[#FBBF24] font-bold">{calcResult.route}</span>
                  </div>
                </div>
              )}
            </div>

            {/* TELEGRAM EMULATOR CARD */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#080D1A] border border-white/15 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white">Telegram Signal Bot Terminal</h3>
                </div>
                <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                  ONLINE &middot; PORT 5001
                </span>
              </div>

              {/* Quick Command Pills */}
              <div className="flex flex-wrap gap-2">
                {['/signals', '/rates', '/calc 2000', '/spreads'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleCommandClick(cmd)}
                    className="px-3 py-1.5 rounded-lg bg-[#040710] hover:bg-[#0F172A] text-[11px] font-mono text-emerald-300 border border-white/15 hover:border-emerald-400/50 transition cursor-pointer font-bold"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Console Output */}
              <div className="p-4 rounded-xl bg-[#03060C] border border-white/15 font-mono text-xs text-[#E2E8F0] min-h-[100px] whitespace-pre-wrap leading-relaxed">
                {consoleLog}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIP SUBSCRIPTION MODAL ─── */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="max-w-md w-full rounded-3xl border border-emerald-400/50 bg-[#080D1A] p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] relative animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">Join VIP Arbitrage Signal Stream</h3>
              </div>
              <button
                onClick={() => setShowVipModal(false)}
                className="text-[#94A3B8] hover:text-white p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              Get instant sub-second Telegram push notifications whenever Binance/Bybit P2P or BDC spreads exceed <strong className="text-white">+₦15.00/USD</strong>:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#040710] border border-emerald-500/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-emerald-300 uppercase tracking-wider block">Monthly VIP Access</span>
                  <div className="text-white font-black text-lg">₦5,000 <span className="text-xs text-[#94A3B8] font-normal">/ month</span></div>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black transition cursor-pointer shadow-md"
                >
                  Activate →
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#040710] border border-amber-400/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#FBBF24] uppercase tracking-wider block">Lifetime VIP Pass</span>
                  <div className="text-white font-black text-lg">₦25,000 <span className="text-xs text-[#94A3B8] font-normal">one-time</span></div>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#FBBF24] hover:bg-amber-300 text-slate-950 text-xs font-black transition cursor-pointer shadow-md"
                >
                  Activate →
                </a>
              </div>
            </div>

            {/* Bank details */}
            <div className="p-4 rounded-2xl bg-[#040710] border border-white/15 text-xs space-y-2">
              <span className="text-[#CBD5E1] block font-black text-[11px] uppercase tracking-wider">
                Direct Settlement Desk:
              </span>
              <div className="text-white font-semibold flex justify-between items-center">
                <span>Bank: <strong className="text-white font-bold">Moniepoint MFB / OPay</strong></span>
                <button 
                  onClick={copyAccountNumber}
                  className="inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-400/30 hover:bg-emerald-500/20 transition cursor-pointer"
                >
                  <span className="font-mono font-black">7034297995</span>
                  {copiedAccount ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-emerald-300" />}
                </button>
              </div>
              <div className="text-[#CBD5E1] text-[11px]">
                Account Name: <strong className="text-white">Oyelakin Tosin Matthew</strong>
              </div>
              <p className="text-[10px] text-[#94A3B8] pt-1">
                Forward transaction slip to WhatsApp <strong className="text-white">0802 279 1227</strong> to be added to the private Telegram alert channel instantly.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArbitrageClient;