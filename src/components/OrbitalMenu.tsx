"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, X, Radio } from "lucide-react";

// Unified Gold Theme
const goldGradient = "from-amber-300 via-yellow-500 to-amber-700";
const goldShadow = "shadow-[0_0_50px_rgba(245,158,11,0.6)]";

const maqoms = [
    {
        id: "buzruk",
        name: "Buzruk",
        desc: "Ulug'vorlik va kuch-qudrat ramzi.",
        angle: 270,
        instrumentImg: "/instruments/tanbur.svg",
        speed: "60s",
        details: [
            "Markaziy Osiyo xalqlari musiqa merosi",
            "O'n ikki maqom tizimining ulug'i",
            "Forscha 'Buzurg' - Katta, Ulug'",
            "Ikki bo'lim: Mushkilot va Nasr",
            "7 ta cholg'u yo'li (Tasnif, Tarje...)",
            "35 ta ashula yo'li (Saraxbor, Talqin...)",
            "Buxoro Shashmaqomining birinchi maqomi",
            "Tonika: Re (D) notasi",
            "Temuriylar davri ruhi",
            "Falsafiy teranlik va salobat"
        ],
        instrumentInfo: {
            name: "Tanbur",
            desc: "Shashmaqomning yuragi va tonallik asosi hisoblangan bu cholg'u, o'zining uzun dastasi va pardalari orqali maqomning murakkab ladlarini mukammal ifodalaydi.",
            history: "To'rt metall torli va tut yog'ochidan yasalgan tanbur, qadimdan saroy musiqasining yetakchisi bo'lib kelgan. Uning sadosi inson ovoziga hamohang bo'lib, maqom ijrosida yetakchilik qiladi.",
        }
    },
    {
        id: "rost",
        name: "Rost",
        desc: "Haqiqat va to'g'rilik kuyi.",
        angle: 330,
        instrumentImg: "/instruments/dutor.svg",
        speed: "50s",
        details: [
            "Haqiqat va to'g'rilik kuyi",
            "Afsona: Odam Ato nolasi",
            "'Ummul-advor' - Maqomlar onasi",
            "Miksolidiy lad tuzilmasi",
            "Tasnifi Rost, Garduni Rost",
            "Ushshoq, Savti Kalon, Sabo",
            "Tanbur 'Do-Sol' sozlanishi",
            "Samimiyat va ishonch",
            "Pakiylik va rostlik yo'li",
            "Insoniy komillik ramzi"
        ],
        instrumentInfo: {
            name: "Dutor",
            desc: "\"Ikki tor\" ma'nosini anglatuvchi, ipak torli va mayin ovozli bu cholg'u, soddaligiga qaramay, o'zbek musiqasining chuqur falsafasini o'zida jamlagan.",
            history: "XV asrlardan beri ma'lum bo'lgan dutor, dastlab cho'ponlar hamrohi bo'lgan, keyinchalik Shashmaqom ansamblining ajralmas va nufuzli qismiga aylangan.",
        }
    },
    {
        id: "navo",
        name: "Navo",
        desc: "Lirik kechinmalar va inja tuyg'ular.",
        angle: 30,
        instrumentImg: "/instruments/nay.svg",
        speed: "40s",
        details: [
            "Navo - 'Kuy', 'Ohang' demakdir",
            "Hissiy poklanish va ilohiy ilhom",
            "Alisher Navoiy g'azallari",
            "Tasnifi Navo, Tarjei Navo",
            "Saraxbori Navo, Bayot, Husayniy",
            "Lirik va mahzun kechinmalar",
            "Inja tuyg'ular tarjimoni",
            "Kompozitorlar ilhom manbai",
            "Ruhiy halovat va sokinlik",
            "Oshiq qalb nolasi"
        ],
        instrumentInfo: {
            name: "Nay",
            desc: "Inson nafasining kuyga aylanishi. Uning sehrli va nola qiluvchi ovozi tinglovchini ruhiy poklanish va ilohiy mushohadaga chorlaydi.",
            history: "Eng qadimiy puflama cholg'ulardan biri. Tasavvuf falsafasida nay nolasini inson ruhining o'z asliga – Yaratganga qaytish istagi va sog'inchi bilan qiyoslashgan.",
        }
    },
    {
        id: "dugoh",
        name: "Dugoh",
        desc: "Tonggi shabada va uyg'onish.",
        angle: 90,
        instrumentImg: "/instruments/gijjak.svg",
        speed: "35s",
        details: [
            "Dugoh - 'Ikki parda', 'Ikki vaqt'",
            "Tonggi shabada va uyg'onish",
            "Yoshlik va shijoat ramzi",
            "Peshravi Dugoh, Samoi Dugoh",
            "Chorgoh va Oromijon sho'balari",
            "Tetk va jo'shqin ohanglar",
            "Hayotga muhabbat madhiyasi",
            "Yangi kun nafasi",
            "G'ayrat va harakat",
            "Bahoriy kayfiyat"
        ],
        instrumentInfo: {
            name: "G'ijjak",
            desc: "Kamonli cholg'u bo'lib, uning nolasi inson yig'isi va kulgusini eslatadi. Maqom ansamblida kuyni bog'lab turuvchi va unga uzviylik beruvchi asosiy vositadir.",
            history: "Sharq miniatyuralarida ko'p tasvirlangan g'ijjak, o'zining o'tkir va shirali ovozi bilan maqom kuyining ta'sirchanligini oshiradi va boshqa cholg'ular bilan mukammal uyg'unlashadi.",
        }
    },
    {
        id: "segoh",
        name: "Segoh",
        desc: "Muhabbat va olovli hislar.",
        angle: 150,
        instrumentImg: "/instruments/rubob.svg",
        speed: "45s",
        details: [
            "Segoh - 'Uch parda', 'Uch o'rin'",
            "Muhabbat va olovli hislar",
            "Eoliy (minor) lad tuzilmasi",
            "Tasnifi Segoh, Xafifi Segoh",
            "Navro'zi Xoro, Navro'zi Ajam",
            "Yurak olovi va ehtiros",
            "Mo'g'ulchai Segoh",
            "Sevgi va visol onlari",
            "Qalb tug'yonlari",
            "Ishqiy sarguzashtlar"
        ],
        instrumentInfo: {
            name: "Qashqar Rubobi",
            desc: "Teri qoplamali, jarangdor va aks-sadoli torli cholg'u. Uning o'tkir ovozi maqomlarning avj qismlarida va ritmik usullarida o'zgacha kuch bag'ishlaydi.",
            history: "Qadimiy tarixi VII asrlarga borib taqaladi. Shashmaqom ijrosida rubob o'zining yorqin timbri va ijro imkoniyatlari bilan ansamblga jo'shqinlik olib kiradi.",
        }
    },
    {
        id: "iroq",
        name: "Iroq",
        desc: "Armon va o'tmish xotiralari.",
        angle: 210,
        instrumentImg: "/instruments/doira.svg",
        speed: "80s",
        details: [
            "Tarixiy Iroq mamlakatiga nisbat",
            "Armon va o'tmish xotiralari",
            "Eng murakkab va vazmin maqom",
            "Mushkiloti Iroq, Saqili Kalon",
            "Muhayyari Iroq, Chanbari Iroq",
            "Ayriliq va intizorlik kuyi",
            "Falsafiy mushohada",
            "Sog'inch va hijron",
            "Chuqur ma'noli nola",
            "Tarix saboqlari"
        ],
        instrumentInfo: {
            name: "Doira",
            desc: "Maqomning yurak urishi (ritmi). Usulsiz maqom bo'lmaydi, doira esa o'zining rang-barang zarblari bilan kuyning vaznini va ruhini belgilab beradi.",
            history: "Uzum yoki yong'oq yog'ochidan yasalib, metall halqachalar o'rnatilgan qadimiy zarbli cholg'u. U asrlar davomida mumtoz musiqamizning ritmik asosi bo'lib xizmat qilgan.",
        }
    },
];

