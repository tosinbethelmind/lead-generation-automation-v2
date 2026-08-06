/**
 * @file featureCustomizer.ts
 * Modular À La Carte Feature Customizer & OPay Custom Subscription Engine
 * Allows already-claimed websites and new clients to pick & choose selective features.
 */

import { getOpayBankTransferDetails } from './subscriptionManager';

export interface ModularFeature {
  id: string;
  name: string;
  category: 'lead_gen' | 'ai_care' | 'voice' | 'payment';
  setupPriceNGN: number;
  monthlyRenewalNGN: number;
  description: string;
  icon: string;
}

export const MODULAR_FEATURES_CATALOG: ModularFeature[] = [
  {
    id: 'feature_lead_harvester',
    name: '10K Lagos B2B Lead Harvester Engine',
    category: 'lead_gen',
    setupPriceNGN: 60000,
    monthlyRenewalNGN: 20000,
    description: 'Extracts 10,000+ verified Lagos B2B business leads across 27 districts & 60 categories.',
    icon: '🎯',
  },
  {
    id: 'feature_whatsapp_voice_notes',
    name: 'Nigerian Accent WhatsApp Voice Notes',
    category: 'voice',
    setupPriceNGN: 35000,
    monthlyRenewalNGN: 10000,
    description: 'Auto-dispatches natural en-NG Nigerian voice notes to incoming WhatsApp inquiries.',
    icon: '🎙️',
  },
  {
    id: 'feature_customer_ai_agent',
    name: '24/7 Customer AI Care Agent & Knowledge Base',
    category: 'ai_care',
    setupPriceNGN: 50000,
    monthlyRenewalNGN: 15000,
    description: 'Human-level AI consultant trained on your business pricing, location, and FAQs.',
    icon: '🤖',
  },
  {
    id: 'feature_ai_voice_caller',
    name: 'Outbound / Inbound AI Voice Calling Agent',
    category: 'voice',
    setupPriceNGN: 90000,
    monthlyRenewalNGN: 25000,
    description: 'Places natural AI phone calls to qualify high-ticket B2B leads (100 Mins included).',
    icon: '📞',
  },
  {
    id: 'feature_opay_dva_box',
    name: 'Moniepoint / OPay Virtual Account Transfer Box',
    category: 'payment',
    setupPriceNGN: 25000,
    monthlyRenewalNGN: 5000,
    description: 'Displays dedicated bank transfer details with 1-second instant receipt verification.',
    icon: '🏦',
  },
  {
    id: 'feature_recruitment_engine',
    name: '⚡ 24-Hour Instant AI Recruitment & Talent Engine',
    category: 'ai_care',
    setupPriceNGN: 95000,
    monthlyRenewalNGN: 25000,
    description: 'Instant job advertising, WhatsApp audio voice note screening, 1-ms AI CV grading (0-100%), Google X-Ray search, and 24-hour candidate hiring.',
    icon: '⚡',
  },
];

/** Calculates total setup fee, monthly renewal, and bundle discounts */
export function calculateCustomFeatureSelection(selectedIds: string[]): {
  selectedFeatures: ModularFeature[];
  totalSetupNGN: number;
  totalMonthlyNGN: number;
  discountAppliedPercentage: number;
  finalSetupNGN: number;
  finalMonthlyNGN: number;
} {
  const selectedFeatures = MODULAR_FEATURES_CATALOG.filter(f => selectedIds.includes(f.id));

  let totalSetupNGN = 0;
  let totalMonthlyNGN = 0;

  selectedFeatures.forEach(f => {
    totalSetupNGN += f.setupPriceNGN;
    totalMonthlyNGN += f.monthlyRenewalNGN;
  });

  // Apply 15% Bundle Discount if 3 or more features are selected
  let discountAppliedPercentage = 0;
  if (selectedFeatures.length >= 3) {
    discountAppliedPercentage = 15;
  }

  const discountMultiplier = (100 - discountAppliedPercentage) / 100;
  const finalSetupNGN = Math.ceil(totalSetupNGN * discountMultiplier);
  const finalMonthlyNGN = Math.ceil(totalMonthlyNGN * discountMultiplier);

  return {
    selectedFeatures,
    totalSetupNGN,
    totalMonthlyNGN,
    discountAppliedPercentage,
    finalSetupNGN,
    finalMonthlyNGN,
  };
}

/** Formats a clean WhatsApp Custom Feature Approval Request message */
export function formatCustomFeatureWhatsAppRequest(params: {
  businessName: string;
  leadId?: string;
  selectedIds: string[];
  clientPhone: string;
}): {
  messageText: string;
  waUrl: string;
  calculation: ReturnType<typeof calculateCustomFeatureSelection>;
} {
  const { businessName, leadId = 'site_custom', selectedIds, clientPhone } = params;
  const calc = calculateCustomFeatureSelection(selectedIds);
  const opay = getOpayBankTransferDetails();

  const featureNames = calc.selectedFeatures.map(f => `${f.icon} ${f.name}`).join('\n');

  const messageText = `🛒 *CUSTOM FEATURE SELECTION REQUEST* 🛒\n\n` +
    `*Business:* ${businessName}\n` +
    `*Phone:* ${clientPhone}\n\n` +
    `*Selected Modular Features:*\n${featureNames}\n\n` +
    `💰 *One-Time Setup:* ₦${calc.finalSetupNGN.toLocaleString()}\n` +
    `🔄 *Monthly Renewal:* ₦${calc.finalMonthlyNGN.toLocaleString()}/mo\n` +
    (calc.discountAppliedPercentage > 0 ? `🎉 *15% Bundle Discount Applied!*\n\n` : `\n`) +
    `🏦 *OPay Payment Instructions:*\n` +
    `Transfer ₦${calc.finalSetupNGN.toLocaleString()} to:\n` +
    `• Bank: ${opay.bankName}\n` +
    `• Account: *${opay.accountNumber}*\n` +
    `• Name: ${opay.accountName}\n\n` +
    `Please approve and activate my custom selected features!`;

  const cleanAdminPhone = (process.env.NEXT_PUBLIC_ADMIN_PHONE || '2348012345678').replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(messageText)}`;

  return {
    messageText,
    waUrl,
    calculation: calc,
  };
}
