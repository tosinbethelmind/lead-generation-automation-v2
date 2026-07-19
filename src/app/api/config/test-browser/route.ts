// src/app/api/config/test-browser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import net from 'net';
import { getLocalChromePath } from '@/lib/browserLauncher';

/**
 * POST /api/config/test-browser
 *
 * Validates browser automation configurations (Local, Tor, Browserless, Browserbase, or Legacy WebSocket).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { wsUrl, provider, apiKey, proxyUrl, controlUrl } = body;

    // 1. Tor Proxy Connection Test
    if (provider === 'tor') {
      const pUrl = proxyUrl || 'socks5://127.0.0.1:9050';
      let host = '127.0.0.1';
      let port = 9050;

      // Extract host and port
      const cleaned = pUrl.replace(/^(socks5:\/\/|socks:\/\/|http:\/\/|https:\/\/)/, '');
      const match = cleaned.split(':');
      if (match.length === 2) {
        host = match[0] || '127.0.0.1';
        port = parseInt(match[1], 10) || 9050;
      } else if (cleaned) {
        host = cleaned;
      }

      console.log(`[test-browser] Testing Tor proxy socket at ${host}:${port}...`);
      
      const testSocket = () => new Promise<boolean>((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000);
        socket.connect(port, host, () => {
          socket.destroy();
          resolve(true);
        });
        socket.on('error', () => {
          socket.destroy();
          resolve(false);
        });
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
      });

      const proxyOk = await testSocket();
      if (!proxyOk) {
        return NextResponse.json({
          success: false,
          error: `Failed to connect to Tor proxy at ${host}:${port}. Make sure your local Tor service is running.`
        });
      }

      // If control port is provided, check it as well
      if (controlUrl) {
        let cHost = '127.0.0.1';
        let cPort = 9051;
        const cCleaned = controlUrl.replace(/^(tcp:\/\/)/, '');
        const cMatch = cCleaned.split(':');
        if (cMatch.length === 2) {
          cHost = cMatch[0] || '127.0.0.1';
          cPort = parseInt(cMatch[1], 10) || 9051;
        } else if (cCleaned) {
          cHost = cCleaned;
        }

        const controlOk = await new Promise<boolean>((resolve) => {
          const socket = new net.Socket();
          socket.setTimeout(3000);
          socket.connect(cPort, cHost, () => {
            socket.destroy();
            resolve(true);
          });
          socket.on('error', () => {
            socket.destroy();
            resolve(false);
          });
          socket.on('timeout', () => {
            socket.destroy();
            resolve(false);
          });
        });

        if (!controlOk) {
          return NextResponse.json({
            success: true,
            warning: `Tor SOCKS5 proxy is online, but Tor control port at ${cHost}:${cPort} is unreachable. IP rotation is disabled.`
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Tor proxy and control port connection checks succeeded.'
      });
    }

    // 2. Local Chromium Test
    if (provider === 'local') {
      const localPath = getLocalChromePath();
      if (!localPath) {
        return NextResponse.json({
          success: false,
          error: 'Local Google Chrome or Chromium executable not found on this machine.'
        });
      }
      return NextResponse.json({
        success: true,
        message: `Local Chrome found at: ${localPath}`
      });
    }

    // 3. Remote WebSocket Test (Browserless, Browserbase, or Custom WS URL)
    let testWsUrl = '';
    if (provider === 'browserless') {
      if (!apiKey) return NextResponse.json({ success: false, error: 'API key is required for Browserless.' }, { status: 400 });
      // Support comma-separated keys for browserless provider
      const keys = apiKey.split(/[\n,]+/).map((k: string) => k.trim()).filter(Boolean);
      if (keys.length > 0) {
        testWsUrl = `wss://chrome.browserless.io?token=${keys[0]}`;
      }
    } else if (provider === 'browserbase') {
      if (!apiKey) return NextResponse.json({ success: false, error: 'API key is required for Browserbase.' }, { status: 400 });
      // Support comma-separated keys for browserbase provider
      const keys = apiKey.split(/[\n,]+/).map((k: string) => k.trim()).filter(Boolean);
      if (keys.length > 0) {
        testWsUrl = `wss://connect.browserbase.com?apiKey=${keys[0]}`;
      }
    } else {
      // For legacy/direct config, extract the first URL or token from comma-separated list
      const items = (wsUrl || '').split(/[\n,]+/).map((i: string) => i.trim()).filter(Boolean);
      if (items.length > 0) {
        const firstItem = items[0];
        if (firstItem.startsWith('ws://') || firstItem.startsWith('wss://')) {
          testWsUrl = firstItem;
        } else {
          // It's a raw browserless API token
          testWsUrl = `wss://chrome.browserless.io?token=${firstItem}`;
        }
      }
    }

    if (!testWsUrl || typeof testWsUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid WebSocket URL or Provider credentials.' },
        { status: 400 }
      );
    }

    if (!testWsUrl.startsWith('ws')) {
      return NextResponse.json({
        success: false,
        error: `WebSocket URL must start with ws:// or wss://`
      }, { status: 400 });
    }

    let currentBrowser: any = null;
    try {
      const connectPromise = puppeteer.connect({ browserWSEndpoint: testWsUrl });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Connection timed out after 10 seconds')), 10_000)
      );

      currentBrowser = await Promise.race([connectPromise, timeoutPromise]);
      const page = await currentBrowser.newPage();
      await page.close();
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        error: `Connection failed: ${err.message || 'Unknown connection error'}`
      });
    } finally {
      if (currentBrowser) {
        try { currentBrowser.disconnect(); } catch (_) {}
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully connected and verified remote browser session.'
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown connection error' },
      { status: 500 }
    );
  }
}
