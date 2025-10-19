"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: "/", label: "Beranda" },
    { href: "/paket", label: "Paket" },
    { href: "/akomodasi", label: "Akomodasi" },
    { href: "/jelajah", label: "Jelajah" },
    { href: "/galeri", label: "Galeri" },
    { href: "/kontak", label: "Kontak" },
  ];

  const activeIndex = navItems.findIndex(item => 
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateIndicator = () => {
      if (navRef.current && activeIndex >= 0) {
        const activeLink = navRef.current.children[activeIndex] as HTMLElement;
        if (activeLink) {
          // Padding container adalah 0.5rem = 8px (p-2)
          const containerPadding = 8;
          setIndicatorStyle({
            left: activeLink.offsetLeft + containerPadding,
            width: activeLink.offsetWidth,
          });
        }
      }
    };

    // Update on mount and route change
    if (mounted) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(updateIndicator, 0);
    }

    // Update on window resize
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeIndex, mounted]);

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-sea-foam/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-sea-ocean tracking-tight hover:text-sea-teal transition-colors">
            Karangtawulan
          </Link>

          {/* Desktop Navigation - Animated Pill Style */}
          <div className="hidden md:flex items-center">
            <div className="relative inline-flex p-2 bg-sea-foam/30 rounded-full border border-sea-foam/60 shadow-sm">
              {/* Animated Sliding Indicator */}
              {mounted && indicatorStyle.width > 0 && (
                <div
                  className="absolute top-2 bottom-2 bg-white rounded-full shadow-lg transition-all duration-300 ease-out"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                  }}
                />
              )}
              
              {/* Nav Items */}
              <div ref={navRef} className="relative z-10 flex">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-sea-ocean scale-105"
                          : "text-gray-600 hover:text-sea-ocean hover:scale-105"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Button asChild className="bg-sea-ocean hover:bg-sea-teal transition-all duration-300">
              <Link href="/paket">Booking</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation - Animated Pill Style */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-sea-foam/50">
            <div className="flex flex-col gap-3">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 text-center transform ${
                      isActive
                        ? "bg-sea-ocean text-white shadow-lg scale-105"
                        : "bg-sea-foam/30 text-gray-700 hover:bg-sea-foam/50 hover:scale-105 border border-sea-foam/60"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="flex gap-3 pt-4 border-t border-sea-foam/50">
                <Button asChild className="flex-1 bg-gradient-to-r from-sea-ocean to-sea-teal hover:shadow-xl transition-all duration-300">
                  <Link href="/paket">Booking</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
