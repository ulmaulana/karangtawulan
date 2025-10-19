/**
 * WhatsApp utility functions untuk form to WhatsApp integration
 */

const WA_ADMIN = '6282218738881';

export type BookingFormData = {
  paket: string;
  pax: number;
  tanggal: string;
  jam: string;
  opsi_tambahan?: string;
  nama: string;
  wa_pemesan: string;
};

export type AkomodasiFormData = {
  tipe: string;
  tanggal: string;
  durasi_malam: number;
  pax: number;
  budget?: string;
  nama: string;
  wa_pemesan: string;
};

export type AksesoriFormData = {
  produk: string;
  qty: number;
  ambil_di_lokasi: boolean;
  nama: string;
  wa_pemesan: string;
};

export type KontakFormData = {
  nama: string;
  wa_pemesan: string;
  pesan: string;
};

/**
 * Generate WhatsApp URL untuk booking paket
 */
export function generateBookingWhatsAppUrl(data: BookingFormData): string {
  const message = `Halo Admin Karangtawulan,
Saya mau booking:
• Paket: ${data.paket} (${data.pax} orang)
• Tanggal/Jam: ${data.tanggal}, ${data.jam}
${data.opsi_tambahan ? `• Opsi: ${data.opsi_tambahan}\n` : ''}• Nama: ${data.nama}
• Kontak: ${data.wa_pemesan}
Saya siap DP 50%.`;

  return `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL untuk tanya akomodasi
 */
export function generateAkomodasiWhatsAppUrl(data: AkomodasiFormData): string {
  const message = `Halo Admin Karangtawulan,
Saya mau tanya akomodasi:
• Tipe: ${data.tipe}
• Tanggal: ${data.tanggal}
• Durasi: ${data.durasi_malam} malam
• Jumlah tamu: ${data.pax} orang
${data.budget ? `• Budget: ${data.budget}\n` : ''}• Nama: ${data.nama}
• Kontak: ${data.wa_pemesan}`;

  return `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL untuk pesan aksesori
 */
export function generateAksesoriWhatsAppUrl(data: AksesoriFormData): string {
  const metodeAmbil = data.ambil_di_lokasi ? 'Ambil di lokasi' : 'Kirim';
  const message = `Halo Admin Karangtawulan,
Saya mau pesan aksesori:
• Produk: ${data.produk}
• Jumlah: ${data.qty}
• Metode ambil: ${metodeAmbil}
• Nama: ${data.nama}
• Kontak: ${data.wa_pemesan}`;

  return `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate WhatsApp URL untuk kontak umum
 */
export function generateKontakWhatsAppUrl(data: KontakFormData): string {
  const message = `Halo Admin Karangtawulan,
• Nama: ${data.nama}
• Kontak: ${data.wa_pemesan}
• Pesan: ${data.pesan}`;

  return `https://wa.me/${WA_ADMIN}?text=${encodeURIComponent(message)}`;
}

/**
 * Format number to Indonesian Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to Indonesian format
 */
export function formatTanggal(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
