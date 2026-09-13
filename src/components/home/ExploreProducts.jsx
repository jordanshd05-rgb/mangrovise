import { useEffect, useState } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useTransform,
    animate
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function ExploreProducts({
    products,
    productsLoading,
    openProductDetail,
    handleTabChange,
}) {

    const [direction, setDirection] = useState(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isTouching, setIsTouching] = useState(false);

    const dragX = useMotionValue(0);
    const safeProducts = Array.isArray(products) ? products.filter(Boolean).filter((product) => product && product.id) : [];

    useEffect(() => {
        setActiveIndex(0);
    }, [products?.length]);

    const rotate = useTransform(
        dragX,
        [-150, 0, 150],
        [-10, 0, 10]
    );

    const scale = useTransform(
        dragX,
        [-150, 0, 150],
        [0.96, 1, 0.96]
    );

    {/*auto-slide*/}
    useEffect(() => {
        if (isHovered || isTouching || safeProducts.length <= 1) return;
        const interval = setInterval(() => {
            setDirection(1);
            setActiveIndex(prev =>
                (prev + 1) % safeProducts.length
            );
        }, 4000);
        return () => clearInterval(interval);
    }, [safeProducts.length, isHovered, isTouching]);

    {/*for-mobile*/}
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () =>
            window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        if (safeProducts.length <= 1) return;
        setDirection(1);

        setActiveIndex((prev) =>
            (prev + 1) % safeProducts.length
        );
    };

    const prevSlide = () => {
        if (safeProducts.length <= 1) return;
        setDirection(-1);

        setActiveIndex((prev) =>
            (prev - 1 + safeProducts.length) % safeProducts.length
        );
    };

    if (productsLoading) {
        return (
            <section className="px-6 py-24 text-center">
                <p className="text-sm font-semibold text-stone-500">Memuat produk seller...</p>
            </section>
        );
    }

    const visibleProducts = safeProducts.length
        ? [
            safeProducts[(activeIndex - 1 + safeProducts.length) % safeProducts.length],
            safeProducts[activeIndex % safeProducts.length],
            safeProducts[(activeIndex + 1) % safeProducts.length],
        ]
        : [];

    if (safeProducts.length === 0) {
        return (
            <section className="px-6 py-24 text-center">
                <p className="text-sm font-semibold text-stone-500">Belum ada produk aktif dari seller.</p>
            </section>
        );
    }

    const getCardStyle = (index) => {
        if (isMobile) {
            switch (index) {
                case 0:
                    return {
                        x:0,
                        y:-30,
                        scale:0.84,
                        rotate:0,
                        rotateY:0,
                        opacity:.38,
                        zIndex:1,
                        filter:"blur(2px)"
                    };
                case 1:
                    return {
                        x:0,
                        y:-12,
                        scale:.92,
                        rotate:0,
                        rotateY:0,
                        opacity:.72,
                        zIndex:2,
                        filter:"blur(1px)"
                    };
                default:
                    return {
                        x:0,
                        y:8,
                        scale:1,
                        rotate:0,
                        rotateY:0,
                        opacity:1,
                        zIndex:3,
                        filter:"blur(0px)"
                    };
            }
        }
        switch(index){
            case 0:
                return {
                    x: -260,
                    y: 25,
                    scale: .82,
                    rotate: -8,
                    rotateY: 35,
                    opacity: .55,
                    filter:"blur(1px) brightness(.88)",
                    zIndex:1
                };
            case 1:
                return{
                    x:0,
                    y:0,
                    scale:1,
                    rotate:0,
                    rotateY:0,
                    opacity:1,
                    filter:"blur(0px)",
                    zIndex:5
                };
            case 2:
                return{
                    x:260,
                    y:25,
                    scale:.82,
                    rotate:8,
                    rotateY:-35,
                    opacity:.55,
                    filter:"blur(1px) brightness(.88)",
                    zIndex:1
                };
        }
    }

    const ProductCard = ({ product, isCenter = false }) => (
        <div
            className={`
                group
                bg-white
                rounded-[2rem]
                overflow-hidden
                border border-stone-200

                ${
                    isCenter
                        ? "shadow-[0_35px_80px_rgba(0,0,0,0.22)]"
                        : "shadow-[0_12px_25px_rgba(0,0,0,0.10)]"
                }

                transition-all
                duration-500
                hover:z-50
                ${
                    isCenter
                        ? "hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[0_12px_25px_rgba(0,0,0,0.28)]"
                        : ""
                }
            `}
        >
            {/* Gambar */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={product?.image || "images/Sirup.jpeg"}
                    alt={product?.name || "Produk Mangrovise"}
                    className={`
                        w-full
                        h-full
                        object-cover
                        duration-700
                        group-hover:scale-110
                        ${
                            isCenter
                                ? ""
                                : "blur-[1px] brightness-90 saturate-75"
                            }
                    `}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {product?.badge && (
                    <span className="absolute top-4 right-4 bg-accent-ochre text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                        {product.badge}
                    </span>
                )}
                <div className="absolute bottom-4 left-4 bg-mangrove-deep/90 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    🌿 +1 Bibit
                </div>
            </div>

            {/* Isi */}
            <div className="p-6 space-y-4">
                <div>
                    <span className="text-xs uppercase text-stone-400 font-bold tracking-wider">
                        {product?.category || "Produk"}
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-2">
                        {product?.name || "Produk Mangrovise"}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-accent-ochre mt-2">
                        {product?.storeName || "Toko Mangrovise"}
                    </p>
                    <p className="text-sm text-stone-500 mt-2 line-clamp-2">
                        {product?.description || "Deskripsi produk belum tersedia."}
                    </p>
                </div>
                
                {/* ===== DESKTOP ===== */}
                <div className="hidden md:flex items-center justify-between mt-5">
                    <div>
                        <span
    className={`
        block
        uppercase
        tracking-wider
        text-stone-400
        font-bold
        transition-all
        duration-500
        ${isCenter ? "text-[10px]" : "text-[9px]"}
    `}
>
    Harga
</span>
                        <span
    className={`
        font-mono
        font-bold
        text-mangrove-deep
        transition-all
        duration-500
        ${isCenter ? "text-[18px]" : "text-[15px]"}
    `}
>
    Rp {Number(product?.price || 0).toLocaleString("id-ID")}
</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTabChange("katalog");
                        }}
                        className="
                            bg-mangrove-deep
                            text-[12px]
                            text-white
                            px-5
                            py-2
                            rounded-xl
                            flex
                            items-center
                            gap-3
                            hover:bg-mangrove-deep/90
                            transition
                            whitespace-nowrap
                        "
                    >
                        Jelajahi Katalog
                        <ArrowRight className="w-3 h-3"/>
                    </button>
                </div>

                {/* ===== MOBILE ===== */}
                <div className="md:hidden mt-5 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-stone-400 font-bold">
                            Harga
                        </span>
                        <span className="text-[20px] font-bold leading-none text-mangrove-deep whitespace-nowrap">
                            Rp {Number(product?.price || 0).toLocaleString("id-ID")}
                        </span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleTabChange("katalog");
                        }}
                        className="
                            h-9
                            px-4
                            rounded-3xl
                            bg-mangrove-deep
                            text-white
                            text-[12px]
                            font-semibold
                            flex
                            items-center
                            gap-2
                            whitespace-nowrap
                            hover:bg-mangrove-deep/90
                            transition
                        "
                    >
                        Katalog
                        <ArrowRight className="w-3.5 h-3.5"/>
                    </button>
                </div>

            </div>
        </div>
    );

    const handleSwipe = (offset) => {
        if (offset < -90) {
            nextSlide();
        }
        if (offset > 90) {
            prevSlide();
        }
        animate(dragX, 0, {
            type: "spring",
            stiffness: 250,
            damping: 25
        });
        setTimeout(() => {
            setIsTouching(false);
        }, 4000);
    };

    const centerIndex = isMobile ? 2 : 1;

    return (
        <section
    className="
        pt-20
        pb-24
        md:pt-24
        md:pb-20
        overflow-hidden
        px-6
        lg:px-24
    "
>
            {/*Judul*/}
            <div className="text-center mb-8 lg:mb-10">
                <p className="uppercase tracking-[0.35em] text-xs font-bold text-mangrove-deep">
                    PRODUK UNGGULAN
                </p>
                <h2 className="font-serif text-3xl md:text-5xl font-bold mt-4">
                    Eksplor Produk Mangrovise
                </h2>
                <p
  className="
    mt-5
    mx-auto
    max-w-[380px]
    lg:max-w-xl
    text-center
    text-[15px]
    lg:text-xl
    leading-[1.7]
    text-stone-500
  "
>
    Temukan berbagai produk olahan mangrove  
    <br />
    terbaik hasil UMKM Kota Langsa.
</p>
            </div>

            {/*Carousel*/}
            <div
                className={`
                    relative
                    ${isMobile ? "h-[560px]" : "h-[560px]"}
                    flex
                    items-center
                    justify-center
                `}
                style={{
                    perspective:isMobile
                        ? "1000px"
                        : "1800px"
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <>
                    {visibleProducts.map((product,index)=>(
    <motion.div
        key={`${product.id}-${index}`}
                            custom={direction}
                            initial={false}
                            animate={getCardStyle(index)}
                            transition={{
    type: "spring",
    stiffness: 55,
    damping: 20,
    mass: 1,
}}
                            style={
                                isMobile && index === centerIndex
                                    ? {
                                        x: dragX,
                                        rotate,
                                        scale,
                                        touchAction:"pan-y"
                                    }
                                    : {}
                            }
                            className={`absolute transition-all cursor-grab active:cursor-grabbing ${
                                isMobile
                                    ? "w-[290px]"
                                    : index===centerIndex
                                        ? "w-[380px]"
                                        : "w-[300px]"
                            }`}
                            onClick={()=>{
                                if(index===centerIndex)
                                openProductDetail(product)
                            }}
                            drag={
                                isMobile && index === centerIndex
                                    ? "x"
                                    : false
                                }

                            dragConstraints={{
                                left: 0,
                                right: 0
                            }}

                            dragElastic={0.15}

                            onDragEnd={(event, info) => {
                                handleSwipe(info.offset.x);
                            }}

                            onTouchStart={() => {
                                if (isMobile) {
                                    setIsTouching(true);
                                }
                            }}

                            onTouchEnd={() => {
                                if (isMobile) {
                                    setTimeout(() => {
                                        setIsTouching(false);
                                    }, 4000);
                                }
                            }}
                        >
                            <ProductCard
                                product={product}
                                isCenter={index===centerIndex}
                            />
                            {index === centerIndex && (
                                <motion.div
                                    className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-r from-mangrove-deep/15 via-accent-ochre/20 to-mangrove-deep/15 blur-3xl"
                                    animate={{
                                        opacity:[.4,.8,.4],
                                        scale:[1,1.08,1]
                                    }}
                                    transition={{
                                        repeat:Infinity,
                                        duration:4
                                    }}
                                />
                            )}
                        </motion.div>
                    ))}
                </>

                {/*Efek Glow 1*/}
                <motion.div
                    animate={{
                        scale:[1,1.08,1],
                        opacity:[0.5,0.8,0.5]
                    }}
                    transition={{
                        duration:4,
                        repeat:Infinity
                    }}
                    style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                    }}
                    className="
absolute
-z-10
w-[300px]
h-[300px]
lg:w-[460px]
lg:h-[460px]
bg-mangrove-deep/12
blur-[70px]
lg:blur-[70px]
pointer-events-none
"
                />

                {/*Efek Glow 2*/}
                <motion.div
                    animate={{
                        scale:[1,0.9,1],
                        opacity:[0.4,0.7,0.4]
                    }}
                    transition={{
                        duration:5,
                        repeat:Infinity
                    }}
                    style={{
                        willChange: "transform",
                        backfaceVisibility: "hidden",
                        transformStyle: "preserve-3d",
                    }}
                    className="
absolute
-z-10
w-[220px]
h-[220px]
lg:w-[320px]
lg:h-[320px]
bg-accent-ochre/15
blur-[55px]
lg:blur-[80px]
pointer-events-none
"
                />

                <div className="absolute left-20 top-32 opacity-5">
                    🌿
                </div>
                <div className="absolute right-24 bottom-24 opacity-5 text-8xl rotate-12">
                    🍃
                </div>

                {/*Tombol-Kiri*/}
                {!isMobile && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 md:left-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
                  >
                    <ChevronLeft />
                  </button>
                )}
                
                {/*Tombol-Kanan*/}
                {!isMobile && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 md:right-8 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
                  >
                    <ChevronRight />
                  </button>
                )}
            </div>

            {/*Dot Indikator*/}
            <div className={`flex justify-center ${isMobile?"mt-6":"mt-10"} gap-3`}>
                {products.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`transition-all rounded-full ${
                            activeIndex === index
                                ? "w-8 h-2 bg-mangrove-deep"
                                : "w-2 h-2 bg-stone-300"
                        }`}
                    />
                ))}
            </div>
        </section>
    );

}