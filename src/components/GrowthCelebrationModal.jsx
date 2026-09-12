import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trees, X } from "lucide-react";
import { getStageMeta } from "../services/gamificationService.js";

export default function GrowthCelebrationModal({ isOpen, stage, onClose, points = 0 }) {
  const meta = getStageMeta(stage || "benih");

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeTimer = setTimeout(() => {
      onClose?.();
    }, 3500);

    return () => clearTimeout(closeTimer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 28, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 16, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-[28px] border border-emerald-200 bg-white p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  {meta.emoji}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Level Up!</p>
                  <h3 className="mt-1 text-xl font-serif font-bold text-mangrove-deep">Pohon Anda tumbuh</h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-stone-200 p-2 text-stone-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-lime-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">Stage baru</p>
                  <p className="mt-2 text-2xl font-bold text-mangrove-deep">{meta.label}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                  <Trees className="h-6 w-6 text-emerald-700" />
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <Sparkles className="h-3.5 w-3.5" />
                +{points} poin untuk pertumbuhan pohon
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-mangrove-deep px-4 py-3 text-sm font-bold text-white"
            >
              Lanjutkan
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
