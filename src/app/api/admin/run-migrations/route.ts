import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  // Simple authorization check using a query parameter to avoid unauthorized access
  const auth = req.nextUrl.searchParams.get('auth');
  if (auth !== 'run-my-migrations-please') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const password = process.env.DATABASE_PASSWORD || 'pHqrTQc2gpdSqnAx';
  const projectRef = 'pnsrjsyiygxdcxkpgbzx';

  const { getPgClient } = await import('@/lib/dbConnect');
  console.log("Connecting to Supabase...");
  
  let client: any = null;
  try {
    client = await getPgClient(projectRef, password);
    console.log("Connected successfully to the database.");

    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_init.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log("Running migration script...");
    await client.query(sql);
    console.log("Migration executed successfully!");

    await client.end();
    return NextResponse.json({
      success: true,
      message: "Database tables created successfully on the new Supabase project."
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
