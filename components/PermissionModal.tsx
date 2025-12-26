"use client";

import { useState, useEffect } from 'react';
import { Mic, MapPin, Shield, Check, X } from 'lucide-react';
import { cn } from '@/lib/constants';

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
        await navigator.geolocation.getCurrentPosition(() => {});
      }
      onAllow(autoCallEmergency);
    } catch (error) {
      console.error('Permission denied:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Before we start
            </h2>
            <p className="text-slate-400">
              We need a few permissions to provide emergency assistance if needed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Mic className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Microphone Access
                </h3>
                <p className="text-sm text-slate-400">
                  Required to hear you and provide voice assistance
                </p>
              </div>
              {microphonePermission === 'granted' && (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
              )}
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <MapPin className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Location Access
                </h3>
                <p className="text-sm text-slate-400">
                  Required to share your location with emergency services if needed
                </p>
              </div>
              {locationPermission === 'granted' && (
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 ml-auto" />
              )}
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Shield className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Auto-Call Emergency
                </h3>
                <p className="text-sm text-slate-400 mb-3">
                  Automatically call 911 when a life-threatening emergency is detected
                </p>
                <button
                  onClick={() => setAutoCallEmergency(!autoCallEmergency)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition-all',
                    'border-2 w-full',
                    autoCallEmergency
                      ? 'bg-green-500/10 border-green-500 text-green-400'
                      : 'bg-slate-700/50 border-slate-600 text-slate-400'
                  )}
                >
                  {autoCallEmergency ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">Enabled (Recommended)</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      <span className="text-sm font-medium">Disabled</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onDeny}
              className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAllow}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-blue-600/30"
            >
              Allow & Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
