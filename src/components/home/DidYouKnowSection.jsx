import { useState } from "react";
import { motion } from "framer-motion";

import {
    Trees,
    Leaf,
    Fish,
    Waves,
    Gift,
    Heart,
    Apple,
    Factory,
    Globe,
    ChevronLeft,
    ChevronRight,
    ArrowRight
} from "lucide-react";

const facts = [
    {
        title: "Menyerap Karbon",
        description:
            "Hutan mangrove mampu menyerap karbon beberapa kali lebih tinggi dibanding banyak hutan daratan.",
        icon: Trees,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
    {
        title: "Buah Mangrove",
        description:
            "Buah mangrove jenis pedada dapat diolah menjadi sirup, dodol, selai hingga camilan khas.",
        icon: Apple,
        color: "text-orange-500",
        bg: "bg-orange-50",
    },
    {
        title: "Cegah Abrasi",
        description:
            "Akar mangrove menjaga garis pantai dari abrasi dan hempasan ombak.",
        icon: Waves,
        color: "text-sky-600",
        bg: "bg-sky-50",
    },
    {
        title: "UMKM Lokal",
        description:
            "Setiap pembelian mendukung perekonomian masyarakat pesisir Kuala Langsa.",
        icon: Factory,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    {
        title: "Habitat Satwa",
        description:
            "Mangrove menjadi rumah bagi ikan, kepiting, udang dan berbagai jenis burung.",
        icon: Fish,
        color: "text-cyan-600",
        bg: "bg-cyan-50",
    },
    {
        title: "Sirup Mangrove",
        description:
            "Sirup mangrove memiliki cita rasa khas dari buah pilihan yang diproses higienis.",
        icon: Gift,
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
    {
        title: "Potensi Ekonomi",
        description:
            "Mangrove bukan hanya menjaga alam tetapi juga membuka peluang ekonomi masyarakat.",
        icon: Leaf,
        color: "text-lime-600",
        bg: "bg-lime-50",
    },
    {
        title: "Oleh-oleh Aceh",
        description:
            "Produk mangrove menjadi salah satu identitas wisata pesisir Aceh.",
        icon: Heart,
        color: "text-rose-600",
        bg: "bg-rose-50",
    },
    {
        title: "Keberlanjutan",
        description:
            "Melestarikan mangrove berarti menjaga masa depan pesisir Indonesia.",
        icon: Globe,
        color: "text-teal-600",
        bg: "bg-teal-50",
    },
];

export default function DidYouKnowSection({
    setCurrentTab,
}) {

    const [direction,setDirection]=useState("next");

    const [current, setCurrent] = useState(0);

    const next=()=>{
        setDirection("next");
        setCurrent(
            prev=>(prev+1)%facts.length
        );
    }

    const prev=()=>{
        setDirection("prev");
        setCurrent(
            prev=>(prev-1+facts.length)%facts.length
        );
    }

    const visibleCards = [];
    for (let i = -2; i <= 2; i++) {
        const index =
            (current + i + facts.length) % facts.length;

        visibleCards.push({
            ...facts[index],
            offset: i,
            id: index,
        });
    }

    const getCardStyle = (offset) => {
        switch (offset) {

            case -2:
                return {
                    x: -760,
                    scale: .82,
                    opacity: 0,
                    zIndex: 1,
                };

            case -1:
                return{
                    x:-420,
                    y:18,
                    rotateY:-14,
                    opacity:.72,
                    zIndex:15,
                }

            case 0:
                return {
                    x: 0,
                    y:0,
                    rotateY: 0,
                    opacity: 1,
                    zIndex: 40,
                };

            case 1:
                return{
                    x:420,
                    y:18,
                    rotateY:14,
                    opacity:.72,
                    zIndex:15,
                }

            case 2:
                return {
                    x: 760,
                    scale: .82,
                    opacity: 0,
                    zIndex: 1,
                };
            default:
                return {};
        }
    };

    const goToAbout = () => {
        setCurrentTab("tentang");
    };

    return (
        <section className="bg-warm-bg max-w-7xl mx-auto pt-0 md:pt-8 py-20">

            <div className="text-center">

                <span
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        bg-emerald-50
                        text-emerald-700
                        px-4
                        py-2
                        text-xs
                        font-semibold
                    "
                >
                    🌿 Edukasi Mangrove
                </span>

                <h2
                    className="
                        mt-5
                        text-4xl
                        font-serif
                        font-bold
                        text-mangrove-deep
                    "
                >
                    Tahukah Kamu?
                </h2>

                <p
                    className="
                        mt-5
                        text-stone-500
                        max-w-2xl
                        mx-auto
                        leading-8
                        text-[15px]
                    "
                >
                    Fakta menarik mengenai mangrove, lingkungan,
                    <br/>
                    serta produk khas Kota Langsa.
                </p>

            </div>

            {/*DEKSTOP*/}
            <div className="hidden lg:block">
              <div className="mt-2">

                <div
                    className="
                        relative
                        max-w-7xl
                        h-[390px]
                        mx-auto
                        overflow-visible
                    "
                    style={{
                        perspective:"2200px",
                    }}
                >
                    {/* Mask Kiri */}
                    <div
                        className="
                            absolute
                            left-0
                            top-0
                            w-48
                            h-full
                            z-40
                            pointer-events-none
                            bg-gradient-to-r
                            from-warm-bg
                            via-warm-bg
                            to-transparent
                        "
                    />

                    {/* Mask Kanan */}
                    <div
                        className="
                            absolute
                            right-0
                            top-0
                            w-48
                            h-full
                            z-40
                            pointer-events-none
                            bg-gradient-to-l
                            from-warm-bg
                            via-warm-bg
                            to-transparent
                        "
                    />

                    <motion.div
                        animate={{
                            scale:[1,1.08,1],
                            opacity:[0.55,0.75,0.55],
                        }}
                        transition={{
                            duration:5,
                            repeat:Infinity,
                            ease:"easeInOut",
                        }}
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            -translate-x-1/2
                            -translate-y-1/2
                            w-[900px]
                            h-[400px]
                            rounded-full
                            bg-emerald-100
                            blur-[140px]
                            pointer-events-none
                        "
                        style={{
    zIndex: -1,
}}
                    />

                    {visibleCards.map((fact, index) => {

                        const Icon = fact.icon;

                        return (

                            <motion.div
                                key={fact.title}
                                animate={getCardStyle(fact.offset)}
                                transition={{
                                    duration:1.05,
                                    ease:[0.23,1,0.32,1],
                                }}
                                className="
                                    absolute
                                    left-1/2
                                    top-1/2
                                    -translate-x-1/2
                                    -translate-y-1/2
                                "
                                style={{
                                    transformStyle: "preserve-3d",
                                    transformPerspective:2200,
                                    transformOrigin:
                                        fact.offset===-1
                                            ?"right center"
                                            :fact.offset===1
                                            ?"left center"
                                            :"center center",
                                    filter:
                                        fact.offset===0
                                            ?
                                            "blur(0px)"
                                            :
                                            "blur(1px)",
                                    zIndex:
        fact.offset === 0
            ? 30
            : 10,
                                    transform:`translateZ(${
                                        fact.offset===0
                                            ? "80px"
                                            : "-70px"
                                    })`
                                    
                                }}
                                whileHover={
                                    fact.offset === "center"
                                        ? {
                                            y:-10,
                                            scale:1.03,
                                        }
                                        : {}
                                }
                                
                            >
                               <div
                                    className={`
                                        relative

                                        rounded-[34px]
                                        bg-white
                                        border
                                        border-stone-200
                                        p-8
                                        flex
                                        flex-col
                                        transition-all
                                        duration-700

                                        w-[400px]

                                        h-[290px]

                                        ${
                                            fact.offset===0
                                                ?
                                                "shadow-[0_40px_90px_rgba(0,0,0,.18)]"
                                                :
                                                "shadow-[0_10px_35px_rgba(0,0,0,.08)]"
                                        }
                                    `}
                                >

                                    <div
                                        className={`
                                            w-16
                                            h-16
                                            rounded-2xl
                                            flex
                                            items-center
                                            justify-center
                                            ${fact.bg}
                                        `}
                                    >
                                        <Icon
                                            className={`
                                                w-8
                                                h-8
                                                ${fact.color}
                                            `}
                                        />
                                    </div>

                                    <h3
                                        className="
                                            mt-6
                                            text-2xl
                                            font-bold
                                            text-mangrove-deep
                                        "
                                    >
                                        {fact.title}
                                    </h3>

                                    <p
    className="
        mt-5
        leading-6
        text-stone-500
        pr-6
        pb-10
    "
>
                                        {fact.description}
                                    </p>

                                     <div className="mt-auto pt-8">

                                        <button
    onClick={goToAbout}
    className="
    absolute
    right-7
    bottom-6

    group

    flex
    items-center
    gap-2

    rounded-full

    bg-stone-100

    px-3
    py-2

    text-xs
    font-semibold

    text-mangrove-deep

    hover:bg-emerald-50
    hover:text-emerald-700

    transition-all
    duration-300
"
>

    <div>

        <p className="font-semibold text-mangrove-deep">
            Selengkapnya
        </p>

    </div>

    <ArrowRight
        className="
            w-5
            h-5
            transition-transform
            group-hover:translate-x-1
        "
    />

</button>
                                    </div>
                                </div>
                            </motion.div>

                        );
                    })}
                </div>

                </div>

              </div>

            {/*MOBILE*/}
            <div className="block lg:hidden mt-8">
                <div
    className="
        relative
        mx-5
        rounded-[28px]
        bg-white
        border
        border-stone-200
        shadow-xl
        p-6
        h-80
        flex
        flex-col
    "
>

                    <div
                        className={`
                            w-14
                            h-14
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            ${facts[current].bg}
                        `}
                    >
                        {(() => {
                            const Icon = facts[current].icon;
                            return (
                                <Icon
                                    className={`
                                        w-7
                                        h-7
                                        ${facts[current].color}
                                    `}
                                />
                            );
                        })()}
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-mangrove-deep">
                        {facts[current].title}
                    </h3>

                    <p className="mt-4 leading-7 text-stone-500">
                        {facts[current].description}
                    </p>

                    <div className="mt-auto pt-6 flex justify-end">

    <button
        onClick={goToAbout}
        className="
            w-[150px]
            h-[33px]

            rounded-2xl

            bg-emerald-600

            text-white

            py-3

            font-semibold

            flex
            items-center
            justify-center
            gap-2

            transition-all
            duration-300

            hover:bg-emerald-700
        "
    >

        <span className="text-[13px]">Selengkapnya</span>

        <ArrowRight className="w-4 h-4"/>

    </button>

</div>

                </div>

                <div className="flex justify-center gap-2 mt-7">
                    {facts.map((_, index) => (

                        <div
                            key={index}
                            className={`
                                h-2
                                rounded-full
                                transition-all
                                duration-300

                                ${
                                    current === index
                                        ? "w-8 bg-mangrove-deep"
                                        : "w-2 bg-stone-300"
                                }
                            `}
                        />

                    ))}

                </div>
            </div>

            <div className="flex justify-center gap-5 mt-8">

                <button
                    onClick={prev}
                    className="
                        group
                        w-10
                        h-10
                        rounded-full
                        bg-white
                        border
                        border-stone-200
                        shadow-md

                        transition-all
                        duration-300

                        hover:-translate-y-1
                        hover:scale-105
                        hover:shadow-xl
                        hover:border-emerald-200

                        active:scale-95
                    "
                >
                    <ChevronLeft
                        className="
                            mx-auto
                            text-stone-600
                            transition-all
                            duration-300
                            group-hover:-translate-x-1
                            group-hover:text-mangrove-deep
                        "
                    />
                </button>

                <button
                    onClick={next}
                    className="
                        group
                        w-10
                        h-10
                        rounded-full
                        bg-mangrove-deep
                        text-white

                        shadow-lg

                        transition-all
                        duration-300

                        hover:-translate-y-1
                        hover:scale-105
                        hover:shadow-[0_18px_35px_rgba(5,90,70,.35)]

                        active:scale-95
                    "
                >
                    <ChevronRight
                        className="
                            mx-auto
                            transition-all
                            duration-300
                            group-hover:translate-x-1
                        "
                    />
                </button>

            </div>

        </section>

    );

}