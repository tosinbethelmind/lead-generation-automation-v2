import { NextRequest, NextResponse } from 'next/server';

const VPS_HOST = process.env.VPS_HOST || '169.58.182.92';
const VIN_SERVICE_PORT = process.env.VIN_SERVICE_PORT || '5000';
const BACKEND_URL = `http://${VPS_HOST}:${VIN_SERVICE_PORT}`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const subpath = slug ? slug.join('/') : '';
    const searchParams = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/api/${subpath}${searchParams}`;

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Bethelmind-Web-Proxy/1.0',
      },
      next: { revalidate: 0 },
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('[vin-proxy GET error]:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to reach VPS VIN engine. Please try again shortly.' },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await params;
    const subpath = slug ? slug.join('/') : '';
    const searchParams = request.nextUrl.search;
    const targetUrl = `${BACKEND_URL}/api/${subpath}${searchParams}`;

    const body = await request.json().catch(() => ({}));

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Bethelmind-Web-Proxy/1.0',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('[vin-proxy POST error]:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to reach VPS VIN engine. Please try again shortly.' },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
