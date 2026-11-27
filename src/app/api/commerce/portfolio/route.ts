import { NextRequest, NextResponse } from 'next/server';
import { resolveAdminRequest } from '@/lib/commerce/adminAuth';
import { listPortfolioEntries, addPortfolioEntry } from '@/lib/commerce/enquiries';

export async function GET() {
  return NextResponse.json({ success: true, items: await listPortfolioEntries() });
}

export async function POST(req: NextRequest) {
  const admin = await resolveAdminRequest(req);
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { title, category, projectType, liveUrl, screenshotUrl, description } = body;

  if (!title || !category || !liveUrl || !description) {
    return NextResponse.json(
      { success: false, error: 'title, category, liveUrl, and description are required' },
      { status: 400 }
    );
  }

  const entry = await addPortfolioEntry({
    title,
    category,
    projectType: projectType === 'completed_client' ? 'completed_client' : 'demonstration',
    liveUrl,
    screenshotUrl,
    description,
  });

  return NextResponse.json({ success: true, item: entry });
}
