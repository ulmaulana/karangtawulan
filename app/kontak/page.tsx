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
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle, Send, Sparkles, Clock, Youtube } from "lucide-react";
import { generateKontakWhatsAppUrl, type KontakFormData } from "@/lib/whatsapp";

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
      // Generate WhatsApp URL (client-side only, no database)
      const whatsappUrl = generateKontakWhatsAppUrl(data as KontakFormData);

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error generating WhatsApp URL:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waAdmin = "6282218738881";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header - Minimalist */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-sea-ocean mb-3 tracking-wide uppercase">
              Contact
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              Hubungi Kami
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl">
              Kami siap membantu Anda merencanakan liburan sempurna. Hubungi kami untuk pertanyaan, booking, atau informasi lebih lanjut.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Informasi Kontak</h2>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-sea-ocean/30 transition-all bg-white">
                <div className="w-10 h-10 rounded-lg bg-sea-ocean/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-sea-ocean" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Alamat</h3>
                  <p className="text-gray-900 leading-relaxed">
                    Pantai Karangtawulan<br />
                    Tasikmalaya, Jawa Barat
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-sea-ocean/30 transition-all bg-white">
                <div className="w-10 h-10 rounded-lg bg-sea-teal/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-sea-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">WhatsApp</h3>
                  <a
                    href={`https://wa.me/${waAdmin}`}
                    className="text-sea-ocean hover:text-sea-teal transition-colors font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +{waAdmin}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 hover:border-sea-ocean/30 transition-all bg-white">
                <div className="w-10 h-10 rounded-lg bg-sea-coral/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-sea-coral" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500 mb-1">Email</h3>
                  <a
                    href="mailto:karangtawulan260@gmail.com"
                    className="text-sea-ocean hover:text-sea-teal transition-colors font-medium break-all"
                  >
                    karangtawulan260@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4 text-sm text-gray-500">Ikuti Kami</h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Instagram */}
                <a
                  href="https://instagram.com/karangtawulanofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-pink-500/30 hover:bg-pink-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Instagram className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Instagram</p>
                    <p className="text-sm font-medium text-gray-900 truncate">@karangtawulanofficial</p>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com/karangtawulan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-500/30 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Facebook className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Facebook</p>
                    <p className="text-sm font-medium text-gray-900 truncate">Karangtawulan</p>
                  </div>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com/@karangtawulanofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-gray-900/30 hover:bg-gray-50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">TikTok</p>
                    <p className="text-sm font-medium text-gray-900 truncate">@karangtawulanofficial</p>
                  </div>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com/@pantaikarangtawulanofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-500/30 hover:bg-red-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                    <Youtube className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">YouTube</p>
                    <p className="text-sm font-medium text-gray-900 truncate">PantaiKarangTawulanOfficial</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Kirim Pesan</h2>
            <Card className="p-6 rounded-xl border border-gray-200 bg-white">
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

                <div className="flex gap-3 p-4 rounded-lg bg-sea-ocean/5 border border-sea-ocean/10">
                  <MessageCircle className="h-5 w-5 text-sea-ocean flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Setelah submit, Anda akan langsung diarahkan ke WhatsApp untuk melanjutkan percakapan.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sea-ocean hover:bg-sea-teal transition-all h-11 text-sm font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Mengirim...</span>
                  ) : (
                    <>
                      Kirim Pesan via WhatsApp
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 tracking-tight">Lokasi Kami</h2>
          <Card className="overflow-hidden rounded-xl border border-gray-200">
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
