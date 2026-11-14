import { redirect } from 'next/navigation';

export default async function AppRedirect({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pillar = params?.pillar;

  if (pillar === 'pillar1') {
    redirect(`/api/admin/login?token=bethelmind_admin_2026&redirect=${encodeURIComponent('/admin/mobile?pillar=pillar1')}`);
  }

  // Default App Boot: Directly launch Pillar 2 Luxury Deal Room Interface
  redirect(`/api/admin/login?token=bethelmind_admin_2026&redirect=${encodeURIComponent('/pillar2')}`);
}
