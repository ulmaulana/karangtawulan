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
  Users,
  Clock,
  DollarSign,
  Package as PackageIcon
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Package {
  id: string;
  nama: string;
  harga: number;
  paxMin: number;
  paxMax: number;
  durasiJam: number;
  facilities: string[];
  notes?: string;
  dpPercent: number;
  published: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nama: "",
    harga: 0,
    paxMin: 1,
    paxMax: 50,
    durasiJam: 4,
    facilities: "" as string,
    notes: "",
    dpPercent: 50,
    published: false,
    sortOrder: 0,
  });

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data paket",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paket Wisata</h1>
          <p className="text-gray-600">
            Kelola paket wisata dan harga
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingPackage(null);
            setFormData({
              nama: "",
              harga: 0,
              paxMin: 1,
              paxMax: 50,
              durasiJam: 4,
              facilities: "",
              notes: "",
              dpPercent: 50,
              published: false,
              sortOrder: 0,
            });
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paket</CardTitle>
            <PackageIcon className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packages.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tayang</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {packages.filter(p => p.published).length}
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
              {packages.filter(p => !p.published).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Packages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Paket</CardTitle>
          <CardDescription>
            Semua paket wisata yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Paket</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Kapasitas</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{pkg.nama}</div>
                      <div className="text-sm text-gray-500">
                        {pkg.facilities.length} fasilitas
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{formatRupiah(pkg.harga)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      DP {pkg.dpPercent}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{pkg.paxMin}-{pkg.paxMax} orang</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{pkg.durasiJam} jam</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {pkg.published ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        <Eye className="h-3 w-3 mr-1" />
                        Tayang
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
                          setEditingPackage(pkg);
                          setFormData({
                            nama: pkg.nama,
                            harga: pkg.harga,
                            paxMin: pkg.paxMin,
                            paxMax: pkg.paxMax,
                            durasiJam: pkg.durasiJam,
                            facilities: pkg.facilities.join(", "),
                            notes: pkg.notes || "",
                            dpPercent: pkg.dpPercent,
                            published: pkg.published,
                            sortOrder: pkg.sortOrder,
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
                        onClick={() => setDeleteId(pkg.id)}
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

      {/* Empty State */}
      {packages.length === 0 && !isLoading && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <PackageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada paket wisata</h3>
            <p className="text-gray-600 mb-6">
              Mulai dengan menambahkan paket wisata pertama
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-sea-ocean to-sea-teal"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Paket
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Edit Paket" : "Tambah Paket Baru"}</DialogTitle>
            <DialogDescription>
              {editingPackage ? "Update informasi paket wisata" : "Buat paket wisata baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="nama">Nama Paket *</Label>
              <Input
                id="nama"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Paket Explore Karangtawulan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="harga">Harga (IDR) *</Label>
                <Input
                  id="harga"
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({ ...formData, harga: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="dpPercent">DP (%)</Label>
                <Input
                  id="dpPercent"
                  type="number"
                  value={formData.dpPercent}
                  onChange={(e) => setFormData({ ...formData, dpPercent: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paxMin">Kapasitas Min</Label>
                <Input
                  id="paxMin"
                  type="number"
                  value={formData.paxMin}
                  onChange={(e) => setFormData({ ...formData, paxMin: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="paxMax">Kapasitas Max</Label>
                <Input
                  id="paxMax"
                  type="number"
                  value={formData.paxMax}
                  onChange={(e) => setFormData({ ...formData, paxMax: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="durasiJam">Durasi (Jam)</Label>
              <Input
                id="durasiJam"
                type="number"
                value={formData.durasiJam}
                onChange={(e) => setFormData({ ...formData, durasiJam: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="facilities">Fasilitas (pisahkan dengan koma)</Label>
              <Textarea
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="Tracking, Dokumentasi, Air Mineral"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Harga per orang"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Posting paket ini</Label>
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
                    facilities: formData.facilities.split(",").map(f => f.trim()).filter(Boolean),
                  };

                  const url = editingPackage ? `/api/packages/${editingPackage.id}` : "/api/packages";
                  const method = editingPackage ? "PATCH" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) throw new Error("Failed to save");

                  toast({
                    title: "Berhasil",
                    description: editingPackage ? "Paket berhasil diupdate" : "Paket berhasil ditambahkan",
                  });

                  setIsDialogOpen(false);
                  fetchPackages();
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
              disabled={isSaving || !formData.nama || formData.harga <= 0}
              className="bg-gradient-to-r from-sea-ocean to-sea-teal"
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
            <AlertDialogTitle>Hapus Paket?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Paket akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await fetch(`/api/packages/${deleteId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) throw new Error("Failed to delete");

                  toast({
                    title: "Berhasil",
                    description: "Paket berhasil dihapus",
                  });

                  fetchPackages();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menghapus paket",
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
