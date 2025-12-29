"use client";

import { useEffect, useState } from 'react';
import { Clock, MessageSquare, Heart, RefreshCw, Home, ShieldCheck } from 'lucide-react';
import { GlassContainer } from './GlassContainer';
import { useSession } from '@/hooks/useSession';

export function SessionSummary() {
    const { state, resetSession } = useSession();
    const [duration, setDuration] = useState<string>('0:00');

    useEffect(() => {
        if (state.startTime && state.endTime) {
            const diff = state.endTime.getTime() - state.startTime.getTime();
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
    }, [state.startTime, state.endTime]);

    return (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-3xl flex flex-col p-8 animate-in fade-in duration-1000">
            <div className="flex-1 flex flex-col items-center justify-center space-y-12 max-w-sm mx-auto w-full">

                <div className="relative animate-reveal">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative w-28 h-28 rounded-full bg-slate-900 border border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(31,154,248,0.3)]">
                        <ShieldCheck className="w-12 h-12 text-primary" />
                    </div>
                </div>

                <div className="text-center space-y-3 animate-reveal stagger-1">
                    <h2 className="text-4xl font-black text-white tracking-tight leading-tight">Session ended</h2>
                    <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase opacity-60">You took a brave step today.</p>
                </div>

                <div className="grid grid-cols-2 gap-5 w-full animate-reveal stagger-2">
                    <GlassContainer intensity="low" className="p-6 flex flex-col items-center gap-3 border-white/5 bg-white/5 rounded-[2rem] hover:bg-white/[0.08] transition-colors">
                        <Clock className="w-6 h-6 text-primary/70" />
                        <span className="text-2xl font-black text-white tracking-tighter">{duration}</span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Duration</span>
                    </GlassContainer>

                    <GlassContainer intensity="low" className="p-6 flex flex-col items-center gap-3 border-white/5 bg-white/5 rounded-[2rem] hover:bg-white/[0.08] transition-colors">
                        <MessageSquare className="w-6 h-6 text-primary/70" />
                        <span className="text-2xl font-black text-white tracking-tighter">{state.transcript.length}</span>
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Exchanges</span>
                    </GlassContainer>
                </div>

                <div className="w-full space-y-6 animate-reveal stagger-3">
                    <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.4em] text-center">Recommended for you</p>

                    <div className="space-y-4">
                        <div className="p-5 glass-card rounded-[2.5rem] flex items-center gap-5 group cursor-pointer active:scale-95 transition-all hover:bg-white/[0.05]">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <div className="text-left space-y-0.5">
                                <p className="font-black text-white text-base">Self-care guide</p>
                                <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Gentle grounding tasks</p>
                            </div>
                        </div>

                        <div className="p-5 glass-card rounded-[2.5rem] flex items-center gap-5 group cursor-pointer active:scale-95 transition-all hover:bg-white/[0.05]" onClick={() => window.open('https://988lifeline.org', '_blank')}>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-500">
                                <Home className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="text-left space-y-0.5">
                                <p className="font-black text-white text-base">988 Lifeline</p>
                                <p className="text-[11px] font-bold text-white/30 uppercase tracking-wider">Resource website</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 safe-bottom animate-reveal stagger-4">
                <button
                    onClick={resetSession}
                    className="w-full py-6 bg-white text-slate-950 rounded-[2rem] font-black tracking-[0.2em] uppercase shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                    <RefreshCw className="w-5 h-5" />
                    New Session
                </button>
            </div>
        </div>

    );
}
