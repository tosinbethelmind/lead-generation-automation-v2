import { NextRequest, NextResponse } from 'next/server';
import { isFoodsAdminAuthenticated } from '@/lib/foods-auth';
import {
  buildWhatsAppOrderMessage,
  calculateOrderTotals,
  normalizeNigerianWhatsapp,
} from '@/lib/foods-pricing';
import {
  appendFoodOrder,
  appendFoodsAuditEntries,
  readFoodsStore,
  writeFoodsStore,
} from '@/lib/foods-store';
import { FoodOrder, ORDER_STATUSES, OrderStatus } from '@/lib/foods-types';

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
    const body = await req.json();
    const customerName = String(body.customerName || '').trim();
    const customerPhone = String(body.customerPhone || '').trim();
    const deliveryAddress = String(body.deliveryAddress || '').trim();
    const deliveryDate = String(body.deliveryDate || '').trim();
    const deliveryTime = String(body.deliveryTime || '').trim();
    const additionalInstructions = String(body.additionalInstructions || '').trim();
    const deliveryZoneId = String(body.deliveryZoneId || '').trim();
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
    const zones = store.settings.deliveryZones || [];
    const matchedZone = zones.find((z) => z.id === deliveryZoneId && z.enabled);

    let resolvedDeliveryFee: number | null = store.settings.deliveryFee;
    let deliveryConfirmed = resolvedDeliveryFee !== null;
    let deliveryZoneName = matchedZone?.name || 'Custom / Unlisted Location';

    if (matchedZone) {
      if (matchedZone.isFreePromo) {
        resolvedDeliveryFee = 0;
        deliveryConfirmed = true;
      } else if (matchedZone.requiresConfirmation || matchedZone.feeNgn === null) {
        resolvedDeliveryFee = null;
        deliveryConfirmed = false;
      } else {
        resolvedDeliveryFee = matchedZone.feeNgn;
        deliveryConfirmed = true;
      }
    } else if (deliveryZoneId === 'outside-coverage') {
      resolvedDeliveryFee = null;
      deliveryConfirmed = false;
    }

    const calculated = calculateOrderTotals(
      selections,
      store.products,
      store.proteins,
      resolvedDeliveryFee,
      {
        minimumOrderValueNgn: store.settings.minimumOrderValueNgn,
        minimumSoupLitres: store.settings.minimumSoupLitres,
      }
    );

    if (calculated.items.length === 0) {
      return NextResponse.json(
        { error: 'No valid enabled food items were selected.' },
        { status: 400 }
      );
    }

    // Hard server-side enforcement of ₦50,000 minimum food subtotal (excluding delivery) & 3-litre soup minimum
    if (!calculated.isOrderEligible) {
      return NextResponse.json(
        {
          error: calculated.minimumOrderMessage,
          code: 'MINIMUM_ORDER_NOT_MET',
          subtotal: calculated.subtotal,
          minimumOrderValueNgn: calculated.minimumOrderValueNgn,
          soupLitresTotal: calculated.soupLitresTotal,
          minimumSoupLitres: calculated.minimumSoupLitres,
        },
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
      status: deliveryConfirmed ? 'Awaiting Payment' : 'Pending',
      paymentVerified: false,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryZoneId: matchedZone?.id || deliveryZoneId || undefined,
      deliveryZoneName,
      deliveryConfirmed,
      deliveryDate,
      deliveryTime,
      additionalInstructions,
      items: calculated.items,
      subtotal: calculated.subtotal,
      deliveryFee: calculated.deliveryFee,
      totalPayable: calculated.totalPayable,
      hasUnpricedItems: calculated.hasUnpricedItems,
      estimatedCostNgn: calculated.estimatedCostNgn,
      estimatedProfitNgn: calculated.estimatedProfitNgn,
      attribution: body.attribution || {},
      whatsappOpened: true,
    };

    appendFoodOrder(order);

    const whatsappMessage = buildWhatsAppOrderMessage({
      orderId,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryZoneName,
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
      deliveryFee?: number | null;
      deliveryConfirmed?: boolean;
    };

    if (!body.orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const store = readFoodsStore();
    const idx = store.orders.findIndex((o) => o.id === body.orderId);
    if (idx === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const existing = store.orders[idx];

    if (body.deliveryFee !== undefined) {
      const nextFee = body.deliveryFee === null ? null : Math.max(0, Number(body.deliveryFee));
      if (existing.deliveryFee !== nextFee) {
        appendFoodsAuditEntries([
          {
            action: 'order_delivery_change',
            entityName: `Order ${existing.id}`,
            previousValue: existing.deliveryFee !== null ? `₦${existing.deliveryFee}` : 'Unconfirmed',
            newValue: nextFee !== null ? `₦${nextFee}` : 'Unconfirmed',
          },
        ]);
      }
      existing.deliveryFee = nextFee;
      existing.deliveryConfirmed = nextFee !== null ? (body.deliveryConfirmed ?? true) : false;
      existing.totalPayable =
        existing.subtotal !== null && nextFee !== null ? existing.subtotal + nextFee : null;
    } else if (typeof body.deliveryConfirmed === 'boolean') {
      existing.deliveryConfirmed = body.deliveryConfirmed;
    }

    if (body.status && ORDER_STATUSES.includes(body.status)) {
      if (body.status === 'Paid' && !existing.deliveryConfirmed) {
        return NextResponse.json(
          { error: 'Confirm delivery fee and availability before marking order as Paid.' },
          { status: 400 }
        );
      }
      existing.status = body.status;
    }

    if (typeof body.paymentVerified === 'boolean') {
      if (body.paymentVerified && !existing.deliveryConfirmed) {
        return NextResponse.json(
          { error: 'Cannot verify payment while delivery fee is unconfirmed.' },
          { status: 400 }
        );
      }
      existing.paymentVerified = body.paymentVerified;
    }

    existing.updatedAt = new Date().toISOString();
    writeFoodsStore(store);

    return NextResponse.json({ ok: true, order: existing });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 400 });
  }
}
