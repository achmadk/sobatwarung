import { getAccessToken } from "./auth.js";

const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL ?? "ws://localhost:3000/ws";

type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

type EventHandler = (data: unknown) => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private connectionState: ConnectionState = "disconnected";
  private handlers = new Map<string, Set<EventHandler>>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseReconnectDelay = 1000;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  get state(): ConnectionState {
    return this.connectionState;
  }

  connect(token?: string) {
    const authToken = token || getAccessToken();
    if (!authToken) return;

    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.connectionState = "connecting";
    this.emitStateChange();

    this.ws = new WebSocket(`${WS_BASE_URL}?token=${authToken}`);

    this.ws.onopen = () => {
      this.connectionState = "connected";
      this.reconnectAttempts = 0;
      this.emitStateChange();
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, ...data } = message as { type: string; [key: string]: unknown };
        const eventHandlers = this.handlers.get(type);
        if (eventHandlers) {
          eventHandlers.forEach((handler) => handler(data));
        }
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.connectionState = "disconnected";
      this.emitStateChange();
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private emitStateChange() {
    const handlers = this.handlers.get("stateChange");
    if (handlers) {
      handlers.forEach((handler) => handler(this.connectionState));
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.connectionState = "reconnecting";
    this.emitStateChange();

    const delay = Math.min(
      this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts) + Math.random() * 1000,
      300000
    );
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      const token = getAccessToken();
      if (token) {
        this.connect(token);
      }
    }, delay);
  }

  disconnect() {
    this.reconnectAttempts = this.maxReconnectAttempts;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionState = "disconnected";
    this.emitStateChange();
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  send(type: string, payload: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
}

export const wsClient = new WebSocketClient();