export type Channel = "WHATSAPP" | "REFERRAL" | "ORGANIC";

export interface ChannelContent {
  title: string;
  subtitle: string;
  highlight?: string;
}

const channelContent: Record<Channel, ChannelContent> = {
  WHATSAPP: {
    title: "Mulai dengan memesan dari katalog",
    subtitle: "Proses hanya 30 detik!",
    highlight: "WhatsApp",
  },
  REFERRAL: {
    title: "Agen mengundang Anda ke SobatWarung",
    subtitle: "Bergabung dan dapatkan manfaat group buying!",
    highlight: "Referral",
  },
  ORGANIC: {
    title: "Selamat datang di SobatWarung",
    subtitle: "Aplikasi offline-first untuk warung Indonesia",
    highlight: "Gratis",
  },
};

export function getChannelContent(channel: Channel): ChannelContent {
  return channelContent?.[channel] ?? channelContent.ORGANIC;
}

export function getChannelFromUrl(): Channel {
  if (typeof window === "undefined") return "ORGANIC";

  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");

  if (from === "WHATSAPP") return "WHATSAPP";
  if (from === "REFERRAL") return "REFERRAL";
  return "ORGANIC";
}

export function getReferralCodeFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}
