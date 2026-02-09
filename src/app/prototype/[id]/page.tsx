"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, FileText, Info, BarChart2, ArrowLeft, Play, Pause, SkipBack, SkipForward, ListMusic, Disc, Volume2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { shashmaqomData } from "@/data/maqomData";

export default function MaqomPrototype() {
    const params = useParams();
    const id = params.id as string;
    const maqom = shashmaqomData[id as keyof typeof shashmaqomData] || shashmaqomData["buzruk"];

    const [activeTab, setActiveTab] = useState<"text" | "score" | "analysis">("text");
    const [currentTrack, setCurrentTrack] = useState(maqom.tracks[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(30); // Mock progress
    const [volume, setVolume] = useState(70);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    const volumeRef = useRef<HTMLDivElement>(null);

    // Global Event Listener for smooth dragging outside the component
    useEffect(() => {
        const handleDrag = (e: MouseEvent) => {
            if (!isDraggingVolume || !volumeRef.current) return;
            const rect = volumeRef.current.getBoundingClientRect();
            // Calculate height from bottom since it's a vertical slider going up
            const height = rect.bottom - e.clientY;
            const percentage = Math.min(100, Math.max(0, (height / rect.height) * 100));
            setVolume(percentage);
        };

        const stopDrag = () => setIsDraggingVolume(false);

        if (isDraggingVolume) {
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', stopDrag);
        }

        return () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', stopDrag);
        };
    }, [isDraggingVolume]);

    const startVolumeDrag = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDraggingVolume(true);
        // Initial click update
        if (volumeRef.current) {
            const rect = volumeRef.current.getBoundingClientRect();
            const height = rect.bottom - e.clientY;
            const percentage = Math.min(100, Math.max(0, (height / rect.height) * 100));
            setVolume(percentage);
        }
    };

    // Audio Mockup
    const togglePlay = () => setIsPlaying(!isPlaying);

    return (
        <div className="h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden selection:bg-amber-500/30">
            {/* Cinematic Noise & Fog Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] animate-noise mix-blend-overlay bg-noise"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/05 blur-[150px] rounded-full pointer-events-none" />

            {/* === MAIN LAYOUT === */}
            <main className="flex-1 flex relative mt-6 mx-6 mb-4 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">

                {/* === LEFT SIDEBAR: TRACK LIST (Compact) === */}
                <aside className="w-80 bg-black/40 backdrop-blur-sm border-r border-white/5 flex flex-col shrink-0 absolute md:static inset-y-0 left-0 z-40 transform transition-transform duration-300 md:translate-x-0 -translate-x-full">
                    <div className="p-4 border-b border-white/5 flex items-center gap-2 text-amber-500/80">
                        <ListMusic className="w-4 h-4" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">Treklar ({maqom.tracks.length})</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
                        {maqom.tracks.map((track: any, idx: number) => (
                            <button
                                key={track.id}
                                onClick={() => { setCurrentTrack(track); setIsPlaying(true); }}
                                className={`
                                    w-full text-left px-4 py-3 rounded hover:bg-white/5 border-l-2 transition-all duration-200 flex items-center gap-3
                                    ${currentTrack.id === track.id
                                        ? 'bg-amber-500/10 border-amber-500'
                                        : 'border-transparent text-gray-400'}
                                `}
                            >
                                <span className="text-[10px] font-mono opacity-40 w-8">{track.id}</span>
                                <span className={`text-xs font-medium truncate flex-1 ${currentTrack.id === track.id ? 'text-amber-500' : 'group-hover:text-gray-200'}`}>
                                    {track.title}
                                </span>
                                {currentTrack.id === track.id && (
                                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* === CENTER: CONTENT TABS === */}
                <section className="flex-1 flex flex-col relative bg-gradient-to-br from-gray-900/50 to-black/50 overflow-hidden">

                    {/* Tabs Navigation */}
                    <div className="flex justify-center border-b border-white/5 bg-black/20">
                        {[
                            { id: "text", label: "Matn", icon: FileText },
                            { id: "score", label: "Nota", icon: BarChart2 },
                            { id: "analysis", label: "Tahlil", icon: Info },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    px-8 py-4 flex items-center gap-2 text-sm uppercase tracking-widest transition-all relative
                                    ${activeTab === tab.id ? 'text-amber-500' : 'text-gray-500 hover:text-gray-300'}
                                `}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="activeTabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 shadow-[0_0_10px_orange]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {activeTab === 'text' && (
                                <motion.div
                                    key="text"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="max-w-3xl mx-auto text-center space-y-8 pb-20"
                                >
                                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                                        <FileText className="w-8 h-8 text-amber-500" />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif text-amber-500/90">{currentTrack.title}</h2>
                                    <div className="space-y-6 text-lg md:text-xl font-light text-gray-300 leading-relaxed italic opacity-90">
                                        <p>Ey chehrayi ziboyo,</p>
                                        <p>Meni devona kard.</p>
                                        <p>Husningga bo'lib shaydo,</p>
                                        <p>Meni afsona kard.</p>
                                        <br />
                                        <p>Yuzing guli rayhondur,</p>
                                        <p>Ko'zing dardi darmondur.</p>
                                        <p>Ishqingda bu dil qondur,</p>
                                        <p>Meni mastona kard.</p>

                                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-8" />
                                        <p className="text-sm text-gray-500 non-italic tracking-widest uppercase">Alisher Navoiy G'azali</p>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'score' && (
                                <motion.div
                                    key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4"
                                >
                                    <BarChart2 className="w-16 h-16 text-amber-500/20" />
                                    <p>Interactive MusicXML Score Rendering Module</p>
                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs rounded border border-amber-500/20">COMING SOON</span>
                                </motion.div>
                            )}

                            {activeTab === 'analysis' && (
                                <motion.div
                                    key="analysis" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="max-w-4xl mx-auto"
                                >
                                    <h3 className="text-2xl font-serif text-amber-500 mb-6">Musiqiy Tahlil</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                                            <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Lad Tizimi</h4>
                                            <p className="text-gray-200">Ushbu asar "Rost" maqomining asosiy lad tizimiga asoslangan bo'lib, mikrotnal o'zgarishlar (parda) bilan ajralib turadi.</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                                            <h4 className="text-sm text-gray-400 uppercase tracking-widest mb-2">Usul (Rhythm)</h4>
                                            <p className="text-gray-200">Saraxbor usulida (2/4) ijro etiladi. Og'ir va vazmin xarakterga ega.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </section>
            </main>

            {/* === FIXED BOTTOM PLAYER BAR === */}
            <header className="h-auto py-3 bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-between px-6 z-50 shrink-0 mb-6 mx-6 rounded-2xl shadow-2xl">

                {/* 1. Left: Back & Title */}
                <div className="flex items-center gap-6 w-1/4">
                    <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-serif text-amber-500 tracking-wide">{maqom.name}</h1>
                        <span className="text-xs text-gray-500 uppercase tracking-widest">Maqomi</span>
                    </div>
                </div>

                {/* 2. Center: Player Controls */}
                <div className="flex-1 flex flex-col items-center max-w-2xl px-4">
                    <div className="flex items-center gap-6 mb-2">
                        <button className="text-gray-400 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-amber-500 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        >
                            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                        </button>
                        <button className="text-gray-400 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full flex items-center gap-3 text-xs font-mono text-gray-500">
                        <span>01:12</span>
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative group cursor-pointer">
                            <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
                            <div className="h-full bg-amber-500 w-[30%] relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" />
                            </div>
                        </div>
                        <span>04:35</span>
                    </div>
                    <div className="mt-1 text-xs text-amber-500/80 truncate max-w-[300px] font-medium animate-pulse">
                        {currentTrack.title}
                    </div>
                </div>

                {/* 3. Right: Volume & Extras */}
                <div className="w-1/4 flex items-center justify-end gap-4">
                    <div className="relative group flex items-center justify-center">
                        {/* Hover Expander Area - Invisible trigger zone */}
                        <div className="absolute bottom-0 w-10 h-32 hidden group-hover:block z-40" />

                        {/* Vertical Slider Container */}
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 p-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                            <span className="text-[10px] font-mono text-amber-500">{Math.round(volume)}%</span>
                            <div
                                ref={volumeRef}
                                onMouseDown={startVolumeDrag}
                                className="w-1.5 h-24 bg-white/10 rounded-full relative cursor-pointer active:cursor-grabbing group/slider overflow-hidden"
                            >
                                <div
                                    className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-700 to-amber-400 rounded-full transition-all duration-75 ease-out"
                                    style={{ height: `${volume}%` }}
                                />
                                {/* Knob handle for visual cue */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-0 group-hover/slider:opacity-100 transition-opacity pointer-events-none"
                                    style={{ bottom: `calc(${volume}% - 6px)` }}
                                />
                            </div>
                        </div>

                        {/* Volume Icon Button */}
                        <button
                            className="p-2 text-gray-400 hover:text-white transition-colors relative z-50 active:scale-95"
                            onClick={() => setVolume(volume === 0 ? 70 : 0)}
                        >
                            <Volume2 className={`w-5 h-5 transition-colors ${volume === 0 ? 'text-gray-600' : volume > 70 ? 'text-amber-500' : 'text-gray-400'}`} />
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
}

