import { useState } from "react";
import {
  CalendarDays,
  Eye,
  Leaf,
  Printer,
  ShoppingBag,
  X,
} from "lucide-react";

const formatCurrency = (value) =>
  `Rp ${Number(value || 0).toLocaleString("id-ID")}`;

const getStatusStyle = (status) => {
  switch (status) {
    case "Selesai":
      return "bg-emerald-100 text-emerald-700";
    case "Dikirim":
      return "bg-blue-100 text-blue-700";
    case "Dibatalkan":
      return "bg-red-100 text-red-700";
    case "Diproses":
    case "In Process":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-stone-100 text-stone-600";
  }
};

export default function OrderHistory({ orders, handleTabChange }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const printInvoice = (order) => {
    setSelectedOrder(order);
    window.setTimeout(() => window.print(), 100);
  };

  return (
    <section className="space-y-8 print:bg-white">
      <div className="print:hidden">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">
          <ShoppingBag className="h-4 w-4" /> Riwayat Belanja
        </span>
        <h1 className="mt-2 text-3xl font-serif font-bold text-stone-950">Pesanan Saya</h1>
        <p className="mt-2 text-sm text-stone-500">
          Pantau transaksi, produk, dan status pesanan Anda.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="space-y-4 rounded-3xl border-2 border-dashed border-stone-200 bg-white py-16 text-center print:hidden">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warm-bg text-stone-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-800">Belum Ada Pesanan</h2>
            <p className="mx-auto mt-1 max-w-sm text-xs text-stone-500">
              Pesanan Anda akan muncul di sini setelah menyelesaikan transaksi.
            </p>
          </div>
          <button
            onClick={() => handleTabChange("katalog")}
            className="rounded-xl bg-accent-ochre px-5 py-3 text-xs font-bold text-white"
          >
            Mulai Belanja
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-stone-200/80 bg-white shadow-sm print:rounded-none print:border-b print:border-x-0 print:border-t-0 print:shadow-none"
            >
              <div className="flex flex-col gap-4 border-b border-stone-100 bg-stone-50 p-5 sm:flex-row sm:items-center sm:justify-between print:bg-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ID Pesanan</p>
                  <p className="mt-1 font-mono text-sm font-bold text-stone-900">{order.orderId || order.id}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-stone-500">
                    <CalendarDays className="h-3.5 w-3.5" /> {order.tanggal || "Tanggal tidak tersedia"}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(order.status)}`}>
                    {order.status === "In Process" ? "Diproses" : order.status || "Pending"}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-100 print:hidden"
                  >
                    <Eye className="h-3.5 w-3.5" /> Detail
                  </button>
                </div>
              </div>

              <div className="divide-y divide-stone-100 p-5">
                {(order.items || []).map((item, index) => (
                  <div key={`${order.id}-${item.productId || index}`} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <img
                      src={item.image || "images/Sirup.jpeg"}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl border border-stone-100 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-stone-800">{item.name}</h3>
                      <p className="mt-1 text-xs text-stone-500">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="text-right text-sm font-bold text-stone-800">
                      {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 border-t border-stone-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-stone-500">
                  <span className="block">Invoice: {order.invoiceNo || "-"}</span>
                  <span className="mt-1 block font-bold text-mangrove-deep">Total {formatCurrency(order.total)}</span>
                </div>
                <button
                  onClick={() => printInvoice(order)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-mangrove-deep px-4 py-2.5 text-xs font-bold text-mangrove-deep hover:bg-mangrove-deep hover:text-white print:hidden"
                >
                  <Printer className="h-3.5 w-3.5" /> Cetak Invoice
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-4 print:static print:block print:p-0">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm print:hidden" onClick={() => setSelectedOrder(null)} />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl print:max-h-none print:max-w-none print:overflow-visible print:rounded-none print:p-0 print:shadow-none">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-accent-ochre">Invoice Mangrovise</p>
                <h2 className="mt-1 text-2xl font-serif font-bold text-stone-900">Detail Pesanan</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 print:hidden" aria-label="Tutup detail">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 border-b border-stone-100 py-5 text-sm sm:grid-cols-2">
              <p><span className="text-stone-400">ID:</span> <strong>{selectedOrder.orderId || selectedOrder.id}</strong></p>
              <p><span className="text-stone-400">Invoice:</span> <strong>{selectedOrder.invoiceNo || "-"}</strong></p>
              <p><span className="text-stone-400">Tanggal:</span> <strong>{selectedOrder.tanggal || "-"}</strong></p>
              <p><span className="text-stone-400">Status:</span> <strong>{selectedOrder.status === "In Process" ? "Diproses" : selectedOrder.status || "Pending"}</strong></p>
            </div>

            <div className="space-y-3 py-5">
              {(selectedOrder.items || []).map((item, index) => (
                <div key={`${selectedOrder.id}-detail-${item.productId || index}`} className="flex items-center gap-3">
                  <img src={item.image || "images/Sirup.jpeg"} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1 text-sm"><strong>{item.name}</strong><p className="text-xs text-stone-500">{item.quantity} x {formatCurrency(item.price)}</p></div>
                  <strong>{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="text-sm font-bold text-stone-500">Total Pembayaran</span>
              <span className="text-xl font-bold text-mangrove-deep">{formatCurrency(selectedOrder.total)}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
              <Leaf className="h-4 w-4 text-accent-ochre" /> Kontribusi: {selectedOrder.ecoDonation || 0} bibit bakau
            </div>
            <button onClick={() => printInvoice(selectedOrder)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-mangrove-deep px-4 py-3 text-sm font-bold text-white print:hidden">
              <Printer className="h-4 w-4" /> Cetak Invoice
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
