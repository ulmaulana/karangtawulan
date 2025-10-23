"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package,
  Home,
  Image,
  Hotel,
  LogOut,
  Menu,
  X,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/packages", label: "Paket Wisata", icon: Package },
  { href: "/dashboard/accommodations", label: "Akomodasi", icon: Hotel },
  { href: "/dashboard/destinations", label: "Destinasi", icon: MapPin },
  { href: "/dashboard/gallery", label: "Galeri", icon: Image },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/adminpanel");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      {/* Mobile Menu Button - Integrated with sidebar */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white border-sea-ocean/20 text-sea-ocean hover:bg-sea-ocean hover:text-white shadow-md hover:shadow-xl transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 transition-transform duration-300",
          "bg-white/98",
          "backdrop-blur-xl border-r border-sea-foam/50",
          "shadow-xl",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="p-6 border-b border-sea-foam/50 bg-gradient-to-br from-sea-foam/30 to-sea-ocean/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-sea-ocean/10 flex items-center justify-center">
                <Home className="h-5 w-5 text-sea-ocean" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sea-ocean tracking-tight">Admin Panel</h1>
                <p className="text-sm text-gray-600">Karangtawulan</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-sea-ocean to-sea-teal text-white shadow-lg"
                      : "text-gray-900 hover:bg-sea-foam/30 hover:text-sea-ocean"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-sea-ocean/5 group-hover:bg-sea-ocean/10"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sea-foam/50 bg-gradient-to-br from-sea-foam/20 to-transparent">
            <Link href="/" className="block mb-3">
              <Button
                variant="outline"
                className="w-full border-sea-ocean/30 hover:bg-sea-ocean hover:text-white text-sea-ocean transition-all duration-300 rounded-full"
                size="sm"
              >
                Lihat Website
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full text-red-600 hover:text-white hover:bg-red-500 transition-all duration-300 rounded-full"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Keluar..." : "Logout"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
