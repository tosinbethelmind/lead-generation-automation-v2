import { NextRequest, NextResponse } from 'next/server';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { verifySessionToken } from '@/lib/session';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import crypto from 'crypto';
import { triggerCloudRunnerIfNeeded } from '@/lib/cloudRunnerTrigger';
import { getRuntimeConfig } from '@/lib/localConfig';

export const dynamic = 'force-dynamic';

// GET: Fetch all homeowner, enterprise, and 5k Nigeria nationwide solar leads, or check active jobs
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

      const { data: logs } = await solarQuoteProSupabase
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

    // 2. Check if a solar scrape job (solar_scrape or solar_nigeria_5k) is active
    if (activeCheck) {
      const { data: activeJobs, error: activeErr } = await solarQuoteProSupabase
        .from('scrape_jobs')
        .select('*')
        .in('type', ['solar_scrape', 'solar_nigeria_5k'])
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

    // 3. Fetch 5K Nigeria Nationwide Solar leads from main `leads` table
    const { data: nigeriaSolarData, error: nigeriaSolarErr } = await solarQuoteProSupabase
      .from('leads')
      .select('*')
      .or('lead_source.eq.solar_nigeria_5k,niche.eq.solar_installer')
      .order('created_at', { ascending: false });

    if (nigeriaSolarErr) console.error('Error fetching 5k Nigeria solar leads:', nigeriaSolarErr);

    const nigeriaSolarNormalized = (nigeriaSolarData || []).map((l: any) => ({
      id: l.id,
      name: l.company_name || l.name || 'Nigeria Solar Business',
      phone: l.phone || '',
      email: l.email || '',
      location: l.address ? l.address : `${l.city || ''}, ${l.state || 'Nigeria'}`,
      city: l.city || '',
      state: l.state || '',
      contact_person: l.contact_person ? `${l.contact_person} (${l.contact_role || 'Contact'})` : 'Solar Contractor',
      project_scope: `[Nationwide 5K Solar] ${l.state || 'Nigeria'} State - ${l.city || ''}. Rating: ${l.rating || 4.5}. Source: ${l.lead_source || 'solar_nigeria_5k'}`,
      status: l.status || 'new',
      notes: l.notes || '',
      created_at: l.created_at,
      type: 'nigeria_5k' as const
    }));

    // Fetch B2C homeowner leads
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
      type: 'homeowner' as const
    }));

    // Normalize B2B leads
    const enterpriseNormalized = (enterpriseData || []).map((l: any) => ({
      id: l.id,
      name: l.company_name || 'Anonymous Enterprise',
      contact_person: l.contact_person || 'Facility Manager',
      phone: l.phone || '',
      email: l.email || '',
      location: '',
      project_scope: l.project_scope || '',
      status: l.status || 'new',
      created_at: l.created_at,
      type: 'enterprise' as const
    }));

    const allLeads = [
      ...nigeriaSolarNormalized,
      ...homeownerNormalized,
      ...enterpriseNormalized,
    ];

    return NextResponse.json({
      success: true,
      totalCount: allLeads.length,
      nigeria5kCount: nigeriaSolarNormalized.length,
      leads: allLeads,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update lead status/notes
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

    if (type === 'nigeria_5k') {
      const { data, error } = await solarQuoteProSupabase
        .from('leads')
        .update({ status, notes })
        .eq('id', id)
        .select('*')
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, data });
    } else if (type === 'homeowner') {
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

// POST: Trigger Scrapers or Harvest Leads
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
      const jobId = crypto.randomUUID();
      const jobType = (mode === 'live-nigeria-5k' || mode === 'nigeria-5k') ? 'solar_nigeria_5k' : 'solar_scrape';
      const targetCount = count || ((mode === 'live-nigeria-5k' || mode === 'nigeria-5k') ? 5000 : 1000);

      const appConfig = getRuntimeConfig();
      const isLocalMode = appConfig.storageMode === 'local';

      if (isLocalMode) {
        try {
          const { createScrapeJob } = await import('@/lib/supabaseClient');
          await createScrapeJob(jobType, { mode, count: targetCount });
        } catch (err: any) {
          return NextResponse.json({ error: `Failed to create local scrape job: ${err.message}` }, { status: 500 });
        }
      } else {
        const { error } = await solarQuoteProSupabase
          .from('scrape_jobs')
          .insert([
            {
              id: jobId,
              type: jobType,
              status: 'queued',
              payload: { mode: mode === 'live-nigeria-5k' ? 'live-solar' : mode, count: targetCount },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]);

        if (error) {
          return NextResponse.json({ error: `Failed to create scrape job: ${error.message}` }, { status: 500 });
        }
      }

      try {
        await triggerCloudRunnerIfNeeded();
      } catch (err: any) {
        console.error('Error triggering cloud runner:', err.message);
      }

      return NextResponse.json({
        success: true,
        jobId,
        message: jobType === 'solar_nigeria_5k' 
          ? 'Nationwide 5K Nigeria Solar Scraper job queued successfully!'
          : 'Solar Scraper job queued successfully!'
      });
    }

    // Default Harvest action
    const repo = getActiveLeadRepository();
    const allScrapedLeads = await repo.getLeads();

    const solarScraped = allScrapedLeads.filter((l: any) => {
      const cat = (l.category || '').toLowerCase();
      const name = (l.name || '').toLowerCase();
      const query = (l.source_query_or_seed || '').toLowerCase();
      return cat.includes('solar') || name.includes('solar') || query.includes('solar');
    });

    if (solarScraped.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No solar-related leads found in the local scraper database.',
        imported: 0
      });
    }

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
        project_scope: `[Imported from ${lead.source} Scraper] Category: ${lead.category || 'N/A'}. Address: ${lead.address || 'N/A'}.`,
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
      message: `Successfully harvested and imported ${toInsert.length} solar leads into the Enterprise Pipeline.`,
      imported: toInsert.length,
      skipped: skippedCount
    });
  } catch (error: any) {
    console.error('Error harvesting solar leads:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
