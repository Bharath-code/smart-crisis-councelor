"use client";

import { useState } from 'react';
import { Phone, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { alertEmergencyServices } from '@/lib/tools';
import { cn } from '@/lib/constants';

export function SOSButton() {
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSOS = async () => {
        setIsActivating(true);
        setError(null);
        try {
            const result = await alertEmergencyServices('high', true);
            if (!result.success) {
                setError('Failed to share location. Calling 911 anyway.');
                window.location.href = "tel:911";
            }
        } catch (err) {
            console.error('SOS failed:', err);
            window.location.href = "tel:911";
        } finally {
            setTimeout(() => setIsActivating(false), 2000);
        }
    };

    return (
        <div className="w-full space-y-4">
            <button
                onClick={handleSOS}
                disabled={isActivating}
                className={cn(
                    "relative w-full py-8 rounded-[2rem] font-black text-2xl uppercase tracking-[0.1em] transition-all duration-500 overflow-hidden",
                    "bg-red-500 text-white shadow-[0_20px_50px_-15px_rgba(239,68,68,0.5)]",
                    "border border-white/20 active:scale-95 group",
                    isActivating && "opacity-90 grayscale-[0.5]"
                )}
            >
                {/* Glossy overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />

                {/* Pulse waves when hovering or active */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute w-full h-full rounded-full border border-white/30 animate-pulse-ring" />
                </div>

                <div className="relative flex items-center justify-center gap-4">
                    {isActivating ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                        <AlertTriangle className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-shadow-glow">
                        {isActivating ? 'Emergency Dialing...' : 'Immediate SOS'}
                    </span>
                </div>
            </button>

            <div className="flex items-center justify-center gap-2 text-red-400/80 font-bold text-[10px] uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                <span>Auto-GPS Share + 911 Call</span>
            </div>

            {error && (
                <p className="text-center text-xs text-red-500 font-black animate-bounce">
                    {error}
                </p>
            )}
        </div>
    );
}

