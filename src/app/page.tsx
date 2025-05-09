import Image from "next/image";
import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="">
      <Navbar />

      <div className="flex justify-space-between items-center px-16 min-h-screen">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Layanan Jasa Titip Print Mudah dan Cepat!
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Kami menyediakan jasa titip print berkualitas untuk mahasiswa. Cukup
            unggah dokumen Anda, kami yang akan mencetak dan mengantarkannya
            untuk Anda.
          </p>
          <div className="flex gap-4">
            <button className="bg-blue-950 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900">
              <a href="/print">Coba Sekarang</a>
            </button>
            {/* <button className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold">
              Telusuri Semua Alat PDF
            </button> */}
          </div>
        </div>

        <div className="w-1/2 flex justify-center">
          <Image src="/hero.svg" alt="" width={450} height={450} />
        </div>
      </div>
    </div>
  );
}
