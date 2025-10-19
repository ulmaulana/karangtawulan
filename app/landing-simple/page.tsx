import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Users, Sunset, Waves, Home, Package } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda | KarangTawulan",
  description:
    "Nikmati keindahan Pantai KarangTawulan dengan sunset spektakuler, aktivitas seru, dan akomodasi nyaman. Destinasi wisata pantai terbaik di Jawa Timur.",
};

export default function LandingSimple() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          {/* Background Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-400/20 dark:bg-sky-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-400/20 dark:bg-orange-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="mb-6">
                <Badge
                  variant="secondary"
                  className="px-4 py-1.5 text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-sky-200 dark:border-sky-900"
                >
                  <Star className="mr-1.5 h-3.5 w-3.5 fill-sky-500 text-sky-500" />
                  Destinasi Wisata Terbaik Jawa Timur
                </Badge>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-sky-700 to-purple-900 dark:from-white dark:via-sky-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight">
                Pesona Pantai
                <br />
                <span className="text-sky-600 dark:text-sky-400">
                  KarangTawulan
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Nikmati keindahan sunset spektakuler, aktivitas seru, dan
                pengalaman tak terlupakan di pantai tersembunyi Jawa Timur.
                Sempurna untuk keluarga dan petualangan.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-500/30 dark:shadow-sky-900/50 transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <Link href="/paket">
                    Lihat Paket Wisata
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                  asChild
                >
                  <Link href="/galeri">Lihat Galeri</Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap gap-8 justify-center items-center text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>Jawa Timur, Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span>5,000+ Pengunjung</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-32 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                Mengapa Memilih KarangTawulan?
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Pengalaman wisata pantai yang lengkap dengan fasilitas terbaik dan
                pemandangan menakjubkan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <Sunset className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Sunset Spektakuler
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Saksikan matahari terbenam yang memukau dengan pemandangan laut yang menawan.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <Waves className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Aktivitas Seru
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Berbagai aktivitas menarik seperti banana boat dan snorkeling yang aman.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Akomodasi Nyaman
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Pilihan menginap dari vila eksklusif hingga camping ground yang seru.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Paket Wisata Fleksibel
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Paket wisata yang dapat disesuaikan dengan harga terjangkau.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Guide Berpengalaman
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Dipandu oleh guide lokal berpengalaman. Keamanan terjamin.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl transition-all duration-300">
                <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                  Akses Mudah
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Lokasi strategis dengan akses jalan baik dan parkir luas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-purple-800 dark:from-sky-900 dark:via-sky-950 dark:to-purple-950">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Siap Merasakan Pengalaman Tak Terlupakan?
            </h2>

            <p className="text-lg md:text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
              Booking paket wisata Anda sekarang dan nikmati keindahan Pantai KarangTawulan bersama keluarga atau teman.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="group bg-white text-sky-700 hover:bg-sky-50 shadow-2xl hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link href="/paket">
                  Lihat Paket Wisata
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
                asChild
              >
                <Link href="/kontak">Hubungi Kami</Link>
              </Button>
            </div>
          </div>

          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
