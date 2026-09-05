import { useState, useEffect } from "react";
import {
  X,
  ShoppingCart,
  Minus,
  Plus,
  Leaf,
  Star,
  Package,
  MapPin,
  Clock,
  Scale,
  ShieldCheck,
  CircleCheckBig,
  TriangleAlert,
  Hammer,
  StarHalf
} from "lucide-react";

export default function ProductDetailModal({
  show,
  product,
  products,
  onClose,
  onAddToCart,
  onBuyNow,
  onChangeProduct
}) {

  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if(product){
      setSelectedImage(product.gallery?.[0] || product.image);
      setQuantity(1);
    }
  }, [product]);

  if (!show || !product) return null;

  console.log("PRODUCT MODAL:", product);

  const totalPrice = product.price * quantity;
  const totalTrees = quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto lg:flex lg:items-center lg:justify-center">
      <div
        className="
          bg-white
          w-full
          lg:max-w-[900px]

          min-h-screen
          lg:min-h-0
          lg:h-[88vh]

          lg:my-6

          rounded-none
          lg:rounded-[28px]

          shadow-2xl
          overflow-hidden
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-[47%_53%] h-full">
          {/* ================= LEFT ================= */}
          <div
            className="
              relative
              bg-stone-100
              p-4
              lg:p-5
              flex
              flex-col
            "
          >
            {/* Tombol Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 bg-white w-10 h-10 rounded-full shadow hover:bg-red-50 transition"
            >
              <X className="w-5 h-5 mx-auto text-red-500" />
            </button>
            {/* Gambar Besar */}
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="
                w-full
                h-[300px]
                sm:h-[360px]
                lg:h-[455px]
                object-cover
                rounded-3xl
              "
            />
            {/* Thumbnail (Desktop Only) */}
            <div className="hidden lg:grid grid-cols-4 gap-3 mt-5">
              {product.gallery?.filter((image) => image).map((image, index) => {
                const clickedProduct = products?.find(
                  (p) => p.image === image
                );
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (clickedProduct) {
                        onChangeProduct(clickedProduct);
                      }
                    }}
                    className={`
                      rounded-2xl
                      overflow-hidden
                      border-2
                      transition-all
                      ${
                        selectedImage === image
                          ? "border-mangrove-deep"
                          : "border-transparent hover:border-stone-300"
                      }
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-18 object-cover rounded-xl"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          {/* ================= RIGHT ================= */}
          <div
            className="p-5 lg:p-6 flex flex-col lg:h-full lg:overflow-y-auto"
          >
            <div className="flex flex-wrap items-center gap-3">
              {product.badge && (
                <span className="bg-accent-ochre text-white px-3 py-1 rounded-full text-xs font-bold">
                {product.badge}
                </span>
              )}
              {product.preorder ? (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    border
                    border-sky-200
                    bg-sky-50
                    shadow-sm
                  "
                >
                  <Hammer
                    className="
                      w-4
                      h-4
                      text-sky-600
                    "
                  />
                  <span
                    className="
                      text-xs
                      font-semibold
                      text-sky-700
                    "
                  >
                    Produksi Sesuai Pesanan
                  </span>
                </div>
                ) : product.stock <= 10 ? (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1
                      rounded-full
                      border
                      border-amber-200
                      bg-amber-50
                      shadow-sm
                    "
                  >
                    <TriangleAlert
                      className="
                        w-4
                        h-4
                        text-amber-600
                      "
                    />
                    <span
                      className="
                        text-xs
                        font-semibold
                        text-amber-700
                      "
                    >
                      Stok Terbatas
                    </span>
                  </div>
                ) : (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-3
                      py-1
                      rounded-full
                      border
                      border-emerald-200
                      bg-emerald-50
                      shadow-sm
                    "
                  >
                    <CircleCheckBig
                      className="
                        w-4
                        h-4
                        text-emerald-600
                      "
                    />
                    <span
                      className="
                        text-xs
                        font-semibold
                        text-emerald-700
                      "
                    >
                      Siap Dikirim
                    </span>
                  </div>
                )}
              </div>
              <h1 className="text-[25px] sm:text-[26px] lg:text-[30px] font-bold mt-3 leading-tight">
                {product.name}
              </h1>
              <div className="mt-3 space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i=>(
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-stone-700">
                    4.9
                  </span>
                </div>
                <p className="text-sm text-stone-500">
                  250+ Terjual • 120 Review
                </p>
              </div>  
              <div className="mt-3">
                <h2 className="text-[25px] font-black tracking-tight text-mangrove-deep">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </h2>
                {quantity > 1 && (
                  <p className="text-sm text-stone-500 mt-1">
                    {quantity} × Rp {product.price.toLocaleString("id-ID")}
                  </p>
                )}
              </div>
              <p className="text-[15px] text-stone-600 leading-6 mt-3">
                {product.description}
              </p>
              <hr className="my-2 border-stone-200"/>
              <div className="grid grid grid-cols-2 gap-2 lg:gap-3 gap-2 mt-4">
                <div className="bg-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Kemasan</span>
                  </div>
                  <p className="text-[13px] font-bold text-lg mt-2">
                    {product.packageSize}
                  </p>
                </div>
                <div className="bg-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Berat</span>
                  </div>
                  <p className="text-[13px] font-bold text-lg mt-2">
                    {product.weight}
                  </p>
                </div>
                <div className="bg-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Masa Simpan</span>
                  </div>
                  <p className="text-[13px] font-bold text-lg mt-2">
                    {product.shelfLife}
                  </p>
                </div>
                <div className="bg-stone-100 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Asal Produk</span>
                  </div>
                  <p className="text-[13px] font-bold text-lg mt-2">
                    {product.origin}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-3 flex items-start gap-3">
                <Leaf className="w-5 h-5 text-green-600 shrink-0"/>
                <div>
                  <p className="text-[13px] font-bold text-green-700">
                    Kontribusi Lingkungan
                  </p>
                  <p className="text-[11px] text-sm text-green-700 mt-1 leading-3.5">
                    Setiap pembelian ini membantu penanaman
                    <strong>
                      {" "}
                      {totalTrees} bibit mangrove
                      {" "}
                    </strong>
                    di kawasan pesisir Kota Langsa.
                  </p>
                </div>
              </div>
            {/* Quantity */}
              <div className="mt-4 lg:mt-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-stone-800">
                    Jumlah
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Pilih jumlah produk
                  </p>
              </div>
              <div className="flex items-center bg-stone-100 rounded-2xl overflow-hidden">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-200 transition"
                >
                  <Minus className="w-4 h-4"/>
                </button>
                <span className="w-14 text-center text-[13px] font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-stone-200 transition"
                >
                  <Plus className="w-4 h-4"/>
                </button>
              </div>
            </div>
            {/* Informasi stok */}
            <div className={`mt-2 flex items-center gap-2 text-xs ${
              product.stock <= 10
              ? "text-amber-600"
              : "text-emerald-600"
             }`}>
              <Package className="w-4 h-4" />
              <span>
                {product.stock <= 10 ? (
                  <>
                    Tersisa <strong>{product.stock}</strong> produk
                  </>
                ) : (
                  <>
                    Stok tersedia <strong>{product.stock}</strong> produk
                  </>
                )}
              </span>
            </div>
            <div className="mt-5 rounded-2xl bg-mangrove-deep text-white p-4">
              <div className="flex justify-between text-sm">
                <span>Jumlah Produk</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span>Harga Satuan</span>
                <span>Rp {product.price.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t border-white/20 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">
                  Total Pembayaran
                </span>
                <span className="text-[17px] font-black">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <div className=" z-20 bg-white/95 pt-4 mt-5 grid grid-cols-2 gap-3">
              {/* Keranjang */}
              <button
                onClick={() => {
                  for(let i=0;i<quantity;i++){
                    onAddToCart(product);
                }
                  onClose();
                }}
                className="border-2 border-mangrove-deep rounded-3xl py-1.5 text-[14px] font-bold text-mangrove-deep hover:bg-mangrove-deep hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5"/>
                Keranjang
              </button>
              {/* Beli */}
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onBuyNow(product);
                  }
                  onClose();
                }}
                className="
                  bg-accent-ochre
                  rounded-3xl
                  py-2.5
                  text-white
                  font-bold
                  hover:scale-[1.02]
                  transition-all
                  shadow-lg
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >
                <span className="text-lg">⚡</span>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[14px] font-bold">
                    Beli Sekarang
                  </span>
                  <span className="text-[11px] text-white/80 font-medium">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </button>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-200">
              <div className="grid grid-cols-3 gap-3 items-stretch">
                <div className="flex flex-col items-center text-center">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-green-50 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="mt-2 h-8 flex items-center justify-center">
                      <p className="text-[10px] font-semibold text-stone-700 leading-tight">
                        Produk 100% Alami
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-emerald-50 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="mt-2 h-8 flex items-center justify-center">
                      <p className="text-[10px] font-semibold text-stone-700 leading-tight">
                        Tanpa Pengawet
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-teal-50 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="mt-2 h-8 flex items-center justify-center">
                      <p className="text-[10px] font-semibold text-stone-700 leading-tight">
                        Diproses Higienis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}