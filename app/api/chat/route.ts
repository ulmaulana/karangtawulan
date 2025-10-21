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

Tugasmu:
1. Berikan rekomendasi paket wisata (100K, 190K, 250K) berdasarkan kebutuhan pengunjung
2. Berikan informasi tentang tiket masuk, parkir, dan fasilitas
3. Rekomendasikan akomodasi (vila, penginapan, camping)
4. Informasi kuliner dan aksesori yang tersedia
5. Buat Rencana Perjalanan singkat untuk kunjungan 2-3 jam
6. Bantu persiapan booking via WhatsApp

Aturan Penting:
- Jawab dalam Bahasa Indonesia yang ramah dan informatif
- Jawab singkat dan jelas (maksimal 3-4 kalimat)
- Fokus pada "mengapa" bukan hanya "apa"
- JANGAN gunakan format markdown untuk link atau button (seperti [text](url))
- Jika ada pertanyaan tentang booking, berikan informasi lengkap dalam text biasa
- Untuk booking, katakan: "Untuk booking, silakan kunjungi halaman Paket Wisata di website atau hubungi admin WhatsApp di 6282218738881"
- Jika tidak tahu jawaban pastinya, arahkan untuk menghubungi admin via WhatsApp
- Jangan menebak harga atau informasi yang tidak pasti

Informasi Dasar:
- Pantai Karangtawulan terletak di Tasikmalaya, Jawa Barat
- Terkenal dengan sunset dan sunrise yang indah
- DP 50% untuk booking
- Lokasi dekat dengan Pantai Cimedang, Kampung Naga, dan Situ Gede
- Nomor WhatsApp Admin: 6282218738881

=== DATA TERBARU DARI DATABASE ===

PAKET WISATA TERSEDIA:
${packagesInfo}

AKOMODASI TERSEDIA:
${accommodationsInfo}

AKSESORI & RENTAL TERSEDIA:
${accessoriesInfo}

AKTIVITAS & KATEGORI FOTO:
${activitiesInfo}

Contoh Respons untuk Booking:
"Untuk booking paket wisata, silakan isi form booking di halaman Paket Wisata. Atau hubungi admin langsung via WhatsApp di nomor 6282218738881. Anda perlu membayar DP 50% untuk konfirmasi booking."
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
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat", details: error.message },
      { status: 500 }
    );
  }
}
