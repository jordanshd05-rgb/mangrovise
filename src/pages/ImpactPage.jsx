import {
  TrendingUp,
  Info,
  Leaf,
  Sparkles,
  Users,
} from "lucide-react";

export default function ImpactPage({
    sliderItems,
    setSliderItems,
    setCurrentTab,
}) {
    return (
        <>
            <div className="mt-12 bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-sm border border-stone-200/80 space-y-12 text-left">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-ochre flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-accent-ochre" /> Simulasi Kontribusi Hijau Anda
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
                Eco-Impact Interactive Calculator
              </h2>
              <p className="text-sm text-stone-500">
                Gunakan slider di bawah untuk mensimulasikan jumlah pembelian produk Mangrovise Anda dan lihat seberapa besar dampak ekologi yang dapat kita hasilkan secara nyata!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
              {
                /* Left Column: Interactive Slider Control */
              }
              <div className="lg:col-span-5 bg-warm-bg p-8 rounded-3xl border border-stone-200/60 space-y-6">
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold text-accent-ochre uppercase tracking-wider block">Atur Jumlah Belanja</span>
                  <label htmlFor="impact-slider" className="text-lg font-bold text-stone-900 flex items-center justify-between">
                    <span>Jumlah Produk:</span>
                    <span className="font-mono text-2xl text-mangrove-deep font-extrabold">{sliderItems} <span className="text-xs font-sans text-stone-400 font-normal">Pack</span></span>
                  </label>
                </div>

                <div className="space-y-3">
                  <input
                    id="impact-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={sliderItems}
                    onChange={(e) => setSliderItems(Number(e.target.value))}
                    className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-accent-ochre"
                  />
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono font-bold">
                    <span>1 PACK</span>
                    <span>50 PACK</span>
                    <span>100 PACK</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-150 text-xs text-stone-600 leading-relaxed text-left space-y-1.5">
                  <span className="font-bold text-stone-850 block flex items-center gap-1">
                    <Info className="w-4 h-4 text-accent-ochre shrink-0" />
                    Informasi Estimasi Dampak:
                  </span>
                  <p>Metrik dihitung berdasarkan data rata-rata penyerapan karbon pohon bakau genus Avicennia/Sonneratia per tahun serta standar waktu pengerjaan yang adil bagi ibu pesisir.</p>
                </div>
              </div>

              {
                /* Right Column: Visual Metrics Counters */
              }
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {
                  /* Metric 1: Seedlings */
               }
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-left relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-accent-ochre/5 rounded-bl-full" />
                  <div className="bg-amber-50 text-accent-ochre p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                    <Leaf className="w-6 h-6 text-accent-ochre" />
                  </div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Bibit Ditanam</span>
                  <span className="block text-2xl sm:text-3xl font-mono font-bold text-mangrove-deep mt-1">
                    {sliderItems} <span className="text-xs font-sans text-stone-500 font-normal">Bibit</span>
                  </span>
                  <p className="text-[10px] text-stone-500 mt-2">Ditempatkan langsung pada zonasi pesisir Langsa terdampak abrasi.</p>
                </div>

                {
                  /* Metric 2: Carbon Absorption */
                }
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-left relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-mangrove-deep/5 rounded-bl-full" />
                  <div className="bg-mangrove-light text-mangrove-deep p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-mangrove-deep" />
                  </div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Serapan CO₂ / Tahun</span>
                  <span className="block text-2xl sm:text-3xl font-mono font-bold text-accent-ochre mt-1">
                    {(sliderItems * 21.8).toFixed(1)} <span className="text-xs font-sans text-stone-500 font-normal">Kg</span>
                  </span>
                  <p className="text-[10px] text-stone-500 mt-2">Membantu mempercepat dekarbonisasi udara di wilayah selat Aceh.</p>
                </div>

                {
                  /* Metric 3: Coastal Women wages */
                }
                <div className="bg-white p-6 rounded-2xl border border-stone-200 text-left relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-accent-ochre/5 rounded-bl-full" />
                  <div className="bg-amber-50 text-accent-ochre p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
                    <Users className="w-6 h-6 text-accent-ochre" />
                  </div>
                  <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Jam Kerja Adil</span>
                  <span className="block text-2xl sm:text-3xl font-mono font-bold text-stone-950 mt-1">
                    {(sliderItems * 0.5).toFixed(1)} <span className="text-xs font-sans text-stone-500 font-normal">Jam</span>
                  </span>
                  <p className="text-[10px] text-stone-500 mt-2">Menyokong upah kerja layak di atas rata-rata bagi nelayan setempat.</p>
                </div>

              </div>
            </div>

            <div className="border-t border-stone-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <h4 className="font-bold text-sm text-stone-900">Siap untuk Mulai Berkontribusi Sekarang?</h4>
                <p className="text-xs text-stone-500">Anda dapat memilih satu atau beberapa produk olahan mangrove asli di katalog utama kami.</p>
              </div>
              <button
                onClick={() => {
                  setCurrentTab("katalog");
                }}
                className="bg-accent-ochre hover:opacity-95 text-white font-bold text-xs py-3.5 px-6 rounded-xl transition-all shadow-md cursor-pointer"
            >
                Kembali ke Katalog
              </button>
            </div>
          </div>
        </>
    );
}