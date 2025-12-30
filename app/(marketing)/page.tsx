"use client";

import { HeroSection } from "@/components/marketing/HeroSection";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { TrustSection } from "@/components/marketing/TrustSection";
import { Phone, Shield, ExternalLink } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main>
                <HeroSection />
                <FeatureGrid />
                <ProcessSteps />
                <TrustSection />
            </main>

            <footer className="section-padding border-t border-white/5 bg-black">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <Shield className="w-4 h-4 text-primary" />
                                </div>
                                <h2 className="text-lg font-black tracking-tight text-white/90 uppercase">CrisisHelp</h2>
                            </div>
                            <p className="text-white/30 text-xs font-bold leading-relaxed max-w-xs uppercase tracking-widest">
                                AI-powered support for life's most critical moments.
                                Immediate. Anonymous. Life-saving.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Emergency</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="tel:911" className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-black text-sm uppercase tracking-widest">
                                        <Phone className="w-3.5 h-3.5" /> Call 911
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:988" className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors font-black text-sm uppercase tracking-widest">
                                        <Phone className="w-3.5 h-3.5" /> 988 Suicide Crisis
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Platform</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="/help" className="text-white/50 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                                        Start Session <ExternalLink className="w-3 h-3 opacity-30" />
                                    </a>
                                </li>
                                <li>
                                    <a href="#features" className="text-white/50 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">Technology</a>
                                </li>
                                <li>
                                    <a href="#" className="text-white/50 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest">Safety Guide</a>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Legal</h3>
                            <p className="text-[10px] font-bold text-white/10 italic leading-relaxed">
                                Experimental AI system. In immediate danger? Always dial 911 first.
                                By starting a session, you agree to our terms of service and privacy protocols.
                            </p>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                        <span className="text-[10px] font-black text-white/10 uppercase tracking-[0.3em]">
                            © 2025 Smart Crisis Counselor. All Rights Reserved.
                        </span>
                        <div className="flex gap-8">
                            <a href="#" className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.3em] transition-colors">Privacy</a>
                            <a href="#" className="text-[10px] font-black text-white/20 hover:text-white uppercase tracking-[0.3em] transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
