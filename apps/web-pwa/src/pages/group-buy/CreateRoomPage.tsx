import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createRoom } from "../../services/api";
import { useToast } from "../../components/ToastProvider";
import type { Product } from "@sobatwarung/sdk";

type Step = 1 | 2 | 3;

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetQuantity, setTargetQuantity] = useState<number>(10);
  const [priceCeiling, setPriceCeiling] = useState<number>(0);
  const [deadline, setDeadline] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data);
      if (data.length > 0) {
        setPriceCeiling(Number(data[0].price));
      }
    } catch {
      showToast("Gagal memuat produk", "ERROR");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (targetQuantity <= 0) {
      newErrors.targetQuantity = "Jumlah target harus lebih dari 0";
    }
    if (priceCeiling <= 0) {
      newErrors.priceCeiling = "Harga maksimal harus lebih dari 0";
    }
    if (!deadline) {
      newErrors.deadline = "Batas waktu harus diisi";
    } else if (new Date(deadline) <= new Date()) {
      newErrors.deadline = "Batas waktu harus di masa depan";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && selectedProduct) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;
    setIsLoading(true);
    try {
      const room = await createRoom({
        productId: selectedProduct.id,
        targetQuantity,
        priceCeiling,
        deadline: new Date(deadline).toISOString(),
      });
      showToast("Room berhasil dibuat!", "SUCCESS");
      navigate(`/group-buy/${room.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal membuat room", "ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  const minDeadline = new Date();
  minDeadline.setDate(minDeadline.getDate() + 1);
  const minDeadlineStr = minDeadline.toISOString().slice(0, 16);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/group-buy")} className="text-gray-600">
            ←
          </button>
          <h1 className="text-lg font-semibold text-green-900">Buat Group Buy</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  s <= step ? "bg-green-700 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-8 ${s < step ? "bg-green-700" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <p className="mb-4 text-center text-sm text-gray-500">
          {step === 1 && "Langkah 1: Pilih Produk"}
          {step === 2 && "Langkah 2: Atur Syarat"}
          {step === 3 && "Langkah 3: Konfirmasi"}
        </p>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
            />
            {isLoadingProducts ? (
              <p className="text-center text-gray-500">Memuat...</p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`cursor-pointer rounded-lg border p-3 ${
                      selectedProduct?.id === product.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Rp{Number(product.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedProduct}
              className="w-full rounded-lg bg-green-700 py-3 text-white font-medium disabled:opacity-50"
            >
              Lanjut
            </button>
          </div>
        )}

        {step === 2 && selectedProduct && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4">
              <p className="text-sm text-gray-500">Produk</p>
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="text-sm text-gray-500">
                Harga retail: Rp{Number(selectedProduct.price).toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Target Kuantitas</label>
              <input
                type="number"
                min={1}
                value={targetQuantity}
                onChange={(e) => setTargetQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
              {errors.targetQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.targetQuantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Harga Maksimum per Unit
              </label>
              <input
                type="number"
                min={1}
                value={priceCeiling}
                onChange={(e) => setPriceCeiling(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
              {errors.priceCeiling && (
                <p className="mt-1 text-sm text-red-600">{errors.priceCeiling}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Batas Waktu</label>
              <input
                type="datetime-local"
                min={minDeadlineStr}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-600 focus:outline-none"
              />
              {errors.deadline && <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700"
              >
                Kembali
              </button>
              <button
                onClick={handleNext}
                className="flex-1 rounded-lg bg-green-700 py-3 font-medium text-white"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedProduct && (
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Produk</span>
                <span className="font-medium">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Target Kuantitas</span>
                <span className="font-medium">{targetQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Harga Maks</span>
                <span className="font-medium">Rp{priceCeiling.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Total Maksimal</span>
                <span className="font-medium text-green-700">
                  Rp{(priceCeiling * targetQuantity).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Batas Waktu</span>
                <span className="font-medium">
                  {deadline ? new Date(deadline).toLocaleString("id-ID") : "-"}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-700"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 rounded-lg bg-green-700 py-3 font-medium text-white disabled:opacity-50"
              >
                {isLoading ? "Memuat..." : "Buat Room"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
