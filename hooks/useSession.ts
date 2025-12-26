"use client";

import { useCallback, useEffect } from 'react';
import { useSession as useSessionContext } from '@/contexts/SessionContext';
import { useTranscript } from './useTranscript';
import type { SessionStatus } from '@/types';

export function useSession() {
  const sessionContext = useSessionContext();
  const transcript = useTranscript();

  const startSession = useCallback(() => {
    sessionContext.resetSession();
    sessionContext.setStatus('connecting');
    sessionContext.state.startTime = new Date();
  }, [sessionContext]);

  const endSession = useCallback(() => {
    sessionContext.setStatus('ended');
    sessionContext.state.endTime = new Date();
  }, [sessionContext]);

  const getSessionDuration = useCallback(() => {
    const startTime = sessionContext.state.startTime;
    const endTime = sessionContext.state.endTime || new Date();
    
    if (!startTime) return 0;
    
    return Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  }, [sessionContext.state.startTime, sessionContext.state.endTime]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        let deviceType: 'mobile' | 'desktop' | 'tablet' = 'desktop';
        if (window.innerWidth <= 768) {
          deviceType = 'mobile';
        } else if (window.innerWidth <= 1024) {
          deviceType = 'tablet';
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return {
    ...sessionContext,
    ...transcript,
    startSession,
    endSession,
    getSessionDuration,
    isActive: sessionContext.state.status === 'active',
    isConnecting: sessionContext.state.status === 'connecting',
    isEnded: sessionContext.state.status === 'ended',
    sessionId: sessionContext.state.sessionId,
    userId: sessionContext.state.userId,
    deviceType: sessionContext.state.deviceType,
    connectionQuality: sessionContext.state.connectionQuality,
    incognito: sessionContext.state.incognito,
    autoCallEmergency: sessionContext.state.autoCallEmergency,
    toolsActive: sessionContext.state.toolsActive
  };
}