export default function OrbitalMenu() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeInstrument, setActiveInstrument] = useState<any | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || isHovering || !activeId) return;

        let animationFrameId: number;

        const scroll = () => {
            if (scrollContainer) {
                // Smooth slow scrolling
                scrollContainer.scrollTop += 0.3;

                // Infinite loop logic: If we reached the end of the first set (approx), reset.
                // Since we triplicate the data, we can reset when we reach 1/3 or 2/3 down.
                // For simplicity, just reset to 0 when near bottom.
                if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 5) {
                    scrollContainer.scrollTop = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovering, activeId]);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-visible perspective-1000">

            {/* Cinematic Noise Overlay for "5 Years Ahead" look */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] animate-noise mix-blend-overlay bg-noise"></div>

            {/* Central Title - Fades out when Active */}
            <AnimatePresence>
                {!activeId && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute z-10 text-center pointer-events-none overflow-visible top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        <h1 className="text-4xl md:text-9xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-500 to-amber-800 tracking-widest drop-shadow-2xl overflow-visible">
                            SHASHMAQOM
                        </h1>
                        <p className="text-xs md:text-lg text-amber-500/80 mt-4 tracking-[0.5em] uppercase font-light block overflow-visible mx-auto">
                            Raqamli Meros
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Orbital System Container */}
            <div className={`relative transition-all duration-1000 ease-in-out ${activeId ? 'scale-150 blur-sm opacity-20 pointer-events-none' : 'scale-100'}`}>

                {/* Tech Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[640px] md:h-[640px] rounded-full border border-amber-500/10 animate-spin-slow pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500/50 rounded-full shadow-[0_0_10px_orange]"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] md:w-[880px] md:h-[880px] rounded-full border border-amber-500/5 border-dashed animate-[spin_60s_linear_infinite_reverse] pointer-events-none"></div>

                {/* Planets */}
                {maqoms.map((maqom, index) => {
                    // Mobile-responsive radius
                    const isMobile = mounted && window.innerWidth < 768;
                    const radius = isMobile ? 160 : 320;
                    const radian = (maqom.angle * Math.PI) / 180;
                    const x = Math.cos(radian) * radius;
                    const y = Math.sin(radian) * radius;

                    return (
                        <div
                            key={maqom.id}
                            className="absolute top-1/2 left-1/2"
                            style={{
                                transform: `translate(${x}px, ${y}px)`,
                                marginLeft: isMobile ? -32 : -48,
                                marginTop: isMobile ? -32 : -48
                            }}
                        >
                            <motion.button
                                layoutId={`planet-${maqom.id}`}
                                onClick={() => setActiveId(maqom.id)}
                                className="group relative w-16 h-16 md:w-24 md:h-24 rounded-full focus:outline-none"
                                whileHover={{ scale: 1.2 }}
                            >
                                {/* Golden Planet Core */}
                                <div className={`w-full h-full rounded-full bg-gradient-to-br ${goldGradient} shadow-lg shadow-amber-500/20 border border-amber-300/30 relative overflow-hidden group-hover:shadow-[0_0_50px_orange] transition-all duration-500 flex items-center justify-center`}>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_70%)] opacity-80 mix-blend-overlay" />
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-black/20 blur-md" />

                                    {/* Engraved Text inside the Gold */}
                                    <span className="relative z-10 text-[8px] md:text-xs font-serif font-bold text-amber-900 tracking-[0.1em] md:tracking-widest uppercase opacity-80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                                        {maqom.name}
                                    </span>
                                </div>

                                {/* Instrument Orbit Satellite */}
                                <div
                                    className="absolute inset-[-25px] md:inset-[-35px] rounded-full border border-amber-500/5 pointer-events-none"
                                    style={{ animation: `spin ${maqom.speed} linear infinite` }}
                                >
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="relative group/sat pointer-events-auto">
                                            {/* Satellite Instrument Image */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveInstrument({ ...maqom.instrumentInfo, img: maqom.instrumentImg });
                                                }}
                                                className="w-6 h-6 md:w-10 md:h-10 p-1 md:p-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center justify-center backdrop-blur-sm transform hover:scale-125 transition-transform duration-300 cursor-pointer hover:bg-amber-500/30"
                                            >
                                                <img
                                                    src={maqom.instrumentImg}
                                                    alt="Instrument"
                                                    className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(245,158,11,0.8)]"
                                                />
                                            </div>

                                            {/* Tooltip on Hover */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/sat:opacity-100 transition-opacity whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-amber-500/30 text-[10px] text-amber-500 uppercase tracking-widest pointer-events-none">
                                                {maqom.instrumentInfo.name}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Instrument Modal */}
            <AnimatePresence>
                {activeInstrument && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setActiveInstrument(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-black/90 border border-amber-500/30 p-8 rounded-2xl max-w-md w-full relative shadow-[0_0_50px_rgba(245,158,11,0.2)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setActiveInstrument(null)}
                                className="absolute top-4 right-4 text-amber-500/50 hover:text-amber-500"
                            >
                                <X />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-32 h-32 p-4 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)] flex items-center justify-center">
                                    <img
                                        src={activeInstrument.img}
                                        alt={activeInstrument.name}
                                        className="w-full h-full object-contain filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-3xl font-serif text-amber-500 mb-2">{activeInstrument.name}</h3>
                                    <p className="text-sm text-amber-200/50 uppercase tracking-widest">Milliy Cholg'u</p>
                                </div>

                                <div className="space-y-4 text-gray-300 font-light text-sm leading-relaxed">
                                    <p>{activeInstrument.desc}</p>
                                    <div className="w-10 h-[1px] bg-amber-500/30 mx-auto"></div>
                                    <p className="italic text-gray-400">{activeInstrument.history}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Focus Mode (Zoomed In View) */}
            <AnimatePresence>
                {activeId && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        {maqoms.filter(m => m.id === activeId).map((maqom) => (
                            <motion.div
                                layoutId={`planet-${maqom.id}`}
                                key={maqom.id}
                                className="relative w-full max-w-4xl h-[500px] flex items-center justify-center"
                            >
                                {/* Backdrop blur/dim */}
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-xl rounded-3xl border border-amber-500/20 z-0"
                                    onClick={() => setActiveId(null)}
                                />

                                {/* Content Container */}
                                <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 gap-8">

                                    {/* The Giant Planet */}
                                    <motion.div
                                        className="relative w-48 h-48 md:w-96 md:h-96 shrink-0"
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        <div className={`w-full h-full rounded-full bg-black border border-amber-500/50 relative overflow-hidden group-hover:shadow-[0_0_100px_rgba(245,158,11,0.5)] transition-all duration-500`}>
                                            {/* Inner Sphere Background & Effects */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-black via-amber-900/20 to-black opacity-80" />
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]" />

                                            {/* Scrolling Data Text Container - Manual + Auto Scroll */}
                                            <div
                                                className="absolute inset-0 flex flex-col items-center overflow-hidden mask-image-gradient-y"
                                                onMouseEnter={() => setIsHovering(true)}
                                                onMouseLeave={() => setIsHovering(false)}
                                                onTouchStart={() => setIsHovering(true)}
                                                onTouchEnd={() => setIsHovering(false)}
                                            >
                                                {/* Hidden Scrollbar Container */}
                                                <div
                                                    ref={scrollRef}
                                                    className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth px-6 py-12 flex flex-col items-center gap-6"
                                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                                >
                                                    {/* Seamless Loop Data */}
                                                    {[...maqom.details, ...maqom.details, ...maqom.details, ...maqom.details].map((text, i) => (
                                                        <span key={i} className="text-amber-200/80 font-serif text-[10px] md:text-xs tracking-[0.15em] uppercase text-center drop-shadow-md leading-relaxed max-w-[90%] shrink-0 cursor-grab active:cursor-grabbing">
                                                            {text}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Gradient Fade Masks */}
                                            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                                            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                                            {/* Glass Reflection */}
                                            <div className="absolute inset-0 rounded-full border-[1px] border-white/10 pointer-events-none bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                        </div>

                                        {/* Orbiting Rings around detailed planet */}
                                        <div className="absolute inset-[-50px] border border-amber-500/30 rounded-full animate-spin-slow [animation-duration:10s] pointer-events-none"></div>
                                        <div className="absolute inset-[-20px] border border-amber-500/50 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse] pointer-events-none"></div>
                                    </motion.div>

                                    {/* Holographic Data Panel */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                                        className="flex-1 text-left space-y-6"
                                    >
                                        <div className="flex items-center gap-3 text-amber-500/70 mb-2">
                                            <Radio className="w-4 h-4 animate-pulse" />
                                            <span className="text-xs font-mono tracking-widest">LIVE DATA FEED</span>
                                        </div>

                                        <h2 className="text-6xl md:text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500 drop-shadow-lg">
                                            {maqom.name}
                                        </h2>

                                        <p className="text-xl text-gray-300 font-light leading-relaxed border-l-2 border-amber-500/50 pl-6">
                                            "{maqom.desc}"
                                        </p>

                                        <div className="flex gap-4 pt-8">
                                            <Link href={`/prototype/${maqom.id}`}>
                                                <button className="group relative px-8 py-4 bg-amber-500 text-black font-bold tracking-widest uppercase text-sm hover:bg-amber-400 transition-all flex items-center gap-2 overflow-hidden">
                                                    <span className="relative z-10 flex items-center gap-2">Tadqiq Qilish <ArrowRight className="w-4 h-4" /></span>
                                                    <div className="absolute inset-0 bg-white/50 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
                                                </button>
                                            </Link>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                                                className="px-8 py-4 border border-amber-500/30 text-amber-500 hover:bg-amber-500/10 transition-colors uppercase text-sm tracking-widest"
                                            >
                                                Yopish
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Floating News Ticker - Tech Style */}
            <div className="absolute bottom-8 right-8 z-40 max-w-sm hidden md:block">
                <div className="bg-black/40 backdrop-blur-md border border-amber-500/20 p-4 rounded-lg transform skew-x-[-10deg] hover:skew-x-0 transition-transform duration-300 cursor-pointer group">
                    <h3 className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
                        So'nggi Yangiliklar
                    </h3>
                    <div className="text-gray-400 text-sm font-light h-10 overflow-hidden relative">
                        <div className="absolute animate-[translateY_10s_linear_infinite] space-y-4 hover:pause">
                            <p>"Zominda II Xalqaro maqom san'ati festivali 80 davlat vakillarini birlashtirdi.</p>
                            <p>2025-yildan O'zbek maqom san'ati Malayziyada keng targ'ib qilinadi.</p>
                            <p>Yunus Rajabiy nomidagi maqom instituti yangi xalqaro hamkorlikni yo'lga qo'ydi.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
