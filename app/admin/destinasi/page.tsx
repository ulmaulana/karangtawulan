"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Save, X, MapPin, Clock } from "lucide-react";
import type { Destination } from "@/lib/supabase";

export default function AdminDestinasiPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
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
      setDestinations(data);
    } catch (error) {
      console.error("Error loading destinations:", error);
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

        if (!response.ok) throw new Error("Failed to create");
      } else if (editingId) {
        // Update existing
        const response = await fetch(`/api/destinations/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });

        if (!response.ok) throw new Error("Failed to update");
      }

      await loadDestinations();
      handleCancel();
    } catch (error) {
      console.error("Error saving destination:", error);
      alert("Gagal menyimpan destinasi. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus destinasi ini?")) return;

    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      await loadDestinations();
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Gagal menghapus destinasi. Silakan coba lagi.");
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Kelola Destinasi</h1>
          <p className="text-gray-600">
            Kelola destinasi wisata sekitar Pantai Karangtawulan
          </p>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={handleCreate} className="bg-sea-ocean hover:bg-sea-teal">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Destinasi
          </Button>
        )}
      </div>

      {/* Form (Create/Edit) */}
      {(isCreating || editingId) && (
        <Card className="p-6 mb-8 border-sea-ocean/30">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">
              {isCreating ? "Tambah Destinasi Baru" : "Edit Destinasi"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Nama Destinasi *</Label>
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
              <Label htmlFor="description">Deskripsi *</Label>
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
                <Label htmlFor="distance">Jarak dari Karangtawulan</Label>
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
                <Label htmlFor="travelTime">Waktu Tempuh</Label>
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
              <Label htmlFor="highlights">Aktivitas & Daya Tarik</Label>
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

            {/* Photo URL */}
            <div>
              <Label htmlFor="photoUrl">URL Foto</Label>
              <Input
                id="photoUrl"
                value={formData.photo_url || ""}
                onChange={(e) =>
                  setFormData({ ...formData, photo_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Published */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor="published" className="cursor-pointer">
                  Publikasikan
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
                    onClick={() => handleDelete(destination.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
