import { NextRequest, NextResponse } from 'next/server';
import { isFoodsAdminAuthenticated } from '@/lib/foods-auth';
import {
  buildWhatsAppOrderMessage,
  calculateOrderTotals,
  CartSelection,
  normalizeNigerianWhatsapp,
} from '@/lib/foods-pricing';
import { appendFoodOrder, readFoodsStore, writeFoodsStore } from '@/lib/foods-store';
import { AttributionData, FoodOrder, ORDER_STATUSES, OrderStatus } from '@/lib/foods-types';

export async function GET() {
  const authed = await isFoodsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const store = readFoodsStore();
  return NextResponse.json({ orders: store.orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      customerName?: string;
      customerPhone?: string;
      deliveryAddress?: string;
      deliveryDate?: string;
      deliveryTime?: string;
      additionalInstructions?: string;
      selections?: CartSelection[];
      attribution?: AttributionData;
    };

    const customerName = (body.customerName || '').trim();
    const customerPhone = (body.customerPhone || '').trim();
    const deliveryAddress = (body.deliveryAddress || '').trim();
    const deliveryDate = (body.deliveryDate || '').trim();
    const deliveryTime = (body.deliveryTime || '').trim();
    const additionalInstructions = (body.additionalInstructions || '').trim();
    const selections = Array.isArray(body.selections) ? body.selections : [];

    if (!customerName || customerName.length < 2) {
      return NextResponse.json({ error: 'Please enter your full name.' }, { status: 400 });
    }
    const phoneDigits = customerPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json(
        { error: 'Please enter a valid WhatsApp or phone number.' },
        { status: 400 }
      );
    }
    if (!deliveryAddress || deliveryAddress.length < 5) {
      return NextResponse.json(
        { error: 'Please enter your full delivery address.' },
        { status: 400 }
      );
    }
    if (!deliveryDate || !deliveryTime) {
      return NextResponse.json(
        { error: 'Please select your preferred delivery date and time.' },
        { status: 400 }
      );
    }
    if (selections.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one food item before placing your order.' },
        { status: 400 }
      );
    }

    const store = readFoodsStore();
    const { DELIVERY_ZONES } = await import('@/lib/foods-pricing');
    const matchedZone = DELIVERY_ZONES.find((z) => z.id === String(body.deliveryZoneId || ''));
    const resolvedDeliveryFee = matchedZone ? matchedZone.feeNgn : store.settings.deliveryFee;

    const calculated = calculateOrderTotals(
      selections,
      store.products,
      store.proteins,
      resolvedDeliveryFee
    );

    if (calculated.items.length === 0) {
      return NextResponse.json(
        { error: 'No valid enabled food items were selected.' },
        { status: 400 }
      );
    }

    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const orderId = `BMF-${dateStamp}-${rand}`;

    const order: FoodOrder = {
      id: orderId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      status: 'New Order',
      paymentVerified: false,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      additionalInstructions,
      items: calculated.items,
      subtotal: calculated.subtotal,
      deliveryFee: calculated.deliveryFee,
      totalPayable: calculated.totalPayable,
      hasUnpricedItems: calculated.hasUnpricedItems,
      attribution: body.attribution || {},
      whatsappOpened: true,
    };

    appendFoodOrder(order);

    const whatsappMessage = buildWhatsAppOrderMessage({
      orderId,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      deliveryTime,
      additionalInstructions,
      calculated,
      attribution: body.attribution,
    });

    const primaryIntl = normalizeNigerianWhatsapp(store.settings.primaryWhatsapp);
    const secondaryIntl = normalizeNigerianWhatsapp(store.settings.secondaryWhatsapp);
    const encodedMsg = encodeURIComponent(whatsappMessage);

    return NextResponse.json({
      ok: true,
      order,
      whatsappUrl: `https://wa.me/${primaryIntl}?text=${encodedMsg}`,
      secondaryWhatsappUrl: `https://wa.me/${secondaryIntl}?text=${encodedMsg}`,
      whatsappMessage,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to submit order. Please try again.' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const authed = await isFoodsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      orderId?: string;
      status?: OrderStatus;
      paymentVerified?: boolean;
    };

    if (!body.orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const store = readFoodsStore();
    const idx = store.orders.findIndex((o) => o.id === body.orderId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (body.status && ORDER_STATUSES.includes(body.status)) {
      store.orders[idx].status = body.status;
    }
    if (typeof body.paymentVerified === 'boolean') {
      store.orders[idx].paymentVerified = body.paymentVerified;
    }
    store.orders[idx].updatedAt = new Date().toISOString();

    writeFoodsStore(store);
    return NextResponse.json({ ok: true, order: store.orders[idx] });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 });
  }
}
