"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MicOff, Mic, Home, Volume2 } from 'lucide-react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { Transcript } from '@/components/Transcript';
import { ToolIndicator } from '@/components/ToolIndicator';
import { SessionTimer } from '@/components/SessionTimer';
import { EmergencyButton } from '@/components/EmergencyButton';
import { useConversation } from '@/hooks/useConversation';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/constants';
import { US_EMERGENCY_NUMBERS } from '@/lib/constants';

export default function SessionPage() {
  const router = useRouter();
  const { status, connect, disconnect, isSpeaking, volume } = useConversation();
  const {
    transcript,
    getSessionDuration,
    endSession,
    isActive,
    isConnecting,
    state,
    setIncognito
  } = useSession();
  const [isMuted, setIsMuted] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const hasConnectedRef = useRef(false);

  // Connect only once on mount
  useEffect(() => {
    if (!hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connect();
    }

    return () => {
      // Cleanup on unmount
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isActive && status === 'connected') {
      const handleEnd = () => {
        handleEndSession();
      };

      window.addEventListener('beforeunload', handleEnd);

      const idleTimer = setTimeout(() => {
        if (transcript.length === 0 && status === 'connected') {
          console.log('Session idle, auto-end');
        }
      }, 120000);

      return () => {
        window.removeEventListener('beforeunload', handleEnd);
        clearTimeout(idleTimer);
      };
    }
  }, [isActive, status, transcript.length]);

  const handleEndSession = () => {
    endSession();
    disconnect();
    router.push('/summary');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const getConnectionStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-slate-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xl text-white">Connecting to counselor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={handleEndSession}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="End Session"
          >
            <Home className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Crisis Counselor</h1>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn('w-2 h-2 rounded-full', getConnectionStatusColor())} />
              <span className="text-slate-400">{getConnectionStatusText()}</span>
            </div>
          </div>
        </div>

        <SessionTimer startTime={state.startTime} isActive={isActive} />
      </header>

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-4 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <AudioVisualizer
              isActive={isActive && status === 'connected' && !isMuted}
              volume={volume}
              height={60}
              className="mb-4"
            />

            <Transcript
              entries={transcript}
              maxHeight={400}
              className="flex-1"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolIndicator
              toolName="alertEmergencyServices"
              isActive={state.toolsActive.has('alertEmergencyServices')}
            />
            <ToolIndicator
              toolName="provide_local_resource"
              isActive={state.toolsActive.has('provide_local_resource')}
            />
            <ToolIndicator
              toolName="get_location"
              isActive={state.toolsActive.has('get_location')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleToggleMute}
              className={cn(
                'flex items-center justify-center p-3 rounded-lg transition-colors',
                isMuted
                  ? 'bg-red-600/20 text-red-400 border border-red-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIncognito(!state.incognito)}
              className={cn(
                'flex items-center justify-center p-3 rounded-lg transition-colors',
                state.incognito
                  ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              )}
              title={state.incognito ? 'Incognito Mode On' : 'Incognito Mode Off'}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-red-600/30"
            >
              <Phone className="w-5 h-5 rotate-135" />
              End Call
            </button>
          </div>

          <EmergencyButton variant="small" />
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur border-t border-slate-800 md:hidden">
        <EmergencyButton variant="small" />
      </div>
    </div>
  );
}
