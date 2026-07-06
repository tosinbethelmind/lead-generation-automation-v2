// src/lib/hosting-types.ts

export type HostingProvider = 'vercel' | 'cloudflare' | 'render' | 'fly';
export type DomainProvider = 'namecheap' | 'cloudflare';

export interface HostingCreatePayload {
  provider: HostingProvider;
  repoUrl: string; // e.g. https://github.com/owner/repo
  projectName: string; // slug-friendly name for the hosting project
  env?: Record<string, string>; // optional env vars for the hosting platform
}

export interface DomainRegisterPayload {
  provider: DomainProvider;
  domain: string; // e.g. "my-awesome-site.com"
  contactEmail: string; // registrant email address
}

export interface DnsSetupPayload {
  zoneId: string; // Cloudflare zone identifier
  domain: string; // the domain to configure
  targetUrl: string; // URL of the deployed site (e.g., Vercel preview URL)
}
