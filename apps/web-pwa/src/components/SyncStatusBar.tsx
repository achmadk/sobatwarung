import { useEffect, useState } from "react";
import { db } from "../services/db";

type SyncState = "ONLINE" | "OFFLINE" | "SYNCING";

export function SyncStatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncState, setSyncState] = useState<SyncState>(navigator.onLine ? "ONLINE" : "OFFLINE");

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState("SYNCING");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState("OFFLINE");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const updatePendingCount = async () => {
      const count = await db.syncQueue
        .where("status")
        .anyOf(["pending", "syncing", "failed"])
        .count();
      setPendingCount(count);
    };

    updatePendingCount();
    const interval = setInterval(updatePendingCount, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount === 0) {
      setSyncState("ONLINE");
    } else if (isOnline && pendingCount > 0) {
      setSyncState("SYNCING");
    } else {
      setSyncState("OFFLINE");
    }
  }, [isOnline, pendingCount]);

  const getStatusText = () => {
    if (syncState === "OFFLINE") {
      return `🟡 Offline | ${pendingCount} menunggu`;
    }
    if (syncState === "SYNCING") {
      return `🔄 Menyinkronkan... | ${pendingCount} tersisa`;
    }
    return `🟢 Online | ✓ Tersinkronisasi`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-11 items-center justify-center border-t border-gray-200 bg-white px-4 md:top-0 md:bottom-auto md:h-auto md:border-t-0 md:border-b">
      <p className="text-sm text-gray-600">{getStatusText()}</p>
    </div>
  );
}
