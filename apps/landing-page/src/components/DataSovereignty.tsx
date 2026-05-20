import { ShieldCheck, Server, Lock, Eye, WifiOff, CheckCircle2 } from "lucide-react";

const points = [
  {
    icon: Server,
    title: "Data di Perangkat Anda",
    description:
      "Semua data transaksi, pelanggan, dan inventaris disimpan langsung di perangkat lokal Anda — bukan di cloud publik.",
  },
  {
    icon: Lock,
    title: "Enkripsi Edge",
    description:
      "Data dienkripsi di perangkat sebelum dikirim. Bahkan saat sinkronisasi, data Anda tetap aman dan tidak bisa dibaca oleh pihak ketiga.",
  },
  {
    icon: Eye,
    title: "Transparansi Penuh",
    description:
      "Anda tahu persis data apa yang dikirim, ke mana, dan untuk apa. Tidak ada pengumpulan data diam-diam atau praktik yang tidak transparan.",
  },
  {
    icon: WifiOff,
    title: "Offline-First, Data Tetap Aman",
    description:
      "Koneksi terputus? Tidak masalah. Data Anda tetap aman di perangkat dan akan tersinkronisasi otomatis saat koneksi kembali.",
  },
];

export default function DataSovereignty() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-sobatGreen-900 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <ShieldCheck className="w-4 h-4" />
            Data Milik Anda
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Data Adalah Milik Anda, Bukan Milik Kami
          </h2>
          <p className="text-lg text-sobatGreen-100 max-w-2xl mx-auto">
            Di SobatWarung, privasi bukan sekadar fitur — ini adalah fondasi. Kami merancang sistem
            di mana Anda memegang kendali penuh atas data Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {points.map((point, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-14 h-14 bg-sobatGreen-700 rounded-xl flex items-center justify-center mb-6">
                <point.icon className="w-7 h-7 text-sobatGreen-200" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
              <p className="text-sobatGreen-100 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/10 p-8 rounded-2xl border border-white/10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
            <h4 className="font-bold text-lg text-white">Prinsip Data Kami</h4>
          </div>
          <ul className="space-y-3 text-sobatGreen-100">
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">•</span>
              <span>
                <strong className="text-white">Kepemilikan:</strong> Anda adalah pemilik tunggal
                data Anda.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">•</span>
              <span>
                <strong className="text-white">Kontrol:</strong> Anda memutuskan kapan dan bagaimana
                data dibagikan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">•</span>
              <span>
                <strong className="text-white">Keamanan:</strong> Enkripsi end-to-end melindungi
                data dalam perjalanan dan saat disimpan.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-400 mt-0.5">•</span>
              <span>
                <strong className="text-white">Transparansi:</strong> Kode sumber terbuka untuk
                diaudit oleh komunitas.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
