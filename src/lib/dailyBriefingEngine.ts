/**
 * @file dailyBriefingEngine.ts
 * Generates 7:00 PM Executive Daily Summaries sent directly to business owners via WhatsApp.
 */

export interface DailyStats {
  leadId: string;
  businessName: string;
  visitorCount: number;
  quotesCalculated: number;
  totalQuoteValueNGN: number;
  depositsReceivedNGN: number;
  pendingLeadsCount: number;
}

export function generateDailyExecutiveBriefingText(stats: DailyStats): {
  subject: string;
  whatsappMessageText: string;
  audioScriptText: string;
} {
  const bName = stats.businessName || 'Your Business';
  const dateStr = new Date().toLocaleDateString('en-NG', { weekday: 'long', month: 'short', day: 'numeric' });

  const whatsappMessageText = `📊 *DAILY EXECUTIVE BRIEFING — ${bName.toUpperCase()}*\n` +
    `🗓️ *Date:* ${dateStr}\n\n` +
    `📈 *Today's Highlights:*\n` +
    `• 👥 *Portal Visitors:* ${stats.visitorCount}\n` +
    `• 🧮 *Quotes Calculated:* ${stats.quotesCalculated} Package(s)\n` +
    `• 💰 *Total Quote Value:* ₦${stats.totalQuoteValueNGN.toLocaleString()}\n` +
    `• 💳 *Deposits Received (Moniepoint DVA):* ₦${stats.depositsReceivedNGN.toLocaleString()}\n` +
    `• 🎯 *Actionable Pending Leads:* ${stats.pendingLeadsCount}\n\n` +
    `✅ *System Status:* 100% Operational & Collecting Customer Orders 24/7!\n` +
    `Reply *REPORT* anytime to view detailed customer contact list.`;

  const audioScriptText = `Good evening Chief! Here is your daily business briefing for ${bName} on ${dateStr}. ` +
    `Today, your automated webapp welcomed ${stats.visitorCount} visitors and generated ${stats.quotesCalculated} custom package quotes worth ₦${stats.totalQuoteValueNGN.toLocaleString()}. ` +
    `You received ₦${stats.depositsReceivedNGN.toLocaleString()} in Moniepoint bank deposits. Everything is running smoothly!`;

  return {
    subject: `Daily Briefing for ${bName}`,
    whatsappMessageText,
    audioScriptText,
  };
}
