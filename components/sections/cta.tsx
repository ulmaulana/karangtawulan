"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { ctaConfig } from "@/lib/site";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * CTA Section
 * Call-to-action section with gradient background and prominent buttons
 */

export function CTASection() {
  return (
    <Section
      spacing="xl"
      className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-sky-700 to-purple-800 dark:from-sky-900 dark:via-sky-950 dark:to-purple-950"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span className="text-sm font-medium text-white">
              Booking Sekarang & Hemat 10%
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {ctaConfig.title}
          </h2>

          <p className="text-lg md:text-xl text-sky-100 mb-10 max-w-2xl mx-auto">
            {ctaConfig.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group bg-white text-sky-700 hover:bg-sky-50 shadow-2xl hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link href={ctaConfig.primaryButton.href}>
                {ctaConfig.primaryButton.text}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-200"
              asChild
            >
              <Link href={ctaConfig.secondaryButton.href}>
                {ctaConfig.secondaryButton.text}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
    </Section>
  );
}
