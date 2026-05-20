import { UserCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterMember() {
  return (
    <div className="py-16 px-6 min-h-[70vh] bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sobatGreen-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sobatGreen-600">
            <UserCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Gabung Sebagai Member
          </h1>
          <p className="text-slate-500">Nikmati akses belanja kolektif dan harga distributor</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Warung Anda
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
              placeholder="Contoh: Warung Bu Siti"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nomor WhatsApp Aktif
            </label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
              placeholder="Digunakan untuk menerima notifikasi pesanan"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kode Referral Hub (Opsional)
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow bg-slate-50"
              placeholder="Masukkan kode undangan dari Hub jika ada"
            />
            <p className="text-xs text-slate-500 mt-2">
              Jika Anda diundang oleh Hub lokal, masukkan kodenya di sini.
            </p>
          </div>

          <button
            type="button"
            className="w-full bg-sobatGreen-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-sobatGreen-700 transition-colors mt-4"
          >
            Daftar Sekarang
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Butuh bantuan pendaftaran?{" "}
            <Link to="#" className="text-sobatGreen-600 font-semibold hover:underline">
              Hubungi CS
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
