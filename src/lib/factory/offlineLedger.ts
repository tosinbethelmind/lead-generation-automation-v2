/**
 * @file src/lib/factory/offlineLedger.ts
 * 
 * 📱 OFFLINE-FIRST PERSISTENCE LEDGER FOR NIGERIAN FACTORY OPERATING REALITIES
 * 
 * Guarantees zero data loss if:
 * 1. Mobile phone battery dies during a shift.
 * 2. Mobile browser tab is refreshed or closed.
 * 3. Factory power (NEPA / Gen) drops or internet disconnects.
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

export interface SachetLineState {
  rollsUsed: number;
  expectedBags: number;
  burstAllowanceBags: number;
  filmWeightKg: number;
}

export interface BottlingLineState {
  preformsIssued: number;
  blowRejects: number;
  crushedScrapWeightGrams: number;
  scrapWeightBalanced: boolean;
  packs75cl: number;
  packs50cl: number;
  dispenserJarsRefilled: number;
  usableBrandedJarsReturned: number;
  damagedThirdPartyJars: number;
}

export interface GateSaleTransaction {
  id: number;
  customerName: string;
  product: string;
  qty: number;
  amount: number;
  paymentType: 'cash' | 'transfer';
  moniepointRrn?: string; // Last 4 digits of POS Terminal Reference
  gatePassCode: string;   // 3-digit verification code for gate security
  timestamp: string;
}

export interface CashierRegisterState {
  cashInDrawer: number;
  transferConfirmed: number;
  recentSales: GateSaleTransaction[];
}

export interface DriverManifestState {
  loadedSachetBags: number;
  loadedBottlePacks: number;
  loadedDispenserJars: number;
  returnedPouches: number;
  returnedEmptyJars: number;
  unreturnedJarDepositsHeld: number;
  shortageAutoDebited: number;
}

const STORAGE_KEYS = {
  SACHET: 'obi_factory_sachet_shift',
  BOTTLING: 'obi_factory_bottling_shift',
  CASHIER: 'obi_factory_cashier_pos',
  DRIVER: 'obi_factory_driver_manifest',
  LAST_SYNC: 'obi_factory_last_sync'
};

export const offlineLedger = {
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  },

  save<T>(key: string, data: T): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
      window.localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());
    } catch (e) {
      console.warn('[OfflineLedger] Storage write failed:', e);
    }
  },

  load<T>(key: string, defaultValue: T): T {
    if (!this.isBrowser()) return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn('[OfflineLedger] Storage read failed:', e);
      return defaultValue;
    }
  },

  // Sachet line helpers
  saveSachetState(state: SachetLineState): void {
    this.save(STORAGE_KEYS.SACHET, state);
  },
  loadSachetState(defaultState: SachetLineState): SachetLineState {
    return this.load(STORAGE_KEYS.SACHET, defaultState);
  },

  // Bottling line helpers
  saveBottlingState(state: BottlingLineState): void {
    this.save(STORAGE_KEYS.BOTTLING, state);
  },
  loadBottlingState(defaultState: BottlingLineState): BottlingLineState {
    return this.load(STORAGE_KEYS.BOTTLING, defaultState);
  },

  // Cashier POS helpers
  saveCashierState(state: CashierRegisterState): void {
    this.save(STORAGE_KEYS.CASHIER, state);
  },
  loadCashierState(defaultState: CashierRegisterState): CashierRegisterState {
    return this.load(STORAGE_KEYS.CASHIER, defaultState);
  },

  // Driver manifest helpers
  saveDriverState(state: DriverManifestState): void {
    this.save(STORAGE_KEYS.DRIVER, state);
  },
  loadDriverState(defaultState: DriverManifestState): DriverManifestState {
    return this.load(STORAGE_KEYS.DRIVER, defaultState);
  },

  // Factory reset (end of day)
  clearShift(): void {
    if (!this.isBrowser()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEYS.SACHET);
      window.localStorage.removeItem(STORAGE_KEYS.BOTTLING);
      window.localStorage.removeItem(STORAGE_KEYS.CASHIER);
      window.localStorage.removeItem(STORAGE_KEYS.DRIVER);
    } catch (e) {
      console.warn('[OfflineLedger] Clear shift failed:', e);
    }
  }
};
