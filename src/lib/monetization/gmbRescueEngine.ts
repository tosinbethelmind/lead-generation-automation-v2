/**
 * @file src/lib/monetization/gmbRescueEngine.ts
 * 
 * Unclaimed Google Business (GMB) Vulnerability & Security Rescue Engine.
 * 
 * Identifies high-rating Lagos businesses with unclaimed GMB listings and
 * auto-generates 1-page Security Vulnerability Teardowns for ₦35k–₦65k claim fees.
 */

export interface UnclaimedGmbTarget {
  businessName: string;
  location: string;
  rating: number;
  reviewCount: number;
  phone: string;
  vulnerabilityStatus: 'UNCLAIMED' | 'SUSPENDED_RISK' | 'UNVERIFIED';
  recommendedFeeNGN: number;
  alertPitch: string;
}

export function generateGmbSecurityAlert(target: UnclaimedGmbTarget): {
  smsText: string;
  emailSubject: string;
  emailHtml: string;
} {
  const smsText = `⚠️ URGENT: The Google Maps profile for ${target.businessName} (${target.rating}★, ${target.reviewCount} reviews) is UNCLAIMED and vulnerable to competitor hijacking. Lock your verified ownership in 48 hours: https://wa.me/2348022791227 (Bethelmind Desk)`;
  
  const emailSubject = `⚠️ Security Vulnerability: Unclaimed Google Maps Profile for ${target.businessName}`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
      <h2 style="color: #dc2626;">⚠️ Critical Google Maps Security Alert</h2>
      <p>Dear Management at <b>${target.businessName}</b>,</p>
      <p>Our automated local SEO audit detected that your Google Maps listing (<b>${target.rating}★ rating with ${target.reviewCount} reviews</b>) in ${target.location} is currently <b>UNCLAIMED</b>.</p>
      <p>This means any competitor or unauthorized user can edit your phone number, redirect your customer calls, or delete your reviews.</p>
      <p><b>Bethelmind Analytics Google Verification Team</b> can claim, verify, and permanently lock your profile within 48 hours for <b>₦${target.recommendedFeeNGN.toLocaleString()}</b>.</p>
      <p><a href="https://wa.me/2348022791227" style="display: inline-block; background: #2563eb; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; font-weight: bold;">Claim & Protect Your Profile Now</a></p>
    </div>
  `;

  return { smsText, emailSubject, emailHtml };
}
