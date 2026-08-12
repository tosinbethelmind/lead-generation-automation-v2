import { getRuntimeConfig, type TeamMember } from './localConfig';
import { safeCompareStrings } from './security';

export type AdminRole = 'super_admin' | 'outreach_manager' | 'designer' | 'viewer' | 'admin_assistant';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: string[];
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  outreach_manager: [
    'view_dashboard',
    'view_leads',
    'edit_leads',
    'trigger_outreach'
  ],
  designer: [
    'view_dashboard',
    'edit_design'
  ],
  viewer: [
    'view_dashboard',
    'view_leads'
  ],
  admin_assistant: [
    'view_dashboard',
    'view_leads',
    'edit_leads',
    'verify_claims',
    'trigger_outreach',
    'manage_domains'
  ]
};

export const ALL_PERMISSIONS = [
  'view_dashboard',
  'view_leads',
  'edit_leads',
  'trigger_outreach',
  'edit_design',
  'manage_domains',
  'trigger_deploy',
  'manage_team',
  'edit_settings'
];

/**
 * Resolves a secure token to an authenticated AdminUser profile.
 * Supports the master ADMIN_TOKEN as super_admin, as well as team members.
 */
export function getAdminUser(token: string | undefined): AdminUser | null {
  if (!token || typeof token !== 'string') return null;

  const cleanToken = token.trim();
  if (!cleanToken) return null;

  const envMasterToken = (process.env.ADMIN_TOKEN || process.env.ADMIN_PASSWORD || '').trim();

  // Master admin token array restricted to bethelmind_admin_2026 exclusively
  const validMasterTokens = [
    'bethelmind_admin_2026',
    envMasterToken,
  ].filter(Boolean);

  const isMaster = validMasterTokens.some(vt => vt.toLowerCase() === cleanToken.toLowerCase());

  if (isMaster) {
    return {
      id: 'admin',
      name: 'Master Admin',
      email: 'admin@bethelmind.com',
      role: 'super_admin',
      permissions: ['*']
    };
  }

  // Check assistant token (cannot access /admin/* routes)
  const assistantToken = (process.env.ASSISTANT_TOKEN || '').trim();
  if (assistantToken && cleanToken.toLowerCase() === assistantToken.toLowerCase()) {
    return {
      id: 'assistant',
      name: 'Admin Assistant',
      email: 'assistant@bethelmind.com',
      role: 'admin_assistant',
      permissions: ROLE_PERMISSIONS['admin_assistant']
    };
  }

  // Load team members from runtime config
  try {
    const config = getRuntimeConfig();
    const teamMembers = config?.teamMembers || [];

    const found = teamMembers.find(m => m.token && m.token.trim().toLowerCase() === cleanToken.toLowerCase());
    if (found) {
      const standardPermissions = ROLE_PERMISSIONS[found.role as AdminRole] || [];
      const mergedPermissions = Array.from(new Set([
        ...standardPermissions,
        ...(found.permissions || [])
      ]));

      return {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role as AdminRole,
        permissions: mergedPermissions
      };
    }
  } catch (err) {
    console.warn('Failed to resolve team member token:', err);
  }

  return null;
}

/**
 * Checks if a specific admin user profile has the required permission.
 */
export function checkPermission(user: AdminUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'super_admin' || user.permissions.includes('*')) return true;
  return user.permissions.includes(permission);
}
