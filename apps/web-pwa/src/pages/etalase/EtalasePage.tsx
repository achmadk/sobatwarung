import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getEtalaseProducts } from "../../services/api.js";
import { db } from "../../services/db.js";

interface EtalaseProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string | null;
  images: string[];
}

export default function EtalasePage() {
  const { agenId } = useParams<{ agenId: string }>();
  const [products, setProducts] = useState<EtalaseProduct[]>([]);
  const [hubName, setHubName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!agenId) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await getEtalaseProducts(agenId);
      setProducts(data.products);
      setHubName(data.hub.name);

      // Cache products
      for (const product of data.products) {
        await db.products.put({
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          unit: product.unit,
          imageUrl: product.images?.[0] || undefined,
          supplierId: product.supplierId,
          hubId: agenId,
          cachedAt: Date.now(),
        });
      }
    } catch (err) {
      // Try cache
      const cached = await db.products.where("hubId").equals(agenId).toArray();
      if (cached.length > 0) {
        setProducts(cached as unknown as EtalaseProduct[]);
        setIsOffline(true);
      } else {
        setError(err instanceof Error ? err.message : "Failed to load products");
      }
    } finally {
      setIsLoading(false);
    }
  }, [agenId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleQuantityChange = (productId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: Math.max(1, qty) }));
  };

  const handleWhatsAppOrder = (product: EtalaseProduct) => {
    const qty = quantities[product.id] || 1;
    const total = qty * Number(product.price);
    const message = `Halo, saya ingin memesan:

- ${product.name} x ${qty} = Rp${total.toLocaleString("id-ID")}

Terima kasih!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-green-900">
          {hubName || "Etalase Tetangga"}
        </h1>
        {isOffline && (
          <p className="text-xs text-orange-500">
            Offline - data mungkin tidak terbaru
          </p>
        )}
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        {isLoading ? (
          <p className="text-center text-sm text-gray-400">Memuat...</p>
        ) : error ? (
          <p className="text-center text-sm text-red-500">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            Tidak ada produk tersedia
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-gray-200 p-3"
              >
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-32 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-4xl text-gray-300">📦</span>
                  </div>
                )}

                <h3 className="mt-2 text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="mt-1 text-sm font-semibold text-green-700">
                  Rp{Number(product.price).toLocaleString("id-ID")}/{product.unit}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleWhatsAppOrder(product)}
                    className="flex-1 rounded-lg bg-green-700 px-2 py-1 text-xs text-white hover:bg-green-800"
                  >
                    Pesan via WA
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
