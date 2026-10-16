import { redirect } from 'next/navigation';

export default function WebAppRedirect() {
  redirect('/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile');
}
