import {
    Sparkles,
    ArrowRight,
    Store,
    Leaf,
    Trees,
    MapPinned,
    Star,
    Stars,
    StarIcon,
    Crown,
    MapPinHouse,
    Map,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PromoSection({
    ASSET_CONFIG,
    user,
    handleAddToCart,
    setShowLoginModal,

    triggerToast,
    setIsCartOpen,
    setPromoDiscount,
}) {

    const features = [
        {
            title: "Produk UMKM Lokal",
            description:
            "Seluruh produk berasal dari pelaku UMKM Kota Langsa sehingga setiap pembelian turut mendukung pertumbuhan ekonomi masyarakat pesisir.",
            icon: Store,
            color: "text-emerald-500",
            accent: "bg-emerald-500",
            badge: "bg-emerald-50 text-emerald-700",
            indicator: "bg-emerald-500",
        },

        {
            title: "100% Organik",
            description:
            "Diproses tanpa bahan pengawet maupun pewarna buatan sehingga aman dikonsumsi setiap hari.",
            icon: Leaf,
            color: "text-lime-500",
            accent: "bg-lime-500",
            badge: "bg-lime-50 text-lime-700",
            indicator: "bg-lime-500",
        },

        {
            title: "Konservasi Mangrove",
            description:
            "Sebagian keuntungan digunakan untuk mendukung pelestarian kawasan mangrove Kota Langsa.",
            icon: Trees,
            color: "text-teal-500",
            accent: "bg-teal-500",
            badge: "bg-teal-50 text-teal-700",
            indicator: "bg-teal-500",
        },

        {
            title: "Oleh-oleh Khas Aceh",
            description:
            "Menghadirkan cita rasa khas pesisir Langsa yang cocok dijadikan buah tangan maupun konsumsi keluarga.",
            icon: MapPinned,
            color: "text-amber-500",
            accent: "bg-amber-500",
            badge: "bg-amber-50 text-amber-700",
            indicator: "bg-amber-500",
        },
    ];

    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % features.length);
        }, 7000);

        return () => clearInterval(interval);
    }, []);

    const feature = features[currentFeature];
    const Icon = feature.icon;

    return (
        <div
            className="
                grid
                grid-cols-1
                lg:grid-cols-5
                gap-8
                lg:gap-16
                items-stretch
                px-4
                lg:px-16 
                pt-0 pb-0
            "
        >

         <div
            className="
                lg:col-span-3
                rounded-3xl
                overflow-hidden
                bg-mangrove-deep
                text-white
                relative
                min-h-[400px]
                flex
                flex-col
                justify-end
                p-8
                border
                border-white/10
                shadow-xl
                group
            "
        >
            <div className="absolute inset-0">
                <img
                  src={ASSET_CONFIG.promoBanners.leftBig}
                  alt="Eco Mangrove Harvest Promotion"
                  className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t 
                  from-mangrove-deep via-mangrove-deep/60 to-transparent" 
                ></div>
            </div>
                
            <div className="relative z-10 space-y-4 text-left">
                <div className="inline-flex items-center space-x-1.5 bg-accent-ochre text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3 h-3 text-white animate-spin" />
                    <span>Promo Spesial</span>
                </div>
                  
                <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                    Eco Saver Pack: Hidup Sehat & Berdampak
                </h4>
                  
                <p className="text-xs text-stone-300 leading-relaxed">
                   Dapatkan potongan khusus untuk bundling Sirup & Dodol. Otomatis menanam 3 bibit mangrove sekaligus untuk penguatan garis pantai Langsa.
                </p>
                  
                <div className="pt-2">
                    <button
                        onClick={() => {

    if (!user) {
        triggerToast(
            "Silakan masuk terlebih dahulu.",
            "info"
        );

        setShowLoginModal(true);

        return;
    }

    const bundleProducts =
        ASSET_CONFIG.products.filter(product =>
            product.name.includes("Sirup") ||
            product.name.includes("Dodol")
        );

    bundleProducts.forEach(product =>
        handleAddToCart(product)
    );

    setPromoDiscount(15);

    setIsCartOpen(true);

    triggerToast(
        "Promo Bundling 15% berhasil diterapkan!"
    );
}}
                        className="bg-accent-ochre hover:bg-accent-ochre/95 text-white font-bold text-xs py-3 px-5 rounded-xl transition-all shadow-md flex items-center space-x-2 w-full justify-center group"
                    >
                      <span>Beli Paket Bundling (Hemat 15%)</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
         </div>

         {/* RIGHT VALUE CARD */}
         <div
            className="
                lg:col-span-2
                rounded-3xl
                bg-white
                border
                border-stone-200
                shadow-lg
                p-7
                flex
                flex-col
                justify-between
            "
         >
            {/* Header */}
            <div className="space-y-4">

                {/* Badge */}
                <div
                    className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1
                        text-[11px]
                        font-semibold
                        transition-all
                        duration-500
                        ${feature.badge}
                    `}
                >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Keunggulan</span>
                </div>

                {/* Judul */}
                <h3
                    className="
                    text-[23px]
                    lg:text-[25px]
                    font-serif
                    font-bold
                    leading-tight
                    text-mangrove-deep
                    "
                >
                    Mengapa Memilih Mangrovise?
                </h3>

                {/* Deskripsi */}
                <p
                    className="
                    text-[12px]
                    lg:text-[13px]
                    leading-6
                    text-stone-500
                    max-w-sm
                    "
                >
                    Menghadirkan produk olahan mangrove berkualitas tinggi dengan tetap 
                    menjaga kelestarian ekosistem pesisir dan mendukung pertumbuhan UMKM lokal.
                </p>

            </div>

          <div className="mt-8">

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentFeature}
                        initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        y: -20,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="
                        relative
                        overflow-visible
                        rounded-3xl
                        border
                        border-stone-200
                        bg-stone-50
                        p-7
                        min-h-[220px]
                        lg:min-h-[240px]
                    "
                >
                    {/* Floating Icon */}
                    <div
                        className="
                            absolute
                            -top-2
                            -left-2
                            z-20
                        "
                    >
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 6, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Icon
                                className={`
                                    w-8
                                    h-8
                                    ${feature.color}
                                    drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]
                                `}
                            />
                        </motion.div>
                    </div>

                    <div className="relative z-10 flex gap-1">
                        {features.map((_, index) => (
                            <div
                                key={index}
                                    className={`
                                        h-2
                                        rounded-full
                                        transition-all
                                        duration-500

                                        ${
                                        currentFeature === index
                                            ? `w-8 ${feature.indicator}`
                                            : "w-2 bg-stone-300"
                                        }
                                `}
                            />
                        ))}
                    </div>

                    <div
                        className="
                            absolute
                            -bottom-3
                            -right-3
                            z-20
                        "
                    >
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, -6, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Icon
                                className={`
                                    w-10
                                    h-10
                                    ${feature.color}
                                    drop-shadow-[0_10px_18px_rgba(0,0,0,0.18)]
                                `}
                            />
                        </motion.div>
                    </div>
                    
                    <h4
                        className="
                            text-[16px]
                            lg:text-[18px]
                            font-bold
                            text-mangrove-deep
                            relative
                            z-10
                            mt-8
                        "
                    >
                        {feature.title}
                    </h4>
                    <p
                        className="
                            mt-3
                            lg:mt-4
                            text-[11px]
                            lg:text-[13px]
                            leading-5
                            lg:leading-6
                            text-stone-600
                            relative
                            z-10
                        "
                    >
                        {feature.description}
                    </p>

                </motion.div>
                
            </AnimatePresence>

          </div>
         </div> 

        </div>

        
    );
}