"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { features } from "@/lib/site";
import {
  Sunset,
  Waves,
  Home,
  Package,
  Users,
  Map,
  LucideIcon,
} from "lucide-react";

/**
 * Feature Grid Section
 * Displays key features in a responsive grid with icons
 */

const iconMap: Record<string, LucideIcon> = {
  sunset: Sunset,
  waves: Waves,
  home: Home,
  package: Package,
  users: Users,
  map: Map,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function FeatureGridSection() {
  return (
    <Section spacing="xl" className="bg-white dark:bg-slate-950">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900 dark:text-white"
        >
          Mengapa Memilih KarangTawulan?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Pengalaman wisata pantai yang lengkap dengan fasilitas terbaik dan
          pemandangan menakjubkan
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Package;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-200 dark:hover:border-sky-800 hover:shadow-xl hover:shadow-sky-500/10 dark:hover:shadow-sky-900/20 transition-all duration-300"
            >
              {/* Icon */}
              <div className="mb-5 inline-flex p-3 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/30 dark:shadow-sky-900/40 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/0 to-purple-500/0 group-hover:from-sky-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
