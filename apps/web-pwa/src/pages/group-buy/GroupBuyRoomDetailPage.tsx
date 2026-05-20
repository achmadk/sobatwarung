import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, joinRoom, checkoutRoom } from "../../services/api";
import { enqueueMutation } from "../../services/sync";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../components/ToastProvider";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import { JoinRoomDialog } from "../../components/JoinRoomDialog";
import type { BuyingRoom } from "@sobatwarung/sdk";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  OPEN: { label: "Terbuka", color: "bg-green-100 text-green-700" },
  LOCKED: { label: "Dikunci", color: "bg-orange-100 text-orange-700" },
  CHECKOUT: { label: "Target Tercapai", color: "bg-blue-100 text-blue-700" },
  DISTRIBUTED: { label: "Selesai", color: "bg-gray-100 text-gray-700" },
};

export default function GroupBuyRoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { markFirstGroupBuyComplete, firstGroupBuyCompleted } = useOnboardingProgress();

  const [room, setRoom] = useState<BuyingRoom | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchRoom = useCallback(async () => {
    if (!roomId) return;
    try {
      const data = await getRoom(roomId);
      setRoom(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat detail room");
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    fetchRoom();
  }, [fetchRoom]);

  const handleJoin = () => {
    setShowJoinDialog(true);
  };

  const handleJoinConfirm = async (quantity: number) => {
    if (!roomId) return;
    setIsJoining(true);
    try {
      if (!navigator.onLine) {
        await enqueueMutation("room_participation", "create", roomId, {
          roomId,
          quantity,
          timestamp: new Date().toISOString(),
        });
        showToast("Anda offline. Partisipasi akan disinkronkan saat terhubung.", "INFO");
        if (!firstGroupBuyCompleted) {
          await markFirstGroupBuyComplete();
        }
        setShowJoinDialog(false);
        return;
      }
      await joinRoom(roomId, quantity);
      showToast("Berhasil bergabung dengan group buy!", "SUCCESS");
      if (!firstGroupBuyCompleted) {
        await markFirstGroupBuyComplete();
      }
      setShowJoinDialog(false);
      fetchRoom();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal bergabung";
      if (message.includes("full") || message.includes("penuh")) {
        showToast("Maaf, room sudah penuh", "ERROR");
      } else {
        showToast(message, "ERROR");
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleCheckout = async () => {
    if (!roomId || !room) return;
    if (room.currentQuantity < room.targetQuantity) {
      showToast("Target belum tercapai", "ERROR");
      return;
    }
    setIsCheckingOut(true);
    try {
      await checkoutRoom(roomId);
      showToast("Checkout berhasil!", "SUCCESS");
      fetchRoom();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal checkout", "ERROR");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isAgenUtama = user?.role === "AGEN_UTAMA";
  const canJoin = room?.status === "OPEN" && room.currentQuantity < room.targetQuantity;
  const canCheckout =
    isAgenUtama && room?.status === "OPEN" && room.currentQuantity >= room.targetQuantity;
  const progress = room ? Math.min((room.currentQuantity / room.targetQuantity) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Memuat...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || "Room tidak ditemukan"}</p>
          <button onClick={() => navigate("/group-buy")} className="mt-4 text-green-700 underline">
            Kembali ke Group Buy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/group-buy")} className="text-gray-600">
            ←
          </button>
          <h1 className="text-lg font-semibold text-green-900">Detail Group Buy</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-bold text-gray-800">{room.productName}</h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_LABELS[room.status].color}`}
            >
              {STATUS_LABELS[room.status].label}
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Target Kuantitas</span>
              <span className="font-medium">{room.targetQuantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Terpenuhi</span>
              <span className="font-medium">{room.currentQuantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Harga Maksimum</span>
              <span className="font-medium">
                Rp{Number(room.priceCeiling).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Batas Waktu</span>
              <span className="font-medium">
                {new Date(room.deadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-green-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700">Peserta</h3>
          <p className="mt-1 text-xs text-gray-400">{room.currentQuantity} orang telah bergabung</p>
          <p className="mt-2 text-xs text-gray-400 italic">
            Daftar peserta akan ditampilkan di sini
          </p>
        </div>

        {canJoin && (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full rounded-xl bg-green-700 py-3 text-white font-medium hover:bg-green-800 disabled:opacity-50"
          >
            {isJoining ? "Memuat..." : "Gabung Group Buy"}
          </button>
        )}

        {canCheckout && (
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full rounded-xl bg-blue-700 py-3 text-white font-medium hover:bg-blue-800 disabled:opacity-50"
          >
            {isCheckingOut ? "Memuat..." : "Checkout Room"}
          </button>
        )}

        {!canJoin && !canCheckout && room.status === "OPEN" && (
          <div className="rounded-xl bg-gray-100 p-4 text-center">
            <p className="text-sm text-gray-600">
              {room.currentQuantity >= room.targetQuantity
                ? "Target sudah tercapai. Menunggu checkout dari Agen Utama."
                : "Room sudah tidak dapat diikuti."}
            </p>
          </div>
        )}
      </main>

      {showJoinDialog && (
        <JoinRoomDialog
          room={room}
          onConfirm={handleJoinConfirm}
          onCancel={() => setShowJoinDialog(false)}
          isLoading={isJoining}
        />
      )}
    </div>
  );
}
