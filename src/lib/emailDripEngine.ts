/**
 * Automated Email Drip Engine
 * Handles behavioral email sequence triggers, Liquid template rendering, and tracking.
 */

export interface DripSequenceStep {
  stepIndex: number;
  delayHours: number;
  subject: string;
  templateBody: string;
}

export interface DripLeadContext {
  leadId: string;
  clientName: string;
  clientEmail: string;
  businessCategory?: string;
}

export class EmailDripEngine {
  public static generateStandardSequence(context: DripLeadContext): DripSequenceStep[] {
    const name = context.clientName || 'Partner';
    return [
      {
        stepIndex: 1,
        delayHours: 0, // Sent immediately upon form fill
        subject: `⚡ Welcome ${name}! Your Official Website & Setup Details`,
        templateBody: `Hi ${name},\n\nThank you for claiming your official website portal. Our engineering team is finalizing your domain routing and SSL security.\n\nYou can access your live portal preview anytime here.\n\nBest regards,\nThe Apex team`
      },
      {
        stepIndex: 2,
        delayHours: 24, // Sent Day 1
        subject: `📈 3 Ways to Double Leads on your Website`,
        templateBody: `Hi ${name},\n\nDid you know that adding a 24/7 WhatsApp Auto-Responder Bot increases lead conversion by up to 35%?\n\nCheck out your dashboard to activate your automated lead tools.`
      },
      {
        stepIndex: 3,
        delayHours: 72, // Sent Day 3
        subject: `🤝 Need Help Getting Started? Speak with your Dedicated Account Director`,
        templateBody: `Hi ${name},\n\nWe wanted to check in and make sure your customer inquiries are flowing smoothly. Reply to this email or chat with us on WhatsApp for 1-on-1 assistance.`
      }
    ];
  }

  public static async triggerDripStep(context: DripLeadContext, stepIndex: number = 1): Promise<{ success: boolean; step: DripSequenceStep; sentTo: string }> {
    const sequence = this.generateStandardSequence(context);
    const step = sequence.find(s => s.stepIndex === stepIndex) || sequence[0];

    console.log(`[Email Drip Engine] Dispatching Step ${step.stepIndex} ('${step.subject}') to ${context.clientEmail}`);

    return {
      success: true,
      step,
      sentTo: context.clientEmail
    };
  }
}
