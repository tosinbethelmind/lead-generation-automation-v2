import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, rotateKey } from '@/lib/localConfig';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getValidAccessToken } from '@/lib/googleAuth';
import { getDesignTheme, buildFallbackCopy } from '@/lib/designGenerator';
import fs from 'fs';
import path from 'path';
import { getOverridesDir } from '@/lib/overrides';
import { generateRedesignWithProviders } from '@/lib/aiRedesign';

const OVERRIDES_DIR = getOverridesDir();


function tryKeywordPresets(prompt: string): any | null {
  const normalized = prompt.toLowerCase();
  
  if (/\b(dark|black|midnight|darkmode|dark mode)\b/.test(normalized)) {
    return {
      primary: '#0f172a',
      accent: '#38bdf8',
      bg: '#020617',
      text: '#f8fafc',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)'
    };
  }

  if (/\b(light|white|clean|lightmode|light mode|minimal)\b/.test(normalized)) {
    return {
      primary: '#1e293b',
      accent: '#0f766e',
      bg: '#ffffff',
      text: '#0f172a',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
    };
  }

  if (/\b(green|eco|nature|garden|organic|lawn)\b/.test(normalized)) {
    return {
      primary: '#14532d',
      accent: '#22c55e',
      bg: '#f0fdf4',
      text: '#14532d',
      gradient: 'linear-gradient(135deg, #14532d 0%, #22c55e 100%)'
    };
  }

  if (/\b(blue|ocean|water|aqua|marine|professional)\b/.test(normalized)) {
    return {
      primary: '#1e3a8a',
      accent: '#3b82f6',
      bg: '#f0f9ff',
      text: '#1e3a8a',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
    };
  }

  if (/\b(gold|luxury|premium|elegant|vip|expensive)\b/.test(normalized)) {
    return {
      primary: '#1c1917',
      accent: '#d97706',
      bg: '#fafaf9',
      text: '#1c1917',
      gradient: 'linear-gradient(135deg, #1c1917 0%, #d97706 100%)'
    };
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, prompt } = body;

    if (!leadId || !prompt) {
      return NextResponse.json({ error: 'leadId and prompt are required' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead ${leadId} not found` }, { status: 404 });
    }

    const config = getRuntimeConfig();

    // Check if background queue is required
    const { parseScalingConfig } = require('@/lib/scalingHelper');
    const scaling = parseScalingConfig(lead.notes);
    const isQueueRequired = scaling.mode === 'git-batch' || req.nextUrl.searchParams.get('queue') === 'true';

    // Load current baseline or existing overrides to let AI perform delta updates
    const themeDefault = getDesignTheme(lead.category);
    const copyDefault = buildFallbackCopy(lead);
    
    const overridesPath = path.join(OVERRIDES_DIR, `${leadId}.json`);
    let currentOverrides: any = {};
    if (fs.existsSync(overridesPath)) {
      try {
        currentOverrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
      } catch (err) {
        console.warn('Failed to parse existing overrides:', err);
      }
    }

    const currentTheme = { ...themeDefault, ...currentOverrides.theme };
    const currentCopy = { ...copyDefault, ...currentOverrides.copy };
    const currentVisibility = {
      showTestimonials: true,
      showServices: true,
      showEstimator: true,
      showAbout: true,
      ...currentOverrides.visibility
    };

    // 1. Try Shortcut Presets first (0ms, $0 cost)
    const presetTheme = tryKeywordPresets(prompt);
    if (presetTheme) {
      const mergedOverrides = {
        ...currentOverrides,
        theme: {
          ...currentTheme,
          ...presetTheme
        }
      };
      
      fs.writeFileSync(overridesPath, JSON.stringify(mergedOverrides, null, 2), 'utf8');

      const { addLog } = require('@/lib/googleSheets');
      await addLog(
        'AI Redesign Shortcut',
        'SUCCESS',
        `Lead "${lead.name}" redesigned using preset shortcut for prompt: "${prompt}"`
      );

      return NextResponse.json({ success: true, overrides: mergedOverrides, shortcut: true });
    }

    // 2. If no shortcut matched, check if we should queue the LLM request
    if (isQueueRequired) {
      const timestamp = new Date().toISOString();
      const updatedNotes = `${lead.notes || ''}\n[REDESIGN_PENDING: true] [REDESIGN_PROMPT: ${prompt}] at ${timestamp}`;
      await repo.updateLeadStatus(leadId, lead.status, updatedNotes, timestamp);

      const { addLog } = require('@/lib/googleSheets');
      await addLog(
        'AI Redesign Queue',
        'INFO',
        `Lead "${lead.name}" redesign queued for prompt: "${prompt}"`
      );

      return NextResponse.json({
        success: true,
        queued: true,
        message: 'Your custom redesign request is being processed by the AI in the background.'
      });
    }

    const aiPrompt = `You are an expert web designer. Your task is to update a business landing page design based on the user request.
  
User Request: "${prompt}"

Current Site Details:
- Business Name: ${lead.name}
- Category: ${lead.category}
- Area: ${lead.area}, ${lead.city}

Current Design/Colors:
- Primary Color: ${currentTheme.primary}
- Accent Color: ${currentTheme.accent}
- Background Color: ${currentTheme.bg}
- Gradient: ${currentTheme.gradient}

Current Copy:
- Hero Title: "${currentCopy.heroTitle}"
- Hero Subtitle: "${currentCopy.heroSubtitle}"
- About Text: "${currentCopy.aboutText}"
- CTA Text: "${currentCopy.ctaText}"

Current Section Visibility:
- Show Testimonials: ${currentVisibility.showTestimonials}
- Show Services: ${currentVisibility.showServices}
- Show Estimator: ${currentVisibility.showEstimator}
- Show About: ${currentVisibility.showAbout}

Generate a JSON object containing the modified design overrides. Only modify what is requested or what is logical to change (e.g. if colors change, make sure text color and background contrast remains excellent). Return exactly this JSON structure (respond ONLY with JSON, no markdown formatting):
{
  "theme": {
    "primary": "hex code or CSS color",
    "accent": "hex code or CSS color",
    "bg": "hex code or CSS color",
    "text": "hex code or CSS color for contrast",
    "gradient": "linear-gradient css value"
  },
  "copy": {
    "heroTitle": "updated hero title",
    "heroSubtitle": "updated value proposition subtitle",
    "aboutText": "updated about us text",
    "ctaText": "updated call to action button label"
  },
  "visibility": {
    "showTestimonials": true/false,
    "showServices": true/false,
    "showEstimator": true/false,
    "showAbout": true/false
  },
  "services": [
    { "title": "Service Title", "description": "Short description", "icon": "emoji or icon identifier" }
  ]
}`;

    const rawText = await generateRedesignWithProviders(aiPrompt);
    
    // Parse JSON
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON output returned from Gemini');
    }

    const overrides = JSON.parse(jsonMatch[0]);
    
    // Write output overrides to local JSON file
    fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2), 'utf8');

    return NextResponse.json({ success: true, overrides });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
