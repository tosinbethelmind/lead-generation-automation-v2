import { Client } from 'pg';

async function resolveIpv6(host: string): Promise<string | null> {
  try {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(host)}&type=AAAA`, {
      headers: { 'accept': 'application/dns-json' }
    });
    if (!response.ok) return null;
    const json = await response.json();
    if (json.Answer && json.Answer.length > 0) {
      const aaaaRecord = json.Answer.find((ans: any) => ans.type === 28);
      if (aaaaRecord && aaaaRecord.data) {
        return aaaaRecord.data;
      }
    }
  } catch (e) {
    console.warn(`[DB Connect] DNS-over-HTTPS resolution failed for ${host}:`, e);
  }
  return null;
}

interface ConnConfig {
  label: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  connectionString?: string;
}

/**
 * Attempts to connect to the Supabase database using a sequence of connection strategies
 * to ensure compatibility with IPv6, IPv4, serverless, and local environments.
 */
export async function getPgClient(projectRef: string, password: string): Promise<Client> {
  const directDbHost = `db.${projectRef}.supabase.co`;
  const ipv6Address = await resolveIpv6(directDbHost);

  if (ipv6Address) {
    console.log(`[DB Connect] Successfully resolved ${directDbHost} to IPv6 address: ${ipv6Address}`);
  } else {
    console.log(`[DB Connect] Could not resolve IPv6 address for ${directDbHost} via DoH.`);
  }

  const strategies: ConnConfig[] = [];

  // Strategy 1: Shared connection pooler (IPv4-compatible, port 6543) - Prioritized first
  strategies.push({
    label: `Shared connection pooler (IPv4-compatible, port 6543)`,
    connectionString: `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-1-eu-central-1.pooler.supabase.com:6543/postgres`
  });

  // Strategy 2: Direct database connection (IPv6 hostname, port 5432)
  strategies.push({
    label: `Direct database connection (IPv6 hostname, port 5432)`,
    connectionString: `postgresql://postgres:${encodeURIComponent(password)}@${directDbHost}:5432/postgres`
  });

  // Strategy 3: Resolved IPv6 direct database connection (port 5432)
  if (ipv6Address) {
    strategies.push({
      label: `Resolved IPv6 direct (port 5432)`,
      host: ipv6Address,
      port: 5432,
      user: 'postgres',
      password: password,
      database: 'postgres'
    });
  }

  let lastError: any = null;
  const errors: string[] = [];
  for (let i = 0; i < strategies.length; i++) {
    const strategy = strategies[i];
    console.log(`[DB Connect] Strategy ${i + 1} (${strategy.label}): Trying connection...`);
    
    const clientOptions: any = {
      ssl: { rejectUnauthorized: false }
    };
    if (strategy.connectionString) {
      clientOptions.connectionString = strategy.connectionString;
    } else {
      clientOptions.host = strategy.host;
      clientOptions.port = strategy.port;
      clientOptions.user = strategy.user;
      clientOptions.password = strategy.password;
      clientOptions.database = strategy.database;
    }

    const client = new Client(clientOptions);

    try {
      await client.connect();
      console.log(`[DB Connect] Connected successfully using Strategy ${i + 1} (${strategy.label})`);
      return client;
    } catch (err: any) {
      console.warn(`[DB Connect] Strategy ${i + 1} (${strategy.label}) failed:`, err.message);
      const hostInfo = strategy.connectionString ? 'connectionString' : `${strategy.host}:${strategy.port}`;
      errors.push(`[Strategy ${i + 1} - ${strategy.label}] ${hostInfo} -> ${err.message}`);
      lastError = err;
      try {
        await client.end();
      } catch (e) {}
    }
  }

  throw new Error(`Failed to connect to Supabase PostgreSQL database using all available connection strategies. Details:\n${errors.join('\n')}`);
}


