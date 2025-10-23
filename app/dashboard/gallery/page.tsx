"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    url: "",
    category: "",
    credit: "",
    takenAt: "",
    published: true,
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Galeri</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Foto dan media gallery</p>
        </div>
        <Button 
          onClick={() => {
            setEditingImage(null);
            setFormData({
              url: "",
              category: "",
              credit: "",
              takenAt: "",
              published: true,
            });
            setSelectedFile(null);
            setPreviewUrl(null);
            setIsDialogOpen(true);
          }}
          size="sm"
          className="bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-lg flex-shrink-0"
        >
          <Upload className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Upload</span>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Total</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Tayang</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Draft</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2 font-bold">{images.length}</td>
              <td className="px-3 py-2 font-bold text-green-600">{images.filter(i => i.published).length}</td>
              <td className="px-3 py-2 font-bold text-gray-600">{images.filter(i => !i.published).length}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Gallery Images</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Klik foto untuk edit atau hapus</CardDescription>
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
                {img.url ? (
                  <img src={img.url} alt={img.category || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Upload Button */}
            <button 
              onClick={() => {
                setEditingImage(null);
                setFormData({
                  url: "",
                  category: "",
                  credit: "",
                  takenAt: "",
                  published: true,
                });
                setSelectedFile(null);
                setPreviewUrl(null);
                setIsDialogOpen(true);
              }}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-sea-ocean hover:bg-sea-foam/10 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-sea-ocean"
            >
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
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="image" className="mb-2">Upload Foto *</Label>
              <div className="mt-2">
                {previewUrl || (editingImage && formData.url) ? (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <img 
                      src={previewUrl || formData.url} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (!editingImage) {
                          setFormData({ ...formData, url: "" });
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewUrl(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG, WEBP (Max 5MB)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="mb-2">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunset">Sunset</SelectItem>
                    <SelectItem value="sunrise">Sunrise</SelectItem>
                    <SelectItem value="aktivitas">Aktivitas</SelectItem>
                    <SelectItem value="pantai">Pantai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="credit" className="mb-2">Credit</Label>
                <Input
                  id="credit"
                  value={formData.credit}
                  onChange={(e) => setFormData({ ...formData, credit: e.target.value })}
                  placeholder="Nama fotografer"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="takenAt" className="mb-2">Tanggal Pengambilan</Label>
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
              <Label htmlFor="published">Posting foto ini</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Batal
            </Button>
            <Button
              onClick={async () => {
                // Validation
                if (!editingImage && !selectedFile) {
                  toast({
                    title: "Error",
                    description: "Pilih foto terlebih dahulu",
                    variant: "destructive",
                  });
                  return;
                }

                setIsSaving(true);
                setUploading(true);
                
                try {
                  let imageUrl = formData.url;

                  // Upload file if new file selected
                  if (selectedFile) {
                    const fileExt = selectedFile.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                    const filePath = `gallery/${fileName}`;

                    const formDataUpload = new FormData();
                    formDataUpload.append('file', selectedFile);
                    formDataUpload.append('path', filePath);

                    const uploadResponse = await fetch('/api/upload', {
                      method: 'POST',
                      body: formDataUpload,
                    });

                    if (!uploadResponse.ok) throw new Error('Upload failed');
                    
                    const uploadData = await uploadResponse.json();
                    imageUrl = uploadData.url;
                  }

                  // Save to database
                  const payload = {
                    url: imageUrl,
                    category: formData.category,
                    credit: formData.credit,
                    takenAt: formData.takenAt || null,
                    published: formData.published,
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
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  fetchImages();
                } catch (error) {
                  console.error('Error:', error);
                  toast({
                    title: "Error",
                    description: "Gagal menyimpan foto",
                    variant: "destructive",
                  });
                } finally {
                  setIsSaving(false);
                  setUploading(false);
                }
              }}
              disabled={isSaving || (!editingImage && !selectedFile)}
              className="bg-gradient-to-r from-sea-ocean to-sea-teal"
            >
              {uploading ? "Mengupload..." : isSaving ? "Menyimpan..." : "Simpan"}
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
