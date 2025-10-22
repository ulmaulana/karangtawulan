import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";

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
                href="https://instagram.com/karangtawulanofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://tiktok.com/@karangtawulanofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sea-teal transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@pantaikarangtawulanofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
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
                <Link href="/destinasi" className="hover:text-sea-teal transition-colors">
                  Destinasi
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sea-teal transition-colors"
                >
                  +62 822-1873-8881
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-sea-teal" />
                <a
                  href="mailto:karangtawulan260@gmail.com"
                  className="hover:text-sea-teal transition-colors"
                >
                  karangtawulan260@gmail.com
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
