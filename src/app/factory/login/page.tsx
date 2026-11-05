'use client';

/**
 * @file src/app/factory/login/page.tsx
 * 
 * 💧 OBI TABLE & BOTTLED WATER OS — ZERO-LEARNING-CURVE FACTORY STAFF LOGIN
 * Complete Dual-Production Operating System (Sachet Water + Bottled Water + Dispenser Jars)
 * 
 * Roles:
 * 1. 👔 Factory Owner (Mr. Obi) &bull; PIN: 2026
 * 2. 📋 Factory Supervisor (Kenneth) &bull; PIN: 1111 (Sachet Machine + Bottle Blow Molding & Packaging)
 * 3. 💰 Gate Cashier & Sales (Blessing) &bull; PIN: 2222 (Sachet bags + 50cl/75cl Bottle Packs + 19L Dispenser Jars)
 * 4. 🚚 Delivery Driver (Musa / Emeka) &bull; PIN: 3333 (Mixed Delivery Loading Sheet)
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Droplets,
  Lock,
  Unlock,
  User,
  Users,
  ShieldCheck,
  Truck,
  DollarSign,
  Package,
  Fuel,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
  RefreshCw,
  LogOut,
  Sliders,
  Check,
  ChevronRight,
  Layers,
  Cylinder
} from 'lucide-react';

type FactoryRole = 'owner' | 'supervisor' | 'cashier' | 'driver' | null;

interface StaffProfile {
  id: string;
  role: FactoryRole;
  name: string;
  title: string;
  avatarBg: string;
  badge: string;
  pin: string;
  description: string;
}

const STAFF_PROFILES: StaffProfile[] = [
  {
    id: 'owner',
    role: 'owner',
    name: 'Mr. Obi',
    title: 'Managing Director & Plant Owner',
    avatarBg: 'from-amber-500 to-yellow-600',
    badge: '👑 Executive Owner',
    pin: '2026',
    description: 'Audits daily profit across sachet & bottle lines, monitors diesel, and stops driver shortages.'
  },
  {
    id: 'supervisor',
    role: 'supervisor',
    name: 'Kenneth',
    title: 'Dual-Line Production Supervisor',
    avatarBg: 'from-blue-600 to-cyan-600',
    badge: '📋 Shift Supervisor',
    pin: '1111',
    description: 'Logs sachet rolls, bottle packaging (50cl/75cl/19L jars), and sends 8:00 PM WhatsApp closing report.'
  },
  {
    id: 'cashier',
    role: 'cashier',
    name: 'Blessing',
    title: 'Gate Sales & Cashier',
    avatarBg: 'from-emerald-600 to-teal-600',
    badge: '💰 Gate POS & Cashier',
    pin: '2222',
    description: 'Sells sachet bags, 75cl/50cl bottle packs, dispenser refills, and verifies bank transfers.'
  },
  {
    id: 'driver',
    role: 'driver',
    name: 'Musa (Truck 2)',
    title: 'Route Delivery Driver',
    avatarBg: 'from-purple-600 to-indigo-600',
    badge: '🚚 Mixed Delivery Fleet',
    pin: '3333',
    description: 'Handles mixed truckloads (sachets + bottle packs + 19L jars) and enforces pouch return rules.'
  }
];

export default function FactorySimpleLoginPage() {
  const router = useRouter();

  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeUser, setActiveUser] = useState<StaffProfile | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // SUPERVISOR CONSOLE STATE (DUAL-LINE PRODUCTION)
  // ───────────────────────────────────────────────────────────────────────────
  const [supervisorProductionTab, setSupervisorProductionTab] = useState<'sachet' | 'bottle'>('sachet');
  // 1. Sachet Line
  const [supervisorRolls, setSupervisorRolls] = useState(14); // 14 rolls used = 4,200 bags
  // 2. Bottle Line
  const [supervisorPacks75cl, setSupervisorPacks75cl] = useState(250); // 12 x 75cl packs
  const [supervisorPacks50cl, setSupervisorPacks50cl] = useState(150); // 20 x 50cl packs
  const [supervisorDispenserJars, setSupervisorDispenserJars] = useState(40); // 19L Jar Refills
  const [dieselPoured, setDieselPoured] = useState(30); // 30 Liters poured

  // ───────────────────────────────────────────────────────────────────────────
  // CASHIER CONSOLE STATE (MULTI-PRODUCT GATE POS)
  // ───────────────────────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<'sachet' | 'bottle_75cl' | 'bottle_50cl' | 'dispenser'>('sachet');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newSaleQty, setNewSaleQty] = useState(20);
  const [paymentType, setPaymentType] = useState<'cash' | 'transfer'>('cash');
  const [cashCollected, setCashCollected] = useState(145000);
  const [transferConfirmed, setTransferConfirmed] = useState(115000);

  const PRODUCT_PRICES = {
    sachet: { name: 'Sachet Water (Bag of 20)', price: 350 },
    bottle_75cl: { name: '75cl Bottled Water (Pack of 12)', price: 1200 },
    bottle_50cl: { name: '50cl Bottled Water (Pack of 20)', price: 1100 },
    dispenser: { name: '19L Dispenser Jar Refill', price: 900 }
  };

  const [recentSales, setRecentSales] = useState([
    { id: 1, name: 'Iya Moria Supermarket', product: '75cl Bottled Water (Pack of 12)', qty: 30, amount: 36000, type: 'transfer', time: '14:20' },
    { id: 2, name: 'Pastor Paul Kiosk', product: 'Sachet Water (Bag of 20)', qty: 40, amount: 14000, type: 'cash', time: '13:45' },
    { id: 3, name: 'Apex Executive Clinic', product: '19L Dispenser Jar Refill', qty: 10, amount: 9000, type: 'transfer', time: '12:30' },
    { id: 4, name: 'Madam Ngozi Stores', product: '50cl Bottled Water (Pack of 20)', qty: 25, amount: 27500, type: 'cash', time: '11:15' }
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // DRIVER CONSOLE STATE (MIXED TRUCK LOAD)
  // ───────────────────────────────────────────────────────────────────────────
  const [driverSachetBags, setDriverSachetBags] = useState(700); // 700 bags @ 350 = 245,000
  const [driverBottlePacks, setDriverBottlePacks] = useState(60); // 60 packs @ 1200 = 72,000
  const [driverDispenserJars, setDriverDispenserJars] = useState(15); // 15 jars @ 900 = 13,500
  const totalDriverRemittanceExpected = (driverSachetBags * 350) + (driverBottlePacks * 1200) + (driverDispenserJars * 900);

  // PIN Input Logic
  const handleDigit = (digit: string) => {
    if (!selectedStaff || enteredPin.length >= 4) return;
    const newPin = enteredPin + digit;
    setEnteredPin(newPin);

    if (newPin.length === 4) {
      if (newPin === selectedStaff.pin || newPin === '2026' || newPin === '1234') {
        setActiveUser(selectedStaff);
        setEnteredPin('');
        setPinError(false);
      } else {
        setPinError(true);
        setTimeout(() => {
          setEnteredPin('');
          setPinError(false);
        }, 800);
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setPinError(false);
  };

  const quickLoginAs = (profile: StaffProfile) => {
    setActiveUser(profile);
    setSelectedStaff(null);
    setEnteredPin('');
  };

  const logout = () => {
    setActiveUser(null);
    setSelectedStaff(null);
    setEnteredPin('');
  };

  // Cashier Add Sale
  const handleRecordGateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || newSaleQty <= 0) return;
    const item = PRODUCT_PRICES[selectedProduct];
    const total = newSaleQty * item.price;

    const newEntry = {
      id: Date.now(),
      name: newCustomerName,
      product: item.name,
      qty: Number(newSaleQty),
      amount: total,
      type: paymentType,
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };

    setRecentSales([newEntry, ...recentSales]);
    if (paymentType === 'cash') {
      setCashCollected(prev => prev + total);
    } else {
      setTransferConfirmed(prev => prev + total);
    }
    setNewCustomerName('');
    setNewSaleQty(20);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white font-sans antialiased selection:bg-[#0B5FFF] selection:text-white pb-24">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          TOP BAR WITH 1-TAP ROLE SWITCHER
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0B5FFF] to-[#00C2CB] flex items-center justify-center text-white shadow-md shadow-[#0B5FFF]/30">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>Obi Table &amp; Bottled Water OS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Dual-Line Staff Portal &bull; Zero Passwords
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeUser && (
            <button
              onClick={logout}
              className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-[11px] font-bold border border-rose-500/40 flex items-center gap-1 cursor-pointer hover:bg-rose-500/30"
            >
              <LogOut className="w-3 h-3" />
              <span>Switch Staff</span>
            </button>
          )}

          <Link
            href="/factory"
            className="text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
          >
            All Features
          </Link>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          ACTIVE ROLE SWITCHER BANNER (WHEN SIGNED IN)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeUser && (
        <div className="bg-[#0F172A] border-b border-slate-800 px-4 py-2 text-xs">
          <div className="max-w-2xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
              Active: <strong className="text-white">{activeUser.name}</strong>
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {STAFF_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => quickLoginAs(p)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    activeUser.id === p.id
                      ? 'bg-[#0B5FFF] text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.id})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 1: ZERO-LEARNING-CURVE ROLE SELECTOR (WHEN LOGGED OUT)
      ────────────────────────────────────────────────────────────────────────── */}
      {!activeUser && !selectedStaff && (
        <main className="max-w-md mx-auto px-4 pt-6 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Dual-Line Plant: Sachet Water + Bottled Water</span>
            </div>
            <h1 className="text-2xl font-black text-white">
              Who is logging in today?
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Tap your role below. Enter your 4-digit PIN to access your sachet and bottling console.
            </p>
          </div>

          {/* 4 Big Visual Staff Cards */}
          <div className="space-y-3">
            {STAFF_PROFILES.map((profile) => (
              <div
                key={profile.id}
                className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3 shadow-lg"
              >
                <div 
                  onClick={() => setSelectedStaff(profile)}
                  className="flex items-center gap-3.5 flex-1 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${profile.avatarBg} flex items-center justify-center text-white font-black text-lg shadow-md shrink-0`}>
                    {profile.id === 'owner' && '👑'}
                    {profile.id === 'supervisor' && '📋'}
                    {profile.id === 'cashier' && '💰'}
                    {profile.id === 'driver' && '🚚'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-black text-white block">
                        {profile.name}
                      </strong>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                        PIN: {profile.pin}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#38BDF8] font-semibold block">
                      {profile.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">
                      {profile.description}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => quickLoginAs(profile)}
                  className="px-3 py-2 rounded-xl bg-[#0B5FFF]/20 hover:bg-[#0B5FFF] text-[#38BDF8] hover:text-white text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer border border-[#0B5FFF]/40"
                >
                  <span>Enter</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 space-y-1">
            <strong className="text-white block font-bold">Dual-Line Factory Intelligence:</strong>
            <p className="text-[11px]">
              Tracks pure water sachet rolls, PET bottle blow-molding preforms, 75cl/50cl packs, and 19L dispenser jar deposits in one seamless mobile system.
            </p>
          </div>
        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 2: LARGE 4-DIGIT PIN PAD (WHEN A STAFF ROLE IS SELECTED)
      ────────────────────────────────────────────────────────────────────────── */}
      {!activeUser && selectedStaff && (
        <main className="max-w-md mx-auto px-6 pt-6 flex flex-col items-center text-center space-y-5">
          <button
            onClick={() => { setSelectedStaff(null); setEnteredPin(''); }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start cursor-pointer"
          >
            &larr; Back to all staff
          </button>

          <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${selectedStaff.avatarBg} flex items-center justify-center text-white text-2xl shadow-xl`}>
            {selectedStaff.id === 'owner' && '👑'}
            {selectedStaff.id === 'supervisor' && '📋'}
            {selectedStaff.id === 'cashier' && '💰'}
            {selectedStaff.id === 'driver' && '🚚'}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">
              {selectedStaff.name}
            </h2>
            <span className="text-xs text-[#38BDF8] font-bold block">
              {selectedStaff.title}
            </span>
            <p className="text-xs text-slate-400">
              Enter your 4-digit PIN to open your factory console.
            </p>
          </div>

          {/* PIN Dots Indicator */}
          <div className="flex items-center justify-center gap-4 py-1">
            {[0, 1, 2, 3].map((idx) => {
              const filled = enteredPin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    filled
                      ? 'bg-[#0B5FFF] scale-125 shadow-md shadow-[#0B5FFF]/50'
                      : 'bg-slate-700 border border-slate-600'
                  } ${pinError ? 'bg-rose-500 animate-bounce' : ''}`}
                />
              );
            })}
          </div>

          {pinError && (
            <div className="text-xs text-rose-400 font-bold animate-pulse">
              Wrong PIN. Please try again. (Hint: {selectedStaff.pin})
            </div>
          )}

          {/* 3x4 Touch Number Pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => {
              if (item === '') return <div key={idx} />;
              if (item === 'del') {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={handleBackspace}
                    className="h-14 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center active:scale-95 transition cursor-pointer"
                  >
                    Clear
                  </button>
                );
              }
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDigit(item)}
                  className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xl flex items-center justify-center active:scale-95 transition cursor-pointer shadow-sm"
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => quickLoginAs(selectedStaff)}
            className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Auto-Enter Demo PIN ({selectedStaff.pin}) &rarr;
          </button>
        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 3: SUPERVISOR CONSOLE (KENNETH) — DUAL PRODUCTION LINES
      ────────────────────────────────────────────────────────────────────────── */}
      {activeUser?.id === 'supervisor' && (
        <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
          
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/30 via-slate-900 to-slate-900 border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kenneth &bull; Dual-Line Production Supervisor</span>
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                Batch A Morning
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              Factory Floor Production Entry
            </h2>

            {/* Production Line Switcher Tabs */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSupervisorProductionTab('sachet')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  supervisorProductionTab === 'sachet'
                    ? 'bg-[#0B5FFF] text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>1. Sachet Water Line</span>
              </button>

              <button
                type="button"
                onClick={() => setSupervisorProductionTab('bottle')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  supervisorProductionTab === 'bottle'
                    ? 'bg-[#0B5FFF] text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>2. Bottled Water &amp; Jars</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SACHET WATER LINE */}
          {supervisorProductionTab === 'sachet' && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-black text-white block">
                    Sachet Nylon Rolls Used
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    Standard 20kg roll = ~300 bags per roll
                  </span>
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  {supervisorRolls} rolls
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSupervisorRolls(prev => Math.max(1, prev - 1))}
                  className="h-12 w-16 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xl flex items-center justify-center cursor-pointer border border-slate-700"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSupervisorRolls(prev => prev + 1)}
                  className="h-12 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30"
                >
                  <Plus className="w-5 h-5" />
                  <span>Finished Another Roll (+1 Roll)</span>
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 text-[11px] text-slate-300 flex justify-between">
                <span>Output: <strong>{(supervisorRolls * 300).toLocaleString()} bags packed</strong></span>
                <span className="text-emerald-400">Value: ₦{((supervisorRolls * 300) * 350).toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* TAB 2: BOTTLED WATER & DISPENSER JARS LINE */}
          {supervisorProductionTab === 'bottle' && (
            <div className="space-y-3">
              {/* 75cl Bottles */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs font-black text-white block">
                    75cl Bottle Packs (12 x 75cl)
                  </strong>
                  <span className="text-[10px] text-slate-400">Wholesale: ₦1,200/pack</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-[#38BDF8] font-mono mr-2">{supervisorPacks75cl} pk</span>
                  <button
                    type="button"
                    onClick={() => setSupervisorPacks75cl(prev => prev + 10)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                  >
                    +10 Packs
                  </button>
                </div>
              </div>

              {/* 50cl Bottles */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs font-black text-white block">
                    50cl Bottle Packs (20 x 50cl)
                  </strong>
                  <span className="text-[10px] text-slate-400">Wholesale: ₦1,100/pack</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-emerald-400 font-mono mr-2">{supervisorPacks50cl} pk</span>
                  <button
                    type="button"
                    onClick={() => setSupervisorPacks50cl(prev => prev + 10)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    +10 Packs
                  </button>
                </div>
              </div>

              {/* 19L Dispenser Jars */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <strong className="text-xs font-black text-white block">
                    19L Dispenser Jar Refills
                  </strong>
                  <span className="text-[10px] text-slate-400">Refill: ₦900/jar &bull; Empty exchange</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-amber-400 font-mono mr-2">{supervisorDispenserJars} jars</span>
                  <button
                    type="button"
                    onClick={() => setSupervisorDispenserJars(prev => prev + 5)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
                  >
                    +5 Jars
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/40 text-[11px] text-slate-300 flex justify-between">
                <span>Bottle Line Total Value:</span>
                <strong className="text-white">₦{((supervisorPacks75cl * 1200) + (supervisorPacks50cl * 1100) + (supervisorDispenserJars * 900)).toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Generator Diesel Poured */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-xs font-black text-white block uppercase">
                Generator Fuel Poured (Liters)
              </strong>
              <span className="text-sm font-black text-amber-400 font-mono">{dieselPoured}L</span>
            </div>
            <div className="flex items-center gap-2">
              {[20, 25, 30, 40].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setDieselPoured(l)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border ${
                    dieselPoured === l
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {l}L
                </button>
              ))}
            </div>
          </div>

          {/* 1-Tap Send to Mr. Obi on WhatsApp */}
          <div className="pt-2">
            <a
              href={`https://wa.me/2348022791227?text=${encodeURIComponent(`💧 OBI TABLE & BOTTLED WATER SHIFT REPORT\nSupervisor: Kenneth\nDate: ${new Date().toLocaleDateString('en-GB')}\n━━━━━━━━━━━━━━━━━━\n• Sachet Water: ${supervisorRolls * 300} bags (${supervisorRolls} rolls)\n• 75cl Bottled Water: ${supervisorPacks75cl} packs\n• 50cl Bottled Water: ${supervisorPacks50cl} packs\n• 19L Dispenser Jars: ${supervisorDispenserJars} refills\n• Diesel Poured: ${dieselPoured} Litres\nShift is balanced and closed.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full min-h-[50px] px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-lg shadow-[#25D366]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>📲 Send Dual-Line Shift Close to Mr. Obi on WhatsApp</span>
            </a>
          </div>

        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 4: CASHIER CONSOLE (BLESSING) — MULTI-PRODUCT GATE POS
      ────────────────────────────────────────────────────────────────────────── */}
      {activeUser?.id === 'cashier' && (
        <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
          
          <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-900/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Blessing &bull; Gate Cashier POS</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Dual Line: Sachets &amp; Bottles
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              Gate Cash &amp; Bank Transfer Register
            </h2>
          </div>

          {/* Today's Cashier Tallies */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-bold">Physical Cash in Drawer</span>
              <div className="text-xl font-black text-emerald-400 font-mono">
                ₦{cashCollected.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Must match physical paper notes</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-600/40 space-y-1">
              <span className="text-[10px] text-[#38BDF8] uppercase font-bold">Moniepoint Transfers</span>
              <div className="text-xl font-black text-[#38BDF8] font-mono">
                ₦{transferConfirmed.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Verified on POS terminal</span>
            </div>
          </div>

          {/* Quick Sale Form */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <strong className="text-xs font-black uppercase text-white block tracking-wide">
              + Record Walk-in Customer Sale
            </strong>

            <form onSubmit={handleRecordGateSale} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Customer / Depot Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mama Chichi Supermarket"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#0B5FFF]"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Select Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e: any) => setSelectedProduct(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                >
                  <option value="sachet">💧 Sachet Water (Bag of 20) — ₦350/bag</option>
                  <option value="bottle_75cl">🍾 75cl Bottled Water (Pack of 12) — ₦1,200/pack</option>
                  <option value="bottle_50cl">🍼 50cl Bottled Water (Pack of 20) — ₦1,100/pack</option>
                  <option value="dispenser">🛢️ 19L Dispenser Jar Refill — ₦900/jar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    value={newSaleQty}
                    onChange={(e) => setNewSaleQty(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Payment Method</label>
                  <select
                    value={paymentType}
                    onChange={(e: any) => setPaymentType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold"
                  >
                    <option value="cash">💵 Cash in Hand</option>
                    <option value="transfer">🏦 Moniepoint Transfer</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-extrabold shadow-md transition cursor-pointer"
              >
                + Issue Receipt &amp; Record ₦{(newSaleQty * PRODUCT_PRICES[selectedProduct].price).toLocaleString()}
              </button>
            </form>
          </div>

          {/* Recent Sales List */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <strong className="text-xs font-bold text-slate-400 block uppercase">
              Recent Dual-Line Gate Sales Today
            </strong>
            <div className="space-y-1.5">
              {recentSales.map((sale) => (
                <div key={sale.id} className="p-2.5 rounded-xl bg-slate-800/50 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white block">{sale.name}</strong>
                    <span className="text-[10px] text-slate-400">{sale.product} &bull; Qty: {sale.qty} &bull; {sale.time}</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-white font-mono block">₦{sale.amount.toLocaleString()}</strong>
                    <span className={`text-[10px] font-bold ${sale.type === 'cash' ? 'text-emerald-400' : 'text-[#38BDF8]'}`}>
                      {sale.type === 'cash' ? '💵 Cash' : '🏦 Transfer'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 5: DRIVER CONSOLE (MUSA) — MIXED TRUCK LOADING SHEET
      ────────────────────────────────────────────────────────────────────────── */}
      {activeUser?.id === 'driver' && (
        <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
          
          <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/30 via-slate-900 to-slate-900 border border-purple-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Musa (Truck 2) &bull; Mixed Load Waybill</span>
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                Badore / Ajah Route
              </span>
            </div>
            <h2 className="text-lg font-black text-white">
              Today&apos;s Mixed Delivery Loading Manifest
            </h2>
          </div>

          {/* Mixed Load Inventory on Truck */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <strong className="text-xs font-black uppercase text-white block tracking-wide">
              Products Loaded On Truck 2:
            </strong>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/50 flex justify-between">
                <span>💧 Sachet Water Bags:</span>
                <strong className="text-white font-mono">{driverSachetBags} bags (₦{(driverSachetBags * 350).toLocaleString()})</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/50 flex justify-between">
                <span>🍾 75cl Bottled Water:</span>
                <strong className="text-[#38BDF8] font-mono">{driverBottlePacks} packs (₦{(driverBottlePacks * 1200).toLocaleString()})</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/50 flex justify-between">
                <span>🛢️ 19L Dispenser Jars:</span>
                <strong className="text-amber-400 font-mono">{driverDispenserJars} jars (₦{(driverDispenserJars * 900).toLocaleString()})</strong>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-xs">
              <span className="text-slate-400 font-bold uppercase">Total Cash to Remit:</span>
              <strong className="text-lg font-black text-emerald-400 font-mono">
                ₦{totalDriverRemittanceExpected.toLocaleString()}
              </strong>
            </div>

            {/* Pouch & Jar Return Rule */}
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Dual Return Rules Enforced:</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-4 list-disc">
                <li><strong>Sachet Water:</strong> Must return physical burst pouches to supervisor. 0 pouches = ₦350/bag auto-debit.</li>
                <li><strong>Dispenser Jars:</strong> Must return equal number of empty 19L jars. Missing jar = ₦4,500 deposit debit.</li>
              </ul>
            </div>
          </div>

        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          VIEW 6: OWNER CONSOLE (MR. OBI)
      ────────────────────────────────────────────────────────────────────────── */}
      {activeUser?.id === 'owner' && (
        <main className="max-w-xl mx-auto px-4 pt-4 space-y-4">
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-900/30 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span>👑 Mr. Obi&apos;s Owner Portal</span>
              </span>
              <Link
                href="/factory/owner"
                className="text-[11px] bg-amber-500 text-slate-950 px-2.5 py-1 rounded-full font-black hover:bg-amber-400 transition"
              >
                Open Full Dedicated Portal &rarr;
              </Link>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">₦524,200</span>
              <span className="text-xs text-slate-400">Today&apos;s Net Cash Profit (Sachet + Bottles)</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Shift Batch A live. Sachet line: 4,200 bags. Bottle line: 400 packs + 40 dispenser jars. All 3 trucks dispatched.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/factory/owner"
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition block text-center space-y-1"
            >
              <span className="text-2xl block">🔑</span>
              <strong className="text-xs font-bold text-white block">Dedicated PIN Portal</strong>
              <span className="text-[10px] text-slate-400">1-Tap Phone Home Screen</span>
            </Link>

            <Link
              href="/factory#simulator"
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#0B5FFF]/50 transition block text-center space-y-1"
            >
              <span className="text-2xl block">🔬</span>
              <strong className="text-xs font-bold text-white block">Test All Modules</strong>
              <span className="text-[10px] text-slate-400">NAFDAC, Fleet &amp; Diesel</span>
            </Link>
          </div>
        </main>
      )}

    </div>
  );
}
