"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Save, X, MapPin, Clock, Upload, Image as ImageIcon } from "lucide-react";
import type { Destination } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminDestinasiPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Destination>>({
    name: "",
    description: "",
    distance_from_karangtawulan: "",
    travel_time: "",
    highlights: [],
    photo_url: "",
    published: true,
    sort_order: 0,
  });
  const [highlightsInput, setHighlightsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      const response = await fetch("/api/destinations?includeUnpublished=true", {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setDestinations(data);
      } else {
        console.error("API response is not an array:", data);
        setDestinations([]);
      }
    } catch (error) {
      console.error("Error loading destinations:", error);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      distance_from_karangtawulan: "",
      travel_time: "",
      highlights: [],
      photo_url: "",
      published: true,
      sort_order: destinations.length,
    });
    setHighlightsInput("");
  };

  const handleEdit = (destination: Destination) => {
    setIsCreating(false);
    setEditingId(destination.id);
    setFormData(destination);
    setHighlightsInput(destination.highlights?.join("\n") || "");
    setImagePreview(null); // Reset preview, akan pakai photo_url existing
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      distance_from_karangtawulan: "",
      travel_time: "",
      highlights: [],
      photo_url: "",
      published: true,
      sort_order: 0,
    });
    setHighlightsInput("");
    setImagePreview(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("bucket", "destinations");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await response.json();
      
      setFormData({ ...formData, photo_url: url });
      
      toast({
        title: "Berhasil!",
        description: "Foto berhasil diupload",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Gagal mengupload foto. Silakan coba lagi.",
        variant: "destructive",
      });
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Parse highlights from textarea
      const highlights = highlightsInput
        .split("\n")
        .map((h) => h.trim())
        .filter((h) => h.length > 0);

      const dataToSave = {
        ...formData,
        highlights,
      };

      if (isCreating) {
        // Create new
        const response = await fetch("/api/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Create error:", errorData);
          throw new Error(errorData.error || "Failed to create");
        }
      } else if (editingId) {
        // Update existing
        const response = await fetch(`/api/destinations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Update error:", errorData);
          throw new Error(errorData.error || "Failed to update");
        }
      }

      await loadDestinations();
      handleCancel();
      toast({
        title: "Berhasil!",
        description: isCreating ? "Destinasi baru berhasil ditambahkan" : "Destinasi berhasil diperbarui",
      });
    } catch (error) {
      console.error("Error saving destination:", error);
      toast({
        title: "Error",
        description: `Gagal menyimpan destinasi: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      await loadDestinations();
      toast({
        title: "Berhasil!",
        description: "Destinasi berhasil dihapus",
      });
    } catch (error) {
      console.error("Error deleting destination:", error);
      toast({
        title: "Error",
        description: "Gagal menghapus destinasi. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Destinasi</h1>
          <p className="text-gray-600">
            Kelola destinasi wisata sekitar Pantai Karangtawulan
          </p>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Destinasi
          </Button>
        )}
      </div>

      {/* Form (Create/Edit) */}
      {(isCreating || editingId) && (
        <Card className="p-6 border-sea-ocean/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {isCreating ? "Tambah Destinasi Baru" : "Edit Destinasi"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2">Nama Destinasi *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="contoh: Sungai Cimedang"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Deskripsi lengkap tentang destinasi..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Distance */}
              <div>
                <Label htmlFor="distance" className="mb-2">Jarak dari Karangtawulan</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <Input
                    id="distance"
                    value={formData.distance_from_karangtawulan || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        distance_from_karangtawulan: e.target.value,
                      })
                    }
                    placeholder="contoh: 5 km"
                  />
                </div>
              </div>

              {/* Travel Time */}
              <div>
                <Label htmlFor="travelTime" className="mb-2">Waktu Tempuh</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="travelTime"
                    value={formData.travel_time || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, travel_time: e.target.value })
                    }
                    placeholder="contoh: 15 menit"
                  />
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <Label htmlFor="highlights" className="mb-2">Aktivitas & Daya Tarik</Label>
              <Textarea
                id="highlights"
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                placeholder="Masukkan satu aktivitas per baris&#10;contoh:&#10;Berenang di sungai jernih&#10;Piknik di tepi sungai&#10;Foto spot alami"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                Satu aktivitas per baris
              </p>
            </div>

            {/* Photo Upload */}
            <div>
              <Label htmlFor="photo" className="mb-2">Foto Destinasi *</Label>
              <div className="space-y-3">
                {/* Preview */}
                {(imagePreview || formData.photo_url) && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={imagePreview || formData.photo_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null);
                        setFormData({ ...formData, photo_url: "" });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("photo")?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                        Mengupload...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        {imagePreview || formData.photo_url ? "Ganti Foto" : "Upload Foto"}
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG, WebP. Maks 5MB. Rekomendasi: 1200x800px
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Posting */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="published" className="cursor-pointer">
                  Posting
                </Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
              </div>

              {/* Sort Order */}
              <div>
                <Label htmlFor="sortOrder">Urutan</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              className="flex-1 bg-sea-ocean hover:bg-sea-teal"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Batal
            </Button>
          </div>
        </Card>
      )}

      {/* List */}
      <div className="space-y-4">
        {destinations.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Belum ada destinasi. Tambah yang pertama!</p>
          </Card>
        ) : (
          destinations.map((destination) => (
            <Card
              key={destination.id}
              className={`p-6 ${
                !destination.published ? "opacity-60 border-dashed" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">{destination.name}</h3>
                    {!destination.published && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {destination.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    {destination.distance_from_karangtawulan && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{destination.distance_from_karangtawulan}</span>
                      </div>
                    )}
                    {destination.travel_time && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{destination.travel_time}</span>
                      </div>
                    )}
                  </div>

                  {destination.highlights && destination.highlights.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        {destination.highlights.length} aktivitas
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(destination)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteId(destination.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Destinasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Destinasi ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
