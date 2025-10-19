import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-sea-deep via-[#0D1829] to-sea-deep text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5 tracking-tight">
              Pantai Karangtawulan
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Nikmati keindahan sunset dan sunrise di Pantai Karangtawulan,
              Tasikmalaya. Destinasi wisata alam yang menakjubkan dengan
              berbagai paket wisata yang terjangkau.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-sea-turquoise transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="hover:text-sea-coral transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5 tracking-tight">Link Cepat</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/paket" className="hover:text-sea-teal transition-colors">
                  Paket Wisata
                </Link>
              </li>
              <li>
                <Link href="/akomodasi" className="hover:text-sea-teal transition-colors">
                  Akomodasi
                </Link>
              </li>
              <li>
                <Link href="/jelajah" className="hover:text-sea-teal transition-colors">
                  Jelajah
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-sea-teal transition-colors">
                  Galeri
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-sea-teal transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5 tracking-tight">Kontak</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-sea-teal" />
                <span>Pantai Karangtawulan, Tasikmalaya, Jawa Barat</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-sea-teal" />
                <a
                  href="https://wa.me/6282218738881"
                  className="hover:text-sea-teal transition-colors"
                >
                  WhatsApp Admin
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-sea-teal" />
                <a
                  href="mailto:info@karangtawulan.com"
                  className="hover:text-sea-teal transition-colors"
                >
                  info@karangtawulan.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sea-ocean/30 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Pantai Karangtawulan. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
