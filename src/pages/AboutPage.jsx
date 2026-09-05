import {
  Trees,
  Check,
  ArrowRight,
  Sprout,
  Handshake,
  ScrollText,
  Store,
  Fish,
  Waves,
  Gift,
} from "lucide-react";

export default function AboutPage({
  setCurrentTab,
}) {
  return (

    <>
     <div className="mt-12 bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-10 text-left">

{/* HERO */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:items-center">

  {/* Kiri */}
  <div className="flex flex-col justify-center space-y-5">

    {/* Subjudul */}
    <div className="flex items-center gap-2 text-accent-ochre">
      <Trees className="w-5 h-5" />
      <span className="text-sm font-bold uppercase tracking-wider">
        Cerita Di Balik Setiap Botol & Kemasan
      </span>
    </div>

    {/* Heading */}
    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight max-w-xl">
      Misi Konservasi Pesisir Langsa Melalui Produk Kreatif Agro-Marina
    </h2>

    {/* Isi */}
    <p className="text-base text-stone-600 leading-8 max-w-xl">
      Mangrovise didirikan di Kota Langsa, Provinsi Aceh, sebagai wadah inovasi
      sosial untuk menyelamatkan ekosistem pesisir dari ancaman abrasi parah.
      Kawasan muara dan pesisir Langsa menyimpan potensi luar biasa berupa
      hutan mangrove yang melimpah. Melalui hilirisasi produk pangan bernilai
      tambah tinggi, kami berupaya menghentikan penebangan pohon bakau liar
      dengan memberikan alternatif penghasilan baru yang jauh lebih
      menjanjikan bagi warga lokal.
    </p>

  </div>

  {/* Kanan */}
  <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-xl h-[420px]">
    <img
      src="/images/hutan.jpeg"
      alt="Hutan Mangrove Langsa"
      className="w-full h-full object-cover"
    />
  </div>

</div>

{/* ========================= MENGAPA MANGROVE ========================= */}
<div className="border-t border-stone-200 mt-4 pt-8">

  <div className="max-w-5xl mx-auto">

    {/* Subjudul */}
    <div className="flex items-center gap-2 text-accent-ochre mb-2">
      <Trees className="w-5 h-5" />
      <span className="text-sm font-bold uppercase tracking-widest">
        Mengapa Mangrove Penting?
      </span>
    </div>

    {/* Judul */}
    <h3 className="font-serif text-4xl font-bold text-stone-900 mb-6">
      Garda Depan Pelindung
      <br />
      Ekosistem Pesisir
    </h3>

    {/* Timeline */}
    <div className="relative border-l-2 border-green-200 ml-2 pl-6 space-y-6">

      {/* 1 */}
      <div className="relative">

        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-green-600 border-2 border-white"></div>

        <h4 className="font-semibold text-base text-stone-900 mb-1">
          Melindungi Wilayah Pesisir
        </h4>

        <p className="text-[15px] leading-7 text-stone-600 text-justify">
          Hutan mangrove menjaga garis pantai dari abrasi dan hempasan ombak,
          sekaligus menjadi habitat alami bagi ikan, kepiting, udang, dan
          berbagai jenis burung.
        </p>

      </div>

      {/* 2 */}
      <div className="relative">

        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-green-600 border-2 border-white"></div>

        <h4 className="font-semibold text-base text-stone-900 mb-1">
          Penyerap Karbon Alami
        </h4>

        <p className="text-[15px] leading-7 text-stone-600 text-justify">
          Mangrove mampu menyerap karbon jauh lebih tinggi dibandingkan hutan
          daratan sehingga membantu mengurangi dampak perubahan iklim.
        </p>

      </div>

      {/* 3 */}
      <div className="relative">

        <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-green-600 border-2 border-white"></div>

        <h4 className="font-semibold text-base text-stone-900 mb-1">
          Mangrovise Menjadi Solusi
        </h4>

        <p className="text-[15px] leading-7 text-stone-600 text-justify">
          Melalui pengolahan buah mangrove menjadi produk bernilai ekonomi,
          masyarakat memperoleh penghasilan tanpa merusak kelestarian hutan.
        </p>

      </div>

    </div>

    {/* Tombol */}
<div className="mt-6">
  <button
    type="button"
    onClick={() => {
    setCurrentTab("impact");
    window.scrollTo({
        top: 0,
        behavior: "instant",
    });
}}
    className="inline-flex items-center gap-2 rounded-xl border border-accent-ochre px-6 py-3 text-accent-ochre font-semibold hover:bg-accent-ochre hover:text-white transition"
  >
    Kunjungi Halaman Kalkulator Dampak
    <ArrowRight className="w-4 h-4" />
  </button>
</div>

  </div>

</div>

{/* ========================= MENGHUBUNGKAN KONSUMEN ========================= */}
<div className="border-t border-stone-100 mt-8 pt-8">

  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">

    {/* ================= LEFT ================= */}
    <div>

      {/* Subjudul */}
      <div className="flex items-center gap-2 text-accent-ochre mb-3">
        <Trees className="w-5 h-5" />
        <span className="text-sm font-bold uppercase tracking-wider">
          Menghubungkan Konsumen dengan Alam
        </span>
      </div>

      {/* Judul */}
      <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 leading-tight mb-6">
        Setiap Pembelian Menjadi Kontribusi Nyata
      </h3>

      {/* Isi */}
      <div className="space-y-6">

        <p
          className="text-lg leading-9 text-stone-600"
          style={{
            textAlign: "justify",
            textIndent: "2em",
          }}
        >
          Banyak orang ingin membantu melestarikan alam, namun tidak selalu
          mengetahui bagaimana cara memberikan kontribusi yang nyata.
          Mangrovise menghadirkan cara sederhana untuk ikut menjaga
          kelestarian lingkungan melalui aktivitas belanja sehari-hari.
          Setiap produk yang dipilih menjadi bentuk dukungan terhadap
          pelestarian ekosistem mangrove sekaligus pemberdayaan masyarakat
          pesisir Kota Langsa.
        </p>

        <p
          className="text-lg leading-9 text-stone-600"
          style={{
            textAlign: "justify",
            textIndent: "2em",
          }}
        >
          Melalui konsep <strong>1 Kemasan = 1 Bibit Bakau</strong>, setiap
          pembelian turut mendukung pembibitan dan penanaman mangrove bersama
          Kelompok Wanita Nelayan <strong>Sari Mangrove</strong>. Dengan
          demikian, setiap konsumen ikut berkontribusi menjaga lingkungan
          melalui pilihan belanja yang sederhana namun bermakna.
        </p>

      </div>

    </div>

    {/* ================= RIGHT ================= */}
    <div className="space-y-3 lg:mt-[118px]">

      {/* Card 1 */}
      <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <Sprout className="w-5 h-5 text-green-700" />
        </div>

        <div>
          <h4 className="font-semibold text-stone-900">
            1 Kemasan = 1 Bibit Bakau
          </h4>

          <p className="text-sm text-stone-600 leading-6 mt-1">
            Mendukung pembibitan dan penanaman mangrove di kawasan pesisir
            Langsa.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Handshake className="w-5 h-5 text-amber-700" />
        </div>

        <div>
          <h4 className="font-semibold text-stone-900">
            Kemitraan Berkelanjutan
          </h4>

          <p className="text-sm text-stone-600 leading-6 mt-1">
            Bermitra dengan Kelompok Wanita Nelayan
            <strong> Sari Mangrove</strong> dalam menghasilkan produk secara
            higienis.
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex items-start gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <ScrollText className="w-5 h-5 text-orange-700" />
        </div>

        <div>
          <h4 className="font-semibold text-stone-900">
            Transparansi Dampak
          </h4>

          <p className="text-sm text-stone-600 leading-6 mt-1">
            Sertifikat digital mencatat kontribusi setiap pembelian secara
            transparan.
          </p>
        </div>
      </div>

    </div>

  </div>



 {/* PRODUK */}
<div className="border-t border-stone-100 mt-12 pt-10">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

    {/* Foto */}
    <div className="rounded-[2rem] overflow-hidden shadow-xl border border-stone-200">
      <img
        src="/images/Utama.jpeg"
        alt="Produk Mangrovise"
        className="w-full h-[460px] object-cover"
      />
    </div>

    {/* Konten */}
    <div className="max-w-xl">

      {/* Subjudul */}
<div className="flex items-center gap-2 text-accent-ochre mb-4">
  <Trees className="w-5 h-5" />
  <span className="text-sm font-bold uppercase tracking-[0.18em]">
    Produk Unggulan Mangrovise
  </span>
</div>

      {/* Judul */}
<h3 className="font-serif font-bold text-4xl text-stone-900 leading-tight mb-3">
  Dari Buah Mangrove Menjadi Produk Bernilai
</h3>

{/* Paragraf */}
<p className="text-[17px] leading-8 text-stone-600 text-justify indent-8">
  Buah mangrove jenis pedada yang selama ini sering terbuang percuma, kami
  olah menjadi produk pangan bercita rasa khas seperti sirup, dodol, selai,
  kerupuk, hingga camilan lezat lainnya. Seluruh proses dilakukan secara
  higienis oleh tangan-tangan terampil Kelompok Wanita Nelayan{" "}
  <strong>Sari Mangrove</strong>, sehingga resep tradisional tetap terjaga
  sekaligus membuka peluang ekonomi baru bagi masyarakat Kuala Langsa.
</p>
      {/* Highlight */}
      <div className="mt-5 flex flex-wrap gap-3">

        <div className="px-2 py-2 rounded-full bg-green-50 text-green-700 font-medium text-sm">
          🌿 100% Olahan Mangrove
        </div>

        <div className="px-2 py-2 rounded-full bg-orange-50 text-orange-700 font-medium text-sm">
          🏡 Diproduksi UMKM Lokal
        </div>

        <div className="px-2 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
          ♻️ Mendukung Restorasi Pesisir
        </div>

      </div>

    </div>

  </div>

</div>

{/* DAMPAK */}
<div className="border-t border-stone-100 mt-10 pt-8">

  <h3 className="font-serif font-bold text-3xl text-center text-stone-900 mb-3">
    Dampak yang Kami Bangun Bersama
  </h3>

  <p className="text-center text-stone-600 max-w-3xl mx-auto leading-8 mb-10">
    Setiap pembelian produk Mangrovise memberikan manfaat nyata bagi lingkungan
    sekaligus meningkatkan kesejahteraan masyarakat pesisir Kuala Langsa.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="border border-stone-200 rounded-3xl p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-5">
  <Store className="w-7 h-7 text-green-700" />
</div>
      <h4 className="font-semibold mb-2">UMKM Lokal</h4>
      <p className="text-xs text-stone-600">
        Mendukung perekonomian masyarakat Kuala Langsa.
      </p>
    </div>

    <div className="border border-stone-200 rounded-3xl p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center mx-auto mb-5">
  <Fish className="w-7 h-7 text-sky-700" />
</div>
      <h4 className="font-semibold mb-2">Habitat Pesisir</h4>
      <p className="text-xs text-stone-600">
        Membantu menjaga habitat ikan, udang, kepiting, dan burung.
      </p>
    </div>

    <div className="border border-stone-200 rounded-3xl p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mx-auto mb-5">
  <Waves className="w-7 h-7 text-cyan-700" />
</div>
      <h4 className="font-semibold mb-2">Mengurangi Abrasi</h4>
      <p className="text-xs text-stone-600">
        Mendukung pelestarian kawasan pesisir Langsa.
      </p>
    </div>

    <div className="border border-stone-200 rounded-3xl p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-5">
  <Gift className="w-7 h-7 text-amber-700" />
</div>
      <h4 className="font-semibold mb-2">Produk Khas Aceh</h4>
      <p className="text-xs text-stone-600">
        Memperkenalkan mangrove sebagai identitas wisata Langsa.
      </p>
    </div>
  </div>

</div>

{/* CTA */}
<div className="mt-12 rounded-[2rem] bg-mangrove-deep text-white text-center py-14 px-8">

  <h3 className="font-serif text-3xl font-bold mb-4">
    Ayo Jadi Bagian dari Perubahan
  </h3>

  <p className="max-w-2xl mx-auto text-white/90 leading-8 mb-8">
    Setiap botol dan kemasan yang Anda pilih adalah langkah nyata menjaga
    pesisir Langsa untuk generasi mendatang.
  </p>

  <button
    onClick={() => {
    setCurrentTab("katalog");
    window.scrollTo({
        top: 0,
        behavior: "instant",
    });
}}
    className="bg-white text-mangrove-deep px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
  >
    Jelajahi Produk Kami →
  </button>

</div>

</div>
          </div>
    </>
  );
}
