/**
 * Site-wide constants and configuration
 * Centralized place for brand information, navigation, and contact details
 */

export const siteConfig = {
  name: "KarangTawulan",
  title: "KarangTawulan - Pesona Pantai di Jawa Timur",
  description:
    "Nikmati keindahan Pantai KarangTawulan dengan sunset spektakuler, aktivitas seru, dan akomodasi nyaman. Destinasi wisata pantai terbaik di Jawa Timur.",
  url: "https://karangtawulan.com",
  ogImage: "/og-image.jpg",
  keywords: [
    "pantai karangtawulan",
    "wisata pantai jawa timur",
    "sunset pantai",
    "paket wisata pantai",
    "destinasi wisata",
    "beach tourism",
  ],
  author: "KarangTawulan Team",
  social: {
    instagram: "https://instagram.com/karangtawulan",
    whatsapp: "6282218738881",
    email: "karangtawulan260@gmail.com",
  },
  contact: {
    phone: "+62 812-3456-789",
    email: "karangtawulan260@gmail.com",
    address: "Pantai KarangTawulan, Jawa Timur, Indonesia",
  },
} as const;

export const navigation = [
  {
    name: "Beranda",
    href: "/",
  },
  {
    name: "Paket Wisata",
    href: "/paket",
  },
  {
    name: "Akomodasi",
    href: "/akomodasi",
  },
  {
    name: "Destinasi",
    href: "/destinasi",
  },
  {
    name: "Galeri",
    href: "/galeri",
  },
  {
    name: "Kontak",
    href: "/kontak",
  },
] as const;

export const footerLinks = {
  explore: [
    { name: "Paket Wisata", href: "/paket" },
    { name: "Akomodasi", href: "/akomodasi" },
    { name: "Destinasi Wisata", href: "/destinasi" },
    { name: "Galeri Foto", href: "/galeri" },
  ],
  company: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Blog & Artikel", href: "/blog" },
    { name: "Hubungi Kami", href: "/kontak" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Syarat & Ketentuan", href: "/terms" },
    { name: "Kebijakan Privasi", href: "/privacy" },
    { name: "Kebijakan Pembatalan", href: "/cancellation" },
  ],
} as const;

export const features = [
  {
    title: "Sunset Spektakuler",
    description:
      "Saksikan matahari terbenam yang memukau dengan pemandangan laut yang menawan. Moment sempurna untuk foto dan relaksasi.",
    icon: "sunset",
  },
  {
    title: "Aktivitas Seru",
    description:
      "Berbagai aktivitas menarik seperti banana boat, snorkeling, dan bermain di pantai yang aman untuk keluarga.",
    icon: "waves",
  },
  {
    title: "Akomodasi Nyaman",
    description:
      "Pilihan menginap dari vila eksklusif hingga camping ground yang seru. Semua dilengkapi fasilitas lengkap.",
    icon: "home",
  },
  {
    title: "Paket Wisata Fleksibel",
    description:
      "Paket wisata yang dapat disesuaikan dengan kebutuhan. Harga terjangkau dengan pelayanan terbaik.",
    icon: "package",
  },
  {
    title: "Guide Berpengalaman",
    description:
      "Dipandu oleh guide lokal yang berpengalaman dan menguasai area. Keamanan dan kenyamanan terjamin.",
    icon: "users",
  },
  {
    title: "Akses Mudah",
    description:
      "Lokasi strategis dengan akses jalan yang baik. Tersedia area parkir luas dan fasilitas umum memadai.",
    icon: "map",
  },
] as const;

export const testimonials = [
  {
    name: "Sarah Wijaya",
    role: "Traveler",
    content:
      "Pantai yang sangat indah! Sunsetnya benar-benar spektakuler. Paket wisatanya juga sangat lengkap dan worth it.",
    avatar: "/avatars/1.jpg",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Family Trip",
    content:
      "Liburan keluarga yang menyenangkan. Anak-anak sangat senang dengan aktivitas di pantai. Recommended!",
    avatar: "/avatars/2.jpg",
    rating: 5,
  },
  {
    name: "Linda Chen",
    role: "Photographer",
    content:
      "Surganya fotografer! Setiap sudut punya angle yang bagus. Sunrise dan sunset di sini luar biasa indah.",
    avatar: "/avatars/3.jpg",
    rating: 5,
  },
] as const;

export const ctaConfig = {
  title: "Siap Merasakan Pengalaman Tak Terlupakan?",
  description:
    "Booking paket wisata Anda sekarang dan nikmati keindahan Pantai KarangTawulan bersama keluarga atau teman.",
  primaryButton: {
    text: "Lihat Paket Wisata",
    href: "/paket",
  },
  secondaryButton: {
    text: "Hubungi Kami",
    href: "/kontak",
  },
} as const;
