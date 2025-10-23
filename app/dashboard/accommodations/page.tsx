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
  MapPin,
  Hotel as HotelIcon,
  DollarSign,
  Tent
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Accommodation {
  id: string;
  name: string;
  type: "vila" | "penginapan" | "camping";
  distanceKm?: number;
  priceFromIdr?: number;
  facilities?: string[];
  contact?: string;
  photoUrl?: string;
  rules?: string;
  published: boolean;
}

const typeLabels = {
  vila: "Vila",
  penginapan: "Penginapan",
  camping: "Camping"
};

const typeColors = {
  vila: "from-purple-500 to-pink-500",
  penginapan: "from-blue-500 to-cyan-500",
  camping: "from-green-500 to-emerald-500"
};

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    type: "vila" as "vila" | "penginapan" | "camping",
    distanceKm: 0,
    priceFromIdr: 0,
    facilities: "" as string,
    contact: "",
    photoUrl: "",
    rules: "",
    published: true,
  });

  const fetchAccommodations = async () => {
    try {
      const response = await fetch("/api/accommodations");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAccommodations(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data akomodasi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const formatRupiah = (amount: number) => {
    return "Rp" + new Intl.NumberFormat("id-ID", {
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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Akomodasi</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Vila, penginapan, dan camping</p>
        </div>
        <Button 
          onClick={() => {
            setEditingAccommodation(null);
            setFormData({
              name: "",
              type: "vila",
              distanceKm: 0,
              priceFromIdr: 0,
              facilities: "",
              contact: "",
              photoUrl: "",
              rules: "",
              published: true,
            });
            setIsDialogOpen(true);
          }}
          size="sm"
          className="bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-lg flex-shrink-0"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
          <span className="hidden sm:inline">Tambah</span>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Semua</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Vila</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Penginapan</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Camping</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-3 py-2 font-bold">{accommodations.length}</td>
              <td className="px-3 py-2 font-bold">{accommodations.filter(a => a.type === "vila").length}</td>
              <td className="px-3 py-2 font-bold">{accommodations.filter(a => a.type === "penginapan").length}</td>
              <td className="px-3 py-2 font-bold">{accommodations.filter(a => a.type === "camping").length}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Daftar Akomodasi</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Semua tempat menginap yang tersedia</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Nama</TableHead>
                  <TableHead className="min-w-[100px]">Tipe</TableHead>
                  <TableHead className="min-w-[80px]">Jarak</TableHead>
                  <TableHead className="min-w-[120px]">Harga Mulai</TableHead>
                  <TableHead className="min-w-[80px]">Status</TableHead>
                  <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {accommodations.map((acc) => (
                <TableRow key={acc.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{acc.name}</div>
                      {acc.facilities && (
                        <div className="text-sm text-gray-500">
                          {acc.facilities.length} fasilitas
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`bg-gradient-to-r ${typeColors[acc.type]} text-white`}>
                      {typeLabels[acc.type]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {acc.distanceKm ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{acc.distanceKm} km</span>
                      </div>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    {acc.priceFromIdr ? (
                      <div className="font-medium text-sm">{formatRupiah(acc.priceFromIdr)}</div>
                    ) : "-"}
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
                          setEditingAccommodation(acc);
                          setFormData({
                            name: acc.name,
                            type: acc.type,
                            distanceKm: acc.distanceKm || 0,
                            priceFromIdr: acc.priceFromIdr || 0,
                            facilities: acc.facilities?.join(", ") || "",
                            contact: acc.contact || "",
                            photoUrl: acc.photoUrl || "",
                            rules: acc.rules || "",
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
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAccommodation ? "Edit Akomodasi" : "Tambah Akomodasi Baru"}</DialogTitle>
            <DialogDescription>
              {editingAccommodation ? "Update informasi akomodasi" : "Buat akomodasi baru"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="name" className="mb-2">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Villa Bukit Hijau"
              />
            </div>
            <div>
              <Label htmlFor="type" className="mb-2">Tipe *</Label>
              <Select value={formData.type} onValueChange={(value: "vila" | "penginapan" | "camping") => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vila">Vila</SelectItem>
                  <SelectItem value="penginapan">Penginapan</SelectItem>
                  <SelectItem value="camping">Camping</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distanceKm" className="mb-2">Jarak (km)</Label>
                <Input
                  id="distanceKm"
                  type="number"
                  step="0.1"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="priceFromIdr" className="mb-2">Harga Mulai (IDR)</Label>
                <Input
                  id="priceFromIdr"
                  type="number"
                  value={formData.priceFromIdr}
                  onChange={(e) => setFormData({ ...formData, priceFromIdr: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="facilities" className="mb-2">Fasilitas (pisahkan dengan koma)</Label>
              <Textarea
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="AC, TV, WiFi, Dapur"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="contact" className="mb-2">Kontak</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="0812-3456-7890"
              />
            </div>
            <div>
              <Label htmlFor="rules" className="mb-2">Peraturan</Label>
              <Textarea
                id="rules"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                placeholder="Check-in 14:00, Check-out 12:00"
                rows={2}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
              />
              <Label htmlFor="published">Publish akomodasi ini</Label>
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
                    facilities: formData.facilities ? formData.facilities.split(",").map(f => f.trim()).filter(Boolean) : [],
                    distanceKm: formData.distanceKm ? formData.distanceKm.toString() : null,
                  };

                  const url = editingAccommodation ? `/api/accommodations/${editingAccommodation.id}` : "/api/accommodations";
                  const method = editingAccommodation ? "PATCH" : "POST";

                  const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) throw new Error("Failed to save");

                  toast({
                    title: "Berhasil",
                    description: editingAccommodation ? "Akomodasi berhasil diupdate" : "Akomodasi berhasil ditambahkan",
                  });

                  setIsDialogOpen(false);
                  fetchAccommodations();
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
              disabled={isSaving || !formData.name}
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
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
            <AlertDialogTitle>Hapus Akomodasi?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Akomodasi akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await fetch(`/api/accommodations/${deleteId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) throw new Error("Failed to delete");

                  toast({
                    title: "Berhasil",
                    description: "Akomodasi berhasil dihapus",
                  });

                  fetchAccommodations();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menghapus akomodasi",
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
