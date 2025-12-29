"use client";

import { useState, useEffect } from 'react';
import { Mic, MapPin, Shield, Check, X, Bell } from 'lucide-react';
import { cn } from '@/lib/constants';
import { GlassContainer } from './GlassContainer';

interface PermissionModalProps {
  isOpen: boolean;
  onAllow: (autoCallEmergency: boolean) => void;
  onDeny: () => void;
}

export function PermissionModal({ isOpen, onAllow, onDeny }: PermissionModalProps) {
  const [autoCallEmergency, setAutoCallEmergency] = useState(true);
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then(result => {
          setMicrophonePermission(result.state as any);
        });

        navigator.permissions.query({ name: 'geolocation' as PermissionName }).then(result => {
          setLocationPermission(result.state as any);
        });
      }
    }
  }, []);

  const handleAllow = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (autoCallEmergency) {
        await navigator.geolocation.getCurrentPosition(() => { });
      }
      onAllow(autoCallEmergency);
    } catch (error) {
      console.error('Permission denied:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
      <GlassContainer className="w-full max-w-md overflow-hidden shadow-[0_0_100px_-20px_rgba(31,154,248,0.3)] animate-in slide-in-from-bottom-10 duration-700">
        <div className="p-8 space-y-8">
          <header className="space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">
              Privacy First.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              To assist you effectively, we need access to your microphone and location. All data is encrypted and temporary.
            </p>
          </header>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                <Mic className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Voice Analysis</h3>
                <p className="text-[10px] text-white/40">Listen for distress signals</p>
              </div>
              {microphonePermission === 'granted' && <Check className="w-4 h-4 text-green-500" />}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-sm">Location Services</h3>
                <p className="text-[10px] text-white/40">Direct emergency responders</p>
              </div>
              {locationPermission === 'granted' && <Check className="w-4 h-4 text-green-500" />}
            </div>

            <button
              onClick={() => setAutoCallEmergency(!autoCallEmergency)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500 group",
                autoCallEmergency ? "bg-primary/10 border-primary/50" : "bg-white/5 border-white/5"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500",
                autoCallEmergency ? "bg-primary border-primary" : "bg-white/5 border-white/10"
              )}>
                <Shield className={cn("w-5 h-5", autoCallEmergency ? "text-white" : "text-white/20")} />
              </div>
              <div className="flex-1 text-left">
                <h3 className={cn("font-bold text-sm", autoCallEmergency ? "text-primary" : "text-white/60")}>
                  Auto-Call Emergency
                </h3>
                <p className="text-[10px] text-white/40">Detect life-threatening crises</p>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full relative transition-colors duration-500",
                autoCallEmergency ? "bg-primary" : "bg-white/10"
              )}>
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500",
                  autoCallEmergency ? "left-5" : "left-1"
                )} />
              </div>
            </button>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onDeny}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-white/40 hover:text-white transition-colors"
            >
              Later
            </button>
            <button
              onClick={handleAllow}
              className="flex-[2] px-6 py-4 bg-primary text-white rounded-2xl font-black text-sm tracking-widest uppercase shadow-[0_15px_30px_-10px_rgba(31,154,248,0.5)] active:scale-95 transition-all"
            >
              Agree & Connect
            </button>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
}

