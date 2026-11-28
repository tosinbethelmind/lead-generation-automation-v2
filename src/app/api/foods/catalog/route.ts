import { NextRequest, NextResponse } from 'next/server';
import { isFoodsAdminAuthenticated } from '@/lib/foods-auth';
import {
  appendFoodsAuditEntries,
  readFoodsStore,
  sanitizeFoodsStoreForPublic,
  writeFoodsStore,
} from '@/lib/foods-store';
import { FoodProduct, FoodsAuditEntry, FoodsSettings, ProteinOption } from '@/lib/foods-types';

export async function GET() {
  const store = readFoodsStore();
  const authed = await isFoodsAdminAuthenticated();
  if (authed) {
    return NextResponse.json({
      products: store.products,
      proteins: store.proteins,
      settings: store.settings,
      auditLog: store.auditLog || [],
    });
  }
  return NextResponse.json(sanitizeFoodsStoreForPublic(store));
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
    const auditEntries: Array<Omit<FoodsAuditEntry, 'id' | 'timestamp'>> = [];

    if (Array.isArray(body.products)) {
      const prevProducts = store.products;
      store.products = body.products.map((p) => {
        const normalizedPrice =
          p.pricePerUnit === null || p.pricePerUnit === undefined || String(p.pricePerUnit) === ''
            ? null
            : Math.max(0, Number(p.pricePerUnit));
        const normalizedPromo =
          p.promoPrice === null || p.promoPrice === undefined || String(p.promoPrice) === ''
            ? null
            : Math.max(0, Number(p.promoPrice));

        const prev = prevProducts.find((old) => old.id === p.id);
        if (prev && (prev.pricePerUnit !== normalizedPrice || (prev.promoPrice ?? null) !== normalizedPromo)) {
          auditEntries.push({
            action: 'product_price_change',
            entityName: p.name,
            previousValue: `₦${prev.pricePerUnit ?? 'unset'}${prev.promoPrice != null ? ` (promo ₦${prev.promoPrice})` : ''}`,
            newValue: `₦${normalizedPrice ?? 'unset'}${normalizedPromo != null ? ` (promo ₦${normalizedPromo})` : ''}`,
          });
        }

        return {
          ...p,
          pricePerUnit: normalizedPrice,
          promoPrice: normalizedPromo,
          minQuantity: Math.max(1, Number(p.minQuantity) || 1),
          costBreakdown: p.costBreakdown
            ? {
                ingredientCost: Math.max(0, Number(p.costBreakdown.ingredientCost) || 0),
                proteinCost: Math.max(0, Number(p.costBreakdown.proteinCost) || 0),
                packagingCost: Math.max(0, Number(p.costBreakdown.packagingCost) || 0),
                prepCost: Math.max(0, Number(p.costBreakdown.prepCost) || 0),
              }
            : undefined,
        };
      });
    }

    if (Array.isArray(body.proteins)) {
      const prevProteins = store.proteins;
      store.proteins = body.proteins.map((pr) => {
        const normalizedPrice =
          pr.price === null || pr.price === undefined || String(pr.price) === ''
            ? null
            : Math.max(0, Number(pr.price));

        const prev = prevProteins.find((old) => old.id === pr.id);
        if (prev && prev.price !== normalizedPrice) {
          auditEntries.push({
            action: 'protein_price_change',
            entityName: pr.name,
            previousValue: `₦${prev.price ?? 'unset'}`,
            newValue: `₦${normalizedPrice ?? 'unset'}`,
          });
        }

        return {
          ...pr,
          price: normalizedPrice,
        };
      });
    }

    if (body.settings) {
      const prevZones = store.settings.deliveryZones || [];
      const nextZones = Array.isArray(body.settings.deliveryZones)
        ? body.settings.deliveryZones.map((z) => {
            const fee =
              z.feeNgn === null || z.feeNgn === undefined || String(z.feeNgn) === ''
                ? null
                : Math.max(0, Number(z.feeNgn));
            const prevZ = prevZones.find((oz) => oz.id === z.id);
            if (prevZ && (prevZ.feeNgn !== fee || Boolean(prevZ.isFreePromo) !== Boolean(z.isFreePromo))) {
              auditEntries.push({
                action: 'delivery_zone_change',
                entityName: z.name,
                previousValue: prevZ.isFreePromo ? 'Free Promo' : prevZ.feeNgn !== null ? `₦${prevZ.feeNgn}` : 'Confirm',
                newValue: z.isFreePromo ? 'Free Promo' : fee !== null ? `₦${fee}` : 'Confirm',
              });
            }
            return { ...z, feeNgn: fee };
          })
        : prevZones;

      store.settings = {
        ...store.settings,
        ...body.settings,
        deliveryLeadTimeHours: Math.max(1, Number(body.settings.deliveryLeadTimeHours) || 24),
        minimumOrderValueNgn: Math.max(50000, Number(body.settings.minimumOrderValueNgn) || 50000),
        minimumSoupLitres: Math.max(3, Number(body.settings.minimumSoupLitres) || 3),
        deliveryZones: nextZones,
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
    if (auditEntries.length > 0) {
      appendFoodsAuditEntries(auditEntries);
    }

    const updated = readFoodsStore();
    return NextResponse.json({
      ok: true,
      products: updated.products,
      proteins: updated.proteins,
      settings: updated.settings,
      auditLog: updated.auditLog || [],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update catalog' }, { status: 400 });
  }
}
