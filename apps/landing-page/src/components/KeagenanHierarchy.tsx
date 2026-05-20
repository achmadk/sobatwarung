import { Store, UserCheck, Smartphone, ArrowDown, PackageOpen } from "lucide-react";

const tiers = [
  {
    level: "Pemasok & Distributor",
    icon: PackageOpen,
    items: ["Produsen Lokal", "Distributor Pusat"],
    color: "bg-orange-100 text-orange-700 border-orange-200",
    iconBg: "bg-orange-100 text-orange-600",
  },
  {
    level: "Level 1: Agen Utama",
    icon: Store,
    items: ["Warung Hub", "Inventory besar", "Komisi koordinasi"],
    color: "bg-sobatGreen-100 text-sobatGreen-700 border-sobatGreen-200",
    iconBg: "bg-sobatGreen-100 text-sobatGreen-600",
  },
  {
    level: "Level 2: Agen Mitra",
    icon: UserCheck,
    items: ["Warung kecil/rumahan", "Akses harga grosir", "Tanpa minimum order"],
    color: "bg-blue-100 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    level: "Level 3: Reseller Tetangga",
    icon: Smartphone,
    items: ["Individu tanpa toko", "Jual via WhatsApp", "Modal smartphone"],
    color: "bg-purple-100 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
];

export default function KeagenanHierarchy() {
  return (
    <section id="ekosistem" className="py-20 px-6 bg-slate-50 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-sobatGreen-900 mb-4">
            Struktur Keagenan 3-Tier
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            SobatWarung menggunakan sistem keagenan tiga tingkat yang menghubungkan pemasok, agen,
            dan reseller dalam satu ekosistem yang saling menguntungkan.
          </p>
        </div>

        <div className="flex flex-col items-center gap-0">
          {tiers.map((tier, idx) => (
            <div key={idx} className="flex flex-col items-center w-full max-w-md">
              {/* Tier Card */}
              <div
                className={`w-full p-6 rounded-2xl border-2 shadow-md ${tier.color} text-center`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${tier.iconBg}`}
                >
                  <tier.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{tier.level}</h3>
                <ul className="space-y-1">
                  {tier.items.map((item, i) => (
                    <li key={i} className="text-sm font-medium opacity-80">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow Down (except last) */}
              {idx < tiers.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <div className="w-0.5 h-8 bg-slate-300"></div>
                  <ArrowDown className="w-5 h-5 text-slate-400 -ml-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Setiap level memiliki peran, hak, dan keuntungan yang berbeda. Mulai dari mana pun Anda
            berada, selalu ada jalur untuk tumbuh ke tingkat berikutnya.
          </p>
        </div>
      </div>
    </section>
  );
}
