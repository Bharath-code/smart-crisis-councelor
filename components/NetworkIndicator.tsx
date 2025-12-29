"use client";

import { Wifi, WifiOff } from 'lucide-react';
import { useNetwork } from '@/hooks/useNetwork';
import { cn } from '@/lib/constants';

export function NetworkIndicator() {
    const { isOnline } = useNetwork();

    return (
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-500",
            isOnline
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
        )}>
            {isOnline ? (
                <>
                    <Wifi className="w-3 h-3" />
                    <span>Online</span>
                </>
            ) : (
                <>
                    <WifiOff className="w-3 h-3" />
                    <span>Offline Mode</span>
                </>
            )}
        </div>
    );
}
