import {
  Leaf,
  CheckCircle2,
  QrCode,
  Clock,
  X,
  Check,
  Download,
  Printer
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function CheckoutModal({
    isCheckoutModalOpen,
    checkoutStatus,
    countdown,
    formatTimer,
    handleVerifyPayment,
    setIsCheckoutModalOpen,
    activeReceipt,
    cartTotal,
    ecoMetrics,
    renderAddressDetails,
    clearCart,
    discountAmount,
promoDiscount,
    finalTotal,
}) {

    const downloadInvoice = () => {
      if (!activeReceipt) return;

      const lines = [
        "GROVIESHOP ACEH",
        "EKO-INVOICE",
        `No. Invoice: ${activeReceipt.invoiceNo}`,
        `ID Transaksi: ${activeReceipt.transactionId}`,
        `Tanggal: ${activeReceipt.date}`,
        "Metode Pembayaran: QRIS Bank Aceh",
        "",
        "ITEM PESANAN",
        ...activeReceipt.items.map((item) =>
          `${item.product.name} x${item.quantity} - Rp ${(item.product.price * item.quantity).toLocaleString("id-ID")}`
        ),
        "",
        `Total Belanja: Rp ${activeReceipt.subtotal.toLocaleString("id-ID")}`,
        ...(activeReceipt.discount > 0
          ? [`Diskon Promo: - Rp ${activeReceipt.discount.toLocaleString("id-ID")}`]
          : []),
        `Total Pembayaran: Rp ${activeReceipt.total.toLocaleString("id-ID")}`,
        `Donasi Bibit: ${activeReceipt.ecoDonation} Bibit Bakau`,
        "",
        "Terima kasih atas kontribusi nyata Anda bagi kelestarian pesisir Aceh."
      ].join("\n");

      const invoiceFile = new Blob([lines], { type: "text/plain;charset=utf-8" });
      const downloadUrl = URL.createObjectURL(invoiceFile);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${activeReceipt.invoiceNo.replaceAll("/", "-")}.txt`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    };

    if (!isCheckoutModalOpen) return null;

    return(
        <>
          <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (checkoutStatus !== "verifying") setIsCheckoutModalOpen(false);
              }}
              className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-stone-100 flex flex-col"
            >
              
              {/* Modal Header */}
              <div className="bg-stone-50 p-6 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-stone-950 text-left">
                  <QrCode className="w-5 h-5 text-accent-ochre" />
                  <span className="font-serif font-bold text-base">Gerbang Pembayaran QRIS Lestari</span>
                </div>
                {checkoutStatus !== "verifying" && <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                }
              </div>

              {/* Modal Body: QRIS scan state */}
              {checkoutStatus === "pending" && <div className="p-6 text-center space-y-6">
                  
                  {/* QRIS Top indicators */}
                  <div className="space-y-2">
                    <p className="text-xs text-stone-500">Pindai kode QRIS di bawah menggunakan dompet digital pilihan Anda (Gopay, OVO, Dana, LinkAja, Mobile Banking).</p>
                    
                    <div className="bg-stone-50 py-2.5 px-4 rounded-xl inline-flex items-center justify-center space-x-2 border border-stone-200">
                      <Clock className="w-4 h-4 text-accent-ochre animate-pulse" />
                      <span className="text-xs font-mono font-bold text-stone-900">Masa Berlaku: {formatTimer(countdown)}</span>
                    </div>
                  </div>

                  {/* QR Code Graphic Frame */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-stone-200 max-w-[240px] mx-auto relative group">
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-accent-ochre" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-accent-ochre" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-accent-ochre" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-accent-ochre" />
                    
                    <div className="aspect-square bg-stone-50 flex items-center justify-center relative overflow-hidden rounded-xl">
                      {/* Embedded custom mock QR image overlaying with a brand center point */}
                      <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor" className="text-stone-950">
                        <rect x="5" y="5" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="10" width="10" height="10" />
                        <rect x="75" y="5" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="80" y="10" width="10" height="10" />
                        <rect x="5" y="75" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="4" />
                        <rect x="10" y="80" width="10" height="10" />
                        <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
                        <rect x="42" y="42" width="16" height="16" fill="currentColor" opacity="0.15" />
                        {/* Random QR points */}
                        <path d="M 30,10 H 40 V 15 H 30 Z M 50,5 H 60 V 10 H 50 Z M 70,30 H 75 V 40 H 70 Z M 10,35 H 20 V 45 H 10 Z M 85,60 H 95 V 70 H 85 Z M 45,75 H 55 V 80 H 45 Z M 75,85 H 85 V 95 H 75 Z" />
                        <circle cx="50" cy="50" r="8" className="text-accent-ochre" />
                      </svg>
                      {/* Center floating leaf logo */}
                      <div className="absolute inset-0 m-auto w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-md border border-stone-100">
                        <Leaf className="w-4.5 h-4.5 text-accent-ochre" />
                      </div>
                    </div>
                    <span className="block text-[10px] font-mono font-extrabold text-stone-400 mt-3 uppercase tracking-widest">NMID: ID1029108219</span>
                  </div>

                  {/* Pricing Overview */}
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-left space-y-2">

    <div className="flex justify-between text-xs">
        <span>Total Belanja</span>
        <span>
            Rp {cartTotal.toLocaleString("id-ID")}
        </span>
    </div>

    {promoDiscount > 0 && (
        <div className="flex justify-between text-xs text-green-600 font-semibold">
            <span>Diskon Promo ({promoDiscount}%)</span>
            <span>
                - Rp {discountAmount.toLocaleString("id-ID")}
            </span>
        </div>
    )}

    <div className="flex justify-between text-xs text-mangrove-deep font-bold">
        <span>Donasi Bibit</span>
        <span>+{ecoMetrics.seedlings} Bibit</span>
    </div>

    <div className="border-t pt-2 flex justify-between text-sm font-bold">

        <span>Total Dibayar</span>

        <span className="text-mangrove-deep">
            Rp {finalTotal.toLocaleString("id-ID")}
        </span>

    </div>

</div>

                  {/* Action button */}
                  <div className="pt-2">
                    <button
                      onClick={handleVerifyPayment}
                      className="w-full bg-mangrove-deep hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
                    >               
                      <Check className="w-4 h-4 text-accent-ochre" />
                      <span>Simulasi Konfirmasi Pembayaran Sukses</span>
                    </button>
                    <p className="text-[10px] text-stone-400 mt-2">Menekan tombol ini mensimulasikan notifikasi instan callback sukses dari Payment Gateway Bank Aceh.</p>
                  </div>

                </div>}

              {/* Modal Body: Verifying transition state */}
              {checkoutStatus === "verifying" && <div className="p-12 text-center space-y-6">
                  
                  {/* Dynamic spinner */}
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-stone-100 rounded-full" />
                    <div className="absolute inset-0 border-4 border-accent-ochre border-t-transparent rounded-full animate-spin" />
                    <QrCode className="w-8 h-8 text-accent-ochre absolute inset-0 m-auto animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-serif font-bold text-lg text-stone-900">Sedang Memverifikasi Pembayaran</h4>
                    <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                      Sedang memverifikasi transaksi melalui gateway Bank Aceh Syariah & QRIS Nasional secara real-time. Mohon tidak menutup jendela ini...
                    </p>
                  </div>

                </div>}

              {/* Modal Body: Invoice Receipt Success state */}
              {checkoutStatus === "success" && activeReceipt && <div className="p-6 text-center space-y-6 overflow-y-auto max-h-[75vh]">
                  
                  {/* Success Header Icon */}
                  <div className="space-y-2">
                    <div className="w-14 h-14 bg-mangrove-light text-mangrove-deep rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-8 h-8 text-mangrove-deep" />
                    </div>
                    <h4 className="font-serif font-bold text-2xl text-stone-950">Transaksi Berhasil!</h4>
                    <p className="text-xs text-stone-500">Invoice pembelian lestari Anda telah diterbitkan dengan nomor seri berikut.</p>
                  </div>

                  {/* Invoice Printable Sheet */}
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 text-left font-mono text-[11px] text-stone-700 space-y-4 relative overflow-hidden">
                    {/* Top watermark line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent-ochre" />
                    
                    {/* Invoice header info */}
                    <div className="flex justify-between items-start pb-3 border-b border-dashed border-stone-300">
                      <div>
                        <span className="font-bold text-stone-900 block">GROVIESHOP ACEH</span>
                        <span className="text-[9px] text-stone-400 block">Kota Langsa, Prov. Aceh, Indonesia</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-stone-900">EKO-INVOICE</span>
                        <span className="text-[9px] text-stone-400 block">{activeReceipt.invoiceNo}</span>
                      </div>
                    </div>

                    {
                      /* Invoice Transaction metadata */
                    }
                    <div className="grid grid-cols-2 gap-y-1 text-[10px]">
                      <div>ID Transaksi:</div>
                      <div className="text-right font-bold text-stone-900">{activeReceipt.transactionId}</div>
                      <div>Tanggal:</div>
                      <div className="text-right">{activeReceipt.date}</div>
                      <div>Metode Pembayaran:</div>
                      <div className="text-right">QRIS Bank Aceh</div>
                      <div>Status Eko-Dampak:</div>
                      <div className="text-right text-mangrove-deep font-bold">🌿 AKTIF</div>
                    </div>

                    {
                      /* Items table list */
                    }
                    <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-2">
                      <div className="grid grid-cols-12 font-bold text-stone-900">
                        <div className="col-span-6">Nama Barang</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-4 text-right">Subtotal</div>
                      </div>
                      {activeReceipt.items.map((item, i) => <div key={i} className="grid grid-cols-12 text-stone-600">
                          <div className="col-span-6 truncate">{item.product.name}</div>
                          <div className="col-span-2 text-center">x{item.quantity}</div>
                          <div className="col-span-4 text-right">Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}</div>
                        </div>)}
                    </div>

                    {
                      /* Summary Totals */
                    }
                    <div className="space-y-1.5 text-right text-[10px]">

    <div className="flex justify-between">
        <span>Total Belanja</span>
        <span>
            Rp {activeReceipt.subtotal.toLocaleString("id-ID")}
        </span>
    </div>

    {activeReceipt.discount > 0 && (

        <div className="flex justify-between text-green-600">

            <span>
                Diskon Promo ({activeReceipt.promo}%)
            </span>

            <span>
                - Rp {activeReceipt.discount.toLocaleString("id-ID")}
            </span>

        </div>

    )}

    <div className="flex justify-between">

        <span>Biaya Sertifikasi</span>

        <span>Rp 0</span>

    </div>

    <div className="flex justify-between text-xs font-bold pt-2">

        <span>Total Pembayaran</span>

        <span className="text-mangrove-deep">
            Rp {activeReceipt.total.toLocaleString("id-ID")}
        </span>

    </div>

</div>

                    {/* Alamat Pengiriman */}
                    <div className="border-t border-dashed border-stone-300 pt-3 text-[10px] text-left">
                      <span className="font-bold text-stone-900 block uppercase mb-1.5">Alamat Pengiriman:</span>
                      {renderAddressDetails(activeReceipt.alamat)}
                    </div>

                    {
                      /* Green ecological certification receipt details */
                    }
                    <div className="bg-mangrove-deep text-white p-3.5 rounded-xl border border-mangrove-deep text-left space-y-1.5 text-[10px]">
                      <span className="font-bold text-accent-ochre flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5 text-accent-ochre shrink-0" />
                        SERTIFIKASI DONASI MANDIRI:
                      </span>
                      <p className="leading-relaxed text-stone-200">
                        Atas nama pembeli, Mangrovise berkomitmen mengalokasikan pendanaan untuk penanaman sebanyak <strong className="text-white text-xs">{activeReceipt.ecoDonation} bibit bakau</strong> di muara pesisir Kuala Langsa. Estetika penyerapan emisi setara <strong className="text-white text-xs">{activeReceipt.carbonSaved} kg CO₂ / tahun</strong>.
                      </p>
                    </div>

                    <div className="text-center text-[8px] text-stone-400 pt-2">
                      Terima kasih atas kontribusi nyata Anda bagi kelestarian pesisir Aceh.
                    </div>
                  </div>

                  {
                    /* Action buttons */
                  }
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-850 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      Cetak Invoice
                    </button>
                    <button
                      onClick={downloadInvoice}
                      className="flex-1 bg-accent-ochre hover:opacity-90 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Unduh Invoice
                    </button>
                    <button
                      onClick={async () => {
                        if (clearCart) await clearCart();
                        setIsCheckoutModalOpen(false);
                      }}
                      className="flex-1 bg-mangrove-deep text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer"
                    >
                      Selesai & Tutup
                    </button>
                  </div>

                </div>}

            </motion.div>
          </div>
      </AnimatePresence>
    </>
    );
}