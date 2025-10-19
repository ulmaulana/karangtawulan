"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { ArrowRight, MapPin, Star, Users } from "lucide-react";

/**
 * Hero Section
 * Premium hero with gradient background, CTAs, and trust indicators
 * Features smooth animations and responsive layout
 */

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-sky-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-400/20 dark:bg-sky-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-400/20 dark:bg-orange-600/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-1.5 text-sm font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-sky-200 dark:border-sky-900"
            >
              <Star className="mr-1.5 h-3.5 w-3.5 fill-sky-500 text-sky-500" />
              Destinasi Wisata Terbaik Jawa Timur
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-sky-700 to-purple-900 dark:from-white dark:via-sky-300 dark:to-purple-300 bg-clip-text text-transparent leading-tight"
          >
            Pesona Pantai
            <br />
            <span className="text-sky-600 dark:text-sky-400">
              KarangTawulan
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Nikmati keindahan sunset spektakuler, aktivitas seru, dan
            pengalaman tak terlupakan di pantai tersembunyi Jawa Timur.
            Sempurna untuk keluarga dan petualangan.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              className="group bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white shadow-lg shadow-sky-500/30 dark:shadow-sky-900/50 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/paket">
                Lihat Paket Wisata
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href="/galeri">Lihat Galeri</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap gap-8 justify-center items-center text-sm text-slate-600 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span>Jawa Timur, Indonesia</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <span>5,000+ Pengunjung</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>4.9/5 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-slate-400 dark:border-slate-600 flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 bg-slate-600 dark:bg-slate-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
