import { useState, type SubmitEvent } from "react";
import type { BuyingRoom } from "@sobatwarung/sdk";

interface JoinRoomDialogProps {
  room: BuyingRoom;
  onConfirm: (quantity: number) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export function JoinRoomDialog({ room, onConfirm, onCancel, isLoading }: JoinRoomDialogProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const maxQuantity = room.targetQuantity - room.currentQuantity;
  const totalPrice = Number(room.priceCeiling) * quantity;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError("Jumlah harus lebih dari 0");
      return;
    }

    if (quantity > maxQuantity) {
      setError(`Maksimal ${maxQuantity} unit`);
      return;
    }

    await onConfirm(quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold text-gray-900">Gabung Group Buy</h2>
        <p className="mt-1 text-sm text-gray-500">{room.productName}</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jumlah yang ingin dipesan
            </label>
            <input
              type="number"
              min={1}
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600"
            />
            <p className="mt-1 text-xs text-gray-400">Sisa slot: {maxQuantity} unit</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Harga per unit</span>
              <span className="font-medium">
                Rp{Number(room.priceCeiling).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium">
              <span className="text-gray-700">Total</span>
              <span className="text-green-700">Rp{totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || quantity <= 0 || quantity > maxQuantity}
              className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {isLoading ? "Memuat..." : "Konfirmasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
