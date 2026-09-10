import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { useAuth } from "../context/AuthContext.jsx";
import SellerChatDrawer from "../components/SellerChatDrawer.jsx";
import SellerOrders from "./SellerOrders.jsx";
import { ImagePlus, LoaderCircle, MessageSquareText, Upload } from "lucide-react";
import { listenToChatMessages, listenToSellerChats, sendChatMessage } from "../services/chatService";

const IMGUR_CLIENT_ID = "5440db001223b9f";
const PRODUCT_CATEGORIES = ["Makanan", "Minuman"];

function compressImageToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error("File foto gagal dibaca."));

    image.onload = () => {
      const maxDimension = 1200;
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    image.onerror = () => reject(new Error("File foto bukan gambar yang valid."));

    reader.readAsDataURL(file);
  });
}

async function uploadImageToImgur(file) {
  const imageData = await compressImageToDataUrl(file);
  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: {
      Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
    },
    body: (() => {
      const formData = new FormData();
      formData.append("image", imageData.split(",")[1]);
      return formData;
    })(),
  });

  if (!response.ok) {
    throw new Error(`Imgur upload failed with status ${response.status}.`);
  }

  const result = await response.json();
  const imageUrl = result?.data?.link;

  if (!imageUrl) {
    throw new Error("Imgur tidak mengembalikan URL gambar.");
  }

  return { imageUrl, fallbackDataUrl: imageData };
}

const initialForm = {
  name: "",
  price: "",
  stock: "",
  description: "",
  category: "Makanan",
  imageUrl: "",
  kemasan: "",
  berat: "",
  masaSimpan: "",
  asalProduk: "",
};

const initialStoreProfile = {
  name: "",
  description: "",
  address: "",
  phone: "",
};

