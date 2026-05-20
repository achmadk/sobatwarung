import { Store, UserCheck, Smartphone, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";

const roles = [
  {
    icon: Store,
    title: "Daftar sebagai Agen Utama",
    description:
      "Jadi pusat distribusi dan koordinator belanja kolektif untuk warung-warung kecil di sekitar Anda. Nikmati komisi dan volume penjualan yang meningkat.",
    link: "/daftar-hub",
    btnClass: "bg-yellow-400 text-sobatGreen-900 hover:bg-yellow-300",
  },
  {
    icon: UserCheck,
    title: "Gabung sebagai Agen Mitra",
    description:
      "Nikmati harga grosir tanpa minimum order besar dengan bergabung ke room belanja patungan yang difasilitasi Agen Utama di desa Anda.",
    link: "/daftar-member",
    btnClass: "bg-sobatGreen-600 text-white hover:bg-sobatGreen-700",
  },
  {
    icon: Smartphone,
    title: "Gabung sebagai Reseller",
    description:
      "Mulai jualan tanpa modal toko fisik. Cukup smartphone, jual ke tetangga via WhatsApp, dan ambil stok dari agen terdekat.",
    link: "/daftar-reseller",
    btnClass:
      "bg-white border-2 border-slate-200 text-slate-700 hover:border-sobatGreen-500 hover:text-sobatGreen-600",
  },
  {
    icon: PackageOpen,
    title: "Daftar sebagai Pemasok",
    description:
      "Pasok hasil pertanian atau produk lokal Anda langsung ke jaringan warung di daerah Anda tanpa perantara.",
    link: "/daftar-pemasok",
    btnClass:
      "bg-white border-2 border-slate-200 text-slate-700 hover:border-sobatGreen-500 hover:text-sobatGreen-600",
  },
];

export default function Join() {
  return (
    <div className="py-20 px-6 min-h-[70vh] flex items-center bg-slate-50">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 id="bergabung" className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
            Bergabung dengan Ekosistem Keagenan
          </h1>
          <p className="text-lg text-slate-600">
            Pilih peran Anda untuk memulai perjalanan memajukan ekonomi lokal dan mengendalikan data
            Anda sendiri.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-sobatGreen-600">
                <role.icon className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-3">{role.title}</h2>
              <p className="text-slate-600 mb-8 flex-grow">{role.description}</p>
              <Link
                to={role.link}
                className={`w-full font-bold py-3 rounded-xl transition-colors ${role.btnClass}`}
              >
                Pilih Peran
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
