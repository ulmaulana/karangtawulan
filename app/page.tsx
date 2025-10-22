"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sunset, Users, MapPin, Star, Waves, Camera, Clock, Calendar, ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { supabase, type Package } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    async function loadPackages() {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (error) throw error;
        setPackages(data || []);
      } catch (error) {
        console.error("Error loading packages:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPackages();
  }, []);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll functions
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Update scroll state after animation
      setTimeout(checkScroll, 300);
    }
  };

  // Update scroll indicators when packages load or window resizes
  useEffect(() => {
    if (packages.length > 0) {
      setTimeout(checkScroll, 100);
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [packages]);

  return (
    <div className="bg-white">
      {/* Split Hero Section - Modern Layout */}
      <section className="min-h-screen grid lg:grid-cols-2 relative">
        {/* Left Side - Content */}
        <div className="flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 lg:py-0 bg-gradient-to-br from-sea-foam/30 to-white relative z-10">
          <div className="max-w-xl">
            <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-sea-ocean/20 hover:bg-sea-ocean/20">
              <Waves className="w-3 h-3 mr-1" />
              Destinasi Wisata Terbaik Tasikmalaya
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Pantai
              <span className="block text-sea-ocean">Karangtawulan</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Nikmati keindahan sunset & sunrise yang memukau dengan fasilitas lengkap dan paket terjangkau
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 py-6 border-y border-sea-foam">
              <div>
                <div className="text-3xl font-bold text-sea-ocean">100K+</div>
                <div className="text-sm text-gray-500">Mulai dari</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sea-ocean">3+</div>
                <div className="text-sm text-gray-500">Paket Pilihan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sea-ocean">24/7</div>
                <div className="text-sm text-gray-500">Layanan</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg bg-sea-ocean hover:bg-sea-teal transition-all duration-300 shadow-lg group">
                <Link href="/paket">
                  Lihat Paket Wisata
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-sea-ocean text-sea-ocean hover:bg-sea-ocean hover:text-white transition-all duration-300">
                <Link href="/galeri">
                  <Camera className="mr-2 h-5 w-5" />
                  Galeri
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Image Grid */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 grid grid-cols-2 gap-4 p-4">
            <div 
              className="rounded-3xl overflow-hidden bg-cover bg-center row-span-2"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800')",
              }}
            >
              <div className="h-full bg-gradient-to-t from-sea-deep/60 to-transparent" />
            </div>
            <div 
              className="rounded-3xl overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800')",
              }}
            >
              <div className="h-full bg-gradient-to-t from-sea-ocean/40 to-transparent" />
            </div>
            <div 
              className="rounded-3xl overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800')",
              }}
            >
              <div className="h-full bg-gradient-to-t from-sea-teal/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Highlights - Asymmetric Layout */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Kenapa Pilih Kami?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Pengalaman liburan pantai yang tak terlupakan dengan fasilitas terbaik</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 md:grid-rows-3 gap-6">
          {/* Large Feature Card - Sunset */}
          <Card className="md:col-span-4 md:row-span-2 p-10 rounded-3xl border-0 bg-gradient-to-br from-sea-coral/10 to-sea-coral/5 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sea-coral/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Sunset className="h-16 w-16 mb-6 text-sea-coral stroke-[1.5]" />
              <h3 className="text-3xl font-bold mb-4">Sunset & Sunrise Spektakuler</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Saksikan momen magis matahari terbenam dan terbit dengan panorama laut yang menakjubkan. Spot foto terbaik untuk mengabadikan momen berharga Anda.
              </p>
              <Button variant="outline" className="border-sea-coral text-sea-coral hover:bg-sea-coral hover:text-white">
                Lihat Galeri
              </Button>
            </div>
          </Card>

          {/* Tall Card - Affordable */}
          <Card className="md:col-span-2 md:row-span-3 p-8 rounded-3xl border-0 bg-gradient-to-b from-sea-ocean/10 to-transparent hover:shadow-2xl transition-all duration-300 flex flex-col">
            <Users className="h-12 w-12 mb-6 text-sea-ocean stroke-[1.5]" />
            <h3 className="text-2xl font-bold mb-4">Paket Terjangkau</h3>
            <p className="text-gray-600 leading-relaxed mb-auto">
              Mulai dari 100K dengan berbagai pilihan fasilitas lengkap untuk rombongan keluarga atau teman.
            </p>
            <div className="mt-6 pt-6 border-t border-sea-foam">
              <div className="text-sm text-gray-500 mb-2">Harga mulai</div>
              <div className="text-3xl font-bold text-sea-ocean">100K</div>
            </div>
          </Card>

          {/* Wide Card - Location */}
          <Card className="md:col-span-2 md:row-span-1 p-8 rounded-3xl border-0 bg-gradient-to-r from-sea-kelp/10 to-transparent hover:shadow-2xl transition-all duration-300">
            <MapPin className="h-12 w-12 mb-4 text-sea-kelp stroke-[1.5]" />
            <h3 className="text-xl font-bold mb-2">Lokasi Strategis</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Akses mudah dari pusat kota Tasikmalaya
            </p>
          </Card>

          {/* Wide Card - Experience */}
          <Card className="md:col-span-2 md:row-span-1 p-8 rounded-3xl border-0 bg-gradient-to-r from-sea-teal/10 to-transparent hover:shadow-2xl transition-all duration-300">
            <Star className="h-12 w-12 mb-4 text-sea-teal stroke-[1.5]" />
            <h3 className="text-xl font-bold mb-2">Pengalaman Terbaik</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Berbagai aktivitas seru untuk liburan sempurna
            </p>
          </Card>
        </div>
      </section>

      {/* Packages Section - Carousel with Navigation */}
      <section className="py-32 bg-white relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wider uppercase">Tour Packages</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Paket Wisata
              </h2>
              <p className="text-gray-500 max-w-lg text-base">
                Pilih paket wisata sesuai kebutuhan. Semua sudah termasuk fasilitas lengkap.
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden md:inline-flex text-sea-ocean hover:text-sea-teal hover:bg-transparent group">
              <Link href="/paket">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="min-w-[300px] lg:min-w-[340px] flex-shrink-0">
                  <div className="p-6 rounded-2xl border border-gray-100 bg-white">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Paket wisata akan segera tersedia.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Left Navigation Button */}
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white border-2 border-gray-300 hover:border-sea-ocean hover:bg-sea-ocean hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Right Navigation Button */}
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white border-2 border-gray-300 hover:border-sea-ocean hover:bg-sea-ocean hover:text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed items-center justify-center"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <div 
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className="group relative p-6 rounded-2xl border border-gray-100 hover:border-sea-ocean/20 bg-white hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col w-[300px] lg:w-[340px] snap-start flex-shrink-0"
                >
                  {/* Subtle gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-sea-foam/0 to-sea-ocean/0 group-hover:from-sea-foam/5 group-hover:to-sea-ocean/5 transition-all duration-500" />
                  
                  <div className="relative flex flex-col flex-grow min-w-0">
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-3 tracking-tight break-words">{pkg.nama}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold tracking-tight">
                          {formatRupiah(pkg.harga)}
                        </span>
                      </div>
                    </div>

                    {/* Info Pills */}
                    <div className="flex gap-2 mb-4 text-xs">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                        <Users className="h-3 w-3" />
                        {pkg.pax_min}-{pkg.pax_max}
                      </span>
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                        <Clock className="h-3 w-3" />
                        {pkg.durasi_jam} jam
                      </span>
                    </div>

                    {/* Facilities - 2 Columns if > 3 */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <ul className={`gap-x-3 gap-y-1.5 ${pkg.facilities.length > 3 ? 'grid grid-cols-2' : 'flex flex-col space-y-1.5'}`}>
                        {pkg.facilities.slice(0, 6).map((facility, index) => (
                          <li key={index} className="flex items-start gap-1.5 text-xs text-gray-600 min-w-0">
                            <span className="text-sea-ocean mt-0.5 flex-shrink-0">✓</span>
                            <span className="leading-tight line-clamp-2 break-words">{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes */}
                    {pkg.notes && (
                      <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2 break-words">
                        {pkg.notes}
                      </p>
                    )}

                    {/* CTA Button - Always at bottom */}
                    <Button 
                      asChild 
                      className="w-full bg-sea-ocean hover:bg-sea-teal text-white rounded-xl h-10 text-sm font-medium transition-all duration-300 mt-auto"
                    >
                      <Link href="/paket" className="group/btn flex items-center justify-center gap-2">
                        Booking Sekarang
                        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Button asChild variant="ghost" className="text-sea-ocean hover:text-sea-teal hover:bg-transparent">
              <Link href="/paket" className="group flex items-center gap-2">
                Lihat Semua Paket Wisata
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimal Clean */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <Card className="rounded-[32px] border-2 border-gray-200 bg-white px-12 md:px-16 py-10 md:py-12 shadow-xl">
            <div className="grid lg:grid-cols-[1fr,auto] gap-12 items-center">
              {/* Left - Main CTA */}
              <div className="text-left">
                <p className="text-sm font-semibold text-sea-ocean mb-3 tracking-wider uppercase">Ready to Start</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                  Siap untuk Petualangan Anda?
                </h2>
                <p className="text-gray-500 text-lg mb-6 leading-relaxed max-w-xl">
                  Hubungi kami untuk booking paket wisata atau konsultasi gratis
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-sea-ocean hover:bg-sea-teal text-white rounded-2xl h-12 px-8 text-base font-semibold"
                  >
                    <Link href="/paket" className="flex items-center gap-2">
                      Booking Paket Wisata
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="text-sea-ocean hover:text-sea-teal hover:bg-gray-50 rounded-2xl h-12 px-8 text-base font-semibold"
                  >
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </div>
              </div>

              {/* Right - Info Grid Horizontal */}
              <div className="flex flex-col gap-4 lg:border-l-2 lg:border-gray-100 lg:pl-12">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-sea-ocean mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-gray-900">Lokasi</h3>
                    <p className="text-gray-500 text-sm">Pantai Karangtawulan, Tasikmalaya, Jawa Barat</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-sea-ocean mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-gray-900">Jam Operasional</h3>
                    <p className="text-gray-500 text-sm">Setiap hari, 06:00 - 18:00 WIB</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Waves className="h-5 w-5 text-sea-ocean mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-gray-900">Musim Terbaik</h3>
                    <p className="text-gray-500 text-sm">April - Oktober untuk cuaca optimal</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Ticket className="h-5 w-5 text-sea-ocean mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm mb-1 text-gray-900">Harga Tiket</h3>
                    <div className="text-gray-500 text-sm space-y-0.5">
                      <p className="font-medium">Motor: Rp 15.000</p>
                      <p className="font-medium">Mobil: Rp 30.000</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Floating CTA Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-40 lg:hidden">
        <div className="flex gap-2">
          <Button asChild size="lg" className="flex-1 bg-sea-ocean hover:bg-sea-teal">
            <Link href="/paket">Booking</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="flex-1 border-sea-ocean text-sea-ocean">
            <Link href="/kontak">Kontak</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