export default function SellerDashboard({ triggerToast }) {
  const { firebaseUser, isSeller } = useAuth();
  const [products, setProducts] = useState([]);
  const [storeStatus, setStoreStatus] = useState(null);
  const [storeProfile, setStoreProfile] = useState(initialStoreProfile);
  const [isStoreProfileOpen, setIsStoreProfileOpen] = useState(false);
  const [savingStoreProfile, setSavingStoreProfile] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  const [sellerChats, setSellerChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  useEffect(() => {
    if (!firebaseUser || !isSeller) {
      setProducts([]);
      setLoading(false);
      return undefined;
    }

    const productsQuery = query(
      collection(firestore, "products"),
      where("sellerId", "==", firebaseUser.uid)
    );

    return onSnapshot(
      productsQuery,
      (snapshot) => {
        setProducts(snapshot.docs.map((product) => ({
          id: product.id,
          ...product.data(),
        })));
        setLoading(false);
      },
      (snapshotError) => {
        console.error("Loading seller products failed:", snapshotError);
        setError("Produk gagal dimuat.");
        setLoading(false);
      }
    );
  }, [firebaseUser, isSeller]);

  useEffect(() => {
    if (!firebaseUser || !isSeller) {
      setStoreStatus(null);
      setStoreProfile(initialStoreProfile);
      return undefined;
    }

    return onSnapshot(
      doc(firestore, "stores", firebaseUser.uid),
      (snapshot) => {
        if (!snapshot.exists()) {
          setStoreStatus(null);
          return;
        }

        const store = snapshot.data();
        setStoreStatus(store.status || "active");
        setStoreProfile({
          name: store.name || "",
          description: store.description || "",
          address: store.address || "",
          phone: store.phone || "",
        });
      },
      (statusError) => {
        console.error("Loading seller store status failed:", statusError);
        setStoreStatus(null);
      }
    );
  }, [firebaseUser, isSeller]);

  useEffect(() => {
    if (!firebaseUser || !isSeller) {
      setSellerChats([]);
      return undefined;
    }

    const sellerAccountId = firebaseUser.uid || "admin-seller";
    const shouldShowAllChats = sellerAccountId === "admin-seller" || sellerAccountId === "admin" || sellerAccountId === "all";

    return listenToSellerChats(shouldShowAllChats ? "admin-seller" : sellerAccountId, (chats) => {
      setSellerChats(chats);
      setSelectedChat((current) => {
        if (!current) return current;
        const refreshed = chats.find((chat) => chat.id === current.id);
        return refreshed || null;
      });
    });
  }, [firebaseUser, isSeller]);

  useEffect(() => {
    if (!selectedChat?.id || !firebaseUser || !isSeller) {
      setActiveChatId(null);
      setActiveMessages([]);
      return undefined;
    }

    const chatId = selectedChat.id;
    setActiveChatId(chatId);
    setReplyText("");

    const unsubscribe = listenToChatMessages(chatId, (liveMessages) => {
      setActiveMessages(liveMessages);
    });

    return () => unsubscribe();
  }, [selectedChat, firebaseUser, isSeller]);

  const handleOpenChat = (chat) => {
    setSelectedChat(chat);
    setActiveChatId(chat?.id || null);
    setChatDrawerOpen(true);
  };

  const handleCloseChat = () => {
    setChatDrawerOpen(false);
    setSelectedChat(null);
    setActiveChatId(null);
    setActiveMessages([]);
    setReplyText("");
  };

  const handleReply = async (event) => {
    event?.preventDefault();

    const trimmedReply = replyText.trim();
    if (!activeChatId || !firebaseUser?.uid || !trimmedReply) return;

    setReplying(true);

    try {
      await sendChatMessage({
        chatId: activeChatId,
        senderId: firebaseUser.uid,
        senderRole: "seller",
        text: trimmedReply,
      });
      setReplyText("");
    } catch (replyError) {
      console.error("Seller reply failed:", replyError);
      triggerToast?.("Balasan gagal dikirim", "error");
    } finally {
      setReplying(false);
    }
  };

  const handleStoreProfileChange = (event) => {
    const { name, value } = event.target;
    setStoreProfile((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitStoreProfile = async (event) => {
    event.preventDefault();
    setError("");

    if (!firebaseUser || !isSeller) {
      setError("Anda tidak memiliki akses seller.");
      return;
    }

    setSavingStoreProfile(true);

    try {
      await updateDoc(doc(firestore, "stores", firebaseUser.uid), {
        name: storeProfile.name.trim(),
        description: storeProfile.description.trim(),
        address: storeProfile.address.trim(),
        phone: storeProfile.phone.trim(),
        updatedAt: serverTimestamp(),
      });
      setIsStoreProfileOpen(false);
      triggerToast?.("Deskripsi toko berhasil diperbarui", "success");
    } catch (profileError) {
      console.error("Updating seller store profile failed:", profileError);
      setError("Profil toko gagal diperbarui. Periksa koneksi dan coba lagi.");
      triggerToast?.("Profil toko gagal diperbarui", "error");
    } finally {
      setSavingStoreProfile(false);
    }
  };

  const resetForm = () => {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    setForm(initialForm);
    setLocalPreviewUrl("");
    setUploadedPreviewUrl("");
    setEditingId(null);
  };

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handlePhotoChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Pilih file gambar yang valid.");
      return;
    }

    setError("");
    setUploadingImage(true);
    setUploadedPreviewUrl("");

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const localUrl = URL.createObjectURL(selectedFile);
    setLocalPreviewUrl(localUrl);

    try {
      let uploadedImage;

      try {
        uploadedImage = await uploadImageToImgur(selectedFile);
      } catch (imgurError) {
        console.warn("Imgur upload failed, using compressed Base64 fallback:", imgurError);
        const fallbackDataUrl = await compressImageToDataUrl(selectedFile);
        uploadedImage = {
          imageUrl: fallbackDataUrl,
          fallbackDataUrl,
        };
      }

      setForm((current) => ({
        ...current,
        imageUrl: uploadedImage.imageUrl,
      }));
      setUploadedPreviewUrl(uploadedImage.imageUrl);
    } catch (uploadError) {
      console.error("Image upload and fallback failed:", uploadError);
      setError("Foto gagal diproses. Pilih file gambar lain dan coba lagi.");
      setLocalPreviewUrl("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!firebaseUser || !isSeller) {
      setError("Anda tidak memiliki akses seller.");
      return;
    }

    if (storeStatus !== "active") {
      setError("Toko belum disetujui Admin, sehingga produk belum dapat dikelola.");
      return;
    }

    if (!PRODUCT_CATEGORIES.includes(form.category)) {
      setError("Produk harus termasuk kategori Makanan atau Minuman.");
      return;
    }

    setSaving(true);

    try {
      const imageUrl = form.imageUrl || (editingId
        ? products.find((product) => product.id === editingId)?.imageUrl || ""
        : "");

      if (uploadingImage) {
        setError("Tunggu sampai upload foto selesai.");
        return;
      }

      const kemasan = (form.kemasan || "").trim() || "1 pcs";
      const berat = (form.berat || "").trim() || "Belum diisi";
      const masaSimpan = (form.masaSimpan || "").trim() || "Belum diisi";
      const asalProduk = (form.asalProduk || "").trim() || "Kota Langsa";

      const sellerAccountId = firebaseUser.uid || "admin-seller";

      const productData = {
        sellerId: sellerAccountId,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        category: form.category,
        imageUrl,
        kemasan,
        berat,
        masaSimpan,
        asalProduk,
        packageSize: kemasan,
        weight: berat,
        shelfLife: masaSimpan,
        origin: asalProduk,
        status: "active",
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(firestore, "products", editingId), productData);
      } else {
        await addDoc(collection(firestore, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
      }

      resetForm();
    } catch (submitError) {
      console.error("Saving seller product failed:", submitError);
      setError("Produk gagal disimpan. Periksa koneksi dan konfigurasi Storage.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      category: PRODUCT_CATEGORIES.includes(product.category) ? product.category : "",
      imageUrl: product.imageUrl || "",
      kemasan: product.kemasan || product.packageSize || "",
      berat: product.berat || product.weight || "",
      masaSimpan: product.masaSimpan || product.shelfLife || "",
      asalProduk: product.asalProduk || product.origin || "",
    });
    setLocalPreviewUrl("");
    setUploadedPreviewUrl(product.imageUrl || "");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Hapus produk ini?")) return;

    try {
      await deleteDoc(doc(firestore, "products", productId));
      if (editingId === productId) resetForm();
    } catch (deleteError) {
      console.error("Deleting seller product failed:", deleteError);
      setError("Produk gagal dihapus.");
    }
  };

  if (!isSeller) {
    return <p className="rounded-2xl bg-white p-6 text-sm text-stone-600">Akses dashboard hanya tersedia untuk seller.</p>;
  }

  const canManageProducts = storeStatus === "active";

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-ochre">Seller Center</p>
        <h1 className="mt-2 text-3xl font-serif font-bold text-mangrove-deep">Dashboard Toko</h1>
        <p className="mt-2 text-sm text-stone-500">Kelola katalog produk yang dimiliki akun seller Anda.</p>
        <button type="button" onClick={() => setIsStoreProfileOpen(true)} className="mt-4 rounded-xl bg-accent-ochre px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-accent-ochre/90">
          Edit Profil Toko
        </button>
      </div>

      {isStoreProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4" role="dialog" aria-modal="true" aria-labelledby="store-profile-title">
          <form onSubmit={handleSubmitStoreProfile} className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl sm:p-8">
            <div>
              <h2 id="store-profile-title" className="text-2xl font-serif font-bold text-mangrove-deep">Edit Profil Toko</h2>
              <p className="mt-1 text-sm text-stone-500">Perbarui informasi yang tampil pada profil toko Anda.</p>
            </div>
            <label className="block space-y-2 text-sm font-semibold text-stone-700">
              Nama Toko
              <input name="name" value={storeProfile.name} onChange={handleStoreProfileChange} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
            </label>
            <label className="block space-y-2 text-sm font-semibold text-stone-700">
              Deskripsi Toko
              <textarea name="description" value={storeProfile.description} onChange={handleStoreProfileChange} required rows="4" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-semibold text-stone-700">
                Alamat Toko
                <input name="address" value={storeProfile.address} onChange={handleStoreProfileChange} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
              </label>
              <label className="space-y-2 text-sm font-semibold text-stone-700">
                Nomor Kontak / WhatsApp
                <input name="phone" value={storeProfile.phone} onChange={handleStoreProfileChange} required type="tel" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre" />
              </label>
            </div>
            {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setIsStoreProfileOpen(false)} disabled={savingStoreProfile} className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-bold text-stone-600 disabled:cursor-not-allowed disabled:opacity-60">Batal</button>
              <button type="submit" disabled={savingStoreProfile} className="rounded-xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
                {savingStoreProfile ? "Menyimpan..." : "Simpan Profil Toko"}
              </button>
            </div>
          </form>
        </div>
      )}

      {storeStatus === "pending" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold">Toko sedang ditinjau Admin</p>
          <p className="mt-1">Anda belum dapat menambahkan atau mengubah produk sampai pendaftaran toko disetujui.</p>
        </div>
      )}
      {storeStatus && storeStatus !== "active" && storeStatus !== "pending" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-bold">Toko belum dapat berjualan</p>
          <p className="mt-1">Status toko saat ini: {storeStatus}. Hubungi Admin untuk informasi lebih lanjut.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab("products")}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${activeTab === "products" ? "bg-mangrove-deep text-white" : "text-stone-600 hover:bg-stone-100"}`}
        >
          Kelola Produk
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${activeTab === "orders" ? "bg-mangrove-deep text-white" : "text-stone-600 hover:bg-stone-100"}`}
        >
          Pesanan Masuk
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${activeTab === "chat" ? "bg-mangrove-deep text-white" : "text-stone-600 hover:bg-stone-100"}`}
        >
          Chat / Pesan Masuk
        </button>
      </div>

      {activeTab === "orders" ? (
        <SellerOrders products={products} />
      ) : activeTab === "chat" ? (
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4 py-3 sm:px-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-800">Percakapan Pembeli</h2>
              <p className="text-sm text-stone-500">Daftar chat yang menanyakan produk Anda.</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              <MessageSquareText className="mr-1 h-3.5 w-3.5" />
              {sellerChats.length} chat
            </span>
          </div>

          <div className="md:flex md:h-[70vh] md:min-h-0">
            <aside className={`w-full ${selectedChat ? "hidden md:block" : "block"} md:w-[32%] md:border-r md:border-stone-200 md:max-h-[70vh]`}>
              {sellerChats.length === 0 ? (
                <div className="p-6 text-center text-sm text-stone-500">
                  Belum ada percakapan dari pembeli untuk toko Anda.
                </div>
              ) : (
                <div className="max-h-[38vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100 sm:max-h-[70vh] sm:p-4">
                  <div className="space-y-2 sm:space-y-3">
                    {sellerChats.map((chat) => {
                      const isSelected = selectedChat?.id === chat.id;
                      const isUnread = Boolean(chat.lastMessageSender) && chat.lastMessageSender !== firebaseUser?.uid && !isSelected;

                      return (
                        <button
                          key={chat.id}
                          type="button"
                          onClick={() => handleOpenChat(chat)}
                          className={`flex w-full items-start justify-between gap-2 rounded-2xl border p-2.5 text-left transition sm:gap-3 sm:p-3 ${
                            isSelected
                              ? "border-emerald-200 bg-emerald-50 shadow-sm"
                              : "border-stone-200 bg-stone-50 hover:border-mangrove-deep/50 hover:bg-white"
                          }`}
                        >
                          <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
                            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-mangrove-deep to-emerald-700 text-xs font-bold text-white sm:h-11 sm:w-11 sm:text-sm">
                              {(chat.buyerName || "P").charAt(0).toUpperCase()}
                              {isUnread && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[8px] font-bold text-white sm:h-4 sm:w-4" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`truncate text-xs font-bold sm:text-sm ${isUnread ? "text-stone-900" : "text-stone-800"}`}>
                                  {chat.buyerName || "Pembeli"}
                                </p>
                                {chat.lastMessageAt && (
                                  <span className="shrink-0 text-[9px] text-stone-400 sm:text-[10px]">
                                    {new Date(chat.lastMessageAt).toLocaleDateString("id-ID", {
                                      day: "2-digit",
                                      month: "short",
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 truncate text-[10px] font-semibold text-mangrove-deep sm:text-[11px]">{chat.productName || "Produk"}</p>
                              <p className={`mt-1.5 line-clamp-2 text-[11px] sm:text-sm ${isUnread ? "font-semibold text-stone-800" : "text-stone-600"}`}>
                                {chat.lastMessage || "Belum ada pesan."}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1.5 text-[9px] font-bold text-white sm:h-6 sm:min-w-6">
                                Baru
                              </span>
                            )}
                            <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${isSelected ? "bg-mangrove-deep text-white" : "bg-white text-mangrove-deep shadow-sm ring-1 ring-stone-200"}`}>
                              <MessageSquareText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>

            <section className={`${selectedChat ? "block" : "hidden md:block"} flex-1 min-h-[420px] bg-stone-50 md:min-h-0`}>
              {selectedChat ? (
                <SellerChatDrawer
                  isOpen={true}
                  inline={true}
                  onClose={handleCloseChat}
                  onBack={handleCloseChat}
                  chat={selectedChat}
                />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center p-6 text-center text-sm text-stone-500 md:min-h-0">
                  Pilih satu percakapan untuk melihat detail chat dan membalas pembeli.
                </div>
              )}
            </section>
          </div>
        </div>
      ) : (
      <>
      <form onSubmit={handleSubmit} className={`space-y-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8 ${!canManageProducts ? "opacity-70" : ""}`}>
        <h2 className="text-xl font-serif font-bold text-stone-800">{editingId ? "Edit Produk" : "Tambah Produk"}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Nama Produk
            <input disabled={!canManageProducts} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Harga
            <input disabled={!canManageProducts} type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Stok
            <input disabled={!canManageProducts} type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Kategori Produk
            <select disabled={!canManageProducts} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed">
              <option value="" disabled>Pilih kategori produk</option>
              {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </label>
        </div>
        {!PRODUCT_CATEGORIES.includes(form.category) && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            Produk harus termasuk kategori Makanan atau Minuman.
          </p>
        )}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-stone-700">Foto Produk</p>
          <label className="relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-5 text-center transition-colors hover:border-accent-ochre hover:bg-amber-50/40">
            <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={uploadingImage || !canManageProducts} className="sr-only" />
            {(localPreviewUrl || uploadedPreviewUrl || form.imageUrl) ? (
              <img src={localPreviewUrl || uploadedPreviewUrl || form.imageUrl} alt="Preview foto produk" className="absolute inset-0 h-full w-full object-contain p-3" />
            ) : (
              <>
                <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-accent-ochre shadow-sm"><ImagePlus className="h-6 w-6" /></span>
                <span className="text-sm font-bold text-stone-700">Klik untuk unggah foto produk</span>
                <span className="mt-1 text-xs font-normal text-stone-500">JPG, PNG, atau WEBP. Foto akan diproses otomatis.</span>
              </>
            )}
            {uploadingImage && <span className="absolute inset-0 flex items-center justify-center gap-2 bg-white/80 text-sm font-bold text-mangrove-deep"><LoaderCircle className="h-5 w-5 animate-spin" /> Mengunggah foto...</span>}
            {!uploadingImage && (localPreviewUrl || uploadedPreviewUrl || form.imageUrl) && <span className="absolute bottom-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-stone-700 shadow-sm"><Upload className="mr-1 inline h-3.5 w-3.5" /> Ganti foto</span>}
          </label>
          <input disabled={!canManageProducts} type="url" value={form.imageUrl} onChange={(event) => { setForm({ ...form, imageUrl: event.target.value }); setUploadedPreviewUrl(event.target.value); setLocalPreviewUrl(""); }} placeholder="Atau tempel URL foto (opsional)" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Kemasan
            <input disabled={!canManageProducts} value={form.kemasan} onChange={(event) => setForm({ ...form, kemasan: event.target.value })} placeholder="contoh: 250 gram / 500 ml" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Berat
            <input disabled={!canManageProducts} value={form.berat} onChange={(event) => setForm({ ...form, berat: event.target.value })} placeholder="contoh: 250 gram" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Masa Simpan
            <input disabled={!canManageProducts} value={form.masaSimpan} onChange={(event) => setForm({ ...form, masaSimpan: event.target.value })} placeholder="contoh: 12 bulan" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
          <label className="space-y-2 text-sm font-semibold text-stone-700">
            Asal Produk
            <input disabled={!canManageProducts} value={form.asalProduk} onChange={(event) => setForm({ ...form, asalProduk: event.target.value })} placeholder="contoh: Kuala Langsa" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
          </label>
        </div>
        <label className="block space-y-2 text-sm font-semibold text-stone-700">
          Deskripsi
          <textarea disabled={!canManageProducts} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required rows="4" className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 font-normal outline-none focus:border-accent-ochre disabled:cursor-not-allowed" />
        </label>
        {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving || !canManageProducts || !PRODUCT_CATEGORIES.includes(form.category)} className="rounded-xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {editingId && <button type="button" onClick={resetForm} className="rounded-xl border border-stone-200 px-5 py-3 text-sm font-bold text-stone-600">Batal Edit</button>}
        </div>
      </form>

      <div>
        <h2 className="mb-4 text-xl font-serif font-bold text-stone-800">Produk Saya</h2>
        {loading ? (
          <p className="text-sm text-stone-500">Memuat produk...</p>
        ) : products.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500">Belum ada produk.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="h-44 w-full object-cover" /> : <div className="flex h-44 items-center justify-center bg-stone-100 text-sm text-stone-400">Tanpa foto</div>}
                <div className="space-y-3 p-5">
                  <div>
                    <h3 className="font-bold text-stone-800">{product.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-accent-ochre">Rp {Number(product.price || 0).toLocaleString("id-ID")}</p>
                    <p className="mt-1 text-xs text-stone-500">Stok: {product.stock}</p>
                    <p className="mt-1 text-xs font-semibold text-mangrove-deep">{product.category || "Kategori tidak valid"}</p>
                  </div>
                  <p className="line-clamp-3 text-sm text-stone-600">{product.description}</p>
                  <div className="flex gap-2">
                    <button disabled={!canManageProducts} onClick={() => handleEdit(product)} className="rounded-lg border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700 disabled:cursor-not-allowed disabled:opacity-50">Edit</button>
                    <button disabled={!canManageProducts} onClick={() => handleDelete(product.id)} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-50">Hapus</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      <SellerChatDrawer
        isOpen={chatDrawerOpen}
        onClose={handleCloseChat}
        chat={selectedChat}
      />
    </section>
  );
}
