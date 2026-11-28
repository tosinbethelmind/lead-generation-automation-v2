'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Utensils,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  FoodCategory,
  FoodProduct,
  FoodsSettings,
  ProteinOption,
} from '@/lib/foods-types';
import {
  calculateOrderTotals,
  CartSelection,
  formatNaira,
  formatUnitLabel,
  normalizeNigerianWhatsapp,
} from '@/lib/foods-pricing';
import { captureAndGetAttribution, trackFoodsEvent } from '@/lib/foods-tracking';
import FoodsGoogleTracking from './FoodsGoogleTracking';

interface Props {
  initialProducts: FoodProduct[];
  initialProteins: ProteinOption[];
  initialSettings: FoodsSettings;
}

const LITRE_PRESETS = [1, 2, 3, 4, 5, 6, 8, 10];

interface SubmittedOrderFallback {
  orderId: string;
  whatsappUrl: string;
  secondaryWhatsappUrl: string;
  whatsappMessage: string;
}

export default function FoodsLandingClient({
  initialProducts,
  initialProteins,
  initialSettings,
}: Props) {
  const products = useMemo(
    () => initialProducts.filter((p) => p.enabled),
    [initialProducts]
  );
  const proteins = useMemo(
    () => initialProteins.filter((p) => p.enabled),
    [initialProteins]
  );
  const settings = initialSettings;

  const [activeCategory, setActiveCategory] = useState<'all' | FoodCategory>('all');
  const [cart, setCart] = useState<CartSelection[]>([]);
  const [customQtyInputs, setCustomQtyInputs] = useState<Record<string, string>>({});

  // Checkout state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [submittedFallback, setSubmittedFallback] =
    useState<SubmittedOrderFallback | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [lastSavedOrder, setLastSavedOrder] = useState<CartSelection[]>([]);

  const checkoutRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);

  // Set default date to today (or tomorrow if late) & load previous order for 1-tap reorder
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bm_foods_last_order_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setLastSavedOrder(parsed);
      }
    } catch {}
    const now = new Date();
    const minReady = new Date(now.getTime() + settings.deliveryLeadTimeHours * 60 * 60 * 1000);
    const yyyy = minReady.getFullYear();
    const mm = String(minReady.getMonth() + 1).padStart(2, '0');
    const dd = String(minReady.getDate()).padStart(2, '0');
    setDeliveryDate(`${yyyy}-${mm}-${dd}`);
    const hh = String(minReady.getHours()).padStart(2, '0');
    setDeliveryTime(`${hh}:00`);
  }, [settings.deliveryLeadTimeHours]);

  // Track view_item once per visible product using IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            const productName = entry.target.getAttribute('data-product-name');
            const category = entry.target.getAttribute('data-product-category');
            if (productId && productName) {
              trackFoodsEvent(
                'view_item',
                {
                  item_id: productId,
                  item_name: productName,
                  item_category: category,
                },
                { dedupeKey: `view_item_${productId}`, trackingConfig: settings.tracking }
              );
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    const cards = document.querySelectorAll('[data-product-id]');
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory, settings.tracking]);

  // Track add_delivery_info once user fills address + date + time
  useEffect(() => {
    if (
      cart.length > 0 &&
      customerName.trim().length >= 2 &&
      customerPhone.trim().length >= 10 &&
      deliveryAddress.trim().length >= 5 &&
      deliveryDate &&
      deliveryTime
    ) {
      trackFoodsEvent(
        'add_delivery_info',
        {
          items_count: cart.length,
        },
        { dedupeKey: `add_delivery_info_${cart.length}`, trackingConfig: settings.tracking }
      );
    }
  }, [
    cart.length,
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryDate,
    deliveryTime,
    settings.tracking,
  ]);

  const calculated = useMemo(
    () => calculateOrderTotals(cart, products, proteins, settings.deliveryFee),
    [cart, products, proteins, settings.deliveryFee]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  const getCartItem = (productId: string) =>
    cart.find((item) => item.productId === productId);

  const handleSelectOrAdd = (product: FoodProduct, quantity = 1) => {
    trackFoodsEvent(
      'select_item',
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
      },
      { trackingConfig: settings.tracking }
    );

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) return prev;
      trackFoodsEvent(
        'add_to_cart',
        {
          item_id: product.id,
          item_name: product.name,
          quantity,
          unit_type: product.unitType,
          value: product.pricePerUnit !== null ? product.pricePerUnit * quantity : 0,
        },
        { trackingConfig: settings.tracking }
      );
      return [...prev, { productId: product.id, quantity, proteinIds: [] }];
    });
  };

  const handleSetQuantity = (product: FoodProduct, newQty: number) => {
    const qty = Math.max(product.minQuantity || 1, Math.min(100, Math.floor(newQty)));
    setCart((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (!exists) {
        trackFoodsEvent(
          'add_to_cart',
          {
            item_id: product.id,
            item_name: product.name,
            quantity: qty,
            unit_type: product.unitType,
          },
          { trackingConfig: settings.tracking }
        );
        return [...prev, { productId: product.id, quantity: qty, proteinIds: [] }];
      }
      return prev.map((i) =>
        i.productId === product.id ? { ...i, quantity: qty } : i
      );
    });
  };

  const handleToggleProtein = (productId: string, proteinId: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const has = item.proteinIds.includes(proteinId);
        return {
          ...item,
          proteinIds: has
            ? item.proteinIds.filter((id) => id !== proteinId)
            : [...item.proteinIds, proteinId],
        };
      })
    );
  };

  const handleRemoveItem = (product: FoodProduct) => {
    setCart((prev) => prev.filter((i) => i.productId !== product.id));
    trackFoodsEvent(
      'remove_from_cart',
      {
        item_id: product.id,
        item_name: product.name,
      },
      { trackingConfig: settings.tracking }
    );
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCheckout = () => {
    trackFoodsEvent(
      'begin_checkout',
      {
        items_count: cart.length,
        value: calculated.totalPayable ?? calculated.subtotal ?? 0,
      },
      { dedupeKey: `begin_checkout_${cart.length}`, trackingConfig: settings.tracking }
    );
    checkoutRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDirectWhatsAppChat = () => {
    trackFoodsEvent(
      'click_whatsapp',
      { source: 'hero_or_floating_chat' },
      { trackingConfig: settings.tracking }
    );
    const intl = normalizeNigerianWhatsapp(settings.primaryWhatsapp);
    const text = encodeURIComponent(
      `Hello ${settings.businessName}, I would like to enquire about ordering fresh Nigerian food.`
    );
    window.open(`https://wa.me/${intl}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (cart.length === 0) {
      setFormError('Please select at least one meal from the menu above.');
      scrollToMenu();
      return;
    }
    if (!customerName.trim() || customerName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setFormError('Please enter a valid Nigerian phone or WhatsApp number (e.g. 0803...).');
      return;
    }
    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setFormError('Please enter your full delivery address.');
      return;
    }
    if (!deliveryDate || !deliveryTime) {
      setFormError('Please select your preferred delivery date and time.');
      return;
    }

    setSubmitting(true);
    try {
      const attribution = captureAndGetAttribution();
      const res = await fetch('/api/foods/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          deliveryAddress,
          deliveryDate,
          deliveryTime,
          additionalInstructions,
          selections: cart,
          attribution,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Could not submit your order. Please check your details.');
        setSubmitting(false);
        return;
      }

      // Fire generate_lead (deduplicated per order ID) and click_whatsapp.
      // IMPORTANT: Never fire `purchase` here — purchase only fires after verified payment.
      trackFoodsEvent(
        'generate_lead',
        {
          transaction_id: data.order.id,
          items_count: cart.length,
          value: calculated.totalPayable ?? calculated.subtotal ?? 0,
        },
        { dedupeKey: `generate_lead_${data.order.id}`, trackingConfig: settings.tracking }
      );
      trackFoodsEvent(
        'click_whatsapp',
        { source: 'checkout_submit', transaction_id: data.order.id },
        { trackingConfig: settings.tracking }
      );

      setSubmittedFallback({
        orderId: data.order.id,
        whatsappUrl: data.whatsappUrl,
        secondaryWhatsappUrl: data.secondaryWhatsappUrl,
        whatsappMessage: data.whatsappMessage,
      });

      try {
        localStorage.setItem('bm_foods_last_order_v1', JSON.stringify(cart));
        setLastSavedOrder(cart);
      } catch {}

      // Attempt to open WhatsApp cleanly; fallback card remains visible regardless!
      const opened = window.open(data.whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!opened) {
        // Popup blocked on mobile/browser — fallback UI is already displayed below!
      }
    } catch {
      setFormError('Network error while saving your order. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyOrderMessage = async () => {
    if (!submittedFallback) return;
    try {
      await navigator.clipboard.writeText(submittedFallback.whatsappMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  const primaryIntl = normalizeNigerianWhatsapp(settings.primaryWhatsapp);
  const secondaryIntl = normalizeNigerianWhatsapp(settings.secondaryWhatsapp);

  return (
    <div className="min-h-screen flex flex-col bg-[#062315] text-slate-900 pb-24 md:pb-0">
      <FoodsGoogleTracking config={settings.tracking} />

      {/* TOP BRAND BAR */}
      <header className="sticky top-0 z-30 bg-[#051d11]/95 backdrop-blur-md border-b border-amber-400/20 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-emerald-950 flex items-center justify-center font-black text-base shrink-0 shadow">
              BF
            </div>
            <div className="min-w-0">
              <p className="font-extrabold text-sm sm:text-base tracking-tight text-white truncate">
                {settings.businessName}
              </p>
              <p className="text-[11px] text-amber-300 font-medium truncate">
                {settings.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`tel:${settings.primaryWhatsapp}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-100 hover:text-amber-300 px-2.5 py-1.5 rounded-lg border border-emerald-700/60"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {settings.primaryWhatsapp}
            </a>
            <button
              type="button"
              onClick={cart.length > 0 ? scrollToCheckout : scrollToMenu}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg shadow transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{cart.length > 0 ? `Order (${cart.length})` : 'Order Now'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ABOVE-THE-FOLD HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#062315] via-[#09321e] to-[#062315] text-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Good Food • Great Taste • Always Fresh
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-white">
              CRAVING DELICIOUS{' '}
              <span className="text-amber-400">NIGERIAN FOOD?</span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-50 font-medium leading-relaxed max-w-2xl">
              Enjoy freshly prepared Nigerian soups and rice, packed hygienically and
              delivered to your doorstep.
            </p>

            <p className="text-sm sm:text-base text-emerald-200 leading-relaxed max-w-xl">
              Order your favourite meals in litres. Perfect for your home, family,
              visitors and special occasions.
            </p>

            {/* 3 Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {[
                { icon: Utensils, label: 'Freshly Prepared.' },
                { icon: ShieldCheck, label: 'Hygienically Packaged.' },
                { icon: Truck, label: 'Convenient Delivery.' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 bg-emerald-900/50 border border-emerald-700/60 rounded-xl px-3 py-2.5"
                >
                  <item.icon className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-extrabold text-base px-7 py-4 rounded-xl shadow-lg shadow-red-950/50 transition cursor-pointer"
              >
                ORDER YOUR FOOD NOW
              </button>
              <button
                type="button"
                onClick={handleDirectWhatsAppChat}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-800/80 hover:bg-emerald-700 border border-amber-400/50 text-amber-200 font-bold text-base px-6 py-4 rounded-xl transition cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-amber-400" />
                CHAT WITH US ON WHATSAPP
              </button>
            </div>

            {/* Advance-Order Notice Pill */}
            <div className="inline-flex items-center gap-2 text-xs text-amber-200 bg-amber-500/10 border border-amber-400/30 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Freshly Sourced &amp; Cooked:</strong> Please place orders at least{' '}
                {settings.deliveryLeadTimeHours} hours before delivery.
              </span>
            </div>
          </div>

          {/* Hero Food Photography */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shadow-black/60 bg-emerald-950">
              <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/90 border border-amber-400/40 text-amber-300 text-[11px] font-bold backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Freshly Prepared to Order</span>
              </div>
              <img
                src="/foods/hero-feast.jpg"
                alt="Freshly prepared Nigerian Jollof rice, fried rice, Egusi soup, grilled chicken and small chops by Bethelmind Foods"
                className="w-full h-64 sm:h-80 lg:h-[400px] object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Litre-Based &amp; Bulk Catering
                </p>
                <p className="text-sm font-semibold">
                  Order 1L to 10L+ bowls of authentic soups, rice &amp; small chops
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FOOD ORDERING SECTION */}
      <main className="bg-white text-slate-900 flex-1">
        <section ref={menuRef} id="order-menu" className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
              Step 1 &amp; 2 — Select Food &amp; Choose Litres
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Build Your Fresh Food Order
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Select multiple soups, rice meals, or small chops in one order. Choose your
              exact litre volume and preferred proteins.
            </p>
            {lastSavedOrder.length > 0 && cart.length === 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setCart(lastSavedOrder);
                    scrollToCheckout();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-emerald-950 text-xs font-extrabold transition cursor-pointer"
                >
                  <span>Reorder Your Previous Meal ({lastSavedOrder.length} item{lastSavedOrder.length > 1 ? 's' : ''}) &rarr;</span>
                </button>
              </div>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center sm:justify-center gap-2 mb-8 overflow-x-auto pb-2 snap-x">
            {[
              { id: 'all', label: 'All Menu Items' },
              { id: 'soup', label: 'Nigerian Soups (Litres)' },
              { id: 'rice', label: 'Jollof & Fried Rice' },
              { id: 'small_chops', label: 'Small Chops & Pastries' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id as 'all' | FoodCategory)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-emerald-900 text-amber-300 shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const selected = getCartItem(product.id);
              const isSelected = Boolean(selected);

              return (
                <article
                  key={product.id}
                  data-product-id={product.id}
                  data-product-name={product.name}
                  data-product-category={product.category}
                  className={`rounded-2xl border-2 overflow-hidden flex flex-col transition bg-white ${
                    isSelected
                      ? 'border-emerald-700 shadow-lg ring-2 ring-amber-400/50'
                      : 'border-slate-200 hover:border-emerald-300 shadow-sm'
                  }`}
                >
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={product.image || '/foods/hero-feast.jpg'}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-950/90 text-amber-300 text-[11px] font-bold uppercase px-2.5 py-1 rounded-full">
                      {product.category === 'soup'
                        ? 'Soup • Litres'
                        : product.category === 'rice'
                        ? 'Rice • Litres'
                        : 'Small Chops'}
                    </span>
                    {isSelected ? (
                      <span className="absolute top-3 right-3 bg-amber-400 text-emerald-950 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Added
                      </span>
                    ) : null}
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-extrabold text-emerald-950 leading-snug">
                          {product.name}
                        </h3>
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                          {product.pricePerUnit !== null
                            ? `${formatNaira(product.pricePerUnit)} / ${product.unitType}`
                            : 'Quote on WhatsApp'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {!isSelected ? (
                      <button
                        type="button"
                        onClick={() => handleSelectOrAdd(product, product.minQuantity || 1)}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        Select {product.unitType === 'litre' ? '& Choose Litres' : 'Item'}
                      </button>
                    ) : (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        {/* Quantity / Litre Selector */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wide text-emerald-900">
                              {product.unitType === 'litre'
                                ? 'Choose Volume (Litres):'
                                : 'Choose Quantity:'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(product)}
                              className="text-xs font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Remove
                            </button>
                          </div>

                          {product.unitType === 'litre' ? (
                            <div className="grid grid-cols-4 gap-1.5">
                              {LITRE_PRESETS.map((litre) => (
                                <button
                                  key={litre}
                                  type="button"
                                  onClick={() => handleSetQuantity(product, litre)}
                                  className={`py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                    selected?.quantity === litre
                                      ? 'bg-emerald-900 text-amber-300 border-emerald-900'
                                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'
                                  }`}
                                >
                                  {litre}L
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSetQuantity(
                                    product,
                                    Math.max(1, (selected?.quantity || 1) - 1)
                                  )
                                }
                                className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-bold text-sm min-w-[70px] text-center">
                                {formatUnitLabel(product.unitType, selected?.quantity || 1)}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSetQuantity(product, (selected?.quantity || 1) + 1)
                                }
                                className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {/* Custom quantity input */}
                          <div className="mt-2 flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              placeholder={
                                product.unitType === 'litre'
                                  ? 'Custom litres (e.g. 12)'
                                  : 'Custom qty'
                              }
                              value={customQtyInputs[product.id] ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCustomQtyInputs((prev) => ({
                                  ...prev,
                                  [product.id]: val,
                                }));
                                const parsed = parseInt(val, 10);
                                if (!Number.isNaN(parsed) && parsed >= 1) {
                                  handleSetQuantity(product, parsed);
                                }
                              }}
                              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                            />
                          </div>
                        </div>

                        {/* Protein Options */}
                        {product.supportsProteins ? (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-emerald-900 mb-1.5">
                              Select Protein Options (Optional):
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {proteins.map((protein) => {
                                const active = selected?.proteinIds.includes(protein.id);
                                return (
                                  <button
                                    key={protein.id}
                                    type="button"
                                    onClick={() =>
                                      handleToggleProtein(product.id, protein.id)
                                    }
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer ${
                                      active
                                        ? 'bg-amber-400 text-emerald-950 border-amber-500 font-bold'
                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-400'
                                    }`}
                                  >
                                    {protein.name}
                                    {protein.price !== null
                                      ? ` (+${formatNaira(protein.price)})`
                                      : ''}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {cart.length > 0 ? (
            <div className="mt-8 bg-emerald-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">
                  Current Order Selection ({cart.length}{' '}
                  {cart.length === 1 ? 'item' : 'items'})
                </p>
                <p className="text-sm sm:text-base font-semibold mt-0.5">
                  {calculated.totalPayable !== null
                    ? `Estimated Total: ${formatNaira(calculated.totalPayable)}`
                    : calculated.subtotal !== null
                    ? `Food Subtotal: ${formatNaira(calculated.subtotal)} (+ delivery fee)`
                    : 'Ready to complete your delivery details below'}
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToCheckout}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow transition cursor-pointer"
              >
                Proceed to Checkout →
              </button>
            </div>
          ) : null}
        </section>

        {/* DELIVERY INFORMATION SECTION */}
        <section className="bg-emerald-950 text-white py-10 sm:py-12 border-y border-amber-400/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-red-600/20 border-2 border-amber-400 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-amber-300 tracking-tight">
                  ALL ORDERS MUST BE PLACED AT LEAST {settings.deliveryLeadTimeHours} HOURS
                  BEFORE DELIVERY.
                </h2>
                <p className="text-sm text-emerald-50 mt-1 leading-relaxed">
                  Every pot of soup and tray of rice is cooked fresh to order. Please place
                  your order at least {settings.deliveryLeadTimeHours} hours ahead of your
                  preferred delivery time so our kitchen can prepare and package it
                  hygienically.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-5">
                <Truck className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="font-bold text-white text-base">Delivery Availability</h3>
                <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">
                  {settings.deliveryAvailability}
                </p>
              </div>

              <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-5">
                <MapPin className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="font-bold text-white text-base">Kitchen Location</h3>
                <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">
                  {settings.location}
                </p>
              </div>

              <div className="bg-emerald-900/50 border border-emerald-700/60 rounded-2xl p-5">
                <ShieldCheck className="w-5 h-5 text-amber-400 mb-2" />
                <h3 className="font-bold text-white text-base">
                  Delivery Fee &amp; Confirmation
                </h3>
                <p className="text-sm text-emerald-100 mt-1.5 leading-relaxed">
                  {settings.deliveryFee !== null
                    ? `Standard Delivery Fee: ${formatNaira(settings.deliveryFee)}. `
                    : ''}
                  {settings.deliveryConfirmationNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CHECKOUT SECTION */}
        <section ref={checkoutRef} id="checkout" className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-700 bg-red-50 px-3 py-1 rounded-full mb-2">
              Step 3 &amp; 4 — Enter Details &amp; Order on WhatsApp
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Complete Your Order
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1.5">
              No account or registration required. Fill in your delivery details and send
              your order directly to our WhatsApp kitchen desk.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Order Summary Card */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6">
              <h3 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                Order Summary
              </h3>

              {calculated.items.length === 0 ? (
                <div className="text-center py-8 px-4 border border-dashed border-slate-300 rounded-xl bg-white">
                  <p className="text-sm text-slate-600 font-medium">
                    Your order list is currently empty.
                  </p>
                  <button
                    type="button"
                    onClick={scrollToMenu}
                    className="mt-3 text-sm font-bold text-emerald-800 underline cursor-pointer"
                  >
                    Browse Nigerian Soups, Rice &amp; Small Chops
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <ul className="divide-y divide-slate-200">
                    {calculated.items.map((item) => (
                      <li key={item.productId} className="py-3 first:pt-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">
                              {item.productName}
                            </p>
                            <p className="text-xs font-semibold text-emerald-800">
                              Quantity: {formatUnitLabel(item.unitType, item.quantity)}
                              {item.unitPrice !== null
                                ? ` @ ${formatNaira(item.unitPrice)}`
                                : ''}
                            </p>
                            {item.proteins.length > 0 ? (
                              <p className="text-xs text-slate-600 mt-0.5">
                                Proteins:{' '}
                                {item.proteins
                                  .map((p) =>
                                    p.price !== null
                                      ? `${p.name} (${formatNaira(p.price)})`
                                      : p.name
                                  )
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                          <span className="text-sm font-bold text-slate-900 shrink-0">
                            {item.lineTotal !== null
                              ? formatNaira(item.lineTotal)
                              : 'On WhatsApp'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-slate-200 pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-bold text-slate-900">
                        {calculated.subtotal !== null
                          ? formatNaira(calculated.subtotal)
                          : 'Confirmed on WhatsApp'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Delivery Fee</span>
                      <span className="font-bold text-slate-900">
                        {calculated.deliveryFee !== null
                          ? formatNaira(calculated.deliveryFee)
                          : 'Confirmed by location'}
                      </span>
                    </div>
                    <div className="flex justify-between text-base border-t border-slate-200 pt-2">
                      <span className="font-extrabold text-emerald-950">
                        Total Payable
                      </span>
                      <span className="font-black text-emerald-900">
                        {calculated.totalPayable !== null
                          ? formatNaira(calculated.totalPayable)
                          : 'Confirmed on WhatsApp'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <div className="font-extrabold uppercase tracking-wide text-emerald-900">
                      Official Payment Account (Parent Company)
                    </div>
                    <div>Bank: <strong>Moniepoint Microfinance Bank</strong></div>
                    <div>Account Number: <strong>6805375225</strong></div>
                    <div>Account Name: <strong>Bethelmind Digital Solutions</strong></div>
                    <div className="text-[11px] text-emerald-800 pt-0.5">
                      Bethelmind Digital Solutions is the official CAC-registered parent company (Reg: 9912717) for Bethelmind Foods.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-7 bg-white border-2 border-emerald-900/15 rounded-2xl p-5 sm:p-7 shadow-sm">
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {formError ? (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formError}</span>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="foods-name"
                      className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                    >
                      1. Customer Name *
                    </label>
                    <input
                      id="foods-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Mrs. Adeola Johnson"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="foods-phone"
                      className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                    >
                      2. WhatsApp / Phone Number *
                    </label>
                    <input
                      id="foods-phone"
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 0803 123 4567"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="foods-address"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                  >
                    3. Delivery Address *
                  </label>
                  <input
                    id="foods-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="House/office number, street, estate gate note, nearest bus stop & area"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="foods-date"
                      className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                    >
                      4. Preferred Delivery Date *
                    </label>
                    <input
                      id="foods-date"
                      type="date"
                      required
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="foods-time"
                      className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                    >
                      5. Preferred Delivery Time *
                    </label>
                    <input
                      id="foods-time"
                      type="time"
                      required
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="foods-notes"
                    className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1"
                  >
                    6. Additional Instructions (Optional)
                  </label>
                  <textarea
                    id="foods-notes"
                    rows={3}
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    placeholder="Spice level, packaging preferences, or gate instructions..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-black text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  {submitting ? 'Preparing Your Order...' : 'PLACE MY ORDER ON WHATSAPP'}
                </button>

                <p className="text-xs text-center text-slate-500">
                  Primary WhatsApp: <strong>{settings.primaryWhatsapp}</strong> •
                  Alternative Contact: <strong>{settings.secondaryWhatsapp}</strong>
                </p>
              </form>

              {/* WHATSAPP FALLBACK & CONFIRMATION CARD (Never silently discards an order) */}
              {submittedFallback ? (
                <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-600 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-emerald-950 text-base">
                        Order Saved! Reference: {submittedFallback.orderId}
                      </h4>
                      <p className="text-xs sm:text-sm text-emerald-900 mt-1">
                        If WhatsApp did not open automatically, use the buttons below or
                        copy your order summary to send it to us directly.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={submittedFallback.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm px-4 py-3 rounded-xl"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open WhatsApp ({settings.primaryWhatsapp})
                    </a>
                    <a
                      href={submittedFallback.secondaryWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-emerald-700 text-emerald-900 font-bold text-sm px-4 py-3 rounded-xl hover:bg-emerald-100"
                    >
                      <Phone className="w-4 h-4" />
                      Alternative ({settings.secondaryWhatsapp})
                    </a>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-600 uppercase">
                        Order Summary Text
                      </span>
                      <button
                        type="button"
                        onClick={copyOrderMessage}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedMsg ? 'Copied!' : 'Copy Summary'}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {submittedFallback.whatsappMessage}
                    </pre>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* HIGH-CONVERSION TRUST SECTION */}
        <section className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
                WHY CUSTOMERS CHOOSE BETHELMIND FOODS
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5">
                {settings.tagline} Prepared with care for homes, families, and events.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  'Freshly prepared Nigerian meals',
                  'Hygienic food preparation',
                  'Generous food portions',
                  'Different protein options',
                  'Convenient bulk ordering',
                  'Food for families and visitors',
                  'Easy WhatsApp ordering',
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span className="text-sm font-bold text-slate-800">{point}</span>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <img
                  src="/foods/egusi-soup.jpg"
                  alt="Freshly cooked Egusi Soup by Bethelmind Foods"
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-2xl border border-slate-200 shadow-sm"
                />
                <img
                  src="/foods/afang-soup.jpg"
                  alt="Authentic Nigerian Afang Soup by Bethelmind Foods"
                  loading="lazy"
                  className="w-full h-44 object-cover rounded-2xl border border-slate-200 shadow-sm"
                />
              </div>
            </div>

            {/* Genuine Testimonials Space (never fabricated) */}
            {settings.testimonials.length > 0 ? (
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {settings.testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-700 italic">&ldquo;{t.quote}&rdquo;</p>
                    <p className="text-xs font-bold text-emerald-900 mt-3">
                      {t.customerName} — {t.location}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 bg-white border border-dashed border-slate-300 rounded-2xl p-6 text-center">
                <p className="text-sm font-bold text-emerald-950">
                  Verified Customer Feedback
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Genuine customer reviews will appear here as verified orders are
                  completed.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#051d11] text-emerald-100 border-t border-amber-400/20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-black text-white text-base">{settings.businessName}</p>
            <p className="text-amber-300 text-xs font-semibold">{settings.tagline}</p>
            <p className="text-xs text-emerald-200 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {settings.location}
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <p>
              WhatsApp / Phone:{' '}
              <a
                href={`https://wa.me/${primaryIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-bold hover:underline"
              >
                {settings.primaryWhatsapp}
              </a>{' '}
              |{' '}
              <a
                href={`https://wa.me/${secondaryIntl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 font-bold hover:underline"
              >
                {settings.secondaryWhatsapp}
              </a>
            </p>
            <p>
              Facebook:{' '}
              <span className="text-white font-semibold">{settings.facebookHandle}</span>
            </p>
            <p className="pt-1">
              <a
                href="/foods/admin"
                className="text-emerald-400 hover:text-amber-300 underline"
              >
                Kitchen Admin Portal
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE ORDER BAR */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-[#051d11]/95 backdrop-blur border-t border-amber-400/40 px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleDirectWhatsAppChat}
          className="px-3.5 py-3 rounded-xl bg-emerald-800 text-amber-200 font-bold text-xs flex items-center gap-1.5 shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-amber-400" />
          WhatsApp
        </button>
        <button
          type="button"
          onClick={cart.length > 0 ? scrollToCheckout : scrollToMenu}
          className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>
            {cart.length > 0
              ? `PLACE ORDER (${cart.length})${
                  (calculated.totalPayable ?? calculated.subtotal) !== null
                    ? ` • ${formatNaira((calculated.totalPayable ?? calculated.subtotal) as number)}`
                    : ''
                }`
              : 'ORDER YOUR FOOD NOW'}
          </span>
        </button>
      </div>
    </div>
  );
}
