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
import { NetworkIndicator } from '@/components/NetworkIndicator';
import { useNetwork } from '@/hooks/useNetwork';

export default function HomePage() {
  const router = useRouter();
  const { startSession, setAutoCallEmergency, setIncognito, state } = useSession();
  const { status, connect, disconnect, isSpeaking } = useConversation();
  const { isOnline } = useNetwork();
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
      <header className="p-8 flex items-center justify-between z-10 animate-reveal">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(31,154,248,0.2)]">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white/90">CrisisHelp</h1>
        </div>

        <div className="flex items-center gap-4">
          <NetworkIndicator />
          <button className="p-2.5 rounded-full glass-button active-scale">
            <Settings className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 gap-20 relative overflow-hidden">
        {/* Connection Status Badge */}
        <div className={cn(
          "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all duration-700 z-10 animate-reveal stagger-1",
          status === 'connected' ? "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
            status === 'connecting' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 animate-pulse" :
              "bg-white/[0.03] border-white/10 text-white/30"
        )}>
          {status === 'connected' ? 'Session Active' : status === 'connecting' ? 'Connecting...' : 'Secure & Anonymous'}
        </div>

        {/* Central Pulse UI */}
        <div className="relative w-full aspect-square max-w-[320px] flex items-center justify-center animate-reveal stagger-2">
          {/* Animated Background Rings */}
          {(status === 'connected' || status === 'connecting') && (
            <>
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '0s' }} />
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse-ring" style={{ animationDelay: '1s' }} />
            </>
          )}

          <button
            onClick={status === 'connected' ? disconnect : handleStart}
            disabled={!isOnline && status !== 'connected'}
            className={cn(
              "relative z-10 w-56 h-56 rounded-full flex flex-col items-center justify-center gap-5 transition-all duration-700 overflow-hidden shadow-[0_0_100px_-20px_rgba(31,154,248,0.4)] hover:shadow-[0_0_120px_-10px_rgba(31,154,248,0.5)] active:scale-95 group",
              status === 'connected' ? "bg-primary text-white scale-110" :
                !isOnline ? "glass-card text-white/20 opacity-50 cursor-not-allowed" : "glass-card text-white/80 hover:scale-[1.02]"
            )}
          >
            {/* Mesh gradient inside button for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

            <Mic className={cn(
              "w-14 h-14 transition-all duration-700 group-hover:scale-110",
              isSpeaking && "scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]",
              status === 'connected' ? "text-white" : !isOnline ? "text-white/20" : "text-primary"
            )} />
            <span className="font-black text-xs uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity text-center px-4">
              {status === 'connected' ? 'Tap to End' : isOnline ? 'Start Session' : 'Offline'}
            </span>
          </button>
        </div>

        <div className="text-center space-y-6 max-w-sm z-10 animate-reveal stagger-3">
          <h2 className="text-3xl font-black text-white tracking-tight animate-float leading-[1.1]">
            {isOnline ? "You're safe here." : "Support is here."}
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            {isOnline
              ? "I'm your AI counselor, available 24/7 to listen and help you through this moment." :
              "You're offline, but my guiding tools are still available to support you right now."
            }
          </p>
        </div>

        {!isOnline && (
          <div className="w-full max-w-md animate-reveal stagger-4">
            <OfflineGuide />
          </div>
        )}
      </main>

      {/* Bottom Controls / Bottom Sheet Background */}
      <footer className="px-8 pb-12 space-y-10 z-10 animate-reveal stagger-4">
        <SOSButton />

        <div className="relative w-full h-[1px] bg-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer" />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 text-center">
            Trusted Emergency Resources
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {resources.slice(1, 3).map((resource) => (
              <a
                key={resource.name}
                href={`tel:${resource.phone}`}
                className="flex items-center justify-between p-5 glass-card rounded-[2rem] group active:scale-95 transition-all hover:bg-white/[0.05]"
              >
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em]">{resource.name}</p>
                  <p className="text-sm font-black text-white">{resource.phone}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <p className="text-[10px] font-bold text-center text-white/10 italic max-w-[220px] mx-auto leading-relaxed">
          Experimental AI system. In immediate danger? Always dial 911 first.
        </p>
      </footer>

    </div>
  );
}

