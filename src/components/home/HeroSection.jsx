import {
  Trees,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Leaf,
  Award,
} from "lucide-react";

export default function HeroSection({
  ASSET_CONFIG,
  handleTabChange,
}) {
  return (
    <>
      <div className="relative bg-mangrove-deep text-white pt-8 pb-16 md:pb-20 
      px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-[3.5rem] sm:rounded-b-[5rem] lg:rounded-b-[7rem] 
      shadow-2xl mt-0">
        {/* Background Decorative Organic Glows */}
        <div className="mt-32 absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="mt-32 absolute bottom-0 right-10 w-[400px] h-[400px] bg-accent-ochre/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero Main Content */}
        <div className="mt-32 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 px-4">
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-800/40 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full font-semibold border border-emerald-700/30">
              <Trees className="w-3.5 h-3.5 text-accent-ochre animate-pulse" />
              <span>Restorasi Mangrove Bersama Nelayan Langsa</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.1] tracking-tight">
              Kelezatan Otentik Pesisir Langsa yang <span className="text-accent-ochre">Menghidupkan Ekologi</span>
            </h1>
            
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Mangrovise menghadirkan produk pangan premium berbahan dasar buah mangrove pilihan dari hutan konservasi Kota Langsa, Aceh. Setiap gigitan dan tegukan Anda mengalirkan dukungan finansial langsung bagi ibu nelayan pesisir serta penanaman bibit mangrove baru.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => handleTabChange("katalog")}
                className="bg-accent-ochre hover:opacity-95 text-white text-sm font-bold px-8 py-4 rounded-xl shadow-lg shadow-accent-ochre/20 transition-all flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Jelajahi Produk Kami</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => handleTabChange("impact")}
                className="bg-white/10 hover:bg-white/15 border border-white/15 text-white text-sm font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-accent-ochre" />
                <span>Lihat Kalkulator Kontribusi</span>
              </button>
            </div>

            {/* Quick Micro-Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-lg">
              <div>
                <span className="block text-xl sm:text-2xl font-mono font-bold text-accent-ochre">100%</span>
                <span className="block text-xs text-stone-300">Bahan Alami Pilihan</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-mono font-bold text-accent-ochre">1.500+</span>
                <span className="block text-xs text-stone-300">Bibit Tersertifikasi</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-mono font-bold text-accent-ochre">5 Kelompok</span>
                <span className="block text-xs text-stone-300">Wanita Nelayan Mitra</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Visual Showcase with golden-organic accents */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">

              {/* Outer decorative circular frame */}
              <div className="absolute -inset-4 rounded-[2.5rem] border-2 border-dashed border-accent-ochre/30 animate-[spin_60s_linear_infinite] pointer-events-none" />
              
              <div className="relative bg-stone-900 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 aspect-[4/5]">
                <img
                    src={ASSET_CONFIG.heroBanner}
                    alt="Mangrovise Premium Organic Products Showcase"
                    className="w-full h-full object-cover brightness-95 hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                />
                
                {/* Embedded Glassmorphic badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-mangrove-deep/80 backdrop-blur-md border border-white/10 text-left space-y-1 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent-ochre animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest font-extrabold uppercase text-accent-ochre">Produk Unggulan</span>
                  </div>
                  <p className="text-xs text-stone-100 font-bold leading-snug">
                    Olahan pangan alami & sirup premium dari buah mangrove pilihan pesisir Langsa.
                  </p>
                </div>
              </div>

              {/* Float-badge 1: Micro-Impact */}
              <div className="absolute -top-6 -left-6 bg-white text-stone-900 p-3 rounded-2xl shadow-xl border border-stone-100 flex items-center space-x-2.5 z-10">
                <div className="w-8 h-8 bg-mangrove-light text-mangrove-deep rounded-xl flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase">1 Kemasan</span>
                  <span className="text-xs font-bold text-mangrove-deep">+1 Bibit Bakau</span>
                </div>
              </div>

              {/* Float-badge 2: Safe Halal Traditional */}
              <div className="absolute -bottom-6 -right-6 bg-white text-stone-900 p-3.5 rounded-2xl shadow-xl border border-stone-100 flex items-center space-x-2.5 z-10">
                <div className="w-8 h-8 bg-amber-50 text-accent-ochre rounded-xl flex items-center justify-center">
                  <Award className="w-4.5 h-4.5" />
                </div>
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-stone-400 font-bold uppercase">Kualitas</span>
                  <span className="text-xs font-bold text-stone-900">Higienis & Halal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





