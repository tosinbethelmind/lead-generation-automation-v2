import React from 'react';
import { readFoodsStore, sanitizeFoodsStoreForPublic } from '@/lib/foods-store';
import FoodsLandingClient from '@/components/foods/FoodsLandingClient';

export const dynamic = 'force-dynamic';

export default function BethelmindFoodsPage() {
  const publicStore = sanitizeFoodsStoreForPublic(readFoodsStore());

  return (
    <FoodsLandingClient
      initialProducts={publicStore.products}
      initialProteins={publicStore.proteins}
      initialSettings={publicStore.settings}
    />
  );
}
