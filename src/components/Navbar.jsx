import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  House,
  LayoutGrid,
  Trees,
  TrendingUp,
  ShoppingBag,
  ShoppingCart,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function Navbar({
  currentTab,
  handleTabChange,

  renderLogo,

  user,
  role,
  handleLogout,

  totalCartItems,
  setIsCartOpen,

  setShowLoginModal,

  isMobileMenuOpen,
  setIsMobileMenuOpen,

  showUserMenu,
  setShowUserMenu,
  onOpenSellerRegistration,
  onOpenSellerDashboard,
  onOpenAdminDashboard,
  isAdmin,
  onOpenUserProfile,

  isCheckoutModalOpen,
}) {

  // Nama yang ditampilkan di navbar
  const displayName = user?.email
    ?.split("@")[0]                 // ambil sebelum @
    .replace(/[0-9]/g, "")          // hapus angka
    .replace(/[._-]+/g, " ")        // . _ - menjadi spasi
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const initials = displayName
    ?.split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: 25,
    },
    show: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.08 * index,
        duration: 0.28,
        ease: "easeOut",
      },
    }),
  };

  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
        if (
            userMenuRef.current &&
            !userMenuRef.current.contains(event.target)
        ) {
            setShowUserMenu(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  const [showAnnouncement, setShowAnnouncement] = useState(true);

  const renderBranding = () => (
    <div className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt="Mangrovise"
        className="w-10 h-10 object-contain rounded-xl bg-white p-1"
      />
      <div className="leading-none">
        <div className="font-serif text-xl font-bold tracking-tight">
          <span className="text-white">Mangro</span><span className="text-accent-ochre">Vise</span>
        </div>
        <div className="mt-1 text-[8px] font-semibold tracking-wider text-stone-300">
          LANGSA MANGROVE CO.
        </div>
      </div>
    </div>
  );

 

useEffect(() => {
  const handleScroll = () => {
    setShowAnnouncement(window.scrollY < 10);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  return (
    <>

    <AnimatePresence>
  {showAnnouncement && (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        fixed
        top-0
        left-0
        right-0
        z-[999]

        bg-emerald-950
        border-b border-emerald-900/40

        py-2.5
        px-4
      "
    >
      <div
  className="
    flex
    items-center
    justify-center
    gap-2
    w-full
  "
>

        <span
          className="
            bg-accent-ochre
            text-white
            uppercase
            font-bold
            px-2
            py-0.5
            rounded-full
            flex
            items-center
            gap-1
          "
        >
          <Sparkles className="w-3 h-3" />

          <span className="text-[5px] lg:text-[8px]">
            Eko-Restorasi
          </span>
        </span>

        <span className="text-[8px] lg:text-[12px] text-stone-300">
          Inisiatif Toko Online Lestari: Setiap pembelian menyumbang bibit bakau di pesisir Langsa, Aceh.
        </span>

      </div>
    </motion.div>
  )}

</AnimatePresence>


      {/* 3. STICKY NAVBAR MAIN HEADER WRAPPER */}
      <motion.div
  initial={false}
  animate={{
  y: 0,
  top: showAnnouncement ? 36 : 0,
}}
  transition={{
    y: {
      type: "spring",
      stiffness: 140,
      damping: 24,
      mass: 1.3,
    },
    top: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    },
  }}
  className={`
    fixed
    left-0
    right-0

    z-[995]

    bg-mangrove-deep

    border-b border-white/10

    shadow-[0_8px_32px_rgba(0,0,0,.22)]

    will-change-transform
    transform-gpu

    ${isCheckoutModalOpen ? "pointer-events-none" : ""}
  `}
  
>
        <header className="max-w-7xl mx-auto h-[72px] px-5 sm:px-6 lg:px-8 flex items-center justify-between relative z-10 ">
          <div className="flex items-center">
            {renderBranding()}
          </div>
          
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
            <button
              onClick={() => handleTabChange("beranda")}
              className={`hover:text-accent-ochre transition-colors relative py-1 flex items-center gap-1.5 ${
                currentTab === "beranda"
                  ? "text-accent-ochre font-bold"
                  : "text-stone-200"
              }`}
            >
              <House className="w-4 h-4" />
              <span>Beranda</span>
              {currentTab === "beranda" && (
              <motion.div
                layoutId="navIndicator"
                className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2
                  w-7
                  h-[2px]
                  rounded-full
                  bg-accent-ochre
                "
                />
              )}
            </button>

            <button
              onClick={() => handleTabChange("katalog")}
              className={`hover:text-accent-ochre hover:-translate-y-[1px] transition-colors relative py-1 flex items-center gap-1.5 ${
                currentTab === "katalog"
                  ? "text-accent-ochre font-bold"
                  : "text-stone-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Katalog</span>
              {currentTab === "katalog" && (
                <motion.div
                  layoutId="navIndicator"
                  className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2
                  w-7
                  h-[2px]
                  rounded-full
                  bg-accent-ochre
                "
                />
              )}
            </button>
            
            <button
              onClick={() => handleTabChange("tentang")}
              className={`hover:text-accent-ochre transition-colors relative py-1 flex items-center gap-1.5 ${currentTab === "tentang" ? "text-accent-ochre font-bold" : "text-stone-200"}`}
            >
              <Trees className="w-4 h-4" />
              <span>Tentang Kami</span>
              {currentTab === "tentang" && 
              <motion.div layoutId="navIndicator" 
                className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2
                  w-7
                  h-[2px]
                  rounded-full
                  bg-accent-ochre
                " 
              />}
            </button>

            <button
              onClick={() => handleTabChange("impact")}
              className={`hover:text-accent-ochre hover:-translate-y-[1px] transition-colors relative py-1 flex items-center gap-1.5 ${
                currentTab === "impact"
                  ? "text-accent-ochre font-bold"
                  : "text-stone-200"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Hitung Dampak</span>
              {currentTab === "impact" && (
                <motion.div
                  layoutId="navIndicator"
                  className="
                  absolute
                  -bottom-1
                  left-1/2
                  -translate-x-1/2
                  w-7
                  h-[2px]
                  rounded-full
                  bg-accent-ochre
                "
                />
              )}
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-accent-ochre hover:bg-accent-ochre/90 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center relative group"
              aria-label="Buka Keranjang"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-mangrove-deep text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {totalCartItems}
                </span>
              )}
            </button>

            {user ? (
              <div 
                ref={userMenuRef}
                className="relative hidden md:block">
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="
                        group
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        px-2
                        py-2
                        hover:bg-white/10
                        transition-all
                    "
                >
                    <User
                        className="
                            w-5
                            h-5
                            text-white
                            group-hover:text-accent-ochre
                            transition-colors
                        "
                    />

                    <span
                        className="
                            text-white
                            group-hover:text-accent-ochre
                            transition-colors
                        "
                    >
                        {displayName}
                    </span>

                    <ChevronDown
                        className={`
                            w-4
                            h-4
                            text-white
                            group-hover:text-accent-ochre
                            transition-colors
                            duration-300
                            ${
                                showUserMenu
                                    ? "rotate-180"
                                    : ""
                            }
                        `}
                    />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                      <motion.div
                          initial={{
                              opacity:0,
                              y:8,
                              scale:.96
                          }}

                          animate={{
                              opacity:1,
                              y:0,
                              scale:1
                          }}

                          exit={{
                              opacity:0,
                              y:8,
                              scale:.96
                          }}

                          transition={{
                              duration:.18,
                              ease:"easeOut"
                          }}
                          className="
                            absolute
                            right-0
                            mt-3
                            w-56
                            rounded-2xl
                            bg-white/95
                            backdrop-blur-xl
                            shadow-[0_20px_60px_rgba(0,0,0,.18)]
                            overflow-hidden
                            border
                          "
                      >
                        <div className="px-5 py-4 border-b border-stone-200 bg-stone-50">
                            <p className="font-semibold text-stone-900">
                                {displayName}
                            </p>

                            <p className="text-xs text-stone-500 truncate mt-1">
                                {user.email}
                            </p>
                        </div>

                          <button
                              onClick={onOpenUserProfile}
                              className="
                                w-full flex items-center gap-3 px-5 py-4
                                hover:bg-emerald-50 hover:pl-6 transition-all duration-200
                                text-sm
                              "
                          >
                              <User className="w-4 h-4" />
                              Profil & Pengaturan
                          </button>

                          {isAdmin && (
                                <button
                                  onClick={onOpenAdminDashboard}
                                  className="
                                    w-full flex items-center gap-3 px-5 py-4
                                    hover:bg-emerald-50 hover:pl-6 transition-all duration-200
                                    text-sm
                                  "
                                >
                                  <Sparkles className="w-4 h-4" />
                                  Dashboard Admin
                                </button>
                              )}

                          <button
                              onClick={()=>{
                                  if (role === "seller") {
                                    onOpenSellerDashboard();
                                  } else {
                                    onOpenSellerRegistration();
                                  }
                              }}
                              className="
                                w-full
                                flex
                                items-center
                                gap-3
                                px-5
                                py-4
                                hover:bg-emerald-50
                                hover:pl-6
                                transition-all
                                duration-200
                                text-sm
                              "
                          >
                              <ShoppingBag className="w-4 h-4"/>
                              {role === "seller" ? "Dashboard Toko" : "Daftarkan Toko"}
                          </button>

                          <button
                              onClick={()=>{
                                  handleTabChange("order-history");
                                  setShowUserMenu(false);
                              }}
                              className="
                                w-full
                                flex
                                items-center
                                gap-3
                                px-5
                                py-4
                                hover:bg-emerald-50
                                hover:pl-6
                                transition-all
                                duration-200
                                text-sm
                              "
                          >
                              <ShoppingBag className="w-4 h-4"/>
                                Pesanan Saya
                          </button>

                          <div className="mx-4 border-t border-stone-100"/>

                          <button
                              onClick={()=>{
                                  handleLogout();
                                  setShowUserMenu(false);
                              }}
                              className="
                                w-full
                                flex
                                items-center
                                gap-3
                                px-5
                                py-4
                                hover:bg-red-50
                                hover:pl-6
                                transition-all
                                duration-200
                                text-red-600
                                text-sm
                              "
                          >
                              <LogOut className="w-4 h-4"/>
                                Keluar
                          </button>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="hidden md:block bg-accent-ochre hover:bg-accent-ochre/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Masuk
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-white/10 hover:bg-white/20 border border-white/10 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </header>

        
      </motion.div>




      {/* Mobile Navigation Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
           <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="
                    fixed
                    inset-0
                    z-[998]
                    bg-black/45
                    backdrop-blur-sm
                "
            />
            
            <motion.div
              initial={{
                  x:120,
                  opacity:0
              }}

              animate={{
                  x:0,
                  opacity:1
              }}

              exit={{
                  x:120,
                  opacity:0
              }}
              transition={{
                  type:"spring",
                  stiffness:260,
                  damping:28
              }}

              className="
                fixed
                top-0
                right-0
                bottom-0

                w-[90%]
                max-w-md

                z-[999]
                md:hidden
                overflow-y-auto

                bg-gradient-to-b
                from-[#0d4d40]
                via-[#0c4035]
                to-[#072a23]

                rounded-l-3xl
                shadow-[0_0_80px_rgba(0,0,0,.45)]

                border-l
                border-white/10

                px-6
                pt-6
                pb-10
              "
            >
             
              {/* Header Mobile */}
              <div className="flex items-center justify-between mb-8">

                {/* Logo */}
                <div>
                  {renderBranding()}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                  {/* Cart */}
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                    }}
                    className="
                      relative
                      w-11
                      h-11
                      rounded-2xl
                      bg-accent-ochre
                      flex
                      items-center
                      justify-center
                      shadow-lg
                    "
                  >
                    <ShoppingCart className="w-5 h-5 text-white"/>

                    {totalCartItems > 0 && (
                      <span
                        className="
                          absolute
                          -top-1
                          -right-1
                          w-5
                          h-5
                          rounded-full
                          bg-white
                          text-mangrove-deep
                          text-[10px]
                          font-bold
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {totalCartItems}
                      </span>
                    )}
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-white/10
                      hover:bg-white/20
                      transition-all
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <X className="w-5 h-5 text-white"/>
                  </button>
                </div>
              </div>

             <div className="px-6 pt-6 pb-10"> 
              {user && (
                  <div className="mb-5">
                      <div
                          className="
                              rounded-2xl
                              bg-white/5
                              px-5
                              py-4
                              flex
                              items-center
                              gap-3
                          "

                      >
                          <motion.div
                              initial={{
                                  opacity:0,
                                  y:-20
                              }}
                              animate={{
                                  opacity:1,
                                  y:0
                              }}
                              transition={{
                                  duration:0.35
                              }}

                              className="
                                  w-10
                                  h-10
                                  rounded-full
                                  bg-white/10
                                  border
                                  border-white/10
                                  flex
                                  items-center
                                  justify-center
                              "
                          >
                              <User className="w-5 h-5 text-accent-ochre"/>
                          </motion.div>
                          <div className="flex-1">
                              <p className="text-lg font-bold text-white">
                                  {displayName}
                              </p>

                              <p className="text-xs text-accent-ochre">
                                  Pembeli Mangrovise
                              </p>

                              <p className="text-[11px] text-stone-400 mt-1">
                                  {user.email}
                              </p>
                          </div>
                      </div>
                  </div>
              )}

              <div className="space-y-2 mt-5">

               <motion.button
                custom={0}
                variants={menuItemVariants}
                initial="hidden"
                animate="show"

                onClick={() => {
                  handleTabChange("beranda");
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                    ${
                      currentTab==="beranda"
                      ? "bg-accent-ochre text-white shadow-lg"
                      : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200"
                    }
                `}
              >
                <div className="flex items-center gap-3">
                    <House className="w-5 h-5"/>
                    <span>Beranda</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60"/>
               </motion.button>

               <motion.button
                custom={1}
                variants={menuItemVariants}
                initial="hidden"
                animate="show"

                onClick={() => {
                  handleTabChange("katalog");
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                    ${
                      currentTab==="katalog"
                      ? "bg-accent-ochre text-white shadow-lg"
                      : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200"
                    }
                `}
               >
                <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5"/>
                    <span>Katalog</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60"/>
               </motion.button>

               <motion.button
                custom={2}
                variants={menuItemVariants}
                initial="hidden"
                animate="show"

                onClick={() => {
                  handleTabChange("tentang");
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                    ${
                      currentTab==="tentang"
                      ? "bg-accent-ochre text-white shadow-lg"
                      : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200"
                    }
                `}
               >
                <div className="flex items-center gap-3">
                    <Trees className="w-5 h-5"/>
                    <span>Tentang Kami</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60"/>
               </motion.button>
                
               <motion.button
                custom={3}
                variants={menuItemVariants}
                initial="hidden"
                animate="show"

                onClick={() => {
                  handleTabChange("impact");
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  transition-all
                  bg-emerald-600
                  hover:bg-emerald-500
                  text-white
                  shadow-lg
                    ${
                      currentTab==="impact"
                      ? "bg-accent-ochre text-white shadow-lg"
                      : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200"
                    }
                `}
               >
                <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5"/>
                    <span>Kalkulator Dampak</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-60"/>
               </motion.button>
              </div>

              <div className="my-5 border-t border-white/10"/>

                {user && (
                  <motion.button
                    custom={3}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                    onClick={() => {
                      onOpenUserProfile();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5" />
                      <span>Profil & Pengaturan</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </motion.button>
                )}

                {user && isAdmin && (
                  <motion.button
                    custom={4}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                    onClick={() => {
                      onOpenAdminDashboard();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5" />
                      <span>Dashboard Admin</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60" />
                  </motion.button>
                )}

                {user && (
                  <motion.button
                    custom={5}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"

                    onClick={() => {
                      handleTabChange("order-history");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      flex
                      items-center
                      justify-between
                      w-full
                      px-4
                      py-3
                      rounded-2xl
                      transition-all
                        ${
                          currentTab === "order-history"
                            ? "bg-accent-ochre text-white shadow-lg"
                            : "bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200"
                        }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5"/>
                      <span>Pesanan Saya</span>
                    </div>

                    <ChevronRight className="w-4 h-4 opacity-60"/>
                  </motion.button>
                )}

                {user && (
                  <motion.button
                    custom={6}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="show"
                    onClick={() => {
                      if (role === "seller") {
                        onOpenSellerDashboard();
                      } else {
                        onOpenSellerRegistration();
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-2xl bg-white/5 text-white hover:bg-white/10 hover:translate-x-2 duration-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-5 h-5"/>
                      <span>{role === "seller" ? "Dashboard Toko" : "Daftarkan Toko"}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-60"/>
                  </motion.button>
                )}

              <div className="my-4 border-t border-white/10"/>

              {user && (
                <motion.button
                  custom={5}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="show"

                  onClick={()=>{
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="
                    flex
                    items-center
                    justify-between
                    w-full
                    px-4
                    py-3
                    rounded-2xl
                    bg-red-500/10
                    hover:bg-red-500/20
                    hover:translate-x-2 
                    duration-200
                    text-red-300
                    transition-all
                  "
                >
                  <div className="flex items-center gap-3">
                      <LogOut className="w-5 h-5"/>
                      <span>Keluar</span>
                  </div>

                  <ChevronRight className="w-4 h-4 opacity-60"/>
                </motion.button>
              )}
             </div>


             {!user && (
  <motion.button
    custom={4}
    variants={menuItemVariants}
    initial="hidden"
    animate="show"
    onClick={() => {
      setIsMobileMenuOpen(false);
      setShowLoginModal(true);
    }}
    className="
      flex
      items-center
      justify-between
      w-full
      px-4
      py-3
      rounded-2xl
      bg-accent-ochre
      hover:brightness-110
      text-white
      shadow-lg
      transition-all
    "
  >
    <div className="flex items-center gap-3">
      <LogIn className="w-5 h-5" />
      <span>Masuk</span>
    </div>

    <ChevronRight className="w-4 h-4 opacity-70" />
  </motion.button>
)}


             <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-center text-xs text-stone-500">
                    Mangrovise
                </p>
                <p className="text-center text-[11px] text-stone-600 mt-1">
                    Sustainable Mangrove Marketplace
                </p>
             </div> 
            </motion.div>
          </>)
         }
        </AnimatePresence>




    </>
  );
}