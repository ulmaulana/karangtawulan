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
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sea-foam/30 to-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Panduan Lengkap
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Jelajah
              <span className="block text-sea-ocean">Karangtawulan</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Informasi lengkap seputar tiket masuk, kuliner, aksesori, dan lokasi Pantai Karangtawulan untuk pengalaman terbaik Anda.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20 space-y-20">
        {/* Tiket Masuk & Parkir */}
        <section>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-sea-ocean/10 flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-8 w-8 text-sea-ocean" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Tiket Masuk & Parkir</h2>
            <p className="text-xl text-gray-600">Harga masuk yang terjangkau untuk semua</p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data tiket...</p>
          ) : tickets.length === 0 ? (
            <p className="text-gray-500">Data tiket akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="p-8 text-center rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-sea-foam/10">
                  <div className="w-12 h-12 rounded-xl bg-sea-ocean/10 flex items-center justify-center mx-auto mb-4">
                    {ticket.category === 'parkir' ? (
                      <Car className="h-6 w-6 text-sea-ocean" />
                    ) : (
                      <Ticket className="h-6 w-6 text-sea-ocean" />
                    )}
                  </div>
                  <h3 className="font-bold mb-4 capitalize text-lg">
                    {ticket.category?.replace("_", " ")}
                  </h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent mb-2">
                    {ticket.price_idr ? formatRupiah(ticket.price_idr) : "Gratis"}
                  </p>
                  {ticket.note && (
                    <p className="text-xs text-gray-500 mt-3">{ticket.note}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Kuliner */}
        <section>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-sea-coral/10 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="h-8 w-8 text-sea-coral" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Kuliner</h2>
            <p className="text-xl text-gray-600">Berbagai pilihan makanan dan minuman</p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data kuliner...</p>
          ) : vendors.length === 0 ? (
            <p className="text-gray-500">Data kuliner akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendors.map((vendor) => (
                <Card key={vendor.id} className="p-8 rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-3 tracking-tight">{vendor.name}</h3>
                    {vendor.owner && (
                      <p className="text-sm text-gray-500 mb-3">
                        Oleh {vendor.owner}
                      </p>
                    )}
                  </div>
                  {vendor.highlight_menu && (
                    <div className="mb-4">
                      <Badge className="bg-sea-coral/10 text-sea-coral border-0 text-sm px-3 py-1">
                        ⭐ {vendor.highlight_menu}
                      </Badge>
                    </div>
                  )}
                  {vendor.price_range && (
                    <div className="mb-4 p-4 bg-sea-foam/20 rounded-xl">
                      <span className="text-xs font-bold text-sea-ocean uppercase tracking-wider">Kisaran Harga</span>
                      <p className="text-lg font-semibold text-gray-700 mt-1">{vendor.price_range}</p>
                    </div>
                  )}
                  {vendor.location_short && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-8 h-8 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-sea-ocean" />
                      </div>
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
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-sea-teal/10 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-8 w-8 text-sea-teal" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Aksesori</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Berbagai aksesori yang bisa Anda sewa atau beli untuk pengalaman yang lebih menyenangkan
            </p>
          </div>
          {loading ? (
            <p className="text-gray-500">Memuat data aksesori...</p>
          ) : accessories.length === 0 ? (
            <p className="text-gray-500">Data aksesori akan segera tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                  {accessory.photo_url && (
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={accessory.photo_url}
                        alt={accessory.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-bold mb-3 text-lg">{accessory.name}</h3>
                    <p className="text-2xl font-bold bg-gradient-to-r from-sea-ocean to-sea-teal bg-clip-text text-transparent mb-3">
                      {formatRupiah(accessory.price_idr)}
                    </p>
                    {accessory.short_desc && (
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {accessory.short_desc}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${accessory.stock > 0 ? 'bg-sea-teal/10 text-sea-teal' : 'bg-gray-100 text-gray-500'} border-0`}>
                        {accessory.stock > 0 ? `Stok: ${accessory.stock}` : "Kosong"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Peta Lokasi */}
        <section>
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-sea-kelp/10 flex items-center justify-center mx-auto mb-4">
              <Navigation className="h-8 w-8 text-sea-kelp" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Peta Lokasi</h2>
            <p className="text-xl text-gray-600">Temukan kami di Google Maps</p>
          </div>
          <Card className="p-10 text-center rounded-3xl border-0 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Pantai Karangtawulan</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Tasikmalaya, Jawa Barat
            </p>
            <div className="aspect-video bg-gray-200 rounded-2xl mb-8 overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.3!2d108.2!3d-7.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMTgnMDAuMCJTIDEwOMKwMTInMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <Button size="lg" onClick={handleGoogleMaps} className="bg-sea-kelp hover:bg-sea-ocean transition-all duration-300 h-14 text-base px-8">
              <Navigation className="mr-2 h-5 w-5" />
              Arahkan ke Google Maps
            </Button>
          </Card>
        </section>
      </div>
    </div>
  );
}
