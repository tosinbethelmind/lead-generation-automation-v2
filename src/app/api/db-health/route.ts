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
      try {
        const { error } = await supabase.from(table).select('*').limit(0);
        if (error) {
          // Check if table does not exist or if there's a schema cache error
          if (error.code === '42P01' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
            tableStatus[table] = false;
            missingTables.push(table);
          } else {
            // Permission or connection error rather than missing table
            return NextResponse.json({
              success: false,
              connected: false,
              storageMode,
              error: `Database query failed on table '${table}': ${error.message} (${error.code})`,
              tables: {
                ...tableStatus,
                [table]: false,
                ...tablesToCheck.filter(t => !tableStatus[t] && t !== table).reduce((acc, t) => ({ ...acc, [t]: false }), {})
              },
              missingTables: tablesToCheck.filter(t => !tableStatus[t])
            });
          }
        } else {
          tableStatus[table] = true;
        }
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          connected: false,
          storageMode,
          error: `Database connection error: ${err.message || err}`,
          tables: {
            ...tableStatus,
            [table]: false,
            ...tablesToCheck.filter(t => !tableStatus[t] && t !== table).reduce((acc, t) => ({ ...acc, [t]: false }), {})
          },
          missingTables: tablesToCheck.filter(t => !tableStatus[t])
        });
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

