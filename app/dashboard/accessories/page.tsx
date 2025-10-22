"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  ShoppingBag,
  DollarSign,
  Package
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Accessory {
  id: string;
  name: string;
  priceIdr: number;
  stock: number;
  photoUrl?: string;
  shortDesc?: string;
  published: boolean;
}

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    priceIdr: 0,
    stock: 0,
    photoUrl: "",
    shortDesc: "",
    published: false,
  });

  const fetchAccessories = async () => {
    try {
      const response = await fetch("/api/accessories");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAccessories(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data aksesori",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const formatRupiah = (amount: number) => {
    return "Rp " + new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aksesori</h1>
          <p className="text-gray-600">Aksesori yang bisa disewa</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAccessory(null);
            setFormData({
              name: "",
              priceIdr: 0,
              stock: 0,
              photoUrl: "",
              shortDesc: "",
              published: false,
            });
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Aksesori
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accessories.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accessories.reduce((sum, acc) => sum + acc.stock, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {accessories.filter(a => a.published).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Aksesori</CardTitle>
          <CardDescription>Semua aksesori yang tersedia untuk disewa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga Sewa</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessories.map((acc) => (
                <TableRow key={acc.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{acc.name}</div>
                      {acc.shortDesc && (
                        <div className="text-sm text-gray-500">{acc.shortDesc}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{formatRupiah(acc.priceIdr)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={acc.stock > 5 ? "default" : "destructive"}>
                      {acc.stock} unit
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {acc.published ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => {
                          setEditingAccessory(acc);
                          setFormData({
                            name: acc.name,
                            priceIdr: acc.priceIdr,
                            stock: acc.stock,
                            photoUrl: acc.photoUrl || "",
                            shortDesc: acc.shortDesc || "",
                            published: acc.published,
                          });
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(acc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAccessory ? "Edit Aksesori" : "Tambah Aksesori Baru"}</DialogTitle>
            <DialogDescription>
              {editingAccessory ? "Update informasi aksesori" : "Buat aksesori baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tenda 4 Orang"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priceIdr">Harga Sewa (IDR) *</Label>
                <Input
                  id="priceIdr"
                  type="number"
                  value={formData.priceIdr}
                  onChange={(e) => setFormData({ ...formData, priceIdr: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stok *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="shortDesc">Deskripsi Singkat</Label>
              <Textarea
                id="shortDesc"
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="Tenda berkualitas untuk 4 orang"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publish aksesori ini</Label>
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
                  const url = editingAccessory ? `/api/accessories/${editingAccessory.id}` : "/api/accessories";
                  const method = editingAccessory ? "PATCH" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                  });

                  if (!response.ok) throw new Error("Failed to save");

                  toast({
                    title: "Berhasil",
                    description: editingAccessory ? "Aksesori berhasil diupdate" : "Aksesori berhasil ditambahkan",
                  });

                  setIsDialogOpen(false);
                  fetchAccessories();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menyimpan data",
                    variant: "destructive",
                  });
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving || !formData.name || formData.priceIdr <= 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
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
            <AlertDialogTitle>Hapus Aksesori?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Aksesori akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await fetch(`/api/accessories/${deleteId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) throw new Error("Failed to delete");

                  toast({
                    title: "Berhasil",
                    description: "Aksesori berhasil dihapus",
                  });

                  fetchAccessories();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menghapus aksesori",
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
