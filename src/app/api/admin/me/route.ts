import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getAdminUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin-token')?.value;
    const session = await verifySessionToken(cookieValue);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = getAdminUser(session.token);
    if (!adminUser) {
      return NextResponse.json({ error: 'Session user no longer exists' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role,
        permissions: adminUser.permissions
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
