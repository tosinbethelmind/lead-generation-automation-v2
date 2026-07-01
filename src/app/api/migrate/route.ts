import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    const dbPassword = process.env.DATABASE_PASSWORD || 'pHqrTQc2gpdSqnAx';

    if (secret !== dbPassword) {
      return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
    const projectRef = match ? match[1] : '';

    if (!projectRef) {
      return NextResponse.json({ error: 'Could not resolve project ref' }, { status: 500 });
    }

    const { getPgClient } = await import('@/lib/dbConnect');
    console.log('[Migration] Connecting to database...');
    const client = await getPgClient(projectRef, dbPassword);

    try {
      const migrationFile = path.join(process.cwd(), 'supabase', 'migrations', '20260701_cache_columns_and_overrides.sql');
      if (!fs.existsSync(migrationFile)) {
        return NextResponse.json({ error: `Migration file not found at ${migrationFile}` }, { status: 404 });
      }

      const sql = fs.readFileSync(migrationFile, 'utf8');
      console.log('[Migration] Running DDL commands...');
      await client.query(sql);

      return NextResponse.json({ success: true, message: 'Migration executed successfully' });
    } finally {
      await client.end();
    }
  } catch (err: any) {
    console.error('[Migration] Failed:', err);
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
