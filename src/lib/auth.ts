import { getRuntimeConfig, type TeamMember } from './localConfig';

export type AdminRole = 'super_admin' | 'outreach_manager' | 'designer' | 'viewer';

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
  if (!token) return null;

  const masterToken = process.env.ADMIN_TOKEN || 'admin_secret_token_123';

  if (token === masterToken) {
    return {
      id: 'admin',
      name: 'Master Admin',
      email: 'admin@bethelmind.com',
      role: 'super_admin',
      permissions: ['*']
    };
  }

  // Load team members from runtime config
  const config = getRuntimeConfig();
  const teamMembers = config.teamMembers || [];

  const found = teamMembers.find(m => m.token === token);
  if (found) {
    // Merge standard role permissions with any customized permissions
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
