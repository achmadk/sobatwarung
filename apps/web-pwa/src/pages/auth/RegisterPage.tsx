import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import {
  getChannelFromUrl,
  getReferralCodeFromUrl,
  getChannelContent,
  type Channel,
} from "../../components/ChannelDetector.js";

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [channel, setChannel] = useState<Channel>("ORGANIC");
  const [currentStep] = useState<Step>(1);

  useEffect(() => {
    const detectedChannel = getChannelFromUrl();
    const referralCode = getReferralCodeFromUrl();
    setChannel(detectedChannel);

    sessionStorage.setItem("registration_channel", detectedChannel);
    if (referralCode) {
      sessionStorage.setItem("registration_referral_code", referralCode);
    }
  }, []);

  const channelInfo = getChannelContent(channel);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const role = formData.get("role") as "RESELLER" | "AGEN_UTAMA" | "AGEN_MITRA" | "PEMASOK";
    const password = formData.get("password") as string;

    try {
      // @ts-expect-error
      await register({ name, whatsapp, password, role });
      navigate("/auth/login?registered=true");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      if (message.includes("WHATSAPP_EXISTS")) {
        setError("Nomor WhatsApp sudah terdaftar");
      } else if (message.includes("VALIDATION")) {
        setError("Pastikan nomor dimulai dengan 628");
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepLabel = (step: Step) => {
    switch (step) {
      case 1:
        return "Langkah 1 dari 3: Data Diri";
      case 2:
        return "Langkah 2 dari 3: Verifikasi";
      case 3:
        return "Langkah 3 dari 3: Selesai";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        {channel !== "ORGANIC" && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-center">
            <p className="text-sm font-medium text-green-800">{channelInfo.title}</p>
            <p className="text-xs text-green-600">{channelInfo.subtitle}</p>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-center text-2xl font-bold text-green-900">Daftar SobatWarung</h1>
          <p className="mt-1 text-center text-xs text-gray-500">{getStepLabel(currentStep)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
              Nomor WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="6281234567890"
            />
            <p className="mt-1 text-xs text-gray-400">Pastikan nomor dimulai dengan 628</p>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Saya ingin mendaftar sebagai
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            >
              <option value="">Pilih peran</option>
              <option value="RESELLER">Reseller</option>
              <option value="AGEN_UTAMA">Agen Utama</option>
              <option value="AGEN_MITRA">Agen Mitra</option>
              <option value="PEMASOK">Pemasok</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
          >
            {isSubmitting ? "Memuat..." : "Daftar"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-gray-500">
          Sudah punya akun?{" "}
          <a href="/auth/login" className="text-green-700 underline">
            Masuk
          </a>
        </p>
      </div>
    </div>
  );
}
