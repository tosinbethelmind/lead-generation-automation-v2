import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('assistant-token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }

  const user = getAdminUser(token);

  if (!user || user.role !== 'admin_assistant') {
    return NextResponse.json({ success: false, error: 'Invalid or expired assistant session' }, { status: 401 });
  }

  return NextResponse.json({ success: true, user });
}
