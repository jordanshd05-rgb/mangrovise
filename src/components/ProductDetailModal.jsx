import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
  MessageCircle,
  Trash2,
  Camera,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { calculateMultiImpact } from "../constants/impactMetrics.js";
import { addReview, deleteReview, listenToReviews } from "../services/reviewService.js";
import ChatDrawer from "./ChatDrawer";

function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ratio = Math.min(1, maxWidth / img.width);
        canvas.width = Math.max(1, Math.round(img.width * ratio));
        canvas.height = Math.max(1, Math.round(img.height * ratio));

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };

      img.onerror = () => reject(new Error("Gagal membaca gambar untuk kompresi."));
      img.src = String(reader.result || "");
    };

    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

export default function ProductDetailModal({
  show,
  product,
  products,
  onClose,
  onAddToCart,
  onBuyNow,
  onChangeProduct,
  onRequireLogin,
  triggerToast,
}) {

  const { firebaseUser: user } = useAuth();
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState("");
  const [reviewPhotoName, setReviewPhotoName] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if(product){
      setSelectedImage(product.gallery?.[0] || product.image);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    if (!product?.id && !product?.productId) return undefined;

    const productId = String(product.id || product.productId);
    const unsubscribe = listenToReviews(productId, (nextReviews) => {
      setReviews(nextReviews);
    });

    return () => unsubscribe();
  }, [product?.id, product?.productId]);

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setReviewPhoto("");
      setReviewPhotoName("");
      return;
    }

    try {
      const compressed = await compressImage(file, 800, 0.7);
      setReviewPhoto(compressed);
      setReviewPhotoName(file.name || "review-photo");
    } catch (error) {
      console.error("Error compressing review image:", error);
      setReviewPhoto("");
      setReviewPhotoName("");
      triggerToast?.("Gagal memproses foto ulasan. Silakan coba foto lain.", "error");
    }
  };

  const handleSubmitReview = async () => {
    if (!user?.uid) {
      triggerToast?.("Silakan login terlebih dahulu untuk menulis ulasan.", "info");
      onRequireLogin?.();
      return;
    }

    if (!reviewComment.trim()) {
      triggerToast?.("Komentar ulasan tidak boleh kosong.", "info");
      return;
    }

    setIsSubmittingReview(true);

    try {
      await addReview(String(product.id || product.productId), {
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "Pengguna",
        rating: reviewRating,
        comment: reviewComment.trim(),
        photoBase64: reviewPhoto,
      });

      setReviewRating(5);
      setReviewComment("");
      setReviewPhoto("");
      setReviewPhotoName("");
      triggerToast?.("Ulasan berhasil dikirim.", "success");
    } catch (error) {
      console.error("Error adding review:", error);
      triggerToast?.("Gagal mengirim ulasan.", "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const productId = String(product.id || product.productId);
    if (!productId || !reviewId) return;

    try {
      await deleteReview(productId, reviewId);
      triggerToast?.("Ulasan berhasil dihapus.", "success");
    } catch (error) {
      console.error("Error deleting review:", error);
      triggerToast?.("Gagal menghapus ulasan.", "error");
    }
  };

  if (!show || !product) return null;

  const totalPrice = product.price * quantity;
  const totalTrees = quantity;
  const impactSummary = calculateMultiImpact(quantity);
  const fallbackText = (value, fallback) => (value && String(value).trim()) ? value : fallback;
  const kemasan = fallbackText(product.kemasan ?? product.packageSize, "1 pcs");
  const berat = fallbackText(product.berat ?? product.weight, "Belum diisi");
  const masaSimpan = fallbackText(product.masaSimpan ?? product.shelfLife, "Belum diisi");
  const asalProduk = fallbackText(product.asalProduk ?? product.origin, "Kota Langsa");

  const safeProduct = {
    ...product,
    id: product.id || product.productId || product.slug || "product-default",
    sellerId: product.sellerId || product.userId || "admin-seller",
  };

  const seller = {
    uid: safeProduct.sellerId,
    id: safeProduct.sellerId,
    name: product.storeName || "Seller",
    storeName: product.storeName || "Seller",
  };

  const handleChatClick = () => {
    if (!user?.uid) {
      triggerToast?.("Silakan login terlebih dahulu untuk mengirim pesan", "info");
      onRequireLogin?.();
      return;
    }

    setIsChatOpen(true);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[99998] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="
            relative
            z-[99999]
            w-full
            max-w-4xl
            max-h-[90vh]
            bg-white
            rounded-2xl
            shadow-2xl
            overflow-y-auto
            my-auto
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
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 z-10 cursor-pointer bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full shadow-lg ring-1 ring-black/5 hover:bg-red-50 transition"
                aria-label="Tutup produk"
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
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4 lg:gap-3">
                <div className="rounded-xl bg-stone-100 p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Kemasan</span>
                  </div>
                  <p className="mt-2 text-[13px] font-bold text-lg">
                    {kemasan}
                  </p>
                </div>
                <div className="rounded-xl bg-stone-100 p-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Berat</span>
                  </div>
                  <p className="mt-2 text-[13px] font-bold text-lg">
                    {berat}
                  </p>
                </div>
                <div className="rounded-xl bg-stone-100 p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Masa Simpan</span>
                  </div>
                  <p className="mt-2 text-[13px] font-bold text-lg">
                    {masaSimpan}
                  </p>
                </div>
                <div className="rounded-xl bg-stone-100 p-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-mangrove-deep shrink-0" />
                    <span className="text-xs text-stone-500 font-medium">Asal Produk</span>
                  </div>
                  <p className="mt-2 text-[13px] font-bold text-lg">
                    {asalProduk}
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

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Leaf className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Karbon</span>
                  </div>
                  <p className="mt-2 text-lg font-black text-mangrove-deep">
                    {impactSummary.co2Kg.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-stone-600">kg CO2</p>
                </div>

                <div className="rounded-2xl border border-sky-100 bg-sky-50 p-3">
                  <div className="flex items-center gap-2 text-sky-700">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Pantai</span>
                  </div>
                  <p className="mt-2 text-lg font-black text-mangrove-deep">
                    {impactSummary.coastalMeter.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-stone-600">Meter</p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Scale className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Habitat</span>
                  </div>
                  <p className="mt-2 text-lg font-black text-mangrove-deep">
                    {impactSummary.habitatSqM.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-stone-600">m²</p>
                </div>

                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3">
                  <div className="flex items-center gap-2 text-cyan-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Spesies</span>
                  </div>
                  <p className="mt-2 text-lg font-black text-mangrove-deep">
                    {impactSummary.speciesEstimate.toLocaleString("id-ID")}
                  </p>
                  <p className="text-[10px] text-stone-600">Spesies</p>
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
            <div className="z-20 mt-5 grid grid-cols-1 gap-3 bg-white/95 pt-4 sm:grid-cols-2">
              <button
                onClick={handleChatClick}
                className="flex items-center justify-center gap-2 rounded-3xl border-2 border-sky-500 py-2.5 text-[14px] font-bold text-sky-600 transition-all hover:bg-sky-500 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Chat Seller
              </button>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onAddToCart(product);
                  }
                  onClose();
                }}
                className="flex items-center justify-center gap-2 rounded-3xl border-2 border-mangrove-deep py-2.5 text-[14px] font-bold text-mangrove-deep transition-all hover:bg-mangrove-deep hover:text-white"
              >
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </button>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    onBuyNow(product);
                  }
                  onClose();
                }}
                className="
                  col-span-1
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-3xl
                  bg-accent-ochre
                  py-2.5
                  text-white
                  font-bold
                  shadow-lg
                  transition-all
                  hover:scale-[1.02]
                  sm:col-span-2
                "
              >
                <span className="text-lg">⚡</span>
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[14px] font-bold">Beli Sekarang</span>
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

            <div className="mt-6 border-t border-stone-200 pt-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-bold text-stone-900">Ulasan Produk</h3>
                <span className="text-xs font-semibold text-stone-500">{reviews.length} review</span>
              </div>

              <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <label className="block text-sm font-semibold text-stone-800">Rating</label>
                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition"
                      aria-label={`Beri rating ${star} bintang`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating ? "fill-amber-400 text-amber-400" : "text-stone-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <label className="mt-4 block text-sm font-semibold text-stone-800">Komentar</label>
                <textarea
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                  rows={4}
                  placeholder="Bagikan pengalaman Anda terhadap produk ini..."
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none ring-0 transition focus:border-mangrove-deep"
                />

                <label className="mt-4 block text-sm font-semibold text-stone-800">Foto (opsional)</label>
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
                    <Camera className="h-4 w-4" />
                    Pilih Foto
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                  {reviewPhotoName && (
                    <span className="truncate text-xs text-stone-500">{reviewPhotoName}</span>
                  )}
                </div>

                {reviewPhoto && (
                  <div className="mt-3 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2">
                    <img src={reviewPhoto} alt="Preview review" className="h-36 w-full rounded-xl object-cover" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={!user || isSubmittingReview}
                  className="mt-4 w-full rounded-2xl bg-mangrove-deep px-4 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isSubmittingReview ? "Mengirim..." : user ? "Kirim Ulasan" : "Login untuk Memberi Ulasan"}
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-center text-sm text-stone-500">
                    Belum ada ulasan untuk produk ini.
                  </div>
                ) : (
                  reviews.map((review) => {
                    const reviewDate = review.createdAt?.seconds
                      ? new Date(review.createdAt.seconds * 1000).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Baru saja";

                    const isOwner = user?.uid && review.userId === user.uid;

                    return (
                      <div key={review.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-stone-900">{review.userName || "Pengguna"}</p>
                            <div className="mt-1 flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= Number(review.rating || 0)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-stone-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-stone-500">{reviewDate}</span>
                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(review.id)}
                                className="inline-flex items-center justify-center rounded-full bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                aria-label="Hapus ulasan"
                                title="Hapus Ulasan"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-6 text-stone-700">{review.comment}</p>

                        {review.photoBase64 && (
                          <img
                            src={review.photoBase64}
                            alt="Foto ulasan"
                            className="mt-3 h-44 w-full rounded-2xl object-cover"
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChatDrawer
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
        product={safeProduct}
        seller={seller}
        productId={safeProduct.id}
        sellerId={safeProduct.sellerId}
        onRequireLogin={() => {
          triggerToast?.("Silakan login terlebih dahulu untuk mengirim pesan", "info");
          onRequireLogin?.();
        }}
      />
    </>,
    document.body
  );
}