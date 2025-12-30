"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { WifiOff, Wind, Anchor, ChevronRight, ChevronLeft, Heart, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { OFFLINE_GROUNDING_RESOURCES } from '@/lib/offlineResources';
import { cn } from '@/lib/constants';
import { GlassContainer } from './GlassContainer';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

export function OfflineGuide() {
    const [activeGuide, setActiveGuide] = useState<'breathing' | 'grounding' | null>(null);
    const { speak, speakSequence, pause, resume, cancel, isSpeaking, isPaused, isSupported, hasVoices, currentIndex } = useSpeechSynthesis();
    const [isNarrating, setIsNarrating] = useState(false);



    // Cleanup speech on unmount or guide change
    useEffect(() => {
        return () => cancel();
    }, [activeGuide, cancel]);

    const handleClose = () => {

        cancel();
        setIsNarrating(false);
        setActiveGuide(null);
    };

    const handleOpenGuide = (guide: 'breathing' | 'grounding') => {
        setActiveGuide(guide);
        // Auto-trigger narration on selection for optimal UX
        setTimeout(() => startNarration(), 500);
    };

    const startNarration = async () => {
        if (!activeGuide) return;
        const guide = OFFLINE_GROUNDING_RESOURCES[activeGuide];


        setIsNarrating(true);

        // Speak benefit first, then all steps
        speak(guide.benefit);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await speakSequence(guide.steps, 2000);

        setIsNarrating(false);
    };

    const toggleNarration = () => {
        if (isNarrating) {
            if (isPaused) {
                resume();
            } else if (isSpeaking) {
                pause();
            } else {
                cancel();
                setIsNarrating(false);
            }
        } else {
            startNarration();
        }
    };

    const stopNarration = () => {
        cancel();
        setIsNarrating(false);
    };



    if (activeGuide) {
        const guide = OFFLINE_GROUNDING_RESOURCES[activeGuide];
        return createPortal(
            <div className="fixed inset-0 z-[100] bg-background animate-in fade-in duration-700">
                <div className="h-full section-container flex flex-col pt-[var(--space-hero)] pb-[var(--space-hero)]">
                    <header className="flex justify-between items-start mb-[var(--space-3xl)]">
                        <button
                            onClick={handleClose}
                            className="group flex items-center gap-4 text-mono-badge hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:outline-none"
                            aria-label="Return to Workspace"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span>Return to Workspace</span>
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="text-mono-badge text-white/40 hidden md:block">
                                {isNarrating ? 'Guidance Playing' : 'Manual Navigation'}
                            </span>
                            <button
                                onClick={toggleNarration}
                                disabled={!hasVoices}
                                className={cn(
                                    "px-6 py-4 rounded-full transition-all duration-300 flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                                    isNarrating ? "bg-primary text-black" : "glass-button text-white/70"
                                )}
                                aria-label={isNarrating ? "Mute guidance" : "Play guidance"}
                            >
                                {isNarrating ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {isNarrating ? 'Mute' : 'Play'}
                                </span>
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col lg:flex-row gap-[var(--space-hero)] items-start">
                        <div className="max-w-xl w-full space-y-[var(--space-xl)]">
                            <div className="text-mono-badge text-primary/80">
                                {activeGuide === 'breathing' ? '01 / Biometric Focus' : '02 / Sensory Awareness'}
                            </div>
                            <h2 className="text-display" aria-live="polite">
                                {isNarrating && currentIndex >= 0 ? (
                                    currentIndex === 0 ? "Inhale" :
                                        currentIndex === 1 ? "Hold" :
                                            "Exhale"
                                ) : guide.title}
                            </h2>
                            <p className="text-xl text-white/80 font-medium leading-relaxed" aria-live="assertive">
                                {isNarrating && currentIndex >= 0 ? guide.steps[currentIndex] : guide.benefit}
                            </p>
                        </div>

                        <div className="flex-1 w-full flex items-center justify-center min-h-[400px]">
                            {activeGuide === 'breathing' ? (
                                <div className="relative w-80 h-80 flex items-center justify-center">
                                    <div className={cn(
                                        "absolute inset-0 border border-primary/20",
                                        isNarrating ? "animate-pulse-ring" : "opacity-20"
                                    )} />
                                    <div
                                        className="w-32 h-32 bg-primary/10 border border-primary/40 flex items-center justify-center transition-all duration-[4000ms] ease-in-out"
                                        style={{
                                            transform: `scale(${isNarrating && currentIndex === 0 ? 1.5 : isNarrating && currentIndex === 2 ? 0.8 : 1})`,
                                            borderRadius: '0%'
                                        }}
                                    >
                                        <Wind className="w-10 h-10 text-primary" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full space-y-[var(--space-md)]" role="list">
                                    {guide.steps.map((step, idx) => (
                                        <div
                                            key={step}
                                            role="listitem"
                                            className={cn(
                                                "p-8 glass-card rounded-none flex items-center justify-between transition-all duration-700",
                                                currentIndex === idx ? "border-primary/60 bg-primary/10 translate-x-4" : "opacity-40"
                                            )}
                                        >
                                            <div className="flex items-center gap-8">
                                                <span className="text-display text-4xl opacity-20">{idx + 1}</span>
                                                <span className={cn(
                                                    "text-xl font-bold tracking-tight",
                                                    currentIndex === idx ? "text-white" : "text-white/60"
                                                )}>{step}</span>
                                            </div>
                                            {currentIndex === idx && <div className="w-3 h-3 bg-primary animate-pulse" aria-hidden="true" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="mt-auto pt-[var(--space-3xl)] flex items-center justify-between border-t border-white/5">
                        <div className="text-mono-badge">
                            {isNarrating ? 'Interactive Guidance Active' : 'Manual Mode'}
                        </div>
                        <button
                            onClick={handleClose}
                            className="px-10 py-5 bg-primary text-black font-black text-sm uppercase tracking-widest"
                        >
                            I feel better
                        </button>
                    </footer>
                </div>
            </div>,
            document.body
        );
    }

    return (
        <section className="w-full animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Tool Selection Grid - Swiss Pane Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
                {/* Breathing Pane */}
                <button
                    onClick={() => handleOpenGuide('breathing')}
                    className="group relative h-[600px] flex flex-col items-start justify-end p-[var(--space-2xl)] glass-card active-scale overflow-hidden rounded-none border-white/10 hover:border-primary/40 transition-all font-sans focus-visible:ring-4 focus-visible:ring-primary/20 outline-none"
                    aria-label="Open Breathing Interaction: Biometric Focus"
                >
                    <div className="absolute top-[var(--space-2xl)] left-[var(--space-2xl)]">
                        <Wind className="w-12 h-12 text-primary opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-12" />
                    </div>

                    <div className="space-y-[var(--space-lg)] text-left relative z-10 w-full">
                        <div className="text-mono-badge text-primary/80">01 / Rhythmic Focus</div>
                        <h3 className="text-display group-hover:tracking-normal transition-all duration-700">Breathe.</h3>
                        <p className="text-white/70 font-medium leading-relaxed max-w-sm">
                            A precise biological reset. Navigate the 4-7-8 method to stabilize your autonomic nervous system.
                        </p>

                        <div className="pt-[var(--space-xl)] flex items-center gap-4 text-mono-badge group-hover:text-primary transition-all">
                            <span>Open Interaction</span>
                            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                        </div>
                    </div>
                </button>

                {/* Grounding Pane */}
                <button
                    onClick={() => handleOpenGuide('grounding')}
                    className="group relative h-[600px] flex flex-col items-start justify-end p-[var(--space-2xl)] glass-card active-scale overflow-hidden rounded-none border-white/10 hover:border-primary/40 transition-all font-sans focus-visible:ring-4 focus-visible:ring-primary/20 outline-none"
                    aria-label="Open Anchor Interaction: Sensory Presence"
                >
                    <div className="absolute top-[var(--space-2xl)] right-[var(--space-2xl)]">
                        <Anchor className="w-12 h-12 text-white/10 group-hover:text-primary transition-all duration-700" />
                    </div>

                    <div className="space-y-[var(--space-lg)] text-left relative z-10 w-full">
                        <div className="text-mono-badge text-white/60">02 / Sensory Presence</div>
                        <h3 className="text-display group-hover:tracking-normal transition-all duration-700">Anchor.</h3>
                        <p className="text-white/70 font-medium leading-relaxed max-w-sm">
                            Interrupt the feedback loop of panic. Pull yourself back into the objective present through five senses.
                        </p>

                        <div className="pt-[var(--space-xl)] flex items-center gap-4 text-mono-badge group-hover:text-primary transition-all">
                            <span>Initiate Observation</span>
                            <div className="w-8 h-[1px] bg-white/20 group-hover:w-16 group-hover:bg-primary transition-all duration-700" />
                        </div>
                    </div>
                </button>
            </div>
        </section>
    );
}
