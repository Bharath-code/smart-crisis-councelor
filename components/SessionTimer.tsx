"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/constants';

interface SessionTimerProps {
  startTime: Date | null;
  isActive: boolean;
  className?: string;
}

export function SessionTimer({ startTime, isActive, className }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && startTime) {
      intervalId = setInterval(() => {
        const now = new Date();
        const elapsedMs = now.getTime() - startTime.getTime();
        setElapsed(Math.floor(elapsedMs / 1000));
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, startTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'text-2xl font-mono font-semibold text-slate-300',
        className
      )}
    >
      {formatTime(elapsed)}
    </div>
  );
}
