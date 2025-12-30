"use client";

import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Shield, Clock, AlertCircle, WifiOff, Settings, Info, Phone, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermissionModal } from '@/components/PermissionModal';
import { SOSButton } from '@/components/SOSButton';
import { OfflineGuide } from '@/components/OfflineGuide';
import { EmergencyContactForm } from '@/components/EmergencyContactForm';

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
  const [showSettings, setShowSettings] = useState(false);


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


      {/* Zone 1: Identity & Status */}
      <header className="section-container pt-[var(--space-2xl)] pb-[var(--space-md)] flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-sm font-bold tracking-widest uppercase text-white/90">CrisisHelp</h1>
            <div className="text-mono-badge">Secure AI Support</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <NetworkIndicator />
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-full glass-button active-scale"
          >
            <Settings className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#050505] border border-white/10 p-8 relative">
            <EmergencyContactForm onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}


      {/* Zone 2: Interaction / Fluid Interaction Area */}
      <main className="flex-1 section-container flex flex-col justify-center relative py-[var(--space-xl)] md:py-[var(--space-3xl)]">

        {/* State 1: Online / AI Hero Interaction */}
        {isOnline && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-[var(--space-2xl)] items-center animate-reveal">
            <div className="lg:col-span-7 space-y-[var(--space-xl)] order-2 lg:order-1">
              <div className={cn(
                "inline-flex px-4 py-1.5 border transition-all text-mono-badge lowercase tracking-[0.2em]",
                status === 'connected' ? "bg-green-500/10 border-green-500/20 text-green-400" :
                  status === 'connecting' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
                    "bg-white/5 border-white/10"
              )}>
                {status === 'connected' ? '• System Active' : status === 'connecting' ? '• Establishing Link...' : '• Ready to Assist'}
              </div>

              <h2 className="text-display text-5xl md:text-7xl lg:text-8xl leading-[0.9]">
                You're <br /><span className="text-primary italic">Safe</span> <br />Here.
              </h2>

              <p className="max-w-md text-slate-400 font-medium leading-relaxed text-sm md:text-base">
                A trauma-informed AI companion designed to provide 24/7 de-escalation support, grounding, and guidance. Securely anonymous.
              </p>

              <div className="pt-[var(--space-md)]">
                <button
                  onClick={status === 'connected' ? disconnect : handleStart}
                  className={cn(
                    "group relative overflow-hidden glass-button px-8 md:px-12 py-5 md:py-6 flex items-center justify-between w-full md:w-auto min-w-[320px] active-scale transition-all",
                    status === 'connected' ? "border-primary/40 text-primary bg-primary/5" : "text-white",
                    status === 'disconnected' && "animate-glow-primary border-primary/40"
                  )}
                >
                  {/* Alive Glow Effect */}
                  {(status === 'connected' || status === 'connecting') && (
                    <div className="absolute inset-0 bg-primary/10 animate-pulse-slow" />
                  )}

                  <div className="flex items-center gap-6 relative z-10">
                    <div className={cn(
                      "w-4 h-4 rounded-none transition-all duration-700",
                      status === 'connected' ? "bg-primary animate-pulse shadow-[0_0_15px_rgba(var(--primary),0.8)]" :
                        status === 'connecting' ? "bg-yellow-500 animate-spin-slow" : "bg-white/40"
                    )} />
                    <span className="text-mono-badge text-sm tracking-[0.3em] font-black group-hover:tracking-[0.4em] transition-all uppercase">
                      {status === 'connected' ? 'Terminate Session' : status === 'connecting' ? 'Connecting...' : 'Initiate Session'}
                    </span>
                  </div>

                  <div className="relative z-10">
                    {status === 'connected' ? (
                      <Volume2 className="w-5 h-5 text-primary animate-bounce-subtle" />
                    ) : (
                      <Mic className={cn(
                        "w-5 h-5 transition-transform duration-700 group-hover:scale-125",
                        status === 'connecting' ? "text-yellow-500" : "text-white"
                      )} />
                    )}

                  </div>
                </button>
              </div>
            </div>

            {/* AI Visual Context - Promoted on Desktop */}
            <div className="lg:col-span-5 flex items-center justify-center relative order-1 lg:order-2 mb-8 lg:mb-0">
              <div className={cn(
                "absolute inset-0 bg-primary/5 blur-[120px] rounded-full transition-all duration-1000",
                status === 'connected' ? "opacity-100 scale-110" : "opacity-0 scale-50"
              )} />
              <div className={cn(
                "relative z-10 w-48 h-48 md:w-80 md:h-80 rounded-none border transition-all duration-1000 flex items-center justify-center overflow-hidden glass-card",
                status === 'connected' ? "border-primary/40 bg-primary/5 rotate-3 scale-105" :
                  status === 'connecting' ? "border-yellow-500/20 animate-pulse" : "border-white/5"
              )}>
                {/* Visualizer during active session */}
                {status === 'connected' ? (
                  <div className="flex items-center gap-1.5 h-16">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-1 bg-primary transition-all duration-300",
                          isSpeaking ? "animate-audio-bar" : "h-2 opacity-30"
                        )}
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                ) : (
                  <Shield className={cn(
                    "w-16 h-16 md:w-24 md:h-24 transition-all duration-1000",
                    status === 'connecting' ? "text-yellow-500/40" : "text-white/5"
                  )} />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Secondary data viz layer */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end opacity-20 text-[8px] font-black uppercase tracking-widest">
                  <span>Sensory Link</span>
                  <span>ENCRYPTED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Offline / Tool Grid Swap */}
        {!isOnline && (
          <div className="w-full animate-reveal stagger-1 flex flex-col gap-[var(--space-xl)]">
            <div className="space-y-[var(--space-md)] max-w-lg mb-[var(--space-xl)]">
              <div className="text-mono-badge text-primary/60">Device Offline</div>
              <h2 className="text-heading">Resource Pane</h2>
              <p className="text-slate-400 font-medium">Your connection is limited. Local stabilizing tools remain fully accessible.</p>
            </div>
            <OfflineGuide />
          </div>
        )}
      </main>

      {/* Zone 3: Safety Foundation / Persistent Footer */}
      <footer className="section-container pb-[var(--space-2xl)] space-y-[var(--space-2xl)] z-10">
        <SOSButton />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-md)]">
          {resources.slice(1, 3).map((resource) => (
            <a
              key={resource.name}
              href={`tel:${resource.phone}`}
              className="flex items-center justify-between p-6 glass-card rounded-none group active-scale border-white/5 hover:border-primary/20 transition-all"
            >
              <div className="space-y-1">
                <p className="text-mono-badge text-[11px] font-medium tracking-widest">{resource.name}</p>
                <p className="text-lg font-bold text-white tracking-tight">{resource.phone}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Phone className="w-4 h-4 text-white/20 group-hover:text-primary transition-all" />
              </div>
            </a>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-medium text-white/20 tracking-widest uppercase">
            Emergency System / Dial 911 for immediate danger
          </p>
          <div className="flex gap-8 text-[10px] font-medium text-white/10 tracking-[0.2em] uppercase">
            <span>v1.0.4</span>
            <span>Arch / Swiss</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

