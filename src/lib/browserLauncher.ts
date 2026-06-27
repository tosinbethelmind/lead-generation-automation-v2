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

export async function launchBrowser() {
  // Support connecting to a remote browser endpoint (like Browserless.io)
  // to completely bypass Vercel serverless container library limitations (e.g., libnss3.so).
  // Priority: env var > UI-saved config value
  const savedConfig = getRuntimeConfig();
  const remoteWs =
    process.env.REMOTE_BROWSER_WS ||
    process.env.BROWSERLESS_WS ||
    savedConfig.remoteBrowserWs ||
    '';

  if (remoteWs) {
    try {
      console.log('[browserLauncher] Connecting to remote Chrome browser:', remoteWs);
      return await puppeteer.connect({
        browserWSEndpoint: remoteWs
      });
    } catch (err: any) {
      console.error('[browserLauncher] Failed to connect to remote browser, falling back:', err.message);
    }
  }

  const isServerless = !!(process.env.VERCEL || process.env.LAMBDA_TASK_ROOT || process.env.AWS_EXECUTION_ENV);
  if (isServerless) {
    try {
      const chromium = (await import('@sparticuz/chromium')).default as any;
      
      // Disable graphics mode under serverless environment to save memory and prevent crashes
      if (typeof chromium.setGraphicsMode === 'function') {
        chromium.setGraphicsMode(false);
      }
      
      return await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless === 'shell' ? 'shell' : chromium.headless,
      });
    } catch (e: any) {
      console.error('Failed to launch Puppeteer with @sparticuz/chromium:', e.message);
      if (e.message.includes('Failed to launch the browser process') || e.message.includes('libnss3.so') || e.message.includes('Code: 127')) {
        throw new Error(
          'Failed to launch Puppeteer on Vercel/Serverless: Missing OS-level libraries (libnss3.so). ' +
          'To run Puppeteer scrapers in production on Vercel, you must configure a remote browser connection. ' +
          'Please set the environment variable "REMOTE_BROWSER_WS" (or "BROWSERLESS_WS") in your Vercel Dashboard ' +
          'to point to a remote browser endpoint (e.g., from Browserless.io or a self-hosted chromium instance).'
        );
      }
      throw e;
    }
  } else {
    const localPath = getLocalChromePath();
    if (localPath) {
      return await puppeteer.launch({
        executablePath: localPath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
    // Let puppeteer-core try to launch automatically if default location works
    return await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }
}
