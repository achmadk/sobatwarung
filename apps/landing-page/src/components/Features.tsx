import { ShoppingCart, WifiOff, MapPin, Store, Bot, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Pengadaan Kolektif",
    description:
      'Buat "Room Belanja" untuk patungan produk grosir bersama warung lain. Dapatkan harga distributor yang jauh lebih murah berkat kekuatan negosiasi kolektif.',
    tag: "P0",
  },
  {
    icon: WifiOff,
    title: "Offline-First Sync",
    description:
      "Aplikasi tetap berjalan tanpa internet. Seluruh input transaksi tersimpan di perangkat lokal dan tersinkronisasi otomatis saat sinyal tersedia — tanpa resiko kehilangan data.",
    tag: "P0",
  },
  {
    icon: Bot,
    title: "Multi-Agent Cerdas",
    description:
      "4 agen AI bekerja di latar belakang: Stock Agent mengelola stok, Community Agent mengatur negosiasi kolektif, Sales Agent membantu pemasaran mikro, dan Privacy-Guard Agent melindungi data Anda.",
    tag: "P0",
  },
  {
    icon: Store,
    title: "Etalase Tetangga (B2B2C)",
    description:
      "Setiap agen mendapatkan toko online sederhana yang terhubung ke WhatsApp. Pelanggan tetangga bisa langsung memesan dan membayar tanpa aplikasi tambahan.",
    tag: "P1",
  },
  {
    icon: MapPin,
    title: "Hyper-local Sourcing",
    description:
      "Katalog khusus untuk produk dari pemasok dan produsen lokal di radius geografis Anda. Perkuat ekonomi desa dengan memprioritaskan sumber daya lokal.",
    tag: "P1",
  },
  {
    icon: ShieldCheck,
    title: "Keamanan & Privasi Data",
    description:
      "Data transaksi dan pelanggan Anda dienkripsi dan disimpan secara lokal. Tidak ada pihak ketiga yang dapat mengakses data Anda — karena data adalah milik Anda, bukan milik kami.",
    tag: "P0",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="fitur"
            className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4 scroll-mt-24"
          >
            Fitur Unggulan Kami
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Dirancang khusus untuk menjawab tantangan operasional warung di berbagai daerah,
            memberikan efisiensi maksimal dengan teknologi tepat guna dan privasi data yang
            terjamin.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow relative"
            >
              <div className="w-14 h-14 bg-sobatGreen-100 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-7 h-7 text-sobatGreen-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
