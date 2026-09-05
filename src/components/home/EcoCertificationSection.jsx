import {
  ShieldCheck,
  Leaf,
  Trees,
  BadgeCheck,
  Sprout,
} from "lucide-react";

export default function EcoCertificationSection() {
  return (
    <section className="py-0">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* =============================== */}
            {/* EKO SERTIFIKASI */}
            {/* =============================== */}

            {/* ============ Dekstop ============ */}
            <div className="hidden lg:block">
             <div className="mt-8 lg:rounded-[2.5rem] bg-white borde  border-stone-200
                shadow-sm overflow-hidden relative min-h-[220px] lg:min-h-[260px] flex items-center">
              <div className="grid lg:grid-cols-2 gap-8 items-center px-6 lg:px-12 py-7 lg:py-10">
                {/* Kiri */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-2">
                    <ShieldCheck className="w-5 h-5 text-accent-ochre"/>
                    <span
                      className="
                        text-sm
                        font-semibold
                        text-mangrove-deep
                      "
                    >
                      Eko-Sertifikasi
                    </span>
                  </div>
                  <h2 className="font-serif lg:text-[30px] text-mangrove-deep font-bold leading-tight whitespace-nowrap">
                    Bebas Bahan Kimia & 100% Organik
                  </h2>
                  <p className="lg:text-[14px] text-stone-600 leading-6">
                    Seluruh produk Mangrovise diproses dari buah mangrove pilihan yang dipanen secara lestari tanpa merusak ekosistem mangrove Kota Langsa. Setiap pembelian turut mendukung konservasi mangrove serta pemberdayaan UMKM lokal.
                  </p>
                </div>
                {/* Kanan */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-3 bg-stone-50 border
                        border-stone-200 rounded-2xl lg:p-4">
                      <Leaf className="w-6 h-6 text-emerald-400"/>
                      <div>
                        <p className="text-mangrove-deep font-semibold">
                          100% Organik
                        </p>
                        <span className="text-xs text-stone-400">
                          Tanpa bahan kimia
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <Trees className="w-5 h-5 text-emerald-400"/>
                      <div>
                        <p className="text-mangrove-deep font-semibold">
                          Restorasi Mangrove
                        </p>
                        <span className="text-xs text-stone-400">
                          Setiap pembelian berdampak
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <BadgeCheck className="w-5 h-5 text-accent-ochre"/>
                      <div>
                        <p className="text-mangrove-deep font-semibold">
                          UMKM Lokal
                        </p>
                        <span className="text-xs text-stone-400">
                          Produk asli Kota Langsa
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <Sprout className="w-5 h-5 text-sky-400"/>
                      <div>
                        <p className="text-mangrove-deep font-semibold">
                          Aman Dikonsumsi
                        </p>
                        <span className="text-xs text-stone-400">
                          Bahan baku berkualitas
                        </span>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
             </div> 
            </div>

            {/* ============ Mobile ============ */}
            <div className="block lg:hidden">
             <div className="mt-0 rounded-[2rem] bg-white border border-stone-200
                shadow-sm overflow-hidden relative min-h-[260px] flex items-center p-8">
              <div className="flex flex-col gap-4">
                {/* Kiri */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-orange-50 rounded-full px-4 py-1">
                    <ShieldCheck className="w-5 h-5 text-accent-ochre"/>
                    <span
                      className="
                        text-[13px]
                        font-semibold
                        text-mangrove-deep
                      "
                    >
                      Eko-Sertifikasi
                    </span>
                  </div>
                  <h2 className="font-serif text-[25px] text-mangrove-deep font-bold leading-tight whitespace-nowrap">
                    Bebas Bahan Kimia 
                    <br/>
                    & 100% Organik
                  </h2>
                  <p className="text-[13px]  text-stone-600 leading-6">
                    Seluruh produk Mangrovise diproses dari buah mangrove pilihan yang dipanen secara lestari tanpa merusak ekosistem mangrove Kota Langsa. Setiap pembelian turut mendukung konservasi mangrove serta pemberdayaan UMKM lokal.
                  </p>
                </div>
                {/* Kanan */}
                <div className="relative">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <BadgeCheck className="w-4 h-4 text-accent-ochre"/>
                      <div>
                        <p className="text-[13px] text-mangrove-deep font-semibold">
                          UMKM Lokal
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4">
                      <Leaf className="w-4 h-4 text-emerald-400"/>
                      <div>
                        <p className="text-[13px] text-mangrove-deep font-semibold">
                          100% Organik
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <Trees className="w-5 h-5 text-emerald-400"/>
                      <div>
                        <p className="text-[12px] text-mangrove-deep font-semibold">
                          Restorasi Mangrove
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50
                        border border-stone-200 rounded-2xl p-4 lg:p-4">
                      <Sprout className="w-5 h-5 text-sky-400"/>
                      <div>
                        <p className="text-[13px] text-mangrove-deep font-semibold">
                          Aman Dikonsumsi
                        </p>
                      </div>
                    </div>
                  </div>
                </div> 
              </div>
             </div>
            </div>

        </div>
    </section>
  );
}



