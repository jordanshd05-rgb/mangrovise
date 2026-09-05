import { useEffect, useMemo, useState } from "react";
import { onValue, ref as dbRef, update as dbUpdate } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";
import { CheckCircle2, MapPin, Package, Truck, XCircle } from "lucide-react";

const statusOptions = [
  { value: "Pending", label: "Pending", icon: Package },
  { value: "In Process", label: "Proses Pesanan", icon: Package },
  { value: "Dikirim", label: "Kirim Pesanan", icon: Truck },
  { value: "Selesai", label: "Selesaikan Pesanan", icon: CheckCircle2 },
  { value: "Dibatalkan", label: "Batalkan Pesanan", icon: XCircle },
];

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const getStatusStyle = (status) => {
  if (status === "Selesai") return "bg-emerald-100 text-emerald-700";
  if (status === "Dikirim") return "bg-blue-100 text-blue-700";
  if (status === "Dibatalkan") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

const formatAddress = (address) => {
  if (!address) return "Alamat belum tersedia";
  if (typeof address === "string") return address;
  return [address.addressDetails, address.provinceCity, address.postalCode]
    .filter(Boolean)
    .join(", ") || "Alamat belum tersedia";
};

export default function SellerOrders({ products }) {
  const { firebaseUser, isSeller } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState("");

  const sellerProductIds = useMemo(
    () => new Set(products.map((product) => product.id)),
    [products]
  );

  useEffect(() => {
    if (!firebaseUser || !isSeller) {
      setOrders([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const ordersRef = dbRef(db, "orders");

    return onValue(
      ordersRef,
      (snapshot) => {
        const allOrders = snapshot.val() || {};
        const sellerOrders = [];

        Object.entries(allOrders).forEach(([buyerId, buyerOrders]) => {
          Object.entries(buyerOrders || {}).forEach(([orderKey, order]) => {
            const sellerItems = (order.items || []).filter((item) =>
              sellerProductIds.has(String(item.productId)) || sellerProductIds.has(item.productId)
            );

            if (sellerItems.length === 0) return;

            const sellerTotal = sellerItems.reduce(
              (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
              0
            );

            sellerOrders.push({
              ...order,
              id: orderKey,
              buyerId,
              sellerItems,
              sellerTotal,
              buyerName: order.buyerName || order.buyerEmail || buyerId,
            });
          });
        });

        sellerOrders.sort((left, right) => String(right.tanggal || "").localeCompare(String(left.tanggal || "")));
        setOrders(sellerOrders);
        setError("");
        setLoading(false);
      },
      (readError) => {
        console.error("Loading seller orders failed:", readError);
        setError("Pesanan masuk gagal dimuat. Pastikan akses Realtime Database sudah diatur.");
        setLoading(false);
      }
    );
  }, [firebaseUser, isSeller, sellerProductIds]);

  const handleStatusChange = async (order, status) => {
    if (status === order.status) return;

    const orderPath = `orders/${order.buyerId}/${order.id}/status`;
    setUpdatingOrder(order.id);
    setError("");

    try {
      await dbUpdate(dbRef(db, orderPath.replace(/\/status$/, "")), {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (updateError) {
      console.error("Updating seller order status failed:", updateError);
      setError("Status pesanan gagal diperbarui.");
    } finally {
      setUpdatingOrder("");
    }
  };

  if (!isSeller) return null;

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Seller Center</p>
        <h2 className="mt-2 text-2xl font-serif font-bold text-mangrove-deep">Pesanan Masuk</h2>
        <p className="mt-2 text-sm text-stone-500">Kelola pesanan yang berisi produk dari toko Anda.</p>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="rounded-2xl bg-white p-8 text-center text-sm text-stone-500">Memuat pesanan masuk...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
          Belum ada pesanan untuk produk toko Anda.
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={`${order.buyerId}-${order.id}`} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ID Pesanan</p>
                  <p className="mt-1 font-mono text-sm font-bold text-stone-900">{order.orderId || order.id}</p>
                  <p className="mt-1 text-xs text-stone-500">Tanggal: {order.tanggal || "-"}</p>
                  <p className="mt-1 text-sm font-semibold text-stone-700">Pembeli: {order.buyerName}</p>
                </div>
                <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                  <span className={`rounded-full px-3 py-1 text-center text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {order.status === "In Process" ? "Diproses" : order.status || "Pending"}
                  </span>
                  <select
                    value={order.status || "In Process"}
                    disabled={updatingOrder === order.id}
                    onChange={(event) => handleStatusChange(order, event.target.value)}
                    className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 outline-none focus:border-accent-ochre disabled:opacity-60"
                    aria-label={`Ubah status pesanan ${order.orderId || order.id}`}
                  >
                    {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_260px]">
                <div className="space-y-3">
                  {order.sellerItems.map((item, index) => (
                    <div key={`${order.id}-${item.productId || index}`} className="flex items-center gap-3 border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                      <img src={item.image || "images/Sirup.jpeg"} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">{item.quantity} x {formatCurrency(item.price)}</p>
                      </div>
                      <p className="text-sm font-bold text-stone-800">{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-xl bg-stone-50 p-4 text-sm">
                  <p className="flex items-start gap-2 text-stone-600"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-ochre" /><span>{formatAddress(order.alamat)}</span></p>
                  <div className="border-t border-stone-200 pt-3">
                    <span className="block text-xs text-stone-500">Total produk toko</span>
                    <strong className="text-lg text-mangrove-deep">{formatCurrency(order.sellerTotal)}</strong>
                  </div>
                  <p className="text-[11px] text-stone-400">Total seluruh order: {formatCurrency(order.total)}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
