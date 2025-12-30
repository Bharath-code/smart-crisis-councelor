"use client";

import { useState } from 'react';
import { Phone, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { alertEmergencyServices } from '@/lib/tools';
import { cn } from '@/lib/constants';
import { useSession } from '@/hooks/useSession';


export function SOSButton() {
    const { state } = useSession();
    const [isActivating, setIsActivating] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const handleSOS = async () => {
        setIsActivating(true);
        setError(null);

        // Tactile feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }

        try {
            const result = await alertEmergencyServices('high', true, state.emergencyContact);
            if (!result.success) {
                setError('Failed to share location. Calling 911 anyway.');
                window.location.assign("tel:911");
            }
        } catch (err) {
            console.error('SOS failed:', err);
            window.location.assign("tel:911");
        } finally {
            setTimeout(() => setIsActivating(false), 2000);
        }
    };


    return (
        <div className="w-full flex flex-col gap-[var(--space-sm)]">
            <button
                onClick={handleSOS}
                disabled={isActivating}
                className={cn(
                    "relative w-full py-10 transition-all duration-700 overflow-hidden rounded-none",
                    "bg-destructive text-white border-t border-white/20 active:scale-[0.99] group",
                    isActivating && "opacity-90 saturate-[0.8]"
                )}
            >
                {/* Precision Border Pulse */}
                {isActivating && (
                    <div className="absolute inset-0 border-2 border-white/40 animate-pulse" />
                )}

                <div className="relative flex items-center justify-center gap-8 px-[var(--space-md)]">
                    {isActivating ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-none animate-spin" />
                    ) : (
                        <AlertTriangle className="w-6 h-6 text-white/90 group-hover:rotate-12 transition-transform duration-500" />
                    )}

                    <div className="text-left space-y-1">
                        <div className="text-display text-4xl tracking-normal">{isActivating ? 'Dialing' : 'SOS'}</div>
                        <div className="text-mono-badge text-white/60 lowercase tracking-[0.2em]">Press for immediate action</div>
                    </div>
                </div>
            </button>

            <div className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em] font-medium text-destructive-foreground/40">
                <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-destructive" />
                    <span>Location Lock: Active</span>
                </div>
                <span>911 Dispatch Link</span>
            </div>

            {error && (
                <div className="p-4 bg-white/5 border border-destructive/20 text-[11px] font-bold text-destructive uppercase tracking-widest text-center">
                    {error}
                </div>
            )}
        </div>
    );
}

