export default function WarungIllustration() {
  return (
    <svg
      viewBox="0 0 500 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-3xl shadow-2xl relative z-10 w-full h-[400px]"
      role="img"
      aria-label="Warung lokal dengan ekosistem digital"
    >
      {/* Background - warm off-white */}
      <rect width="500" height="400" rx="16" fill="#fefce8" />

      {/* Decorative background shapes */}
      <circle cx="80" cy="60" r="120" fill="#f0fdf4" opacity="0.6" />
      <circle cx="420" cy="340" r="100" fill="#fef9c3" opacity="0.4" />

      {/* ===== WARUNG SHELVES ===== */}

      {/* Shelf frame */}
      <rect x="60" y="60" width="250" height="220" rx="8" fill="#8B5E3C" opacity="0.15" />
      <rect x="66" y="66" width="238" height="208" rx="6" fill="#8B5E3C" opacity="0.08" />

      {/* Shelf dividers */}
      <rect x="60" y="130" width="250" height="6" rx="3" fill="#8B5E3C" opacity="0.2" />
      <rect x="60" y="200" width="250" height="6" rx="3" fill="#8B5E3C" opacity="0.2" />

      {/* Top shelf items */}
      <rect x="80" y="78" width="40" height="46" rx="4" fill="#22c55e" opacity="0.7" />
      <rect x="130" y="78" width="30" height="46" rx="4" fill="#16a34a" opacity="0.6" />
      <rect x="170" y="82" width="35" height="42" rx="4" fill="#15803d" opacity="0.7" />
      <rect x="215" y="78" width="28" height="46" rx="4" fill="#22c55e" opacity="0.5" />
      <rect x="252" y="84" width="32" height="40" rx="4" fill="#16a34a" opacity="0.6" />

      {/* Middle shelf items */}
      <rect x="76" y="148" width="50" height="40" rx="4" fill="#eab308" opacity="0.6" />
      <rect x="138" y="150" width="44" height="38" rx="4" fill="#ca8a04" opacity="0.5" />
      <rect x="194" y="148" width="38" height="40" rx="4" fill="#eab308" opacity="0.7" />
      <rect x="244" y="152" width="42" height="36" rx="4" fill="#ca8a04" opacity="0.5" />

      {/* Bottom shelf items */}
      <rect x="80" y="218" width="55" height="44" rx="4" fill="#f59e0b" opacity="0.55" />
      <rect x="148" y="220" width="48" height="42" rx="4" fill="#d97706" opacity="0.5" />
      <rect x="210" y="218" width="52" height="44" rx="4" fill="#f59e0b" opacity="0.6" />
      <rect x="270" y="222" width="28" height="40" rx="4" fill="#d97706" opacity="0.45" />

      {/* ===== COUNTER ===== */}
      <rect x="50" y="290" width="270" height="16" rx="6" fill="#8B5E3C" opacity="0.25" />
      <rect x="55" y="306" width="260" height="8" rx="4" fill="#8B5E3C" opacity="0.15" />

      {/* Items on counter */}
      <rect x="74" y="278" width="20" height="12" rx="3" fill="#22c55e" opacity="0.7" />
      <circle cx="120" cy="284" r="8" fill="#eab308" opacity="0.6" />
      <rect x="144" y="276" width="16" height="14" rx="2" fill="#ec4899" opacity="0.4" />

      {/* ===== DIGITAL / APP ELEMENTS ===== */}

      {/* Phone device */}
      <rect x="380" y="80" width="70" height="130" rx="12" fill="#14532d" />
      <rect x="388" y="88" width="54" height="114" rx="8" fill="#f0fdf4" />

      {/* Phone screen content */}
      <rect x="396" y="96" width="38" height="6" rx="3" fill="#22c55e" />
      <rect x="396" y="108" width="38" height="16" rx="4" fill="#dcfce7" />
      <rect x="396" y="130" width="38" height="16" rx="4" fill="#dcfce7" />
      <rect x="396" y="152" width="38" height="16" rx="4" fill="#dcfce7" />
      {/* Phone home button */}
      <circle cx="415" cy="190" r="5" fill="#16a34a" opacity="0.5" />

      {/* ===== AGENCY CONNECTION LINES ===== */}

      {/* Lines from counter to phone */}
      <path
        d="M320 298 C 340 298, 350 200, 380 160"
        stroke="#22c55e"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        opacity="0.5"
      />

      {/* ===== 3-TIER AGENCY VISUAL ===== */}

      {/* Tier 1 - Agen Utama */}
      <rect x="84" y="334" width="100" height="36" rx="18" fill="#14532d" />
      <text x="134" y="357" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Agen Utama
      </text>

      {/* Arrow down */}
      <line x1="135" y1="370" x2="135" y2="380" stroke="#16a34a" strokeWidth="2" />
      <polygon points="135,384 131,378 139,378" fill="#16a34a" />

      {/* Tier 2 - Agen Mitra */}
      <rect x="74" y="386" width="120" height="36" rx="18" fill="#15803d" />
      <text x="134" y="409" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Agen Mitra
      </text>

      {/* Arrow right to Reseller */}
      <line x1="194" y1="404" x2="212" y2="404" stroke="#16a34a" strokeWidth="2" />
      <polygon points="216,404 210,400 210,408" fill="#16a34a" />

      {/* Tier 3 - Reseller */}
      <rect x="218" y="386" width="100" height="36" rx="18" fill="#22c55e" />
      <text x="268" y="409" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
        Reseller
      </text>

      {/* ===== DATA SOVEREIGNTY BADGE ===== */}
      <rect x="350" y="234" width="100" height="24" rx="12" fill="#22c55e" opacity="0.15" />
      <text x="400" y="250" textAnchor="middle" fill="#15803d" fontSize="9" fontWeight="bold">
        🔒 Data Milik Anda
      </text>

      {/* ===== AGENT ICONS ===== */}

      {/* Stock Agent */}
      <circle cx="346" y="276" r="10" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
      <rect x="341" y="271" width="10" height="10" rx="2" fill="#22c55e" opacity="0.7" />

      {/* Community Agent */}
      <circle cx="376" y="276" r="10" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
      <circle cx="376" cy="274" r="3" fill="#3b82f6" opacity="0.7" />
      <circle cx="376" cy="282" r="2.5" fill="#3b82f6" opacity="0.5" />

      {/* Sales Agent */}
      <circle cx="406" y="276" r="10" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />
      <polygon points="406,270 402,280 410,280" fill="#f97316" opacity="0.6" />

      {/* Privacy-Guard Agent */}
      <circle cx="436" y="276" r="10" fill="#f3e8ff" stroke="#a855f7" strokeWidth="1.5" />
      <path
        d="M434,274 L434,278 C434,280 436,282 436,282 C436,282 438,280 438,278 L438,274 Z"
        fill="#a855f7"
        opacity="0.7"
      />

      {/* ===== WIFI / OFFLINE ICON ===== */}
      <path
        d="M385 312 C 393 300, 407 300, 415 312"
        stroke="#16a34a"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M392 318 C 397 309, 403 309, 408 318"
        stroke="#16a34a"
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      <circle cx="400" cy="324" r="2.5" fill="#16a34a" opacity="0.5" />
    </svg>
  );
}
