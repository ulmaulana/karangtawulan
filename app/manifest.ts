import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pantai Karangtawulan - Wisata Pantai Tasikmalaya',
    short_name: 'Karangtawulan',
    description: 'Wisata Pantai Karangtawulan Tasikmalaya - Paket Tour, Penginapan, dan Destinasi Wisata Terbaik di Jawa Barat',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0891b2',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
