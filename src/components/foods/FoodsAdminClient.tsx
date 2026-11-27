'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Lock,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  Trash2,
  Utensils,
} from 'lucide-react';
import {
  FoodCategory,
  FoodOrder,
  FoodProduct,
  FoodsSettings,
  ORDER_STATUSES,
  OrderStatus,
  ProteinOption,
} from '@/lib/foods-types';
import { formatNaira, formatUnitLabel } from '@/lib/foods-pricing';

type AdminTab = 'orders' | 'products' | 'proteins' | 'settings';

export default function FoodsAdminClient() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [tab, setTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [products, setProducts] = useState<FoodProduct[]>([]);
  const [proteins, setProteins] = useState<ProteinOption[]>([]);
  const [settings, setSettings] = useState<FoodsSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveBanner, setSaveBanner] = useState('');

  const loadAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [catRes, ordRes] = await Promise.all([
        fetch('/api/foods/catalog'),
        fetch('/api/foods/orders'),
      ]);
      if (catRes.ok) {
        const cat = await catRes.json();
        setProducts(cat.products || []);
        setProteins(cat.proteins || []);
        setSettings(cat.settings || null);
      }
      if (ordRes.ok) {
        const ord = await ordRes.json();
        setOrders(ord.orders || []);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetch('/api/foods/auth')
      .then((r) => r.json())
      .then((d) => {
        setAuthenticated(Boolean(d.authenticated));
        if (d.authenticated) {
          loadAdminData();
        }
      })
      .catch(() => setAuthenticated(false));
  }, [loadAdminData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/foods/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid password');
        return;
      }
      setAuthenticated(true);
      setPassword('');
      loadAdminData();
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/foods/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setAuthenticated(false);
    setOrders([]);
  };

  const handleSaveCatalog = async () => {
    if (!settings) return;
    setSaving(true);
    setSaveBanner('');
    try {
      const res = await fetch('/api/foods/catalog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, proteins, settings }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(updated.products);
        setProteins(updated.proteins);
        setSettings(updated.settings);
        setSaveBanner('All product, pricing, and delivery changes saved.');
        setTimeout(() => setSaveBanner(''), 3500);
      } else {
        setSaveBanner('Failed to save changes. Check your session.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOrder = async (
    orderId: string,
    patch: { status?: OrderStatus; paymentVerified?: boolean }
  ) => {
    const res = await fetch('/api/foods/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, ...patch }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? data.order : o))
      );
    }
  };

  const handleAddProduct = () => {
    const newProd: FoodProduct = {
      id: `custom-${Date.now()}`,
      name: 'New Nigerian Dish',
      category: 'soup',
      description: 'Freshly prepared to order.',
      image: '/foods/egusi-soup.jpg',
      unitType: 'litre',
      pricePerUnit: null,
      minQuantity: 1,
      enabled: true,
      supportsProteins: true,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#062315] text-white flex items-center justify-center p-4">
        <p className="text-sm text-emerald-200">Checking admin session...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#062315] text-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-400/30">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl bg-emerald-900 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-emerald-950">
                Bethelmind Foods Admin
              </h1>
              <p className="text-xs text-slate-500">
                Protected Kitchen &amp; Pricing Control Panel
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError ? (
              <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                {authError}
              </p>
            ) : null}
            <div>
              <label
                htmlFor="foods-admin-pw"
                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
              >
                Admin Password
              </label>
              <input
                id="foods-admin-pw"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer"
            >
              {loggingIn ? 'Signing in...' : 'Sign In to Admin'}
            </button>
          </form>

          <p className="text-xs text-slate-500 mt-4 text-center">
            <a href="/foods" className="text-emerald-800 underline font-semibold">
              ← Back to Ordering Landing Page
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Admin Top Bar */}
      <header className="bg-[#051d11] text-white border-b border-amber-400/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-black text-base sm:text-lg text-white">
              BETHELMIND FOODS — ADMIN CONTROL
            </h1>
            <p className="text-xs text-amber-300">
              Manage Orders, Litre Pricing, Proteins, Delivery &amp; Google Tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/foods"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-xs font-bold text-white"
            >
              View Live Page
            </a>
            <button
              type="button"
              onClick={loadAdminData}
              className="px-3 py-2 rounded-lg bg-emerald-900 border border-emerald-700 text-xs font-bold text-emerald-100 inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-xs font-bold text-white inline-flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs + Save Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'orders', label: `Orders (${orders.length})`, icon: ClipboardList },
              { id: 'products', label: `Products & Litre Prices (${products.length})`, icon: Utensils },
              { id: 'proteins', label: `Proteins (${proteins.length})`, icon: ShieldCheck },
              { id: 'settings', label: 'Delivery, WhatsApp & Tracking', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as AdminTab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer transition ${
                  tab === item.id
                    ? 'bg-emerald-900 text-amber-300 shadow'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {tab !== 'orders' ? (
            <button
              type="button"
              onClick={handleSaveCatalog}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm inline-flex items-center gap-2 shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          ) : null}
        </div>

        {saveBanner ? (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-500 text-emerald-900 text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            {saveBanner}
          </div>
        ) : null}

        {/* ORDERS TAB */}
        {tab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <p className="font-bold text-slate-800">No orders submitted yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  Submitted customer orders from `/foods` will appear here immediately.
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-emerald-950 text-base">
                          {order.id}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                          {order.status}
                        </span>
                        {order.paymentVerified ? (
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Payment Verified
                          </span>
                        ) : null}
                        {order.attribution?.gclid ? (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                            GCLID: {order.attribution.gclid.slice(0, 14)}…
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed: {new Date(order.createdAt).toLocaleString('en-NG')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleUpdateOrder(order.id, {
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>

                      <label className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 px-3 py-2 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={order.paymentVerified}
                          onChange={(e) =>
                            handleUpdateOrder(order.id, {
                              paymentVerified: e.target.checked,
                            })
                          }
                        />
                        Payment Verified
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p>
                        <strong>Customer:</strong> {order.customerName}
                      </p>
                      <p>
                        <strong>Phone/WhatsApp:</strong> {order.customerPhone}
                      </p>
                      <p>
                        <strong>Address:</strong> {order.deliveryAddress}
                      </p>
                      <p>
                        <strong>Preferred Delivery:</strong> {order.deliveryDate} at{' '}
                        {order.deliveryTime}
                      </p>
                      {order.additionalInstructions ? (
                        <p>
                          <strong>Instructions:</strong> {order.additionalInstructions}
                        </p>
                      ) : null}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-bold uppercase text-slate-500">
                        Ordered Items
                      </p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-xs">
                          <strong>
                            {item.productName} ({formatUnitLabel(item.unitType, item.quantity)})
                          </strong>
                          {item.proteins.length > 0
                            ? ` — Proteins: ${item.proteins.map((p) => p.name).join(', ')}`
                            : ''}
                          {item.lineTotal !== null
                            ? ` • ${formatNaira(item.lineTotal)}`
                            : ''}
                        </div>
                      ))}
                      <p className="text-xs font-bold text-emerald-900 pt-1 border-t border-slate-200">
                        Total:{' '}
                        {order.totalPayable !== null
                          ? formatNaira(order.totalPayable)
                          : 'Quote / Confirm via WhatsApp'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}

        {/* PRODUCTS TAB */}
        {tab === 'products' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-600">
                Leave price blank if you prefer to confirm price on WhatsApp. Set price per
                litre/pack to enable automatic order totals.
              </p>
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-4 py-2 rounded-xl bg-emerald-900 text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <label className="inline-flex items-center gap-2 text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={product.enabled}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = { ...product, enabled: e.target.checked };
                          setProducts(next);
                        }}
                      />
                      Enabled on Landing Page
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setProducts((prev) => prev.filter((p) => p.id !== product.id))
                      }
                      className="text-xs text-red-600 font-bold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = { ...product, name: e.target.value };
                          setProducts(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Category
                      </label>
                      <select
                        value={product.category}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = {
                            ...product,
                            category: e.target.value as FoodCategory,
                          };
                          setProducts(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="soup">Soup</option>
                        <option value="rice">Rice</option>
                        <option value="small_chops">Small Chops</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Unit Type
                      </label>
                      <select
                        value={product.unitType}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = {
                            ...product,
                            unitType: e.target.value as 'litre' | 'serving' | 'pack',
                          };
                          setProducts(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                      >
                        <option value="litre">Litre</option>
                        <option value="serving">Serving</option>
                        <option value="pack">Pack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Price per Unit (₦)
                      </label>
                      <input
                        type="number"
                        placeholder="Optional"
                        value={product.pricePerUnit ?? ''}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = {
                            ...product,
                            pricePerUnit:
                              e.target.value === '' ? null : Number(e.target.value),
                          };
                          setProducts(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Min Qty
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={product.minQuantity}
                        onChange={(e) => {
                          const next = [...products];
                          next[index] = {
                            ...product,
                            minQuantity: Math.max(1, Number(e.target.value) || 1),
                          };
                          setProducts(next);
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Image Path / URL
                    </label>
                    <input
                      type="text"
                      value={product.image}
                      onChange={(e) => {
                        const next = [...products];
                        next[index] = { ...product, image: e.target.value };
                        setProducts(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={product.description}
                      onChange={(e) => {
                        const next = [...products];
                        next[index] = { ...product, description: e.target.value };
                        setProducts(next);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* PROTEINS TAB */}
        {tab === 'proteins' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <p className="text-xs text-slate-600">
              Configure add-on prices for each protein option (leave blank if confirmed on
              WhatsApp).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {proteins.map((pr, idx) => (
                <div
                  key={pr.id}
                  className="border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <label className="flex items-center gap-2 text-sm font-bold">
                    <input
                      type="checkbox"
                      checked={pr.enabled}
                      onChange={(e) => {
                        const next = [...proteins];
                        next[idx] = { ...pr, enabled: e.target.checked };
                        setProteins(next);
                      }}
                    />
                    {pr.name}
                  </label>
                  <input
                    type="number"
                    placeholder="Price (₦)"
                    value={pr.price ?? ''}
                    onChange={(e) => {
                      const next = [...proteins];
                      next[idx] = {
                        ...pr,
                        price: e.target.value === '' ? null : Number(e.target.value),
                      };
                      setProteins(next);
                    }}
                    className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* SETTINGS & TRACKING TAB */}
        {tab === 'settings' && settings ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-extrabold text-emerald-950 text-base">
                WhatsApp &amp; Delivery Information
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Primary WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settings.primaryWhatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, primaryWhatsapp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Alternative Contact
                  </label>
                  <input
                    type="text"
                    value={settings.secondaryWhatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, secondaryWhatsapp: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Advance Order Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={settings.deliveryLeadTimeHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        deliveryLeadTimeHours: Math.max(1, Number(e.target.value) || 7),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Fixed Delivery Fee (₦, optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Blank = confirm by location"
                    value={settings.deliveryFee ?? ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        deliveryFee:
                          e.target.value === '' ? null : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Kitchen Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Delivery Availability Note
                </label>
                <textarea
                  rows={2}
                  value={settings.deliveryAvailability}
                  onChange={(e) =>
                    setSettings({ ...settings, deliveryAvailability: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <h2 className="font-extrabold text-emerald-950 text-base">
                Google Ads, GTM &amp; GA4 Tracking Configuration
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    GTM_CONTAINER_ID
                  </label>
                  <input
                    type="text"
                    placeholder="GTM-XXXXXXX"
                    value={settings.tracking.gtmContainerId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tracking: {
                          ...settings.tracking,
                          gtmContainerId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    GA4_MEASUREMENT_ID
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    value={settings.tracking.ga4MeasurementId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tracking: {
                          ...settings.tracking,
                          ga4MeasurementId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    GOOGLE_ADS_ID
                  </label>
                  <input
                    type="text"
                    placeholder="AW-XXXXXXXXXX"
                    value={settings.tracking.googleAdsId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tracking: {
                          ...settings.tracking,
                          googleAdsId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    GOOGLE_ADS_CONVERSION_LABEL
                  </label>
                  <input
                    type="text"
                    placeholder="Conversion Label"
                    value={settings.tracking.googleAdsConversionLabel}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        tracking: {
                          ...settings.tracking,
                          googleAdsConversionLabel: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Tracking Verification Checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h3 className="text-xs font-black uppercase text-emerald-950">
                  Google Tracking Verification Checklist
                </h3>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>✓ `page_view`, `view_item`, `select_item`, `add_to_cart`, `remove_from_cart` wired</li>
                  <li>✓ `begin_checkout`, `add_delivery_info`, `click_whatsapp`, `generate_lead` wired</li>
                  <li>✓ `purchase` blocked from firing on WhatsApp clicks (requires verified payment)</li>
                  <li>✓ `GCLID`, `GBRAID`, and `WBRAID` preserved in session &amp; attached to orders</li>
                  <li>✓ Consent-aware initialization active; zero customer PII sent to analytics</li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
