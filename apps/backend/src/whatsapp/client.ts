let isInitialized = false;

export async function initializeWhatsApp(): Promise<null> {
  console.log('WhatsApp integration is disabled. Set WHATSAPP_ENABLED=true to enable.');
  isInitialized = true;
  return null;
}

export function getWhatsAppSocket(): null {
  return null;
}

export async function sendWhatsAppMessage(jid: string, text: string): Promise<boolean> {
  console.log(`[WhatsApp Stub] Would send to ${jid}: ${text.substring(0, 50)}...`);
  return true;
}

export async function disconnectWhatsApp(): Promise<void> {
  isInitialized = false;
}
