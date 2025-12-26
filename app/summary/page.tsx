"use client";

import { useRouter } from 'next/navigation';
import { Clock, Phone, FileText, RefreshCw, Trash2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useSession } from '@/hooks/useSession';
import { US_EMERGENCY_NUMBERS } from '@/lib/constants';
import { cn } from '@/lib/constants';
import { useState } from 'react';

export default function SummaryPage() {
  const router = useRouter();
  const { 
    transcript, 
    getSessionDuration, 
    state,
    resetSession 
  } = useSession();
  const [showTranscript, setShowTranscript] = useState(false);

  const duration = getSessionDuration();
  const userEntries = transcript.filter(entry => entry.speaker === 'user');
  const aiEntries = transcript.filter(entry => entry.speaker === 'ai');
  const toolsUsed = Array.from(state.toolsActive);

  const handleStartNewSession = () => {
    resetSession();
    router.push('/');
  };

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smart_crisis_user_id');
    }
    resetSession();
    router.push('/');
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const resources = [
    US_EMERGENCY_NUMBERS.emergency,
    US_EMERGENCY_NUMBERS.suicide_prevention,
    US_EMERGENCY_NUMBERS.poison_control,
    US_EMERGENCY_NUMBERS.domestic_violence,
    US_EMERGENCY_NUMBERS.mental_health,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="flex items-center justify-between p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Home"
          >
            <Home className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-white">Session Summary</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span>Session Complete</span>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Session Completed Successfully
                </h2>
                <p className="text-slate-300">
                  Thank you for using the Smart Crisis Counselor. Remember, reaching out for help is a sign of strength.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                {formatDuration(duration)}
              </p>
              <p className="text-sm text-slate-400">Session Duration</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                {transcript.length}
              </p>
              <p className="text-sm text-slate-400">Transcript Entries</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <p className="text-3xl font-bold text-white mb-1">
                {toolsUsed.length}
              </p>
              <p className="text-sm text-slate-400">Tools Used</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Session Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {transcript.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No transcript entries recorded
              </p>
            ) : !showTranscript ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  This session contains {transcript.length} transcript entries.
                </p>
                <Button
                  onClick={() => setShowTranscript(true)}
                  className="w-full"
                >
                  Show Transcript
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {transcript.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex flex-col',
                        entry.speaker === 'user' ? 'items-end' : 'items-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg px-4 py-2',
                          entry.speaker === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-100'
                        )}
                      >
                        <p className="text-sm leading-relaxed">{entry.text}</p>
                      </div>
                      <span className="text-xs text-slate-500 mt-1 px-1">
                        {entry.speaker === 'user' ? 'You' : 'AI'} • {entry.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setShowTranscript(false)}
                  variant="outline"
                  className="w-full"
                >
                  Hide Transcript
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Emergency Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resources.map((resource) => (
                <a
                  key={resource.name}
                  href={`tel:${resource.phone}`}
                  className="flex flex-col p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-blue-500 transition-all group"
                >
                  <p className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                    {resource.name}
                  </p>
                  <p className="text-xl font-bold text-blue-400 mb-1">{resource.phone}</p>
                  <p className="text-xs text-slate-400">{resource.description}</p>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleStartNewSession}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Start New Session
          </Button>
          <Button
            onClick={handleClearData}
            variant="outline"
            className="flex-1 h-12 text-slate-300 hover:text-white border-slate-700"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Clear Data
          </Button>
        </div>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-6">
            <p className="text-sm text-yellow-200 text-center">
              <strong>Disclaimer:</strong> This service provides support but does not replace professional medical or emergency services. If you are in immediate danger, please call 911.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
