"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  Hotel, 
  ShoppingBag, 
  Image, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Eye,
  EyeOff
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardStats {
  packages: { total: number; published: number };
  accommodations: { total: number; published: number };
  accessories: { total: number; published: number };
  gallery: { total: number; published: number };
  leads: { total: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, use placeholder data
    setTimeout(() => {
      setStats({
        packages: { total: 3, published: 2 },
        accommodations: { total: 5, published: 3 },
        accessories: { total: 8, published: 6 },
        gallery: { total: 24, published: 20 },
        leads: { total: 12 },
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const quickLinks = [
    {
      title: "Paket Wisata",
      description: "Kelola paket wisata dan harga",
      icon: Package,
      href: "/dashboard/packages",
      color: "from-sea-ocean to-sea-teal",
      stats: stats?.packages,
    },
    {
      title: "Akomodasi",
      description: "Vila, penginapan, dan camping",
      icon: Hotel,
      href: "/dashboard/accommodations",
      color: "from-emerald-500 to-teal-500",
      stats: stats?.accommodations,
    },
    {
      title: "Aksesori",
      description: "Aksesori yang bisa disewa",
      icon: ShoppingBag,
      href: "/dashboard/accessories",
      color: "from-purple-500 to-pink-500",
      stats: stats?.accessories,
    },
    {
      title: "Galeri",
      description: "Foto dan media gallery",
      icon: Image,
      href: "/dashboard/gallery",
      color: "from-orange-500 to-red-500",
      stats: stats?.gallery,
    },
    {
      title: "Formulir Masuk",
      description: "Data pengunjung dari website",
      icon: MessageSquare,
      href: "/dashboard/leads",
      color: "from-blue-500 to-cyan-500",
      stats: stats?.leads,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Kelola konten dan data Karangtawulan
        </p>
      </div>

      {/* Quick Stats Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600">Menu</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Total</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Tayang</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Draft</th>
              <th className="px-3 py-2 text-center font-medium text-gray-600">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {quickLinks.map((link) => {
              const Icon = link.icon;
              
              return (
                <tr key={link.href} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{link.title}</div>
                        <div className="text-xs text-gray-500">{link.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center font-bold">
                    {link.stats?.total || '-'}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-green-600">
                    {link.stats && 'published' in link.stats 
                      ? (link.stats as { total: number; published: number }).published 
                      : '-'}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-gray-600">
                    {link.stats && 'published' in link.stats 
                      ? (link.stats.total - (link.stats as { total: number; published: number }).published)
                      : '-'}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Link href={link.href}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-xs hover:bg-sea-ocean hover:text-white transition-colors"
                      >
                        Kelola →
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Quick Tips */}
      <Card className="border-sea-foam/50 bg-gradient-to-br from-sea-foam/10 to-transparent">
        <CardHeader className="px-4 pt-4 pb-3 sm:px-6 sm:pt-6 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-sea-ocean/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-sea-ocean" />
            </div>
            <div>
              <CardTitle className="text-sm sm:text-base md:text-lg">Tips</CardTitle>
              <CardDescription className="text-[10px] sm:text-xs md:text-sm leading-tight">
                Pastikan konten sudah diposting agar muncul di website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Gunakan <Eye className="inline h-3 w-3 text-green-600" /> untuk melihat konten yang sudah tayang</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Klik &quot;Kelola&quot; pada setiap kartu untuk mengelola konten</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Periksa Formulir Masuk secara berkala untuk data pengunjung baru</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
