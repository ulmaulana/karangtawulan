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
    published: false,
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Akomodasi</h1>
          <p className="text-gray-600">Vila, penginapan, dan camping</p>
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
              published: false,
            });
            setIsDialogOpen(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Akomodasi
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(typeLabels).map(([type, label]) => (
          <Card key={type}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              {type === "camping" ? <Tent className="h-4 w-4 text-gray-600" /> : <HotelIcon className="h-4 w-4 text-gray-600" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accommodations.filter(a => a.type === type).length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Akomodasi</CardTitle>
          <CardDescription>Semua tempat menginap yang tersedia</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Jarak</TableHead>
                <TableHead>Harga Mulai</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
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
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{formatRupiah(acc.priceFromIdr)}</span>
                      </div>
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
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Villa Bukit Hijau"
              />
            </div>
            <div>
              <Label htmlFor="type">Tipe *</Label>
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
                <Label htmlFor="distanceKm">Jarak (km)</Label>
                <Input
                  id="distanceKm"
                  type="number"
                  step="0.1"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="priceFromIdr">Harga Mulai (IDR)</Label>
                <Input
                  id="priceFromIdr"
                  type="number"
                  value={formData.priceFromIdr}
                  onChange={(e) => setFormData({ ...formData, priceFromIdr: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="facilities">Fasilitas (pisahkan dengan koma)</Label>
              <Textarea
                id="facilities"
                value={formData.facilities}
                onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                placeholder="AC, TV, WiFi, Dapur"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="contact">Kontak</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="0812-3456-7890"
              />
            </div>
            <div>
              <Label htmlFor="rules">Peraturan</Label>
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
