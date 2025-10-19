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
      {/* Header Minimalist */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-sea-ocean mb-2">Paket Wisata</h1>
          <p className="text-gray-600">Pilih paket sesuai kebutuhan Anda</p>
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
            {/* Package Cards */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8">Paket Tersedia</h2>
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
                      <Badge className="absolute -top-3 right-4 bg-sea-ocean text-white border-0 text-xs">
                        Populer
                      </Badge>
                    )}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-4">{pkg.nama}</h3>
                      <div className="text-3xl font-bold text-sea-ocean mb-4">
                        {formatRupiah(pkg.harga)}
                      </div>
                      <div className="flex gap-3 text-sm text-gray-600 mb-6">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {pkg.pax_min}-{pkg.pax_max} orang
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pkg.durasi_jam} jam
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 mb-6">
                      <div className="text-sm font-semibold mb-3">Fasilitas:</div>
                      <div className="space-y-2">
                        {pkg.facilities.map((facility, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="h-4 w-4 text-sea-ocean flex-shrink-0 mt-0.5" />
                            {facility}
                          </div>
                        ))}
                      </div>
                    </div>

                    {pkg.notes && (
                      <div className="text-sm text-gray-600 italic mb-4 border-l-2 border-gray-300 pl-3">
                        {pkg.notes}
                      </div>
                    )}
                    
                    <Button 
                      asChild 
                      className="w-full bg-sea-ocean hover:bg-sea-teal"
                    >
                      <Link href="#booking">
                        Booking
                      </Link>
                    </Button>
                  </Card>
                ))}
              </div>
            </section>

            {/* Important Notes */}
            <section className="mb-16">
              <Card className="p-6 border bg-gray-50">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sea-ocean" />
                  Ketentuan
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• DP 50% untuk booking</li>
                  <li>• Pelunasan maksimal H-1 keberangkatan</li>
                  <li>• Pembatalan minimal 3 hari sebelumnya untuk pengembalian DP</li>
                  <li>• Harga dapat berubah pada musim liburan</li>
                </ul>
              </Card>
            </section>

            {/* Booking Form */}
            <section id="booking" className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6">Form Booking</h2>
              <div className="max-w-2xl">
                <BookingForm />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
