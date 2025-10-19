"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase, type Package } from "@/lib/supabase";
import { X } from "lucide-react";

const packageSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  harga: z.number().min(1000, "Harga minimal 1000"),
  pax_min: z.number().min(1, "Minimal 1 orang"),
  pax_max: z.number().min(1, "Minimal 1 orang"),
  durasi_jam: z.number().min(1, "Durasi minimal 1 jam"),
  facilities: z.string().min(5, "Minimal 1 fasilitas"),
  notes: z.string().optional(),
  dp_percent: z.number().min(0).max(100),
  sort_order: z.number().min(0),
  published: z.boolean().optional(),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: Package | null;
}

export function PackageForm({ isOpen, onClose, onSuccess, editData }: PackageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [facilitiesList, setFacilitiesList] = useState<string[]>([]);
  const [facilityInput, setFacilityInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      dp_percent: 50,
      sort_order: 0,
      published: true, // Default to true for new packages
    },
  });

  useEffect(() => {
    if (editData) {
      reset({
        nama: editData.nama,
        harga: editData.harga,
        pax_min: editData.pax_min,
        pax_max: editData.pax_max,
        durasi_jam: editData.durasi_jam,
        facilities: editData.facilities.join("\n"),
        notes: editData.notes || "",
        dp_percent: editData.dp_percent,
        sort_order: editData.sort_order,
        published: editData.published,
      });
      setFacilitiesList(editData.facilities);
    } else {
      reset({
        dp_percent: 50,
        sort_order: 0,
        published: true, // Default to true for new packages
      });
      setFacilitiesList([]);
    }
  }, [editData, reset]);

  const addFacility = () => {
    if (facilityInput.trim()) {
      const newList = [...facilitiesList, facilityInput.trim()];
      setFacilitiesList(newList);
      setValue("facilities", newList.join("\n"));
      setFacilityInput("");
    }
  };

  const removeFacility = (index: number) => {
    const newList = facilitiesList.filter((_, i) => i !== index);
    setFacilitiesList(newList);
    setValue("facilities", newList.join("\n"));
  };

  const onSubmit = async (data: PackageFormData) => {
    setIsSubmitting(true);
    try {
      const packageData = {
        nama: data.nama,
        harga: data.harga,
        pax_min: data.pax_min,
        pax_max: data.pax_max,
        durasi_jam: data.durasi_jam,
        facilities: facilitiesList,
        notes: data.notes || null,
        dp_percent: data.dp_percent,
        sort_order: data.sort_order,
        published: data.published ?? true, // Use the checkbox value, default to true
        updated_at: new Date().toISOString(),
      };

      if (editData) {
        // Update existing
        const { error } = await supabase
          .from("packages")
          .update(packageData)
          .eq("id", editData.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("packages").insert({
          ...packageData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        });

        if (error) throw error;
      }

      onSuccess();
      onClose();
      reset();
      setFacilitiesList([]);
    } catch (error: any) {
      console.error("Error saving package:", error);
      alert("Gagal menyimpan paket: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Paket Wisata" : "Tambah Paket Wisata"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nama Paket */}
          <div>
            <Label htmlFor="nama">Nama Paket *</Label>
            <Input
              id="nama"
              {...register("nama")}
              placeholder="Contoh: Paket 100K"
            />
            {errors.nama && (
              <p className="text-sm text-red-500 mt-1">{errors.nama.message}</p>
            )}
          </div>

          {/* Harga */}
          <div>
            <Label htmlFor="harga">Harga (Rp) *</Label>
            <Input
              id="harga"
              type="number"
              {...register("harga", { valueAsNumber: true })}
              placeholder="100000"
            />
            {errors.harga && (
              <p className="text-sm text-red-500 mt-1">{errors.harga.message}</p>
            )}
          </div>

          {/* Pax Min & Max */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pax_min">Jumlah Min *</Label>
              <Input
                id="pax_min"
                type="number"
                {...register("pax_min", { valueAsNumber: true })}
                placeholder="1"
              />
              {errors.pax_min && (
                <p className="text-sm text-red-500 mt-1">{errors.pax_min.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="pax_max">Jumlah Max *</Label>
              <Input
                id="pax_max"
                type="number"
                {...register("pax_max", { valueAsNumber: true })}
                placeholder="10"
              />
              {errors.pax_max && (
                <p className="text-sm text-red-500 mt-1">{errors.pax_max.message}</p>
              )}
            </div>
          </div>

          {/* Durasi */}
          <div>
            <Label htmlFor="durasi_jam">Durasi (Jam) *</Label>
            <Input
              id="durasi_jam"
              type="number"
              {...register("durasi_jam", { valueAsNumber: true })}
              placeholder="3"
            />
            {errors.durasi_jam && (
              <p className="text-sm text-red-500 mt-1">{errors.durasi_jam.message}</p>
            )}
          </div>

          {/* Fasilitas */}
          <div>
            <Label>Fasilitas *</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                placeholder="Tambah fasilitas, tekan Enter"
              />
              <Button type="button" onClick={addFacility}>
                Tambah
              </Button>
            </div>
            <div className="space-y-2">
              {facilitiesList.map((facility, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span>{facility}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFacility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.facilities && (
              <p className="text-sm text-red-500 mt-1">{errors.facilities.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Contoh: Cocok untuk solo traveler"
              rows={3}
            />
          </div>

          {/* DP Percent & Sort Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dp_percent">DP (%) *</Label>
              <Input
                id="dp_percent"
                type="number"
                {...register("dp_percent", { valueAsNumber: true })}
                placeholder="50"
              />
            </div>
            <div>
              <Label htmlFor="sort_order">Urutan *</Label>
              <Input
                id="sort_order"
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Publish Checkbox */}
          <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Checkbox
              id="published"
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked as boolean)}
            />
            <Label
              htmlFor="published"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Publish paket ini sekarang (paket akan langsung tampil di website)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : editData ? "Update" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
