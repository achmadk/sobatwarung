import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { BuyingRoom } from "@sobatwarung/sdk";

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Terbuka", color: "bg-green-100 text-green-700" },
  LOCKED: { label: "Dikunci", color: "bg-orange-100 text-orange-700" },
  CHECKOUT: { label: "Target Tercapai", color: "bg-blue-100 text-blue-700" },
  DISTRIBUTED: { label: "Selesai", color: "bg-gray-100 text-gray-700" },
};

function isRoomExpired(room: BuyingRoom): boolean {
  return new Date(room.deadline) < new Date() && room.status === "OPEN";
}

export default function GroupBuyListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<BuyingRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat group buy");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRooms();
    setIsRefreshing(false);
  };

  const handleRoomClick = (roomId: string) => {
    navigate(`/group-buy/${roomId}`);
  };

  const handleCreateRoom = () => {
    navigate("/group-buy/create");
  };

  const isRoomFull = (room: BuyingRoom) => {
    return room.currentQuantity >= room.targetQuantity;
  };

  const isRoomJoinable = (room: BuyingRoom) => {
    if (isRoomExpired(room)) return false;
    if (room.status === "LOCKED" || room.status === "CHECKOUT" || room.status === "DISTRIBUTED") return false;
    if (isRoomFull(room)) return false;
    return true;
  };

  const isAgenUtama = user?.role === "AGEN_UTAMA";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-green-900">Group Buy</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="rounded-lg px-3 py-1.5 text-sm text-green-700 hover:bg-green-50 disabled:opacity-50"
            >
              {isRefreshing ? "..." : "↻"}
            </button>
            {isAgenUtama && (
              <button
                onClick={handleCreateRoom}
                className="rounded-lg bg-green-700 px-3 py-1.5 text-sm text-white hover:bg-green-800"
              >
                + Buat Room
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Memuat...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-4 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm text-green-700 underline"
            >
              Coba lagi
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Belum ada group buy tersedia.</p>
            <p className="mt-1 text-sm text-gray-400">Jadilah yang pertama membuat!</p>
            {isAgenUtama && (
              <button
                onClick={handleCreateRoom}
                className="mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
              >
                Buat Group Buy
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => {
              const badge = isRoomExpired(room)
                ? { label: "Kedaluwarsa", color: "bg-gray-100 text-gray-500" }
                : STATUS_BADGES[room.status];
              const joinable = isRoomJoinable(room);
              const full = isRoomFull(room);

              return (
                <div
                  key={room.id}
                  className="rounded-xl bg-white p-4 shadow-sm"
                  onClick={() => handleRoomClick(room.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{room.productName}</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Target: {room.targetQuantity} | Terpenuhi: {room.currentQuantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        Harga maks: Rp{Number(room.priceCeiling).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-400">
                        Batas: {new Date(room.deadline).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                        {full ? "Penuh" : badge.label}
                      </span>
                      {joinable && (
                        <button
                          className="rounded-lg bg-green-700 px-3 py-1 text-sm text-white hover:bg-green-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRoomClick(room.id);
                          }}
                        >
                          Gabung
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
