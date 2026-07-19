'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Key, Trash2, ShieldAlert, 
  Check, Copy, RefreshCw, X, Shield, Lock, Eye
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  token: string;
  role: 'super_admin' | 'outreach_manager' | 'designer' | 'viewer';
  permissions: string[];
  createdAt: string;
}

const ROLE_PRESETS = {
  super_admin: ['*'],
  outreach_manager: ['view_dashboard', 'view_leads', 'edit_leads', 'trigger_outreach'],
  designer: ['view_dashboard', 'edit_design'],
  viewer: ['view_dashboard', 'view_leads']
};

const ALL_PERMISSIONS = [
  { id: 'view_dashboard', label: 'View Dashboard', desc: 'Can view stats and general dashboard panels' },
  { id: 'view_leads', label: 'View Leads', desc: 'Can view scraped leads list and details' },
  { id: 'edit_leads', label: 'Edit Leads', desc: 'Can modify leads list status and filters' },
  { id: 'trigger_outreach', label: 'Trigger Outreach', desc: 'Can run outreach sequences and webhooks' },
  { id: 'edit_design', label: 'Edit Design', desc: 'Can modify portal styling and design tokens' },
  { id: 'manage_domains', label: 'Manage Domains', desc: 'Can bind custom domains and change hosting settings' },
  { id: 'trigger_deploy', label: 'Trigger Deploy', desc: 'Can trigger production project redeployments' },
  { id: 'manage_team', label: 'Manage Team', desc: 'Can add, edit and delete team members (Super Admin)' },
  { id: 'edit_settings', label: 'Edit Settings', desc: 'Can modify SMTP, database and other core system secrets' }
];

