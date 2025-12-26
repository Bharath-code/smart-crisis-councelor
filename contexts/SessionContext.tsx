"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { SessionState, SessionStatus, ToolName, DeviceType, TranscriptEntry } from '@/types';
import { STORAGE_KEYS } from '@/lib/constants';

interface SessionContextType {
  state: SessionState;
  setStatus: (status: SessionStatus) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  activateTool: (toolName: ToolName) => void;
  deactivateTool: (toolName: ToolName) => void;
  setIncognito: (incognito: boolean) => void;
  setAutoCallEmergency: (autoCall: boolean) => void;
  setConnectionQuality: (quality: 'good' | 'degraded' | 'poor') => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      const autoCallEmergency = localStorage.getItem(STORAGE_KEYS.AUTO_CALL_EMERGENCY) === 'true';
      const incognito = localStorage.getItem(STORAGE_KEYS.INCOGNITO_MODE) === 'true';
      
      let deviceType: DeviceType = 'desktop';
      if (window.innerWidth <= 768) {
        deviceType = 'mobile';
      } else if (window.innerWidth <= 1024) {
        deviceType = 'tablet';
      }

      return {
        status: 'idle',
        transcript: [],
        startTime: null,
        endTime: null,
        incognito,
        autoCallEmergency,
        connectionQuality: 'good',
        toolsActive: new Set<ToolName>(),
        sessionId: '',
        userId,
        deviceType
      };
    }

    return {
      status: 'idle',
      transcript: [],
      startTime: null,
      endTime: null,
      incognito: false,
      autoCallEmergency: true,
      connectionQuality: 'good',
      toolsActive: new Set<ToolName>(),
      sessionId: '',
      userId: null,
      deviceType: 'desktop'
    };
  });

  const setStatus = useCallback((status: SessionStatus) => {
    setState(prev => ({ ...prev, status }));
  }, []);

  const addTranscriptEntry = useCallback((entry: TranscriptEntry) => {
    setState(prev => ({
      ...prev,
      transcript: [...prev.transcript, entry]
    }));
  }, []);

  const activateTool = useCallback((toolName: ToolName) => {
    setState(prev => ({
      ...prev,
      toolsActive: new Set([...prev.toolsActive, toolName])
    }));
  }, []);

  const deactivateTool = useCallback((toolName: ToolName) => {
    setState(prev => {
      const newTools = new Set(prev.toolsActive);
      newTools.delete(toolName);
      return { ...prev, toolsActive: newTools };
    });
  }, []);

  const setIncognito = useCallback((incognito: boolean) => {
    localStorage.setItem(STORAGE_KEYS.INCOGNITO_MODE, incognito.toString());
    setState(prev => ({ ...prev, incognito }));
  }, []);

  const setAutoCallEmergency = useCallback((autoCall: boolean) => {
    localStorage.setItem(STORAGE_KEYS.AUTO_CALL_EMERGENCY, autoCall.toString());
    setState(prev => ({ ...prev, autoCallEmergency: autoCall }));
  }, []);

  const setConnectionQuality = useCallback((quality: 'good' | 'degraded' | 'poor') => {
    setState(prev => ({ ...prev, connectionQuality: quality }));
  }, []);

  const resetSession = useCallback(() => {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    if (typeof window !== 'undefined' && !state.userId) {
      const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem(STORAGE_KEYS.USER_ID, newUserId);
    }

    setState(prev => ({
      ...prev,
      status: 'idle',
      transcript: [],
      startTime: null,
      endTime: null,
      toolsActive: new Set<ToolName>(),
      sessionId,
      userId: state.userId || localStorage.getItem(STORAGE_KEYS.USER_ID),
      connectionQuality: 'good'
    }));
  }, [state.userId]);

  return (
    <SessionContext.Provider value={{
      state,
      setStatus,
      addTranscriptEntry,
      activateTool,
      deactivateTool,
      setIncognito,
      setAutoCallEmergency,
      setConnectionQuality,
      resetSession
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
