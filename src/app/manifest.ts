import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bethelmind Admin Desk',
    short_name: 'Bethelmind',
    description: 'Autonomous B2B Growth Engine & Admin Command Center',
    start_url: '/api/admin/login?token=bethelmind_admin_2026&redirect=/admin/mobile',
    display: 'standalone',
    background_color: '#070a12',
    theme_color: '#0284c7',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48 72x72 96x96 128x128 256x256',
        type: 'image/x-icon'
      }
    ]
  };
}
