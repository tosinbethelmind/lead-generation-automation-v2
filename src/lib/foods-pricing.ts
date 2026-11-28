import {
  AttributionData,
  FoodProduct,
  FoodUnitType,
  OrderItemInput,
  ProteinOption,
} from './foods-types';

export function formatNaira(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return 'Price confirmed on WhatsApp';
  }
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

export function normalizeNigerianWhatsapp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length >= 13) {
    return digits;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `234${digits}`;
  }
  return digits || '2349026138101';
}

export function formatUnitLabel(unitType: FoodUnitType, quantity: number): string {
  if (unitType === 'litre') {
    return quantity === 1 ? '1 Litre' : `${quantity} Litres`;
  }
  if (unitType === 'serving') {
    return quantity === 1 ? '1 Serving' : `${quantity} Servings`;
  }
  if (unitType === 'portion') {
    return quantity === 1 ? '1 Portion' : `${quantity} Portions`;
  }
  if (unitType === 'tray') {
    return quantity === 1 ? '1 Tray' : `${quantity} Trays`;
  }
  return quantity === 1 ? '1 Pack' : `${quantity} Packs`;
}

export function getEffectiveUnitPrice(product: FoodProduct): number | null {
  if (
    product.promoPrice !== null &&
    product.promoPrice !== undefined &&
    !Number.isNaN(product.promoPrice) &&
    product.promoPrice >= 0
  ) {
    return product.promoPrice;
  }
  return product.pricePerUnit;
}

export interface DeliveryZoneOption {
  id: string;
  label: string;
  feeNgn: number | null;
}

export const DELIVERY_ZONES: DeliveryZoneOption[] = [
  { id: 'pickup', label: 'Self-Pickup (Denro-Ishasi Kitchen)', feeNgn: 0 },
  { id: 'ishasi-akute', label: 'Ishasi / Denro-Ishasi / Akute', feeNgn: 1500 },
  { id: 'berger-ikeja', label: 'Ojodu Berger / Ikeja / Ogba / Magodo', feeNgn: 2500 },
  { id: 'mainland-central', label: 'Surulere / Yaba / Gbagada / Maryland', feeNgn: 3500 },
  { id: 'island', label: 'Victoria Island / Ikoyi / Lekki / Ajah', feeNgn: 5000 },
  { id: 'outside-coverage', label: 'Outside Normal Coverage (Confirm Location)', feeNgn: null },
];

export interface CartSelection {
  productId: string;
  quantity: number;
  proteinIds: string[];
}

export interface CalculatedOrder {
  items: OrderItemInput[];
  subtotal: number | null;
  bulkDiscountPercent: number;
  bulkDiscountNgn: number;
  deliveryFee: number | null;
  totalPayable: number | null;
  hasUnpricedItems: boolean;
  soupLitresTotal: number;
  minimumOrderValueNgn: number;
  minimumSoupLitres: number;
  meetsMinimumOrderValue: boolean;
  meetsMinimumSoupLitres: boolean;
  remainingToMinimumNgn: number;
  isOrderEligible: boolean;
  minimumOrderMessage: string;
  estimatedCostNgn: number;
  estimatedProfitNgn: number;
}

