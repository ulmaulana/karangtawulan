"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sunset, Users, MapPin, Star, Waves, Camera, Clock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, type Package } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPackages() {
      try {
        const { data, error } = await supabase
          .from("packages")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true })
          .limit(3);

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

      {/* Packages Section - Staggered Grid */}
      <section className="py-24 bg-gradient-to-b from-sea-foam/20 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                Paket Wisata
              </h2>
              <p className="text-gray-600 max-w-xl text-lg leading-relaxed">
                Pilih paket yang sesuai dengan kebutuhan Anda.
                Semua sudah termasuk fasilitas lengkap.
              </p>
            </div>
            <Button asChild variant="outline" size="lg" className="hidden md:inline-flex border-sea-ocean text-sea-ocean hover:bg-sea-ocean hover:text-white">
              <Link href="/paket">
                Lihat Semua
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Memuat paket wisata...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Paket wisata akan segera tersedia.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card
                  key={pkg.id}
                  className="p-8 rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
                  style={{ transform: `translateY(${index * 20}px)` }}
                >
                  <div className="mb-6">
                    <Badge className="mb-4 bg-sea-ocean/10 text-sea-ocean border-0">
                      Popular Choice
                    </Badge>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">{pkg.nama}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-sea-ocean">
                        {formatRupiah(pkg.harga)}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {pkg.pax_min}-{pkg.pax_max} orang
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pkg.durasi_jam} jam
                      </span>
                    </div>
                  </div>
                  <div className="bg-sea-foam/30 rounded-2xl p-6 mb-6">
                    <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Termasuk</div>
                    <ul className="space-y-2">
                      {pkg.facilities.map((facility, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-sea-teal mt-0.5 font-bold">✓</span>
                          <span className="leading-relaxed">{facility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {pkg.notes && (
                    <p className="text-xs text-gray-500 mb-4 italic">
                      {pkg.notes}
                    </p>
                  )}
                  <Button asChild className="w-full bg-sea-ocean hover:bg-sea-teal transition-all duration-300 group">
                    <Link href="/paket">
                      Booking Sekarang
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Button asChild variant="outline" size="lg" className="border-sea-ocean text-sea-ocean hover:bg-sea-ocean hover:text-white">
              <Link href="/paket">
                Lihat Semua Paket
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - Split Layout */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <Card className="rounded-3xl border-0 overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2">
              {/* Left - Content */}
              <div className="p-12 lg:p-16 bg-gradient-to-br from-sea-ocean to-sea-teal text-white">
                <Badge className="mb-6 bg-white/20 text-white border-0 backdrop-blur-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  Booking Sekarang
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                  Siap untuk
                  <span className="block">Petualangan Anda?</span>
                </h2>
                <p className="text-xl mb-10 font-light leading-relaxed opacity-90">
                  Hubungi kami sekarang untuk booking paket wisata atau konsultasi gratis tentang liburan Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="text-lg bg-white text-sea-ocean hover:bg-sea-sand transition-all duration-300 shadow-lg"
                  >
                    <Link href="/paket">Booking Paket</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg border-white/60 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <Link href="/kontak">Hubungi Kami</Link>
                  </Button>
                </div>
              </div>

              {/* Right - Info Cards */}
              <div className="p-12 lg:p-16 bg-sea-foam/30 flex flex-col justify-center gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <MapPin className="h-8 w-8 text-sea-ocean mb-3" />
                  <h3 className="font-bold text-lg mb-2">Lokasi</h3>
                  <p className="text-gray-600 text-sm">Pantai Karangtawulan, Tasikmalaya, Jawa Barat</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <Clock className="h-8 w-8 text-sea-ocean mb-3" />
                  <h3 className="font-bold text-lg mb-2">Jam Operasional</h3>
                  <p className="text-gray-600 text-sm">Setiap hari, 06:00 - 18:00 WIB</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <Waves className="h-8 w-8 text-sea-ocean mb-3" />
                  <h3 className="font-bold text-lg mb-2">Musim Terbaik</h3>
                  <p className="text-gray-600 text-sm">April - Oktober untuk cuaca optimal</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Floating CTA Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 lg:hidden">
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
