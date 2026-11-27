import React from 'react';
import type { Metadata } from 'next';
import FoodsAdminClient from '@/components/foods/FoodsAdminClient';

export const metadata: Metadata = {
  title: 'Admin Portal | Bethelmind Foods & Catering Services',
  robots: { index: false, follow: false },
};

export default function BethelmindFoodsAdminPage() {
  return <FoodsAdminClient />;
}
