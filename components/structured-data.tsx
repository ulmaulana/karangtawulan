import Script from 'next/script'

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Pantai Karangtawulan",
    "description": "Wisata Pantai Karangtawulan Tasikmalaya dengan sunset indah, paket tour murah, dan penginapan nyaman",
    "url": "https://karangtawulan.vercel.app",
    "telephone": "+6282218738881",
    "email": "karangtawulan260@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tasikmalaya",
      "addressRegion": "Jawa Barat",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-7.31",
      "longitude": "108.35"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "06:00",
      "closes": "18:00"
    },
    "priceRange": "Rp 15.000 - Rp 500.000",
    "image": "https://karangtawulan.vercel.app/og-image.jpg",
    "sameAs": [
      "https://instagram.com/karangtawulanofficial",
      "https://tiktok.com/@karangtawulanofficial",
      "https://youtube.com/@pantaikarangtawulanofficial"
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://karangtawulan.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Paket Wisata",
        "item": "https://karangtawulan.vercel.app/paket"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Akomodasi",
        "item": "https://karangtawulan.vercel.app/akomodasi"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Destinasi",
        "item": "https://karangtawulan.vercel.app/destinasi"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Galeri",
        "item": "https://karangtawulan.vercel.app/galeri"
      },
      {
        "@type": "ListItem",
        "position": 6,
        "name": "Kontak",
        "item": "https://karangtawulan.vercel.app/kontak"
      }
    ]
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
