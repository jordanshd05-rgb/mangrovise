/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Widget Chat Floating MangroBot - Asisten AI Mangrovise Langsa
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  X,
  Loader2,
  Leaf,
  Sparkles,
} from "lucide-react";
import { askMangroBot } from "../services/aiService.js";

const QUICK_SUGGESTIONS = [
  "Manfaat Buah Lindur?",
  "Cara Hitung Dampak?",
  "Cara Kerja Pohon Virtual?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Halo! Saya MangroBot 🌿\nAsisten AI resmi Mangrovise Langsa.\nTanya saya tentang mangrove, produk, dampak, atau gamifikasi!",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll ke pesan terbaru
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, showSuggestions, scrollToBottom]);

  // Focus input saat chat dibuka
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Kirim pesan pengguna
  const sendMessage = async (suggestedText) => {
    const trimmed = (suggestedText ?? input).trim();
    if (!trimmed || submitting) return;

    const userMessage = trimmed;
    setInput("");
    setSubmitting(true);
    setShowSuggestions(true);

    // Tambahkan pesan user
    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userMessage,
      time: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Panggil AI
      const history = messages.map((m) => ({
        sender: m.role === "assistant" ? "assistant" : "user",
        text: m.text,
      }));

      const reply = await askMangroBot(userMessage, history);

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        text: reply,
        time: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: `error-${Date.now()}`,
        role: "assistant",
        text: "Maaf, MangroBot mengalami kendala. Silakan coba lagi nanti. 🌿",
        time: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setSubmitting(false);
    }
  };

  // Tangani Enter (submit tanpa shift)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Kirim quick suggestion sebagai pesan
  const useQuickSuggestion = async (text) => {
    await sendMessage(text);
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) setShowSuggestions(true);
      return next;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Jendela Chat (muncul di atas floating button) */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-3xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-mangrove-deep text-white px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold">MangroBot</p>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition"
              aria-label="Tutup chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Area Pesan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50 scrollbar-thin scrollbar-track-stone-100 scrollbar-thumb-stone-300">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-sm shadow-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-mangrove-deep text-white rounded-br-md"
                      : "bg-white text-stone-800 border border-stone-200 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] text-right ${
                      msg.role === "user" ? "text-emerald-200" : "text-stone-400"
                    }`}
                  >
                    {msg.time
                      ? msg.time.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "baru saja"}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {submitting && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-md px-3 py-2.5 flex items-center gap-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-mangrove-deep" />
                  <span className="text-xs text-stone-400">MangroBot sedang memikirkan...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && messages.length > 0 && (
            <div className="px-4 py-2 bg-white border-t border-stone-100">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <Sparkles className="w-3 h-3 text-mangrove-deep shrink-0" />
                {QUICK_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => useQuickSuggestion(suggestion)}
                    className="shrink-0 rounded-full px-3 py-1 text-[11px] font-medium text-mangrove-deep bg-mangrove-light/40 hover:bg-mangrove-light/70 transition-colors focus:outline-none focus:ring-1 focus:ring-mangrove-deep/30"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-stone-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan untuk MangroBot..."
                className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-mangrove-deep focus:ring-1 focus:ring-mangrove-deep/20 transition"
                disabled={submitting}
                aria-label="Ketik pesan untuk MangroBot"
                autoComplete="off"
              />
              <button
                onClick={sendMessage}
                disabled={submitting || !input.trim()}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-mangrove-deep text-white disabled:cursor-not-allowed disabled:opacity-60 hover:bg-mangrove-dark transition-colors"
                aria-label="Kirim pesan"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 bg-mangrove-deep text-white rounded-full shadow-2xl pl-3 pr-4 py-2.5 hover:bg-mangrove-dark transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mangrove-deep/40 focus:ring-offset-2"
        aria-label="Buka chat MangroBot"
      >
        <div className="relative">
          <Leaf className="w-5 h-5" />
          <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-mangrove-deep" />
        </div>
        <span className="text-sm font-semibold whitespace-nowrap">
          AI MangroBot 🌿
        </span>
      </button>
    </div>
  );
}