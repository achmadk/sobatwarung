export interface AppError {
  code: string;
  message: string;
  hint?: string;
  recoverable?: boolean;
}

export const errorMappings: Record<string, AppError> = {
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    message: "Nomor WhatsApp atau kata sandi salah",
    hint: "Pastikan nomor dan kata sandi sudah benar",
    recoverable: true,
  },
  NETWORK_TIMEOUT: {
    code: "NETWORK_TIMEOUT",
    message: "Koneksi timeout",
    hint: "Pastikan koneksi internet stabil",
    recoverable: true,
  },
  OFFLINE: {
    code: "OFFLINE",
    message: "Anda sedang offline",
    hint: "Data akan disinkronkan saat koneksi kembali",
    recoverable: true,
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    message: "Data yang dimasukkan tidak valid",
    hint: "Pastikan semua field terisi dengan benar",
    recoverable: false,
  },
  WHATSAPP_FORMAT: {
    code: "WHATSAPP_FORMAT",
    message: "Format nomor WhatsApp salah",
    hint: "Pastikan nomor dimulai dengan 628",
    recoverable: false,
  },
  WHATSAPP_EXISTS: {
    code: "WHATSAPP_EXISTS",
    message: "Nomor WhatsApp sudah terdaftar",
    hint: "Coba masuk dengan akun yang sudah ada",
    recoverable: false,
  },
  NETWORK_ERROR: {
    code: "NETWORK_ERROR",
    message: "Gagal terhubung ke server",
    hint: "Pastikan koneksi internet aktif",
    recoverable: true,
  },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Server sedang mengalami masalah",
    hint: "Coba beberapa saat lagi",
    recoverable: true,
  },
};

export function parseError(error: unknown): AppError {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("WHATSAPP_EXISTS")) {
      return errorMappings.WHATSAPP_EXISTS;
    }
    if (message.includes("INVALID_CREDENTIALS")) {
      return errorMappings.INVALID_CREDENTIALS;
    }
    if (message.includes("NETWORK_TIMEOUT") || message.includes("timeout")) {
      return errorMappings.NETWORK_TIMEOUT;
    }
    if (message.includes("offline") || message.includes("Offline")) {
      return errorMappings.OFFLINE;
    }
    if (message.includes("VALIDATION") || message.includes("validation")) {
      return errorMappings.VALIDATION_ERROR;
    }
    if (message.includes("628") || message.includes("whatsapp format")) {
      return errorMappings.WHATSAPP_FORMAT;
    }
    if (message.includes("network") || message.includes("fetch")) {
      return errorMappings.NETWORK_ERROR;
    }
  }

  return {
    code: "UNKNOWN",
    message: "Terjadi kesalahan yang tidak diketahui",
    hint: "Coba lagi atau hubungi dukungan",
    recoverable: false,
  };
}
