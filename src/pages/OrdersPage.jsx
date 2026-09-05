import {
    ShoppingBag,
    Leaf,
} from "lucide-react";

export default function OrdersPage({
    orders,
    handleTabChange,
    renderAddressDetails,
    handleCancelOrder,
}) {
    return (
        <>
            <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-stone-200/80 space-y-8 text-left">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-ochre flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-accent-ochre" /> Riwayat Belanja Lestari Anda
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
                Pesanan Saya
              </h2>
              <p className="text-sm text-stone-500">
                Lacak status pesanan pangan mangrove dan kontribusi bibit bakau Anda secara real-time.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center border-2 border-dashed border-stone-200 rounded-3xl space-y-4">
                <div className="w-16 h-16 bg-warm-bg rounded-2xl flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base text-stone-800">Belum Ada Transaksi</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Anda belum melakukan pemesanan produk Mangrovise. Silakan pilih produk dari katalog kami untuk memulai kontribusi hijau Anda!
                  </p>
                </div>
                <button
                  onClick={() => handleTabChange("katalog")}
                  className="bg-accent-ochre hover:opacity-95 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Mulai Belanja Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="border border-stone-200/80 rounded-3xl overflow-hidden hover:shadow-md transition-all bg-white"
                  >
                    {/* Order Card Header */}
                    <div className="bg-stone-50 p-6 border-b border-stone-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-500">No. Invoice:</span>
                          <span className="text-xs font-mono font-bold text-stone-900">{order.invoiceNo || `INV-${order.orderId}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{order.tanggal}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-stone-500">Status:</span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm
                          ${
                            order.status === "Dibatalkan"
                              ? "bg-red-600 text-white"
                              : order.status === "Selesai"
                              ? "bg-green-600 text-white"
                              : order.status === "Dikirim"
                              ? "bg-blue-600 text-white"
                              : "bg-amber-500 text-white animate-pulse"
                          }`}
                        >
                          {order.status || "In Process"}
                        </span>
                      </div>
                    </div>

                    {/* Order Card Body */}
                    <div className="p-6 space-y-4">
                      <div className="divide-y divide-stone-100">
                        {order.items && order.items.map((item, index) => (
                          <div key={index} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-4">
                              <img 
                                src={item.image || "https://via.placeholder.com/150"} 
                                alt={item.name} 
                                className="w-12 h-12 object-cover rounded-xl border border-stone-100 shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="text-left">
                                <h4 className="text-xs font-bold text-stone-900">{item.name}</h4>
                                <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                                  Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-mono font-bold text-stone-900 shrink-0">
                              Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Eco Impact Contribution Info */}
                      <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-emerald-800 font-medium">
                          <Leaf className="w-4 h-4 text-accent-ochre animate-bounce shrink-0" />
                          <span>Kontribusi Anda: <strong>{order.ecoDonation || Math.round(order.total / 10000)} Bibit Bakau</strong> ditanam di Kuala Langsa</span>
                        </div>
                        <div className="text-emerald-700 font-semibold font-mono">
                          Setara -{order.carbonSaved || Math.round(order.total / 10000) * 2} kg CO₂ / tahun
                        </div>
                      </div>

                      {/* Alamat Pengiriman */}
                      <div className="border-t border-stone-100/80 pt-4 mt-4 text-left">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">Alamat Pengiriman:</span>
                        {renderAddressDetails(order.alamat)}
                      </div>
                    </div>

                    {/* Order Card Footer */}
                    <div className="bg-stone-50/60 p-6 border-t border-stone-150 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <span className="text-xs font-bold text-stone-500">
                          Total Pembayaran
                        </span>
                        <div className="text-base font-mono font-bold text-mangrove-deep">
                          Rp {order.total.toLocaleString("id-ID")}
                        </div>
                      </div>
                      {order.status !== "Dibatalkan" &&
                        order.status !== "Dikirim" &&
                        order.status !== "Selesai" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                          >
                            Batalkan Pesanan
                          </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>  
        </>
    );
}