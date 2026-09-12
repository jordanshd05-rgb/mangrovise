import { ArrowRight, Leaf, MapPin, Scale, ShieldCheck } from "lucide-react";
import { calculateMultiImpact } from "../../constants/impactMetrics.js";

export default function DidYouKnowSection({ setCurrentTab }) {
    const impact = calculateMultiImpact(1);

    const metrics = [
        {
            key: "co2Kg",
            label: "Karbon Tersimpan",
            value: `${impact.co2Kg.toLocaleString("id-ID")} kg CO2`,
            icon: Leaf,
            tint: "bg-emerald-50 text-emerald-700",
        },
        {
            key: "coastalMeter",
            label: "Garis Pantai Terlindungi",
            value: `${impact.coastalMeter.toLocaleString("id-ID")} Meter`,
            icon: MapPin,
            tint: "bg-sky-50 text-sky-700",
        },
        {
            key: "habitatSqM",
            label: "Habitat Nursery Ikan/Kepiting",
            value: `${impact.habitatSqM.toLocaleString("id-ID")} m²`,
            icon: Scale,
            tint: "bg-amber-50 text-amber-700",
        },
        {
            key: "speciesEstimate",
            label: "Keanekaragaman Spesies",
            value: `${impact.speciesEstimate.toLocaleString("id-ID")} Spesies`,
            icon: ShieldCheck,
            tint: "bg-cyan-50 text-cyan-700",
        },
    ];

    const goToAbout = () => {
        setCurrentTab?.("tentang");
    };

    return (
        <section className="bg-warm-bg max-w-7xl mx-auto pt-0 md:pt-8 py-20">
            <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-4 py-2 text-xs font-semibold">
                    🌿 Impact Calculator
                </span>

                <h2 className="mt-5 text-4xl font-serif font-bold text-mangrove-deep">
                    Dampak Restorasi Mangrove
                </h2>

                <p className="mt-5 text-stone-500 max-w-2xl mx-auto leading-8 text-[15px]">
                    Setiap bibit mangrove yang ditanam membantu memperkuat ekosistem pesisir, menyerap karbon, dan menjaga habitat kehidupan laut.
                </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metrics.map(({ key, label, value, icon: Icon, tint }) => (
                    <div
                        key={key}
                        className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)] transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${tint}`}>
                            <Icon className="h-6 w-6" />
                        </div>
                        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-500">
                            {label}
                        </p>
                        <p className="mt-3 text-2xl font-black text-mangrove-deep">
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-stone-500">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <p>Berdasarkan data studi restorasi ekosistem mangrove Rhizophora sp.</p>
            </div>

            <div className="mt-8 flex justify-center">
                <button
                    onClick={goToAbout}
                    className="inline-flex items-center gap-2 rounded-full bg-mangrove-deep px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                    <span>Selengkapnya</span>
                    <ArrowRight className="h-4 w-4" />
                </button>
            </div>
        </section>
    );
}
