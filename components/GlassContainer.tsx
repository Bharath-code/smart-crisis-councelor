"use client";

import { ReactNode } from 'react';
import { cn } from '@/lib/constants';

interface GlassContainerProps {
    children: ReactNode;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}

export function GlassContainer({
    children,
    className,
    intensity = 'medium'
}: GlassContainerProps) {
    const intensities = {
        low: 'bg-white/5 border-white/5',
        medium: 'bg-white/10 border-white/10',
        high: 'bg-white/20 border-white/20'
    };

    return (
        <div className={cn(
            "backdrop-blur-xl border rounded-3xl transition-all duration-500",
            intensities[intensity],
            className
        )}>
            {children}
        </div>
    );
}
