"use client";

import { useState } from 'react';
import { WifiOff, Wind, Anchor, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { OFFLINE_GROUNDING_RESOURCES } from '@/lib/offlineResources';
import { cn } from '@/lib/constants';
import { GlassContainer } from './GlassContainer';

export function OfflineGuide() {
    const [activeGuide, setActiveGuide] = useState<'breathing' | 'grounding' | null>(null);

    if (activeGuide) {
        const guide = OFFLINE_GROUNDING_RESOURCES[activeGuide];
        return (
            <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col animate-in fade-in duration-500">
                {/* Background mesh for consistency */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

                <header className="p-6 flex items-center gap-4 z-10">
                    <button
                        onClick={() => setActiveGuide(null)}
                        className="p-3 rounded-2xl glass-button text-white/70 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-black text-white tracking-tight">{guide.title}</h2>
                </header>

                <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10 z-10">
                    <GlassContainer intensity="low" className="p-6 border-primary/20 bg-primary/5">
                        <p className="text-primary font-bold text-sm flex items-center gap-2">
                            <Heart className="w-4 h-4 fill-primary" />
                            {guide.benefit}
                        </p>
                    </GlassContainer>

                    <div className="space-y-4">
                        {guide.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-4 p-5 glass-card rounded-2xl group transition-all duration-500">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-sm border border-primary/30 group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </span>
                                <p className="text-white/80 leading-relaxed text-sm">{step}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 z-10 safe-bottom">
                    <button
                        onClick={() => setActiveGuide(null)}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-black tracking-widest uppercase shadow-2xl active:scale-95 transition-all"
                    >
                        I feel a bit better
                    </button>
                </div>
            </div>
        );
    }

    return (
        <GlassContainer className="w-full p-8 border-yellow-500/30 bg-yellow-500/5 space-y-8 animate-in slide-in-from-bottom-5">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                    <WifiOff className="w-7 h-7 text-yellow-500" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-black text-white text-lg tracking-tight">Offline Mode</h3>
                    <p className="text-xs text-yellow-500/70 font-bold uppercase tracking-widest">Connection lost</p>
                </div>
            </div>

            <p className="text-white/60 text-sm leading-relaxed">
                I can still guide you through calming exercises until your connection returns.
            </p>

            <div className="grid grid-cols-1 gap-4">
                <button
                    onClick={() => setActiveGuide('breathing')}
                    className="flex items-center justify-between p-5 glass-card rounded-2xl group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Wind className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white text-sm">Breathing Guide</p>
                            <p className="text-[10px] text-white/40 font-bold tracking-wider uppercase">4-7-8 Technique</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                </button>

                <button
                    onClick={() => setActiveGuide('grounding')}
                    className="flex items-center justify-between p-5 glass-card rounded-2xl group active:scale-[0.98] transition-all"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Anchor className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-white text-sm">Grounding Tool</p>
                            <p className="text-[10px] text-white/40 font-bold tracking-wider uppercase">5-4-3-2-1 Method</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                </button>
            </div>
        </GlassContainer>
    );
}

