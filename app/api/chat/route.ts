import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Kamu adalah Asisten Karangtawulan, asisten virtual yang membantu pengunjung mendapatkan informasi tentang Pantai Karangtawulan di Tasikmalaya.

Tugasmu:
1. Berikan rekomendasi paket wisata berdasarkan DATA TERBARU yang diberikan
2. Berikan informasi tentang tiket masuk, parkir, dan fasilitas
3. Rekomendasikan akomodasi berdasarkan DATA TERBARU yang diberikan
4. Informasi aksesori yang tersedia berdasarkan DATA TERBARU
5. Buat itinerary singkat untuk kunjungan
6. Bantu persiapan booking via WhatsApp

Aturan Penting:
- GUNAKAN DATA TERBARU yang diberikan dalam [CONTEXT] di bawah
- Jika data tidak ada di [CONTEXT], jangan menebak - arahkan ke admin
- Jawab dalam Bahasa Indonesia yang ramah dan informatif
- Jawab singkat dan jelas (maksimal 3-4 kalimat)
- Fokus pada "mengapa" bukan hanya "apa"
- JANGAN gunakan format markdown untuk link atau button
- Sebutkan harga dan detail SESUAI data terbaru
- Untuk booking, arahkan ke halaman Paket atau WhatsApp: 6282218738881

Informasi Dasar:
- Pantai Karangtawulan terletak di Tasikmalaya, Jawa Barat
- Terkenal dengan sunset dan sunrise yang indah
- DP 50% untuk booking
- Nomor WhatsApp Admin: 6282218738881
`;

// Fetch latest data from database for AI context
async function getLatestContext() {
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
      .eq("published", true);

    // Fetch accessories
    const { data: accessories } = await supabase
      .from("accessories")
      .select("*")
      .eq("published", true);

    // Format context for AI
    let contextText = "\n\n[CONTEXT - DATA TERBARU]\n";

    if (packages && packages.length > 0) {
      contextText += "\nPAKET WISATA TERSEDIA:\n";
      packages.forEach((pkg) => {
        contextText += `- ${pkg.nama}: Rp ${pkg.harga.toLocaleString("id-ID")} (${pkg.pax_min}-${pkg.pax_max} orang, ${pkg.durasi_jam} jam)\n`;
        contextText += `  Fasilitas: ${pkg.facilities.join(", ")}\n`;
        if (pkg.notes) contextText += `  Catatan: ${pkg.notes}\n`;
      });
    }

    if (accommodations && accommodations.length > 0) {
      contextText += "\nAKOMODASI TERSEDIA:\n";
      accommodations.forEach((acc) => {
        contextText += `- ${acc.name} (${acc.type})`;
        if (acc.price_from_idr)
          contextText += `: Mulai Rp ${acc.price_from_idr.toLocaleString("id-ID")}/malam`;
        if (acc.distance_km) contextText += ` - ${acc.distance_km} km dari pantai`;
        contextText += "\n";
      });
    }

    if (accessories && accessories.length > 0) {
      contextText += "\nAKSESORI/RENTAL TERSEDIA:\n";
      accessories.forEach((acc) => {
        contextText += `- ${acc.name}: Rp ${acc.price_idr.toLocaleString("id-ID")}`;
        if (acc.stock) contextText += ` (Stok: ${acc.stock})`;
        if (acc.short_desc) contextText += ` - ${acc.short_desc}`;
        contextText += "\n";
      });
    }

    contextText += "\n[END CONTEXT]\n";
    return contextText;
  } catch (error) {
    console.error("Error fetching context:", error);
    return "";
  }
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

    // Get latest data from database
    const latestContext = await getLatestContext();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: context || [],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const fullPrompt = `${SYSTEM_PROMPT}${latestContext}\n\nPengunjung: ${message}`;
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
