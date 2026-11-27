import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import {
  listCommercialProducts,
  updateCommercialProduct,
  type CommercialDivision,
} from '@/lib/commerce/catalog';

export async function GET(req: NextRequest) {
  try {
    const division = req.nextUrl.searchParams.get('division') as CommercialDivision | null;
    const includeInactive = req.nextUrl.searchParams.get('includeInactive') === 'true';

    const products = await listCommercialProducts({
      division: division || undefined,
      includeInactive,
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to load products' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await resolveAdminRequest(req);

    if (!admin || (!admin.permissions.includes('*') && !admin.permissions.includes('edit_settings'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 });
    }

    if (patch.priceNgn !== undefined && (typeof patch.priceNgn !== 'number' || patch.priceNgn < 0)) {
      return NextResponse.json({ success: false, error: 'priceNgn must be a non-negative number' }, { status: 400 });
    }

    const updated = await updateCommercialProduct(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to update product' }, { status: 500 });
  }
}
