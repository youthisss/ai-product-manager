"use client";
/* eslint-disable */

import { useState, ChangeEvent } from "react";

interface ProductData {
  nama_produk: string;
  harga_estimasi: number;
  kategori: string;
  deskripsi: string;
  fitur_kunci: string[];
  hashtags: string[];
}

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar terlalu besar (Maks 5MB)");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!imagePreview) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal memproses gambar");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
            AI Product Manager
          </h1>
          <p className="text-lg text-gray-600">
            Upload foto produkmu, biarkan AI membuat deskripsi penjualan yang profesional dalam beberapa detik.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                1. Upload Foto Produk
              </h2>
              <label className="block w-full cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-bold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    transition-colors"
                />
              </label>
              {error && (
                <div className="mt-3 text-red-500 text-sm bg-red-50 p-2 rounded-md">
                  ⚠️ {error}
                </div>
              )}
              <div className={`mt-6 relative w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed ${imagePreview ? 'border-blue-200' : 'border-gray-200 bg-gray-50'} flex items-center justify-center`}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400 p-4">
                    <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm">Preview gambar akan muncul di sini</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleGenerate}
                disabled={!imagePreview || loading}
                className={`w-full mt-6 py-3.5 px-4 rounded-xl font-bold text-white shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                  !imagePreview || loading 
                    ? "bg-gray-300 cursor-not-allowed shadow-none" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    Generate Deskripsi
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 min-h-[500px] flex flex-col">
            <div className="p-6 grow">
              <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                2. Hasil Analisis AI
              </h2>
              {!result && !loading && (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                  <p className="text-center">Belum ada data.<br/>Silakan upload foto terlebih dahulu.</p>
                </div>
              )}
              {loading && (
                <div className="space-y-6 animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="flex gap-4">
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-32 bg-gray-200 rounded w-full"></div>
                </div>
              )}
              {result && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="pb-4 border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Produk</label>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1 leading-tight">{result.nama_produk}</h3>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                        <span className="text-xs text-green-600 font-semibold uppercase block">Estimasi Harga</span>
                        <span className="text-lg font-bold text-green-700">Rp {result.harga_estimasi.toLocaleString('id-ID')}</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                        {result.kategori}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi Penjualan</label>
                    <div className="mt-2 bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed whitespace-pre-line border border-gray-100">
                      {result.deskripsi}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Keunggulan Utama</label>
                    <ul className="mt-2 space-y-2">
                      {result.fitur_kunci.map((fitur, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                          <span className="text-green-500 font-bold">✓</span>
                          {fitur}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2">
                    <p className="text-blue-500 text-sm font-medium italic">
                        {result.hashtags.join(" ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {result && (
              <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex justify-end">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${result.nama_produk}\n\n${result.deskripsi}`);
                    alert("Deskripsi berhasil disalin!");
                  }}
                  className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                  Salin Deskripsi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}