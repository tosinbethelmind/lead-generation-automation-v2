import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'downloads', 'bethelmind_business_os.apk');
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/vnd.android.package-archive',
          'Content-Disposition': 'attachment; filename="bethelmind_business_os.apk"',
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }
  } catch (_) {}

  // Fallback to GitHub Release asset
  return NextResponse.redirect(
    'https://github.com/tosinbethelmind/lead-generation-automation-v2/releases/download/mobile-apk-v1.0/bethelmind_business_os-debug.apk',
    302
  );
}
