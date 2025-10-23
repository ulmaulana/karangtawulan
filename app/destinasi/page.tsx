"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase, type Destination } from "@/lib/supabase";
import { MapPin, Clock, Sparkles, ChevronRight } from "lucide-react";

export default function DestinasiPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const { data, error } = await supabase
          .from("destinations")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });

        if (error) {
          console.error("Supabase error:", error);
          setDestinations([]);
          return;
        }
        
        setDestinations(data || []);
      } catch (error) {
        console.error("Error loading destinations:", error);
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    }

    loadDestinations();

    // Setup realtime subscription with error handling
    let channel: any = null;
    try {
      channel = supabase
        .channel("destinations_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "destinations",
          },
          () => {
            loadDestinations();
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
      {/* Hero Header - Minimalist */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wide uppercase">
              Explore More
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Destinasi Wisata Sekitar
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Jelajahi destinasi wisata menarik di sekitar Pantai Karangtawulan. Rencana perjalanan lengkap untuk pengalaman yang tak terlupakan.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Memuat destinasi...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada destinasi tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((destination, index) => (
              <Card
                key={destination.id}
                className="overflow-hidden rounded-xl border border-gray-200 hover:border-sea-ocean/30 hover:shadow-lg transition-all duration-200 bg-white"
              >
                {destination.photo_url && (
                  <div className="h-56 bg-gray-100 overflow-hidden">
                    <img
                      src={destination.photo_url}
                      alt={destination.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">
                      {destination.name}
                    </h2>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {destination.distance_from_karangtawulan && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{destination.distance_from_karangtawulan} dari Karangtawulan</span>
                        </div>
                      )}
                      {destination.travel_time && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{destination.travel_time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {destination.description}
                  </p>

                  {/* Highlights */}
                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <Sparkles className="h-3.5 w-3.5 text-sea-ocean" />
                        <span>Aktivitas & Daya Tarik</span>
                      </div>
                      <ul className="space-y-1.5">
                        {destination.highlights.map((highlight, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-gray-700"
                          >
                            <ChevronRight className="h-4 w-4 text-sea-ocean flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
