import pino from 'pino';
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys';
import type { WASocket } from '@whiskeysockets/baileys';
import path from 'path';
import fs from 'fs';

const logger = pino({ level: 'info' });

let sock: WASocket | null = null;
let isInitialized = false;

function getSessionDir(): string {
  return process.env.WHATSAPP_SESSION_DIR ?? './whatsapp-sessions';
}

export async function initializeWhatsApp(): Promise<void> {
  if (isInitialized) return;

  const enabled = process.env.WHATSAPP_ENABLED === 'true';
  if (!enabled) {
    logger.info('WhatsApp integration is disabled. Set WHATSAPP_ENABLED=true to enable.');
    isInitialized = true;
    return;
  }

  try {
    const sessionDir = getSessionDir();
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();

    const baileysSock = makeWASocket({
      version,
      auth: state,
      logger,
      printQRInTerminal: true,
      keepAliveIntervalMs: 30_000,
    });

    sock = baileysSock;

    baileysSock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
      if (connection === 'open') {
        logger.info('WhatsApp connection established');
      } else if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          logger.warn('WhatsApp connection closed, will reconnect');
        } else {
          logger.info('WhatsApp session logged out');
        }
      }
    });

    baileysSock.ev.on('creds.update', saveCreds);

    isInitialized = true;
    logger.info('WhatsApp Baileys client initialized');
  } catch (error) {
    logger.error({ error }, 'Failed to initialize WhatsApp client');
    throw error;
  }
}

export function getWhatsAppSocket() {
  return sock;
}

export function isWhatsAppConnected(): boolean {
  return sock !== null && isInitialized;
}

export async function sendWhatsAppMessage(
  jid: string,
  text: string
): Promise<boolean> {
  if (!sock) {
    logger.warn('WhatsApp socket not available, skipping message send');
    return false;
  }

  try {
    const phoneNumber = jid.replace(/[^0-9]/g, '');
    const targetJid = phoneNumber.endsWith('@s.whatsapp.net')
      ? jid
      : `${phoneNumber}@s.whatsapp.net`;

    await sock.sendMessage(targetJid, { text });
    logger.info({ jid: targetJid, textLength: text.length }, 'WhatsApp message sent');
    return true;
  } catch (error) {
    logger.error({ error, jid }, 'Failed to send WhatsApp message');
    return false;
  }
}

export async function disconnectWhatsApp(): Promise<void> {
  if (sock) {
    try {
      await sock.logout();
      logger.info('WhatsApp client logged out gracefully');
    } catch {
      logger.warn('WhatsApp logout encountered an error');
    }
    sock = null;
    isInitialized = false;
  }
}
