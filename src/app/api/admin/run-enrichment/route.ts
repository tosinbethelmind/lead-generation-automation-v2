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
  
  // Use Supabase connection pooler on port 6543
  const connectionString = `postgresql://postgres:${encodeURIComponent(password)}@db.szyuterncawfxwzhvwcf.supabase.co:6543/postgres?sslmode=require`;

  console.log("Connecting to Supabase via connection pooler (port 6543)...");
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected successfully to the database.");

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260629_add_enrichment_columns.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log("Running migration script...");
    await client.query(sql);
    console.log("Enrichment migration executed successfully!");

    await client.end();
    return NextResponse.json({
      success: true,
      message: "Enrichment columns added successfully to the leads table."
    });
  } catch (err: any) {
    console.error("Migration error:", err);
    try {
      await client.end();
    } catch (e) {}
    return NextResponse.json({
      success: false,
      error: err.message || err
    }, { status: 500 });
  }
}
