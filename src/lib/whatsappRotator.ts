/**
 * src/lib/whatsappRotator.ts
 * 
 * Mode A: Dual-Line WhatsApp Outreach Rotator & Failover Manager
 * Spreads outbound lead messages and voice notes evenly across 2 WhatsApp lines
 * to maximize sending volume, prevent rate-limiting, and provide automatic failover.
 */

export interface WhatsAppNumberConfig {
  adminPhone: string;          // Primary phone that receives alerts & controls approvals
  outreachPhone1: string;      // Customer-Facing Outreach Line 1
  outreachPhone2: string;      // Customer-Facing Outreach Line 2
}

let rotationIndex = 0;

/**
 * Returns active WhatsApp config from env or fallback
 */
export function getWhatsAppNumberConfig(): WhatsAppNumberConfig {
  return {
    adminPhone: process.env.ADMIN_WA_PHONE || '2348022791227',
    outreachPhone1: process.env.OUTREACH_WA_PHONE_1 || '2347026266946',
    outreachPhone2: process.env.OUTREACH_WA_PHONE_2 || '2349046050469',
  };
}

/**
 * Gets the next rotated outreach line (Alternates Line 1 <-> Line 2)
 */
export function getNextRotatedOutreachLine(): { phone: string; lineId: 'LINE_1' | 'LINE_2' } {
  const config = getWhatsAppNumberConfig();
  rotationIndex++;
  
  if (rotationIndex % 2 === 1) {
    return { phone: config.outreachPhone1, lineId: 'LINE_1' };
  } else {
    return { phone: config.outreachPhone2, lineId: 'LINE_2' };
  }
}

/**
 * Formats any phone number into clean E.164 digits without symbols (e.g. 08012345678 -> 2348012345678)
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.substring(1);
  }
  return cleaned;
}
