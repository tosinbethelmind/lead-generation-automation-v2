import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/session';
import { getAdminUser, checkPermission } from '@/lib/auth';
import { getLocalConfig, saveLocalConfig, type TeamMember } from '@/lib/localConfig';

export const dynamic = 'force-dynamic';

// Helper to authenticate request and verify permission
async function getAuthorizedUser(req: NextRequest, permission: string) {
  const cookieValue = req.cookies.get('admin-token')?.value;
  const session = await verifySessionToken(cookieValue);

  if (!session) return null;

  const adminUser = getAdminUser(session.token);
  if (!adminUser || !checkPermission(adminUser, permission)) {
    return null;
  }

  return adminUser;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthorizedUser(req, 'manage_team');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden. manage_team permission required.' }, { status: 403 });
    }

    const config = getLocalConfig();
    const teamMembers = config.teamMembers || [];

    // Mask tokens before returning
    const safeMembers = teamMembers.map(m => ({
      ...m,
      token: '••••••••'
    }));

    return NextResponse.json({
      success: true,
      teamMembers: safeMembers
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthorizedUser(req, 'manage_team');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden. manage_team permission required.' }, { status: 403 });
    }

    const { name, email, role, permissions } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields (name, email, role)' }, { status: 400 });
    }

    const validRoles = ['super_admin', 'outreach_manager', 'designer', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Generate secure token and ID using Web Crypto
    const token = 'reach_tkn_' + crypto.randomUUID().replace(/-/g, '');
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name,
      email,
      token,
      role: role as any,
      permissions: permissions || [],
      createdAt: new Date().toISOString()
    };

    const config = getLocalConfig();
    const currentMembers = config.teamMembers || [];

    // Check for duplicate emails
    if (currentMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json({ error: 'Team member with this email already exists' }, { status: 400 });
    }

    const updatedMembers = [...currentMembers, newMember];
    saveLocalConfig({ teamMembers: updatedMembers });

    return NextResponse.json({
      success: true,
      member: newMember // Return raw token once to be copied by the creator
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthorizedUser(req, 'manage_team');
    if (!user) {
      return NextResponse.json({ error: 'Forbidden. manage_team permission required.' }, { status: 403 });
    }

    const url = req.nextUrl.clone();
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required to delete a team member' }, { status: 400 });
    }

    const config = getLocalConfig();
    const currentMembers = config.teamMembers || [];

    const updatedMembers = currentMembers.filter(m => m.id !== id);
    saveLocalConfig({ teamMembers: updatedMembers });

    return NextResponse.json({
      success: true,
      message: 'Team member revoked successfully'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
