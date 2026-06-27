// src/app/api/config/test-browser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

/**
 * POST /api/config/test-browser
 * Body: { wsUrl: string }
 *
 * Attempts a Puppeteer WebSocket connection to the provided remote browser
 * endpoint (e.g. Browserless.io). Returns success/failure so the Settings UI
 * can validate the URL before saving.
 */
export async function POST(req: NextRequest) {
  let browser: any = null;
  try {
    const { wsUrl } = await req.json();

    if (!wsUrl || typeof wsUrl !== 'string' || !wsUrl.startsWith('ws')) {
      return NextResponse.json(
        { success: false, error: 'Invalid WebSocket URL. Must start with ws:// or wss://' },
        { status: 400 }
      );
    }

    // Attempt connection with a 10-second timeout
    const connectPromise = puppeteer.connect({ browserWSEndpoint: wsUrl });
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out after 10 seconds')), 10_000)
    );

    browser = await Promise.race([connectPromise, timeoutPromise]);

    // Quick smoke test — open a blank page and close it
    const page = await browser.newPage();
    await page.close();

    return NextResponse.json({
      success: true,
      message: 'Remote browser connected and responsive.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown connection error' },
      { status: 500 }
    );
  } finally {
    // Disconnect without closing the remote browser process
    if (browser) {
      try { browser.disconnect(); } catch (_) { /* ignore */ }
    }
  }
}
