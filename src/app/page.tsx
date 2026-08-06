/**
 * Root route — redirects to the public homepage.
 * The actual homepage content lives at /home/page.tsx to keep it clean.
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
}
