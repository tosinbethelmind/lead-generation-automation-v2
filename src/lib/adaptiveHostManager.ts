/**
 * Adaptive Health & Efficiency Host Router
 * 
 * Manages backend endpoint selection based on priority, efficiency (latency),
 * and real-time health status (online/degraded/offline).
 */

export interface HostMetric {
  id: string;
  name: string;
  url: string;
  priority: number; // Lower number = Higher priority
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  successCount: number;
  errorCount: number;
  lastChecked: number;
  lastErrorMsg?: string;
}

const DEFAULT_HOSTS: HostMetric[] = [
  {
    id: 'github_actions',
    name: 'GitHub Actions (Batch Cloud Workflows — 100% Free)',
    url: 'https://api.github.com',
    priority: 1,
    status: 'ONLINE',
    latencyMs: 180,
    successCount: 0,
    errorCount: 0,
    lastChecked: Date.now()
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Spaces (24/7 Cloud Worker — 100% Free)',
    url: 'https://huggingface.co/spaces/bethelmind/lead-engine',
    priority: 2,
    status: 'ONLINE',
    latencyMs: 250,
    successCount: 0,
    errorCount: 0,
    lastChecked: Date.now()
  },
  {
    id: 'fly',
    name: 'Fly.io (Container Backup)',
    url: 'https://bethelmind-lead-engine.fly.dev',
    priority: 3,
    status: 'ONLINE',
    latencyMs: 120,
    successCount: 0,
    errorCount: 0,
    lastChecked: Date.now()
  },
  {
    id: 'render',
    name: 'Render (Web Service / Worker)',
    url: 'https://apexreach-247-worker.onrender.com',
    priority: 4,
    status: 'ONLINE',
    latencyMs: 320,
    successCount: 0,
    errorCount: 0,
    lastChecked: Date.now()
  },
  {
    id: 'local',
    name: 'Local Machine (Background Runner)',
    url: 'http://localhost:3000',
    priority: 5,
    status: 'ONLINE',
    latencyMs: 10,
    successCount: 0,
    errorCount: 0,
    lastChecked: Date.now()
  }
];

class AdaptiveHostManager {
  private hosts: HostMetric[] = [...DEFAULT_HOSTS];

  public getHosts(): HostMetric[] {
    return this.hosts;
  }

  public recordSuccess(urlOrId: string, latencyMs: number) {
    const host = this.findHost(urlOrId);
    if (host) {
      host.successCount++;
      host.latencyMs = Math.round((host.latencyMs * 0.7) + (latencyMs * 0.3));
      host.status = 'ONLINE';
      host.lastChecked = Date.now();
    }
  }

  public recordError(urlOrId: string, errorMsg?: string) {
    const host = this.findHost(urlOrId);
    if (host) {
      host.errorCount++;
      host.lastErrorMsg = errorMsg || 'Execution failed';
      if (host.errorCount >= 3) {
        host.status = 'OFFLINE';
      } else {
        host.status = 'DEGRADED';
      }
      host.lastChecked = Date.now();
    }
  }

  public getOptimalHost(): HostMetric {
    // Sort by:
    // 1. Status (ONLINE first, then DEGRADED, then OFFLINE)
    // 2. Priority weight (1 = highest priority Fly.io, 2 = GitHub Actions, etc.)
    // 3. Latency (faster first)
    const sorted = [...this.hosts].sort((a, b) => {
      const statusScore = { ONLINE: 0, DEGRADED: 1, OFFLINE: 2 };
      if (statusScore[a.status] !== statusScore[b.status]) {
        return statusScore[a.status] - statusScore[b.status];
      }
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.latencyMs - b.latencyMs;
    });

    return sorted[0] || DEFAULT_HOSTS[0];
  }

  public addHostEndpoint(name: string, url: string, priority: number = 1) {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newHost: HostMetric = {
      id,
      name,
      url,
      priority,
      status: 'ONLINE',
      latencyMs: 150,
      successCount: 0,
      errorCount: 0,
      lastChecked: Date.now()
    };
    this.hosts.push(newHost);
    return newHost;
  }

  public registerMultiAccountEndpoints(urls: string[]) {
    urls.forEach((url, idx) => {
      if (url && url.trim() && !this.hosts.some(h => h.url === url.trim())) {
        this.addHostEndpoint(`Multi-Account Host #${idx + 1}`, url.trim(), 1);
      }
    });
  }

  private findHost(urlOrId: string): HostMetric | undefined {
    return this.hosts.find(h => h.id === urlOrId || h.url === urlOrId || urlOrId.includes(h.id));
  }
}

export const adaptiveHostManager = new AdaptiveHostManager();
export function getOptimalHostUrl(): string {
  return adaptiveHostManager.getOptimalHost().url;
}

