"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateBookingWhatsAppUrl, type BookingFormData } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";
import { Calendar, Clock, Users, MessageCircle, User, Phone, Package, Send, Sparkles } from "lucide-react";

const bookingSchema = z.object({
  paket: z.string().min(1, "Pilih paket wisata"),
  pax: z.number().min(1, "Minimal 1 orang"),
  tanggal: z.string().min(1, "Pilih tanggal"),
  jam: z.string().min(1, "Pilih jam"),
  opsi_tambahan: z.string().optional(),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  wa_pemesan: z.string().min(10, "Nomor WhatsApp tidak valid"),
});

type BookingForm = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingForm) => {
    setIsSubmitting(true);
    try {
      // Save lead to database
      await supabase.from("leads").insert({
        kind: "booking",
        payload: data,
        user_agent: navigator.userAgent,
      });

      // Generate WhatsApp URL
      const whatsappUrl = generateBookingWhatsAppUrl(data as BookingFormData);

      // Redirect to WhatsApp
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      console.error("Error saving lead:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-10 rounded-3xl border-0 shadow-xl bg-gradient-to-br from-white to-sea-foam/10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-sea-ocean/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-sea-ocean" />
          </div>
          <h3 className="text-3xl font-bold tracking-tight">Form Booking</h3>
        </div>
        <p className="text-gray-600">Lengkapi data di bawah untuk melanjutkan booking</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Paket */}
        <div>
          <Label htmlFor="paket" className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-sea-ocean" />
            Paket Wisata *
          </Label>
          <Select onValueChange={(value) => setValue("paket", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih paket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paket 100K">Paket 100K</SelectItem>
              <SelectItem value="Paket 190K">Paket 190K</SelectItem>
              <SelectItem value="Paket 250K">Paket 250K</SelectItem>
            </SelectContent>
          </Select>
          {errors.paket && (
            <p className="text-sm text-red-500 mt-1">{errors.paket.message}</p>
          )}
        </div>

        {/* Jumlah Orang */}
        <div>
          <Label htmlFor="pax" className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-sea-ocean" />
            Jumlah Orang *
          </Label>
          <Input
            id="pax"
            type="number"
            min={1}
            {...register("pax", { valueAsNumber: true })}
            placeholder="Contoh: 4"
          />
          {errors.pax && (
            <p className="text-sm text-red-500 mt-1">{errors.pax.message}</p>
          )}
        </div>

        {/* Tanggal & Jam - Grid 2 Column */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="tanggal" className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sea-ocean" />
              Tanggal *
            </Label>
            <Input
              id="tanggal"
              type="date"
              {...register("tanggal")}
              className="h-12"
            />
            {errors.tanggal && (
              <p className="text-sm text-red-500 mt-1">{errors.tanggal.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="jam" className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-sea-ocean" />
              Jam *
            </Label>
            <Input
              id="jam"
              type="time"
              {...register("jam")}
              className="h-12"
            />
            {errors.jam && (
              <p className="text-sm text-red-500 mt-1">{errors.jam.message}</p>
            )}
          </div>
        </div>

        {/* Opsi Tambahan */}
        <div>
          <Label htmlFor="opsi_tambahan" className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sea-ocean" />
            Opsi Tambahan (Opsional)
          </Label>
          <Textarea
            id="opsi_tambahan"
            {...register("opsi_tambahan")}
            placeholder="Contoh: Tambah guide, dokumentasi, atau permintaan khusus lainnya"
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Nama & WhatsApp - Grid 2 Column */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="nama" className="text-sm font-semibold mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-sea-ocean" />
              Nama Lengkap *
            </Label>
            <Input
              id="nama"
              {...register("nama")}
              placeholder="Nama Anda"
              className="h-12"
            />
            {errors.nama && (
              <p className="text-sm text-red-500 mt-1">{errors.nama.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="wa_pemesan" className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Phone className="h-4 w-4 text-sea-ocean" />
              Nomor WhatsApp *
            </Label>
            <Input
              id="wa_pemesan"
              {...register("wa_pemesan")}
              placeholder="08123456789"
              className="h-12"
            />
            {errors.wa_pemesan && (
              <p className="text-sm text-red-500 mt-1">{errors.wa_pemesan.message}</p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <Card className="p-6 rounded-2xl border-0 bg-sea-ocean/5">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-sea-ocean/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="h-5 w-5 text-sea-ocean" />
            </div>
            <div>
              <div className="font-semibold text-sm mb-1 text-sea-ocean">Info Penting</div>
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>DP 50%</strong> - Setelah submit, Anda akan diarahkan ke WhatsApp untuk konfirmasi dan pembayaran down payment.
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
            <span className="animate-pulse">Memproses...</span>
          ) : (
            <>
              <MessageCircle className="mr-2 h-5 w-5" />
              Booking via WhatsApp
              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
