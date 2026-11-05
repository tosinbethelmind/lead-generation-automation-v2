import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_FACTORY_CONFIG, FactoryFullConfig } from '@/lib/factory/factoryConfig';

/**
 * @file src/app/api/factory/config/route.ts
 * 
 * ⚙️ FACTORY DYNAMIC VARIABLES & STAFF ROSTER PERSISTENCE API
 * 
 * Bethelmind Digital Solutions (CAC Certified: Reg 9912717)
 */

const CONFIG_FILE_PATH = path.join(process.cwd(), 'local_db', 'factory_dynamic_config.json');

function ensureConfigDir() {
  const dir = path.dirname(CONFIG_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readServerConfig(): FactoryFullConfig {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const data = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_FACTORY_CONFIG,
        ...parsed,
        staff: parsed.staff && parsed.staff.length > 0 ? parsed.staff : DEFAULT_FACTORY_CONFIG.staff,
        shift: { ...DEFAULT_FACTORY_CONFIG.shift, ...(parsed.shift || {}) },
        pricing: { ...DEFAULT_FACTORY_CONFIG.pricing, ...(parsed.pricing || {}) },
        plant: { ...DEFAULT_FACTORY_CONFIG.plant, ...(parsed.plant || {}) }
      };
    }
  } catch (err) {
    console.warn('[ServerConfig] Failed to read file, fallback to default:', err);
  }
  return DEFAULT_FACTORY_CONFIG;
}

export async function GET() {
  const config = readServerConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const current = readServerConfig();

    const updated: FactoryFullConfig = {
      staff: Array.isArray(body.staff) && body.staff.length > 0 ? body.staff : current.staff,
      shift: { ...current.shift, ...(body.shift || {}) },
      pricing: { ...current.pricing, ...(body.pricing || {}) },
      plant: { ...current.plant, ...(body.plant || {}) },
      updatedAt: new Date().toISOString()
    };

    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Factory configuration & staff roster saved successfully.',
      config: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to save factory configuration.' },
      { status: 500 }
    );
  }
}
