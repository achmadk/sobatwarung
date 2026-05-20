import { Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function RegisterHub() {
  return (
    <div className="py-16 px-6 min-h-[70vh] bg-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
            Pendaftaran Hub Baru
          </h1>
          <p className="text-slate-500">Jadilah koordinator belanja komunal di wilayah Anda</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Toko/Warung Utama
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
              placeholder="Contoh: Toko Maju Jaya"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Pemilik
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
                placeholder="Nama lengkap"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
                placeholder="08xx-xxxx-xxxx"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Alamat Lengkap Lengkap
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sobatGreen-500 transition-shadow"
              rows={3}
              placeholder="Nama jalan, RT/RW, Desa, Kecamatan, Kabupaten"
            ></textarea>
          </div>

          <button
            type="button"
            className="w-full bg-sobatGreen-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-sobatGreen-700 transition-colors mt-4"
          >
            Kirim Pengajuan
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link to="#" className="text-sobatGreen-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
