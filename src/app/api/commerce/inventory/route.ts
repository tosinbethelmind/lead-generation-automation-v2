import { NextRequest, NextResponse } from 'next/server';
import { requireCommerceAdmin } from '@/lib/commerce/adminAuth';
import {
  addTenantSupplier,
  getTenantInventorySnapshot,
  recordStockMovement,
  upsertInventoryItem,
} from '@/lib/commerce/inventory';

export async function GET(request: NextRequest) {
  const denied = await requireCommerceAdmin(request);
  if (denied) return denied;

  const tenantId = request.nextUrl.searchParams.get('tenantId') || 'bethelmind_internal';
  const snapshot = getTenantInventorySnapshot(tenantId);
  return NextResponse.json({ success: true, ...snapshot });
}

export async function POST(request: NextRequest) {
  const denied = await requireCommerceAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const tenantId = String(body.tenantId || 'bethelmind_internal');

    if (body.action === 'add_supplier') {
      if (!body.name || !body.phone) {
        return NextResponse.json({ success: false, error: 'Supplier name and phone required.' }, { status: 400 });
      }
      const supplier = addTenantSupplier({
        tenantId,
        name: String(body.name),
        phone: String(body.phone),
        email: body.email ? String(body.email) : undefined,
        category: body.category ? String(body.category) : undefined,
      });
      return NextResponse.json({ success: true, supplier }, { status: 201 });
    }

    if (body.action === 'record_movement') {
      if (!body.itemId || !body.movementType || !body.quantity) {
        return NextResponse.json(
          { success: false, error: 'itemId, movementType, and quantity are required.' },
          { status: 400 }
        );
      }
      const result = recordStockMovement({
        tenantId,
        itemId: String(body.itemId),
        movementType: body.movementType,
        quantity: Number(body.quantity),
        unitCostNgn: body.unitCostNgn !== undefined ? Number(body.unitCostNgn) : undefined,
        unitPriceNgn: body.unitPriceNgn !== undefined ? Number(body.unitPriceNgn) : undefined,
        reference: body.reference ? String(body.reference) : undefined,
        performedBy: body.performedBy ? String(body.performedBy) : 'admin',
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (!body.sku || !body.name) {
      return NextResponse.json({ success: false, error: 'sku and name are required.' }, { status: 400 });
    }

    const item = upsertInventoryItem({
      tenantId,
      id: body.id ? String(body.id) : undefined,
      branchId: body.branchId ? String(body.branchId) : 'main',
      sku: String(body.sku),
      name: String(body.name),
      unit: String(body.unit || 'carton'),
      costPriceNgn: Number(body.costPriceNgn || 0),
      sellingPriceNgn: Number(body.sellingPriceNgn || 0),
      stockQty: body.stockQty !== undefined ? Number(body.stockQty) : 0,
      reorderLevel: body.reorderLevel !== undefined ? Number(body.reorderLevel) : 5,
      supplierId: body.supplierId ? String(body.supplierId) : undefined,
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Inventory operation failed.' },
      { status: 400 }
    );
  }
}
