import { z } from "zod";

// Package validation schema
export const packageSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi").max(200, "Nama terlalu panjang"),
  harga: z.number().int().positive("Harga harus positif").max(100000000, "Harga terlalu besar"),
  paxMin: z.number().int().positive("Minimal pax harus positif").max(1000, "Terlalu banyak"),
  paxMax: z.number().int().positive("Maksimal pax harus positif").max(1000, "Terlalu banyak"),
  durasiJam: z.number().int().positive("Durasi harus positif").max(240, "Durasi terlalu lama"),
  facilities: z.array(z.string().max(200)).max(50, "Terlalu banyak fasilitas"),
  notes: z.string().max(5000, "Notes terlalu panjang").optional().nullable(),
  dpPercent: z.number().int().min(0).max(100, "DP harus 0-100%").optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});

export const packageUpdateSchema = packageSchema.partial();

// Accommodation validation schema
export const accommodationSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200, "Nama terlalu panjang"),
  type: z.enum(["vila", "penginapan", "camping"], { message: "Tipe tidak valid" }),
  distanceKm: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format jarak tidak valid").max(10).optional().nullable(),
  priceFromIdr: z.number().int().nonnegative("Harga tidak boleh negatif").max(100000000).optional().nullable(),
  facilities: z.array(z.string().max(200)).max(50).optional(),
  contact: z.string().max(50, "Kontak terlalu panjang").optional().nullable(),
  photoUrl: z.string().url("URL foto tidak valid").max(500).optional().nullable().or(z.literal("")),
  rules: z.string().max(2000, "Peraturan terlalu panjang").optional().nullable(),
  published: z.boolean().optional(),
});

export const accommodationUpdateSchema = accommodationSchema.partial();

// Accessory validation schema
export const accessorySchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(200, "Nama terlalu panjang"),
  priceIdr: z.number().int().positive("Harga harus positif").max(10000000),
  stock: z.number().int().nonnegative("Stok tidak boleh negatif").max(10000),
  photoUrl: z.string().url("URL foto tidak valid").max(500).optional().nullable().or(z.literal("")),
  shortDesc: z.string().max(500, "Deskripsi terlalu panjang").optional().nullable(),
  published: z.boolean().optional(),
});

export const accessoryUpdateSchema = accessorySchema.partial();

// Gallery validation schema
export const gallerySchema = z.object({
  url: z.string().url("URL foto tidak valid").max(500),
  category: z.string().max(100, "Kategori terlalu panjang").optional().nullable(),
  credit: z.string().max(200, "Credit terlalu panjang").optional().nullable(),
  takenAt: z.string().datetime().optional().nullable().or(z.literal("")),
  published: z.boolean().optional(),
});

export const galleryUpdateSchema = gallerySchema.partial();

// Lead validation schema (untuk form submissions dari website)
export const leadSchema = z.object({
  kind: z.enum(["booking", "akomodasi", "aksesori", "kontak"], { message: "Tipe form tidak valid" }),
  payload: z.record(z.string(), z.unknown()),
  userAgent: z.string().max(500).optional(),
  ip: z.string().max(50).optional(),
});

// Helper untuk validasi
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
