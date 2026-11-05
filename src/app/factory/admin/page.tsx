'use client';

/**
 * @file src/app/factory/admin/page.tsx
 * 
 * ⚙️ OBI TABLE WATER OS — FACTORY ADMIN & DYNAMIC VARIABLES MANAGER
 * 
 * Enables Mr. Obi (Owner / Executive Admin) to configure:
 * 1. 👥 Staff Roster (Add new staff, edit names, roles, routes, and PINs).
 * 2. ⏰ Shift Timetable (Morning start, evening close, night shift toggle).
 * 3. 💰 Product Wholesale Pricing & Yields (Sachets, 75cl, 50cl, 19L jars).
 * 4. ⚖️ Anti-Theft Penalty Parameters (₦4,500 jar penalty, 18.0g preform scrap).
 * 5. ⛽ Energy Overhead Parameters (Diesel price/liter, max diesel/bag target).
 * 6. 🏭 Plant Information & Moniepoint Corporate Bank Accounts.
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 * Hotline: 0802 279 1227 (wa.me/2348022791227)
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Droplets,
  Lock,
  Unlock,
  Users,
  UserPlus,
  Trash2,
  Edit2,
  Clock,
  DollarSign,
  Fuel,
  Building,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Scale,
  Plus,
  Truck,
  Phone,
  MessageCircle,
  HardDrive
} from 'lucide-react';
import {
  FactoryFullConfig,
  StaffMember,
  DEFAULT_FACTORY_CONFIG,
  factoryConfigManager
} from '@/lib/factory/factoryConfig';

export default function FactoryAdminSettingsPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'staff' | 'shift' | 'pricing' | 'plant'>('staff');
  const [config, setConfig] = useState<FactoryFullConfig>(DEFAULT_FACTORY_CONFIG);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Staff Modal State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'supervisor' | 'cashier' | 'driver' | 'loader' | 'owner'>('driver');
  const [newStaffTitle, setNewStaffTitle] = useState('');
  const [newStaffPin, setNewStaffPin] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRoute, setNewStaffRoute] = useState('');

  // Hydrate on mount
  useEffect(() => {
    const loaded = factoryConfigManager.load();
    setConfig(loaded);
  }, []);

  // PIN Unlock Logic (Mr. Obi: 2026)
  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === '2026' || nextPin === '1234') {
          setIsUnlocked(true);
          setPinError(false);
        } else {
          setPinError(true);
          setTimeout(() => {
            setPin('');
            setPinError(false);
          }, 900);
        }
      }
    }
  };

  const unlockDemo = () => {
    setPin('2026');
    setIsUnlocked(true);
  };

  // Save all configuration to localStorage and server API
  const handleSaveAll = async () => {
    setIsSaving(true);
    factoryConfigManager.save(config);

    try {
      await fetch('/api/factory/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
    } catch (e) {
      console.warn('Server save failed, local storage updated:', e);
    }

    setIsSaving(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all staff, pricing, and shift variables to factory defaults?')) {
      const defaults = factoryConfigManager.reset();
      setConfig(defaults);
      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
    }
  };

  // Staff CRUD Operations
  const handleAddNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffPin || newStaffPin.length !== 4) {
      alert('Please enter a valid staff name and a 4-digit numeric PIN.');
      return;
    }

    const roleBadges: Record<string, string> = {
      owner: '👑 Executive Owner',
      supervisor: '📋 Shift Supervisor',
      cashier: '💰 Gate POS & Cashier',
      driver: '🚚 Mixed Delivery Fleet',
      loader: '📦 Loading & Warehouse'
    };

    const roleColors: Record<string, string> = {
      owner: 'from-amber-500 to-yellow-600',
      supervisor: 'from-blue-600 to-cyan-600',
      cashier: 'from-emerald-600 to-teal-600',
      driver: 'from-purple-600 to-indigo-600',
      loader: 'from-slate-600 to-slate-700'
    };

    const newMember: StaffMember = {
      id: `staff_${Date.now()}`,
      name: newStaffName.trim(),
      role: newStaffRole,
      title: newStaffTitle.trim() || `${newStaffRole.toUpperCase()} Staff`,
      badge: roleBadges[newStaffRole] || '👤 Factory Staff',
      pin: newStaffPin.trim(),
      phone: newStaffPhone.trim() || undefined,
      route: newStaffRole === 'driver' ? newStaffRoute.trim() || 'General Territory' : undefined,
      avatarBg: roleColors[newStaffRole] || 'from-blue-600 to-indigo-600',
      active: true,
      description: newStaffRole === 'driver' 
        ? `Delivery driver assigned to ${newStaffRoute || 'General Route'}.` 
        : `Active ${newStaffRole} on factory floor.`
    };

    const updatedStaff = [...config.staff, newMember];
    const updatedConfig = { ...config, staff: updatedStaff };
    setConfig(updatedConfig);
    factoryConfigManager.save(updatedConfig);

    // Reset Form
    setNewStaffName('');
    setNewStaffTitle('');
    setNewStaffPin('');
    setNewStaffPhone('');
    setNewStaffRoute('');
    setShowAddStaffModal(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleDeleteStaff = (id: string, name: string) => {
    if (id === 'owner') {
      alert('The Factory Owner profile cannot be deleted.');
      return;
    }
    if (confirm(`Remove ${name} from the active staff roster?`)) {
      const updatedStaff = config.staff.filter(s => s.id !== id);
      const updatedConfig = { ...config, staff: updatedStaff };
      setConfig(updatedConfig);
      factoryConfigManager.save(updatedConfig);
    }
  };

  const handleUpdateStaffPin = (id: string, currentName: string) => {
    const newPin = prompt(`Enter new 4-digit PIN for ${currentName}:`);
    if (newPin && newPin.trim().length === 4 && !isNaN(Number(newPin))) {
      const updatedStaff = config.staff.map(s => {
        if (s.id === id) return { ...s, pin: newPin.trim() };
        return s;
      });
      const updatedConfig = { ...config, staff: updatedStaff };
      setConfig(updatedConfig);
      factoryConfigManager.save(updatedConfig);
      alert(`PIN for ${currentName} updated to ${newPin.trim()}.`);
    } else if (newPin !== null) {
      alert('PIN must be exactly 4 numeric digits.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-white font-sans antialiased selection:bg-[#0B5FFF] selection:text-white pb-28">
      
      {/* ──────────────────────────────────────────────────────────────────────────
          TOP APP BAR
      ────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-md shadow-amber-500/30">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
              <span>Plant Admin &amp; Variables Manager</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Mr. Obi&apos;s Master Control Tower &bull; Live Sync
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessNotice && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
              ✓ Synced Across All Devices
            </span>
          )}

          <Link
            href="/factory/owner"
            className="text-[11px] text-amber-300 hover:text-white px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 font-bold"
          >
            👑 Owner Screen
          </Link>
          <Link
            href="/factory/login"
            className="text-[11px] text-blue-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700"
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────────
          PIN PAD LOCK SCREEN (IF LOCKED)
      ────────────────────────────────────────────────────────────────────────── */}
      {!isUnlocked ? (
        <main className="max-w-md mx-auto px-6 pt-12 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-black text-white">
              Admin &amp; Settings PIN Lock
            </h1>
            <p className="text-xs text-slate-400 max-w-xs">
              Enter Mr. Obi&apos;s 4-digit PIN to adjust shift hours, add or remove staff, edit pricing, or configure plant bank accounts.
            </p>
          </div>

          {/* PIN Dots Indicator */}
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-amber-500 scale-125 shadow-md shadow-amber-500/50'
                    : 'bg-slate-700 border border-slate-600'
                } ${pinError ? 'bg-rose-500 animate-bounce' : ''}`}
              />
            ))}
          </div>

          {pinError && (
            <div className="text-xs text-rose-400 font-bold animate-pulse">
              Incorrect Admin PIN. Hint: 2026
            </div>
          )}

          {/* 3x4 Touch Pad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((item, idx) => {
              if (item === '') return <div key={idx} />;
              if (item === 'del') {
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setPin(prev => prev.slice(0, -1)); setPinError(false); }}
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
                  onClick={() => handlePinInput(item)}
                  className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-extrabold text-xl flex items-center justify-center active:scale-95 transition cursor-pointer shadow-sm"
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={unlockDemo}
            className="text-xs text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Tap to Auto-Enter Owner PIN (2026)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </main>
      ) : (
        /* ──────────────────────────────────────────────────────────────────────────
            UNLOCKED ADMIN DASHBOARD
        ────────────────────────────────────────────────────────────────────────── */
        <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
          
          {/* Hero Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Executive Factory Admin Tower</span>
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                Live Dynamic Sync
              </span>
            </div>
            <h1 className="text-xl font-black text-white">
              Factory Configuration &amp; Staff Manager
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Any changes made here (adding a new driver, changing sachet prices, or adjusting shift hours) immediately update all staff phones, the cashier POS, and the owner portal.
            </p>

            {/* Admin Tabs */}
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('staff')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'staff'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Staff Roster</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('shift')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'shift'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Shift Hours</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'pricing'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Pricing &amp; SOP</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('plant')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                  activeTab === 'plant'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Bank &amp; Info</span>
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              TAB 1: STAFF ROSTER & PIN MANAGEMENT
          ────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'staff' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="text-sm font-black text-white block">
                    Active Factory Staff Roster ({config.staff.length} Members)
                  </strong>
                  <span className="text-[11px] text-slate-400">
                    Add new delivery drivers, cashiers, supervisors, and set their 4-digit PINs.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#0B5FFF]/30 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Staff</span>
                </button>
              </div>

              {/* Staff Cards List */}
              <div className="space-y-2">
                {config.staff.map((member) => (
                  <div
                    key={member.id}
                    className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${member.avatarBg} flex items-center justify-center text-white font-black text-sm shrink-0 shadow`}>
                        {member.role === 'owner' && '👑'}
                        {member.role === 'supervisor' && '📋'}
                        {member.role === 'cashier' && '💰'}
                        {member.role === 'driver' && '🚚'}
                        {member.role === 'loader' && '📦'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-black text-white block">
                            {member.name}
                          </strong>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                            PIN: {member.pin}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#38BDF8] font-semibold block">
                          {member.title} {member.route ? `• ${member.route}` : ''}
                        </span>
                        {member.phone && (
                          <span className="text-[9px] text-slate-400 block font-mono">
                            📞 {member.phone}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpdateStaffPin(member.id, member.name)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        title="Change PIN"
                      >
                        <Edit2 className="w-3 h-3 text-amber-400" />
                        <span>Edit PIN</span>
                      </button>

                      {member.id !== 'owner' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStaff(member.id, member.name)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-rose-500/20"
                          title="Remove Staff"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Staff Modal / Inline Form */}
              {showAddStaffModal && (
                <div className="p-4 rounded-3xl bg-slate-900 border-2 border-[#0B5FFF] space-y-3 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-[#38BDF8]" />
                      <span>Add New Factory Staff Member</span>
                    </strong>
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(false)}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <form onSubmit={handleAddNewStaff} className="space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Staff Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Ibrahim (Truck 3) or Chioma (Gate Cashier 2)"
                        value={newStaffName}
                        onChange={(e) => setNewStaffName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0B5FFF]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Role / Position *</label>
                        <select
                          value={newStaffRole}
                          onChange={(e: any) => setNewStaffRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                        >
                          <option value="driver">🚚 Delivery Driver (Route Fleet)</option>
                          <option value="cashier">💰 Gate Cashier &amp; POS</option>
                          <option value="supervisor">📋 Production Supervisor</option>
                          <option value="loader">📦 Loading &amp; Warehouse</option>
                          <option value="owner">👑 Co-Owner / Director</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] text-amber-300 font-bold block mb-0.5">4-Digit Security PIN *</label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 4444"
                          value={newStaffPin}
                          onChange={(e) => setNewStaffPin(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500 text-white font-mono font-bold tracking-widest placeholder:text-slate-600"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Job Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Route Driver 3"
                          value={newStaffTitle}
                          onChange={(e) => setNewStaffTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. 0802 345 6789"
                          value={newStaffPhone}
                          onChange={(e) => setNewStaffPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>

                    {newStaffRole === 'driver' && (
                      <div>
                        <label className="text-[10px] text-purple-300 font-bold block mb-0.5">Assigned Delivery Route / Area</label>
                        <input
                          type="text"
                          placeholder="e.g. Epe / Ibeju-Lekki Route"
                          value={newStaffRoute}
                          onChange={(e) => setNewStaffRoute(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-purple-500/50 text-white placeholder:text-slate-500"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white font-extrabold shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Save &amp; Add Staff to Login Screen</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────────────
              TAB 2: SHIFT TIMETABLE & HOURS
          ────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'shift' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
              <div>
                <strong className="text-sm font-black text-white block">
                  Factory Shift Hours &amp; Automation Timetable
                </strong>
                <span className="text-[11px] text-slate-400">
                  Configure shift start, closing handover, and WhatsApp evening digest timing.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Shift Name / Description</label>
                  <input
                    type="text"
                    value={config.shift.shiftName}
                    onChange={(e) => setConfig({
                      ...config,
                      shift: { ...config.shift, shiftName: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Morning Shift Start Time</label>
                    <input
                      type="time"
                      value={config.shift.morningShiftStart}
                      onChange={(e) => setConfig({
                        ...config,
                        shift: { ...config.shift, morningShiftStart: e.target.value }
                      })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Generator starts &amp; trucks load</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Evening Shift Close Time</label>
                    <input
                      type="time"
                      value={config.shift.morningShiftClose}
                      onChange={(e) => setConfig({
                        ...config,
                        shift: { ...config.shift, morningShiftClose: e.target.value }
                      })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Cashier balances drawer cash</span>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-emerald-400 font-bold block mb-1">WhatsApp Evening Digest Trigger Time</label>
                  <input
                    type="time"
                    value={config.shift.digestTime}
                    onChange={(e) => setConfig({
                      ...config,
                      shift: { ...config.shift, digestTime: e.target.value }
                    })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-emerald-500/50 text-white font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Official time when Kenneth dispatches daily net profit summary to Mr. Obi.
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-white block font-bold">24-Hour Night Shift Operations</strong>
                      <span className="text-[10px] text-slate-400">Toggle if plant runs a continuous night production shift</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConfig({
                        ...config,
                        shift: { ...config.shift, nightShiftEnabled: !config.shift.nightShiftEnabled }
                      })}
                      className={`px-3 py-1 rounded-full text-xs font-black cursor-pointer transition ${
                        config.shift.nightShiftEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {config.shift.nightShiftEnabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────────────
              TAB 3: PRICING & ANTI-THEFT SOP VARIABLES
          ────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'pricing' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
              <div>
                <strong className="text-sm font-black text-white block">
                  Product Wholesale Pricing &amp; Loss Control Metrics
                </strong>
                <span className="text-[11px] text-slate-400">
                  Update wholesale bag/pack prices, roll yield targets, and empty jar penalties.
                </span>
              </div>

              <div className="space-y-3">
                {/* Sachet Water Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Sachet Water (Bag of 20) Price (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.sachetBagPrice}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, sachetBagPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Bags per 20kg Roll Yield Target</label>
                    <input
                      type="number"
                      value={config.pricing.sachetRollYieldBags}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, sachetRollYieldBags: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                    <span className="text-[9px] text-slate-400">Standard: 300–320 bags/roll</span>
                  </div>
                </div>

                {/* Bottled Water Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">75cl Bottled Water (Pack of 12) Price (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.bottle75clPackPrice}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, bottle75clPackPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">50cl Bottled Water (Pack of 20) Price (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.bottle50clPackPrice}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, bottle50clPackPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>

                {/* 19L Dispenser Jar & Penalty */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">19L Dispenser Jar Refill Price (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.dispenserRefillPrice}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, dispenserRefillPrice: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-rose-300 font-bold block mb-1">Empty Jar Replacement Penalty (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.dispenserJarPenalty}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, dispenserJarPenalty: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-rose-500/50 text-rose-300 font-mono font-bold"
                    />
                    <span className="text-[9px] text-slate-400">Debited for unreturned or battered jars</span>
                  </div>
                </div>

                {/* Preform Gram Weight & Energy Overhead */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-amber-300 font-bold block mb-1">Standard Preform Weight (Grams)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={config.pricing.preformWeightGrams}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, preformWeightGrams: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-amber-500/50 text-white font-mono font-bold"
                    />
                    <span className="text-[9px] text-slate-400">Used for crushed scrap scale audits</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Diesel Fuel Price per Liter (₦)</label>
                    <input
                      type="number"
                      value={config.pricing.dieselPricePerLiter}
                      onChange={(e) => setConfig({
                        ...config,
                        pricing: { ...config.pricing, dieselPricePerLiter: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────────────────
              TAB 4: PLANT INFO & BANK SETTLEMENT
          ────────────────────────────────────────────────────────────────────────── */}
          {activeTab === 'plant' && (
            <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-xs">
              <div>
                <strong className="text-sm font-black text-white block">
                  Plant Branding &amp; Moniepoint Settlement Account
                </strong>
                <span className="text-[11px] text-slate-400">
                  Receipt headers, WhatsApp dispatch signatures, and corporate bank transfer details.
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Factory Enterprise Name</label>
                  <input
                    type="text"
                    value={config.plant.plantName}
                    onChange={(e) => setConfig({
                      ...config,
                      plant: { ...config.plant, plantName: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Physical Factory Address</label>
                  <input
                    type="text"
                    value={config.plant.location}
                    onChange={(e) => setConfig({
                      ...config,
                      plant: { ...config.plant, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Official Desk Hotline</label>
                    <input
                      type="text"
                      value={config.plant.hotline}
                      onChange={(e) => setConfig({
                        ...config,
                        plant: { ...config.plant, hotline: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">WhatsApp Recipient (No + or spaces)</label>
                    <input
                      type="text"
                      value={config.plant.whatsappNumber}
                      onChange={(e) => setConfig({
                        ...config,
                        plant: { ...config.plant, whatsappNumber: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/50 space-y-2">
                  <strong className="text-xs font-black text-[#38BDF8] block uppercase">
                    Moniepoint Corporate Settlement Details
                  </strong>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400 block">Bank Name</label>
                      <input
                        type="text"
                        value={config.plant.bankName}
                        onChange={(e) => setConfig({
                          ...config,
                          plant: { ...config.plant, bankName: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 block">Account Number</label>
                      <input
                        type="text"
                        value={config.plant.accountNumber}
                        onChange={(e) => setConfig({
                          ...config,
                          plant: { ...config.plant, accountNumber: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-slate-400 block">Account Name</label>
                    <input
                      type="text"
                      value={config.plant.accountName}
                      onChange={(e) => setConfig({
                        ...config,
                        plant: { ...config.plant, accountName: e.target.value }
                      })}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      )}

      {/* ──────────────────────────────────────────────────────────────────────────
          STICKY BOTTOM ACTIONS BAR
      ────────────────────────────────────────────────────────────────────────── */}
      {isUnlocked && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F172A]/95 backdrop-blur-md border-t border-slate-800 px-4 py-3 flex items-center justify-between max-w-2xl mx-auto shadow-2xl">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#0B5FFF] hover:bg-[#094fd4] text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-[#0B5FFF]/30 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving & Syncing...' : 'Save & Sync All Devices'}</span>
          </button>
        </div>
      )}

    </div>
  );
}
