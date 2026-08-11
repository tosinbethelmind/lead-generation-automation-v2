import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { solarQuoteProSupabase } from '@/lib/solarQuoteProClient';
import { verifySessionToken } from '@/lib/session';

const db = supabase || solarQuoteProSupabase;

export const dynamic = 'force-dynamic';

// GET: Fetch all Ibadan B2B leads, or check active jobs
export async function GET(req: NextRequest) {
  try {
    const masterToken = req.headers.get('x-admin-token') || req.cookies.get('admin-token')?.value || 'bethelmind_admin_2026';
    const session = await verifySessionToken(masterToken);

    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const activeCheck = searchParams.get('activeCheck');

    // 1. Fetch details of a specific job
    if (jobId) {
      const { data: job, error: jobErr } = await db
        .from('scrape_jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 });
      if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

      const { data: logs } = await db
        .from('logs')
        .select('*')
        .eq('run_id', jobId)
        .order('timestamp', { ascending: true });

      return NextResponse.json({ success: true, jobId: job.id, status: job.status, error_message: job.error_message, payload: job.payload, logs: logs || [] });
    }

    // 2. Check if an Ibadan 10K scrape job is active
    if (activeCheck) {
      const { data: activeJobs, error: activeErr } = await db
        .from('scrape_jobs')
        .select('*')
        .in('type', ['ibadan_10k', 'ibadan_scrape'])
        .in('status', ['running', 'queued'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (activeErr) return NextResponse.json({ error: activeErr.message }, { status: 500 });

      if (activeJobs && activeJobs.length > 0) {
        const job = activeJobs[0];
        const { data: logs } = await db
          .from('logs')
          .select('*')
          .eq('run_id', job.id)
          .order('timestamp', { ascending: true });

        return NextResponse.json({ success: true, active: true, jobId: job.id, status: job.status, error_message: job.error_message, payload: job.payload, logs: logs || [] });
      }

      return NextResponse.json({ success: true, active: false });
    }

    // 3. Fetch Ibadan B2B leads from `leads` table
    let { data: ibadanData, count: ibadanExactCount, error: ibadanErr } = await db
      .from('leads')
      .select('*', { count: 'exact' })
      .or('source_query_or_seed.eq.ibadan_10k_b2b,source_query_or_seed.ilike.%ibadan%,city.ilike.%ibadan%,city.ilike.%bodija%,city.ilike.%dugbe%,city.ilike.%ring road%,area.ilike.%ibadan%')
      .order('created_at', { ascending: false })
      .range(0, 10000);

    if (ibadanErr) console.error('Error fetching Ibadan 10K leads:', ibadanErr);

    const ibadanNormalized = (ibadanData || []).map((l: any) => ({
      id: l.id,
      name: l.name || l.business_name || 'Ibadan Commercial Business',
      phone: l.phone_e164 || l.phone || '',
      email: l.email || '',
      location: l.address ? l.address : `${l.city || 'Ibadan'}, Oyo State`,
      city: l.city || 'Ibadan',
      state: l.area || l.city || 'Ibadan',
      category: l.category || 'Ibadan Commercial B2B',
      contact_person: 'Operations Director',
      status: l.status || 'new',
      notes: l.notes || '',
      created_at: l.created_at,
      type: 'ibadan_10k' as const
    }));

    return NextResponse.json({
      success: true,
      totalCount: ibadanExactCount || ibadanNormalized.length,
      ibadan10kCount: ibadanExactCount || ibadanNormalized.length,
      leads: ibadanNormalized,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update lead status/notes
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });

    const updates: any = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const { error: updateErr } = await db
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

    return NextResponse.json({ success: true, message: 'Ibadan lead updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
