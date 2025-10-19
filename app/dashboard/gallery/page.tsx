"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Image as ImageIcon,
  Upload
} from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  category?: string;
  credit?: string;
  takenAt?: string;
  published: boolean;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    url: "",
    category: "",
    credit: "",
    takenAt: "",
    published: false,
  });

  const fetchImages = async () => {
    try {
      const response = await fetch("/api/gallery");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data galeri",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galeri</h1>
          <p className="text-gray-600">Foto dan media gallery</p>
        </div>
        <Button 
          onClick={() => {
            setEditingImage(null);
            setFormData({
              url: "",
              category: "",
              credit: "",
              takenAt: "",
              published: false,
            });
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Foto
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Foto</CardTitle>
            <ImageIcon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{images.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {images.filter(i => i.published).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <EyeOff className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {images.filter(i => !i.published).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>Klik foto untuk edit atau hapus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-sea-ocean transition-colors">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        {img.category && (
                          <p className="text-xs font-medium uppercase tracking-wider">{img.category}</p>
                        )}
                        {img.credit && (
                          <p className="text-xs opacity-75">Photo by {img.credit}</p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => {
                            setEditingImage(img);
                            setFormData({
                              url: img.url,
                              category: img.category || "",
                              credit: img.credit || "",
                              takenAt: img.takenAt ? new Date(img.takenAt).toISOString().split('T')[0] : "",
                              published: img.published,
                            });
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-white hover:bg-white/20"
                          onClick={() => setDeleteId(img.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            ))}
            
            {/* Upload Button */}
            <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-sea-ocean hover:bg-sea-foam/10 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-sea-ocean">
              <Plus className="h-8 w-8" />
              <span className="text-xs font-medium">Upload</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Edit Foto" : "Tambah Foto Baru"}</DialogTitle>
            <DialogDescription>
              {editingImage ? "Update informasi foto" : "Upload foto baru ke galeri"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="url">URL Foto *</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">Masukkan URL foto atau upload ke hosting terlebih dahulu</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="landscape, activities, etc."
                />
              </div>
              <div>
                <Label htmlFor="credit">Credit</Label>
                <Input
                  id="credit"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                  placeholder="Nama fotografer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="takenAt">Tanggal Pengambilan</Label>
              <Input
                id="takenAt"
                type="date"
                value={formData.takenAt}
                onChange={(e) => setFormData({ ...formData, takenAt: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publish foto ini</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button
              onClick={async () => {
                setIsSaving(true);
                try {
                  const payload = {
                    ...formData,
                    takenAt: formData.takenAt || null,
                  };

                  const url = editingImage ? `/api/gallery/${editingImage.id}` : "/api/gallery";
                  const method = editingImage ? "PATCH" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) throw new Error("Failed to save");

                  toast({
                    title: "Berhasil",
                    description: editingImage ? "Foto berhasil diupdate" : "Foto berhasil ditambahkan",
                  });

                  setIsDialogOpen(false);
                  fetchImages();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menyimpan foto",
                    variant: "destructive",
                  });
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving || !formData.url}
              className="bg-gradient-to-r from-orange-500 to-red-500"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Foto akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await fetch(`/api/gallery/${deleteId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) throw new Error("Failed to delete");

                  toast({
                    title: "Berhasil",
                    description: "Foto berhasil dihapus",
                  });

                  fetchImages();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menghapus foto",
                    variant: "destructive",
                  });
                } finally {
                  setDeleteId(null);
                }
              }}
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
