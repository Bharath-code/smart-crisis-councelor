"use client";

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Shield, Clock, AlertCircle, WifiOff, Settings, Info, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermissionModal } from '@/components/PermissionModal';
import { SOSButton } from '@/components/SOSButton';
import { OfflineGuide } from '@/components/OfflineGuide';
import { useSession } from '@/hooks/useSession';
import { useConversation } from '@/hooks/useConversation';
import { US_EMERGENCY_NUMBERS } from '@/lib/constants';
import { GlassContainer } from '@/components/GlassContainer';
import { cn } from '@/lib/constants';
import { SessionSummary } from '@/components/SessionSummary';

export default function HomePage() {
  const router = useRouter();
  const { startSession, setAutoCallEmergency, setIncognito, state } = useSession();
  const { status, connect, disconnect, isSpeaking } = useConversation();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const resources = Object.values(US_EMERGENCY_NUMBERS);

  const handleStart = () => {
    if (state.autoCallEmergency === undefined) {
      setShowPermissionModal(true);
    } else {
      connect();
    }
  };

  const onPermissionAllow = (autoCall: boolean) => {
    setAutoCallEmergency(autoCall);
    setShowPermissionModal(false);
    connect();
  };

  return (
    <div className="flex flex-col min-h-[100dvh] safe-bottom">
      {state.status === 'ended' && <SessionSummary />}

      <PermissionModal
        isOpen={showPermissionModal}
        onAllow={onPermissionAllow}
        onDeny={() => setShowPermissionModal(false)}
      />


      {/* App Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-white/90">CrisisHelp</h1>
        </div>
        <button className="p-2 rounded-full glass-button">
          <Settings className="w-5 h-5 text-white/70" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-12 relative overflow-hidden">
        {/* Connection Status Badge */}
        <div className={cn(
          "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all duration-500 z-10",
          status === 'connected' ? "bg-green-500/10 border-green-500/30 text-green-400" :
            status === 'connecting' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse" :
              "bg-white/5 border-white/10 text-white/40"
        )}>
          {status === 'connected' ? 'Session Active' : status === 'connecting' ? 'Connecting...' : 'Secure & Anonymous'}
        </div>

        {/* Central Pulse UI */}
        <div className="relative w-full aspect-square max-w-[280px] flex items-center justify-center">
          {/* Animated Background Rings */}
          {(status === 'connected' || status === 'connecting') && (
            <>
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '0s' }} />
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '1s' }} />
            </>
          )}

          <button
            onClick={status === 'connected' ? disconnect : handleStart}
            className={cn(
              "relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center gap-4 transition-all duration-700 overflow-hidden shadow-[0_0_80px_-20px_rgba(31,154,248,0.4)]",
              status === 'connected' ? "bg-primary text-white scale-110" : "glass-card text-white/80 hover:scale-105"
            )}
          >
            {/* Mesh gradient inside button for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <Mic className={cn(
              "w-12 h-12 transition-transform duration-500",
              isSpeaking && "scale-125",
              status === 'connected' ? "text-white" : "text-primary"
            )} />
            <span className="font-bold text-sm tracking-wide">
              {status === 'connected' ? 'Tap to End' : 'Start Session'}
            </span>
          </button>
        </div>

        <div className="text-center space-y-4 max-w-xs z-10">
          <h2 className="text-2xl font-bold text-white tracking-tight animate-float">
            You're safe here.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            I'm your AI counselor, available 24/7 to listen and help you through this moment.
          </p>
        </div>
      </main>

      {/* Bottom Controls / Bottom Sheet Background */}
      <footer className="px-6 pb-10 space-y-6 z-10">
        <SOSButton />

        <div className="relative w-full h-[1px] bg-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer" />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-center">
            Trusted Emergency Resources
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {resources.slice(1, 3).map((resource) => (
              <a
                key={resource.name}
                href={`tel:${resource.phone}`}
                className="flex items-center justify-between p-4 glass-card rounded-2xl group active:scale-95 transition-all"
              >
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{resource.name}</p>
                  <p className="text-sm font-black text-white">{resource.phone}</p>
                </div>
                <Phone className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-center text-white/20 italic max-w-[200px] mx-auto">
          Experimental AI system. In immediate danger? Always dial 911 first.
        </p>
      </footer>
    </div>
  );
}

