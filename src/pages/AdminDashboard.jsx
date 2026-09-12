import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { onValue, ref as dbRef } from "firebase/database";
import { BarChart3, Ban, CheckCircle2, ShieldAlert, Store, Trash2 } from "lucide-react";
import { firestore, db } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";

const ADMIN_EMAILS = ["admin@mangrovise.store"];

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

export default function AdminDashboard() {
  const { firebaseUser, role, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("stores");
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");
  const [storeStatusFilter, setStoreStatusFilter] = useState("all");

  const isAdmin = role === "admin" || ADMIN_EMAILS.includes(firebaseUser?.email?.toLowerCase());

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    let storesData = [];
    let productsData = [];
    let storesReady = false;
    let productsReady = false;

    const publishStores = async () => {
      const enrichedStores = await Promise.all(storesData.map(async (store) => {
        const ownerId = store.ownerId || store.id;
        const userSnapshot = await getDoc(doc(firestore, "users", ownerId));
        const userData = userSnapshot.exists() ? userSnapshot.data() : {};

        return {
          ...store,
          ownerId,
          ownerEmail: store.ownerEmail || userData.email || "Email tidak tersedia",
          status: store.status || "active",
        };
      }));
      setStores(enrichedStores);
    };

    const publishProducts = async () => {
      const storeNames = await Promise.all(productsData.map(async (product) => {
        const storeSnapshot = await getDoc(doc(firestore, "stores", product.sellerId));
        return [product.id, storeSnapshot.exists() ? storeSnapshot.data().name : "Toko tidak ditemukan"];
      }));
      setProducts(productsData.map((product) => ({
        ...product,
        storeName: Object.fromEntries(storeNames)[product.id],
        status: product.status || "active",
      })));
    };

    const unsubscribeStores = onSnapshot(
      collection(firestore, "stores"),
      (snapshot) => {
        storesData = snapshot.docs.map((store) => ({ id: store.id, ...store.data() }));
        storesReady = true;
        publishStores().catch((readError) => console.error("Loading store owners failed:", readError));
        if (productsReady) setLoading(false);
      },
      (readError) => {
        console.error("Loading stores failed:", readError);
        setError("Data toko gagal dimuat.");
        setLoading(false);
      }
    );

    const unsubscribeProducts = onSnapshot(
      collection(firestore, "products"),
      (snapshot) => {
        productsData = snapshot.docs.map((product) => ({ id: product.id, ...product.data() }));
        productsReady = true;
        publishProducts().catch((readError) => console.error("Loading product stores failed:", readError));
        if (storesReady) setLoading(false);
      },
      (readError) => {
        console.error("Loading products failed:", readError);
        setError("Data produk gagal dimuat.");
        setLoading(false);
      }
    );

    const unsubscribeOrders = onValue(dbRef(db, "orders"), (snapshot) => {
      const orderGroups = snapshot.val() || {};
      setOrderCount(Object.values(orderGroups).reduce(
        (count, buyerOrders) => count + Object.keys(buyerOrders || {}).length,
        0
      ));
    });

    return () => {
      unsubscribeStores();
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [isAdmin]);

  const activeProductCount = useMemo(
    () => products.filter((product) => product.status === "active").length,
    [products]
  );

  const updateStoreStatus = async (store, nextStatus) => {
    setActionId(`store-${store.id}-${nextStatus}`);
    setError("");

    try {
      await updateDoc(doc(firestore, "stores", store.id), {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error("Updating store status failed:", updateError);
      setError("Status toko gagal diperbarui.");
    } finally {
      setActionId("");
    }
  };

  const visibleStores = storeStatusFilter === "all"
    ? stores
    : stores.filter((store) => store.status === storeStatusFilter);
  const statusCounts = stores.reduce((counts, store) => ({
    ...counts,
    [store.status]: (counts[store.status] || 0) + 1,
  }), { pending: 0, active: 0, suspended: 0, rejected: 0 });

  const statusLabel = {
    pending: "Pending",
    active: "Active",
    suspended: "Suspended",
    rejected: "Rejected",
  };

  const updateProductStatus = async (product) => {
    const nextStatus = product.status === "active" ? "inactive" : "active";
    setActionId(`product-${product.id}`);
    setError("");

    try {
      await updateDoc(doc(firestore, "products", product.id), {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error("Updating product status failed:", updateError);
      setError("Status produk gagal diperbarui.");
    } finally {
      setActionId("");
    }
  };

  const deleteProduct = async (product) => {
    if (!window.confirm(`Hapus produk ${product.name}?`)) return;

    setActionId(`delete-${product.id}`);
    setError("");
    try {
      await deleteDoc(doc(firestore, "products", product.id));
    } catch (deleteError) {
      console.error("Deleting product failed:", deleteError);
      setError("Produk gagal dihapus.");
    } finally {
      setActionId("");
    }
  };

  if (authLoading) {
    return <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Memeriksa akses admin...</p>;
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-2xl font-serif font-bold text-red-800">Akses Ditolak</h1>
        <p className="mt-2 text-sm text-red-700">Halaman ini hanya dapat diakses oleh administrator Mangrovise.</p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Platform Control</p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-mangrove-deep">Dashboard Admin</h1>
        <p className="mt-2 text-sm text-stone-500">Pantau toko, produk, dan aktivitas transaksi marketplace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><Store className="h-5 w-5 text-accent-ochre" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-400">Total Toko Terdaftar</p><p className="mt-1 text-3xl font-bold text-mangrove-deep">{stores.length}</p></div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><BarChart3 className="h-5 w-5 text-accent-ochre" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-400">Total Produk Aktif</p><p className="mt-1 text-3xl font-bold text-mangrove-deep">{activeProductCount}</p></div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><CheckCircle2 className="h-5 w-5 text-accent-ochre" /><p className="mt-4 text-xs font-bold uppercase tracking-wider text-stone-400">Total Pesanan Platform</p><p className="mt-1 text-3xl font-bold text-mangrove-deep">{orderCount}</p></div>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="rounded-2xl bg-white p-6 text-sm text-stone-500">Memuat data platform...</p>}

      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button onClick={() => setActiveTab("stores")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeTab === "stores" ? "bg-mangrove-deep text-white" : "text-stone-600 hover:bg-stone-100"}`}>Kelola Toko</button>
        <button onClick={() => setActiveTab("products")} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeTab === "products" ? "bg-mangrove-deep text-white" : "text-stone-600 hover:bg-stone-100"}`}>Moderasi Produk</button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("nav:open-admin-articles"))}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700"
        >
          Kelola Artikel
        </button>
      </div>

      {activeTab === "stores" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[{ key: "all", label: "Semua", count: stores.length }, { key: "pending", label: "Pending", count: statusCounts.pending }, { key: "active", label: "Active", count: statusCounts.active }, { key: "suspended", label: "Suspended", count: statusCounts.suspended }, { key: "rejected", label: "Rejected", count: statusCounts.rejected }].map((filter) => (
              <button key={filter.key} onClick={() => setStoreStatusFilter(filter.key)} className={`rounded-full px-3 py-2 text-xs font-bold ${storeStatusFilter === filter.key ? "bg-mangrove-deep text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"}`}>
                {filter.label} <span className="ml-1 opacity-70">{filter.count}</span>
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Nama Toko</th><th className="p-4">Deskripsi</th><th className="p-4">Alamat / Kontak</th><th className="p-4">Pemilik</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {visibleStores.map((store) => <tr key={store.id}>
                <td className="p-4 font-bold text-stone-800">{store.name || "Tanpa nama"}</td>
                <td className="max-w-xs p-4 text-stone-600"><p className="line-clamp-2">{store.description || "Tidak ada deskripsi."}</p></td>
                <td className="p-4 text-stone-600"><p>{store.address || "Alamat tidak tersedia"}</p><p className="mt-1 text-xs text-stone-400">{store.phone || "Kontak tidak tersedia"}</p></td>
                <td className="p-4 text-stone-600">{store.ownerEmail}</td>
                <td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${store.status === "active" ? "bg-emerald-100 text-emerald-700" : store.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{statusLabel[store.status] || store.status}</span></td>
                <td className="p-4"><div className="flex flex-wrap gap-2">
                  {store.status !== "active" && <button disabled={actionId === `store-${store.id}-active`} onClick={() => updateStoreStatus(store, "active")} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">Setujui Toko</button>}
                  {store.status === "pending" && <button disabled={actionId === `store-${store.id}-rejected`} onClick={() => updateStoreStatus(store, "rejected")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50">Tolak Toko</button>}
                  {store.status === "active" && <button disabled={actionId === `store-${store.id}-suspended`} onClick={() => updateStoreStatus(store, "suspended")} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-50">Bekukan Toko</button>}
                  {(store.status === "suspended" || store.status === "rejected") && <button disabled={actionId === `store-${store.id}-active`} onClick={() => updateStoreStatus(store, "active")} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700 disabled:opacity-50">Aktifkan Kembali</button>}
                </div></td>
              </tr>)}
            </tbody>
          </table>
          {!visibleStores.length && !loading && <p className="p-8 text-center text-sm text-stone-500">Tidak ada toko dengan status tersebut.</p>}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500"><tr><th className="p-4">Produk</th><th className="p-4">Toko</th><th className="p-4">Harga</th><th className="p-4">Status</th><th className="p-4">Aksi</th></tr></thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => <tr key={product.id}><td className="p-4"><div className="flex items-center gap-3"><img src={product.imageUrl || "images/Sirup.jpeg"} alt={product.name} className="h-10 w-10 rounded-lg object-cover" /><span className="font-bold text-stone-800">{product.name}</span></div></td><td className="p-4 text-stone-600">{product.storeName}</td><td className="p-4 font-semibold text-stone-700">{formatCurrency(product.price)}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{product.status}</span></td><td className="flex gap-2 p-4"><button disabled={actionId === `product-${product.id}`} onClick={() => updateProductStatus(product)} className="rounded-lg border border-stone-200 p-2 text-stone-700 disabled:opacity-50" title={product.status === "active" ? "Nonaktifkan produk" : "Aktifkan produk"}>{product.status === "active" ? <Ban className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</button><button disabled={actionId === `delete-${product.id}`} onClick={() => deleteProduct(product)} className="rounded-lg border border-red-200 p-2 text-red-600 disabled:opacity-50" title="Hapus produk"><Trash2 className="h-4 w-4" /></button></td></tr>)}
            </tbody>
          </table>
          {!products.length && !loading && <p className="p-8 text-center text-sm text-stone-500">Belum ada produk.</p>}
        </div>
      )}
    </section>
  );
}
