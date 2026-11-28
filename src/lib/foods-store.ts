import fs from 'fs';
import path from 'path';
import {
  DeliveryZoneConfig,
  FoodOrder,
  FoodProduct,
  FoodsAuditEntry,
  FoodsSettings,
  FoodsStoreData,
  ProteinOption,
} from './foods-types';

const BUNDLED_STORE_PATH = path.join(process.cwd(), 'local_db', 'foods_store.json');
const RUNTIME_STORE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'foods_store.json')
  : BUNDLED_STORE_PATH;

export const DEFAULT_PRODUCTS: FoodProduct[] = [
  {
    id: 'jollof-rice-chicken',
    name: 'Jollof Rice & Chicken',
    category: 'rice',
    description:
      'Smoky party-style Nigerian Jollof rice cooked in rich tomato-pepper base, served with spiced golden chicken.',
    image: '/foods/hero-feast.jpg',
    unitType: 'litre',
    pricePerUnit: 8500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'fried-rice-chicken',
    name: 'Fried Rice & Chicken',
    category: 'rice',
    description:
      'Fragrant Nigerian fried rice tossed with fresh vegetables, sweet corn, and tender seasoned chicken.',
    image: '/foods/hero-feast.jpg',
    unitType: 'litre',
    pricePerUnit: 9000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    category: 'soup',
    description:
      'Rich melon seed soup slow-simmered with ugwu greens, palm oil, crayfish, and your choice of proteins.',
    image: '/foods/egusi-soup.jpg',
    unitType: 'litre',
    pricePerUnit: 9500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'ogbono-soup',
    name: 'Ogbono Soup',
    category: 'soup',
    description:
      'Authentic silky Ogbono draw soup seasoned with traditional spices, leafy greens, and rich stock.',
    image: '/foods/egusi-soup.jpg',
    unitType: 'litre',
    pricePerUnit: 9500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'afang-soup',
    name: 'Afang Soup',
    category: 'soup',
    description:
      'Hearty Efik-Ibibio delicacy packed with finely shredded okazi leaves, waterleaf, and rich palm oil.',
    image: '/foods/afang-soup.jpg',
    unitType: 'litre',
    pricePerUnit: 11000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'edikangikong-soup',
    name: 'Edikangikong Soup',
    category: 'soup',
    description:
      'Nutritious double-vegetable soup made with fresh ugwu and waterleaf, bursting with authentic flavour.',
    image: '/foods/afang-soup.jpg',
    unitType: 'litre',
    pricePerUnit: 11500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'assorted-meat-soup',
    name: 'Assorted Meat Soup',
    category: 'soup',
    description:
      'Generous medley of slow-cooked beef, shaki, cow foot, and assorted cuts in a deeply flavoured broth.',
    image: '/foods/egusi-soup.jpg',
    unitType: 'litre',
    pricePerUnit: 12000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'samosa',
    name: 'Samosa (Pack of 10)',
    category: 'small_chops',
    description:
      'Crispy golden triangular pastries stuffed with spiced minced meat and vegetables.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 3500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'spring-rolls',
    name: 'Spring Rolls (Pack of 10)',
    category: 'small_chops',
    description:
      'Light, crunchy hand-rolled pastry filled with seasoned shredded vegetables.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 3500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'egg-rolls',
    name: 'Egg Rolls (Pack of 5)',
    category: 'small_chops',
    description:
      'Soft, golden-fried dough wrapped around a whole seasoned boiled egg.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 4000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'meat-pie',
    name: 'Meat Pie (Pack of 5)',
    category: 'small_chops',
    description:
      'Flaky buttery pastry filled with richly seasoned minced beef, potatoes, and carrots.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 4500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'puff-puff',
    name: 'Puff-Puff (Pack of 20)',
    category: 'small_chops',
    description:
      'Warm, fluffy, golden Nigerian sweet dough balls fried to perfection.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 2500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'buns',
    name: 'Buns (Pack of 15)',
    category: 'small_chops',
    description:
      'Crunchy on the outside, soft on the inside Nigerian fried buns.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 2500,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'large-meat-pie',
    name: 'Large Meat Pie (Pack of 5)',
    category: 'small_chops',
    description:
      'Extra-generous bakery-size meat pie loaded with savoury minced beef filling.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 6000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'family-meal-bundle',
    name: 'Family Meal Bundle (2L Soup + 2L Jollof + Chicken)',
    category: 'bundle',
    description:
      'Complete family pot bundle: 2 Litres of Egusi or Ogbono soup + 2 Litres of Party Jollof Rice with Chicken.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 32000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'weekend-meal-bundle',
    name: 'Weekend Home Pot Bundle (2L Egusi + 2L Afang + Beef)',
    category: 'bundle',
    description:
      'Stock your freezer for the week: 2 Litres Egusi Soup + 2 Litres Afang Soup slow-cooked with seasoned beef.',
    image: '/foods/afang-soup.jpg',
    unitType: 'pack',
    pricePerUnit: 38000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'bulk-catering-bundle',
    name: 'Bulk Event Catering Pack (10L Jollof/Fried + 40 Small Chops)',
    category: 'bundle',
    description:
      'Ideal for office lunches, housewarmings, and family celebrations: 10 Litres rice + 40 assorted small chops.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: 82000,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
];

export const DEFAULT_PROTEINS: ProteinOption[] = [
  { id: 'chicken', name: 'Chicken', price: 2500, enabled: true },
  { id: 'beef', name: 'Beef', price: 2000, enabled: true },
  { id: 'assorted-meat', name: 'Assorted Meat', price: 3000, enabled: true },
  { id: 'goat-meat', name: 'Goat Meat', price: 3500, enabled: true },
  { id: 'fish', name: 'Fish', price: 3000, enabled: true },
  { id: 'stockfish', name: 'Stockfish', price: 3500, enabled: true },
  { id: 'prawns-shrimps', name: 'Prawns/Shrimps', price: 4500, enabled: true },
  { id: 'turkey', name: 'Turkey', price: 3500, enabled: true },
  { id: 'snails', name: 'Snails', price: 4500, enabled: true },
  { id: 'crayfish', name: 'Crayfish', price: 1500, enabled: true },
  { id: 'eggs', name: 'Eggs', price: 1000, enabled: true },
];

export const DEFAULT_DELIVERY_ZONES: DeliveryZoneConfig[] = [
  { id: 'pickup', name: 'Self-Pickup (Denro-Ishasi Kitchen)', feeNgn: 0, isFreePromo: false, requiresConfirmation: false, estimatedWindow: 'Ready at scheduled time', enabled: true },
  { id: 'ishasi-akute', name: 'Ishasi / Denro-Ishasi / Akute', feeNgn: 1500, isFreePromo: false, requiresConfirmation: false, estimatedWindow: '30–60 mins dispatch', enabled: true },
  { id: 'berger-ikeja', name: 'Ojodu Berger / Ikeja / Ogba / Magodo', feeNgn: 2500, isFreePromo: false, requiresConfirmation: false, estimatedWindow: '45–90 mins dispatch', enabled: true },
  { id: 'mainland-central', name: 'Surulere / Yaba / Gbagada / Maryland', feeNgn: 3500, isFreePromo: false, requiresConfirmation: false, estimatedWindow: '60–120 mins dispatch', enabled: true },
  { id: 'island', name: 'Victoria Island / Ikoyi / Lekki / Ajah', feeNgn: 5000, isFreePromo: false, requiresConfirmation: false, estimatedWindow: '90–150 mins dispatch', enabled: true },
  { id: 'outside-coverage', name: 'Outside Normal Coverage (Confirm Location)', feeNgn: null, isFreePromo: false, requiresConfirmation: true, estimatedWindow: 'Confirmed by dispatch desk', enabled: true },
];

export const DEFAULT_SETTINGS: FoodsSettings = {
  businessName: 'BETHELMIND FOODS & CATERING SERVICES',
  tagline: 'Taste the Real Nigerian Flavour!',
  location: 'Around Infinity Motel, Ishasi, Denro-Ishasi Road, Ogun State, Nigeria',
  primaryWhatsapp: '09026138101',
  secondaryWhatsapp: '08132370283',
  facebookHandle: '@bethelmindfoods',
  deliveryLeadTimeHours: 24,
  deliveryAvailability:
    'Freshly sourced and slow-cooked to order across Ishasi, Denro-Ishasi, Akute, Ojodu Berger, Ikeja, and Lagos/Ogun.',
  deliveryFee: 2500,
  deliveryConfirmationNote:
    'Every pot is freshly sourced from the morning market and cooked to order (24-hour preparation guarantees zero frozen leftovers). Select your delivery zone above to see your complete cost before ordering.',
  minimumOrderValueNgn: 50000,
  minimumSoupLitres: 3,
  deliveryZones: DEFAULT_DELIVERY_ZONES,
  tracking: {
    gtmContainerId: process.env.NEXT_PUBLIC_FOODS_GTM_CONTAINER_ID || '',
    ga4MeasurementId: process.env.NEXT_PUBLIC_FOODS_GA4_MEASUREMENT_ID || '',
    googleAdsId: process.env.NEXT_PUBLIC_FOODS_GOOGLE_ADS_ID || 'AW-18553825002',
    googleAdsConversionLabel: process.env.NEXT_PUBLIC_FOODS_GOOGLE_ADS_CONVERSION_LABEL || '',
  },
  testimonials: [],
};

function getDefaultStore(): FoodsStoreData {
  return {
    products: DEFAULT_PRODUCTS,
    proteins: DEFAULT_PROTEINS,
    settings: DEFAULT_SETTINGS,
    orders: [],
    auditLog: [],
  };
}

function ensureStoreDir(targetPath: string) {
  const dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readFoodsStore(): FoodsStoreData {
  try {
    const readPath = fs.existsSync(RUNTIME_STORE_PATH)
      ? RUNTIME_STORE_PATH
      : fs.existsSync(BUNDLED_STORE_PATH)
      ? BUNDLED_STORE_PATH
      : null;

    if (!readPath) {
      const initial = getDefaultStore();
      writeFoodsStore(initial);
      return initial;
    }
    const raw = fs.readFileSync(readPath, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<FoodsStoreData>;
    const rawProducts = Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : DEFAULT_PRODUCTS;
    const mergedProducts = rawProducts.map((p) => {
      const def = DEFAULT_PRODUCTS.find((d) => d.id === p.id);
      return {
        ...p,
        name: def && p.pricePerUnit === null ? def.name : p.name,
        pricePerUnit: p.pricePerUnit === null && def ? def.pricePerUnit : p.pricePerUnit,
      };
    });
    for (const def of DEFAULT_PRODUCTS) {
      if (!mergedProducts.some((p) => p.id === def.id)) {
        mergedProducts.push(def);
      }
    }

    const rawProteins = Array.isArray(parsed.proteins) && parsed.proteins.length > 0 ? parsed.proteins : DEFAULT_PROTEINS;
    const mergedProteins = rawProteins.map((pr) => {
      const def = DEFAULT_PROTEINS.find((d) => d.id === pr.id);
      return {
        ...pr,
        price: pr.price === null && def ? def.price : pr.price,
      };
    });
    for (const def of DEFAULT_PROTEINS) {
      if (!mergedProteins.some((pr) => pr.id === def.id)) {
        mergedProteins.push(def);
      }
    }

    const deliveryZones =
      Array.isArray(parsed.settings?.deliveryZones) && parsed.settings!.deliveryZones!.length > 0
        ? parsed.settings!.deliveryZones!
        : DEFAULT_DELIVERY_ZONES;

    return {
      products: mergedProducts,
      proteins: mergedProteins,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
        deliveryFee: parsed.settings?.deliveryFee ?? DEFAULT_SETTINGS.deliveryFee,
        minimumOrderValueNgn: Math.max(50000, Number(parsed.settings?.minimumOrderValueNgn) || 50000),
        minimumSoupLitres: Math.max(3, Number(parsed.settings?.minimumSoupLitres) || 3),
        deliveryZones,
        tracking: {
          ...DEFAULT_SETTINGS.tracking,
          ...(parsed.settings?.tracking || {}),
        },
        testimonials: Array.isArray(parsed.settings?.testimonials)
          ? parsed.settings!.testimonials
          : [],
      },
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : [],
    };
  } catch {
    return getDefaultStore();
  }
}

export function sanitizeFoodsStoreForPublic(store: FoodsStoreData) {
  return {
    products: store.products.map(({ costBreakdown: _internal, ...publicProduct }) => publicProduct),
    proteins: store.proteins,
    settings: store.settings,
  };
}

export function writeFoodsStore(data: FoodsStoreData): void {
  ensureStoreDir(RUNTIME_STORE_PATH);
  const tmpPath = `${RUNTIME_STORE_PATH}.tmp-${Date.now()}`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpPath, RUNTIME_STORE_PATH);
}

export function appendFoodOrder(order: FoodOrder): FoodOrder {
  const store = readFoodsStore();
  store.orders.unshift(order);
  if (store.orders.length > 500) {
    store.orders = store.orders.slice(0, 500);
  }
  writeFoodsStore(store);
  return order;
}

export function appendFoodsAuditEntries(entries: Array<Omit<FoodsAuditEntry, 'id' | 'timestamp'>>): void {
  if (entries.length === 0) return;
  const store = readFoodsStore();
  const now = new Date().toISOString();
  const existing = store.auditLog || [];
  const added: FoodsAuditEntry[] = entries.map((e, idx) => ({
    ...e,
    id: `AUD-${Date.now()}-${idx}`,
    timestamp: now,
  }));
  store.auditLog = [...added, ...existing].slice(0, 500);
  writeFoodsStore(store);
}
