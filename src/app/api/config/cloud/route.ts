// src/app/api/config/cloud/route.ts
// Durable configuration persistence via Supabase app_settings table.
// This survives Vercel cold starts where /tmp config.json is ephemeral.
import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig, saveLocalConfig } from '@/lib/localConfig';
import { maskConfig, MASK_VALUE } from '@/lib/validation';
import { createClient } from '@supabase/supabase-js';

/** Single merged config row key in app_settings */
const SETTINGS_ROW_KEY = 'apexreach_runtime_config';

function getSupabaseAdmin() {
  const config = getRuntimeConfig();
  const url = config.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = config.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

/** Read merged config: Supabase overrides /tmp file.  */
export async function GET(_req: NextRequest) {
  const localConfig = getRuntimeConfig();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', SETTINGS_ROW_KEY)
        .maybeSingle();

      if (data?.value) {
        const cloudConfig = JSON.parse(data.value);
        // Merge: cloud values win over local defaults
        const merged = { ...localConfig, ...cloudConfig };
        return NextResponse.json({ success: true, config: maskConfig(merged), source: 'supabase' });
      }
    } catch (err) {
      console.warn('[cloud config] Supabase read failed, falling back to local:', err);
    }
  }

  return NextResponse.json({ success: true, config: maskConfig(localConfig), source: 'local' });
}

/** Write to both Supabase (durable) and /tmp (immediate effect this instance). */
export async function POST(req: NextRequest) {
  try {
    const updates = await req.json();

    // Read existing config (unmasked!) to restore masked values
    const localConfig = getRuntimeConfig();
    let existingCloud: Record<string, any> = {};
    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', SETTINGS_ROW_KEY)
          .maybeSingle();
        if (data?.value) existingCloud = JSON.parse(data.value);
      } catch (_) {}
    }
    const unmaskedConfig = { ...localConfig, ...existingCloud } as Record<string, any>;

    // Strip mask values or restore them from unmaskedConfig
    const cleaned: Record<string, any> = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v === MASK_VALUE) {
        cleaned[k] = unmaskedConfig[k];
        continue;
      }
      if (Array.isArray(v)) {
        const originalArray = unmaskedConfig[k];
        if (Array.isArray(originalArray)) {
          cleaned[k] = v.map((item, idx) => {
            if (item === MASK_VALUE) {
              return originalArray[idx] || '';
            }
            return item;
          }).filter(Boolean);
        } else {
          cleaned[k] = v.filter(x => x !== MASK_VALUE);
        }
        continue;
      }
      cleaned[k] = v;
    }

    // Always write to local config.json / /tmp first (immediate effect)
    const newLocal = saveLocalConfig(cleaned);

    // Persist to Supabase for durable cross-instance storage
    if (supabase) {
      // Read existing cloud config so we merge rather than overwrite
      let existing: Record<string, any> = {};
      try {
        const { data } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', SETTINGS_ROW_KEY)
          .maybeSingle();
        if (data?.value) existing = JSON.parse(data.value);
      } catch (_) {}

      const merged = { ...existing, ...cleaned };

      await supabase.from('app_settings').upsert({
        key: SETTINGS_ROW_KEY,
        value: JSON.stringify(merged),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });
    }

    return NextResponse.json({
      success: true,
      config: maskConfig(newLocal),
      persisted: !!supabase,
      message: supabase
        ? 'Configuration saved to cloud — persists across restarts ✅'
        : 'Configuration saved locally — configure Supabase to persist across Vercel cold starts.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
