import {
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Leaf,
  QrCode,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function CartDrawer({
    isCartOpen,
    setIsCartOpen,

    cart,
    setCart,

    cartStep,
    setCartStep,

    totalCartItems,
    allChecked,

    toggleSelectAll,
    toggleCheckItem,

    handleDecreaseQuantity,
    handleAddToCart,
    handleRemoveItem,

    shippingAddress,
    setShippingAddress,

    ecoMetrics,
    cartTotal,

    handleCheckout,

    triggerToast,

    user,
    setShowLoginModal,
}) {

    if (!isCartOpen) return null;

    return (
      <>
        {/* SLIDE-OVER SHOPPING CART DRAWER */}
        <AnimatePresence>
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              
              {
                /* Overlay Backdrop Blur */
              }
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm transition-opacity"
              />

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-10">
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
                >
                  {
                   /* Header Cart */
                  }
                  <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                    <div className="flex items-center space-x-2 text-stone-900 text-left">
                      <ShoppingBag className="w-5 h-5 text-mangrove-deep" />
                      <h3 className="font-serif font-bold text-lg">Keranjang Belanja</h3>
                      <span className="bg-mangrove-light text-mangrove-deep text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {totalCartItems} Item
                      </span>
                    </div>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {
                   /* Cart Body - Items List */
                  }
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center border border-stone-100">
                          <ShoppingCart className="w-8 h-8 text-stone-300" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-stone-850 text-sm">Keranjang Anda Kosong</p>
                          <p className="text-xs text-stone-500 max-w-xs">Jelajahi rasa eksotik mangrove pesisir Langsa dan tambahkan beberapa item sehat.</p>
                        </div>
                        <button
                          onClick={() => setIsCartOpen(false)}
                          className="bg-mangrove-deep text-stone-50 text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-colors cursor-pointer"
                       >
                          Mulai Belanja Sekarang
                        </button>
                      </div> : (
                        <div className="space-y-4">
                          {cartStep === 1 ? (
                            <>
                              {/* Pilih Semua Checkbox (Ala Tokopedia) */}
                              <div className="flex items-center justify-between pb-3 border-b border-stone-150 mb-3 text-left">
                                <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={toggleSelectAll}
                                    className="w-4.5 h-4.5 text-mangrove-deep border-stone-300 rounded focus:ring-mangrove-deep cursor-pointer accent-mangrove-deep"
                                  />
                                  <span className="text-xs font-bold text-stone-700">Pilih Semua ({cart.length} produk)</span>
                                </label>
                                {cart.some(item => item.checked !== false) && (
                                  <button
                                    onClick={() => {
                                      setCart(prev => prev.map(item => ({ ...item, checked: false })));
                                    }}
                                    className="text-xs font-bold text-stone-400 hover:text-mangrove-deep transition-colors cursor-pointer"
                                  >
                                    Hapus Pilihan
                                  </button>
                                )}
                              </div>

                              {cart.map((item) => <div
                                key={item.product.id}
                                className="flex items-center space-x-3 p-3 rounded-xl border border-stone-150 bg-white hover:border-stone-350 transition-colors text-left"
                              >
                                  {/* Checkbox untuk seleksi barang (Ala Tokopedia) */}
                                  <input
                                    type="checkbox"
                                    checked={item.checked !== false}
                                    onChange={() => toggleCheckItem(item.product.id)}
                                    className="w-4.5 h-4.5 text-mangrove-deep border-stone-300 rounded focus:ring-mangrove-deep cursor-pointer accent-mangrove-deep shrink-0"
                                  />

                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-lg bg-stone-50 shrink-0 border border-stone-100"
                                    referrerPolicy="no-referrer"
                                  />
                                  
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1 leading-tight">
                                      {item.product.name}
                                    </h4>
                                    <span className="block text-xs font-mono font-bold text-mangrove-deep mt-0.5">
                                      Rp {item.product.price.toLocaleString("id-ID")}
                                    </span>

                                    <div className="flex items-center justify-between mt-2">
                                      {
                                       /* Quantity Toggler */
                                     }
                                      <div className="flex items-center space-x-2 bg-stone-100 p-1 rounded-lg border border-stone-200">
                                        <button
                                          onClick={() => handleDecreaseQuantity(item.product.id)}
                                          className="text-stone-600 hover:text-stone-950 p-1 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-mono font-bold text-stone-900 w-5 text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() => handleAddToCart(item.product)}
                                          className="text-stone-600 hover:text-stone-950 p-1 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>

                                      <button
                                        onClick={() => handleRemoveItem(item.product.id)}
                                        className="text-stone-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                                        title="Hapus barang"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>)}
                            </>
                          ) : (
                            <>
                              {/* TAHAP 2: Form Alamat */}
                              <button
                                onClick={() => setCartStep(1)}
                                className="flex items-center space-x-1.5 text-xs text-stone-500 hover:text-mangrove-deep font-bold transition-colors pb-3 border-b border-stone-100 cursor-pointer w-full text-left"
                              >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Kembali ke Keranjang</span>
                              </button>

                              {/* Alamat Lengkap Pengiriman Form */}
                              <div className="space-y-3.5 text-left pt-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Pengiriman (Tokopedia Style)</label>
                                  <span className="text-[9px] text-mangrove-deep font-bold bg-mangrove-light px-2 py-0.5 rounded-full uppercase tracking-wider">Form Terpisah</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Nama Penerima</span>
                                    <input
                                      type="text"
                                      required
                                      value={shippingAddress.recipientName || ""}
                                      onChange={(e) => setShippingAddress(prev => ({ ...prev, recipientName: e.target.value }))}
                                      placeholder="Nama lengkap"
                                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all placeholder-stone-400 font-medium"
                                    />
                                  </div>
                                  
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">No. Handphone</span>
                                    <input
                                      type="tel"
                                      required
                                      value={shippingAddress.phone || ""}
                                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                                      placeholder="Contoh: 08123456789"
                                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all placeholder-stone-400 font-medium"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                  <div className="col-span-2 space-y-1">
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Provinsi & Kota/Kabupaten</span>
                                    <input
                                      type="text"
                                      required
                                      value={shippingAddress.provinceCity || ""}
                                      onChange={(e) => setShippingAddress(prev => ({ ...prev, provinceCity: e.target.value }))}
                                      placeholder="Contoh: DKI Jakarta, Jakarta Pusat"
                                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all placeholder-stone-400 font-medium"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Kode Pos</span>
                                    <input
                                      type="text"
                                      required
                                      value={shippingAddress.postalCode || ""}
                                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                                      placeholder="10110"
                                      className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all placeholder-stone-400 font-medium"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Lengkap / Nama Jalan</span>
                                  <input
                                    type="text"
                                    required
                                    value={shippingAddress.addressDetails || ""}
                                    onChange={(e) => setShippingAddress(prev => ({ ...prev, addressDetails: e.target.value }))}
                                    placeholder="Nama jalan, RT/RW, nomor rumah, nomor unit"
                                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all placeholder-stone-400 font-medium"
                                  />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                  </div>

                  {
    /* Cart Footer - Totals & Ecological impact summary */
  }
                  {cart.length > 0 && <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
                      
                      {
    /* Eco contribution summary card */
  }
                      <div className="bg-mangrove-deep text-mangrove-light p-4 rounded-xl border border-mangrove-deep flex items-start space-x-3 text-left">
                        <Leaf className="w-5 h-5 text-accent-ochre shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <span className="text-[9px] uppercase font-extrabold text-accent-ochre tracking-wider block">Eco-Impact Aktif</span>
                          <p className="text-xs text-white font-bold leading-tight mt-0.5">
                            Belanja Anda setara dengan mendonasikan {ecoMetrics.seedlings} bibit bakau, mengurangi emisi {ecoMetrics.carbonOffset} kg CO₂/tahun.
                          </p>
                        </div>
                      </div>

                      {
    /* Payment details */
  }
                      <div className="space-y-2 text-xs text-stone-600">
                        <div className="flex justify-between">
                          <span>Subtotal Barang</span>
                          <span className="font-mono text-stone-900 font-bold">Rp {cartTotal.toLocaleString("id-ID")}</span>
                        </div>
                        <div className="flex justify-between items-center text-mangrove-deep">
                          <span className="flex items-center space-x-1">
                            <span>Sertifikasi Eco-Donasi</span>
                            <span className="bg-mangrove-light text-mangrove-deep text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">Gratis</span>
                          </span>
                          <span className="font-mono font-bold text-mangrove-deep">Rp 0</span>
                        </div>
                        <div className="border-t border-stone-200 pt-3 flex justify-between text-base font-bold text-stone-900">
                          <span>Total Pembayaran</span>
                          <span className="font-mono text-mangrove-deep">Rp {cartTotal.toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      {cartStep === 1 ? (
                        <button
                          onClick={() => {
                            const checkedItems = cart.filter((item) => item.checked !== false);
                            if (checkedItems.length === 0) {
                              triggerToast("Silakan pilih minimal 1 produk untuk dicheckout!", "info");
                              return;
                            }
                            if (!user) {
                              setIsCartOpen(false);
                              triggerToast("Silakan masuk akun terlebih dahulu untuk melanjutkan checkout.", "info");
                              setShowLoginModal(true);
                              return;
                            }
                            setCartStep(2);
                          }}
                          className="w-full bg-mangrove-deep hover:opacity-95 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <span>Lanjut ke Pengiriman</span>
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          onClick={handleCheckout}
                          className="w-full bg-accent-ochre hover:bg-accent-ochre/95 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-accent-ochre/10 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                        >
                          <QrCode className="w-5 h-5" />
                          <span>Bayar via QRIS (Simulasi)</span>
                        </button>
                      )}
                    </div>}

                </motion.div>
              </div>
            </div>
          </div>
        </AnimatePresence>
    </>
  );
}