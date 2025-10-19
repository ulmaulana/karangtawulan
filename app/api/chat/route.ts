import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Kamu adalah Asisten Karangtawulan, asisten virtual yang membantu pengunjung mendapatkan informasi tentang Pantai Karangtawulan di Tasikmalaya.

Tugasmu:
1. Berikan rekomendasi paket wisata (100K, 190K, 250K) berdasarkan kebutuhan pengunjung
2. Berikan informasi tentang tiket masuk, parkir, dan fasilitas
3. Rekomendasikan akomodasi (vila, penginapan, camping)
4. Informasi kuliner dan aksesori yang tersedia
5. Buat itinerary singkat untuk kunjungan 2-3 jam
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
- Ada 3 paket: 100K (basic, 3 jam), 190K (populer, 5 jam), 250K (premium, 6 jam)
- DP 50% untuk booking
- Lokasi dekat dengan Pantai Cimedang, Kampung Naga, dan Situ Gede
- Nomor WhatsApp Admin: 6282218738881

Contoh Respons untuk Booking:
"Untuk booking paket wisata, silakan isi form booking di halaman Paket Wisata. Atau hubungi admin langsung via WhatsApp di nomor 6282218738881. Anda perlu membayar DP 50% untuk konfirmasi booking."
`;

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const chat = model.startChat({
      history: context || [],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const fullPrompt = `${SYSTEM_PROMPT}\n\nPengunjung: ${message}`;
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
