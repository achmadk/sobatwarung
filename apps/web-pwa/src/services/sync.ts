import { db } from "./db.js";
import { syncPush } from "./api";

let isSyncing = false;
const DEVICE_ID_KEY = "sobat_device_id";

function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export async function enqueueMutation(
  entity: string,
  operation: string,
  entityId: string,
  data: Record<string, unknown>,
) {
  const mutationId = crypto.randomUUID();
  await db.syncQueue.add({
    mutationId,
    entity,
    operation,
    entityId,
    data: JSON.stringify(data),
    timestamp: new Date().toISOString(),
    status: "pending",
  });
  return mutationId;
}

export async function processSyncQueue(): Promise<boolean> {
  if (isSyncing) return false;
  isSyncing = true;

  try {
    const pending = await db.syncQueue.where("status").anyOf("pending", "failed").toArray();

    if (pending.length === 0) return false;

    await db.syncQueue
      .where("mutationId")
      .anyOf(pending.map((m) => m.mutationId))
      .modify({ status: "syncing" });

    const mutations = pending.map((m) => ({
      id: m.mutationId,
      entity: m.entity,
      operation: m.operation as "create" | "update" | "delete",
      entityId: m.entityId,
      data: JSON.parse(m.data),
      timestamp: m.timestamp,
      deviceId: getDeviceId(),
    }));

    const lastSync = localStorage.getItem("sobat_last_sync") || new Date(0).toISOString();

    const result = await syncPush({
      deviceId: getDeviceId(),
      lastSyncTimestamp: lastSync,
      mutations,
      signature: "",
    });

    if (result.accepted.length > 0) {
      await db.syncQueue.where("mutationId").anyOf(result.accepted).modify({ status: "synced" });
    }

    for (const rejected of result.rejected as Array<{ mutationId: string; reason: string }>) {
      await db.syncQueue
        .where("mutationId")
        .equals(rejected.mutationId)
        .modify({ status: "failed", error: rejected.reason });
    }

    localStorage.setItem("sobat_last_sync", result.serverTimestamp);

    return true;
  } catch {
    await db.syncQueue.where("status").equals("syncing").modify({ status: "failed" });
    return false;
  } finally {
    isSyncing = false;
  }
}

export function setupAutoSync() {
  window.addEventListener("online", () => {
    processSyncQueue();
  });

  setInterval(
    () => {
      if (navigator.onLine) {
        processSyncQueue();
      }
    },
    5 * 60 * 1000,
  );

  if (navigator.onLine) {
    processSyncQueue();
  }
}
