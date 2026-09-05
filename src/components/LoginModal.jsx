import {
  Leaf,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function LoginModal({
  showLoginModal,
  setShowLoginModal,

  email,
  setEmail,

  password,
  setPassword,

  showPassword,
  setShowPassword,

  isRegistering,
  setIsRegistering,
  isSubmitting,

  authError,

  handleLogin,
  handleRegister,
}) {

    if (!showLoginModal) return null;

    return (
      <>
        <AnimatePresence>
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginModal(false)}
              className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-stone-200 overflow-hidden z-10"
            >
              {/* Pattern Header */}
              <div className="bg-mangrove-deep p-8 text-white relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-ochre/10 rounded-bl-full pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2 text-accent-ochre">
                    <Leaf className="w-5 h-5 animate-bounce" />
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-accent-ochre">E-Commerce Lestari</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold tracking-tight">
                    {isRegistering ? "Gabung Mangrovise" : "Selamat Datang"}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {isRegistering 
                      ? "Daftar akun pembeli untuk melacak pesanan dan donasi bibit bakau secara real-time."
                      : "Masuk untuk melanjutkan transaksi dan meninjau sertifikat kontribusi ekologi Anda."}
                  </p>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="p-8 space-y-5 text-left">
                {authError && (
                  <div className="bg-red-50 text-red-800 text-xs p-4 rounded-2xl border border-red-200 font-medium">
                    {authError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-4 pr-11 py-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-accent-ochre/20 focus:border-accent-ochre transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1 flex items-center justify-center cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-mangrove-deep hover:bg-mangrove-deep/90 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <span>
                    {isSubmitting
                      ? "Mendaftarkan..."
                      : isRegistering
                        ? "Mulai Konservasi & Daftar"
                        : "Masuk ke Akun"}
                  </span>
                </button>

                {/* Switcher Option */}
                <div className="text-center pt-2">
                  <p className="text-xs text-stone-500">
                    {isRegistering ? "Sudah memiliki akun?" : "Belum bergabung?"}{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegistering(!isRegistering);
                        setAuthError("");
                      }}
                      className="text-accent-ochre font-bold hover:underline"
                    >
                      {isRegistering ? "Masuk Sekarang" : "Daftar Akun Baru"}
                    </button>
                  </p>
                </div>
              </form>

              {/* Close Button top corner */}
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </motion.div>
          </div>
      </AnimatePresence>
    </>
)}