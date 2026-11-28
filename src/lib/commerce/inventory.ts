import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type StockMovementType = 'purchase' | 'sale' | 'adjustment' | 'transfer';

export interface InventoryBranch {
  id: string;
  tenantId: string;
  name: string;
  location: string;
  active: boolean;
}

export interface InventorySupplier {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  category?: string;
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  branchId: string;
  sku: string;
  name: string;
  unit: string;
  costPriceNgn: number;
  sellingPriceNgn: number;
  stockQty: number;
  reorderLevel: number;
  supplierId?: string;
  active: boolean;
  updatedAt: string;
}

export interface StockMovementRecord {
  id: string;
  tenantId: string;
  itemId: string;
  itemName: string;
  branchId: string;
  movementType: StockMovementType;
  quantityDelta: number;
  unitCostNgn: number;
  unitPriceNgn: number;
  reference?: string;
  performedBy?: string;
  createdAt: string;
}

interface InventoryStore {
  branches: InventoryBranch[];
  suppliers: InventorySupplier[];
  items: InventoryItem[];
  movements: StockMovementRecord[];
}

const INVENTORY_PATH = path.join(process.cwd(), 'local_db', 'commerce_inventory.json');

function readStore(): InventoryStore {
  try {
    if (fs.existsSync(INVENTORY_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
      return {
        branches: Array.isArray(parsed.branches) ? parsed.branches : [],
        suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : [],
        items: Array.isArray(parsed.items) ? parsed.items : [],
        movements: Array.isArray(parsed.movements) ? parsed.movements : [],
      };
    }
  } catch {}
  return { branches: [], suppliers: [], items: [], movements: [] };
}

function writeStore(store: InventoryStore): void {
  try {
    const dir = path.dirname(INVENTORY_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(INVENTORY_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch {}
}

export function getTenantInventorySnapshot(tenantId: string) {
  const store = readStore();
  const branches = store.branches.filter((b) => b.tenantId === tenantId);
  const suppliers = store.suppliers.filter((s) => s.tenantId === tenantId);
  const items = store.items.filter((i) => i.tenantId === tenantId && i.active);
  const movements = store.movements.filter((m) => m.tenantId === tenantId).slice(0, 200);

  const lowStockAlerts = items.filter((i) => i.stockQty <= i.reorderLevel);
  const totalStockValueCostNgn = items.reduce((sum, i) => sum + i.stockQty * i.costPriceNgn, 0);
  const totalStockRetailNgn = items.reduce((sum, i) => sum + i.stockQty * i.sellingPriceNgn, 0);

  const todayPrefix = new Date().toISOString().slice(0, 10);
  const todaySales = movements.filter(
    (m) => m.movementType === 'sale' && m.createdAt.startsWith(todayPrefix)
  );
  const dailySalesRevenueNgn = todaySales.reduce(
    (sum, m) => sum + Math.abs(m.quantityDelta) * m.unitPriceNgn,
    0
  );
  const dailySalesCostNgn = todaySales.reduce(
    (sum, m) => sum + Math.abs(m.quantityDelta) * m.unitCostNgn,
    0
  );

  return {
    tenantId,
    branches,
    suppliers,
    items,
    movements,
    lowStockAlerts,
    summary: {
      totalSkus: items.length,
      lowStockCount: lowStockAlerts.length,
      totalStockValueCostNgn,
      totalStockRetailNgn,
      dailySalesRevenueNgn,
      dailyEstimatedGrossProfitNgn: dailySalesRevenueNgn - dailySalesCostNgn,
    },
  };
}

export function upsertInventoryItem(input: {
  tenantId: string;
  id?: string;
  branchId?: string;
  sku: string;
  name: string;
  unit: string;
  costPriceNgn: number;
  sellingPriceNgn: number;
  stockQty?: number;
  reorderLevel?: number;
  supplierId?: string;
}): InventoryItem {
  const store = readStore();
  const now = new Date().toISOString();
  const existingIdx = input.id
    ? store.items.findIndex((i) => i.id === input.id && i.tenantId === input.tenantId)
    : -1;

  if (existingIdx >= 0) {
    const updated: InventoryItem = {
      ...store.items[existingIdx],
      branchId: input.branchId || store.items[existingIdx].branchId,
      sku: input.sku.trim(),
      name: input.name.trim(),
      unit: input.unit.trim() || 'unit',
      costPriceNgn: Math.max(0, Math.round(input.costPriceNgn)),
      sellingPriceNgn: Math.max(0, Math.round(input.sellingPriceNgn)),
      reorderLevel: Math.max(0, Math.floor(input.reorderLevel ?? store.items[existingIdx].reorderLevel)),
      supplierId: input.supplierId,
      updatedAt: now,
    };
    store.items[existingIdx] = updated;
    writeStore(store);
    return updated;
  }

  const created: InventoryItem = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    branchId: input.branchId || 'main',
    sku: input.sku.trim(),
    name: input.name.trim(),
    unit: input.unit.trim() || 'unit',
    costPriceNgn: Math.max(0, Math.round(input.costPriceNgn)),
    sellingPriceNgn: Math.max(0, Math.round(input.sellingPriceNgn)),
    stockQty: Math.max(0, Math.floor(input.stockQty || 0)),
    reorderLevel: Math.max(0, Math.floor(input.reorderLevel ?? 5)),
    supplierId: input.supplierId,
    active: true,
    updatedAt: now,
  };
  store.items.unshift(created);
  writeStore(store);
  return created;
}

export function recordStockMovement(input: {
  tenantId: string;
  itemId: string;
  movementType: StockMovementType;
  quantity: number;
  unitCostNgn?: number;
  unitPriceNgn?: number;
  reference?: string;
  performedBy?: string;
}) {
  const store = readStore();
  const idx = store.items.findIndex((i) => i.id === input.itemId && i.tenantId === input.tenantId);
  if (idx === -1) {
    throw new Error('Inventory item not found for this tenant.');
  }

  const item = store.items[idx];
  const absQty = Math.max(1, Math.floor(Math.abs(input.quantity)));
  const delta = input.movementType === 'sale' ? -absQty : input.movementType === 'purchase' ? absQty : Math.trunc(input.quantity);

  if (item.stockQty + delta < 0) {
    throw new Error(`Insufficient stock for ${item.name} (Available: ${item.stockQty} ${item.unit}).`);
  }

  item.stockQty += delta;
  if (input.movementType === 'purchase' && input.unitCostNgn !== undefined) {
    item.costPriceNgn = Math.max(0, Math.round(input.unitCostNgn));
  }
  item.updatedAt = new Date().toISOString();

  const movement: StockMovementRecord = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    itemId: item.id,
    itemName: item.name,
    branchId: item.branchId,
    movementType: input.movementType,
    quantityDelta: delta,
    unitCostNgn: Math.max(0, Math.round(input.unitCostNgn ?? item.costPriceNgn)),
    unitPriceNgn: Math.max(0, Math.round(input.unitPriceNgn ?? item.sellingPriceNgn)),
    reference: input.reference?.trim(),
    performedBy: input.performedBy?.trim(),
    createdAt: new Date().toISOString(),
  };

  store.movements.unshift(movement);
  if (store.movements.length > 2000) store.movements = store.movements.slice(0, 2000);
  writeStore(store);

  return {
    item,
    movement,
    lowStockTriggered: item.stockQty <= item.reorderLevel,
  };
}

export function addTenantSupplier(input: {
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  category?: string;
}): InventorySupplier {
  const store = readStore();
  const supplier: InventorySupplier = {
    id: crypto.randomUUID(),
    tenantId: input.tenantId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim(),
    category: input.category?.trim(),
  };
  store.suppliers.unshift(supplier);
  writeStore(store);
  return supplier;
}
