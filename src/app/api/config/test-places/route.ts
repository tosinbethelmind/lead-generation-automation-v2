import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { apiKey } = await req.json();
    
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API Key is required." }, { status: 400 });
    }

    const testUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=test&key=${apiKey}`;
    const resp = await fetch(testUrl);
    const data = await resp.json();

    if (data.status === 'REQUEST_DENIED') {
      return NextResponse.json({ 
        success: false, 
        error: data.error_message || "Request Denied: Invalid API key or Places API is not enabled." 
      });
    }

    return NextResponse.json({ 
      success: true, 
      status: data.status,
      message: "Connection successful! The API key is valid." 
    });

  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
