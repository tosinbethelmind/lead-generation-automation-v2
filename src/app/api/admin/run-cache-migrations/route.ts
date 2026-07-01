import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  const auth = req.nextUrl.searchParams.get('auth');
  if (auth !== 'run-my-migrations-please') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const password = process.env.DATABASE_PASSWORD || 'pHqrTQc2gpdSqnAx';
  const projectRef = 'szyuterncawfxwzhvwcf';

  const { getPgClient } = await import('@/lib/dbConnect');
  console.log("Connecting to Supabase...");
  
  let client: any = null;
  try {
    client = await getPgClient(projectRef, password);
    console.log("Connected successfully to the database.");

    // Run 20260629 enrichment migration
    const enrichmentMigrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260629_add_enrichment_columns.sql');
    if (fs.existsSync(enrichmentMigrationPath)) {
      const sql = fs.readFileSync(enrichmentMigrationPath, 'utf8');
      console.log("Running enrichment columns migration...");
      await client.query(sql);
      console.log("Enrichment columns migration executed successfully!");
    }

    // Run 20260701 cache and overrides migration
    const cacheMigrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260701_cache_columns_and_overrides.sql');
    if (fs.existsSync(cacheMigrationPath)) {
      const sql = fs.readFileSync(cacheMigrationPath, 'utf8');
      console.log("Running cache columns and overrides migration...");
      await client.query(sql);
      console.log("Cache columns and overrides migration executed successfully!");
    }

    await client.end();
    return NextResponse.json({
      success: true,
      message: "Cache columns, overrides, and email verification columns successfully added to the database."
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    if (client) {
      try {
        await client.end();
      } catch (e) {}
    }
    return NextResponse.json({
      success: false,
      error: err.message || err
    }, { status: 500 });
  }
}
