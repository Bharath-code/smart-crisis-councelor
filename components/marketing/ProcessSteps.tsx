"use client";

import { CheckCircle2 } from "lucide-react";

const steps = [
    {
        title: "Instant Connection",
        description: "Tap the voice button to start an encrypted, low-latency session with our AI counselor.",
        time: "0ms"
    },
    {
        title: "Speak Freely",
        description: "Our AI listens and responds in real-time, providing emotional support and tactical guidance.",
        time: "800ms"
    },
    {
        title: "Get Resolution",
        description: "Receive first-aid instructions, local resources, or immediate emergency intervention if needed.",
        time: "120s"
    }
];

export function ProcessSteps() {
    return (
        <section className="section-padding overflow-hidden">
            <div className="section-container">
                <div className="flex flex-col lg:flex-row gap-20 items-start">
                    <div className="flex-1 space-y-8 animate-reveal">
                        <h2 className="text-heading">
                            A bridge to <br />
                            <span className="text-editorial">safety.</span>
                        </h2>
                        <p className="text-white/40 text-lg font-medium leading-relaxed">
                            We've optimized every millisecond of the experience to ensure
                            that help is never more than a breath away.
                        </p>

                        <div className="pt-10 space-y-12">
                            {steps.map((step, i) => (
                                <div key={step.title} className="flex gap-8 group">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] text-primary font-black text-sm z-10 relative">
                                            {i + 1}
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-primary/30 to-transparent" />
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-black text-white">{step.title}</h3>
                                            <span className="text-mono-badge text-primary/40">{step.time}</span>
                                        </div>
                                        <p className="text-white/40 font-medium max-w-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 relative animate-reveal stagger-3">
                        <div className="aspect-[4/5] glass-card rounded-[4rem] relative overflow-hidden flex items-center justify-center p-12">
                            {/* Abstract Visual representation of the process */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-20" />
                            <div className="space-y-4 w-full">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-12 w-full glass-card rounded-2xl flex items-center px-6 gap-4 animate-reveal"
                                        style={{ animationDelay: `${i * 150}ms`, opacity: 1 - (i * 0.15) }}
                                    >
                                        <div className="w-4 h-4 rounded-full border border-primary/40 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        </div>
                                        <div className="h-2 w-2/3 bg-white/5 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[100px] -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
