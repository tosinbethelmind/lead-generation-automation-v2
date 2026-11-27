import { AttributionData, FoodProduct, OrderItemInput, ProteinOption } from './foods-types';

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

export function formatUnitLabel(unitType: 'litre' | 'serving' | 'pack', quantity: number): string {
  if (unitType === 'litre') {
    return quantity === 1 ? '1 Litre' : `${quantity} Litres`;
  }
  if (unitType === 'serving') {
    return quantity === 1 ? '1 Serving' : `${quantity} Servings`;
  }
  return quantity === 1 ? '1 Pack' : `${quantity} Packs`;
}

export interface CartSelection {
  productId: string;
  quantity: number;
  proteinIds: string[];
}

export interface CalculatedOrder {
  items: OrderItemInput[];
  subtotal: number | null;
  deliveryFee: number | null;
  totalPayable: number | null;
  hasUnpricedItems: boolean;
}

export function calculateOrderTotals(
  selections: CartSelection[],
  products: FoodProduct[],
  proteins: ProteinOption[],
  deliveryFee: number | null
): CalculatedOrder {
  const items: OrderItemInput[] = [];
  let runningSubtotal = 0;
  let hasUnpricedItems = false;

  for (const sel of selections) {
    const product = products.find((p) => p.id === sel.productId && p.enabled);
    if (!product) continue;

    const qty = Math.max(product.minQuantity || 1, Math.floor(sel.quantity || 1));
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

    let lineTotal: number | null = null;
    if (product.pricePerUnit !== null && product.pricePerUnit >= 0) {
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
        lineTotal = product.pricePerUnit * qty + proteinSum;
        runningSubtotal += lineTotal;
      } else {
        hasUnpricedItems = true;
      }
    } else {
      hasUnpricedItems = true;
    }

    items.push({
      productId: product.id,
      productName: product.name,
      category: product.category,
      unitType: product.unitType,
      quantity: qty,
      unitPrice: product.pricePerUnit,
      lineTotal,
      proteins: selectedProteins,
    });
  }

  const subtotal = items.length > 0 && !hasUnpricedItems ? runningSubtotal : null;
  const totalPayable =
    subtotal !== null && deliveryFee !== null ? subtotal + deliveryFee : subtotal !== null && deliveryFee === 0 ? subtotal : null;

  return {
    items,
    subtotal,
    deliveryFee,
    totalPayable,
    hasUnpricedItems,
  };
}

export function buildWhatsAppOrderMessage(params: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
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
    lines.push(`Subtotal: *${formatNaira(calculated.subtotal)}*`);
    if (calculated.deliveryFee !== null) {
      lines.push(`Delivery Fee: *${formatNaira(calculated.deliveryFee)}*`);
    } else {
      lines.push(`Delivery Fee: To be confirmed based on location`);
    }
    if (calculated.totalPayable !== null) {
      lines.push(`Total Payable: *${formatNaira(calculated.totalPayable)}*`);
    }
  } else {
    lines.push(`Pricing: Please confirm total for selected items/litres & proteins.`);
  }

  lines.push(``, `_Note: Placed in accordance with the 7-hour minimum advance order policy._`);

  return lines.join('\n');
}
