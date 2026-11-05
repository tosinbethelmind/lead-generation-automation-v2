/**
 * @file src/lib/factory/factoryConfig.ts
 * 
 * ⚙️ OBI TABLE WATER OS — DYNAMIC FACTORY VARIABLES & STAFF ROSTER CONFIG
 * 
 * Enables Mr. Obi (Owner / Admin) to dynamically configure:
 * 1. Staff roster (Add new staff, edit names, roles, routes, and PINs).
 * 2. Shift timetable (Morning start, evening close, night shift toggle).
 * 3. Product wholesale pricing (Sachets, 75cl, 50cl, 19L refills).
 * 4. Anti-theft penalty variables (₦4,500 dispenser jar penalty, 18.0g preform scrap).
 * 5. Energy parameters (Diesel price/liter, target cost per bag).
 * 6. Bank accounts and WhatsApp hotlines.
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

export interface StaffMember {
  id: string;
  name: string;
  role: 'owner' | 'supervisor' | 'cashier' | 'driver' | 'loader';
  title: string;
  badge: string;
  pin: string;
  phone?: string;
  route?: string;
  avatarBg: string;
  active: boolean;
  description: string;
}

export interface ShiftConfig {
  shiftName: string;
  morningShiftStart: string; // e.g. "07:00"
  morningShiftClose: string; // e.g. "18:00"
  digestTime: string;        // e.g. "20:00"
  nightShiftEnabled: boolean;
  nightShiftStart?: string;  // e.g. "19:00"
  nightShiftClose?: string;  // e.g. "06:00"
}

export interface PricingConfig {
  sachetBagPrice: number;        // e.g. 350
  sachetRollYieldBags: number;   // e.g. 300
  bottle75clPackPrice: number;   // e.g. 1200
  bottle50clPackPrice: number;   // e.g. 1100
  dispenserRefillPrice: number;  // e.g. 900
  dispenserJarPenalty: number;   // e.g. 4500
  preformWeightGrams: number;    // e.g. 18.0
  dieselPricePerLiter: number;   // e.g. 1350
  maxDieselPerBagTarget: number; // e.g. 12.0
}

export interface PlantInfo {
  plantName: string;
  location: string;
  hotline: string;
  whatsappNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  cacNumber: string;
}

export interface FactoryFullConfig {
  staff: StaffMember[];
  shift: ShiftConfig;
  pricing: PricingConfig;
  plant: PlantInfo;
  updatedAt: string;
}

export const DEFAULT_FACTORY_CONFIG: FactoryFullConfig = {
  staff: [
    {
      id: 'owner',
      name: 'Mr. Obi',
      role: 'owner',
      title: 'Managing Director & Plant Owner',
      badge: '👑 Executive Owner',
      pin: '2026',
      phone: '0802 279 1227',
      avatarBg: 'from-amber-500 to-yellow-600',
      active: true,
      description: 'Audits daily profit across sachet & bottle lines, monitors diesel, and stops driver shortages.'
    },
    {
      id: 'supervisor',
      name: 'Kenneth',
      role: 'supervisor',
      title: 'Dual-Line Production Supervisor',
      badge: '📋 Shift Supervisor',
      pin: '1111',
      phone: '0803 123 4567',
      avatarBg: 'from-blue-600 to-cyan-600',
      active: true,
      description: 'Logs sachet rolls, bottle packaging (50cl/75cl/19L jars), and sends 8:00 PM WhatsApp closing report.'
    },
    {
      id: 'cashier',
      name: 'Blessing',
      role: 'cashier',
      title: 'Gate Sales & Cashier',
      badge: '💰 Gate POS & Cashier',
      pin: '2222',
      phone: '0805 987 6543',
      avatarBg: 'from-emerald-600 to-teal-600',
      active: true,
      description: 'Sells sachet bags, 75cl/50cl bottle packs, dispenser refills, and verifies bank transfers.'
    },
    {
      id: 'driver',
      name: 'Musa (Truck 2)',
      role: 'driver',
      title: 'Route Delivery Driver',
      badge: '🚚 Mixed Delivery Fleet',
      pin: '3333',
      phone: '0807 456 7890',
      route: 'Badore / Ajah Route',
      avatarBg: 'from-purple-600 to-indigo-600',
      active: true,
      description: 'Handles mixed truckloads (sachets + bottle packs + 19L jars) and enforces pouch return rules.'
    }
  ],
  shift: {
    shiftName: 'Standard Day Shift (Batch A)',
    morningShiftStart: '07:00',
    morningShiftClose: '18:00',
    digestTime: '20:00',
    nightShiftEnabled: false,
    nightShiftStart: '19:00',
    nightShiftClose: '06:00'
  },
  pricing: {
    sachetBagPrice: 350,
    sachetRollYieldBags: 300,
    bottle75clPackPrice: 1200,
    bottle50clPackPrice: 1100,
    dispenserRefillPrice: 900,
    dispenserJarPenalty: 4500,
    preformWeightGrams: 18.0,
    dieselPricePerLiter: 1350,
    maxDieselPerBagTarget: 12.0
  },
  plant: {
    plantName: 'Obi Table & Bottled Water Plant',
    location: 'Lekki-Epe Expressway, Lagos State, Nigeria',
    hotline: '0802 279 1227',
    whatsappNumber: '2348022791227',
    bankName: 'Moniepoint Microfinance Bank',
    accountNumber: '6805375225',
    accountName: 'Bethelmind Digital Solutions',
    cacNumber: 'Reg: 9912717'
  },
  updatedAt: new Date().toISOString()
};

const STORAGE_KEY = 'obi_factory_full_config';

export const factoryConfigManager = {
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  },

  load(): FactoryFullConfig {
    if (!this.isBrowser()) return DEFAULT_FACTORY_CONFIG;
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (!item) return DEFAULT_FACTORY_CONFIG;
      const parsed = JSON.parse(item);
      return {
        ...DEFAULT_FACTORY_CONFIG,
        ...parsed,
        staff: parsed.staff && parsed.staff.length > 0 ? parsed.staff : DEFAULT_FACTORY_CONFIG.staff,
        shift: { ...DEFAULT_FACTORY_CONFIG.shift, ...(parsed.shift || {}) },
        pricing: { ...DEFAULT_FACTORY_CONFIG.pricing, ...(parsed.pricing || {}) },
        plant: { ...DEFAULT_FACTORY_CONFIG.plant, ...(parsed.plant || {}) }
      };
    } catch (e) {
      console.warn('[factoryConfigManager] Read failed, returning default:', e);
      return DEFAULT_FACTORY_CONFIG;
    }
  },

  save(config: FactoryFullConfig): void {
    if (!this.isBrowser()) return;
    try {
      config.updatedAt = new Date().toISOString();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('[factoryConfigManager] Write failed:', e);
    }
  },

  reset(): FactoryFullConfig {
    if (this.isBrowser()) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn('[factoryConfigManager] Reset failed:', e);
      }
    }
    return DEFAULT_FACTORY_CONFIG;
  }
};
