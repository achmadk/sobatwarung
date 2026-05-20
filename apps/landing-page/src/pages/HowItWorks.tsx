import Personas from "../components/Personas";
import { ArrowRight, ShoppingCart, Truck, CheckCircle2, Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="bg-sobatGreen-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-sobatGreen-900 mb-6">
            Cara Kerja Ekosistem Keagenan
          </h1>
          <p className="text-lg text-slate-700">
            Dari belanja kolektif hingga etalase digital — pahami bagaimana SobatWarung
            menghubungkan agen, reseller, dan pemasok dalam satu ekosistem yang saling
            menguntungkan.
          </p>
        </div>
      </section>

      {/* Steps Section - Belanja Patungan */}
      <section className="py-20 px-6 max-w-5xl mx-auto overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-sobatGreen-900 mb-4">
          Alur Belanja Patungan
        </h2>
        <p className="text-lg text-slate-600 text-center max-w-2xl mx-auto mb-16">
          Sistem keagenan 3-tier memungkinkan setiap level berkolaborasi dalam pengadaan barang
          dengan harga terbaik.
        </p>

        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent space-y-12">
          {/* Step 1 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sobatGreen-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              1
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Agen Utama Membuka Room</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pak Edi (Agen Utama) melihat stok menipis dan membuka "Room Belanja Patungan" di
                aplikasi untuk target produk tertentu. Community Agent membantu menentukan harga dan
                jumlah optimal berdasarkan data historis.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sobatGreen-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              2
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sobatGreen-100 text-sobatGreen-600 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">
                  Agen Mitra & Reseller Bergabung
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ibu Siti (Agen Mitra) menerima notifikasi dan memasukkan pesanan. Reseller Tetangga
                juga bisa ikut serta dalam room tertentu. Stock Agent secara otomatis menyesuaikan
                rekomendasi berdasarkan kapasitas masing-masing.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sobatGreen-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              3
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Target Tercapai & Checkout</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Setelah total pesanan mencapai target kuota grosir, sistem mengunci harga
                distributor terendah. Agen Utama melakukan checkout langsung ke pemasok — semua
                difasilitasi oleh Community Agent.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-sobatGreen-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
              4
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Distribusi Lokal</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Barang tiba di lokasi Agen Utama. Pak Edi mendistribusikan ke Agen Mitra dan
                Reseller melalui kurir lokal atau pengambilan langsung. Stock Agent memperbarui stok
                secara real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent System Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
              Multi-Agent System: Otomatisasi di Balik Layar
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              SobatWarung didukung oleh 4 agen cerdas yang bekerja secara otomatis di perangkat
              lokal Anda. Mereka memastikan semuanya berjalan lancar — bahkan tanpa koneksi
              internet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Stock Agent</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Mendeteksi stok menipis, memprediksi restock, dan merekomendasikan jumlah pesanan
                optimal.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Community Agent</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Menginisiasi pool belanja, mengelola negosiasi grup, dan memastikan harga terbaik
                untuk semua anggota.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Sales Agent</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Membantu promosi mikro via WhatsApp, mengingatkan pelanggan tentang stok baru, dan
                membantu reseller menjangkau tetangga.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">Privacy-Guard Agent</h3>
              </div>
              <p className="text-slate-600 text-sm">
                Melindungi data transaksi dan pelanggan dengan enkripsi edge — tidak ada data yang
                dikirim tanpa izin Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Etalase Tetangga Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
              Etalase Tetangga: B2B2C Storefront
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Setiap agen dan reseller mendapatkan toko online pribadi yang terhubung ke WhatsApp —
              tanpa perlu aplikasi tambahan untuk pelanggan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-yellow-600">
                <Store className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Link Toko Pribadi</h3>
              <p className="text-slate-600">
                Setiap agen memiliki link toko unik yang bisa dibagikan ke pelanggan via WhatsApp.
                Pelanggan bisa melihat stok dan harga langsung dari link tersebut.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-14 h-14 bg-sobatGreen-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-sobatGreen-600">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Pemesanan via WhatsApp</h3>
              <p className="text-slate-600">
                Pelanggan cukup klik tombol "Pesan" dan otomatis terhubung ke WhatsApp agen. Pesanan
                tercatat, riwayat tersimpan, dan stok terupdate real-time.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-3">Pengiriman Lokal</h3>
              <p className="text-slate-600">
                Reseller bisa mengambil stok dari Agen Mitra atau Agen Utama terdekat. Sistem
                mencatat otomatis pergerakan stok antar level agen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section (Reusing Personas component) */}
      <div className="bg-slate-50 pt-1">
        <Personas />
      </div>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-sobatGreen-900 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Siap Bergabung dalam Ekosistem Keagenan?</h2>
          <p className="text-lg text-sobatGreen-100 mb-8">
            Pilih peran Anda — Agen Utama, Agen Mitra, Reseller, atau Pemasok — dan mulai
            transformasi warung Anda menuju kemandirian ekonomi dan data.
          </p>
          <Link
            to="/bergabung"
            className="bg-yellow-400 text-sobatGreen-900 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-300 transition-colors inline-block text-lg"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
