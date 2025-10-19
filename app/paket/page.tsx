"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking-form";
import { supabase, type Package } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";
import { Check, Users, Clock, Calendar, Sparkles, ArrowRight } from "lucide-react";

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

    // Setup realtime subscription for auto-updates
    const channel = supabase
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
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Split Layout */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-0">
                <Sparkles className="w-3 h-3 mr-1" />
                Paket Pilihan Terbaik
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                Paket<span className="block text-sea-ocean">Wisata</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Pilih paket yang sesuai dengan kebutuhan Anda. Semua paket sudah termasuk fasilitas lengkap dan guide berpengalaman.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-sea-ocean hover:bg-sea-teal">
                  <Link href="#packages">Lihat Paket</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-sea-ocean text-sea-ocean hover:bg-sea-ocean hover:text-white">
                  <Link href="#booking">Booking Sekarang</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 rounded-3xl border-0 bg-sea-foam/30">
                  <Users className="h-10 w-10 text-sea-ocean mb-3" />
                  <div className="text-2xl font-bold text-sea-ocean mb-1">10-50</div>
                  <div className="text-sm text-gray-600">Kapasitas rombongan</div>
                </Card>
                <Card className="p-6 rounded-3xl border-0 bg-sea-ocean/5 mt-8">
                  <Clock className="h-10 w-10 text-sea-teal mb-3" />
                  <div className="text-2xl font-bold text-sea-teal mb-1">3-12 Jam</div>
                  <div className="text-sm text-gray-600">Durasi paket</div>
                </Card>
              </div>
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
            {/* Package Comparison - Modern Cards */}
            <section className="mb-20">
              <div className="text-center mb-16">
                <Badge className="mb-6 bg-sea-teal/10 text-sea-teal border-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Paket Pilihan
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Pilih Paket Anda</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">Harga terjangkau dengan fasilitas lengkap untuk pengalaman tak terlupakan</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
                {packages.map((pkg, index) => (
                  <Card
                    key={pkg.id}
                    className={`p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 relative group ${
                      pkg.harga === 190000
                        ? "border-0 shadow-2xl bg-gradient-to-br from-sea-ocean/5 to-sea-teal/5 ring-2 ring-sea-teal lg:scale-105"
                        : "border-0 shadow-lg bg-white hover:shadow-2xl hover:ring-2 hover:ring-sea-foam/50"
                    }`}
                    style={{ zIndex: pkg.harga === 190000 ? 10 : 1 }}
                  >
                    {pkg.harga === 190000 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-sea-ocean to-sea-teal text-white border-0 px-6 py-2.5 text-sm font-bold shadow-xl animate-pulse">
                          ⭐ Paling Populer
                        </Badge>
                      </div>
                    )}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold mb-6 tracking-tight group-hover:text-sea-ocean transition-colors">{pkg.nama}</h3>
                      <div className="mb-6 p-6 bg-gradient-to-br from-sea-foam/20 to-transparent rounded-2xl">
                        <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Harga Paket</div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent mb-1">
                          {formatRupiah(pkg.harga)}
                        </div>
                        <div className="text-sm text-gray-500">per rombongan</div>
                      </div>
                      <div className="flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-sea-ocean/5 rounded-full">
                          <Users className="h-4 w-4 text-sea-ocean" />
                          <span className="font-medium text-gray-700">{pkg.pax_min}-{pkg.pax_max} orang</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-sea-teal/5 rounded-full">
                          <Clock className="h-4 w-4 text-sea-teal" />
                          <span className="font-medium text-gray-700">{pkg.durasi_jam} jam</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-sea-foam/30 to-transparent rounded-2xl p-6 mb-6 border border-sea-foam/30">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-sea-ocean" />
                        </div>
                        <div className="text-xs font-bold text-sea-ocean uppercase tracking-wider">Termasuk</div>
                      </div>
                      <div className="space-y-2.5">
                        {pkg.facilities.map((facility, index) => (
                          <div key={index} className="flex items-start gap-3 group/item">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-sea-teal to-sea-ocean flex items-center justify-center mt-0.5">
                              <Check className="h-3 w-3 text-white stroke-[3]" />
                            </div>
                            <span className="text-sm leading-relaxed text-gray-700 group-hover/item:text-sea-ocean transition-colors">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {pkg.notes && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-sea-sand/20 to-transparent rounded-xl border-l-4 border-sea-coral">
                        <p className="text-sm text-gray-700 leading-relaxed italic">{pkg.notes}</p>
                      </div>
                    )}
                    
                    <Button 
                      asChild 
                      className={`w-full mt-6 h-14 text-base font-semibold group/btn transition-all duration-300 ${
                        pkg.harga === 190000 
                          ? "bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-2xl hover:scale-105"
                          : "bg-sea-ocean hover:bg-sea-teal hover:shadow-xl"
                      }`}
                    >
                      <Link href="#booking" className="flex items-center justify-center">
                        Booking Sekarang
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
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
                      <strong>DP 50%</strong> - Booking paket memerlukan down
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
