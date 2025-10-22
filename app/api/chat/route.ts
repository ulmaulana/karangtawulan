import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fetch real-time data from database
async function getLatestData() {
  try {
    // Fetch packages
    const { data: packages } = await supabase
      .from("packages")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    // Fetch accommodations
    const { data: accommodations } = await supabase
      .from("accommodations")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    // Fetch accessories
    const { data: accessories } = await supabase
      .from("accessories")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    // Fetch gallery (for activity info)
    const { data: gallery } = await supabase
      .from("gallery")
      .select("*")
      .eq("published", true)
      .limit(10);

    return { packages, accommodations, accessories, gallery };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { packages: [], accommodations: [], accessories: [], gallery: [] };
  }
}

// Generate dynamic system prompt with real data
async function generateSystemPrompt() {
  const { packages, accommodations, accessories, gallery } = await getLatestData();

  // Format packages
  const packagesInfo = packages && packages.length > 0
    ? packages.map((pkg) => {
        const facilities = Array.isArray(pkg.facilities) ? pkg.facilities.join(", ") : "";
        return `- ${pkg.nama}: ${formatRupiah(pkg.harga)} (${pkg.pax_min}-${pkg.pax_max} orang, ${pkg.durasi_jam} jam)\n  Fasilitas: ${facilities}`;
      }).join("\n")
    : "Belum ada paket yang tersedia";

  // Format accommodations
  const accommodationsInfo = accommodations && accommodations.length > 0
    ? accommodations.map((acc) => 
        `- ${acc.name} (${acc.type}): Mulai ${formatRupiah(acc.price_from_idr)}/malam${acc.distance_km ? `, ${acc.distance_km} km dari pantai` : ""}`
      ).join("\n")
    : "Belum ada akomodasi yang tersedia";

  // Format accessories
  const accessoriesInfo = accessories && accessories.length > 0
    ? accessories.map((acc) => 
        `- ${acc.name}: ${formatRupiah(acc.price_idr)}${acc.stock ? ` (Stok: ${acc.stock})` : ""}`
      ).join("\n")
    : "Belum ada aksesori yang tersedia";

  // Format gallery/activities
  const activitiesInfo = gallery && gallery.length > 0
    ? [...new Set(gallery.map(g => g.category))].join(", ")
    : "sunset, sunrise, aktivitas pantai";

  return `Kamu adalah Asisten Karangtawulan, asisten virtual yang membantu pengunjung mendapatkan informasi tentang Pantai Karangtawulan di Tasikmalaya.

PENTING - Ketika Menjawab Pertanyaan Berikut, Gunakan Format Ini:

1. **Rekomendasi Paket**: 
   - Tampilkan 2-3 paket terbaik dengan harga dan fasilitas
   - Jelaskan perbedaan utama dan siapa yang cocok untuk masing-masing paket
   - Akhiri dengan: "Untuk booking, hubungi admin WhatsApp di 6282218738881"

2. **Kontak Admin**: 
   - Berikan nomor WhatsApp: 6282218738881
   - Jelaskan kapan waktu terbaik untuk menghubungi (jam operasional)
   - Sebutkan apa yang perlu disiapkan saat menghubungi (tanggal kunjungan, jumlah peserta)

3. **Sosial Media KarangTawulan**: 
   - Instagram: @karangtawulanofficial
   - TikTok: @karangtawulanofficial
   - YouTube: PantaiKarangTawulanOfficial
   - Ajak untuk follow dan tag saat berkunjung

4. **Harga Tiket Masuk**: 
   - PENTING: Rp 15.000 dan Rp 30.000 adalah TIKET MASUK, bukan tiket parkir
   - Motor: Rp 15.000 (tiket masuk)
   - Mobil: Rp 30.000 (tiket masuk)
   - Jelaskan fasilitas yang didapat: akses pantai seharian, spot foto, toilet, mushola
   - JANGAN sebutkan sebagai "tiket parkir"

5. **Akomodasi**: 
   - Tampilkan 2-3 pilihan akomodasi terdekat dengan harga
   - Jelaskan jarak dari pantai dan fasilitas utama
   - Rekomendasikan berdasarkan budget (ekonomis/mid-range/premium)

6. **Destinasi**: 
   - Sebutkan destinasi wisata terdekat dari Karangtawulan
   - Jelaskan jarak tempuh dan keunikan masing-masing
   - Rekomendasi untuk one-day trip atau multi-destination

Aturan Penting:
- Jawab dalam Bahasa Indonesia yang ramah, informatif, dan personal
- Maksimal 4-5 kalimat untuk pertanyaan umum, boleh lebih panjang untuk rekomendasi paket/akomodasi
- Gunakan bullet points (-) untuk list
- JANGAN gunakan format markdown untuk link (seperti [text](url))
- Selalu sebutkan nomor WhatsApp dalam format plain text: 6282218738881
- Fokus pada value dan manfaat, bukan hanya informasi kering

Informasi Kontak & Sosial Media:
- WhatsApp Admin: 6282218738881
- Instagram: @karangtawulanofficial
- TikTok: @karangtawulanofficial
- YouTube: PantaiKarangTawulanOfficial
- Jam Operasional: Setiap hari, 06:00 - 18:00 WIB

Informasi Dasar:
- Lokasi: Pantai Karangtawulan, Tasikmalaya, Jawa Barat
- Harga Tiket Masuk: Motor Rp 15.000 | Mobil Rp 30.000
- Terkenal dengan: Sunset dan sunrise yang memukau, spot foto instagramable
- DP Booking: 50% dari total harga paket
- Musim Terbaik: April - Oktober untuk cuaca optimal
- Destinasi Terdekat: Pantai Cimedang, Kampung Naga, Situ Gede, Gunung Galunggung

=== DATA TERBARU DARI DATABASE ===

PAKET WISATA TERSEDIA:
${packagesInfo}

AKOMODASI TERSEDIA:
${accommodationsInfo}

AKSESORI & RENTAL TERSEDIA:
${accessoriesInfo}

AKTIVITAS & KATEGORI FOTO:
${activitiesInfo}

=== CONTOH RESPONS YANG BAIK ===

Untuk "Rekomendasi Paket":
"Berikut 3 paket terbaik kami:

- **Paket 100K** (1-2 orang, 3 jam): Cocok untuk solo/couple yang ingin foto & dokumentasi. Sudah include jasa foto/video + editing.

- **Paket 190K** (1-5 orang, 4 jam): Paling populer! Untuk keluarga/rombongan kecil. Include guide, dokumentasi, dan snorkeling gear.

- **Paket 250K** (1-5 orang, 6 jam): Paket premium all-day. Cocok untuk yang mau explore maksimal dengan fasilitas terlengkap.

Untuk booking, hubungi admin WhatsApp di 6282218738881. DP 50% ya!"

Untuk "Kontak Admin":
"Admin Karangtawulan bisa dihubungi via WhatsApp di 6282218738881. Jam operasional 06:00-18:00 WIB setiap hari.

Saat menghubungi, siapkan info: tanggal kunjungan, jumlah peserta, dan paket yang diminati. Admin akan fast respon kok!"

Untuk "Sosial Media KarangTawulan":
"Follow sosial media kami untuk update spot foto terbaru dan promo:

- Instagram: @karangtawulanofficial
- TikTok: @karangtawulanofficial  
- YouTube: PantaiKarangTawulanOfficial

Jangan lupa tag kami pas upload foto di pantai ya!"

Untuk "Harga Tiket":
"Harga **tiket masuk** Pantai Karangtawulan:

- **Motor: Rp 15.000** (tiket masuk)
- **Mobil: Rp 30.000** (tiket masuk)

Dengan tiket masuk ini kamu udah bisa menikmati pantai seharian, akses ke spot foto keren, dan fasilitas umum seperti toilet & mushola.

*Catatan: Ini harga tiket masuk ke area pantai, bukan biaya parkir ya."

Untuk "Akomodasi":
"Ada beberapa pilihan akomodasi dekat Karangtawulan:

- **Vila Premium** (Rp 500K-1jt/malam): Jarak 2-3 km, fasilitas lengkap, view bagus
- **Penginapan Backpacker** (Rp 150K-300K/malam): Jarak 5 km, budget-friendly
- **Camping Ground** (Rp 50K-100K/malam): Di area pantai, pengalaman unik!

Mau booking akomodasi? Hubungi admin di 6282218738881 untuk rekomendasi terbaik."

Untuk "Destinasi":
"Destinasi wisata terdekat dari Karangtawulan:

- **Pantai Cimedang** (5 km, 15 menit): Pantai pasir putih dengan ombak tenang
- **Kampung Naga** (25 km, 45 menit): Desa adat tradisional Sunda yang unik
- **Situ Gede** (20 km, 30 menit): Danau alami dengan pemandangan pegunungan
- **Gunung Galunggung** (30 km, 1 jam): Trekking ke kawah dengan view spektakuler

Cocok banget buat one-day trip gabungin 2-3 destinasi!"
`;
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Generate dynamic system prompt with latest data
    const systemPrompt = await generateSystemPrompt();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: context || [],
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const fullPrompt = `${systemPrompt}\n\nPengunjung: ${message}`;
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response.text();

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat", details: (error as Error).message },
      { status: 500 }
    );
  }
}
