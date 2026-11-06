'use client';

import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Check, ShieldCheck, Truck, MessageCircle, CreditCard, ArrowRight, X } from 'lucide-react';

export interface StoreProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  description: string;
}

export interface DeliveryZone {
  state: string;
  fee: number;
  eta: string;
}

export const NIGERIAN_DELIVERY_ZONES: DeliveryZone[] = [
  { state: 'Lagos Mainland (Ikeja, Yaba, Surulere, Maryland)', fee: 2000, eta: 'Same Day / 24 Hours' },
  { state: 'Lagos Island (Lekki, VI, Ikoyi, Ajah)', fee: 2500, eta: 'Same Day / 24 Hours' },
  { state: 'Lagos Outskirts (Ikorodu, Epe, Badagry)', fee: 3500, eta: '24 - 48 Hours' },
  { state: 'Ogun State (Abeokuta, Sagamu, Ota)', fee: 3500, eta: '24 - 48 Hours' },
  { state: 'Oyo State (Ibadan)', fee: 4000, eta: '24 - 48 Hours' },
  { state: 'Abuja FCT', fee: 4500, eta: '48 Hours (Interstate Hub)' },
  { state: 'Rivers State (Port Harcourt)', fee: 4500, eta: '48 Hours (Interstate Hub)' },
  { state: 'Anambra / Delta (Onitsha, Asaba, Warri)', fee: 4500, eta: '48 Hours' },
  { state: 'Edo State (Benin City)', fee: 4000, eta: '48 Hours' },
  { state: 'Enugu / Imo (Enugu, Owerri)', fee: 4500, eta: '48 Hours' },
  { state: 'Kano / Kaduna', fee: 5000, eta: '48 - 72 Hours' },
  { state: 'Other States (All 36 States Covered)', fee: 5500, eta: '48 - 72 Hours' },
];

export const DEFAULT_STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod_1',
    name: 'Luxury Italian Leather Loafers (Black/Gold Buckle)',
    price: 48000,
    originalPrice: 65000,
    image: '👞',
    category: 'Footwear',
    inStock: true,
    description: 'Handcrafted genuine leather loafers with cushioned insole and non-slip rubber sole.'
  },
  {
    id: 'prod_2',
    name: 'Designer Crossbody Leather Sling Bag',
    price: 36000,
    originalPrice: 48000,
    image: '👜',
    category: 'Bags',
    inStock: true,
    description: 'Water-resistant premium leather sling bag with magnetic snap closure and metal zippers.'
  },
  {
    id: 'prod_3',
    name: 'Smart Business Stainless Steel Chronograph Watch',
    price: 52000,
    originalPrice: 70000,
    image: '⌚',
    category: 'Watches',
    inStock: true,
    description: 'Waterproof quartz chronograph with date window, luminous hands, and steel strap.'
  },
  {
    id: 'prod_4',
    name: 'Traditional Royal Coral Beads Necklace & Bracelet Set',
    price: 38000,
    originalPrice: 50000,
    image: '📿',
    category: 'Jewelry',
    inStock: true,
    description: 'Authentic polished Edo/Benin royal coral beads set for traditional weddings and events.'
  }
];

interface ProductionStorefrontProps {
  businessName: string;
  merchantPhone?: string;
  customProducts?: StoreProduct[];
  primaryColor?: string;
}

