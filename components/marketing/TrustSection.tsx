"use client";

import { ShieldAlert, Fingerprint, Lock, Globe } from "lucide-react";

export function TrustSection() {
    return (
        <section className="section-padding bg-black/40">
            <div className="section-container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12 animate-reveal">
                        <h2 className="text-heading">
                            Built on a foundation <br />
                            <span className="text-editorial">of trust.</span>
                        </h2>
                        <p className="text-white/50 text-xl font-medium leading-relaxed max-w-xl">
                            Privacy isn't a feature—it's the core architecture. We've built Smart Crisis
                            Counselor to ensure that your most vulnerable moments remain yours alone.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Fingerprint className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">No Tracking</span>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">
                                    Zero cookies, zero device fingerprinting. Every session is a clean slate.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Lock className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">End-to-End</span>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">
                                    WebRTC encryption ensures your voice stream never hits a database.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <ShieldAlert className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">Protocol First</span>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">
                                    AI logic strictly adheres to SAMHSA and clinical crisis protocols.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary">
                                    <Globe className="w-5 h-5" />
                                    <span className="text-sm font-black uppercase tracking-widest">Global Reach</span>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">
                                    Edge deployment for sub-second latency across 52 global regions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-[4rem] p-16 space-y-10 animate-reveal stagger-2">
                        <div className="space-y-2">
                            <span className="text-mono-badge">Safety Audit v1.0</span>
                            <h3 className="text-3xl font-black text-white italic">"A technical marvel of compassionate AI."</h3>
                        </div>

                        <div className="pt-10 border-t border-white/5 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Latency Target</span>
                                <span className="text-primary text-2xl font-black">&lt;800ms</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[92%] h-full bg-primary animate-shimmer" />
                            </div>

                            <div className="flex justify-between items-end">
                                <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Data Retention</span>
                                <span className="text-primary text-2xl font-black">0 Seconds</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="w-[5%] h-full bg-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
