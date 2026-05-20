import { Package, Users, Megaphone, ShieldCheck } from "lucide-react";

const agents = [
  {
    icon: Package,
    title: "Stock Agent",
    description:
      "Mengelola stok secara otomatis — mendeteksi barang menipis, memprediksi waktu restock, dan merekomendasikan jumlah pesanan optimal berdasarkan riwayat penjualan.",
    color: "bg-emerald-100 text-emerald-600",
    borderColor: "border-emerald-200",
  },
  {
    icon: Users,
    title: "Community Agent",
    description:
      "Menghubungkan permintaan antar agen. Menginisiasi pool belanja kolektif, mengelola negosiasi harga grup, dan memastikan setiap anggota mendapat harga terbaik.",
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200",
  },
  {
    icon: Megaphone,
    title: "Sales Agent",
    description:
      "Membantu pemasaran mikro-lokal — membuat draft promosi untuk WhatsApp, mengingatkan pelanggan tentang stok baru, dan membantu reseller menjangkau tetangga sekitar.",
    color: "bg-orange-100 text-orange-600",
    borderColor: "border-orange-200",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-Guard Agent",
    description:
      "Menjaga keamanan data di perangkat lokal. Semua transaksi dan data pelanggan dienkripsi di tepi (edge encryption) — tidak ada data yang dikirim ke server cloud tanpa izin Anda.",
    color: "bg-purple-100 text-purple-600",
    borderColor: "border-purple-200",
  },
];

export default function MASOverview() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
            Multi-Agent Cerdas di Balik Layar
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Empat agen AI bekerja secara otomatis untuk mengelola stok, komunitas, penjualan, dan
            privasi — sehingga Anda bisa fokus melayani pelanggan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {agents.map((agent, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border-2 ${agent.borderColor} bg-slate-50 hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${agent.color}`}
                >
                  <agent.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">{agent.title}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">{agent.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-sobatGreen-50 p-8 rounded-2xl border border-sobatGreen-100 text-center max-w-3xl mx-auto">
          <p className="text-slate-700 leading-relaxed">
            <strong>Bagaimana cara kerjanya?</strong> Keempat agen berjalan di perangkat lokal Anda
            (edge computing) dan hanya membutuhkan internet untuk sinkronisasi data penting. Ini
            berarti privasi tetap terjaga dan aplikasi tetap responsif bahkan di daerah dengan
            koneksi terbatas.
          </p>
        </div>
      </div>
    </section>
  );
}
