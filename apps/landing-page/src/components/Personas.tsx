import { Store, UserCheck, Smartphone, PackageOpen } from "lucide-react";

const personas = [
  {
    icon: Store,
    title: "Pak Edi",
    role: "Agen Utama (Koordinator Warung)",
    description:
      "Pemilik toko besar yang menjadi pusat distribusi di desa. Membuka room patungan, mengkoordinasi pengiriman, dan mendapatkan komisi dari setiap transaksi yang difasilitasi.",
    benefits: [
      "Komisi koordinasi dari setiap room",
      "Volume penjualan meningkat drastis",
      "Akses prioritas ke distributor langsung",
    ],
  },
  {
    icon: UserCheck,
    title: "Ibu Siti",
    role: "Agen Mitra (Sub-Agen)",
    description:
      "Pemilik warung rumahan dengan modal terbatas. Bergabung ke room patungan yang dibuka Agen Utama untuk menikmati harga grosir tanpa minimum order besar.",
    benefits: [
      "Harga modal jauh lebih murah",
      "Aplikasi ringan & hemat kuota",
      "Pengiriman lokal cepat dan terpercaya",
    ],
  },
  {
    icon: Smartphone,
    title: "Reseller Tetangga",
    role: "Agen Ritel (Tanpa Toko Fisik)",
    description:
      "Individu di komunitas yang ingin jualan tanpa memiliki toko fisik. Cukup modal smartphone, jual langsung ke tetangga via WhatsApp dan ambil stok dari agen terdekat.",
    benefits: [
      "Modal minimal, tanpa sewa toko",
      "Jualan via WhatsApp langsung",
      "Stok bisa ambil dari agen terdekat",
    ],
  },
  {
    icon: PackageOpen,
    title: "Produsen Lokal",
    role: "Pemasok Komunitas",
    description:
      "Petani, pengrajin, atau produsen makanan lokal yang memasok hasil produksi langsung ke jaringan warung di sekitarnya — tanpa perantara dan dengan harga yang adil.",
    benefits: [
      "Akses pasar langsung ke warung",
      "Pembayaran tepat waktu dan pasti",
      "Logistik efisien skala lokal",
    ],
  },
];

export default function Personas() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
            Siapa Saja yang Terlibat?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ekosistem keagenan ini memberdayakan setiap lapisan masyarakat — dari pemilik toko besar
            hingga individu yang ingin memulai usaha.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {personas.map((persona, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600">
                <persona.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{persona.title}</h3>
              <p className="text-sm text-sobatGreen-600 font-semibold mb-4">{persona.role}</p>
              <p className="text-slate-600 mb-6 flex-grow">{persona.description}</p>
              <div className="w-full text-left bg-slate-50 p-4 rounded-xl">
                <p className="text-sm font-bold text-slate-700 mb-2">Keuntungan:</p>
                <ul className="text-sm text-slate-600 space-y-2">
                  {persona.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-sobatGreen-500 shrink-0"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
