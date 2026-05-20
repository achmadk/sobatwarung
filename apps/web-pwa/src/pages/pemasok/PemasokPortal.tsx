import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/api.js";
import { enqueueMutation } from "../../services/sync.js";
import { useAuth } from "../../hooks/useAuth.js";
import { db } from "../../services/db.js";
import type { Product } from "@sobatwarung/sdk";

export default function PemasokPortal() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    unit: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getProducts({ supplierId: user.id });
      setProducts(data);

      // Cache products
      for (const product of data) {
        await db.products.put({
          id: product.id,
          name: product.name,
          category: product.category,
          price: Number(product.price),
          unit: product.unit,
          imageUrl: product.images?.[0] || undefined,
          supplierId: product.supplierId,
          hubId: "",
          cachedAt: Date.now(),
        });
      }
    } catch (err) {
      const cached = await db.products.toArray();
      setProducts(cached as unknown as Product[]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        unit: formData.unit,
        description: formData.description || undefined,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await createProduct(productData);
      }

      await fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: "", category: "", price: "", unit: "", description: "" });
    } catch (err) {
      // Queue for later if offline
      await enqueueMutation("product", editingProduct ? "update" : "create", editingProduct?.id || "new", formData);
      setShowForm(false);
      setEditingProduct(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: String(product.price),
      unit: product.unit,
      description: product.description || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await fetchProducts();
    } catch {
      await enqueueMutation("product", "delete", productId, {});
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const activeProducts = products.filter((p) => p.isActive);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-green-900">Portal Pemasok</h1>
            <p className="text-sm text-gray-500">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-lg space-y-4 px-4 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Produk Aktif</p>
            <p className="mt-1 text-2xl font-bold text-green-700">{activeProducts.length}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500">Pesanan Masuk</p>
            <p className="mt-1 text-2xl font-bold text-green-700">0</p>
          </div>
        </div>

        {/* Product management */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Daftar Produk</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setFormData({ name: "", category: "", price: "", unit: "", description: "" });
                setShowForm(true);
              }}
              className="text-sm text-green-700 hover:underline"
            >
              + Tambah
            </button>
          </div>

          {isLoading ? (
            <p className="mt-2 text-sm text-gray-400">Memuat...</p>
          ) : products.length === 0 ? (
            <>
              <p className="mt-2 text-sm text-gray-400">Belum ada produk. Tambahkan produk pertama Anda.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 w-full rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
              >
                Tambah Produk
              </button>
            </>
          ) : (
            <ul className="mt-3 space-y-3">
              {products.map((product) => (
                <li key={product.id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.category} - Rp{Number(product.price).toLocaleString("id-ID")}/{product.unit}
                      </p>
                      {!product.isActive && (
                        <span className="text-xs text-red-500">Nonaktif</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-xs text-green-700 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Incoming orders placeholder */}
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700">Pesanan Masuk</h2>
          <p className="mt-2 text-sm text-gray-400">Belum ada pesanan masuk</p>
        </div>
      </main>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-green-900">
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Harga</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    placeholder="kg, pcs, liter"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
