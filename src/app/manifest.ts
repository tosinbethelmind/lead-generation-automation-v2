import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bethelmind Digital Solutions',
    short_name: 'Bethelmind',
    description: 'Autonomous B2B Growth Engine, Commercial Calculators & Sector Sizers',
    start_url: '/home',
    display: 'standalone',
    background_color: '#070a12',
    theme_color: '#0b121e',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48 72x72 96x96 128x128 256x256',
        type: 'image/x-icon'
      }
    ]
  };
}
