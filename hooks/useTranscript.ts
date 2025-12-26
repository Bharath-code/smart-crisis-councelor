"use client";

import { useCallback } from 'react';
import { useSession } from '@/contexts/SessionContext';
import type { TranscriptEntry, Speaker } from '@/types';

export function useTranscript() {
  const { state, addTranscriptEntry } = useSession();

  const addEntry = useCallback((speaker: Speaker, text: string) => {
    const entry: TranscriptEntry = {
      id: `transcript-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      speaker,
      text,
      timestamp: new Date()
    };
    addTranscriptEntry(entry);
    return entry;
  }, [addTranscriptEntry]);

  const clearTranscript = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }, []);

  const getUserEntries = useCallback(() => {
    return state.transcript.filter(entry => entry.speaker === 'user');
  }, [state.transcript]);

  const getAIEntries = useCallback(() => {
    return state.transcript.filter(entry => entry.speaker === 'ai');
  }, [state.transcript]);

  const getLatestEntry = useCallback(() => {
    return state.transcript[state.transcript.length - 1] || null;
  }, [state.transcript]);

  const getWordCount = useCallback(() => {
    return state.transcript.reduce((count, entry) => {
      return count + entry.text.split(/\s+/).length;
    }, 0);
  }, [state.transcript]);

  const getUserWordCount = useCallback(() => {
    return getUserEntries().reduce((count, entry) => {
      return count + entry.text.split(/\s+/).length;
    }, 0);
  }, [getUserEntries]);

  const getAIWordCount = useCallback(() => {
    return getAIEntries().reduce((count, entry) => {
      return count + entry.text.split(/\s+/).length;
    }, 0);
  }, [getAIEntries]);

  return {
    transcript: state.transcript,
    addEntry,
    clearTranscript,
    getUserEntries,
    getAIEntries,
    getLatestEntry,
    getWordCount,
    getUserWordCount,
    getAIWordCount
  };
}
