import { redirect } from 'next/navigation';

/**
 * Reconciles legacy /solutions route to the canonical paid-advertising
 * conversion page at /business-solutions while preserving /solutions/[sector].
 */
export default function SolutionsRedirectPage() {
  redirect('/business-solutions');
}
