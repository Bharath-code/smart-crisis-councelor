"use client";

import { useState, useRef } from 'react';
import { Phone, MapPin, Loader2, AlertTriangle, XCircle } from 'lucide-react';
import { alertEmergencyServices } from '@/lib/tools';
import { cn } from '@/lib/constants';
import { useSession } from '@/hooks/useSession';

export function SOSButton() {
    const { state } = useSession();
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number } | null>(null);
    const audioRef = useRef<{ ctx: AudioContext; oscillator: OscillatorNode } | null>(null);

    const stopPanicSound = () => {
        if (audioRef.current) {
            try {
                audioRef.current.oscillator.stop();
                audioRef.current.ctx.close();
            } catch (e) {
                console.warn('Error stopping audio:', e);
            }
            audioRef.current = null;
        }
    };

    const playPanicSound = () => {
        stopPanicSound(); // Ensure no double audio
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);

        // Continuous pulse logic using modulation or simple gain ramping
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

        // Loop the pulse every 0.5s
        const now = audioCtx.currentTime;
        for (let i = 0; i < 60; i++) { // Pulse for 60 seconds (buffer)
            gainNode.gain.linearRampToValueAtTime(0.5, now + (i * 1.0) + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, now + (i * 1.0) + 0.5);
        }

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        audioRef.current = { ctx: audioCtx, oscillator };
    };

    const handleSOS = async () => {
        setIsEmergencyActive(true);
        setError(null);
        playPanicSound();

        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }

        try {
            const result = await alertEmergencyServices('high', false, state.emergencyContact);
            if (result.location) {
                setLastLocation({ lat: result.location.lat, lng: result.location.lng });
            }
            if (result.smsUrl) {
                window.location.href = result.smsUrl;
            }
            setTimeout(() => {
                window.location.assign("tel:911");
            }, 800);

            if (!result.success) {
                setError('Location access failed. Calling 911 directly.');
            }
        } catch (err) {
            console.error('SOS failed:', err);
            window.location.assign("tel:911");
        }
    };

    const handleCancel = () => {
        setIsEmergencyActive(false);
        stopPanicSound();
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    };

    return (
        <>
            {/* Global Panic Overlay */}
            {isEmergencyActive && (
                <div className="fixed inset-0 z-[200] pointer-events-none animate-[panic-strobe_0.5s_infinite] mix-blend-overlay border-[20px] border-destructive/50" />
            )}

            <div className="w-full flex flex-col gap-[var(--space-sm)]">
                {!isEmergencyActive ? (
                    <button
                        onClick={handleSOS}
                        className={cn(
                            "relative w-full py-10 transition-all duration-700 overflow-hidden rounded-none",
                            "bg-destructive text-white border-t border-white/20 active:scale-[0.99] group"
                        )}
                    >
                        <div className="relative flex items-center justify-center gap-8 px-[var(--space-md)] z-10">
                            <AlertTriangle className="w-6 h-6 text-white/90 group-hover:rotate-12 transition-transform duration-500" />
                            <div className="text-left space-y-1">
                                <div className="text-display text-4xl tracking-normal">SOS</div>
                                <div className="text-mono-badge text-white/60 lowercase tracking-[0.2em]">Press for immediate action</div>
                            </div>
                        </div>
                    </button>
                ) : (
                    <button
                        onClick={handleCancel}
                        className={cn(
                            "relative w-full py-10 transition-all duration-700 overflow-hidden rounded-none",
                            "bg-slate-950 text-white border-4 border-destructive active:scale-[0.99] group shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                        )}
                    >
                        <div className="absolute inset-0 bg-destructive/10 animate-pulse" />
                        <div className="relative flex items-center justify-center gap-8 px-[var(--space-md)] z-10">
                            <XCircle className="w-10 h-10 text-destructive animate-pulse" />
                            <div className="text-left space-y-1">
                                <div className="text-display text-3xl tracking-normal uppercase font-black">Cancel Emergency</div>
                                <div className="text-mono-badge text-white/60 lowercase tracking-[0.2em]">Stop alerts and sound</div>
                            </div>
                        </div>
                    </button>
                )}

                <div className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em] font-medium text-destructive-foreground/40">
                    <div className="flex items-center gap-2">
                        <MapPin className={cn("w-3 h-3", lastLocation ? "text-green-500" : "text-destructive")} />
                        <span>{lastLocation ? `LOCK: ${lastLocation.lat.toFixed(4)}, ${lastLocation.lng.toFixed(4)}` : 'Location Lock: Active'}</span>
                    </div>
                    <span>{lastLocation ? 'SENT TO CONTACT' : '911 Dispatch Link'}</span>
                </div>

                {error && (
                    <div className="p-4 bg-white/5 border border-destructive/20 text-[11px] font-bold text-destructive uppercase tracking-widest text-center">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
}

