import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Order Fresh Nigerian Soups & Rice in Litres | Bethelmind Foods',
  description:
    'Order freshly prepared Nigerian soups, jollof rice, fried rice and assorted meals in litres. Hygienically prepared and conveniently delivered. Order on WhatsApp.',
  keywords: [
    'Nigerian soups for sale',
    'ready-made Nigerian soups',
    'homemade Nigerian food delivery',
    'Jollof rice and fried rice',
    'Nigerian soups in litres',
    'bulk food orders Ogun State',
    'Egusi soup in litres',
    'Afang soup delivery',
    'small chops and catering Ishasi',
    'Bethelmind Foods and Catering Services',
  ],
  openGraph: {
    title: 'Order Fresh Nigerian Soups & Rice in Litres | Bethelmind Foods',
    description:
      'Taste the Real Nigerian Flavour! Freshly prepared Nigerian soups, Jollof rice, Fried rice, and small chops packed hygienically and delivered to your doorstep.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'Bethelmind Foods & Catering Services',
    images: [
      {
        url: '/foods/hero-feast.jpg',
        width: 1200,
        height: 675,
        alt: 'Bethelmind Foods & Catering Services — Fresh Nigerian Soups and Rice',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FoodsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#062315] text-slate-900 antialiased selection:bg-amber-300 selection:text-emerald-950">
      {children}
    </div>
  );
}
