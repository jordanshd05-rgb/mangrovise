import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ref as dbRef, get as dbGet, set as dbSet, onValue as dbOnValue } from "firebase/database";
import { db } from "../firebase";
import { useAuth } from "./AuthContext.jsx";

const EMPTY_ADDRESS = {
  recipientName: "",
  phone: "",
  provinceCity: "",
  addressDetails: "",
  postalCode: "",
};

const CartContext = createContext(null);

export function CartProvider({ children, triggerToast }) {
  const { firebaseUser: user } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartInitialized, setIsCartInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(EMPTY_ADDRESS);
  const [promoDiscount, setPromoDiscount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setIsCartInitialized(false);
      setShippingAddress(EMPTY_ADDRESS);
      return undefined;
    }

    setIsCartInitialized(false);
    const cartRef = dbRef(db, `carts/${user.uid}`);

    dbGet(cartRef)
      .then((snapshot) => {
        const data = snapshot.val();
        setCart(Array.isArray(data) ? data : []);
        setIsCartInitialized(true);
      })
      .catch((err) => {
        console.error("Error loading cart from database:", err);
        setCart([]);
        setIsCartInitialized(true);
      });

    return undefined;
  }, [user]);

  useEffect(() => {
    if (!user || !isCartInitialized) return undefined;

    const cartRef = dbRef(db, `carts/${user.uid}`);
    dbSet(cartRef, cart).catch((err) => {
      console.error("Error saving cart to database:", err);
    });

    return undefined;
  }, [cart, user, isCartInitialized]);

  useEffect(() => {
    if (!user) {
      setShippingAddress(EMPTY_ADDRESS);
      return undefined;
    }

    const addressRef = dbRef(db, `users/${user.uid}/profile/address`);
    const unsubscribe = dbOnValue(addressRef, (snapshot) => {
      const data = snapshot.val();
      setShippingAddress(
        data
          ? {
              recipientName: data.recipientName || "",
              phone: data.phone || "",
              provinceCity: data.provinceCity || "",
              addressDetails: data.addressDetails || "",
              postalCode: data.postalCode || "",
            }
          : { ...EMPTY_ADDRESS }
      );
    });

    return () => unsubscribe();
  }, [user]);

  const cartTotal = useMemo(() => {
    return cart
      .filter((item) => item.checked !== false)
      .reduce((sum, item) => sum + (Number(item.product?.price) || 0) * Number(item.quantity || 0), 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return cartTotal * promoDiscount / 100;
  }, [cartTotal, promoDiscount]);

  const finalTotal = useMemo(() => {
    return cartTotal - discountAmount;
  }, [cartTotal, discountAmount]);

  const totalCartItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }, [cart]);

  const checkedCartItemsCount = useMemo(() => {
    return cart
      .filter((item) => item.checked !== false)
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0);
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
        item.product.id === productId
          ? { ...item, checked: item.checked === false ? true : false }
          : item
      )
    );
  };

  const toggleSelectAll = () => {
    setCart((prev) => prev.map((item) => ({ ...item, checked: !allChecked })));
  };

  const handleAddToCart = (product) => {
    if (!user) {
      triggerToast?.("Silakan masuk terlebih dahulu untuk menambahkan produk ke keranjang.", "info");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast?.(`Jumlah ${product.name} ditambah di keranjang!`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, checked: true }
            : item
        );
      }

      triggerToast?.(`Berhasil menambahkan ${product.name} ke keranjang!`);
      return [...prev, { product, quantity: 1, checked: true }];
    });
  };

  const handleDecreaseQuantity = (productId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (!existing) return prev;

      if (existing.quantity === 1) {
        triggerToast?.("Produk dihapus dari keranjang.", "info");
        return prev.filter((item) => item.product.id !== productId);
      }

      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        triggerToast?.(`${item.product.name} dihapus dari keranjang.`, "info");
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const handleInstantBuy = (product) => {
    if (!user) {
      triggerToast?.("Silakan masuk terlebih dahulu untuk membeli produk secara instan.", "info");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        triggerToast?.(`Jumlah ${product.name} ditambah di keranjang!`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, checked: true }
            : item
        );
      }

      triggerToast?.(`Berhasil menambahkan ${product.name} ke keranjang!`);
      return [...prev, { product, quantity: 1, checked: true }];
    });
    setIsCartOpen(true);
  };

  const clearCart = async () => {
    setCart([]);

    if (!user) return;

    const cartRef = dbRef(db, `carts/${user.uid}`);
    try {
      await dbSet(cartRef, []);
    } catch (error) {
      console.error("Error clearing cart from database:", error);
    }
  };

  const value = {
    cart,
    setCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    cartStep,
    setCartStep,
    shippingAddress,
    setShippingAddress,
    promoDiscount,
    setPromoDiscount,
    cartTotal,
    discountAmount,
    finalTotal,
    totalCartItems,
    checkedCartItemsCount,
    ecoMetrics,
    allChecked,
    toggleCheckItem,
    toggleSelectAll,
    handleAddToCart,
    handleDecreaseQuantity,
    handleRemoveItem,
    handleInstantBuy,
    isCartInitialized,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return context;
}
