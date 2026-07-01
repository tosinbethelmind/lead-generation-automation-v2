import { Client } from 'pg';

/**
 * Attempts to connect to the Supabase database using a sequence of connection strategies
 * to ensure compatibility with IPv6, IPv4, serverless, and local environments.
 */
export async function getPgClient(projectRef: string, password: string): Promise<Client> {
  const connectionStrings = [
    // 1. Direct connection (IPv6 only, port 5432)
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres?sslmode=require`,
    // 2. Direct pooler connection (IPv6 only, port 6543)
    `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:6543/postgres?sslmode=require`,
    // 3. Shared connection pooler (IPv4-compatible, port 6543) using project-specific user format
    `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require`
  ];

  let lastError: any = null;
  for (const connectionString of connectionStrings) {
    // Extract domain/host for logging
    const parts = connectionString.split('@');
    const host = parts.length > 1 ? parts[1].split(':')[0] : 'unknown';
    const port = parts.length > 1 ? parts[1].split(':')[1]?.split('/')[0] : 'unknown';
    
    console.log(`[DB Connect] Trying connection to ${host}:${port}...`);
    
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`[DB Connect] Connected successfully to ${host}:${port}`);
      return client;
    } catch (err: any) {
      console.warn(`[DB Connect] Failed connecting to ${host}:${port}:`, err.message);
      lastError = err;
      try {
        await client.end();
      } catch (e) {}
    }
  }

  throw new Error(`Failed to connect to Supabase PostgreSQL database using all available connection strategies. Last error: ${lastError?.message || lastError}`);
}
