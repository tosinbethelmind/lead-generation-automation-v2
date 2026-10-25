import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitizedFilename = path.basename(filename);

    // 1. Check local public/reports directory
    const localPath = path.join(process.cwd(), 'public', 'reports', sanitizedFilename);
    if (fs.existsSync(localPath)) {
      const fileBuffer = fs.readFileSync(localPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${sanitizedFilename}"`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    // 2. Fallback to VPS backend port 5000 if running in cloud/Vercel
    const vpsHost = process.env.VPS_HOST || '169.58.182.92';
    const vpsUrl = `http://${vpsHost}:5000/reports/${sanitizedFilename}`;
    try {
      const vpsRes = await fetch(vpsUrl, { cache: 'no-store' });
      if (vpsRes.ok) {
        const buffer = await vpsRes.arrayBuffer();
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${sanitizedFilename}"`,
          },
        });
      }
    } catch (e) {
      // VPS fetch failed
    }

    return NextResponse.json(
      { error: 'Report not found or still generating. Please query the VIN tool directly.' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
