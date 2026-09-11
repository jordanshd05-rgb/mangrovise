import {
  ShoppingCart,
  Search,
  Leaf,
  Sparkles,
  X,
  Info,
  ShieldCheck,
  Heart,
  Award,
  LayoutGrid,
  Cookie,
  Coffee,
  Eye,
  CircleCheckBig,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
export default function CatalogPage({
  searchQuery,
  setSearchQuery,

  selectedCategory,
  setSelectedCategory,

  selectedFlavor,
  setSelectedFlavor,

  filteredProducts,

  openProductDetail,
  handleAddToCart,
  handleInstantBuy,
  productsLoading,
  productsError,
}) {
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
      setVisibleCount(12);
    }, [searchQuery, selectedCategory, selectedFlavor]);

    const visibleProducts = filteredProducts.slice(0, visibleCount);
    return (
        <div className="mt-12 space-y-10">

            <div className="space-y-10">

            {/* Filter & Search Bar Row */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/80 space-y-6">
              {/* Top Row: Title, Subtitle, and Search Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-100">
                <div className="text-left space-y-1">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 tracking-tight">Katalog Hasil Olahan Lestari</h3>
                  <p className="text-xs text-stone-500">Pilih cita rasa mangrove otentik dan sumbangkan bibit bakau Anda.</p>
                </div>
                
                {/* Search Field */}
                <div className="relative w-full md:w-80 shrink-0">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cari sirup, dodol..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:border-accent-ochre focus:ring-1 focus:ring-accent-ochre/20 text-stone-800 transition-all"
                  />
                  {searchQuery && <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-950 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                }
                </div>
              </div>

              {/* Bottom Row: Filter Groups */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
                {/* Left Side: Category Filter Group */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider text-left shrink-0">Kategori Produk:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                       { name: "Semua", icon: <LayoutGrid className="w-3.5 h-3.5" /> },
                       { name: "Makanan", icon: <Cookie className="w-3.5 h-3.5" /> },
                       { name: "Minuman", icon: <Coffee className="w-3.5 h-3.5" /> }
                      ].map((cat) => <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat.name ? "bg-mangrove-deep text-white shadow-sm" : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
                      >
                        {cat.icon}
                        <span>{cat.name}</span>
                      </button>)}
                  </div>
                </div>

                {/* Right Side: Flavor Filter Group */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider text-left shrink-0">Profil Rasa:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                       { name: "Semua", icon: <Sparkles className="w-3.5 h-3.5" /> },
                       { name: "Manis", icon: <Heart className="w-3.5 h-3.5" /> },
                       { name: "Asam", icon: <Leaf className="w-3.5 h-3.5" /> },
                       { name: "Gurih", icon: <Award className="w-3.5 h-3.5" /> }
                      ].map((flav) => <button
                        key={flav.name}
                        onClick={() => setSelectedFlavor(flav.name)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedFlavor === flav.name ? "bg-stone-900 text-white shadow-sm" : "bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200"}`}
                      >
                        {flav.icon}
                        <span>{flav.name}</span>
                      </button>)}
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT SECTION */}
            <div className="space-y-10">

              {/* PRODUCTS CATALOG GRID */}
              <div className="space-y-8">
                {productsLoading ? <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-3 flex-1 flex flex-col items-center justify-center">
                    <p className="text-stone-500 font-semibold">Memuat produk seller...</p>
                  </div> : filteredProducts.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 space-y-3 flex-1 flex flex-col items-center justify-center">
                    <Info className="w-12 h-12 text-stone-300" />
                    <p className="text-stone-850 font-bold">Produk Tidak Ditemukan</p>
                    <p className="text-xs text-stone-500 max-w-sm">Maaf, kami tidak menemukan produk olahan mangrove dengan kriteria pencarian atau filter rasa tersebut.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory("Semua");
                        setSelectedFlavor("Semua");
                        setSearchQuery("");
                      }}
                      className="text-xs text-accent-ochre font-bold hover:underline cursor-pointer"
                    >
                      Reset Semua Filter
                    </button>
                  </div> : <div className=" grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-7">
                    {visibleProducts.map((product) => <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="bg-white rounded-[2rem] border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group"
                      >
                        {/* Image Showcase */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                          <img
                            src={product.imageUrl || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Rating badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-900 flex items-center space-x-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-accent-ochre" />
                            <span>Premium Quality</span>
                          </div>

                          {/* Conditional badge from user criteria ("Special Offer" or "Best Seller") */}
                          {product.badge && <div className="absolute top-3 right-3 bg-accent-ochre text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest shadow-md">
                              {product.badge}
                            </div>}

                          {/* Conservation contribution flag */}
                          <div className="absolute bottom-3 left-3 bg-mangrove-deep/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white flex items-center space-x-1.5 shadow-sm">
                            <Leaf className="w-3 h-3 text-accent-ochre animate-pulse" />
                            <span>🌿 +1 Bibit Mangrove</span>
                          </div>
                        </div>

                        {/* Content description */}
                        <div className="p-6 text-left flex-1 flex flex-col ">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
                              <span>{product.category}</span>
                              <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-mono">{(Array.isArray(product.flavor) ? product.flavor : [product.flavor]).join(", ") || "—"}</span>
                            </div>
                            <h4 className="font-serif font-bold text-[20px] text-stone-900 leading-tight group-hover:text-accent-ochre transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed min-h-[48px]">
                              {product.description}
                            </p>
                            <p className="text-[11px] font-semibold text-accent-ochre">
                              {product.storeName || "Toko Mangrovise"}
                            </p>
                              
                          </div>

                          <div
    className="
        mt-auto
        pt-5
        border-t
        border-stone-100
    "
>
                            <div className="space-y-4">

                              {/* Harga */}
                              <div>
                                  <span className="block text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                      Harga Lestari
                                  </span>

                                  <span className="font-mono font-bold text-2xl text-mangrove-deep">
                                      Rp {product.price.toLocaleString("id-ID")}
                                  </span>
                              </div>

                              {/* Button */}
                              <div className="hidden sm:grid grid-cols-[1fr_52px_1fr] gap-3">

                                  {/* Detail */}
                                  <button
                                      onClick={(e)=>{
                                          e.stopPropagation();
                                          openProductDetail(product);
                                      }}
                                      className="
                                          h-12
                                          border
                                          border-mangrove-deep
                                          rounded-xl
                                          text-mangrove-deep
                                          font-semibold
                                          hover:bg-mangrove-deep
                                          hover:text-white
                                          transition-all
                                      "
                                  >
                                      Lihat Detail
                                  </button>

                                  {/* Keranjang */}
                                  <button
                                      onClick={(e)=>{
                                          e.stopPropagation();
                                          handleAddToCart(product);
                                      }}
                                      className="
                                          h-12
                                          rounded-xl
                                          bg-stone-100
                                          border
                                          border-stone-200
                                          flex
                                          items-center
                                          justify-center
                                          hover:bg-stone-200
                                          transition-all
                                      "
                                  >
                                      <ShoppingCart className="w-5 h-5"/>
                                  </button>

                                  {/* Beli */}
                                  <button
                                      onClick={(e)=>{
                                          e.stopPropagation();
                                          handleInstantBuy(product);
                                      }}
                                      className="
                                          h-12
                                          rounded-xl
                                          bg-accent-ochre
                                          text-white
                                          font-bold
                                          hover:bg-accent-ochre/90
                                          transition-all
                                      "
                                  >
                                      Beli Sekarang
                                  </button>

                            </div>

                            {/* mobile */}
                            <div className="sm:hidden mt-3 flex items-center gap-3">      {/* <div className="xl:hidden mt-3 flex items-center gap-3"> */}

                              {/* Detail */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openProductDetail(product);
                                }}
                                className="w-12 h-12 shrink-0 bg-white border border-mangrove-deep rounded-xl flex items-center justify-center text-mangrove-deep hover:bg-mangrove-deep hover:text-white transition-all"
                                title="Lihat Detail"
                              >
                                <Eye className="w-5 h-5" />
                              </button>

                              {/* Keranjang */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product);
                                }}
                                className="w-12 h-12 shrink-0 bg-stone-100 border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-200 transition-all"
                                title="Tambah ke Keranjang"
                              >
                                <ShoppingCart className="w-5 h-5 text-stone-700" />
                              </button>

                              {/* Beli */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleInstantBuy(product);
                                }}
                                className="flex-1 h-12 bg-accent-ochre hover:bg-accent-ochre/90 text-white rounded-xl font-bold transition-all"
                              >
                                Beli Sekarang
                              </button>

                            </div>

                          </div>
                          </div>
                        </div>
                      </div>)}
                  </div>}
                  {productsError && <p className="text-center text-xs text-amber-700">{productsError}</p>}
                  {visibleCount < filteredProducts.length && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => setVisibleCount((count) => count + 12)}
                        className="rounded-xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white hover:bg-mangrove-deep/90"
                      >
                        Muat lebih banyak
                      </button>
                    </div>
                  )}
              </div>
            </div>

          </div>
          
        </div>
    );
}





