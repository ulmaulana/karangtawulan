"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, type TicketPrice, type Vendor, type Accessory } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";
import { Ticket, UtensilsCrossed, ShoppingBag, MapPin, Navigation, Sparkles, Car } from "lucide-react";

export default function JelajahPage() {
  const [tickets, setTickets] = useState<TicketPrice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketsRes, vendorsRes, accessoriesRes] = await Promise.all([
          supabase.from("ticket_prices").select("*").eq("published", true),
          supabase.from("vendors").select("*").eq("published", true),
          supabase.from("accessories").select("*").eq("published", true),
        ]);

        setTickets(ticketsRes.data || []);
        setVendors(vendorsRes.data || []);
        setAccessories(accessoriesRes.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleGoogleMaps = () => {
    // Koordinat Pantai Karangtawulan (ganti dengan koordinat yang sebenarnya)
    window.open(
      "https://www.google.com/maps/dir/?api=1&destination=Pantai+Karangtawulan+Tasikmalaya",
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Minimalist */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wide uppercase">
              Explore
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Panduan Lengkap
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Informasi tiket masuk, kuliner, aksesori sewa, dan lokasi untuk pengalaman terbaik di Pantai Karangtawulan.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 space-y-20">
        {/* Tiket Masuk & Parkir */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                <Ticket className="h-5 w-5 text-sea-ocean" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Tiket Masuk & Parkir</h2>
            </div>
            <p className="text-sm text-gray-500">Harga terjangkau untuk semua pengunjung</p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data tiket...</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-500">Data tiket akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="p-5 text-center rounded-xl border border-gray-200 hover:border-sea-ocean/30 hover:shadow-md transition-all duration-200 bg-white">
                  <div className="w-10 h-10 rounded-lg bg-sea-ocean/10 flex items-center justify-center mx-auto mb-3">
                    {ticket.category === 'parkir' ? (
                      <Car className="h-5 w-5 text-sea-ocean" />
                    ) : (
                      <Ticket className="h-5 w-5 text-sea-ocean" />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 capitalize text-sm text-gray-700">
                    {ticket.category?.replace("_", " ")}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {ticket.price_idr ? formatRupiah(ticket.price_idr) : "Gratis"}
                  </p>
                  {ticket.note && (
                    <p className="text-xs text-gray-500 mt-2">{ticket.note}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Kuliner */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-sea-coral/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-sea-coral" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Kuliner</h2>
            </div>
            <p className="text-sm text-gray-500">Berbagai pilihan makanan dan minuman lokal</p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data kuliner...</p>
          ) : vendors.length === 0 ? (
            <p className="text-gray-500">Data kuliner akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="p-5 rounded-xl border border-gray-200 hover:border-sea-ocean/30 hover:shadow-md transition-all duration-200 bg-white">
                  <h3 className="text-lg font-semibold mb-3 tracking-tight">{vendor.name}</h3>
                  {vendor.owner && (
                    <p className="text-xs text-gray-500 mb-3">
                      {vendor.owner}
                    </p>
                  )}
                  {vendor.highlight_menu && (
                    <div className="mb-3">
                      <span className="text-xs px-2 py-1 bg-sea-coral/10 text-sea-coral rounded border border-sea-coral/20">
                        ⭐ {vendor.highlight_menu}
                      </span>
                    </div>
                  )}
                  {vendor.price_range && (
                    <div className="mb-3 pb-3 border-b border-gray-100">
                      <span className="text-xs font-medium text-gray-500">Kisaran Harga</span>
                      <p className="text-base font-semibold text-gray-900 mt-1">{vendor.price_range}</p>
                    </div>
                  )}
                  {vendor.location_short && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{vendor.location_short}</span>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Aksesori */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-sea-teal/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-sea-teal" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Aksesori</h2>
            </div>
            <p className="text-sm text-gray-500">
              Peralatan camping dan aksesori pantai tersedia untuk disewa
            </p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data aksesori...</p>
          ) : accessories.length === 0 ? (
            <p className="text-gray-500">Data aksesori akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="overflow-hidden rounded-xl border border-gray-200 hover:border-sea-ocean/30 hover:shadow-md transition-all duration-200 group bg-white">
                  {accessory.photo_url && (
                    <div className="h-32 bg-gray-100 overflow-hidden">
                      <img
                        src={accessory.photo_url}
                        alt={accessory.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 text-sm">{accessory.name}</h3>
                    <p className="text-lg font-bold text-gray-900 mb-2">
                      {formatRupiah(accessory.price_idr)}
                    </p>
                    {accessory.short_desc && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {accessory.short_desc}
                      </p>
                    )}
                    <span className={`text-xs px-2 py-1 rounded border inline-block ${accessory.stock > 0 ? 'bg-sea-teal/5 text-sea-teal border-sea-teal/20' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                      {accessory.stock > 0 ? `Stok: ${accessory.stock}` : "Kosong"}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Peta Lokasi */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-sea-kelp/10 flex items-center justify-center">
                <Navigation className="h-5 w-5 text-sea-kelp" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Peta Lokasi</h2>
            </div>
            <p className="text-sm text-gray-500">Navigasi ke Pantai Karangtawulan</p>
          </div>
          <Card className="p-6 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold mb-1">Pantai Karangtawulan</h3>
                <p className="text-sm text-gray-500">
                  Tasikmalaya, Jawa Barat
                </p>
              </div>
              <Button size="sm" onClick={handleGoogleMaps} className="bg-sea-ocean hover:bg-sea-teal transition-colors text-sm h-9">
                <Navigation className="mr-1.5 h-4 w-4" />
                Buka di Maps
              </Button>
            </div>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.3!2d108.2!3d-7.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTgnMDAuMCJTIDEwOMKwMTInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
