export type FoodCategory = 'rice' | 'soup' | 'small_chops' | 'bundle';

export type OrderStatus =
  | 'New Order'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'Preparing'
  | 'Ready for Delivery'
  | 'Delivered'
  | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'New Order',
  'Awaiting Confirmation',
  'Confirmed',
  'Preparing',
  'Ready for Delivery',
  'Delivered',
  'Cancelled',
];

export interface FoodProduct {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  image: string;
  unitType: 'litre' | 'serving' | 'pack';
  pricePerUnit: number | null;
  minQuantity: number;
  enabled: boolean;
  supportsProteins: boolean;
}

export interface ProteinOption {
  id: string;
  name: string;
  price: number | null;
  enabled: boolean;
}

export interface TrackingConfig {
  gtmContainerId: string;
  ga4MeasurementId: string;
  googleAdsId: string;
  googleAdsConversionLabel: string;
}

export interface GenuineTestimonial {
  id: string;
  customerName: string;
  location: string;
  quote: string;
  date: string;
}

export interface FoodsSettings {
  businessName: string;
  tagline: string;
  location: string;
  primaryWhatsapp: string;
  secondaryWhatsapp: string;
  facebookHandle: string;
  deliveryLeadTimeHours: number;
  deliveryAvailability: string;
  deliveryFee: number | null;
  deliveryConfirmationNote: string;
  tracking: TrackingConfig;
  testimonials: GenuineTestimonial[];
}

export interface OrderItemInput {
  productId: string;
  productName: string;
  category: FoodCategory;
  unitType: 'litre' | 'serving' | 'pack';
  quantity: number;
  unitPrice: number | null;
  lineTotal: number | null;
  proteins: Array<{
    id: string;
    name: string;
    price: number | null;
  }>;
}

export interface AttributionData {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingUrl?: string;
}

export interface FoodOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentVerified: boolean;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  additionalInstructions: string;
  items: OrderItemInput[];
  subtotal: number | null;
  deliveryFee: number | null;
  totalPayable: number | null;
  hasUnpricedItems: boolean;
  attribution: AttributionData;
  whatsappOpened: boolean;
}

export interface FoodsStoreData {
  products: FoodProduct[];
  proteins: ProteinOption[];
  settings: FoodsSettings;
  orders: FoodOrder[];
}
