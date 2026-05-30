export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 600 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-3xl shadow-2xl relative z-10 w-full h-auto"
      role="img"
      aria-label="SobatWarung - Ekosistem Keagenan Digital untuk Warung"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="600" y2="480" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0fdf4" />
          <stop offset="1" stopColor="#dcfce7" />
        </linearGradient>
        <linearGradient id="phoneGrad" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064e3b" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="shopBg" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef3c7" />
          <stop offset="1" stopColor="#fde68a" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
        </filter>
        <filter id="softShadow" x="-5%" y="-5%" width="110%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="600" height="480" rx="20" fill="url(#bgGrad)" />

      {/* Decorative circles */}
      <circle cx="500" cy="80" r="100" fill="#22c55e" opacity="0.08" />
      <circle cx="100" cy="420" r="80" fill="#16a34a" opacity="0.06" />

      {/* ===== WARUNG SHOP FRONT ===== */}
      <g filter="url(#shadow)">
        {/* Shop building */}
        <rect x="40" y="60" width="280" height="200" rx="12" fill="url(#shopBg)" />

        {/* Awning / Canopy */}
        <path
          d="M30 60 L180 20 L330 60"
          stroke="#16a34a"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />
        <rect x="25" y="55" width="310" height="16" rx="4" fill="#15803d" />

        {/* Shop sign */}
        <rect x="100" y="80" width="120" height="32" rx="6" fill="#16a34a" />
        <text x="160" y="101" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          SobatWarung
        </text>

        {/* Shelf system inside shop */}
        <rect x="60" y="130" width="240" height="8" rx="2" fill="#92400e" opacity="0.3" />
        <rect x="60" y="170" width="240" height="8" rx="2" fill="#92400e" opacity="0.3" />

        {/* Products on shelves - colorful boxes */}
        {/* Top shelf */}
        <rect x="70" y="100" width="36" height="28" rx="4" fill="#22c55e" />
        <rect x="70" y="100" width="36" height="28" rx="4" fill="#dcfce7" opacity="0.3" />
        <rect x="116" y="104" width="28" height="24" rx="4" fill="#eab308" />
        <rect x="154" y="100" width="32" height="28" rx="4" fill="#3b82f6" />
        <rect x="196" y="106" width="24" height="22" rx="4" fill="#f97316" />
        <rect x="230" y="100" width="30" height="28" rx="4" fill="#a855f7" />
        <rect x="270" y="104" width="20" height="24" rx="4" fill="#ec4899" />

        {/* Middle shelf */}
        <rect x="70" y="144" width="40" height="24" rx="4" fill="#22c55e" />
        <rect x="120" y="140" width="34" height="28" rx="4" fill="#eab308" />
        <rect x="164" y="146" width="28" height="22" rx="4" fill="#3b82f6" />
        <rect x="202" y="140" width="36" height="28" rx="4" fill="#f97316" />
        <rect x="248" y="144" width="24" height="24" rx="4" fill="#a855f7" />
        <rect x="282" y="148" width="18" height="20" rx="4" fill="#ec4899" />

        {/* Counter */}
        <rect x="50" y="220" width="260" height="12" rx="4" fill="#78350f" opacity="0.4" />

        {/* Items on counter */}
        <circle cx="90" cy="214" r="6" fill="#22c55e" />
        <rect x="110" y="206" width="22" height="14" rx="3" fill="#eab308" />
        <rect x="142" y="208" width="16" height="12" rx="2" fill="#3b82f6" />
      </g>

      {/* ===== DIGITAL PHONE / PWA ===== */}
      <g filter="url(#shadow)" transform="translate(380, 80)">
        {/* Phone body */}
        <rect x="0" y="0" width="100" height="200" rx="20" fill="url(#phoneGrad)" />
        <rect x="8" y="8" width="84" height="184" rx="14" fill="url(#screenGrad)" />

        {/* Camera notch */}
        <rect x="36" y="2" width="28" height="8" rx="4" fill="#064e3b" />

        {/* App header */}
        <rect x="14" y="20" width="72" height="18" rx="4" fill="#22c55e" />
        <text x="50" y="33" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          SobatWarung
        </text>

        {/* Dashboard cards */}
        <rect x="14" y="44" width="72" height="14" rx="3" fill="#dcfce7" />
        <rect x="18" y="48" width="50" height="6" rx="2" fill="#22c55e" opacity="0.6" />

        <rect x="14" y="62" width="34" height="22" rx="3" fill="#fef3c7" />
        <rect x="18" y="66" width="26" height="4" rx="2" fill="#eab308" opacity="0.5" />
        <rect x="18" y="72" width="18" height="3" rx="1.5" fill="#eab308" opacity="0.4" />

        <rect x="52" y="62" width="34" height="22" rx="3" fill="#dbeafe" />
        <rect x="56" y="66" width="26" height="4" rx="2" fill="#3b82f6" opacity="0.5" />
        <rect x="56" y="72" width="18" height="3" rx="1.5" fill="#3b82f6" opacity="0.4" />

        {/* List items */}
        <rect x="14" y="88" width="72" height="12" rx="3" fill="#f0fdf4" />
        <rect x="14" y="104" width="72" height="12" rx="3" fill="#f0fdf4" />
        <rect x="14" y="120" width="72" height="12" rx="3" fill="#f0fdf4" />
        <rect x="14" y="136" width="72" height="12" rx="3" fill="#f0fdf4" />

        {/* Bottom nav */}
        <rect x="14" y="156" width="72" height="28" rx="4" fill="#ecfdf5" />
        <circle cx="28" cy="170" r="5" fill="#22c55e" />
        <circle cx="50" cy="170" r="5" fill="#9ca3af" />
        <circle cx="72" cy="170" r="5" fill="#9ca3af" />
      </g>

      {/* ===== CONNECTION LINES (Digital Sync) ===== */}
      <g opacity="0.5">
        <path
          d="M320 160 Q 350 140, 380 160"
          stroke="#22c55e"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
        />
        <path
          d="M320 200 Q 350 220, 380 200"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Connection dots */}
        <circle cx="340" cy="145" r="3" fill="#22c55e" />
        <circle cx="340" cy="215" r="3" fill="#3b82f6" />
      </g>

      {/* ===== OFFLINE BADGE ===== */}
      <g filter="url(#softShadow)" transform="translate(360, 300)">
        <rect x="0" y="0" width="120" height="36" rx="18" fill="#fef3c7" />
        <circle cx="22" cy="18" r="10" fill="#eab308" opacity="0.8" />
        {/* WiFi-off icon */}
        <path d="M17 20 Q 19 16, 22 16 Q 25 16, 27 20" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M19 22 Q 20.5 19, 22 19 Q 23.5 19, 25 22" stroke="white" strokeWidth="1.5" fill="none" />
        <line x1="19" y1="16" x2="25" y2="20" stroke="white" strokeWidth="1.5" />
        <text x="68" y="23" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="600">
          Offline-First
        </text>
      </g>

      {/* ===== COLLECTIVE SHOPPING BADGE ===== */}
      <g filter="url(#softShadow)" transform="translate(50, 260)">
        <rect x="0" y="0" width="130" height="36" rx="18" fill="#dbeafe" />
        <circle cx="22" cy="18" r="10" fill="#3b82f6" />
        {/* Group icon */}
        <circle cx="22" cy="15" r="3" fill="white" />
        <path d="M17 22 Q 17 19, 22 19 Q 27 19, 27 22" fill="white" />
        <circle cx="28" cy="15" r="2.5" fill="white" opacity="0.7" />
        <path d="M32 21 Q 32 18.5, 34 18.5 Q 36 18.5, 36 21" fill="white" opacity="0.7" />
        <text x="82" y="23" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="600">
          Belanja Kolektif
        </text>
      </g>

      {/* ===== 3-TIER AGENCY SYSTEM ===== */}
      <g filter="url(#shadow)">
        {/* Tier 1 - Agen Utama */}
        <rect x="40" y="330" width="140" height="48" rx="24" fill="#14532d" />
        <circle cx="64" cy="354" r="12" fill="#22c55e" />
        <circle cx="64" cy="351" r="4" fill="white" />
        <path d="M59 359 Q 59 355, 64 355 Q 69 355, 69 359" fill="white" />
        <text x="120" y="359" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Agen Utama
        </text>

        {/* Connecting lines */}
        <line x1="110" y1="378" x2="110" y2="398" stroke="#16a34a" strokeWidth="3" />
        <polygon points="110,402 105,395 115,395" fill="#16a34a" />

        {/* Tier 2 - Agen Mitra */}
        <rect x="30" y="400" width="160" height="48" rx="24" fill="#15803d" />
        <circle cx="54" cy="424" r="12" fill="#4ade80" />
        <circle cx="54" cy="421" r="4" fill="white" />
        <path d="M49 429 Q 49 425, 54 425 Q 59 425, 59 429" fill="white" />
        <text x="120" y="429" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Agen Mitra
        </text>

        {/* Arrow to Reseller */}
        <line x1="190" y1="424" x2="220" y2="424" stroke="#22c55e" strokeWidth="3" />
        <polygon points="224,424 217,420 217,428" fill="#22c55e" />

        {/* Tier 3 - Reseller */}
        <rect x="226" y="400" width="140" height="48" rx="24" fill="#22c55e" />
        <circle cx="250" cy="424" r="12" fill="#86efac" />
        <circle cx="250" cy="421" r="4" fill="white" />
        <path d="M245 429 Q 245 425, 250 425 Q 255 425, 255 429" fill="white" />
        <text x="316" y="429" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          Reseller
        </text>
      </g>

      {/* ===== 4 AGENT BADGES ===== */}
      <g filter="url(#softShadow)">
        {/* Stock Agent */}
        <g transform="translate(400, 320)">
          <rect x="0" y="0" width="100" height="36" rx="18" fill="#dcfce7" />
          <rect x="10" y="10" width="16" height="16" rx="4" fill="#22c55e" />
          <text x="60" y="23" textAnchor="middle" fill="#166534" fontSize="10" fontWeight="600">
            Stok
          </text>
        </g>

        {/* Community Agent */}
        <g transform="translate(410, 370)">
          <rect x="0" y="0" width="110" height="36" rx="18" fill="#dbeafe" />
          <circle cx="22" cy="18" r="8" fill="#3b82f6" />
          <text x="66" y="23" textAnchor="middle" fill="#1e3a8a" fontSize="10" fontWeight="600">
            Komunitas
          </text>
        </g>

        {/* Sales Agent */}
        <g transform="translate(530, 320)">
          <rect x="0" y="0" width="90" height="36" rx="18" fill="#ffedd5" />
          <polygon points="18,14 14,26 22,26" fill="#f97316" />
          <text x="55" y="23" textAnchor="middle" fill="#9a3412" fontSize="10" fontWeight="600">
            Penjualan
          </text>
        </g>

        {/* Privacy Agent */}
        <g transform="translate(535, 370)">
          <rect x="0" y="0" width="90" height="36" rx="18" fill="#f3e8ff" />
          <path
            d="M18,14 L14,18 L14,22 Q 14,28, 18,30 Q 22,28, 22,22 L22,18 Z"
            fill="#a855f7"
          />
          <text x="55" y="23" textAnchor="middle" fill="#581c87" fontSize="10" fontWeight="600">
            Privasi
          </text>
        </g>
      </g>
    </svg>
  );
}
