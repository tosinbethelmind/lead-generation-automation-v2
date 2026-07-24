import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from '@/lib/supabaseClient';

const supabase = getSupabaseClient();

const LOCAL_DB_DIR = path.join(process.cwd(), 'local_db');
const HEALING_LOG_FILE = path.join(LOCAL_DB_DIR, 'self_healing.log');

export interface SelfHealingEvent {
  id: string;
  timestamp: string;
  engine: 'solarquotepro' | 'lagos10k' | 'browser_launcher' | 'api_scraper';
  strategy: 'proxy_rotate' | 'endpoint_failover' | 'browser_purge' | 'runner_restart' | 'schema_fallback';
  target: string;
  reason: string;
  resolution: string;
  success: boolean;
}

export function logSelfHealingEvent(event: Omit<SelfHealingEvent, 'id' | 'timestamp'>): SelfHealingEvent {
  const fullEvent: SelfHealingEvent = {
    id: `heal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    ...event
  };

  const formattedLog = `[${fullEvent.timestamp}] [SELF-HEALED] [${fullEvent.engine.toUpperCase()}] Strategy: ${fullEvent.strategy} | Reason: ${fullEvent.reason} -> Resolution: ${fullEvent.resolution} (Success: ${fullEvent.success})`;

  console.log(`\x1b[36m${formattedLog}\x1b[0m`);

  // 1. Write to local_db log file
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.appendFileSync(HEALING_LOG_FILE, formattedLog + '\n');
  } catch (_) {}

  // 2. Async sync to Supabase logs table (non-blocking)
  Promise.resolve(
    supabase
      .from('logs')
      .insert([{
        run_id: fullEvent.id,
        timestamp: fullEvent.timestamp,
        step: `SELF_HEAL_${fullEvent.strategy.toUpperCase()}`,
        status: fullEvent.success ? 'SUCCESS' : 'ERROR',
        message: `[SELF-HEALED] ${fullEvent.engine}: ${fullEvent.reason} -> ${fullEvent.resolution}`
      }])
  ).catch(() => {});

  return fullEvent;
}

export function getRecentSelfHealingEvents(limit = 15): SelfHealingEvent[] {
  if (!fs.existsSync(HEALING_LOG_FILE)) return [];
  try {
    const raw = fs.readFileSync(HEALING_LOG_FILE, 'utf8');
    const lines = raw.split('\n').filter(Boolean);
    const recentLines = lines.slice(-limit).reverse();
    return recentLines.map((line, idx) => {
      const match = line.match(/^\[(.*?)\] \[SELF-HEALED\] \[(.*?)\] Strategy: (.*?) \| Reason: (.*?) -> Resolution: (.*?) \(Success: (.*?)\)$/);
      if (match) {
        return {
          id: `heal_history_${idx}`,
          timestamp: match[1],
          engine: match[2].toLowerCase() as any,
          strategy: match[3] as any,
          target: match[2],
          reason: match[4],
          resolution: match[5],
          success: match[6] === 'true'
        };
      }
      return {
        id: `heal_history_${idx}`,
        timestamp: new Date().toISOString(),
        engine: 'api_scraper',
        strategy: 'proxy_rotate',
        target: 'system',
        reason: line,
        resolution: 'Logged event',
        success: true
      };
    });
  } catch (_) {
    return [];
  }
}
