import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../services/api.js";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../services/db.js";
import { SyncStatusBar } from "../../components/SyncStatusBar.js";
import { OnboardingProgress } from "../../components/OnboardingProgress.js";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress.js";
import type { Order } from "@sobatwarung/sdk";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  SHIPPED: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-800 text-white",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  CONFIRMED: "Dikonfirmasi",
  PAID: "Dibayar",
  SHIPPED: "Dikirim",
  DELIVERED: "Diterima",
  CANCELLED: "Dibatalkan",
};

export default function ResellerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSyncStatus, setOrderSyncStatus] = useState<Record<string, "syncing" | "synced" | "pending">>({});
  const { firstGroupBuyCompleted } = useOnboardingProgress();

  const fetchOrders = useCallback(async () => {
    try {
      const data = await getOrders();
      setOrders(data);

      for (const order of data) {
        await db.orders.put({
          id: order.id,
          items: order.items,
          totalAmount: Number(order.totalAmount),
          status: order.status,
          isDirty: false,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        });
      }
    } catch (err) {
      const cached = await db.orders.toArray();
      if (cached.length > 0) {
        setOrders(cached as unknown as Order[]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const updateOrderSyncStatus = useCallback(async () => {
    const syncItems = await db.syncQueue.toArray();
    const statusMap: Record<string, "syncing" | "synced" | "pending"> = {};

    for (const order of orders) {
      const orderSyncItem = syncItems.find(
        (s) => s.entity === "order" && s.entityId === order.id
      );
      if (orderSyncItem) {
        statusMap[order.id] = orderSyncItem.status as "syncing" | "synced" | "pending";
      } else {
        statusMap[order.id] = "synced";
      }
    }

    setOrderSyncStatus(statusMap);
  }, [orders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (orders.length > 0) {
      updateOrderSyncStatus();
    }
  }, [orders, updateOrderSyncStatus]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const activeOrders = orders.filter(
    (o) => ["DRAFT", "CONFIRMED", "PAID", "SHIPPED"].includes(o.status)
  );

  const totalSpending = orders.reduce(
    (sum, o) => sum + Number(o.totalAmount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-green-900">Dashboard Reseller</h1>
        <p className="text-sm text-gray-500">Selamat datang, {user?.name}</p>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pesanan Aktif</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{activeOrders.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Belanja</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              Rp{totalSpending.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Onboarding Progress */}
        <OnboardingProgress />

        {/* Group Buy CTA - shown when milestone incomplete */}
        {!firstGroupBuyCompleted && (
          <div className="rounded-xl bg-green-50 p-4">
            <p className="mb-2 text-sm font-medium text-green-800">Gabung Group Buy pertama Anda</p>
            <p className="mb-3 text-xs text-green-600">
              Tersedia 3 group buy aktif. Bergabung sekarang dan dapatkan harga khusus!
            </p>
            <button
              onClick={() => navigate("/group-buy")}
              className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
            >
              Lihat Group Buy
            </button>
          </div>
        )}

        {/* Order history */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Riwayat Pesanan</h2>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs text-green-700 hover:underline disabled:opacity-50"
            >
              {isRefreshing ? "Memuat..." : "Refresh"}
            </button>
          </div>

          {isLoading ? (
            <p className="mt-2 text-sm text-gray-400">Memuat...</p>
          ) : error ? (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          ) : orders.length === 0 ? (
            <p className="mt-2 text-sm text-gray-400">Belum ada pesanan</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {orders.map((order) => {
                const syncIcon =
                  orderSyncStatus[order.id] === "syncing"
                    ? "⟳"
                    : orderSyncStatus[order.id] === "pending"
                    ? "⏳"
                    : "✓";
                return (
                  <li key={order.id} className="border-b pb-3 last:border-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <span className="text-sm">{syncIcon}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {order.items.map((i) => i.name).join(", ")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-green-700">
                      Rp{Number(order.totalAmount).toLocaleString("id-ID")}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700">Aksi Cepat</h2>
          <div className="mt-3 space-y-2">
            <button className="w-full rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800">
              Jelajahi Katalog
            </button>
            <button className="w-full rounded-lg border border-green-700 px-4 py-2 text-sm text-green-700 hover:bg-green-50">
              Buat Pesanan
            </button>
          </div>
        </div>
      </main>

      <SyncStatusBar />
    </div>
  );
}
