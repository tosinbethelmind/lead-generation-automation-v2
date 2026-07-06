import puppeteer from 'puppeteer-core';
import os from 'os';
import fs from 'fs';
import { getRuntimeConfig } from '@/lib/localConfig';

function getLocalChromePath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    const paths = [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else if (platform === 'darwin') {
    const paths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  } else {
    const paths = [
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser'
    ];
    for (const p of paths) {
      if (fs.existsSync(p)) return p;
    }
  }
  return '';
}

const proxyFailures = new Map<string, { count: number; lastFailed: number }>();
const TEMPORARY_BLACKLIST_MS = 5 * 60 * 1000; // 5 minutes

export function reportProxyFailure(proxyUrl: string) {
  const current = proxyFailures.get(proxyUrl) || { count: 0, lastFailed: 0 };
  current.count += 1;
  current.lastFailed = Date.now();
  proxyFailures.set(proxyUrl, current);
  console.log(`[browserLauncher] Reported failure for proxy: ${proxyUrl}. Fail count: ${current.count}`);
}

export function reportProxySuccess(proxyUrl: string) {
  proxyFailures.delete(proxyUrl);
}

export function isProxyBlacklisted(proxyUrl: string): boolean {
  const record = proxyFailures.get(proxyUrl);
  if (!record) return false;
  if (record.count >= 2 && (Date.now() - record.lastFailed) < TEMPORARY_BLACKLIST_MS) {
    return true;
  }
  if ((Date.now() - record.lastFailed) >= TEMPORARY_BLACKLIST_MS) {
    proxyFailures.delete(proxyUrl);
    return false;
  }
  return false;
}

function getActiveProxy(config: any, triedProxies: Set<string> = new Set()): string | undefined {
  let list: string[] = [];
  if (config.proxyPool) {
    list = config.proxyPool.split(',').map((p: string) => p.trim()).filter(Boolean);
  }
  if (config.scraperProxy && !list.includes(config.scraperProxy.trim())) {
    list.push(config.scraperProxy.trim());
  }

  // Parse offline proxies from the latest health check
  const offlineProxies = new Set<string>();
  if (config.serviceHealthStatus) {
    try {
      const health = JSON.parse(config.serviceHealthStatus);
      if (health.scraper && Array.isArray(health.scraper.proxies)) {
        for (const p of health.scraper.proxies) {
          if (p.status === 'offline' && p.url) {
            offlineProxies.add(p.url.trim());
          }
        }
      }
    } catch (e) {
      console.error('[browserLauncher] Error parsing serviceHealthStatus:', e);
    }
  }

  const available = list.filter(p => !isProxyBlacklisted(p) && !offlineProxies.has(p) && !triedProxies.has(p));
  if (available.length > 0) {
    const selected = available[Math.floor(Math.random() * available.length)];
    console.log('[browserLauncher] Selected proxy from pool:', selected);
    return selected;
  }

  const fallback = list.filter(p => !triedProxies.has(p));
  if (fallback.length > 0) {
    const selected = fallback[Math.floor(Math.random() * fallback.length)];
    console.log('[browserLauncher] All proxies blacklisted or offline. Fallback to:', selected);
    return selected;
  }

  return undefined;
}

async function launchBrowserInstance(savedConfig: any, activeProxy?: string) {
  const remoteWs =
    process.env.REMOTE_BROWSER_WS ||
    process.env.BROWSERLESS_WS ||
    savedConfig.remoteBrowserWs ||
    '';

  if (remoteWs) {
    try {
      let finalWs = remoteWs;
      if (remoteWs.includes(',')) {
        const urls = remoteWs.split(',').map((u: string) => u.trim()).filter(Boolean);
        if (urls.length > 0) {
          finalWs = urls[Math.floor(Math.random() * urls.length)];
        }
      }

      if (activeProxy) {
        const separator = finalWs.includes('?') ? '&' : '?';
        finalWs = `${finalWs}${separator}--proxy-server=${encodeURIComponent(activeProxy)}`;
        console.log('[browserLauncher] Appending proxy server parameter to remote browser connection string:', activeProxy);
      }
      console.log('[browserLauncher] Connecting to remote Chrome browser:', finalWs);
      const browser = await Promise.race([
        puppeteer.connect({ browserWSEndpoint: finalWs }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Remote browser connect timed out after 10s')), 10000)
        )
      ]);
      return browser;
    } catch (err: any) {
      console.error('[browserLauncher] Failed to connect to remote browser:', err.message);
      throw err;
    }
  }

  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--single-process',
    '--disable-gpu'
  ];
  if (activeProxy) {
    args.push(`--proxy-server=${activeProxy}`);
    console.log('[browserLauncher] Using proxy server:', activeProxy);
  }

  const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
  if (isServerless) {
    try {
      const chromium = (await import('@sparticuz/chromium')).default as any;
      if (typeof chromium.setGraphicsMode === 'function') {
        chromium.setGraphicsMode(false);
      }
      const launchArgs = [...chromium.args];
      if (activeProxy) {
        launchArgs.push(`--proxy-server=${activeProxy}`);
      }
      return await puppeteer.launch({
        args: launchArgs,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless === 'shell' ? 'shell' : chromium.headless,
      });
    } catch (e: any) {
      console.error('Failed to launch Puppeteer with @sparticuz/chromium:', e.message);
      throw e;
    }
  } else {
    const localPath = getLocalChromePath();
    if (localPath) {
      return await puppeteer.launch({
        executablePath: localPath,
        headless: true,
        args
      });
    }
    return await puppeteer.launch({
      headless: true,
      args
    });
  }
}

export async function launchBrowser() {
  const savedConfig = getRuntimeConfig();
  const triedProxies = new Set<string>();
  const maxLaunchAttempts = 4;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxLaunchAttempts; attempt++) {
    const activeProxy = getActiveProxy(savedConfig, triedProxies);
    if (activeProxy) {
      triedProxies.add(activeProxy);
    }

    try {
      const browser = await launchBrowserInstance(savedConfig, activeProxy);
      if (activeProxy) {
        reportProxySuccess(activeProxy);
      }
      return browser;
    } catch (err: any) {
      lastError = err;
      console.error(`[browserLauncher] Launch attempt ${attempt} failed with proxy ${activeProxy || 'direct'}:`, err.message);
      if (activeProxy) {
        reportProxyFailure(activeProxy);
      }
      const remaining = getActiveProxy(savedConfig, triedProxies);
      if (!remaining && !activeProxy) {
        break;
      }
    }
  }

  throw new Error(`Failed to launch browser after ${maxLaunchAttempts} attempts. Last error: ${lastError?.message}`);
}

