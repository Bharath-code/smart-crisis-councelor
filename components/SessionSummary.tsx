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
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-2xl flex flex-col p-6 animate-in fade-in duration-700">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 max-w-sm mx-auto w-full">

                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative w-24 h-24 rounded-full bg-slate-900 border border-primary/30 flex items-center justify-center">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Session ended</h2>
                    <p className="text-slate-400 text-sm font-medium">You took a brave step today.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <GlassContainer intensity="low" className="p-4 flex flex-col items-center gap-2 border-white/5 bg-white/5">
                        <Clock className="w-5 h-5 text-primary/70" />
                        <span className="text-lg font-black text-white">{duration}</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Duration</span>
                    </GlassContainer>

                    <GlassContainer intensity="low" className="p-4 flex flex-col items-center gap-2 border-white/5 bg-white/5">
                        <MessageSquare className="w-5 h-5 text-primary/70" />
                        <span className="text-lg font-black text-white">{state.transcript.length}</span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Exchanges</span>
                    </GlassContainer>
                </div>

                <div className="w-full space-y-4">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-center">Next Steps</p>

                    <div className="space-y-3">
                        <div className="p-4 glass-card rounded-2xl flex items-center gap-4 group cursor-pointer active:scale-95 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm">Self-care guide</p>
                                <p className="text-[10px] text-white/40">Gentle activities for right now</p>
                            </div>
                        </div>

                        <div className="p-4 glass-card rounded-2xl flex items-center gap-4 group cursor-pointer active:scale-95 transition-all" onClick={() => window.open('https://988lifeline.org', '_blank')}>
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Home className="w-5 h-5 text-orange-500" />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-white text-sm">988 Lifeline</p>
                                <p className="text-[10px] text-white/40">Official crisis support website</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 safe-bottom">
                <button
                    onClick={resetSession}
                    className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black tracking-widest uppercase shadow-2xl active:scale-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer"
                >
                    <RefreshCw className="w-5 h-5" />
                    New Session
                </button>
            </div>
        </div>
    );
}
