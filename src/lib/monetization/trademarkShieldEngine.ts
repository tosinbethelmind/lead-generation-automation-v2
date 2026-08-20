/**
 * @file src/lib/monetization/trademarkShieldEngine.ts
 * 
 * Instagram & SME Brand Shield & Trademark Squatting Alert Engine.
 * 
 * Audits high-follower Nigerian Instagram vendors and alerts them to register
 * their CAC & Federal Trademark before third parties legally seize their brand name.
 */

export interface TrademarkTarget {
  brandName: string;
  instagramHandle: string;
  followerCount: number;
  phone: string;
  trademarkStatus: 'UNPROTECTED' | 'PENDING' | 'SECURED';
  offerFeeNGN: number;
}

export function generateTrademarkProtectionAlert(target: TrademarkTarget): {
  smsText: string;
  emailSubject: string;
  emailBody: string;
} {
  const smsText = `⚠️ BRAND ALERT: Your brand "${target.brandName}" is NOT legally trademarked on the Federal Registry. Protect your name & CAC from unauthorized registration today: https://wa.me/2348022791227 (Bethelmind Legal Desk)`;
  
  const emailSubject = `⚠️ Urgent: Trademark & Business Name Protection for ${target.brandName}`;
  const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
      <h2 style="color: #b91c1c;">⚠️ Brand Squatting Vulnerability Notice</h2>
      <p>Dear Founder of <b>${target.brandName}</b> (@${target.instagramHandle}),</p>
      <p>Our automated corporate IP scanner indicates that your brand name is currently <b>unregistered on the Nigerian Federal Trademark Registry</b>.</p>
      <p>Under Nigerian commercial law, anyone can legally register your brand name, seize your online identity, and issue cease-and-desist orders against your business.</p>
      <p><b>Bethelmind Legal & Due-Diligence Desk</b> can file your Trademark & CAC Business Name Protection for <b>₦${target.offerFeeNGN.toLocaleString()}</b>.</p>
      <p><a href="https://wa.me/2348022791227" style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">Lock Your Trademark Now</a></p>
    </div>
  `;

  return { smsText, emailSubject, emailBody };
}
