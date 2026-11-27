import fs from 'fs';
import path from 'path';
import {
  FoodOrder,
  FoodProduct,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
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
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: true,
  },
  {
    id: 'samosa',
    name: 'Samosa',
    category: 'small_chops',
    description:
      'Crispy golden triangular pastries stuffed with spiced minced meat and vegetables.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'spring-rolls',
    name: 'Spring Rolls',
    category: 'small_chops',
    description:
      'Light, crunchy hand-rolled pastry filled with seasoned shredded vegetables.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'egg-rolls',
    name: 'Egg Rolls',
    category: 'small_chops',
    description:
      'Soft, golden-fried dough wrapped around a whole seasoned boiled egg.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'meat-pie',
    name: 'Meat Pie',
    category: 'small_chops',
    description:
      'Flaky buttery pastry filled with richly seasoned minced beef, potatoes, and carrots.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'puff-puff',
    name: 'Puff-Puff',
    category: 'small_chops',
    description:
      'Warm, fluffy, golden Nigerian sweet dough balls fried to perfection.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'buns',
    name: 'Buns',
    category: 'small_chops',
    description:
      'Crunchy on the outside, soft on the inside Nigerian fried buns.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
  {
    id: 'large-meat-pie',
    name: 'Large Meat Pie',
    category: 'small_chops',
    description:
      'Extra-generous bakery-size meat pie loaded with savoury minced beef filling.',
    image: '/foods/hero-feast.jpg',
    unitType: 'pack',
    pricePerUnit: null,
    minQuantity: 1,
    enabled: true,
    supportsProteins: false,
  },
];

export const DEFAULT_PROTEINS: ProteinOption[] = [
  { id: 'chicken', name: 'Chicken', price: null, enabled: true },
  { id: 'beef', name: 'Beef', price: null, enabled: true },
  { id: 'goat-meat', name: 'Goat Meat', price: null, enabled: true },
  { id: 'fish', name: 'Fish', price: null, enabled: true },
  { id: 'prawns-shrimps', name: 'Prawns/Shrimps', price: null, enabled: true },
  { id: 'turkey', name: 'Turkey', price: null, enabled: true },
  { id: 'snails', name: 'Snails', price: null, enabled: true },
  { id: 'crayfish', name: 'Crayfish', price: null, enabled: true },
  { id: 'eggs', name: 'Eggs', price: null, enabled: true },
];

export const DEFAULT_SETTINGS: FoodsSettings = {
  businessName: 'BETHELMIND FOODS & CATERING SERVICES',
  tagline: 'Taste the Real Nigerian Flavour!',
  location: 'Around Infinity Motel, Ishasi, Denro-Ishasi Road, Ogun State, Nigeria',
  primaryWhatsapp: '09026138101',
  secondaryWhatsapp: '08132370283',
  facebookHandle: '@bethelmindfoods',
  deliveryLeadTimeHours: 7,
  deliveryAvailability:
    'Freshly prepared to order across Ishasi, Denro-Ishasi, Akute, Ojodu Berger, Ikeja, and surrounding Lagos/Ogun areas.',
  deliveryFee: null,
  deliveryConfirmationNote:
    'Your order is confirmed directly via WhatsApp. Delivery fee (if not fixed above) and exact dispatch rider timing are confirmed with you before preparation begins.',
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
    return {
      products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : DEFAULT_PRODUCTS,
      proteins: Array.isArray(parsed.proteins) && parsed.proteins.length > 0 ? parsed.proteins : DEFAULT_PROTEINS,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
        tracking: {
          ...DEFAULT_SETTINGS.tracking,
          ...(parsed.settings?.tracking || {}),
        },
        testimonials: Array.isArray(parsed.settings?.testimonials)
          ? parsed.settings!.testimonials
          : [],
      },
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    const fallback = getDefaultStore();
    return fallback;
  }
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
