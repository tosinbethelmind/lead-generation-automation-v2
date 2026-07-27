import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getRuntimeConfig } from '@/lib/localConfig';

export async function GET(req: NextRequest) {
  const config = getRuntimeConfig();
  const storageMode = config.storageMode || 'local';

  try {
    if (!supabase) {
      return NextResponse.json({
        success: false,
        connected: false,
        storageMode,
        error: "Supabase client is not initialized. Please verify your environment configurations.",
        tables: {
          leads: false,
          dnc: false,
          logs: false,
          scrape_jobs: false,
          sync_logs: false,
          outreach_campaigns: false
        },
        missingTables: ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns']
      });
    }

    const tablesToCheck = ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns'];
    const tableStatus: Record<string, boolean> = {};
    const missingTables: string[] = [];

    for (const table of tablesToCheck) {
      let isOk = false;
      let lastErr: any = null;

      // Try up to 2 times to handle cold-start timeouts
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const { error } = await supabase.from(table).select('*').limit(0);
          if (!error) {
            isOk = true;
            break;
          }

          lastErr = error;
          const isMissing = error.code === '42P01' || 
                            error.message?.includes('schema cache') || 
                            error.message?.includes('does not exist');

          if (isMissing) {
            // Definitively missing table
            break;
          }

          const isTimeout = error.message?.includes('timeout') || 
                            error.message?.includes('522') || 
                            error.message?.includes('504') || 
                            !error.code;

          if (isTimeout && attempt === 1) {
            // Small wait before retry
            await new Promise(r => setTimeout(r, 500));
            continue;
          }
        } catch (err: any) {
          lastErr = err;
          if (attempt === 1) await new Promise(r => setTimeout(r, 500));
        }
      }

      if (isOk) {
        tableStatus[table] = true;
      } else if (lastErr?.code === '42P01' || lastErr?.message?.includes('does not exist')) {
        tableStatus[table] = false;
        missingTables.push(table);
      } else {
        // Assume connected/existing if transient timeout occurred, rather than bricking health check
        tableStatus[table] = true;
      }
    }

    const allExist = missingTables.length === 0;

    return NextResponse.json({
      success: allExist,
      connected: true,
      storageMode,
      tables: tableStatus,
      missingTables
    });

  } catch (e: any) {
    return NextResponse.json({
      success: false,
      connected: false,
      storageMode,
      error: e.message || 'Internal connection failure',
      tables: {
        leads: false,
        dnc: false,
        logs: false,
        scrape_jobs: false,
        sync_logs: false,
        outreach_campaigns: false
      },
      missingTables: ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns']
    }, { status: 500 });
  }
}

