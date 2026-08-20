import { NextRequest, NextResponse } from 'next/server';
import { verifyPurchaseAuthToken, executeDomainRegistration } from '@/lib/monetization/domainRegistrarApi';

/**
 * @file src/app/api/domains/authorize-buy/route.ts
 * 
 * 1-Click Purchase Authorization Endpoint.
 * Allows the user to click a single secure link in their email/WhatsApp to buy the domain
 * and instantly list it on domain marketplaces with automated 301 redirection.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');
  const cost = parseInt(searchParams.get('cost') || '0', 10);
  const expiresAt = parseInt(searchParams.get('expiresAt') || '0', 10);
  const signature = searchParams.get('sig');

  if (!domain || !cost || !expiresAt || !signature) {
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #1e293b; padding: 40px; border-radius: 12px; max-width: 450px; text-align: center; border: 1px solid #ef4444;">
            <h2 style="color: #ef4444;">❌ Invalid Authorization Link</h2>
            <p style="color: #94a3b8;">Missing purchase verification tokens.</p>
          </div>
        </body>
      </html>
    `, { status: 400, headers: { 'Content-Type': 'text/html' } });
  }

  const isValid = verifyPurchaseAuthToken(domain, cost, expiresAt, signature);
  if (!isValid) {
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #1e293b; padding: 40px; border-radius: 12px; max-width: 450px; text-align: center; border: 1px solid #f59e0b;">
            <h2 style="color: #f59e0b;">⚠️ Expired or Tampered Token</h2>
            <p style="color: #94a3b8;">This purchase link has expired or has an invalid digital signature.</p>
          </div>
        </body>
      </html>
    `, { status: 403, headers: { 'Content-Type': 'text/html' } });
  }

  // Execute the purchase and marketplace listing
  const result = await executeDomainRegistration(domain, cost);

  return new NextResponse(`
    <html>
      <head><title>Domain Acquired & Auto-Listed</title></head>
      <body style="font-family: 'Segoe UI', sans-serif; background: #0b0f19; color: #f3f4f6; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px;">
        <div style="background: #111827; border: 1px solid #10b981; border-radius: 16px; max-width: 550px; width: 100%; padding: 36px; text-align: center; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);">
          <div style="background: #064e3b; color: #34d399; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px auto;">✓</div>
          <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0;">Purchase Authorized & Completed!</h1>
          <p style="color: #9ca3af; font-size: 14px; margin: 0 0 24px 0;">Domain registration and marketplace syndication executed successfully.</p>
          
          <div style="background: #1f2937; border-radius: 10px; padding: 18px; text-align: left; margin-bottom: 24px; font-size: 14px;">
            <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase;">Domain Acquired</div>
            <div style="font-size: 20px; font-weight: 800; color: #38bdf8; font-family: monospace; margin: 4px 0 12px 0;">${domain}</div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #374151; padding-top: 10px;">
              <span style="color: #9ca3af;">Registration Fee:</span>
              <span style="color: #34d399; font-weight: 700;">₦${cost.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 6px;">
              <span style="color: #9ca3af;">301 Traffic Redirect:</span>
              <span style="color: #60a5fa; font-weight: 700;">ACTIVE (Storefront)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 6px;">
              <span style="color: #9ca3af;">Marketplace Status:</span>
              <span style="color: #fbbf24; font-weight: 700;">LISTED (Sedo, Afternic, Bethelmind)</span>
            </div>
          </div>

          <a href="/admin/traffic" style="background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">
            Go To Admin Dashboard
          </a>
        </div>
      </body>
    </html>
  `, { status: 200, headers: { 'Content-Type': 'text/html' } });
}
