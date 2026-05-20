import { Store } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-sobatGreen-800 text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Store className="w-8 h-8 text-yellow-400" />
          <span className="text-xl font-bold tracking-wide">SobatWarung</span>
        </Link>
        <div className="hidden md:flex gap-6 font-medium">
          <Link to="/#ekosistem" className="hover:text-yellow-400 transition-colors">
            Ekosistem
          </Link>
          <Link to="/#fitur" className="hover:text-yellow-400 transition-colors">
            Fitur
          </Link>
          <Link to="/cara-kerja" className="hover:text-yellow-400 transition-colors">
            Cara Kerja
          </Link>
        </div>
        <Link
          to="/bergabung"
          className="bg-yellow-400 text-sobatGreen-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors inline-block"
        >
          Bergabung
        </Link>
      </div>
    </nav>
  );
}