export default function TeamSecurityPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'super_admin' | 'outreach_manager' | 'designer' | 'viewer'>('viewer');
  const [customPermissions, setCustomPermissions] = useState<string[]>(ROLE_PRESETS.viewer);
  const [submitting, setSubmitting] = useState(false);

  // Generated token reveal states
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refresh members list
  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch team members');
      setMembers(data.teamMembers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Update permissions when role preset changes
  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
    setCustomPermissions(ROLE_PRESETS[newRole]);
  };

  const handlePermissionToggle = (permId: string) => {
    if (customPermissions.includes('*')) {
      // If super admin override is active, toggle standard permissions around it
      if (permId === '*') {
        setCustomPermissions([]);
      } else {
        setCustomPermissions(ALL_PERMISSIONS.map(p => p.id).filter(id => id !== permId));
      }
    } else {
      if (customPermissions.includes(permId)) {
        setCustomPermissions(customPermissions.filter(p => p !== permId));
      } else {
        setCustomPermissions([...customPermissions, permId]);
      }
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          role,
          permissions: customPermissions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add team member');

      setNewToken(data.member.token);
      setName('');
      setEmail('');
      setRole('viewer');
      setCustomPermissions(ROLE_PRESETS.viewer);
      fetchMembers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this team member\'s access token? They will be signed out immediately.')) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke member');
      fetchMembers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const copyTokenToClipboard = () => {
    if (!newToken) return;
    navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleBadgeClass = (memberRole: string) => {
    switch (memberRole) {
      case 'super_admin': return 'badge-danger';
      case 'outreach_manager': return 'badge-success';
      case 'designer': return 'badge-primary';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="team-container">
      {/* ── Dashboard Top Cards ─────────────────────────────────────────── */}
      <div className="bento-grid">
        <div className="bento-card glass-panel main-stat-card">
          <div className="card-header">
            <Users className="card-icon primary-color" />
            <h3>Team Directory</h3>
          </div>
          <div className="stat-content">
            <h2>{loading ? '...' : members.length}</h2>
            <p>Active delegated credentials</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary invite-btn">
            <UserPlus size={16} />
            <span>Create Credentials</span>
          </button>
        </div>

        <div className="bento-card glass-panel security-info-card">
          <div className="card-header">
            <Lock className="card-icon accent-color" />
            <h3>Security Architecture</h3>
          </div>
          <div className="security-status">
            <div className="status-item">
              <span className="bullet success"></span>
              <div>
                <h4>Stateless Session Authentication</h4>
                <p>Tokens signed cryptographically using Web Crypto SHA-256 HMAC.</p>
              </div>
            </div>
            <div className="status-item">
              <span className="bullet primary"></span>
              <div>
                <h4>Granular Role Mapping</h4>
                <p>Team members inherit permission arrays customizable upon invitation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Members Table Section ───────────────────────────────────────── */}
      <div className="table-wrapper glass-panel">
        <div className="table-header">
          <div className="title">
            <h3>Active Accounts</h3>
            <p>Manage existing team access. Tokens are masked for defense-in-depth security.</p>
          </div>
          <button onClick={fetchMembers} className="refresh-btn btn-secondary">
            <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          </button>
        </div>

        {error && (
          <div className="error-alert">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {loading && members.length === 0 ? (
          <div className="table-loading">
            <RefreshCw size={24} className="spinning" />
            <p>Loading credentials directory...</p>
          </div>
        ) : members.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h4>No Team Members Found</h4>
            <p>Get started by creating credentials for your teammates.</p>
            <button onClick={() => setIsModalOpen(true)} className="btn-primary">
              <UserPlus size={16} />
              <span>Create Credentials</span>
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="members-table">
              <thead>
                <tr>
                  <th>Teammate</th>
                  <th>Role</th>
                  <th>Granted Permissions</th>
                  <th>Created</th>
                  <th className="actions-cell">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="member-row">
                    <td>
                      <div className="user-info">
                        <div className="avatar">{member.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="name">{member.name}</div>
                          <div className="email">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(member.role)}`}>
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="permissions-chips">
                        {member.permissions.includes('*') ? (
                          <span className="permission-chip admin-chip">All Access (*)</span>
                        ) : (
                          member.permissions.map(perm => (
                            <span key={perm} className="permission-chip">
                              {perm.replace('_', ' ')}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(member.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={() => handleDeleteMember(member.id)}
                        className="btn-danger-icon"
                        title="Revoke Token Access"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create Team Member Modal ────────────────────────────────────── */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel animated-scale">
            <div className="modal-header">
              <h3>Create Team Credentials</h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setNewToken(null);
                }} 
                className="close-btn"
              >
                <X size={18} />
              </button>
            </div>

            {newToken ? (
              // ── Token Reveal View ──────────────────────────────────────────
              <div className="token-reveal-view">
                <div className="icon-wrapper">
                  <Key size={32} className="accent-color" />
                </div>
                <h3>Secure Token Generated</h3>
                <p className="warning-text">
                  Make sure to copy the token below. For security reasons, it will <strong>never</strong> be shown again.
                </p>

                <div className="token-box">
                  <code>{newToken}</code>
                  <button onClick={copyTokenToClipboard} className="btn-primary copy-btn">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy Token'}</span>
                  </button>
                </div>

                <div className="instructions">
                  <h4>How to sign in:</h4>
                  <p>Teammates can log in by entering this secret token on the Login screen, or directly by navigating to:</p>
                  <code className="url-code">
                    {window.location.origin}/admin?token={newToken}
                  </code>
                </div>

                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewToken(null);
                  }} 
                  className="btn-primary finish-btn"
                >
                  Close & Done
                </button>
              </div>
            ) : (
              // ── Create Form View ───────────────────────────────────────────
              <form onSubmit={handleCreateMember} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Samuel Adewale" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="e.g. samuel@bethelmind.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Role Preset</label>
                  <select 
                    value={role} 
                    onChange={e => handleRoleChange(e.target.value as any)}
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="designer">Designer (Styling only)</option>
                    <option value="outreach_manager">Outreach Manager (Campaigns & Leads)</option>
                    <option value="super_admin">Super Admin (All Access)</option>
                  </select>
                </div>

                <div className="form-group permissions-group">
                  <label>Granular Permissions Override</label>
                  <div className="permissions-selector">
                    {ALL_PERMISSIONS.map((perm) => {
                      const isSelected = customPermissions.includes(perm.id) || customPermissions.includes('*');
                      const isDisabled = role === 'super_admin'; // Super admin always gets all
                      return (
                        <div 
                          key={perm.id} 
                          className={`permission-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                          onClick={() => !isDisabled && handlePermissionToggle(perm.id)}
                        >
                          <div className="checkbox">
                            {isSelected && <Check size={12} />}
                          </div>
                          <div className="text">
                            <span className="label">{perm.label}</span>
                            <span className="desc">{perm.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submitting} 
                    className="btn-primary"
                  >
                    {submitting ? 'Creating...' : 'Generate Access Token'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Page CSS Styles ────────────────────────────────────────────── */}
      <style jsx>{`
        .team-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .primary-color { color: var(--primary, #06b6d4); }
        .accent-color { color: var(--accent, #f59e0b); }

        /* stat card styling */
        .main-stat-card {
          position: relative;
        }
        .stat-content {
          margin: 16px 0 20px 0;
        }
        .stat-content h2 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0;
          color: #f8fafc;
          line-height: 1.1;
        }
        .stat-content p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 4px 0 0 0;
        }
        .invite-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* security card styling */
        .security-status {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 16px;
        }
        .status-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .bullet.success { background-color: #10b981; box-shadow: 0 0 8px #10b981; }
        .bullet.primary { background-color: #06b6d4; box-shadow: 0 0 8px #06b6d4; }
        
        .status-item h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 2px 0;
          color: #f8fafc;
        }
        .status-item p {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 0;
          line-height: 1.4;
        }

        /* Table panel styling */
        .table-wrapper {
          padding: 24px;
        }
        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .table-header .title h3 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        .table-header .title p {
          font-size: 0.85rem;
          color: #94a3b8;
          margin: 0;
        }
        .refresh-btn {
          padding: 8px;
          border-radius: 8px;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #fca5a5;
          font-size: 0.85rem;
          margin-bottom: 20px;
        }

        .table-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 0;
          gap: 12px;
          color: #94a3b8;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 60px 20px;
          color: #64748b;
        }
        .empty-state h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 16px 0 6px 0;
        }
        .empty-state p {
          font-size: 0.85rem;
          max-width: 320px;
          margin: 0 0 20px 0;
          line-height: 1.5;
        }

        /* Members table */
        .table-responsive {
          overflow-x: auto;
        }
        .members-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .members-table th {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .member-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.02);
          transition: background-color 0.2s ease;
        }
        .member-row:hover {
          background-color: rgba(255, 255, 255, 0.01);
        }
        .member-row td {
          padding: 16px;
          font-size: 0.9rem;
          vertical-align: middle;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-info .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--primary, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .user-info .name {
          font-weight: 600;
          color: #f8fafc;
        }
        .user-info .email {
          font-size: 0.75rem;
          color: #64748b;
        }

        /* Badge presets */
        .badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 12px;
          letter-spacing: 0.02em;
        }
        .badge-danger { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.2); }
        .badge-success { background: rgba(16, 185, 129, 0.15); color: #a7f3d0; border: 1px solid rgba(16, 185, 129, 0.2); }
        .badge-primary { background: rgba(6, 182, 212, 0.15); color: #a5f3fc; border: 1px solid rgba(6, 182, 212, 0.2); }
        .badge-secondary { background: rgba(148, 163, 184, 0.15); color: #e2e8f0; border: 1px solid rgba(148, 163, 184, 0.2); }

        .permissions-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .permission-chip {
          font-size: 0.7rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #94a3b8;
          padding: 2px 6px;
          border-radius: 4px;
          text-transform: capitalize;
        }
        .permission-chip.admin-chip {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.2);
          color: #fde68a;
        }

        .date-cell {
          color: #64748b;
          font-size: 0.8rem;
        }
        .actions-cell {
          text-align: right;
          width: 80px;
        }
        .btn-danger-icon {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .btn-danger-icon:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        /* Modal backdrop and card styling */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(3, 7, 18, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          width: 100%;
          max-width: 540px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .modal-header h3 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }
        .close-btn:hover {
          color: #f8fafc;
          background: rgba(255, 255, 255, 0.05);
        }

        /* Form elements */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
        }
        .form-group input, .form-group select {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 14px;
          color: #f8fafc;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: var(--primary, #06b6d4);
          background: rgba(255, 255, 255, 0.04);
        }
        .form-group select option {
          background-color: #0d1220;
          color: #f8fafc;
        }

        /* Permissions selector checkbox list */
        .permissions-group label {
          margin-bottom: 4px;
        }
        .permissions-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 220px;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 8px;
        }
        .permission-item {
          display: flex;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .permission-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }
        .permission-item.selected {
          background: rgba(6, 182, 212, 0.05);
          border-color: rgba(6, 182, 212, 0.1);
        }
        .permission-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .permission-item .checkbox {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid #475569;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .permission-item.selected .checkbox {
          border-color: var(--primary, #06b6d4);
          background-color: var(--primary, #06b6d4);
          color: #07090e;
        }

        .permission-item .text {
          display: flex;
          flex-direction: column;
        }
        .permission-item .text .label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #e2e8f0;
        }
        .permission-item .text .desc {
          font-size: 0.7rem;
          color: #64748b;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        /* Token reveal style */
        .token-reveal-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 0;
        }
        .token-reveal-view .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(245, 158, 11, 0.1);
          border: 1.5px solid rgba(245, 158, 11, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .token-reveal-view h3 {
          font-family: var(--font-title, 'Outfit', sans-serif);
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        .warning-text {
          font-size: 0.85rem;
          color: #fca5a5;
          max-width: 400px;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }
        
        .token-box {
          width: 100%;
          background: #090e1a;
          border: 1px dashed rgba(245, 158, 11, 0.4);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }
        .token-box code {
          font-family: var(--font-mono, monospace);
          font-size: 0.95rem;
          color: #fde68a;
          word-break: break-all;
          text-align: left;
        }
        .copy-btn {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
        }

        .instructions {
          width: 100%;
          text-align: left;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 24px;
        }
        .instructions h4 {
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #f8fafc;
        }
        .instructions p {
          font-size: 0.75rem;
          color: #94a3b8;
          margin: 0 0 10px 0;
          line-height: 1.4;
        }
        .url-code {
          display: block;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          color: var(--primary, #06b6d4);
          word-break: break-all;
        }
        .finish-btn {
          width: 100%;
          padding: 12px;
        }

        /* Animations */
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animated-scale {
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        @media (max-width: 768px) {
          .table-header {
            flex-direction: column;
            gap: 12px;
          }
          .members-table th {
            display: none; /* simple stack on mobile */
          }
          .members-table td {
            display: block;
            border: none;
            padding: 8px 16px;
          }
          .member-row {
            display: block;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .actions-cell {
            text-align: left;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
