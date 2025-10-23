"use client";

import { Geist, Geist_Mono, Parkinsans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatAssistant } from "@/components/chat-assistant";
import { StructuredData } from "@/components/structured-data";
import { usePathname } from "next/navigation";
import "./globals.css";

// SEO Metadata
export const metadata = {
  metadataBase: new URL('https://karangtawulan.vercel.app'),
  title: {
    default: 'Pantai Karangtawulan Tasikmalaya - Wisata Pantai Terbaik Jawa Barat',
    template: '%s | Pantai Karangtawulan'
  },
  description: 'Wisata Pantai Karangtawulan Tasikmalaya - Paket tour murah mulai 100rb, penginapan nyaman, sunset & sunrise indah. Booking sekarang via WhatsApp!',
  keywords: [
    'pantai karangtawulan',
    'karangtawulan',
    'wisata tasikmalaya',
    'pantai tasikmalaya',
    'pantai di tasikmalaya',
    'rekomendasi pantai tasikmalaya',
    'pantai terindah tasikmalaya',
    'wisata pantai jawa barat',
    'paket wisata karangtawulan',
    'penginapan karangtawulan',
    'sunset karangtawulan',
    'tour karangtawulan',
    'destinasi wisata tasikmalaya',
    'pantai selatan jawa barat'
  ],
  authors: [{ name: 'Pantai Karangtawulan' }],
  creator: 'Pantai Karangtawulan',
  publisher: 'Pantai Karangtawulan',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://karangtawulan.vercel.app',
    title: 'Pantai Karangtawulan Tasikmalaya - Wisata Pantai Terbaik Jawa Barat',
    description: 'Wisata Pantai Karangtawulan Tasikmalaya - Paket tour murah mulai 100rb, penginapan nyaman, sunset & sunrise indah. Booking sekarang!',
    siteName: 'Pantai Karangtawulan',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pantai Karangtawulan Tasikmalaya',
    description: 'Wisata Pantai Terbaik di Jawa Barat - Paket Tour Murah & Penginapan Nyaman',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Ganti dengan kode dari Google Search Console
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/dashboard") || pathname?.startsWith("/api/auth");

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parkinsans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {!isAdminRoute && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <ChatAssistant />}
        </ThemeProvider>
      </body>
    </html>
  );
}
