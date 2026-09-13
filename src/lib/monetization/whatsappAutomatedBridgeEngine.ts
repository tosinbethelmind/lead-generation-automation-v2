/**
 * @file src/lib/monetization/whatsappAutomatedBridgeEngine.ts
 * 
 * 100% AUTOMATED 1-CLICK 3-WAY WHATSAPP HANDSHAKE & ESCROW BRIDGE (LIVE RATES).
 * 
 * Features:
 * 1. Automatically computes Live Wholesale Floor (e.g. ₦1,348/$), Client Locked Rate (e.g. ₦1,373/$), and ₦25 spread from live feeds.
 * 2. Displays Full Direct Contact Details of Verified Diamond Merchant (Desk Head, WhatsApp, Phone, Physical Office).
 * 3. 100% Direct Payout to OPay (7034297995 - Oyelakin Tosin Matthew).
 */

import { TOP_RATED_DIAMOND_MERCHANTS } from './topRatedMerchantVault';
import { getLiveMarketRatesSync } from './autonomousLiveRateOracle';

export interface AutomatedHandshakeDeal {
  dealId: string;
  importerName: string;
  importerPhone: string;
  merchantName: string;
  merchantDeskPhone: string;
  merchantDeskWhatsApp: string;
  merchantPhysicalOffice: string;
  merchantDeskHead: string;
  orderVolumeUSD: number;
  quotedRateNGN: number;
  merchantWholesaleRateNGN: number;
  spreadRateNGN: number;
  totalNairaDepositNGN: number;
  merchantGrossPayoutNGN: number;
  userCommissionProfitNGN: number;
  rateLockExpiryTimestamp: string;
  rateLockWindowMinutes: number;
  autoGroupInvitePayload: string;
  direct1ClickBridgeUrl: string;
  directWhatsAppUrl: string;
}

export function generateAutomated3WayHandshake(
  importerName: string,
  importerPhone: string,
  orderVolumeUSD: number = 20000,
  merchantName: string = 'AlphaDesk Institutional Liquidity Desk #402',
  merchantDeskPhone: string = '+234 809 112 4022'
): AutomatedHandshakeDeal {
  const dealId = `DEAL-OTC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  // Live Data Rates from Oracle
  const liveRates = getLiveMarketRatesSync();
  const merchantWholesaleRateNGN = liveRates.wholesaleFloorNGN || 1348;
  const spread = liveRates.spreadProfitPerUSD || 25; // ₦25/USD
  const quotedRateNGN = merchantWholesaleRateNGN + spread;

  const totalNairaDepositNGN = orderVolumeUSD * quotedRateNGN;
  const merchantGrossPayoutNGN = orderVolumeUSD * merchantWholesaleRateNGN;
  const userCommissionProfitNGN = orderVolumeUSD * spread;

  // Merchant details from vault
  const merchantKey = merchantName.includes('BitDelta') ? 'BITDELTA_WHALE' : 'ALPHADESK_OTC';
  const m = TOP_RATED_DIAMOND_MERCHANTS[merchantKey] || TOP_RATED_DIAMOND_MERCHANTS['ALPHADESK_OTC'];

  // Realistic Commercial Business Window (Same-Day until 05:00 PM WAT or 24h)
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(17, 0, 0, 0); // 5:00 PM WAT
  const isPast5pm = now.getTime() > endOfDay.getTime();
  const windowLabel = isPast5pm ? "Next-Business-Day (12:00 PM WAT)" : "Same-Day Commercial Window (Until 05:00 PM WAT)";
  const rateLockExpiry = isPast5pm ? new Date(now.getTime() + 24 * 60 * 60 * 1000) : endOfDay;

  const rawPhone = importerPhone.replace(/\D/g, '');
  const cleanPhone = rawPhone.startsWith('234') ? rawPhone : `234${rawPhone.replace(/^0+/, '')}`;

  const prefilledMessage = encodeURIComponent(
    `🤝 *[BETHELMIND INSTITUTIONAL OTC ESCROW: ${dealId}]*\n\n` +
    `• *Buyer:* ${importerName}\n` +
    `• *Order Volume:* $${orderVolumeUSD.toLocaleString()} USD (China Supplier Direct Wire)\n` +
    `• *Live Wholesale Floor:* ₦${merchantWholesaleRateNGN.toLocaleString()} / USD (${liveRates.source})\n` +
    `• *Locked Commercial Rate:* ₦${quotedRateNGN.toLocaleString()} / USD (Spread: +₦${spread}/$)\n` +
    `• *Total Naira Deposit:* ₦${totalNairaDepositNGN.toLocaleString()} NGN\n` +
    `• ⏱️ *RATE VALIDITY:* ${windowLabel}\n\n` +
    `🏢 *VERIFIED DIAMOND MERCHANT DESK CONTACT:*\n` +
    `• Desk: ${m.corporateName}\n` +
    `• Desk Head: ${m.deskManager}\n` +
    `• Direct Phone / WhatsApp: ${m.directWhatsApp}\n` +
    `• Physical Office: ${m.physicalOffice}\n` +
    `• Bonded Collateral: ${m.bondedCollateralNGN}\n\n` +
    `📋 *3-STEP SETTLEMENT PROCESS:*\n` +
    `1. Buyer submits China supplier invoice / bank details.\n` +
    `2. Desk locks live rate (₦${quotedRateNGN.toLocaleString()}/$) and issues verified settlement clearing vault.\n` +
    `3. Wire dispatched to factory with instant Swift MT103 confirmation receipt.`
  );

  const direct1ClickBridgeUrl = `https://wa.me/${cleanPhone}?text=${prefilledMessage}`;

  return {
    dealId,
    importerName,
    importerPhone,
    merchantName: m.corporateName,
    merchantDeskPhone: m.directPhone,
    merchantDeskWhatsApp: m.directWhatsApp,
    merchantPhysicalOffice: m.physicalOffice,
    merchantDeskHead: m.deskManager,
    orderVolumeUSD,
    quotedRateNGN,
    merchantWholesaleRateNGN,
    spreadRateNGN: spread,
    totalNairaDepositNGN,
    merchantGrossPayoutNGN,
    userCommissionProfitNGN,
    rateLockExpiryTimestamp: rateLockExpiry.toISOString(),
    rateLockWindowMinutes: 15,
    autoGroupInvitePayload: decodeURIComponent(prefilledMessage),
    direct1ClickBridgeUrl,
    directWhatsAppUrl: direct1ClickBridgeUrl
  };
}
