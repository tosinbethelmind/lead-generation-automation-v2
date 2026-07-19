import { NextRequest, NextResponse } from 'next/server';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { verifySessionToken } from '@/lib/session';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import path from 'path';
import { spawn } from 'child_process';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// GET: Fetch all homeowner and enterprise leads from Supabase, or fetch active job status/logs
export async function GET(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const activeCheck = searchParams.get('activeCheck');

    // 1. Fetch details of a specific job
    if (jobId) {
      const { data: job, error: jobErr } = await solarQuoteProSupabase
        .from('scrape_jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr) {
        return NextResponse.json({ error: jobErr.message }, { status: 500 });
      }

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      const { data: logs, error: logsErr } = await solarQuoteProSupabase
        .from('logs')
        .select('*')
        .eq('run_id', jobId)
        .order('timestamp', { ascending: true });

      return NextResponse.json({
        success: true,
        jobId: job.id,
        status: job.status,
        error_message: job.error_message,
        payload: job.payload,
        logs: logs || []
      });
    }

    // 2. Check if a solar scrape job is currently running and return it to reconnect the UI
    if (activeCheck) {
      const { data: activeJobs, error: activeErr } = await solarQuoteProSupabase
        .from('scrape_jobs')
        .select('*')
        .eq('type', 'solar_scrape')
        .in('status', ['running', 'queued'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (activeErr) {
        return NextResponse.json({ error: activeErr.message }, { status: 500 });
      }

      if (activeJobs && activeJobs.length > 0) {
        const job = activeJobs[0];
        const { data: logs } = await solarQuoteProSupabase
          .from('logs')
          .select('*')
          .eq('run_id', job.id)
          .order('timestamp', { ascending: true });

        return NextResponse.json({
          success: true,
          active: true,
          jobId: job.id,
          status: job.status,
          error_message: job.error_message,
          payload: job.payload,
          logs: logs || []
        });
      }

      return NextResponse.json({ success: true, active: false });
    }

    // 3. Original functionality: Fetch B2C homeowner leads
    const { data: homeownerData, error: homeownerError } = await solarQuoteProSupabase
      .from('homeowner_leads')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch B2B enterprise leads
    const { data: enterpriseData, error: enterpriseError } = await solarQuoteProSupabase
      .from('enterprise_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (homeownerError) console.error('Error fetching homeowner leads:', homeownerError);
    if (enterpriseError) console.error('Error fetching enterprise leads:', enterpriseError);

    // Normalize B2C leads
    const homeownerNormalized = (homeownerData || []).map((l: any) => ({
      id: l.id,
      name: l.name || l.full_name || 'Anonymous Homeowner',
      phone: l.phone || l.whatsapp || '',
      email: l.email || '',
      location: l.location || '',
      running_load_w: l.running_load_w || 0,
      kva_recommended: l.kva_recommended || '',
      monthly_savings_ngn: l.monthly_savings_ngn || 0,
      monthly_fuel_spend: l.monthly_fuel_spend || 0,
      city_disco: l.city_disco || '',
      estimated_system_size: l.estimated_system_size || '',
      status: l.status || 'new',
      notes: l.notes || '',
      created_at: l.created_at,
      type: 'homeowner'
    }));

    // Normalize B2B leads
    const enterpriseNormalized = (enterpriseData || []).map((l: any) => ({
      id: l.id,
      name: l.company_name || 'Anonymous Enterprise',
      contact_person: l.contact_person || 'Facility Manager',
      phone: l.phone || '',
      email: l.email || '',
      location: '', // Enterprise doesn't have native location field, let's keep blank
      project_scope: l.project_scope || '',
      status: l.status || 'new',
      created_at: l.created_at,
      type: 'enterprise'
    }));

    return NextResponse.json({
      success: true,
      leads: [
        ...homeownerNormalized,
        ...enterpriseNormalized,
      ],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update lead status/notes in the respective homeowner/enterprise table
export async function PATCH(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, type, status, notes } = body;

    if (!id || !type || !status) {
      return NextResponse.json({ error: 'id, type, and status are required' }, { status: 400 });
    }

    if (type === 'homeowner') {
      const { data, error } = await solarQuoteProSupabase
        .from('homeowner_leads')
        .update({ status, notes })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else if (type === 'enterprise') {
      const { data, error } = await solarQuoteProSupabase
        .from('enterprise_leads')
        .update({ status, project_scope: notes })
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else {
      return NextResponse.json({ error: 'Invalid lead type' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Harvest solar leads from local/active scraper database into SolarQuotePro enterprise_leads table
export async function POST(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action, mode, count } = body;

    if (action === 'scrape') {
      const scriptPath = path.join(process.cwd(), 'scripts', 'mass_solar_scraper.js');
      const args: string[] = [];
      
      if (mode === 'synthetic') {
        args.push('--synthetic');
        args.push('--count');
        args.push(String(count || 1000));
      } else if (mode === 'dry-run') {
        args.push('--dry-run');
      } else if (mode === 'live-solar') {
        args.push('--solar-only');
      }

      // Generate background Job record in Supabase
      const jobId = crypto.randomUUID();
      const { error: insertErr } = await solarQuoteProSupabase
        .from('scrape_jobs')
        .insert([
          {
            id: jobId,
            type: 'solar_scrape',
            status: 'running',
            payload: { mode, count },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);

      if (insertErr) {
        console.error('Failed to create background scrape job:', insertErr.message);
        // Fallback: spawn anyway but notify in console
      }

      // Spawn process asynchronously
      const childArgs = [...args, '--run-id', jobId];
      console.log(`Spawning mass scraper in background (Job: ${jobId}) with args: ${childArgs.join(' ')}`);
      
      const child = spawn(process.execPath, [scriptPath, ...childArgs], {
        env: {
          ...process.env,
        },
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      // Helper function to write to Logs table in Supabase
      const appendJobLog = async (msg: string, status: 'INFO' | 'ERROR' | 'START' | 'SUCCESS') => {
        try {
          const { error } = await solarQuoteProSupabase.from('logs').insert({
            run_id: jobId,
            timestamp: new Date().toISOString(),
            step: 'solar_scraper',
            status: status,
            message: msg
          });
          if (error) {
            console.error('Failed to write log to DB (Supabase error):', error.message);
          }
        } catch (dbErr: any) {
          console.error('Failed to write log to DB (exception):', dbErr.message);
        }
      };

      await appendJobLog(`Mass scraper process initialized in mode: ${mode || 'production'} (count: ${count || 'default'})`, 'START');

      let stdoutBuffer = '';
      child.stdout.on('data', (data: any) => {
        stdoutBuffer += data.toString();
        const lines = stdoutBuffer.split(/[\r\n]+/);
        stdoutBuffer = lines.pop() || '';
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine) {
            appendJobLog(cleanLine, 'INFO');
          }
        }
      });

      let stderrBuffer = '';
      child.stderr.on('data', (data: any) => {
        stderrBuffer += data.toString();
        const lines = stderrBuffer.split(/[\r\n]+/);
        stderrBuffer = lines.pop() || '';
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine) {
            appendJobLog(cleanLine, 'ERROR');
          }
        }
      });

      child.on('close', async (code: any) => {
        if (stdoutBuffer.trim()) {
          await appendJobLog(stdoutBuffer.trim(), 'INFO');
        }
        if (stderrBuffer.trim()) {
          await appendJobLog(stderrBuffer.trim(), 'ERROR');
        }

        const isSuccess = code === 0;
        const jobStatus = isSuccess ? 'completed' : 'failed';
        const errMsg = isSuccess ? null : `Scraper process exited with non-zero code ${code}`;

        await appendJobLog(
          isSuccess ? 'Scraper completed successfully.' : `Scraper failed with exit code ${code}`,
          isSuccess ? 'SUCCESS' : 'ERROR'
        );

        // Update Job status
        try {
          await solarQuoteProSupabase
            .from('scrape_jobs')
            .update({
              status: jobStatus,
              error_message: errMsg,
              updated_at: new Date().toISOString()
            })
            .eq('id', jobId);
        } catch (dbErr: any) {
          console.error('Failed to update scraper job finish status:', dbErr.message);
        }
      });

      child.unref();

      return NextResponse.json({
        success: true,
        jobId,
        message: 'Scraper started successfully. Monitor progress below.'
      });
    }

    const repo = getActiveLeadRepository();
    const allScrapedLeads = await repo.getLeads();

    // Filter leads that are solar-related (category, name, or query contains "solar")
    const solarScraped = allScrapedLeads.filter((l: any) => {
      const cat = (l.category || '').toLowerCase();
      const name = (l.name || '').toLowerCase();
      const query = (l.source_query_or_seed || '').toLowerCase();
      return cat.includes('solar') || name.includes('solar') || query.includes('solar');
    });

    if (solarScraped.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No solar-related leads found in the local scraper database. Run the Maps Scraper with the query "solar" first!',
        imported: 0
      });
    }

    // Fetch existing enterprise leads to avoid duplicates
    const { data: existingEnterprise, error: fetchErr } = await solarQuoteProSupabase
      .from('enterprise_leads')
      .select('company_name, phone, email');

    if (fetchErr) throw fetchErr;

    const existingNames = new Set((existingEnterprise || []).map((e: any) => (e.company_name || '').toLowerCase().trim()));
    const existingPhones = new Set((existingEnterprise || []).map((e: any) => (e.phone || '').trim()));

    const toInsert: any[] = [];
    let skippedCount = 0;

    for (const lead of solarScraped) {
      const nameKey = (lead.name || '').toLowerCase().trim();
      const phoneKey = (lead.phone_e164 || lead.phone_raw || '').trim();

      if (existingNames.has(nameKey) || (phoneKey && existingPhones.has(phoneKey))) {
        skippedCount++;
        continue;
      }

      toInsert.push({
        company_name: lead.name || 'Solar Business',
        contact_person: 'Facility/Operations Manager',
        phone: lead.phone_e164 || lead.phone_raw || '',
        email: lead.email || '',
        project_scope: `[Imported from ${lead.source} Scraper] Category: ${lead.category || 'N/A'}. Query: ${lead.source_query_or_seed || 'N/A'}.\nRating: ${lead.rating || 0} (${lead.reviews_count || 0} reviews).\nWebsite: ${lead.website || 'N/A'}. Address: ${lead.address || 'N/A'}.\nNotes: ${lead.notes || ''}`,
        status: 'new',
        created_at: new Date().toISOString()
      });
    }

    if (toInsert.length > 0) {
      const { error: insertErr } = await solarQuoteProSupabase
        .from('enterprise_leads')
        .insert(toInsert);

      if (insertErr) throw insertErr;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully harvested and imported ${toInsert.length} solar leads into the Enterprise Pipeline (Skipped ${skippedCount} duplicates).`,
      imported: toInsert.length,
      skipped: skippedCount
    });
  } catch (error: any) {
    console.error('Error harvesting solar leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
