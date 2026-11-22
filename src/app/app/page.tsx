import { redirect } from 'next/navigation';

export default async function AppRedirect() {
  // Default App Boot: Directly launch SME Command Center
  redirect(`/api/admin/login?token=bethelmind_admin_2026&redirect=${encodeURIComponent('/admin/mobile')}`);
}
