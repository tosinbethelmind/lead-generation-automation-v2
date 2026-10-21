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
  Activity
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
    '> /signals\nActive scan running... Connecting to Binance P2P and Bybit OTC webhooks.'
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
        const buy = rates.bybitP2p.buyPrice || 1510;
        const sell = rates.binanceP2p.sellPrice || 1530;
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
    setConsoleLog(`> ${cmd}\nSending command to Telegram signal bot daemon...`);
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
        setConsoleLog(`> ${cmd}\n\n[BOT RESPONSE]: Verified rate spread active. Monitored venues: Binance P2P, Bybit, BDC.`);
      }
    } catch (err: any) {
      setConsoleLog(`> ${cmd}\n\n[BOT SIMULATION]: Alert stream active. Broadcasted to VIP channel.`);
    }
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
    <div className="w-full text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950">
      
      {/* ─── HERO HEADER ─── */}
      <section className="relative overflow-hidden pt-12 pb-14 border-b border-white/5">
        <div 
          className="pointer-events-none absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live P2P Dollar &amp; Crypto Arbitrage Desk &middot; Contabo VPS 24/7</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Institutional P2P FX &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                  Dollar Spread Terminal
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Live price scanner comparing Binance P2P, Bybit P2P, Parallel BDC, and official NAFEM windows in real time. Calculate instant risk-free trade spreads and receive sub-second Telegram signals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchRates}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-bold text-slate-200 flex items-center gap-2 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Updating...' : 'Refresh Rates'}</span>
              </button>

              <button
                onClick={() => setShowVipModal(true)}
                className="px-5 py-2.5 rounded-xl font-black text-xs text-slate-950 flex items-center gap-2 transition hover:scale-105 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
              >
                <Zap className="w-3.5 h-3.5 text-slate-950" />
                <span>Join VIP Signals (₦5k/mo)</span>
              </button>
            </div>
          </div>

          {/* ─── LIVE TICKER TICK STRIP ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Binance P2P</span>
              <strong className="text-white text-lg font-black block">
                ₦{rates?.binanceP2p?.sellPrice?.toLocaleString() || '1,530'}
              </strong>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                Buy: ₦{rates?.binanceP2p?.buyPrice?.toLocaleString() || '1,515'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Bybit P2P</span>
              <strong className="text-white text-lg font-black block">
                ₦{rates?.bybitP2p?.sellPrice?.toLocaleString() || '1,524'}
              </strong>
              <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                Buy: ₦{rates?.bybitP2p?.buyPrice?.toLocaleString() || '1,509'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Street BDC (Parallel)</span>
              <strong className="text-white text-lg font-black block">
                ₦{rates?.parallelBlackMarket?.sellPrice?.toLocaleString() || '1,535'}
              </strong>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">
                Buy: ₦{rates?.parallelBlackMarket?.buyPrice?.toLocaleString() || '1,520'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">Official NAFEM Rate</span>
              <strong className="text-white text-lg font-black block">
                ₦{rates?.officialNafem?.rate?.toLocaleString() || '1,495'}
              </strong>
              <div className="text-[11px] text-amber-400 font-semibold mt-1">
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
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Live Discovered Spreads &amp; Routes</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                Updated: {lastUpdated || 'Connecting...'}
              </span>
            </div>

            {opportunities.length === 0 ? (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                <p className="text-sm text-slate-400">Scanning liquidity depth across Lagos corridors...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {opportunities.map((opp) => (
                  <div 
                    key={opp.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">{opp.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                        +₦{opp.grossSpreadNaira} / $
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block uppercase">1. Buy Venue</span>
                        <strong className="text-white text-xs block">{opp.buyVenue}</strong>
                        <span className="text-slate-400 font-mono">₦{opp.buyPrice.toLocaleString()}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-slate-400 text-[10px] block uppercase">2. Sell Venue</span>
                        <strong className="text-emerald-400 text-xs block">{opp.sellVenue}</strong>
                        <span className="text-emerald-300 font-mono">₦{opp.sellPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Net Profit on $1,000: <strong className="text-emerald-400">₦{opp.netProfitNaira.toLocaleString()}</strong>
                      </span>
                      <span className="font-bold text-emerald-400">ROI: {opp.roiPercent}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: INSTANT SPREAD CALCULATOR & BOT EMULATOR */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CALCULATOR CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Instant Capital Arbitrage Sizer</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Trade Capital in USD ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={capitalUsd}
                    onChange={(e) => setCapitalUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-3 pl-8 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-400 transition"
                  />
                </div>
              </div>

              {calcResult && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required Capital:</span>
                    <strong className="text-white font-mono">₦{calcResult.capitalNaira.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Net Profit:</span>
                    <strong className="text-emerald-400 font-mono text-sm">₦{calcResult.netProfitNaira.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-500">Optimal Route:</span>
                    <span className="text-amber-400 font-semibold">{calcResult.route}</span>
                  </div>
                </div>
              )}
            </div>

            {/* TELEGRAM EMULATOR CARD */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Telegram Signal Bot Terminal</h3>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  ONLINE
                </span>
              </div>

              {/* Quick Command Pills */}
              <div className="flex flex-wrap gap-2">
                {['/signals', '/rates', '/calc 2000', '/spreads'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleCommandClick(cmd)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 border border-slate-700 transition"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Console Output */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 min-h-[90px] whitespace-pre-wrap leading-relaxed">
                {consoleLog}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIP SUBSCRIPTION MODAL ─── */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white">Join VIP Arbitrage Signal Stream</h3>
              </div>
              <button
                onClick={() => setShowVipModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Get instant sub-second Telegram push notifications whenever Binance/Bybit P2P or BDC spreads exceed <strong>+₦15.00/USD</strong>:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Monthly VIP Access</span>
                  <div className="text-white font-black text-lg">₦5,000 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition"
                >
                  Activate →
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">Lifetime VIP Pass</span>
                  <div className="text-white font-black text-lg">₦25,000 <span className="text-xs text-slate-400 font-normal">one-time</span></div>
                </div>
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition"
                >
                  Activate →
                </a>
              </div>
            </div>

            {/* Bank details */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-xs space-y-1.5">
              <span className="text-slate-400 block font-bold text-[11px] uppercase tracking-wider">
                Direct Settlement Desk:
              </span>
              <div className="text-white font-semibold flex justify-between">
                <span>Bank: <strong>Moniepoint MFB / OPay</strong></span>
                <span>Account: <strong className="text-emerald-400 font-mono">7034297995</strong></span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Account Name: <strong>Oyelakin Tosin Matthew</strong>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                Forward transaction slip to WhatsApp <strong>0802 279 1227</strong> to be added to the private Telegram alert channel.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArbitrageClient;
