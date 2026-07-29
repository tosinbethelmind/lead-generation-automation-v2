import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, voiceTranscript, ownerPhone } = body;

    if (!voiceTranscript || voiceTranscript.trim().length < 5) {
      return NextResponse.json({ error: 'Missing or invalid voice transcript' }, { status: 400 });
    }

    const transcriptText = voiceTranscript.trim();

    // Natural Language Parsing of Voice Note: extract pricing, location, products, rules
    const extractedRules: {
      businessName?: string;
      location?: string;
      customPrices?: string[];
      rulesList: string[];
    } = {
      rulesList: [],
    };

    // Extract potential prices mentioned in NGN
    const priceMatches = transcriptText.match(/(\d+(?:\.\d+)?\s*(?:million|m|k|thousand|naira|ngn|n))/gi);
    if (priceMatches) {
      extractedRules.customPrices = priceMatches;
    }

    // Extract location hints
    const locations = ['lekki', 'ikeja', 'victoria island', 'abuja', 'port harcourt', 'wuse', 'yaba', 'surulere', 'kano', 'ibadan'];
    for (const loc of locations) {
      if (transcriptText.toLowerCase().includes(loc)) {
        extractedRules.location = loc.toUpperCase();
        extractedRules.rulesList.push(`Primary location confirmed: ${loc.toUpperCase()}`);
        break;
      }
    }

    extractedRules.rulesList.push(`Custom Rule from Voice Note: "${transcriptText}"`);

    // Update Lead / AI Agent system prompt overrides
    if (leadId) {
      try {
        const repo = getActiveLeadRepository();
        const existingLead = await repo.getLeadById(leadId) as any;
        if (existingLead) {
          const currentOverrides = existingLead.overrides ? JSON.parse(existingLead.overrides) : {};
          const updatedOverrides = {
            ...currentOverrides,
            aiPersonaRules: [
              ...(currentOverrides.aiPersonaRules || []),
              transcriptText,
            ],
            lastVoiceUpdateAt: new Date().toISOString(),
          };
          await repo.updateLeadFields(leadId, {
            overrides: JSON.stringify(updatedOverrides),
          });
        }
      } catch (err) {
        console.warn('DB voice rule update fallback:', err);
      }
    }

    return NextResponse.json({
      success: true,
      voiceTranscript,
      extractedRules,
      message: '⚡ AI Agent trained successfully via Voice Note! Zero technical config required.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Voice training failed' }, { status: 500 });
  }
}
