"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, Send, Sparkles, Clock } from "lucide-react";
import { generateKontakWhatsAppUrl, type KontakFormData } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

const kontakSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  wa_pemesan: z.string().min(10, "Nomor WhatsApp tidak valid"),
  pesan: z.string().min(10, "Pesan minimal 10 karakter"),
});

type KontakForm = z.infer<typeof kontakSchema>;

export default function KontakPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KontakForm>({
    resolver: zodResolver(kontakSchema),
  });

  const onSubmit = async (data: KontakForm) => {
    setIsSubmitting(true);
    try {
      // Save lead to database
      await supabase.from("leads").insert({
        kind: "kontak",
        payload: data,
        user_agent: navigator.userAgent,
      });

      // Generate WhatsApp URL
      const whatsappUrl = generateKontakWhatsAppUrl(data as KontakFormData);

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waAdmin = "6282218738881";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sea-foam/30 to-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-sea-ocean/10 text-sea-ocean border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Hubungi Kami
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
              Mari
              <span className="block text-sea-ocean">Bicara</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Kami siap membantu Anda merencanakan liburan sempurna. Hubungi kami untuk pertanyaan, booking, atau informasi lebih lanjut.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Information - Left Sidebar */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Informasi Kontak</h2>
            <p className="text-gray-600 mb-8">Beberapa cara untuk menghubungi kami</p>

            <div className="space-y-4">
              <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-sea-ocean/5 to-transparent hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sea-ocean/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="h-6 w-6 text-sea-ocean" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alamat</h3>
                    <p className="text-gray-600">
                      Pantai Karangtawulan
                      <br />
                      Tasikmalaya, Jawa Barat
                      <br />
                      Indonesia
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-sea-teal/5 to-transparent hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sea-teal/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-sea-teal" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${waAdmin}`}
                      className="text-sea-ocean hover:text-sea-teal transition-colors font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +{waAdmin}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                      Klik untuk chat langsung via WhatsApp
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-sea-coral/5 to-transparent hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sea-coral/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-sea-coral" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@karangtawulan.com"
                      className="text-sea-ocean hover:text-sea-teal transition-colors font-medium"
                    >
                      info@karangtawulan.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl border-0 bg-gradient-to-br from-sea-foam/50 to-transparent hover:shadow-lg transition-all duration-300">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sea-ocean/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-sea-ocean" />
                  </div>
                  Media Sosial
                </h3>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gray-700 hover:text-sea-turquoise transition-colors"
                  >
                    <Facebook className="h-6 w-6" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gray-700 hover:text-sea-coral transition-colors"
                  >
                    <Instagram className="h-6 w-6" />
                    <span>Instagram</span>
                  </a>
                </div>
              </Card>

              {/* Quick Contact - Prominent */}
              <Card className="p-8 rounded-3xl border-0 bg-gradient-to-br from-sea-teal via-sea-ocean to-sea-kelp text-white shadow-xl mt-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Chat Langsung
                </h3>
                <p className="text-sm opacity-90 mb-6">
                  Butuh respon cepat? Hubungi kami langsung via WhatsApp
                </p>
                <Button
                  asChild
                  className="w-full bg-white text-sea-ocean hover:bg-sea-sand transition-all duration-300 shadow-lg h-12 font-semibold"
                >
                  <a
                    href={`https://wa.me/${waAdmin}?text=Halo Admin Karangtawulan, saya ingin bertanya tentang`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Chat via WhatsApp
                  </a>
                </Button>
              </Card>
            </div>
          </div>

          {/* Contact Form - Main Content */}
          <div className="lg:col-span-3">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Kirim Pesan</h2>
              <p className="text-gray-600 mb-8">Isi form dan kami akan menghubungi Anda via WhatsApp</p>
            </div>
            <Card className="p-10 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-white to-sea-foam/10">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    {...register("nama")}
                    placeholder="Nama Anda"
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.nama.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="wa_pemesan">Nomor WhatsApp *</Label>
                  <Input
                    id="wa_pemesan"
                    {...register("wa_pemesan")}
                    placeholder="08123456789"
                  />
                  {errors.wa_pemesan && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.wa_pemesan.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pesan">Pesan *</Label>
                  <Textarea
                    id="pesan"
                    {...register("pesan")}
                    placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                    rows={6}
                  />
                  {errors.pesan && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.pesan.message}
                    </p>
                  )}
                </div>

                <Card className="p-5 rounded-2xl border-0 bg-sea-ocean/5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sea-ocean/10 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-sea-ocean" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1 text-sea-ocean">Instant Response</div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Setelah submit, Anda akan langsung diarahkan ke WhatsApp untuk melanjutkan percakapan dengan tim kami.
                      </p>
                    </div>
                  </div>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-xl transition-all duration-300 h-14 text-base font-semibold group"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">Mengirim...</span>
                    </>
                  ) : (
                    <>
                      Kirim Pesan via WhatsApp
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Section - Full Width */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Lokasi Kami</h2>
            <p className="text-xl text-gray-600">Pantai Karangtawulan, Tasikmalaya</p>
          </div>
          <Card className="overflow-hidden rounded-3xl shadow-2xl border-0">
            <div className="aspect-video bg-gray-200">
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
          </Card>
        </div>
      </div>
    </div>
  );
}
