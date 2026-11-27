import React from 'react';
import { readFoodsStore } from '@/lib/foods-store';
import FoodsLandingClient from '@/components/foods/FoodsLandingClient';

export const dynamic = 'force-dynamic';

export default function BethelmindFoodsPage() {
  const store = readFoodsStore();

  return (
    <FoodsLandingClient
      initialProducts={store.products}
      initialProteins={store.proteins}
      initialSettings={store.settings}
    />
  );
}
