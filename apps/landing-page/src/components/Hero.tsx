import { Users, WifiOff, TrendingDown, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-sobatGreen-50 py-16 md:py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-sobatGreen-100 text-sobatGreen-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              Data Milik Anda
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-sobatGreen-900 leading-tight mb-6">
            SobatWarung – Ekosistem Keagenan Digital untuk Warung Anda
          </h1>
          <p className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed">
            Tekan biaya modal hingga 15% melalui <strong>belanja kolektif</strong> dan sistem{" "}
            <strong>keagenan 3-tier</strong> yang memberdayakan warung, sub-agen, dan reseller.
            Didukung <strong>4 agen cerdas</strong> untuk stok, komunitas, penjualan, dan privasi —
            semuanya <strong>offline-first</strong> dengan data tetap milik Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/daftar-hub"
              className="bg-sobatGreen-600 text-white font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-sobatGreen-700 transition-colors text-center"
            >
              Daftar sebagai Agen Utama
            </Link>
            <Link
              to="/daftar-member"
              className="bg-white text-sobatGreen-700 border-2 border-sobatGreen-600 font-bold px-8 py-3 rounded-lg shadow-sm hover:bg-sobatGreen-50 transition-colors text-center inline-block"
            >
              Gabung sebagai Agen Mitra
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-sobatGreen-600" />
              <span>Hemat 10-15% Biaya Modal</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-sobatGreen-600" />
              <span>100% Operasional Tanpa Internet</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-sobatGreen-600" />
              <span>Data Tetap Milik Anda</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
          <img src="/assets/hero.png" />
        </div>
      </div>
    </section>
  );
}
