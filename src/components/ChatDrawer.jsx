import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageSquareText, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { getOrCreateChat, listenToChatMessages, sendChatMessage } from "../services/chatService";

export default function ChatDrawer({
  isOpen,
  onClose,
  product,
  seller,
  productId: productIdProp,
  sellerId: sellerIdProp,
  onRequireLogin,
}) {
  const { firebaseUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);
  const unsubscribeRef = useRef(() => {});

  const resolvedProductId = productIdProp ?? product?.id ?? product?.productId ?? product?.slug ?? "product-default";
  const resolvedSellerId = sellerIdProp ?? seller?.uid ?? seller?.id ?? product?.sellerId ?? product?.userId ?? "admin-seller";

  useEffect(() => {
    if (!isOpen || !product || !firebaseUser || !seller || !resolvedProductId || !resolvedSellerId) {
      if (isOpen && !firebaseUser) {
        onRequireLogin?.();
      }
      return undefined;
    }

    let cancelled = false;

    const initChat = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const { id } = await getOrCreateChat({
          productId: resolvedProductId,
          buyerId: firebaseUser.uid,
          sellerId: resolvedSellerId,
          productName: product.name,
          buyerName: firebaseUser.displayName || firebaseUser.email || "Pembeli",
          sellerName: seller.name || seller.storeName || "Seller",
        });

        if (cancelled) return;

        setChatId(id);
      } catch (error) {
        console.error("Chat init failed:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      cancelled = true;
      unsubscribeRef.current();
      unsubscribeRef.current = () => {};
    };
  }, [isOpen, product, seller, firebaseUser, resolvedProductId, resolvedSellerId, onRequireLogin]);

  useEffect(() => {
    if (!isOpen || !chatId) return undefined;

    unsubscribeRef.current();
    unsubscribeRef.current = listenToChatMessages(chatId, (liveMessages) => {
      setMessages(liveMessages);
    });

    return () => {
      unsubscribeRef.current();
      unsubscribeRef.current = () => {};
    };
  }, [isOpen, chatId]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getOrCreateChatSession = async () => {
    if (chatId) return chatId;

    if (!firebaseUser?.uid) {
      return null;
    }

    const buyerId = firebaseUser.uid;
    const targetSellerId = sellerIdProp ?? seller?.uid ?? seller?.id ?? product?.sellerId ?? product?.userId ?? "admin-seller";
    const targetProductId = productIdProp ?? product?.id ?? product?.productId ?? product?.slug ?? "product-default";

    try {
      const payload = {
        productId: targetProductId,
        buyerId,
        sellerId: targetSellerId,
        productName: product?.name || "Produk",
        buyerName: firebaseUser.displayName || firebaseUser.email || "Pembeli",
        sellerName: seller?.name || seller?.storeName || "Seller",
      };

      const { id } = await getOrCreateChat(payload);
      setChatId(id);
      return id;
    } catch (error) {
      console.error("Chat session creation failed:", error);
      return null;
    }
  };

  const handleSend = async () => {
    if (!firebaseUser?.uid) {
      if (typeof window !== "undefined") {
        window.alert("Silakan login terlebih dahulu untuk mengirim pesan.");
      }
      onRequireLogin?.();
      return;
    }

    const text = draft.trim();
    if (!text) return;

    const sellerId = sellerIdProp ?? seller?.uid ?? seller?.id ?? product?.sellerId ?? product?.userId ?? "admin-seller";
    console.log("Status Auth User:", firebaseUser?.uid);
    console.log("Target Seller ID:", sellerId);

    setSending(true);

    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      senderId: firebaseUser.uid,
      senderRole: "buyer",
      text,
      createdAt: new Date(),
      temporary: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setDraft("");

    try {
      let activeChatId = chatId;

      if (!activeChatId) {
        activeChatId = await getOrCreateChatSession();
      }

      if (!activeChatId) {
        console.error("Chat session unavailable while sending message.", {
          productId: productIdProp ?? product?.id ?? product?.productId ?? product?.slug,
          sellerId,
          buyerId: firebaseUser.uid,
        });
        return;
      }

      await sendChatMessage({
        chatId: activeChatId,
        senderId: firebaseUser.uid,
        senderRole: firebaseUser.uid === resolvedSellerId ? "seller" : "buyer",
        text,
      });
    } catch (error) {
      console.error("Firestore Write Error:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id));
      if (typeof window !== "undefined") {
        const firebaseMessage = error?.message || "Firebase error tidak diketahui.";
        const message = `Firestore Error: ${firebaseMessage}`;
        window.alert(message);
      }
    } finally {
      setSending(false);
    }
  };

  const currentSellerId = resolvedSellerId;

  const isSender = (message) => message.senderId === firebaseUser?.uid;

  if (!isOpen) return null;

  const drawerContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[99998]"
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          onClick={(event) => event.stopPropagation()}
          className="fixed top-0 right-0 z-[99999] flex h-full w-full flex-col bg-white shadow-2xl sm:w-[400px]"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mangrove-deep text-white shadow-sm">
                <MessageSquareText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-stone-900">{seller?.name || seller?.storeName || "Seller"}</p>
                <p className="text-[11px] text-stone-500">{product?.name || "Produk"}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-mangrove-deep/30"
              aria-label="Tutup chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-stone-50 p-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Menyiapkan chat...
              </div>
            ) : messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-center text-sm text-stone-500">
                Belum ada pesan. Mulai percakapan dengan seller sekarang.
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isSender(message) ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                      isSender(message)
                        ? "bg-mangrove-deep text-white"
                        : "bg-white text-stone-800 border border-stone-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`mt-1 text-[10px] ${isSender(message) ? "text-emerald-100" : "text-stone-400"}`}>
                      {message.createdAt
                        ? new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "baru saja"}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} className="h-1" />
          </div>

          <div className="border-t border-stone-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (!sending && draft.trim()) {
                      handleSend();
                    }
                  }
                }}
                placeholder="Ketik pesan untuk seller..."
                className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-mangrove-deep"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={sending || !draft.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-deep text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
