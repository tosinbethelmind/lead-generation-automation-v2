import { NextRequest, NextResponse } from 'next/server';
import { ALL_PRODUCTS_DATA } from '@/lib/productsData';
import {
  generateTrafficPackageForProduct,
  generateAllTrafficPackages,
  submitAllStoreProductsToGoogle
} from '@/lib/trafficAutomationMaster';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('product');
    const host = req.headers.get('host') || 'www.bethelmindanalytics.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    if (productId) {
      const product = ALL_PRODUCTS_DATA.find(p => p.id === productId);
      if (!product) {
        return NextResponse.json({ error: `Product '${productId}' not found.` }, { status: 404 });
      }
      const pkg = generateTrafficPackageForProduct(product, baseUrl);
      return NextResponse.json({ success: true, package: pkg });
    }

    const allPackages = generateAllTrafficPackages(baseUrl);
    return NextResponse.json({
      success: true,
      totalCount: allPackages.length,
      packages: allPackages
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action || 'generate_and_save';
    const host = req.headers.get('host') || 'www.bethelmindanalytics.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    if (action === 'ping_google_indexing') {
      const indexingResult = await submitAllStoreProductsToGoogle(baseUrl);
      return NextResponse.json({
        success: true,
        message: 'Google Indexing API triggered for all 16 digital products & store hub.',
        result: indexingResult
      });
    }

    // Default: generate all packages and save to local traffic-queue
    const packages = generateAllTrafficPackages(baseUrl);
    const trafficQueueDir = path.join(process.cwd(), 'data', 'traffic-queue');
    if (!fs.existsSync(trafficQueueDir)) {
      fs.mkdirSync(trafficQueueDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const batchFileName = `traffic_batch_${timestamp}.json`;
    const latestFileName = 'traffic_batch_latest.json';

    fs.writeFileSync(
      path.join(trafficQueueDir, batchFileName),
      JSON.stringify({ generatedAt: new Date().toISOString(), total: packages.length, packages }, null, 2)
    );
    fs.writeFileSync(
      path.join(trafficQueueDir, latestFileName),
      JSON.stringify({ generatedAt: new Date().toISOString(), total: packages.length, packages }, null, 2)
    );

    return NextResponse.json({
      success: true,
      message: `Generated and cached ${packages.length} multi-channel traffic assets.`,
      batchFile: batchFileName,
      packagesCount: packages.length,
      samplePackage: packages[0]
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
