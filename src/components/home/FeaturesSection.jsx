import {
  CheckCircle2,
  Leaf,
  Users,
  Award,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="m-w-7xl mx-auto pt-0 pb-0 lg:pt-6 lg:pb-0 px-0 sm:px-6 lg:px-8 text-center relative z-20">
      {/* 4. "3 ALASAN MEMILIH GROVIESHOP" MACRO FEATURES ROW */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center -mt-8 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-stone-200/50 space-y-8">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-ochre flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-accent-ochre" /> Nilai Tambah Ekologis & Sosial
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-950 tracking-tight">
              3 Pilar Keberlanjutan Mangrovise
            </h2>
            <p className="text-sm text-stone-500">
              Setiap rupiah yang Anda belanjakan dirancang untuk memberikan dampak positif berkelanjutan bagi lingkungan pesisir dan masyarakat sekitar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {
    /* Feature 1 */
  }
            <div className="bg-warm-bg/60 p-8 rounded-3xl border border-stone-200/50 hover:border-accent-ochre/30 transition-all group hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-ochre/5 rounded-bl-full pointer-events-none" />
              <div className="bg-amber-100 text-accent-ochre p-4 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Leaf className="w-7 h-7 text-accent-ochre" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-3">Konservasi Nyata</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Setiap kemasan produk olahan mangrove yang terjual langsung menyisihkan dana untuk pengadaan dan penanaman 1 bibit pohon bakau baru di daerah rawan abrasi Kota Langsa.
              </p>
            </div>

            {
    /* Feature 2 */
  }
            <div className="bg-warm-bg/60 p-8 rounded-3xl border border-stone-200/50 hover:border-accent-ochre/30 transition-all group hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-mangrove-deep/5 rounded-bl-full pointer-events-none" />
              <div className="bg-mangrove-light text-mangrove-deep p-4 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-mangrove-deep" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-3">Pemberdayaan Wanita</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kami bekerja sama erat dengan kelompok koperasi wanita pesisir nelayan tradisional Langsa, menjamin kedaulatan ekonomi mereka melalui upah kerja yang adil dan berkelanjutan.
              </p>
            </div>

            {
    /* Feature 3 */
  }
            <div className="bg-warm-bg/60 p-8 rounded-3xl border border-stone-200/50 hover:border-accent-ochre/30 transition-all group hover:shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-ochre/5 rounded-bl-full pointer-events-none" />
              <div className="bg-amber-100 text-accent-ochre p-4 rounded-2xl w-14 h-14 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-accent-ochre" />
              </div>
              <h3 className="font-serif font-bold text-xl text-stone-900 mb-3">Kualitas Pangan Premium</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Menggunakan ekstraksi buah mangrove alami bebas pestisida, diproses secara modern dan higienis yang memenuhi standar keamanan pangan untuk cita rasa segar orisinal.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}