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
      {/* Hero Header - Minimalist */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wide uppercase">
              Accommodation
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Tempat Menginap
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Berbagai pilihan akomodasi nyaman di sekitar Pantai Karangtawulan. Vila eksklusif, penginapan terjangkau, dan camping ground seru.
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
            <TabsList className="inline-flex gap-2 bg-transparent border-b border-gray-200 w-full mb-12 rounded-none p-0">
              <TabsTrigger 
                value="vila" 
                className="rounded-none px-6 py-3 border-b-2 border-transparent data-[state=active]:border-sea-ocean data-[state=active]:text-sea-ocean font-medium text-sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Vila
                <span className="ml-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{vilas.length}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="penginapan"
                className="rounded-none px-6 py-3 border-b-2 border-transparent data-[state=active]:border-sea-ocean data-[state=active]:text-sea-ocean font-medium text-sm"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Penginapan
                <span className="ml-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{penginapan.length}</span>
              </TabsTrigger>
              <TabsTrigger 
                value="camping"
                className="rounded-none px-6 py-3 border-b-2 border-transparent data-[state=active]:border-sea-ocean data-[state=active]:text-sea-ocean font-medium text-sm"
              >
                <Tent className="w-4 h-4 mr-2" />
                Camping
                <span className="ml-1.5 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{camping.length}</span>
              </TabsTrigger>
            </TabsList>

            {/* Vila */}
            <TabsContent value="vila">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 tracking-tight">Vila Eksklusif</h2>
                <p className="text-sm text-gray-500">Penginapan premium dengan fasilitas lengkap</p>
              </div>
              {vilas.length === 0 ? (
                <p className="text-center text-gray-500">
                  Data vila akan segera tersedia.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vilas.map((vila) => (
                    <Card key={vila.id} className="overflow-hidden rounded-xl border border-gray-200 hover:border-sea-ocean/30 hover:shadow-lg transition-all duration-200 group bg-white">
                      {vila.photo_url && (
                        <div className="h-56 bg-gray-200 overflow-hidden">
                          <img
                            src={vila.photo_url}
                            alt={vila.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-3 tracking-tight">{vila.name}</h3>
                        {vila.distance_km && (
                          <div className="flex items-center gap-1.5 mb-4 text-xs text-gray-500">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{vila.distance_km} km dari pantai</span>
                          </div>
                        )}
                        {vila.price_from_idr && (
                          <div className="mb-4 pb-4 border-b border-gray-100">
                            <div className="text-2xl font-bold text-gray-900">
                              {formatRupiah(vila.price_from_idr)}
                            </div>
                            <div className="text-xs text-gray-500">per malam</div>
                          </div>
                        )}
                        {vila.facilities && vila.facilities.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-medium text-gray-500 mb-2">
                              Fasilitas
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {vila.facilities.slice(0, 4).map((facility, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded border border-gray-200">
                                  {facility}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {vila.contact && (
                          <Button
                            className="w-full bg-sea-ocean hover:bg-sea-teal transition-colors h-10 text-sm"
                            onClick={() => handleContact(vila.contact!)}
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Hubungi
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
