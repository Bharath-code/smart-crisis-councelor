"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, Shield, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PermissionModal } from '@/components/PermissionModal';
import { useSession } from '@/hooks/useSession';
import { US_EMERGENCY_NUMBERS } from '@/lib/constants';

export default function HomePage() {
  const router = useRouter();
  const { startSession, setAutoCallEmergency, setIncognito, state } = useSession();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleStart = () => {
    setShowPermissionModal(true);
  };

  const handlePermissionAllow = (autoCall: boolean) => {
    setAutoCallEmergency(autoCall);
    setIncognito(false);
    startSession();
    setShowPermissionModal(false);
    router.push('/session');
  };

  const handlePermissionDeny = () => {
    setShowPermissionModal(false);
  };

  const resources = [
    {
      name: US_EMERGENCY_NUMBERS.emergency.name,
      phone: US_EMERGENCY_NUMBERS.emergency.phone,
      description: US_EMERGENCY_NUMBERS.emergency.description,
      color: 'red'
    },
    {
      name: US_EMERGENCY_NUMBERS.suicide_prevention.name,
      phone: US_EMERGENCY_NUMBERS.suicide_prevention.phone,
      description: US_EMERGENCY_NUMBERS.suicide_prevention.description,
      color: 'blue'
    },
    {
      name: US_EMERGENCY_NUMBERS.poison_control.name,
      phone: US_EMERGENCY_NUMBERS.poison_control.phone,
      description: US_EMERGENCY_NUMBERS.poison_control.description,
      color: 'blue'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {showPermissionModal && (
        <PermissionModal
          isOpen={showPermissionModal}
          onAllow={handlePermissionAllow}
          onDeny={handlePermissionDeny}
        />
      )}

      <header className="flex items-center justify-between p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Smart Crisis Counselor</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow" />
          <span>System Ready</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-300">AI-Powered Crisis Support</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            You're not alone
          </h2>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            I'm here to help you through this difficult moment. Together, we'll work through what you're experiencing and connect you with the right support.
          </p>
        </div>

        <button
          onClick={handleStart}
          className="group relative w-full max-w-md px-8 py-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl shadow-blue-600/30 hover:shadow-blue-600/50 min-h-[80px]"
        >
          <div className="absolute inset-0 rounded-2xl bg-blue-500 animate-pulse-slow opacity-0 group-hover:opacity-30 transition-opacity" />
          <div className="relative flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <span>Start Voice Help</span>
          </div>
        </button>

        <div className="flex items-start gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg max-w-md">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-200">
            <p className="font-semibold mb-1">Emergency Disclaimer</p>
            <p>If you are in immediate danger, call 911 directly instead of using this service.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="flex items-start gap-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <Mic className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Voice-First Support</h3>
              <p className="text-sm text-slate-400">Speak naturally and receive empathetic, calm guidance in real-time</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <Clock className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">24/7 Available</h3>
              <p className="text-sm text-slate-400">Get immediate support whenever you need it, day or night</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
            <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-white mb-2">Safe & Private</h3>
              <p className="text-sm text-slate-400">Your conversations are confidential and you control your data</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Emergency Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {resources.map((resource) => (
              <a
                key={resource.name}
                href={`tel:${resource.phone}`}
                className="flex flex-col p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors"
              >
                <p className="font-semibold text-white mb-1">{resource.name}</p>
                <p className="text-xl font-bold text-blue-400 mb-1">{resource.phone}</p>
                <p className="text-xs text-slate-400">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-slate-500 border-t border-slate-800">
        <p>This service provides support but does not replace professional medical or emergency services.</p>
      </footer>
    </div>
  );
}
