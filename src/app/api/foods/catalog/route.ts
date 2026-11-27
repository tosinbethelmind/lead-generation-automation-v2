import { NextRequest, NextResponse } from 'next/server';
import { isFoodsAdminAuthenticated } from '@/lib/foods-auth';
import { readFoodsStore, writeFoodsStore } from '@/lib/foods-store';
import { FoodProduct, FoodsSettings, ProteinOption } from '@/lib/foods-types';

export async function GET() {
  const store = readFoodsStore();
  return NextResponse.json({
    products: store.products,
    proteins: store.proteins,
    settings: store.settings,
  });
}

export async function PUT(req: NextRequest) {
  const authed = await isFoodsAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      products?: FoodProduct[];
      proteins?: ProteinOption[];
      settings?: FoodsSettings;
    };

    const store = readFoodsStore();

    if (Array.isArray(body.products)) {
      store.products = body.products.map((p) => ({
        ...p,
        pricePerUnit:
          p.pricePerUnit === null || p.pricePerUnit === undefined || String(p.pricePerUnit) === ''
            ? null
            : Math.max(0, Number(p.pricePerUnit)),
        minQuantity: Math.max(1, Number(p.minQuantity) || 1),
      }));
    }

    if (Array.isArray(body.proteins)) {
      store.proteins = body.proteins.map((pr) => ({
        ...pr,
        price:
          pr.price === null || pr.price === undefined || String(pr.price) === ''
            ? null
            : Math.max(0, Number(pr.price)),
      }));
    }

    if (body.settings) {
      store.settings = {
        ...store.settings,
        ...body.settings,
        deliveryLeadTimeHours: Math.max(1, Number(body.settings.deliveryLeadTimeHours) || 7),
        deliveryFee:
          body.settings.deliveryFee === null ||
          body.settings.deliveryFee === undefined ||
          String(body.settings.deliveryFee) === ''
            ? null
            : Math.max(0, Number(body.settings.deliveryFee)),
        tracking: {
          ...store.settings.tracking,
          ...(body.settings.tracking || {}),
        },
        testimonials: Array.isArray(body.settings.testimonials)
          ? body.settings.testimonials
          : store.settings.testimonials,
      };
    }

    writeFoodsStore(store);

    return NextResponse.json({
      ok: true,
      products: store.products,
      proteins: store.proteins,
      settings: store.settings,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 400 });
  }
}