export function calculateOrderTotals(
  selections: CartSelection[],
  products: FoodProduct[],
  proteins: ProteinOption[],
  deliveryFee: number | null,
  policy?: { minimumOrderValueNgn?: number; minimumSoupLitres?: number }
): CalculatedOrder {
  const minimumOrderValueNgn = Math.max(50000, policy?.minimumOrderValueNgn || 50000);
  const minimumSoupLitres = Math.max(3, policy?.minimumSoupLitres || 3);

  const items: OrderItemInput[] = [];
  let runningSubtotal = 0;
  let runningCost = 0;
  let totalUnits = 0;
  let soupLitresTotal = 0;
  let hasSoupInCart = false;
  let hasUnpricedItems = false;

  for (const sel of selections) {
    const product = products.find((p) => p.id === sel.productId && p.enabled);
    if (!product) continue;

    const qty = Math.max(product.minQuantity || 1, Math.floor(sel.quantity || 1));
    totalUnits += qty;
    if (product.category === 'soup') {
      hasSoupInCart = true;
      soupLitresTotal += qty;
    }

    const selectedProteins = product.supportsProteins
      ? sel.proteinIds
          .map((pid) => proteins.find((pr) => pr.id === pid && pr.enabled))
          .filter((pr): pr is ProteinOption => Boolean(pr))
          .map((pr) => ({
            id: pr.id,
            name: pr.name,
            price: pr.price,
          }))
      : [];

    const effectivePrice = getEffectiveUnitPrice(product);
    let lineTotal: number | null = null;
    if (effectivePrice !== null && effectivePrice >= 0) {
      let proteinSum = 0;
      let proteinUnpriced = false;
      for (const pr of selectedProteins) {
        if (pr.price === null || pr.price < 0) {
          proteinUnpriced = true;
        } else {
          proteinSum += pr.price;
        }
      }
      if (!proteinUnpriced) {
        lineTotal = effectivePrice * qty + proteinSum;
        runningSubtotal += lineTotal;
      } else {
        hasUnpricedItems = true;
      }
    } else {
      hasUnpricedItems = true;
    }

    if (product.costBreakdown) {
      const unitCost =
        (Number(product.costBreakdown.ingredientCost) || 0) +
        (Number(product.costBreakdown.proteinCost) || 0) +
        (Number(product.costBreakdown.packagingCost) || 0) +
        (Number(product.costBreakdown.prepCost) || 0);
      runningCost += unitCost * qty;
    }

    items.push({
      productId: product.id,
      productName: product.name,
      category: product.category,
      unitType: product.unitType,
      quantity: qty,
      unitPrice: effectivePrice,
      lineTotal,
      proteins: selectedProteins,
    });
  }

  const bulkDiscountPercent = totalUnits >= 10 ? 10 : totalUnits >= 4 ? 5 : 0;
  const rawSubtotal = items.length > 0 && !hasUnpricedItems ? runningSubtotal : null;
  const bulkDiscountNgn =
    rawSubtotal !== null && bulkDiscountPercent > 0
      ? Math.round((rawSubtotal * bulkDiscountPercent) / 100)
      : 0;
  const discountedSubtotal = rawSubtotal !== null ? Math.max(0, rawSubtotal - bulkDiscountNgn) : null;

  // Minimum order rule: strictly calculated using food subtotal (EXCLUDING delivery charges)
  const foodSubtotalForMin = discountedSubtotal ?? 0;
  const remainingToMinimumNgn = Math.max(0, minimumOrderValueNgn - foodSubtotalForMin);
  const meetsMinimumOrderValue = discountedSubtotal !== null && foodSubtotalForMin >= minimumOrderValueNgn;
  const meetsMinimumSoupLitres = !hasSoupInCart || soupLitresTotal >= minimumSoupLitres;
  const isOrderEligible = items.length > 0 && meetsMinimumOrderValue && meetsMinimumSoupLitres;

  let minimumOrderMessage = '';
  if (items.length === 0) {
    minimumOrderMessage = `Minimum order is ${formatNaira(minimumOrderValueNgn)} (excluding delivery).`;
  } else if (!meetsMinimumSoupLitres) {
    const neededLitres = minimumSoupLitres - soupLitresTotal;
    minimumOrderMessage = `Minimum soup quantity is ${minimumSoupLitres} litres (you can combine different soup varieties). Please add ${neededLitres} more litre${neededLitres > 1 ? 's' : ''}.`;
  } else if (!meetsMinimumOrderValue) {
    minimumOrderMessage = `Your minimum order is ${formatNaira(minimumOrderValueNgn)}. Please add ${formatNaira(remainingToMinimumNgn)} worth of items to continue.`;
  } else {
    minimumOrderMessage = 'Your order meets our minimum order requirement. You can proceed to checkout.';
  }

  const totalPayable =
    discountedSubtotal !== null && deliveryFee !== null
      ? discountedSubtotal + deliveryFee
      : null;

  const estimatedCostNgn = Math.round(runningCost);
  const estimatedProfitNgn =
    discountedSubtotal !== null ? Math.round(discountedSubtotal - estimatedCostNgn) : 0;

  return {
    items,
    subtotal: discountedSubtotal,
    bulkDiscountPercent,
    bulkDiscountNgn,
    deliveryFee,
    totalPayable,
    hasUnpricedItems,
    soupLitresTotal,
    minimumOrderValueNgn,
    minimumSoupLitres,
    meetsMinimumOrderValue,
    meetsMinimumSoupLitres,
    remainingToMinimumNgn,
    isOrderEligible,
    minimumOrderMessage,
    estimatedCostNgn,
    estimatedProfitNgn,
  };
}

export function buildWhatsAppOrderMessage(params: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryZoneName?: string;
  deliveryDate: string;
  deliveryTime: string;
  additionalInstructions: string;
  calculated: CalculatedOrder;
  attribution?: AttributionData;
}): string {
  const {
    orderId,
    customerName,
    customerPhone,
    deliveryAddress,
    deliveryZoneName,
    deliveryDate,
    deliveryTime,
    additionalInstructions,
    calculated,
  } = params;

  const lines: string[] = [
    `*NEW FOOD ORDER — BETHELMIND FOODS & CATERING SERVICES*`,
    `Order Ref: *${orderId}*`,
    ``,
    `*Customer Details:*`,
    `• Name: ${customerName}`,
    `• Phone/WhatsApp: ${customerPhone}`,
    `• Delivery Zone: ${deliveryZoneName || 'Selected Zone'}`,
    `• Delivery Address: ${deliveryAddress}`,
    `• Preferred Date: ${deliveryDate}`,
    `• Preferred Time: ${deliveryTime}`,
  ];

  if (additionalInstructions.trim()) {
    lines.push(`• Instructions: ${additionalInstructions.trim()}`);
  }

  lines.push(``, `*Order Items:*`);

  calculated.items.forEach((item, idx) => {
    const qtyLabel = formatUnitLabel(item.unitType, item.quantity);
    const proteinNames =
      item.proteins.length > 0
        ? ` | Proteins: ${item.proteins
            .map((p) => (p.price !== null ? `${p.name} (${formatNaira(p.price)})` : p.name))
            .join(', ')}`
        : '';
    const pricePart = item.lineTotal !== null ? ` — ${formatNaira(item.lineTotal)}` : '';
    lines.push(`${idx + 1}. *${item.productName}* (${qtyLabel})${proteinNames}${pricePart}`);
  });

  lines.push(``);
  if (calculated.subtotal !== null) {
    lines.push(`Food Subtotal: *${formatNaira(calculated.subtotal)}*`);
    if (calculated.deliveryFee !== null) {
      lines.push(`Delivery Charge: *${formatNaira(calculated.deliveryFee)}*`);
    } else {
      lines.push(`Delivery Charge: *Delivery fee will be confirmed before payment.*`);
    }
    if (calculated.totalPayable !== null) {
      lines.push(`Total Payable: *${formatNaira(calculated.totalPayable)}*`);
    } else {
      lines.push(`Total Payable: *Pending delivery fee confirmation*`);
    }
  } else {
    lines.push(`Pricing: Please confirm total for selected items/litres & proteins.`);
  }

  lines.push(``, `_Note: Freshly sourced & cooked to order (24-hour advance order policy)._`);

  return lines.join('\n');
}
