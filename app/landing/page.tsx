import { HeroSection } from "@/components/sections/hero";
import { FeatureGridSection } from "@/components/sections/feature-grid";
import { CTASection } from "@/components/sections/cta";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

/**
 * New Modern Landing Page
 * Premium design inspired by contemporary web patterns
 * Features: Hero, Features, CTA sections with smooth animations
 */

export const metadata: Metadata = {
  title: "Beranda | KarangTawulan",
  description:
    "Nikmati keindahan Pantai KarangTawulan dengan sunset spektakuler, aktivitas seru, dan akomodasi nyaman. Destinasi wisata pantai terbaik di Jawa Timur.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeatureGridSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
