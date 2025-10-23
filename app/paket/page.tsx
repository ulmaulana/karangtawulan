"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking-form";
import { supabase, type Package } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";
import { Check, Users, Clock, Calendar, Sparkles, ArrowRight, Package as PackageIcon } from "lucide-react";

export default function PaketPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

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

    // Setup realtime subscription for auto-updates with error handling
    let channel: RealtimeChannel | null = null;
    try {
      channel = supabase
        .channel("packages_changes")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
            schema: "public",
            table: "packages",
          },
          () => {
            // Reload packages when any change occurs
            loadPackages();
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Realtime subscription active');
          }
          if (status === 'CHANNEL_ERROR') {
            console.warn('Realtime subscription error, continuing without realtime updates');
          }
        });
    } catch (error) {
      console.warn('Failed to setup realtime subscription:', error);
      // Continue without realtime - page will still work
    }

    // Cleanup subscription on unmount
    return () => {
      try {
        if (channel) {
          supabase.removeChannel(channel);
        }
      } catch (error) {
        console.warn('Error cleaning up channel:', error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Minimal Modern */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sea-foam/20 to-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            {/* Label */}
            <p className="text-sm font-semibold text-sea-teal mb-4 tracking-wider uppercase">
              Tour Packages
            </p>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Paket Wisata Karangtawulan
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Berbagai pilihan paket dengan harga terjangkau. Fasilitas lengkap, guide berpengalaman, dokumentasi profesional.
            </p>

            {/* Quick Info Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Users className="h-5 w-5 text-sea-ocean" />
                <span className="text-sm font-medium text-gray-700">Rombongan 1-5 orang</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Clock className="h-5 w-5 text-sea-teal" />
                <span className="text-sm font-medium text-gray-700">Durasi 1-6 jam</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <PackageIcon className="h-5 w-5 text-sea-ocean" />
                <span className="text-sm font-medium text-gray-700">All-inclusive</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-sea-ocean hover:bg-sea-teal rounded-xl h-12">
                <Link href="#packages" className="flex items-center gap-2">
                  Lihat Paket
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-sea-ocean text-sea-ocean hover:bg-sea-ocean hover:text-white rounded-xl h-12">
                <Link href="#booking">Booking Sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div id="packages" className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat paket wisata...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Paket wisata akan segera tersedia.</p>
          </div>
        ) : (
          <>
            {/* Package Comparison - Minimal Modern */}
            <section className="mb-20">
              <div className="text-center mb-16">
                <p className="text-sm font-medium text-sea-teal mb-4 tracking-wider uppercase">Paket Wisata Pilihan</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Pilih Paket Wisata Anda</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">Harga terjangkau dengan fasilitas lengkap untuk pengalaman tak terlupakan</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {packages.map((pkg, index) => (
                  <Card
                    key={pkg.id}
                    className={`relative group p-6 rounded-2xl transition-all duration-500 hover:shadow-2xl flex flex-col ${
                      pkg.harga === 190000
                        ? "border-2 border-sea-teal bg-white shadow-lg"
                        : "border border-gray-100 bg-white hover:border-sea-ocean/20"
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.harga === 190000 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 bg-sea-teal text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                          ⭐ Paling Populer
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold mb-3 tracking-tight break-words">{pkg.nama}</h3>
                      
                      {/* Price */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Harga Paket</p>
                        <p className="text-2xl font-bold tracking-tight">
                          {formatRupiah(pkg.harga)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">per rombongan</p>
                      </div>

                      {/* Info Pills */}
                      <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                          <Users className="h-3 w-3" />
                          {pkg.pax_min}-{pkg.pax_max}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full text-gray-600">
                          <Clock className="h-3 w-3" />
                          {pkg.durasi_jam} jam
                        </span>
                      </div>
                    </div>

                    {/* Facilities - 2 Columns if more than 3 */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Termasuk</p>
                      <ul className={`gap-x-3 gap-y-1.5 ${pkg.facilities.length > 3 ? 'grid grid-cols-2' : 'flex flex-col space-y-1.5'}`}>
                        {pkg.facilities.slice(0, 6).map((facility, index) => (
                          <li key={index} className="flex items-start gap-1.5 text-xs text-gray-600 min-w-0">
                            <Check className="h-3.5 w-3.5 text-sea-ocean mt-0.5 flex-shrink-0" />
                            <span className="leading-tight line-clamp-2 break-words">{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Notes */}
                    {pkg.notes && (
                      <div className="mb-4 p-2.5 bg-sea-sand/10 rounded-lg border-l-2 border-sea-coral">
                        <p className="text-xs text-gray-600 leading-snug line-clamp-3 break-words">{pkg.notes}</p>
                      </div>
                    )}

                    {/* CTA Button - Always at bottom */}
                    <Button 
                      asChild 
                      className={`w-full h-10 text-sm font-medium rounded-xl transition-all mt-auto ${
                        pkg.harga === 190000 
                          ? "bg-sea-teal hover:bg-sea-ocean"
                          : "bg-sea-ocean hover:bg-sea-teal"
                      }`}
                    >
                      <Link href="#booking" className="flex items-center justify-center gap-2">
                        Booking Sekarang
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Important Notes - Modern Box */}
            <section className="mb-20">
              <Card className="p-10 rounded-3xl border-0 bg-gradient-to-br from-sea-foam/40 via-sea-foam/20 to-transparent shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-sea-ocean/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-sea-ocean" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 tracking-tight">Catatan Penting</h3>
                    <p className="text-gray-600">Harap perhatikan informasi berikut sebelum booking</p>
                  </div>
                </div>
                <ul className="grid md:grid-cols-2 gap-4 text-sm">
                  <li className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-sea-ocean/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sea-ocean font-bold text-xs">✓</span>
                    </span>
                    <span>
                      <strong>DP 50%</strong> - Booking paket wisata memerlukan down
                      payment 50% dari total harga
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-sea-ocean/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sea-ocean font-bold text-xs">✓</span>
                    </span>
                    <span>
                      Pelunasan dilakukan maksimal H-1 sebelum hari keberangkatan
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-sea-ocean/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sea-ocean font-bold text-xs">✓</span>
                    </span>
                    <span>
                      Pembatalan dengan pengembalian DP hanya berlaku minimal 3
                      hari sebelum keberangkatan
                    </span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                    <span className="w-6 h-6 rounded-full bg-sea-ocean/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sea-ocean font-bold text-xs">✓</span>
                    </span>
                    <span>
                      Harga dapat berubah sewaktu-waktu, terutama pada musim
                      liburan dan hari besar
                    </span>
                  </li>
                </ul>
              </Card>
            </section>

            {/* Booking Form */}
            <section id="booking" className="scroll-mt-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Booking Sekarang</h2>
                <p className="text-xl text-gray-600">Isi form di bawah untuk melanjutkan booking via WhatsApp</p>
              </div>
              <div className="max-w-2xl mx-auto">
                <BookingForm />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
