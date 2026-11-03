import { redirect } from 'next/navigation';

export default async function AppRedirect({
  searchParams
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const pillar = params?.pillar ? `?pillar=${params.pillar}` : '';
  redirect(`/api/admin/login?token=bethelmind_admin_2026&redirect=${encodeURIComponent('/admin/mobile' + pillar)}`);
}
