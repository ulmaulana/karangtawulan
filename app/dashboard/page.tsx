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
      title: "Form Submissions",
      description: "Leads dari pengunjung website",
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Kelola konten dan data Karangtawulan
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          
          return (
            <Card 
              key={link.href}
              className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden relative"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {link.stats && (
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">
                        {link.stats.total}
                      </div>
                      {'published' in link.stats && link.stats.published !== undefined && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <Eye className="h-3 w-3 text-green-600" />
                          <span className="text-green-600 font-medium">{link.stats.published as number}</span>
                          <EyeOff className="h-3 w-3 text-gray-400 ml-1" />
                          <span className="text-gray-500">{link.stats.total - (link.stats.published as number)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <CardTitle className="text-xl mt-4">{link.title}</CardTitle>
                <CardDescription className="text-sm">
                  {link.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative">
                <Link href={link.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-white/80 transition-colors"
                  >
                    <span>Kelola</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Tips */}
      <Card className="border-sea-foam/50 bg-gradient-to-br from-sea-foam/10 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sea-ocean/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-sea-ocean" />
            </div>
            <div>
              <CardTitle className="text-lg">Tips</CardTitle>
              <CardDescription>
                Pastikan konten sudah dipublish agar muncul di website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Gunakan <Eye className="inline h-3 w-3 text-green-600" /> untuk melihat konten yang sudah published</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Klik "Kelola" pada setiap kartu untuk mengelola konten</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sea-ocean mt-2"></div>
              <span>Check Form Submissions secara berkala untuk leads baru</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
