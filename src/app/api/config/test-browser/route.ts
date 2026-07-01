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
  try {
    const { wsUrl } = await req.json();

    if (!wsUrl || typeof wsUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid WebSocket URL.' },
        { status: 400 }
      );
    }

    const urls = wsUrl.split(',').map((u: string) => u.trim()).filter(Boolean);
    if (urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid WebSocket URL. Must not be empty.' },
        { status: 400 }
      );
    }

    const errors: string[] = [];
    for (const url of urls) {
      if (!url.startsWith('ws')) {
        errors.push(`URL "${url}" must start with ws:// or wss://`);
        continue;
      }

      let currentBrowser: any = null;
      try {
        // Attempt connection with a 10-second timeout
        const connectPromise = puppeteer.connect({ browserWSEndpoint: url });
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Connection timed out after 10 seconds')), 10_000)
        );

        currentBrowser = await Promise.race([connectPromise, timeoutPromise]);

        // Quick smoke test — open a blank page and close it
        const page = await currentBrowser.newPage();
        await page.close();
      } catch (err: any) {
        errors.push(`URL "${url}" failed: ${err.message || 'Unknown error'}`);
      } finally {
        if (currentBrowser) {
          try { currentBrowser.disconnect(); } catch (_) { /* ignore */ }
        }
      }
    }

    if (errors.length > 0) {
      if (errors.length === urls.length) {
        return NextResponse.json(
          { success: false, error: `All connections failed: ${errors.join('; ')}` },
          { status: 500 }
        );
      } else {
        return NextResponse.json({
          success: true,
          message: `Succeeded with warnings: ${errors.join('; ')}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'All remote browsers connected and responsive.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Unknown connection error' },
      { status: 500 }
    );
  }
}
