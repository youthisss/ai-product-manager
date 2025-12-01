# AI Product Manager

Aplikasi Next.js berbasis AI yang membantu merchant e-commerce membuat deskripsi produk profesional hanya dengan mengunggah foto.

## Fitur Utama

- **Multimodal AI Analysis**  
  Menganalisis gambar produk menggunakan Google Gemini 2.5 Flash.

- **Auto-Generate Metadata**  
  Secara otomatis menghasilkan:
  - Nama Produk  
  - Estimasi Harga  
  - Kategori  
  - Deskripsi Penjualan

- **Structured Output**  
  Menggunakan mode JSON untuk memastikan output terstruktur dan siap integrasi.

- **Copywriter Persona**  
  AI dikonfigurasi sebagai copywriter e-commerce profesional, menghasilkan teks persuasif dan relevan.

## Tech Stack

- **Framework**: Next.js 14 (App Router)  
- **Bahasa Pemrograman**: TypeScript  
- **AI Model**: Google Generative AI (Gemini 2.5 Flash)  
- **Styling**: Tailwind CSS

## Cara Menggunakan

1. Clone repository ini.
2. Buat file `.env.local` di root project, lalu tambahkan:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
3. Jalankan `npm install` lalu `npm run dev`.
4. Upload foto produk apa saja, dan lihat hasilnya
