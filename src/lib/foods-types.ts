export type FoodCategory = 'rice' | 'soup' | 'small_chops' | 'bundle';

export type FoodUnitType = 'litre' | 'serving' | 'pack' | 'portion' | 'tray';

export type OrderStatus =
  | 'Pending'
  | 'Awaiting Payment'
  | 'Paid'
  | 'Preparing'
  | 'Ready'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled'
  | 'New Order'
  | 'Awaiting Confirmation'
  | 'Confirmed'
  | 'Ready for Delivery';

export const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Awaiting Payment',
  'Paid',
  'Preparing',
  'Ready',
  'Dispatched',
  'Delivered',
  'Cancelled',
];

export interface ProductCostBreakdown {
  ingredientCost: number;
  proteinCost: number;
  packagingCost: number;
  prepCost: number;
}

export interface FoodProduct {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  image: string;
  unitType: FoodUnitType;
  pricePerUnit: number | null;
  promoPrice?: number | null;
  minQuantity: number;
  enabled: boolean;
  supportsProteins: boolean;
  /** Internal only — stripped before sending to public storefront */
  costBreakdown?: ProductCostBreakdown;
}

export interface ProteinOption {
  id: string;
  name: string;
  price: number | null;
  enabled: boolean;
}

export interface DeliveryZoneConfig {
  id: string;
  name: string;
  feeNgn: number | null;
  isFreePromo?: boolean;
  requiresConfirmation?: boolean;
  estimatedWindow?: string;
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
  minimumOrderValueNgn: number;
  minimumSoupLitres: number;
  deliveryZones: DeliveryZoneConfig[];
  tracking: TrackingConfig;
  testimonials: GenuineTestimonial[];
}

export interface OrderItemInput {
  productId: string;
  productName: string;
  category: FoodCategory;
  unitType: FoodUnitType;
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
  deliveryZoneId?: string;
  deliveryZoneName?: string;
  deliveryConfirmed: boolean;
  deliveryDate: string;
  deliveryTime: string;
  additionalInstructions: string;
  items: OrderItemInput[];
  subtotal: number | null;
  deliveryFee: number | null;
  totalPayable: number | null;
  hasUnpricedItems: boolean;
  estimatedCostNgn?: number;
  estimatedProfitNgn?: number;
  attribution: AttributionData;
  whatsappOpened: boolean;
}

export interface FoodsAuditEntry {
  id: string;
  timestamp: string;
  action: 'product_price_change' | 'protein_price_change' | 'delivery_zone_change' | 'order_delivery_change';
  entityName: string;
  previousValue: string;
  newValue: string;
}

export interface FoodsStoreData {
  products: FoodProduct[];
  proteins: ProteinOption[];
  settings: FoodsSettings;
  orders: FoodOrder[];
  auditLog?: FoodsAuditEntry[];
}
