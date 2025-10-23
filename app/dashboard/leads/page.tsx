"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { MessageSquare, Eye, Trash2, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Lead {
  id: string;
  kind: "booking" | "akomodasi" | "aksesori" | "kontak";
  payload: Record<string, unknown>;
  createdAt: string;
  ip?: string;
}

const kindLabels = {
  booking: "Booking Paket",
  akomodasi: "Akomodasi",
  aksesori: "Aksesori",
  kontak: "Kontak"
};

const kindColors = {
  booking: "bg-blue-100 text-blue-700",
  akomodasi: "bg-green-100 text-green-700",
  aksesori: "bg-purple-100 text-purple-700",
  kontak: "bg-orange-100 text-orange-700"
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [viewingLead, setViewingLead] = useState<Lead | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const filteredLeads = filter === "all" ? leads : leads.filter(lead => lead.kind === filter);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Form Submissions</h1>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">Leads dari pengunjung website</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sea-ocean"
          >
            <option value="all">Semua</option>
            <option value="booking">Booking</option>
            <option value="akomodasi">Akomodasi</option>
            <option value="aksesori">Aksesori</option>
            <option value="kontak">Kontak</option>
          </select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {Object.entries(kindLabels).map(([kind, label]) => (
                <th key={kind} className="px-3 py-2 text-left font-medium text-gray-600">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.keys(kindLabels).map((kind) => (
                <td key={kind} className="px-3 py-2 font-bold">
                  {leads.filter(l => l.kind === kind).length}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <Card>
        <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Recent Leads</CardTitle>
          <CardDescription className="text-xs sm:text-sm">{filteredLeads.length} submissions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Waktu</TableHead>
                  <TableHead className="min-w-[100px]">Tipe</TableHead>
                  <TableHead className="min-w-[150px]">Detail</TableHead>
                  <TableHead className="text-right min-w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm text-gray-600">
                    {formatDate(lead.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge className={kindColors[lead.kind]}>
                      {kindLabels[lead.kind]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{lead.payload.name as string}</div>
                      <div className="text-gray-500">{lead.payload.email as string}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setViewingLead(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteId(lead.id)}
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

      {/* View Lead Detail Dialog */}
      <Dialog open={!!viewingLead} onOpenChange={() => setViewingLead(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Form Submission</DialogTitle>
            <DialogDescription>
              {viewingLead && (
                <span>
                  Tipe: <span className="font-semibold">{kindLabels[viewingLead.kind]}</span> | 
                  Diterima: {formatDate(viewingLead.createdAt)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {viewingLead && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Informasi Data</h3>
                <div className="space-y-2">
                  {Object.entries(viewingLead.payload).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4">
                      <div className="text-sm font-medium text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="col-span-2 text-sm text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {viewingLead.ip && (
                <div className="text-xs text-gray-500">
                  IP Address: {viewingLead.ip}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lead?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini tidak bisa dibatalkan. Lead akan dihapus permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  const response = await fetch(`/api/leads/${deleteId}`, {
                    method: "DELETE",
                  });

                  if (!response.ok) throw new Error("Failed to delete");

                  toast({
                    title: "Berhasil",
                    description: "Lead berhasil dihapus",
                  });

                  fetchLeads();
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Gagal menghapus lead",
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
