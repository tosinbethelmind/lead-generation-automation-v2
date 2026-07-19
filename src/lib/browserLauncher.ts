import puppeteer from 'puppeteer-core';
import os from 'os';
import fs from 'fs';
import net from 'net';
import { getRuntimeConfig } from '@/lib/localConfig';

export function getLocalChromePath(): string {
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

// Key rotation indices
let browserlessIndex = 0;
let browserbaseIndex = 0;
let rotationIndex = 0;

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

/**
 * Signals local Tor instance via Control port to get a new IP identity (SIGNAL NEWNYM)
 */
export function rotateTorIp(controlUrl?: string): Promise<boolean> {
  return new Promise((resolve) => {
    const url = controlUrl || '127.0.0.1:9051';
    let host = '127.0.0.1';
    let port = 9051;
    
    if (url.includes(':')) {
      const parts = url.split(':');
      host = parts[0] || '127.0.0.1';
      port = parseInt(parts[1], 10) || 9051;
    } else if (url) {
      host = url;
    }
    
    console.log(`[tor] Attempting to rotate Tor IP via control port ${host}:${port}...`);
    
    const socket = new net.Socket();
    socket.setTimeout(4000);
    
    let step = 0;
    
    socket.connect(port, host, () => {
      // Step 1: Authenticate with empty password (default)
      socket.write('AUTHENTICATE ""\r\n');
    });
    
    socket.on('data', (data) => {
      const response = data.toString();
      console.log(`[tor] Control port response: ${response.trim()}`);
      
      if (response.startsWith('250')) {
        if (step === 0) {
          step = 1;
          socket.write('SIGNAL NEWNYM\r\n');
        } else if (step === 1) {
          console.log('[tor] IP rotation signal (SIGNAL NEWNYM) accepted successfully!');
          socket.destroy();
          resolve(true);
        }
      } else {
        console.error(`[tor] Unexpected response from Tor control port: ${response.trim()}`);
        socket.destroy();
        resolve(false);
      }
    });
    
    socket.on('error', (err) => {
      console.error(`[tor] Failed to connect to Tor control port: ${err.message}`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('timeout', () => {
      console.error('[tor] Tor control port connection timed out.');
      socket.destroy();
      resolve(false);
    });
  });
}

function getActiveProxy(config: any, triedProxies: Set<string> = new Set()): string | undefined {
  let list: string[] = [];
  if (config.proxyPool) {
    list = config.proxyPool.split(/[,\n]+/).map((p: string) => p.trim()).filter(Boolean);
  }
  if (config.webshareProxies && Array.isArray(config.webshareProxies)) {
    for (const p of config.webshareProxies) {
      const trimmed = p.trim();
      if (trimmed && !list.includes(trimmed)) {
        list.push(trimmed);
      }
    }
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
  const provider = savedConfig.activeBrowserProvider || 'local';
  console.log(`[browserLauncher] Launching browser using provider: ${provider}`);

  // Base arguments for local Chromium or Tor SOCKS5 launches
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

  if (provider === 'tor') {
    const torProxy = savedConfig.torProxyUrl || 'socks5://127.0.0.1:9050';
    args.push(`--proxy-server=${torProxy}`);
    console.log(`[browserLauncher] Appending Tor Proxy argument: ${torProxy}`);
    try {
      await rotateTorIp(savedConfig.torControlUrl);
    } catch (e: any) {
      console.error('[browserLauncher] Tor IP rotation failed:', e.message);
    }
  } else if (activeProxy) {
    args.push(`--proxy-server=${activeProxy}`);
    console.log('[browserLauncher] Using active proxy server:', activeProxy);
  }

  // Determine WebSocket Endpoint if remote provider is selected
  let wsUrls: string[] = [];

  if (provider === 'browserless') {
    const keys = savedConfig.browserlessApiKeys || [];
    if (keys.length > 0) {
      const idx = browserlessIndex++ % keys.length;
      const key = keys[idx];
      let url = `wss://chrome.browserless.io?token=${key}`;
      if (activeProxy) {
        url += `&--proxy-server=${encodeURIComponent(activeProxy)}`;
      }
      wsUrls.push(url);
    }
  } else if (provider === 'browserbase') {
    const keys = savedConfig.browserbaseApiKeys || [];
    if (keys.length > 0) {
      const idx = browserbaseIndex++ % keys.length;
      const key = keys[idx];
      let url = `wss://connect.browserbase.com?apiKey=${key}`;
      if (activeProxy) {
        url += `&--proxy-server=${encodeURIComponent(activeProxy)}`;
      }
      wsUrls.push(url);
    }
  } else if (provider === 'rotation') {
    const browserlessKeys = savedConfig.browserlessApiKeys || [];
    const browserbaseKeys = savedConfig.browserbaseApiKeys || [];
    
    browserlessKeys.forEach((key: string) => {
      let url = `wss://chrome.browserless.io?token=${key}`;
      if (activeProxy) url += `&--proxy-server=${encodeURIComponent(activeProxy)}`;
      wsUrls.push(url);
    });

    browserbaseKeys.forEach((key: string) => {
      let url = `wss://connect.browserbase.com?apiKey=${key}`;
      if (activeProxy) url += `&--proxy-server=${encodeURIComponent(activeProxy)}`;
      wsUrls.push(url);
    });

    if (wsUrls.length > 0) {
      const rotationIdx = rotationIndex++ % wsUrls.length;
      wsUrls = [wsUrls[rotationIdx], ...wsUrls.slice(rotationIdx + 1), ...wsUrls.slice(0, rotationIdx)];
    }
  }

  // Fallback to legacy remoteBrowserWs if explicit pools are empty
  if (wsUrls.length === 0 && provider !== 'local' && provider !== 'tor') {
    const remoteWs =
      process.env.REMOTE_BROWSER_WS ||
      process.env.BROWSERLESS_WS ||
      savedConfig.remoteBrowserWs ||
      '';
    if (remoteWs) {
      wsUrls = remoteWs.split(',').map((u: string) => u.trim()).filter(Boolean).map((url: string) => {
        let finalUrl = url;
        if (!finalUrl.startsWith('ws://') && !finalUrl.startsWith('wss://')) {
          finalUrl = `wss://chrome.browserless.io?token=${finalUrl}`;
        }
        if (activeProxy) {
          const separator = finalUrl.includes('?') ? '&' : '?';
          return `${finalUrl}${separator}--proxy-server=${encodeURIComponent(activeProxy)}`;
        }
        return finalUrl;
      });
    }
  }

  // Attempt WebSocket connection if URLs are available
  if (wsUrls.length > 0) {
    let lastError: any = null;
    for (let i = 0; i < wsUrls.length; i++) {
      const finalWs = wsUrls[i];
      const safeWsUrl = finalWs.split('?')[0];
      console.log(`[browserLauncher] Connecting to remote Chrome browser [endpoint ${i + 1}/${wsUrls.length}]: ${safeWsUrl}`);
      
      try {
        const browser = await Promise.race([
          puppeteer.connect({ browserWSEndpoint: finalWs }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Remote browser connect timed out after 10s')), 10000)
          )
        ]);
        console.log(`[browserLauncher] Connected successfully to remote browser endpoint ${i + 1}/${wsUrls.length}`);
        return browser;
      } catch (err: any) {
        console.error(`[browserLauncher] Failed to connect to remote browser endpoint ${i + 1}/${wsUrls.length}:`, err.message);
        lastError = err;
      }
    }
    console.warn('[browserLauncher] All configured remote browser WebSocket endpoints failed. Falling back to local Chromium.');
  } else if (provider !== 'local' && provider !== 'tor') {
    console.warn(`[browserLauncher] Active browser provider is "${provider}" but no API credentials or remote browser WebSocket endpoints were configured. Falling back to local Chromium browser.`);
  }

  // Local launch
  const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
  if (isServerless) {
    try {
      const chromium = (await import(/* webpackIgnore: true */ '@sparticuz/chromium')).default as any;
      if (typeof chromium.setGraphicsMode === 'function') {
        chromium.setGraphicsMode(false);
      }
      const launchArgs = [...chromium.args];
      if (provider === 'tor') {
        launchArgs.push(`--proxy-server=${savedConfig.torProxyUrl || 'socks5://127.0.0.1:9050'}`);
      } else if (activeProxy) {
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
