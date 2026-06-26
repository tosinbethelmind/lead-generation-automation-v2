import puppeteer from 'puppeteer-core';
import os from 'os';
import fs from 'fs';

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
