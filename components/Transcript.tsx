"use client";

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/constants';
import type { TranscriptEntry } from '@/types';

interface TranscriptProps {
  entries: TranscriptEntry[];
  maxHeight?: number;
  className?: string;
}

export function Transcript({ entries, maxHeight = 300, className }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        'overflow-y-auto space-y-3 p-4 bg-slate-900/50 rounded-lg border border-slate-800',
        className
      )}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {entries.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-4">
          Conversation will appear here...
        </p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.id}
            className={`flex flex-col ${
              entry.speaker === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                entry.speaker === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              <p className="text-sm leading-relaxed">{entry.text}</p>
            </div>
            <span className="text-xs text-slate-500 mt-1 px-1">
              {entry.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
