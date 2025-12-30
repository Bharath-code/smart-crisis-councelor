"use client";

import { useState, useEffect } from "react";
import { Mic, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
    const [mounted, setMounted] = useState(false);
    const [heights, setHeights] = useState<number[]>([]);

    useEffect(() => {
        setMounted(true);
        setHeights([...Array(12)].map(() => Math.random() * 100));
    }, []);

    return (
        <section className="relative min-h-[90dvh] flex flex-col items-center justify-center overflow-hidden section-padding">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] aspect-square rounded-full bg-primary/5 blur-[120px] -z-10" />

            <div className="section-container text-center space-y-12 md:space-y-20">
                <div className="space-y-6 animate-reveal">
                    <span className="text-mono-badge stagger-1 inline-block">
                        Next-Gen Crisis Support
                    </span>
                    <h1 className="text-display stagger-2">
                        Silence <br />
                        <span className="text-editorial">the noise.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-white/50 text-lg md:text-xl font-medium leading-relaxed stagger-3">
                        The world's first AI-powered crisis counselor with sub-800ms voice response.
                        Immediate, anonymous, and life-saving support when every second counts.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-reveal stagger-4">
                    <Link href="/help">
                        <Button size="lg" className="h-16 px-10 rounded-full text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-background group active-scale shadow-[0_0_40px_rgba(31,154,248,0.3)]">
                            Start Voice Help
                            <Mic className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Button>
                    </Link>

                    <Link href="#features">
                        <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg font-black uppercase tracking-widest glass-button group active-scale">
                            How it Works
                            <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Floating Mini visualizer preview */}
                <div className="pt-20 animate-reveal stagger-5 opacity-40">
                    <div className="flex items-center gap-1.5 h-8">
                        {mounted && heights.map((height, i) => (
                            <div
                                key={i}
                                className="w-1 bg-primary/40 rounded-full animate-pulse-slow"
                                style={{
                                    height: `${height}%`,
                                    animationDelay: `${i * 0.1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
