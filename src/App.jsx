/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useMemo, useRef } from "react";
import { auth, db, firestore } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ref as dbRef, set as dbSet, push as dbPush, onValue as dbOnValue, get as dbGet, update as dbUpdate} from "firebase/database";
import { collection, doc as firestoreDoc, getDoc, limit, onSnapshot, query, setDoc as firestoreSetDoc, serverTimestamp, where } from "firebase/firestore";
import {
  Leaf,
  CheckCircle2,
  Sparkles,
  X,
  Info,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ImpactPage from "./pages/ImpactPage";
import OrderHistory from "./pages/OrderHistory";
import CatalogPage from "./pages/CatalogPage";
import CartDrawer from "./components/cart/CartDrawer";
import ProductDetailModal from "./components/ProductDetailModal";
import CheckoutModal from "./components/CheckoutModal";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import RegisterSeller from "./pages/RegisterSeller";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";

const ADMIN_EMAILS = ["admin@mangrovise.store"];
const ACTIVE_PRODUCT_CATEGORIES = ["Makanan", "Minuman"];

export const ASSET_CONFIG = {
  logo: {
    useRealLogo: true,
    // Ubah ke true jika ingin memakai file gambar asli
    imagePath: "images/logo.png"
    // Ganti dengan path logo Anda nanti
  },
  heroBanner: "images/Utama.jpeg",
  // FOTO HERO UTAMA (Bisa diubah manual)
  promoBanners: {
    leftBig: "images/Banyak.jpeg",
    // FOTO PROMO BESAR (Bisa diubah manual)
    rightSmall: "images/Banyak.jpeg"
    // FOTO PROMO KECIL (Bisa diubah manual)
  },
  products: [
    {
      id: 1,
      name: "Sirup Mangrove Original",
      price: 25000,
      category: "Minuman",
      flavor: "Asam Segar",
      description:
        "Sirup mangrove dengan cita rasa segar khas Kota Langsa. Dibuat dari buah mangrove pilihan tanpa bahan pengawet.",
      image: "images/Sirup.jpeg",
      badge: "Best Seller",

      stock: 18,
      preorder: false,
      packageSize: "500 ml",
      weight: "500 gram",
      shelfLife: "12 Bulan",
      origin: "Kuala Langsa",
      ingredient: "Buah Mangrove Pilihan",
      rating: 4.9,
      review: 127,
      sold: 342,
      gallery: [
        "images/Sirup.jpeg",
        "images/Dodol.jpeg",
        "images/Selai.jpeg",
        "images/Kerupuk.jpeg"
      ]
   },

    {
      id: 2,
      name: "Dodol Mangrove Klasik",
      price: 20000,
      category: "Makanan",
      flavor: "Manis Legit",
      description: "Camilan tradisional bertekstur lembut dan kenyal.",
      image: "images/Dodol.jpeg",
      badge: "Special Offer",

      stock: 12,
      preorder: false,
      packageSize: "250 gram",
      weight: "250 gram",
      shelfLife: "10 Bulan",
      origin: "Kuala Langsa",
      ingredient: "Buah Mangrove",
      rating: 4.8,
      review: 95,
      sold: 221,
      gallery:[
        "images/Dodol.jpeg",
        "images/Sirup.jpeg",
        "images/Selai.jpeg",
        "images/Kerupuk.jpeg"
      ]
    },

    {
      id: 3,
      name: "Selai Mangrove Gurih",
      price: 18000,
      category: "Makanan",
      flavor: "Manis Gurih",
      description: "Teman terbaik untuk roti panggang sarapan pagi Anda.",
      image: "images/Selai.jpeg",
      badge: "Best Seller",

      stock:7,
      preorder:false,
      packageSize:"250 gram",
      weight:"250 gram",
      shelfLife:"8 Bulan",
      origin:"Kuala Langsa",
      ingredient:"Buah Mangrove",
      rating:4.9,
      review:87,
      sold:163,
      gallery:[
        "images/Selai.jpeg",
        "images/Sirup.jpeg",
        "images/Dodol.jpeg",
        "images/Kerupuk.jpeg"
      ]
    },

    {
      id: 4,
      name: "Kerupuk Mangrove Gurih",
      price: 18000,
      category: "Makanan",
      flavor: "Gurih",
      description: "Teman terbaik untuk santai Anda.",
      image: "images/Kerupuk.jpeg",
      badge: "Best Seller",

      stock:0,
      preorder:true,
      packageSize:"200 gram",
      weight:"200 gram",
      shelfLife:"9 Bulan",
      origin:"Kuala Langsa",
      ingredient:"Buah Mangrove",
      rating:4.8,
      review:55,
      sold:102,
      gallery:[
        "images/Kerupuk.jpeg",
        "images/Sirup.jpeg",
        "images/Dodol.jpeg",
        "images/Selai.jpeg"
      ]   
    }
  ]
};
export default function App() {
  const { role, isSeller, firebaseUser } = useAuth();
  const isAdmin = role === "admin" || ADMIN_EMAILS.includes(firebaseUser?.email?.toLowerCase());
  const [currentTab, setCurrentTab] = useState("beranda");
  const [liveProducts, setLiveProducts] = useState([]);
  const [storeStatusRevision, setStoreStatusRevision] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isRegisteringUser, setIsRegisteringUser] = useState(false);
  const [orders, setOrders] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    recipientName: "",
    phone: "",
    provinceCity: "",
    addressDetails: "",
    postalCode: ""
  });
  const [cart, setCart] = useState([]);
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(firestore, "stores"), () => {
      setStoreStatusRevision((revision) => revision + 1);
    }, (error) => {
      console.error("Loading store status updates failed:", error);
    });
  }, []);

  useEffect(() => {
    const productsQuery = query(
      collection(firestore, "products"),
      where("status", "==", "active"),
      limit(30)
    );

    return onSnapshot(
      productsQuery,
      async (snapshot) => {
        try {
          const sellerIds = [...new Set(
            snapshot.docs
              .map((product) => product.data().sellerId)
              .filter(Boolean)
          )];
          const storeEntries = await Promise.all(
            sellerIds.map(async (sellerId) => {
              const storeSnapshot = await getDoc(firestoreDoc(firestore, "stores", sellerId));
              return [sellerId, storeSnapshot.exists() ? storeSnapshot.data() : null];
            })
          );
          const storesBySellerId = Object.fromEntries(storeEntries);

          setLiveProducts(snapshot.docs.filter((productSnapshot) => {
            const product = productSnapshot.data();
            return storesBySellerId[product.sellerId]?.status === "active"
              && ACTIVE_PRODUCT_CATEGORIES.includes(product.category);
          }).map((productSnapshot) => {
            const product = productSnapshot.data();
            const store = storesBySellerId[product.sellerId];

            return {
              id: productSnapshot.id,
              ...product,
              image: product.imageUrl || product.image || "images/Sirup.jpeg",
              price: Number(product.price || 0),
              category: product.category,
              flavor: product.flavor || "Pilihan Lestari",
              storeName: product.storeName || store?.name || "Toko Mangrovise",
            };
          }));
          setProductsError("");
        } catch (error) {
          console.error("Loading seller stores failed:", error);
          setProductsError("Nama toko gagal dimuat, tetapi produk tetap tersedia.");
        } finally {
          setProductsLoading(false);
        }
      },
      (error) => {
        console.error("Loading active products failed:", error);
        setProductsError("Produk seller gagal dimuat.");
        setProductsLoading(false);
      }
    );
  }, [storeStatusRevision]);

  const generateOrderId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "MNG-";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
}, []);

  useEffect(() => {
    setCurrentTab("beranda");
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [currentTab]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setCart([]);
        setShippingAddress({
          recipientName: "",
          phone: "",
          provinceCity: "",
          addressDetails: "",
          postalCode: ""
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    const ordersRef = dbRef(db, `orders/${user.uid}`);
    const unsubscribe = dbOnValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedOrders = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        })).reverse();
        setOrders(loadedOrders);
      } else {
        setOrders([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const addressRef = dbRef(db, `users/${user.uid}/profile/address`);
    const unsubscribe = dbOnValue(addressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setShippingAddress({
          recipientName: data.recipientName || "",
          phone: data.phone || "",
          provinceCity: data.provinceCity || "",
          addressDetails: data.addressDetails || "",
          postalCode: data.postalCode || ""
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const userProfileRef = firestoreDoc(firestore, "users", user.uid);
    const unsubscribe = onSnapshot(userProfileRef, (snapshot) => {
      const savedAddress = snapshot.data()?.address;

      if (savedAddress) {
        setShippingAddress({
          recipientName: savedAddress.recipientName || "",
          phone: savedAddress.phone || "",
          provinceCity: savedAddress.provinceCity || "",
          addressDetails: savedAddress.addressDetails || "",
          postalCode: savedAddress.postalCode || "",
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Load cart from Firebase when user logs in
  useEffect(() => {
    if (!user) {
      setCart([]);
      setIsCartInitialized(false);
      return;
    }

    setIsCartInitialized(false);
    const cartRef = dbRef(db, `carts/${user.uid}`);
    dbGet(cartRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data && Array.isArray(data)) {
          setCart(data);
        } else {
          setCart([]);
        }
        setIsCartInitialized(true);
      })
      .catch((err) => {
        console.error("Error loading cart from database:", err);
        setIsCartInitialized(true);
      });
  }, [user]);

  // Save cart to Firebase whenever cart changes (after being initialized)
  useEffect(() => {
    if (!user || !isCartInitialized) return;
    const cartRef = dbRef(db, `carts/${user.uid}`);
    dbSet(cartRef, cart).catch((err) => {
      console.error("Error saving cart to database:", err);
    });
  }, [cart, user, isCartInitialized]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      triggerToast("Berhasil masuk! Selamat datang kembali.");
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      setAuthError(error.message || "Gagal masuk. Silakan periksa kembali email dan password Anda.");
      triggerToast("Gagal masuk. Periksa email/password.", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isRegisteringUser) return;

    setAuthError("");

    const emptyShippingAddress = {
      recipientName: "",
      phone: "",
      provinceCity: "",
      addressDetails: "",
      postalCode: ""
    };

    setIsRegisteringUser(true);

    let registeredUser;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      registeredUser = userCredential.user;
    } catch (error) {
      console.error("Firebase Auth registration failed:", error);
      setAuthError(
        error.code === "auth/email-already-in-use"
          ? "Email ini sudah terdaftar. Silakan masuk atau gunakan email lain."
          : error.code === "auth/weak-password"
            ? "Kata sandi terlalu lemah. Gunakan minimal 6 karakter."
            : error.message || "Akun gagal dibuat. Silakan coba lagi."
      );
      triggerToast("Akun gagal dibuat. Periksa data pendaftaran.", "error");
      setIsRegisteringUser(false);
      return;
    }

    try {
      await firestoreSetDoc(
        firestoreDoc(firestore, "users", registeredUser.uid),
        {
          email: registeredUser.email,
          role: "buyer",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await dbSet(
        dbRef(db, `users/${registeredUser.uid}/profile/address`),
        shippingAddress
      );
    } catch (error) {
      console.error(
        "Firebase Auth registration succeeded, but profile/address persistence failed:",
        error
      );
      setAuthError(
        "Akun berhasil dibuat dan Anda sudah masuk, tetapi profil/alamat belum berhasil disimpan. Silakan simpan alamat dari akun Anda atau hubungi administrator."
      );
      triggerToast(
        "Akun berhasil dibuat, tetapi profil/alamat belum tersimpan.",
        "error"
      );
      setShowLoginModal(false);
      setShowUserMenu(false);
      setAuthError("");
      setEmail("");
      setPassword("");
      setShippingAddress(emptyShippingAddress);
      setIsRegistering(false);
      setIsRegisteringUser(false);
      return;
    }

    setShowLoginModal(false);
    setShowUserMenu(false);
    setEmail("");
    setPassword("");
    setShippingAddress(emptyShippingAddress);
    setIsRegistering(false);
    setAuthError("");
    setIsRegisteringUser(false);
    triggerToast("Pendaftaran berhasil. Selamat datang di Mangrovise!", "success");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      triggerToast("Berhasil keluar.");
      if (currentTab === "pesanan" || currentTab === "order-history") {
        setCurrentTab("katalog");
      }
    } catch (error) {
      triggerToast("Gagal keluar.", "error");
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ===== DETAIL PRODUK =====
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  const mainContentRef = useRef(null);
  const handleTabChange = (tab) => {
    setCurrentTab(tab);
    setTimeout(() => {
      mainContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ===============================
  // DETAIL PRODUK
  // ===============================
  const openProductDetail = (product) => {
    console.log(product);
    setSelectedProduct(product);
    setShowProductDetail(true);
  };
  const closeProductDetail = () => {
    setSelectedProduct(null);
    setShowProductDetail(false);
  };

  useEffect(() => {
    if (isCartOpen) {
      setCartStep(1);
    }
  }, [isCartOpen]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedFlavor, setSelectedFlavor] = useState("Semua");
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState("pending");
  const [countdown, setCountdown] = useState(600);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [sliderItems, setSliderItems] = useState(10);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const triggerToast = (message, type = "success") => {
    setToast({ message, type });
  };
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3e3);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  useEffect(() => {
    let timer;
    if (isCheckoutModalOpen && checkoutStatus !== "success" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1e3);
    }
    return () => clearInterval(timer);
  }, [isCheckoutModalOpen, checkoutStatus, countdown]);
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };
  const renderAddressDetails = (alamat) => {
    if (!alamat) return <span className="text-stone-400">Tidak ada alamat</span>;
    if (typeof alamat === "object") {
      return (
        <div className="space-y-1.5 text-xs text-stone-700">
          <p className="font-bold text-stone-800 flex items-center gap-1.5 flex-wrap">
            <span className="bg-mangrove-light text-mangrove-deep px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Penerima</span>
            <span className="text-stone-900 font-semibold">{alamat.recipientName || "-"}</span>
            <span className="text-stone-300">|</span>
            <span className="font-mono text-stone-500 font-semibold">{alamat.phone || "-"}</span>
          </p>
          <p className="text-stone-600 leading-relaxed font-medium">
            {alamat.addressDetails || "-"}
          </p>
          <p className="text-stone-500 text-[11px] font-bold uppercase tracking-wider">
            {alamat.provinceCity || "-"} {alamat.postalCode ? `• KODE POS: ${alamat.postalCode}` : ""}
          </p>
        </div>
      );
    }
    return <p className="text-stone-600 leading-relaxed text-xs break-words">{alamat}</p>;
  };
  const cartTotal = useMemo(() => {
    return cart
      .filter((item) => item.checked !== false)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return cartTotal * promoDiscount / 100;
}, [cartTotal, promoDiscount]);

const finalTotal = useMemo(() => {
    return cartTotal - discountAmount;
}, [cartTotal, discountAmount]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);
  const checkedCartItemsCount = useMemo(() => {
    return cart
      .filter((item) => item.checked !== false)
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);
  const ecoMetrics = useMemo(() => {
    const seedlings = checkedCartItemsCount;
    const carbonOffset = Number((seedlings * 21.8).toFixed(1));
    const wageHours = Number((seedlings * 0.5).toFixed(1));
    return { seedlings, carbonOffset, wageHours };
  }, [checkedCartItemsCount]);
  const allChecked = useMemo(() => {
    return cart.length > 0 && cart.every((item) => item.checked !== false);
  }, [cart]);
  const toggleCheckItem = (productId) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, checked: item.checked === false ? true : false } : item
      )
    );
  };
  const toggleSelectAll = () => {
    setCart((prev) =>
      prev.map((item) => ({ ...item, checked: !allChecked }))
    );
  };
  const filteredProducts = useMemo(() => {
    return liveProducts.filter((product) => {
      const searchableText = `${product.name} ${product.description} ${product.storeName}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua"
        || ACTIVE_PRODUCT_CATEGORIES.includes(selectedCategory) && product.category === selectedCategory;
      let matchesFlavor = true;
      if (selectedFlavor !== "Semua") {
        matchesFlavor = product.flavor.toLowerCase().includes(selectedFlavor.toLowerCase());
      }
      return matchesSearch && matchesCategory && matchesFlavor;
    });
  }, [liveProducts, searchQuery, selectedCategory, selectedFlavor]);
  const handleAddToCart = (product) => {
    if (!user) {
      triggerToast("Silakan masuk terlebih dahulu untuk menambahkan produk ke keranjang.", "info");
      setShowLoginModal(true);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast(`Jumlah ${product.name} ditambah di keranjang!`);
        return prev.map(
          (item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1, checked: true } : item
        );
      }
      triggerToast(`Berhasil menambahkan ${product.name} ke keranjang!`);
      return [...prev, { product, quantity: 1, checked: true }];
    });
  };
  const handleInstantBuy = (product) => {
    if (!user) {
      triggerToast("Silakan masuk terlebih dahulu untuk membeli produk secara instan.", "info");
      setShowLoginModal(true);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast(`Jumlah ${product.name} ditambah di keranjang!`);
        return prev.map(
          (item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1, checked: true } : item
        );
      }
      triggerToast(`Berhasil menambahkan ${product.name} ke keranjang!`);
      return [...prev, { product, quantity: 1, checked: true }];
    });
    setIsCartOpen(true);
  };
  const handleDecreaseQuantity = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing) {
        if (existing.quantity === 1) {
          triggerToast(`Produk dihapus dari keranjang.`, "info");
          return prev.filter((item) => item.product.id !== productId);
        }
        return prev.map(
          (item) => item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev;
    });
  };
  const handleRemoveItem = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        triggerToast(`${item.product.name} dihapus dari keranjang.`, "info");
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };
  const handleCheckout = () => {
    const checkedItems = cart.filter((item) => item.checked !== false);
    if (checkedItems.length === 0) {
      triggerToast("Silakan pilih minimal 1 produk untuk dicheckout!", "info");
      return;
    }
    if (!user) {
      triggerToast("Silakan masuk terlebih dahulu untuk melanjutkan checkout.", "info");
      setIsCartOpen(false);
      setShowLoginModal(true);
      return;
    }
    if (
      !shippingAddress.recipientName?.trim() ||
      !shippingAddress.phone?.trim() ||
      !shippingAddress.provinceCity?.trim() ||
      !shippingAddress.addressDetails?.trim() ||
      !shippingAddress.postalCode?.trim()
    ) {
      triggerToast("Silakan isi semua bidang Alamat Pengiriman (Nama, No HP, Wilayah, Alamat Lengkap, Kode Pos) terlebih dahulu.", "info");
      return;
    }
    setCountdown(600);
    setCheckoutStatus("pending");
    setIsCheckoutModalOpen(true);
    setIsCartOpen(false);
  };
  const handleVerifyPayment = () => {
    if (!user) {
      triggerToast("Sesi Anda habis. Silakan masuk kembali.", "error");
      return;
    }
    const checkedItems = cart.filter((item) => item.checked !== false);
    if (checkedItems.length === 0) {
      triggerToast("Silakan pilih minimal 1 produk untuk dicheckout!", "info");
      return;
    }
    setCheckoutStatus("verifying");
    const orderId = generateOrderId();
    const invoiceNo = "INV/" + new Date().getFullYear() + "/MNG/" + Math.floor(1e5 + Math.random() * 9e5);
    const dateStr = new Date().toLocaleString("id-ID", { hour12: false });
    const itemsData = checkedItems.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));
    const orderData = {
    orderId,
    invoiceNo,

    buyerId: user.uid,

    buyerEmail: user.email || "",

    buyerName: user.displayName || user.email?.split("@")[0] || "Pembeli Mangrovise",

    items: itemsData,

    subtotal: cartTotal,

    discount: discountAmount,

    promo: promoDiscount,

    total: finalTotal,

    tanggal: dateStr,

    status: "In Process",

    alamat: shippingAddress,

    ecoDonation: ecoMetrics.seedlings,

    carbonSaved: ecoMetrics.carbonOffset
};
    setTimeout(() => {
      const userOrdersRef = dbRef(db, `orders/${user.uid}`);
      dbPush(userOrdersRef, orderData)
        .then(() => {
          // Simpan/perbarui data alamat ke profil
          const profileAddressRef = dbRef(db, `users/${user.uid}/profile/address`);
          return dbSet(profileAddressRef, shippingAddress);
        })
        .then(() => {
          const receipt = {
    invoiceNo,
    transactionId: orderId,
    date: dateStr,
    items: [...checkedItems],

    subtotal: cartTotal,

    discount: discountAmount,

    promo: promoDiscount,

    total: finalTotal,

    alamat: shippingAddress,

    ecoDonation: ecoMetrics.seedlings,

    carbonSaved: ecoMetrics.carbonOffset
};
          setActiveReceipt(receipt);
          setCheckoutStatus("success");
          // Hapus hanya produk yang dicentang dari keranjang belanja
          setCart((prev) => prev.filter((item) => item.checked === false));
          triggerToast("Pembayaran Berhasil! Pesanan Anda telah tersimpan.", "success");
        })
        .catch((err) => {
          console.error("Firebase database error:", err);
          triggerToast("Gagal menyimpan pesanan ke database.", "error");
          setCheckoutStatus("pending");
        });
    }, 2000);
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Apakah Anda yakin ingin membatalkan pesanan ini?"
    );

    if (!confirmCancel) return;

    try {
      const orderRef = dbRef(db, `orders/${user.uid}/${orderId}`);

      await dbUpdate(orderRef, {
        status: "Dibatalkan"
      });

      triggerToast("Pesanan berhasil dibatalkan.", "success");
    } catch (err) {
      console.error(err);
      triggerToast("Gagal membatalkan pesanan.", "error");
    }
  };
  const renderLogo = () => {
    return (
      <div className="flex items-center space-x-3">
        {ASSET_CONFIG.logo.useRealLogo ? (
          /* Jika useRealLogo true, kotak oranye ikon daun diganti dengan file gambar asli */
          <img 
            src={ASSET_CONFIG.logo.imagePath} 
            alt="Mangrovise Logo Asset" 
            className="w-9 h-9 object-contain rounded-xl shadow-md shrink-0"
            onError={(e) => {
              // Jika gambar gagal dimuat, otomatis pasang fallback ikon daun
              e.currentTarget.style.display = 'none';
              const fallbackIcon = document.getElementById('fallback-icon');
              if (fallbackIcon) fallbackIcon.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Kotak ikon daun bawaan (hanya muncul jika useRealLogo false, atau sebagai cadangan) */}
        <div 
          id="fallback-icon" 
          className="w-9 h-9 bg-accent-ochre rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
          style={{ display: ASSET_CONFIG.logo.useRealLogo ? 'none' : 'flex' }}
        >
          <Leaf className="w-5 h-5 text-white animate-pulse" />
        </div>

        {/* Teks Logo - Tidak akan hilang karena ditaruh di luar kondisi gambar */}
        <div className="text-left">
          <span className="block font-serif font-bold text-lg leading-none text-white tracking-wide">
            Mangro<span className="text-accent-ochre font-sans font-bold">Vise</span>
          </span>
          <span className="text-[9px] font-mono text-stone-300 font-medium tracking-wider block uppercase">Langsa Mangrove Co.</span>
        </div>
      </div>
    );
  };
  


  return <div className="min-h-screen overflow-x-hidden bg-warm-bg text-stone-850 font-sans selection:bg-accent-ochre selection:text-white relative gap-8">


      {/* 3. STICKY NAVBAR MAIN HEADER WRAPPER */}
      <Navbar
        currentTab={currentTab}
        handleTabChange={handleTabChange}

        renderLogo={renderLogo}

        user={user}
        role={role}
        handleLogout={handleLogout}

        totalCartItems={totalCartItems}
        setIsCartOpen={setIsCartOpen}

        setShowLoginModal={setShowLoginModal}

        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}

        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}

        onOpenSellerRegistration={() => {
          setCurrentTab("register-seller");
          setShowUserMenu(false);
        }}
        onOpenSellerDashboard={() => {
          setCurrentTab("seller-dashboard");
          setShowUserMenu(false);
        }}
        onOpenAdminDashboard={() => {
          setCurrentTab("admin-dashboard");
          setShowUserMenu(false);
        }}
        isAdmin={isAdmin}
        onOpenUserProfile={() => {
          setCurrentTab("user-profile");
          setShowUserMenu(false);
        }}

        isCheckoutModalOpen={isCheckoutModalOpen}
      />

      {/* APP TABS: BERANDA, KATALOG, TENTANG, IMPACT CALCULATOR, PESANAN */}
        {/* TAB 1: BERANDA */}
        {currentTab === "beranda" && (<main ref={mainContentRef} className="w-full pb-24 scroll-mt-24">
          <HomePage
    ASSET_CONFIG={ASSET_CONFIG}
            liveProducts={liveProducts}
            productsLoading={productsLoading}
    handleTabChange={handleTabChange}
    openProductDetail={openProductDetail}
    setCurrentTab={setCurrentTab}

    user={user}
    triggerToast={triggerToast}
    setShowLoginModal={setShowLoginModal}
    handleAddToCart={handleAddToCart}
    setIsCartOpen={setIsCartOpen}
    setPromoDiscount={setPromoDiscount}
/>
        </main>)}
        
        {currentTab !== "beranda" && (
         <main ref={mainContentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">

        {currentTab === "register-seller" && (
          <RegisterSeller
            onCancel={() => handleTabChange("beranda")}
            onSuccess={() => handleTabChange("seller-dashboard")}
          />
        )}

        {currentTab === "seller-dashboard" && isSeller && (
          <SellerDashboard />
        )}

        {currentTab === "seller-dashboard" && !isSeller && (
          <RegisterSeller
            onCancel={() => handleTabChange("beranda")}
            onSuccess={() => handleTabChange("seller-dashboard")}
          />
        )}

        {currentTab === "admin-dashboard" && <AdminDashboard />}

        {currentTab === "user-profile" && <UserProfile />}
        
        {/* TAB 2: KATALOG */}
        {currentTab === "katalog" && (
          <CatalogPage
            ASSET_CONFIG={ASSET_CONFIG}

            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}

            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}

            selectedFlavor={selectedFlavor}
            setSelectedFlavor={setSelectedFlavor}

            filteredProducts={filteredProducts}

            openProductDetail={openProductDetail}
            handleAddToCart={handleAddToCart}
            handleInstantBuy={handleInstantBuy}
            productsLoading={productsLoading}
            productsError={productsError}
          />
        )}

        {/* TAB 3: TENTANG KAMI SECTION */}
        {currentTab === "tentang" && <AboutPage
    setCurrentTab={setCurrentTab}
  />}

        {/* TAB 4: ECO IMPACT INTERACTIVE CALCULATOR */}
        {currentTab === "impact" && (
          <ImpactPage
            sliderItems={sliderItems}
            setSliderItems={setSliderItems}
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* TAB 5: PESANAN */}
        {(currentTab === "order-history" || currentTab === "pesanan") && (
          <OrderHistory
            orders={orders}
            handleTabChange={handleTabChange}
          />
        )}

      </main>)}

      {/* CART DRAWER COMPONENT */}
      <CartDrawer
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}

        cart={cart}
        setCart={setCart}

        cartStep={cartStep}
        setCartStep={setCartStep}

        totalCartItems={totalCartItems}
        allChecked={allChecked}

        toggleSelectAll={toggleSelectAll}
        toggleCheckItem={toggleCheckItem}

        handleDecreaseQuantity={handleDecreaseQuantity}
        handleAddToCart={handleAddToCart}
        handleRemoveItem={handleRemoveItem}

        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}

        ecoMetrics={ecoMetrics}
        cartTotal={cartTotal}

        handleCheckout={handleCheckout}

        triggerToast={triggerToast}

        user={user}
        setShowLoginModal={setShowLoginModal}
      />

      {/* 7. QRIS SIMULATION & ecological INVOICE RECEIPT MODAL */}
      <CheckoutModal
        isCheckoutModalOpen={isCheckoutModalOpen}
        checkoutStatus={checkoutStatus}
        countdown={countdown}
        formatTimer={formatTimer}
        handleVerifyPayment={handleVerifyPayment}
        setIsCheckoutModalOpen={setIsCheckoutModalOpen}
        activeReceipt={activeReceipt}
        cartTotal={cartTotal}
        ecoMetrics={ecoMetrics}
        renderAddressDetails={renderAddressDetails}

        discountAmount={discountAmount}
promoDiscount={promoDiscount}
finalTotal={finalTotal}
      />

      {/* 8. FOOTER */}
      <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-2 text-left">
            {/* LOGO OTOMATIS: Memanggil fungsi logo utama agar ikut berganti ke logo.png */}
            {renderLogo()}

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Inovasi e-commerce kearifan lokal Agro-Marina. Dikembangkan secara khusus untuk mendukung pertumbuhan ekonomi lestari, perlindungan pantai dari abrasi, dan pemasaran produk olahan makanan-minuman tanaman mangrove khas pesisir Kota Langsa, Aceh.
            </p>
            <p className="text-xs text-stone-500">
              © {(/* @__PURE__ */ new Date()).getFullYear()} Mangrovise Langsa, Aceh. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>

          <div className="text-left space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Misi Keberlanjutan</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => {
                  setCurrentTab("tentang");
                }} className="hover:text-accent-ochre transition-colors cursor-pointer">
                  Kemitraan Wanita Nelayan
                </button>
              </li>
              <li>
                <button onClick={() => {
                  setCurrentTab("impact");
                }} className="hover:text-accent-ochre transition-colors cursor-pointer">
                  Penyerap Emisi Karbon
                </button>
              </li>
              <li>
                <button onClick={() => {
                  setCurrentTab("tentang");
                }} className="hover:text-accent-ochre transition-colors cursor-pointer">
                  Restorasi Pesisir Langsa
                </button>
              </li>
            </ul>
          </div>

          <div className="text-left space-y-3">
            <h5 className="text-white font-bold text-xs uppercase tracking-wider">Metode Kontak & Lokasi</h5>
            <p className="text-xs text-stone-400 leading-relaxed">
              Koperasi Pesisir Sari Mangrove<br />
              Kuala Langsa, Kota Langsa, Prov. Aceh, Indonesia
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-stone-400">
              <MapPin className="w-3.5 h-3.5 text-accent-ochre shrink-0" />
              <span>Langsa, Aceh</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 9. MODAL LOGIN & REGISTRASI PEMBELI */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}

        email={email}
        setEmail={setEmail}

        password={password}
        setPassword={setPassword}

        showPassword={showPassword}
        setShowPassword={setShowPassword}

        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        isSubmitting={isRegisteringUser}

        authError={authError}

        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />

      {
        /* 9. GLOBAL INTERACTIVE TOAST NOTIFICATIONS */
      }
      <AnimatePresence>
        {toast && <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-50 max-w-sm bg-white rounded-2xl shadow-xl border border-stone-200 p-4 flex items-center space-x-3 text-left"
        >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toast.type === "success" ? "bg-mangrove-light text-mangrove-deep" : "bg-amber-50 text-accent-ochre"}`}>
              {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-stone-900 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>}
      </AnimatePresence>
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        show={showProductDetail}
        product={selectedProduct}
        products={liveProducts}
        onClose={closeProductDetail}
        onAddToCart={handleAddToCart}
        onBuyNow={handleInstantBuy}
        onChangeProduct={openProductDetail}
      />
    </div>
}
