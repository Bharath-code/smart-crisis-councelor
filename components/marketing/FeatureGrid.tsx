"use client";

import { Ear, ShieldCheck, HeartPulse, Zap, MapPin, MessageSquare } from "lucide-react";

const features = [
    {
        icon: Ear,
        title: "Voice-First Support",
        description: "Sub-800ms response time ensures a natural, uninterrupted conversation when you need it most.",
        accent: "text-blue-400"
    },
    {
        icon: ShieldCheck,
        title: "Absolute Anonymity",
        description: "No accounts, no tracking. Incognito mode ensures your session data is never stored on our servers.",
        accent: "text-purple-400"
    },
    {
        icon: HeartPulse,
        title: "Medical Triage",
        description: "AI-guided first-aid protocols and emotional grounding techniques tailored to your situation.",
        accent: "text-red-400"
    },
    {
        icon: Zap,
        title: "Instant Connection",
        description: "One-tap access to help without navigating complex menus or waiting on hold.",
        accent: "text-yellow-400"
    },
    {
        icon: MapPin,
        title: "Emergency SOS",
        description: "Automatic GPS sharing with emergency services if a life-threatening scenario is detected.",
        accent: "text-green-400"
    },
    {
        icon: MessageSquare,
        title: "Real-time Transcript",
        description: "Follow the conversation with a live transcript, ensuring clarity during stressful moments.",
        accent: "text-cyan-400"
    }
];

export function FeatureGrid() {
    return (
        <section id="features" className="section-padding bg-white/[0.02]">
            <div className="section-container">
                <div className="mb-20 space-y-4 animate-reveal">
                    <h2 className="text-heading">
                        Engineered for <br />
                        <span className="text-editorial">reliability.</span>
                    </h2>
                    <p className="max-w-xl text-white/40 font-medium">
                        We've combined tactical AI logic with a compassionate voice interface to
                        provide a bridge to safety in any situation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div
                            key={feature.title}
                            className="p-10 glass-card rounded-[3rem] space-y-6 hover-lift group animate-reveal"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors`}>
                                <feature.icon className={`w-6 h-6 ${feature.accent} opacity-80 group-hover:opacity-100 transition-all`} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-black tracking-tight text-white/90">{feature.title}</h3>
                                <p className="text-white/40 leading-relaxed font-medium text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
