import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="bg-sobatGreen-900 py-20 px-6 text-center text-white">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Bangun Ketahanan Ekonomi Desa, Pegang Kendali Data Anda
        </h2>
        <p className="text-lg md:text-xl text-sobatGreen-100 mb-10 max-w-2xl">
          Dengan SobatWarung, warung Anda bukan hanya tempat jualan — tapi pusat ekonomi lokal yang
          mandiri, tangguh, dan berdaulat atas data sendiri. Pilih peran Anda dan mulai transformasi
          sekarang.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/daftar-hub"
            className="bg-yellow-400 text-sobatGreen-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 transition-colors text-lg text-center inline-block"
          >
            Daftar sebagai Agen Utama
          </Link>
          <Link
            to="/daftar-member"
            className="bg-sobatGreen-800 border border-sobatGreen-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-sobatGreen-700 transition-colors text-lg text-center inline-block"
          >
            Gabung sebagai Agen Mitra
          </Link>
        </div>
      </div>
    </section>
  );
}
