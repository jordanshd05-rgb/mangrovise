import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle, MessageSquareText, Send, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { listenToChatMessages, sendChatMessage } from "../services/chatService";

export default function SellerChatDrawer({ isOpen, onClose, chat, inline = false, onBack }) {
  const { firebaseUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if ((!isOpen && !inline) || !chat || !firebaseUser) return undefined;

    setLoading(true);
    const unsubscribe = listenToChatMessages(chat.id, (liveMessages) => {
      setMessages(liveMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, inline, chat, firebaseUser]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, inline]);

  useEffect(() => {
    if (!bottomRef.current) return;
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isOpen, inline]);

  const handleSend = async () => {
    if (!chat?.id || !firebaseUser || !draft.trim()) return;

    setSending(true);
    try {
      await sendChatMessage({
        chatId: chat.id,
        senderId: firebaseUser.uid,
        senderRole: "seller",
        text: draft.trim(),
      });
      setDraft("");
    } catch (error) {
      console.error("Seller send message failed:", error);
    } finally {
      setSending(false);
    }
  };

  const isSender = (message) => message.senderId === firebaseUser?.uid;

  const header = (
    <div className="flex shrink-0 items-center justify-between border-b border-stone-200 bg-white p-4">
      <div className="flex min-w-0 items-center gap-3">
        {inline && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:bg-stone-100 md:hidden"
            aria-label="Kembali ke daftar chat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-mangrove-deep to-emerald-700 text-white shadow-sm">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div className="min-w-0 text-left">
          <h3 className="truncate text-base font-semibold text-stone-800">{chat?.buyerName || "Pembeli"}</h3>
          <p className="text-xs text-emerald-600">Pelanggan</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-10 w-10 items-center justify-center rounded-full text-stone-600 transition hover:bg-gray-100 hover:text-stone-900"
        aria-label="Tutup chat seller"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
  );

  const body = (
    <>
      {header}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center text-sm text-stone-500">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Memuat percakapan...
          </div>
        ) : messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-center text-sm text-stone-500">
            Belum ada pesan dari pembeli.
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
                    ? "bg-gradient-to-br from-mangrove-deep to-emerald-700 text-white"
                    : "border border-stone-200 bg-white text-stone-800"
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
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

      <div className="shrink-0 border-t border-stone-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Balas pesan pembeli..."
            className="flex-1 rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none transition focus:border-mangrove-deep focus:bg-white"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !draft.trim()}
            aria-label="Kirim balasan seller"
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mangrove-deep text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );

  if (inline) {
    return (
      <div className="flex h-[calc(100vh-80px)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        {body}
      </div>
    );
  }

  const content = (
    <AnimatePresence>
      {isOpen && chat && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex justify-end bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
            className="relative z-[100000] flex h-full w-full flex-col bg-white shadow-2xl sm:w-[400px]"
          >
            {body}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
