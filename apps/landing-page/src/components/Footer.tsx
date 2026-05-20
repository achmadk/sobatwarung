import { Store, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-white">
            <Store className="w-8 h-8 text-yellow-400" />
            <span className="text-xl font-bold tracking-wide">SobatWarung</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed mb-4">
            Membangun ekosistem keagenan digital untuk warung Indonesia — lebih murah, lebih
            berdaya, dan berdaulat atas data sendiri, melalui teknologi offline-first dan ekonomi
            komunal.
          </p>
          <div className="flex items-center gap-2 text-sm text-sobatGreen-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Milik Anda — Privasi adalah prioritas</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto text-center text-sm">
        <p>
          &copy; 2026 SobatWarung — Ekosistem Keagenan Digital untuk Warung Indonesia. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
