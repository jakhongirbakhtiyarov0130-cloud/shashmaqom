"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Activity } from 'lucide-react';

// Audio Context and Pitch Detection Logic
const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    // Perform autocorrelation to find pitch
    const SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1; // Too quiet

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buffer[i]) < thres) {
            r1 = i;
            break;
        }
    }
    for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buffer[SIZE - i]) < thres) {
            r2 = SIZE - i;
            break;
        }
    }

    const buf = buffer.slice(r1, r2);
    const L = buf.length;

    const c = new Array(L).fill(0);
    for (let i = 0; i < L; i++) {
        for (let j = 0; j < L - i; j++) {
            c[i] = c[i] + buf[j] * buf[j + i];
        }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < L; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }

    let T0 = maxpos;
    return sampleRate / T0;
};

const noteNames = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];

const getNoteFromFrequency = (frequency: number) => {
    const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    const rounded = Math.round(noteNum) + 69;
    const name = noteNames[rounded % 12];
    const octave = Math.floor(rounded / 12) - 1;
    return { name, octave, cents: Math.floor((noteNum - Math.round(noteNum)) * 100) };
};

export const PitchTrainer = () => {
    const [isActive, setIsActive] = useState(false);
    const [pitch, setPitch] = useState<{ name: string; octave: number; cents: number } | null>(null);
    const [freq, setFreq] = useState<number>(0);
    const [volumeLevel, setVolumeLevel] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyzerRef = useRef<AnalyserNode | null>(null);
    const animationRef = useRef<number>();
    const historyRef = useRef<number[]>([]);

    const startPitchDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyzerRef.current = audioContextRef.current.createAnalyser();
            analyzerRef.current.fftSize = 2048;
            source.connect(analyzerRef.current);
            setIsActive(true);
            updatePitch();
            console.log("Audio detection started");
        } catch (err) {
            console.error("Mic access denied or error:", err);
            alert("Mikrofonga ruxsat berilmadi yoki xato yuz berdi.");
        }
    };

    const stopPitchDetection = () => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().then(() => {
                audioContextRef.current = null;
            });
        }
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        setIsActive(false);
        setPitch(null);
        setFreq(0);
        setVolumeLevel(0);
    };

    const updatePitch = () => {
        if (!analyzerRef.current || !audioContextRef.current) return;
        const buffer = new Float32Array(analyzerRef.current.fftSize);
        analyzerRef.current.getFloatTimeDomainData(buffer);

        // Calculate Volume (RMS)
        let sum = 0;
        for (let i = 0; i < buffer.length; i++) {
            sum += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sum / buffer.length);
        setVolumeLevel(rms);

        const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);

        if (frequency !== -1 && frequency > 50 && frequency < 1200 && rms > 0.005) {
            setFreq(frequency);
            const note = getNoteFromFrequency(frequency);
            setPitch(note);
            historyRef.current.push(frequency);
            if (historyRef.current.length > 200) historyRef.current.shift();
        } else {
            historyRef.current.push(0);
            if (historyRef.current.length > 200) historyRef.current.shift();
            if (rms < 0.005) setPitch(null);
        }

        drawCanvas();
        animationRef.current = requestAnimationFrame(updatePitch);
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid lines for notes (simplified)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            const y = (canvas.height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw Pitch Path
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';

        const sliceWidth = canvas.width / 200;
        let x = 0;

        for (let i = 0; i < historyRef.current.length; i++) {
            const h = historyRef.current[i];
            if (h === 0) {
                x += sliceWidth;
                continue;
            }
            // Map frequency to Y (logarithmic-ish)
            const y = canvas.height - (Math.log2(h / 50) * (canvas.height / 4));

            if (i === 0 || historyRef.current[i - 1] === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.stroke();

        // Dot at current position
        if (historyRef.current.length > 0) {
            const lastH = historyRef.current[historyRef.current.length - 1];
            if (lastH > 0) {
                const lastY = canvas.height - (Math.log2(lastH / 50) * (canvas.height / 4));
                ctx.fillStyle = '#f59e0b';
                ctx.beginPath();
                ctx.arc(x - sliceWidth, lastY, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'orange';
                ctx.stroke();
            }
        }
    };

    useEffect(() => {
        return () => stopPitchDetection();
    }, []);

    return (
        <div className="flex flex-col items-center bg-black/30 p-4 md:p-8 rounded-3xl border border-white/5 backdrop-blur-md w-full max-w-4xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between w-full mb-8 gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-2xl md:text-3xl font-serif text-amber-500 mb-2">Vokal Mashqi</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-gray-400 text-sm">Ovozingizni real vaqtda kuzating</p>
                        {isActive && (
                            <div className="flex items-center gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1 h-3 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={isActive ? stopPitchDetection : startPitchDetection}
                    className={`
            px-8 py-3 rounded-full flex items-center gap-3 transition-all active:scale-95 shadow-xl
            ${isActive ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-amber-500 text-black font-bold'}
          `}
                >
                    {isActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    {isActive ? "To'xtatish" : "Mikrofonni yoqish"}
                </button>
            </div>

            <div className="relative w-full aspect-[21/9] bg-black/60 rounded-2xl border border-white/10 overflow-hidden group mb-4">
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={300}
                    className="w-full h-full"
                />
                {!isActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <Activity className="w-12 h-12 text-gray-700 animate-pulse mb-4" />
                        <p className="text-gray-500 text-sm tracking-widest uppercase">Kutish rejimi</p>
                    </div>
                )}
            </div>

            {/* Volume Meter */}
            <div className="w-full flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5 mb-8">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest w-20">Ovoz Kuchlanishi</span>
                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden flex gap-0.5">
                    {Array.from({ length: 40 }).map((_, i) => {
                        const intensity = volumeLevel * 10; // Simple scaling
                        const isActiveBar = (i / 40) < intensity;
                        return (
                            <div
                                key={i}
                                className={`flex-1 h-full rounded-sm transition-all duration-75 ${isActiveBar ? (i > 30 ? 'bg-red-500' : i > 20 ? 'bg-amber-500' : 'bg-green-500') : 'bg-white/5'}`}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Nota</span>
                    <span className="text-4xl md:text-5xl font-bold text-amber-500 font-serif">
                        {pitch ? pitch.name : "--"}
                    </span>
                    <span className="text-xs text-amber-500/60 mt-1">{pitch ? `Oktava: ${pitch.octave}` : "..."}</span>
                </div>

                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Chastota</span>
                    <span className="text-3xl md:text-4xl font-mono text-gray-300">
                        {freq > 0 ? freq.toFixed(1) : "0.0"} <span className="text-sm">Hz</span>
                    </span>
                    <div className={`w-12 h-1 rounded-full mt-4 ${Math.abs(pitch?.cents || 0) < 10 ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500'}`} />
                </div>

                <div className="col-span-2 md:col-span-1 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Anuqlik (Cents)</span>
                    <div className="w-full h-8 bg-black/40 rounded-full relative overflow-hidden flex items-center justify-center border border-white/5">
                        <div
                            className={`absolute h-full w-1 transition-all duration-100 ${Math.abs(pitch?.cents || 0) < 10 ? 'bg-green-500' : 'bg-red-400'}`}
                            style={{ left: `${50 + (pitch?.cents || 0) / 2}%` }}
                        />
                        <div className="w-0.5 h-full bg-white/20 absolute left-1/2 -translate-x-1/2" />
                        <span className="relative z-10 text-xs font-mono text-gray-400">{pitch ? (pitch.cents > 0 ? `+${pitch.cents}` : pitch.cents) : "0"}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2">Markazga yaqinlashishga harakat qiling</p>
                </div>
            </div>
        </div>
    );
};
