import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/whatsapp";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "X-Title": "Karangtawulan Assistant",
  },
});

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

    // Fetch destinations
    const { data: destinations } = await supabase
      .from("destinations")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    // Fetch gallery (for activity info)
    const { data: gallery } = await supabase
      .from("gallery")
      .select("*")
      .eq("published", true)
      .limit(10);

    return { packages, accommodations, accessories, destinations, gallery };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { packages: [], accommodations: [], accessories: [], destinations: [], gallery: [] };
  }
}

// Generate dynamic system prompt with real data
async function generateSystemPrompt() {
  const { packages, accommodations, accessories, destinations, gallery } = await getLatestData();

  console.log("🎫 Packages count:", packages?.length || 0);
  console.log("🏕️ Accommodations count:", accommodations?.length || 0);
  console.log("🎒 Accessories count:", accessories?.length || 0);
  console.log("🗺️ Destinations count:", destinations?.length || 0);

  // Format packages
  const packagesInfo = packages && packages.length > 0
    ? packages.map((pkg) => {
        const facilities = Array.isArray(pkg.facilities) ? pkg.facilities.join(", ") : "";
        return `- ${pkg.nama}: ${formatRupiah(pkg.harga)} (${pkg.pax_min}-${pkg.pax_max} orang, ${pkg.durasi_jam} jam)\n  Fasilitas: ${facilities}`;
      }).join("\n")
    : "Belum ada paket yang tersedia";

  // Format accommodations
  console.log("📋 Accommodations data:", JSON.stringify(accommodations, null, 2));
  
  const accommodationsInfo = accommodations && accommodations.length > 0
    ? accommodations.map((acc) => {
        // Handle different price field names
        const price = acc.price_from_idr || acc.priceFromIdr || acc.price || 0;
        let info = `- ${acc.name} (${acc.type}): ${formatRupiah(price)}`;
        
        // Add per night/per person context
        if (acc.type === 'camping') {
          info += '/orang';
        } else {
          info += '/malam';
        }
        
        if (acc.distance_km) info += `, jarak ${acc.distance_km} km dari pantai`;
        if (acc.facilities && Array.isArray(acc.facilities) && acc.facilities.length > 0) {
          info += `. Fasilitas: ${acc.facilities.join(", ")}`;
        }
        return info;
      }).join("\n")
    : "Belum ada akomodasi yang tersedia. Hubungi admin untuk info penginapan.";

  // Format accessories
  const accessoriesInfo = accessories && accessories.length > 0
    ? accessories.map((acc) => 
        `- ${acc.name}: ${formatRupiah(acc.price_idr)}${acc.stock ? ` (Stok: ${acc.stock})` : ""}`
      ).join("\n")
    : "Belum ada aksesori yang tersedia";

  // Format destinations
  const destinationsInfo = destinations && destinations.length > 0
    ? destinations.map((dest) => {
        let info = `- ${dest.name}: ${dest.description}`;
        if (dest.distance_from_karangtawulan || dest.travel_time) {
          const details = [];
          if (dest.distance_from_karangtawulan) details.push(`jarak ${dest.distance_from_karangtawulan}`);
          if (dest.travel_time) details.push(`${dest.travel_time}`);
          info += ` (${details.join(", ")})`;
        }
        if (dest.highlights && Array.isArray(dest.highlights) && dest.highlights.length > 0) {
          info += `. Aktivitas: ${dest.highlights.join(", ")}`;
        }
        return info;
      }).join("\n")
    : "Belum ada destinasi yang tersedia";

  // Format gallery/activities
  const activitiesInfo = gallery && gallery.length > 0
    ? [...new Set(gallery.map(g => g.category))].join(", ")
    : "sunset, sunrise, aktivitas pantai";

  return `Kamu adalah Asisten Karangtawulan yang membantu pengunjung. Jawab dengan ramah dalam Bahasa Indonesia.

⚠️ ATURAN WAJIB - BACA INI DULU:
1. HANYA gunakan informasi dari data di bawah ini
2. JANGAN gunakan pengetahuan umum atau informasi dari internet
3. JANGAN mengarang atau membuat informasi baru
4. Jika ditanya sesuatu yang tidak ada di data, katakan: "Untuk informasi ini, silakan hubungi admin di 6282218738881"
5. Semua harga, fasilitas, dan detail HARUS sesuai 100% dengan data yang diberikan
6. JANGAN menyebutkan tempat/hotel/destinasi yang tidak ada di daftar
7. Jika data kosong (misal: "Belum ada akomodasi"), katakan dengan jujur

=== KONTAK & INFO PENTING ===
- WhatsApp Admin: 6282218738881
- Instagram: @pantai_karang_tawulan | TikTok: @karangtawulanofficial | YouTube: PantaiKarangTawulanOfficial
- Lokasi: Pantai Karangtawulan, Tasikmalaya, Jawa Barat
- Jam Operasional: 06:00-18:00 WIB
- Tiket Masuk: Motor Rp 15.000 | Mobil Rp 30.000
- DP Booking: 50% dari total harga paket

=== DATA PAKET & LAYANAN ===

PAKET WISATA:
${packagesInfo}

AKOMODASI:
${accommodationsInfo}

DESTINASI WISATA:
${destinationsInfo}

AKSESORI:
${accessoriesInfo}

AKTIVITAS:
${activitiesInfo}

=== PANDUAN JAWABAN ===

**Rekomendasi Paket**: 
FORMAT WAJIB:
- **Nama Paket** (harga, pax, durasi): Fasilitas ditulis dalam 1 paragraf, dipisah koma. Cocok untuk siapa.

CONTOH YANG BENAR:
- **Paket 100K** (Rp 100.000, 1-10 orang, 3 jam): Tiket masuk, guide lokal, spot foto terbaik, dokumentasi HP. Cocok untuk solo traveler atau grup kecil.

JANGAN seperti ini (SALAH):
- Paket 100K
  - Tiket masuk
  - Guide lokal
  (Ini format yang SALAH, jangan dipakai!)

Akhiri dengan: "Untuk booking, hubungi admin di **6282218738881**. DP 50%!"

**Kontak Admin**: Admin bisa dihubungi di **6282218738881**, jam operasional 06:00-18:00 WIB. Siapkan info: tanggal kunjungan, jumlah peserta, paket yang diminati.

**Sosial Media**: Instagram @pantai_karang_tawulan, TikTok @karangtawulanofficial, YouTube PantaiKarangTawulanOfficial. Ajak follow dan tag saat berkunjung.

**Harga Tiket**: Motor Rp 15.000, Mobil Rp 30.000 (tiket masuk, bukan parkir). Dapat akses pantai seharian, spot foto, toilet, mushola.

**Akomodasi**: 
- WAJIB sebutkan SEMUA akomodasi yang ada di daftar AKOMODASI di atas (vila, penginapan, camping)
- Format: Nama (tipe): harga/satuan, jarak, fasilitas dalam 1 paragraf
- Camping termasuk akomodasi! Jangan skip!
- Contoh jawaban yang benar:
  "Ada beberapa pilihan akomodasi:
  - Camping Ground Karangtawulan (camping): Rp 30.000/orang. Fasilitas: tenda, matras, toilet bersih.
  - Vila Pantai (vila): Rp 500.000/malam, jarak 2 km dari pantai. Fasilitas: AC, WiFi, dapur."
- Jika daftar kosong, katakan "Belum ada data akomodasi di sistem. Hubungi admin di 6282218738881 untuk info penginapan."

**Destinasi**: Sebutkan HANYA destinasi dari daftar di atas. Jika daftar kosong, katakan "Belum ada data destinasi. Hubungi admin untuk rekomendasi."

**Pertanyaan di Luar Data**: Jika ditanya hal yang tidak ada di data (misal: cuaca, kondisi jalan, dll), arahkan ke admin: "Untuk info terkini, hubungi admin di 6282218738881"

=== ATURAN FORMAT ===
- Gunakan bullet points (-) HANYA untuk setiap item utama (paket, akomodasi, destinasi)
- JANGAN buat nested bullet points atau sub-items
- Fasilitas/detail ditulis dalam 1 paragraf, dipisah koma
- Format bold: **text**
- Nomor WA plain text: 6282218738881 (JANGAN pakai format [text](url))
- Fokus pada value dan manfaat
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

    // Build messages array with context
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: `${systemPrompt}

PENTING: Kamu adalah database assistant. Jawab HANYA dari data yang diberikan di atas. 
JANGAN tambahkan informasi dari pengetahuan umummu. 
Jika tidak tahu, arahkan ke admin: 6282218738881`,
      },
    ];

    // Add conversation context if exists
    if (context && Array.isArray(context)) {
      for (const msg of context) {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          });
        }
      }
    }

    // Add current user message
    messages.push({
      role: "user",
      content: message,
    });

    console.log("Sending request to OpenRouter DeepSeek...");

    // Call OpenRouter API with DeepSeek v3.1 free
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: messages,
      temperature: 0.3, // Lower temperature = more factual, less creative/hallucination
      max_tokens: 1500,
      top_p: 0.9, // Focus on most likely tokens
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from AI");
    }

    console.log("✓ Success with DeepSeek v3.1");

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    
    // Extract detailed error info
    let errorMessage = "Unknown error";
    let errorDetails = "";
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || "";
      
      // Check for specific Gemini API errors
      if (errorMessage.includes("overloaded")) {
        errorMessage = "Model sedang sibuk, coba lagi dalam beberapa detik";
      } else if (errorMessage.includes("API key")) {
        errorMessage = "API key tidak valid";
      } else if (errorMessage.includes("model")) {
        errorMessage = "Model tidak tersedia, menggunakan fallback";
      }
    }
    
    console.error("Error details:", errorMessage);
    console.error("Full error:", errorDetails);
    
    return NextResponse.json(
      { error: "Failed to process chat", details: errorMessage },
      { status: 500 }
    );
  }
}
