"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, type Accommodation } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";
import { MapPin, Phone, Home, Tent, Building2, Sparkles, ArrowRight } from "lucide-react";

export default function AkomodasiPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccommodations() {
      try {
        const { data, error } = await supabase
          .from("accommodations")
          .select("*")
          .eq("published", true)
          .order("type", { ascending: true });

        if (error) throw error;
        setAccommodations(data || []);
      } catch (error) {
        console.error("Error loading accommodations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAccommodations();

    // Setup realtime subscription for auto-updates
    const channel = supabase
      .channel("accommodations_changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "accommodations",
        },
        () => {
          // Reload accommodations when any change occurs
          loadAccommodations();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const vilas = accommodations.filter((a) => a.type === "vila");
  const penginapan = accommodations.filter((a) => a.type === "penginapan");
  const camping = accommodations.filter((a) => a.type === "camping");

  const handleContact = (contact?: string) => {
    if (contact) {
      window.open(`https://wa.me/${contact}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sea-foam/30 to-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-0">
              <Home className="w-3 h-3 mr-1" />
              Tempat Menginap
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Akomodasi
              <span className="block text-sea-ocean">Karangtawulan</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Pilihan tempat menginap yang nyaman di sekitar Pantai Karangtawulan. Dari vila eksklusif hingga camping ground yang seru.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat data akomodasi...</p>
          </div>
        ) : (
          <Tabs defaultValue="vila" className="w-full">
            <div className="flex justify-center mb-16">
              <TabsList className="inline-flex p-2 bg-sea-foam/30 rounded-full backdrop-blur-sm">
                <TabsTrigger 
                  value="vila" 
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Vila ({vilas.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="penginapan"
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Penginapan ({penginapan.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="camping"
                  className="rounded-full px-8 py-3 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-sea-ocean font-medium"
                >
                  <Tent className="w-4 h-4 mr-2" />
                  Camping ({camping.length})
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Vila */}
            <TabsContent value="vila">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Vila 6 Kamar</h2>
                <p className="text-xl text-gray-600">Penginapan eksklusif dengan fasilitas lengkap</p>
              </div>
              {vilas.length === 0 ? (
                <p className="text-center text-gray-500">
                  Data vila akan segera tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vilas.map((vila) => (
                    <Card key={vila.id} className="overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                      {vila.photo_url && (
                        <div className="h-56 bg-gray-200 overflow-hidden">
                          <img
                            src={vila.photo_url}
                            alt={vila.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">{vila.name}</h3>
                        {vila.distance_km && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-sea-ocean" />
                            </div>
                            <span className="text-sm text-gray-600">{vila.distance_km} km dari pantai</span>
                          </div>
                        )}
                        {vila.price_from_idr && (
                          <div className="mb-6">
                            <div className="text-xs text-gray-500 mb-1">Mulai dari</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent">
                              {formatRupiah(vila.price_from_idr)}
                            </div>
                            <div className="text-sm text-gray-500">per malam</div>
                          </div>
                        )}
                        {vila.facilities && vila.facilities.length > 0 && (
                          <div className="mb-6 p-4 bg-sea-foam/20 rounded-2xl">
                            <p className="text-xs font-bold text-sea-ocean mb-3 uppercase tracking-wider">
                              Fasilitas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {vila.facilities.slice(0, 4).map((facility, idx) => (
                                <Badge key={idx} className="bg-white border-sea-foam text-gray-700">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {vila.contact && (
                          <Button
                            className="w-full bg-sea-ocean hover:bg-sea-teal transition-all duration-300 h-12 group"
                            onClick={() => handleContact(vila.contact!)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Hubungi
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Penginapan */}
            <TabsContent value="penginapan">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Penginapan Sekitar</h2>
                <p className="text-xl text-gray-600">Pilihan menginap terjangkau dekat pantai</p>
              </div>
              {penginapan.length === 0 ? (
                <p className="text-center text-gray-500">
                  Data penginapan akan segera tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {penginapan.map((inn) => (
                    <Card key={inn.id} className="overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                      {inn.photo_url && (
                        <div className="h-56 bg-gray-200 overflow-hidden">
                          <img
                            src={inn.photo_url}
                            alt={inn.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-3 tracking-tight">{inn.name}</h3>
                        {inn.distance_km && (
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-sea-ocean" />
                            </div>
                            <span className="text-sm text-gray-600">{inn.distance_km} km dari pantai</span>
                          </div>
                        )}
                        {inn.price_from_idr && (
                          <div className="mb-6">
                            <div className="text-xs text-gray-500 mb-1">Mulai dari</div>
                            <div className="text-3xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent">
                              {formatRupiah(inn.price_from_idr)}
                            </div>
                            <div className="text-sm text-gray-500">per malam</div>
                          </div>
                        )}
                        {inn.facilities && inn.facilities.length > 0 && (
                          <div className="mb-6 p-4 bg-sea-foam/20 rounded-2xl">
                            <p className="text-xs font-bold text-sea-ocean mb-3 uppercase tracking-wider">
                              Fasilitas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {inn.facilities.slice(0, 4).map((facility, idx) => (
                                <Badge key={idx} className="bg-white border-sea-foam text-gray-700">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {inn.contact && (
                          <Button
                            className="w-full bg-sea-ocean hover:bg-sea-teal transition-all duration-300 h-12 group"
                            onClick={() => handleContact(inn.contact!)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Hubungi
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Camping */}
            <TabsContent value="camping">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Camping Ground</h2>
                <p className="text-xl text-gray-600">Pengalaman berkemah di tepi pantai</p>
              </div>
              {camping.length === 0 ? (
                <p className="text-center text-gray-500">
                  Data camping ground akan segera tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {camping.map((camp) => (
                    <Card key={camp.id} className="overflow-hidden rounded-3xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                      {camp.photo_url && (
                        <div className="h-72 bg-gray-200 overflow-hidden">
                          <img
                            src={camp.photo_url}
                            alt={camp.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-10">
                        <h3 className="text-3xl font-bold mb-4 tracking-tight">{camp.name}</h3>
                        {camp.price_from_idr && (
                          <div className="mb-6">
                            <div className="text-xs text-gray-500 mb-1">Harga</div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent">
                              {formatRupiah(camp.price_from_idr)}
                            </div>
                            <div className="text-sm text-gray-500">per tenda/malam</div>
                          </div>
                        )}
                        {camp.facilities && camp.facilities.length > 0 && (
                          <div className="mb-6 p-6 bg-sea-foam/20 rounded-2xl">
                            <p className="text-xs font-bold text-sea-ocean mb-3 uppercase tracking-wider">
                              Fasilitas
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {camp.facilities.map((facility, idx) => (
                                <Badge key={idx} className="bg-white border-sea-foam text-gray-700">
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {camp.rules && (
                          <div className="mb-6 p-6 bg-gradient-to-r from-sea-sand/20 to-transparent rounded-2xl border-l-4 border-sea-coral">
                            <p className="text-sm font-bold mb-2 text-sea-coral">Aturan Penting:</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{camp.rules}</p>
                          </div>
                        )}
                        {camp.contact && (
                          <Button
                            className="w-full bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-xl transition-all duration-300 h-14 text-base font-semibold group"
                            onClick={() => handleContact(camp.contact!)}
                          >
                            <Phone className="h-5 w-5 mr-2" />
                            Reservasi Sekarang
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