export default function ProductionStorefront({
  businessName,
  merchantPhone = '2348022791227',
  customProducts = DEFAULT_STORE_PRODUCTS,
  primaryColor = '#10b981'
}: ProductionStorefrontProps) {
  const [products] = useState<StoreProduct[]>(customProducts);
  const [cart, setCart] = useState<{ [productId: string]: number }>({
    prod_1: 1
  });

  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(NIGERIAN_DELIVERY_ZONES[0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'transfer' | 'card'>('whatsapp');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      const copy = { ...prev };
      if (next === 0) {
        delete copy[id];
      } else {
        copy[id] = next;
      }
      return copy;
    });
  };

  const cartList = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(prod => prod.id === id);
    return { product: p, qty, lineTotal: (p?.price || 0) * qty };
  }).filter(item => item.product && item.qty > 0);

  const subtotal = cartList.reduce((sum, item) => sum + item.lineTotal, 0);
  const deliveryFee = cartList.length > 0 ? selectedZone.fee : 0;
  const grandTotal = subtotal + deliveryFee;

  const buildWhatsAppOrderUrl = () => {
    const itemsText = cartList.map(item => `• ${item.product?.name} x${item.qty} = ₦${item.lineTotal.toLocaleString()}`).join('\n');
    const msg = `🛍️ *NEW ONLINE STORE ORDER FOR ${businessName.toUpperCase()}*\n\n` +
      `👤 *Customer Name:* ${customerName || 'Shopper'}\n` +
      `📞 *Phone Number:* ${customerPhone || 'Not provided'}\n` +
      `📍 *Delivery Address:* ${deliveryAddress || 'Pickup / Contact via WhatsApp'}\n` +
      `🚚 *Delivery Zone:* ${selectedZone.state} (₦${deliveryFee.toLocaleString()} • ${selectedZone.eta})\n\n` +
      `📦 *ORDER ITEMS:*\n${itemsText}\n\n` +
      `💵 *Subtotal:* ₦${subtotal.toLocaleString()}\n` +
      `🚚 *Delivery Fee:* ₦${deliveryFee.toLocaleString()}\n` +
      `💰 *GRAND TOTAL:* ₦${grandTotal.toLocaleString()}\n\n` +
      `💳 *Payment Method Selected:* ${paymentMethod === 'transfer' ? 'Instant Bank Transfer' : paymentMethod === 'card' ? 'Debit Card' : 'WhatsApp Checkout'}\n\n` +
      `Please confirm stock availability and send account details for immediate delivery!`;

    return `https://wa.me/${merchantPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartList.length === 0) {
      alert('Your cart is empty! Please select at least one product.');
      return;
    }
    setOrderSubmitted(true);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 text-slate-100 shadow-2xl">
      {/* Store Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Official Online Storefront • 24/7 Live Checkout</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
            {businessName} Catalog
          </h2>
          <p className="text-xs text-slate-400">
            Pick your items, choose your delivery state, and checkout directly into WhatsApp or Moniepoint Bank Transfer.
          </p>
        </div>

        <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Your Cart</span>
            <span className="text-sm font-black text-emerald-400 font-mono">
              {cartList.reduce((acc, i) => acc + i.qty, 0)} Items &bull; ₦{grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {orderSubmitted ? (
        <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <h3 className="text-2xl font-black text-white font-['Outfit']">
            Order Ready to Dispatch!
          </h3>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Items Total ({cartList.reduce((acc, i) => acc + i.qty, 0)} items):</span>
              <span className="font-bold">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Delivery ({selectedZone.state.split('(')[0].trim()}):</span>
              <span className="font-bold">₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between text-white font-bold text-sm">
              <span>Grand Total:</span>
              <span className="text-emerald-400">₦{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {paymentMethod === 'transfer' && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left text-xs space-y-1.5">
              <span className="text-emerald-400 font-bold block uppercase tracking-wider">🏦 Direct Moniepoint Settlement Account:</span>
              <div className="text-white font-mono font-bold text-sm">Moniepoint Microfinance Bank</div>
              <div className="text-amber-300 font-mono text-base font-black tracking-wider">6805375225</div>
              <div className="text-slate-300">Account Name: <strong className="text-white">{businessName}</strong></div>
              <p className="text-[11px] text-slate-400 pt-1">
                Transfer exactly <strong>₦{grandTotal.toLocaleString()}</strong> and tap below to send your receipt on WhatsApp for instant packing.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-2">
            <a
              href={buildWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Send Order & Delivery Info on WhatsApp →</span>
            </a>

            <button
              type="button"
              onClick={() => setOrderSubmitted(false)}
              className="text-xs text-slate-400 hover:text-white underline pt-1"
            >
              Modify items or edit address
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Products Grid (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Available Items in Store
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => {
                const qty = cart[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="text-3xl mb-2">{p.image}</div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{p.category}</span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                      <div>
                        <span className="text-sm font-black text-white font-mono">₦{p.price.toLocaleString()}</span>
                        {p.originalPrice && (
                          <span className="text-[10px] text-slate-500 line-through block font-mono">
                            ₦{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-white font-mono min-w-[16px] text-center">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center justify-center transition font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout & Delivery Matrix (Right) */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>36-State Delivery & Checkout</span>
            </h3>

            <form onSubmit={handleCompleteOrder} className="space-y-4">
              {/* Delivery Zone Selector */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1.5">
                  Select Delivery State / Corridor:
                </label>
                <select
                  value={selectedZone.state}
                  onChange={(e) => {
                    const found = NIGERIAN_DELIVERY_ZONES.find(z => z.state === e.target.value);
                    if (found) setSelectedZone(found);
                  }}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {NIGERIAN_DELIVERY_ZONES.map(z => (
                    <option key={z.state} value={z.state}>
                      {z.state} — ₦{z.fee.toLocaleString()} ({z.eta})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">Your Full Name:</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tunde Alabi"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 font-medium block mb-1">WhatsApp Phone:</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0802 345 6789"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1">Street Address for Dispatch:</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House number, Street, Landmark, Area"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Payment Method Toggle */}
              <div>
                <label className="text-[11px] text-slate-400 font-medium block mb-1.5">Payment Option:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                    { id: 'transfer', label: 'Bank Transfer', icon: ShieldCheck },
                    { id: 'card', label: 'Debit Card', icon: CreditCard },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 border transition ${
                        paymentMethod === m.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-white'
                          : 'bg-slate-900 border-slate-750 text-slate-400 hover:text-white'
                      }`}
                    >
                      <m.icon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal:</span>
                  <span className="text-white font-bold">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>State Dispatch:</span>
                  <span className="text-white font-bold">₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between text-sm font-bold text-white">
                  <span>Order Total:</span>
                  <span className="text-emerald-400">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={cartList.length === 0}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all cursor-pointer"
              >
                <span>Confirm Order (₦{grandTotal.toLocaleString()}) →</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
