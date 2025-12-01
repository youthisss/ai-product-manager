import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Tidak ada data gambar yang dikirim." },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Berperanlah sebagai Senior Product Manager dan Copywriter E-Commerce profesional.
      Analisis gambar produk yang saya kirimkan ini secara mendalam.
      Tugasmu adalah menghasilkan data produk lengkap dalam Bahasa Indonesia yang menarik untuk dijual.
      Output WAJIB berupa JSON dengan struktur persis sebagai berikut:
      {
        "nama_produk": "Buat nama produk yang menarik, modern, dan SEO friendly (Maksimal 10 kata)",
        "harga_estimasi": 100000, 
        "kategori": "Pilih kategori yang paling spesifik (contoh: Fashion Pria, Gadget, Kuliner)",
        "deskripsi": "Tulis 2 paragraf deskripsi penjualan yang persuasif, menonjolkan manfaat produk, gaya bahasa santai tapi sopan.",
        "fitur_kunci": ["Sebutkan keunggulan 1", "Sebutkan keunggulan 2", "Sebutkan keunggulan 3"],
        "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4"]
      }

      Catatan:
      - Field 'harga_estimasi' harus berupa angka (number), estimasikan harga pasar di Indonesia dalam Rupiah. - Jangan tambahkan teks markdown seperti \`\`\`json di awal/akhir, cukup raw JSON saja.
    `;

    const base64Data = image.includes("base64,")
      ? image.split("base64,")[1] 
      : image;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = result.response.text();
    const jsonResponse = JSON.parse(responseText);

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("Terjadi kesalahan saat generate AI:", error);
    return NextResponse.json(
      { error: "Gagal memproses gambar. Pastikan API Key benar atau coba gambar lain." },
      { status: 500 }
    );
  }
}