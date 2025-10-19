import { Metadata } from "next";
import { siteConfig } from "./site";

/**
 * SEO and Metadata Utilities
 * Generate consistent, SEO-optimized metadata across all pages
 */

interface PageSEO {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  noindex?: boolean;
}

/**
 * Generate complete metadata for a page
 * Follows Next.js 15 App Router metadata conventions
 */
export function generateMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url,
  keywords = siteConfig.keywords,
  noindex = false,
}: PageSEO = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

  return {
    title: pageTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.name,
    metadataBase: new URL(siteConfig.url),

    // OpenGraph
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: pageUrl,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
      creator: siteConfig.author,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Icons
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },

    // Manifest
    manifest: "/site.webmanifest",

    // Verification
    verification: {
      google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },

    // Alternate languages
    alternates: {
      canonical: pageUrl,
      languages: {
        "id-ID": pageUrl,
        "en-US": `${pageUrl}/en`,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for local business
 */
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jawa Timur",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Add actual coordinates if available
      latitude: 0,
      longitude: 0,
    },
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    priceRange: "$$",
    openingHours: "Mo-Su 06:00-18:00",
    sameAs: [siteConfig.social.instagram],
  };
}

/**
 * Generate JSON-LD for organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      contactType: "Customer Service",
      email: siteConfig.contact.email,
      availableLanguage: ["Indonesian", "English"],
    },
    sameAs: [siteConfig.social.instagram],
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
