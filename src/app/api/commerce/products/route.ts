import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import {
  listCommercialProducts,
  createCommercialProduct,
  updateCommercialProduct,
  deleteCommercialProduct,
  type CommercialDivision,
  type ServiceCategoryKey,
} from '@/lib/commerce/catalog';

function isAuthorizedAdmin(admin: Awaited<ReturnType<typeof resolveAdminRequest>>) {
  return Boolean(admin && (admin.permissions.includes('*') || admin.permissions.includes('edit_settings')));
}

export async function GET(req: NextRequest) {
  try {
    const division = req.nextUrl.searchParams.get('division') as CommercialDivision | null;
    const serviceKey = req.nextUrl.searchParams.get('serviceKey') as ServiceCategoryKey | null;
    const includeInactive = req.nextUrl.searchParams.get('includeInactive') === 'true';

    const products = await listCommercialProducts({
      division: division || undefined,
      serviceKey: serviceKey || undefined,
      includeInactive,
    });

    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to load products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await resolveAdminRequest(req);
    if (!isAuthorizedAdmin(admin)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      division = 'digital_business_solutions',
      serviceKey = 'website',
      pricingMode = 'fixed',
      priceNgn = 0,
      priceMaxNgn,
      promoPriceNgn,
      promoLabel,
      monthlyMaintenanceNgn = 0,
      recurringCostNotes,
      depositPercent = 60,
      milestonesDescription,
      description = '',
      deliverables = [],
      exclusions = [],
      addOns = [],
      leadVolume,
      targetIndustry,
      geoCoverage,
      turnaroundTime = '3–5 business days',
      fulfilmentType = 'website_project',
      active = true,
    } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Package name is required' }, { status: 400 });
    }
    if (typeof priceNgn !== 'number' || priceNgn < 0) {
      return NextResponse.json({ success: false, error: 'priceNgn must be a non-negative number' }, { status: 400 });
    }

    const created = await createCommercialProduct({
      name: name.trim(),
      division,
      serviceKey,
      pricingMode,
      priceNgn,
      priceMaxNgn,
      promoPriceNgn,
      promoLabel,
      monthlyMaintenanceNgn: Number(monthlyMaintenanceNgn || 0),
      recurringCostNotes,
      depositPercent: Number(depositPercent ?? 60),
      milestonesDescription,
      description: String(description || ''),
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      addOns: Array.isArray(addOns) ? addOns : [],
      leadVolume: leadVolume != null ? Number(leadVolume) : undefined,
      targetIndustry,
      geoCoverage,
      turnaroundTime,
      fulfilmentType,
      active: active !== false,
    });

    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await resolveAdminRequest(req);
    if (!isAuthorizedAdmin(admin)) {
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

    if (patch.promoPriceNgn !== undefined && patch.promoPriceNgn !== null && (typeof patch.promoPriceNgn !== 'number' || patch.promoPriceNgn < 0)) {
      return NextResponse.json({ success: false, error: 'promoPriceNgn must be a non-negative number' }, { status: 400 });
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

export async function DELETE(req: NextRequest) {
  try {
    const admin = await resolveAdminRequest(req);
    if (!isAuthorizedAdmin(admin)) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Product id is required' }, { status: 400 });
    }

    const deleted = await deleteCommercialProduct(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
