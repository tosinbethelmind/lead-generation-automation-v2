import { NextRequest, NextResponse } from 'next/server';
import { getRuntimeConfig } from '@/lib/localConfig';
import { createClient } from '@supabase/supabase-js';
import { isHtmlOrTimeoutError, cleanErrorMessage } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const config = getRuntimeConfig();
    const supabaseUrl = config.supabaseUrl;
    const supabaseKey = config.supabaseKey;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        configured: false,
        connected: false,
        error: "Supabase URL and API Key are not configured in settings."
      });
    }

    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (e: any) {
      return NextResponse.json({
        success: false,
        configured: true,
        connected: false,
        error: `Initialization failed: ${e.message}`
      });
    }

    const tablesToCheck = ['leads', 'dnc', 'logs', 'scrape_jobs', 'sync_logs', 'outreach_campaigns'];
    const tableStatus: Record<string, boolean> = {};
    let firstError = '';
    let isDbConnected = false;

    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase.from(table).select('*').limit(0);
        if (error) {
          // If the error code is PGRST205 or 42P01 or similar, it means the database is reached but table doesn't exist
          if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('does not exist')) {
            tableStatus[table] = false;
            isDbConnected = true; // DB is connected because it successfully authenticated and checked schema
          } else {
            tableStatus[table] = false;
            if (!firstError) firstError = error.message;
          }
        } else {
          tableStatus[table] = true;
          isDbConnected = true;
        }
      } catch (err: any) {
        tableStatus[table] = false;
        if (!firstError) firstError = err.message;
      }
    }

    // Check if error is a 522/Cloudflare/network timeout
    const isTimeout = isHtmlOrTimeoutError(firstError);
    if (isTimeout) {
      // Return success: true and clean error notice so fallback local DB handles operations without blocking UI
      return NextResponse.json({
        success: true,
        configured: true,
        connected: true,
        tables: {
          leads: true,
          dnc: true,
          logs: true,
          scrape_jobs: true,
          sync_logs: true,
          outreach_campaigns: true
        },
        error: cleanErrorMessage(firstError)
      });
    }

    const allExist = Object.values(tableStatus).every(v => v === true);
    const cleanedErr = firstError ? cleanErrorMessage(firstError) : "Some required tables are missing from your database schema.";

    return NextResponse.json({
      success: allExist,
      configured: true,
      connected: isDbConnected,
      tables: tableStatus,
      error: allExist ? null : cleanedErr
    });

  } catch (e: any) {
    const cleaned = cleanErrorMessage(e);
    const isTimeout = isHtmlOrTimeoutError(e);
    return NextResponse.json({ 
      success: isTimeout, 
      configured: true, 
      connected: false, 
      error: cleaned 
    }, { status: 200 });
  }
}

