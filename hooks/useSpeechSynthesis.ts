"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechSynthesisReturn {
    speak: (text: string) => void;
    speakSequence: (texts: string[], delayMs?: number) => Promise<void>;
    pause: () => void;
    resume: () => void;
    cancel: () => void;
    isSpeaking: boolean;
    isPaused: boolean;
    isSupported: boolean;
    hasVoices: boolean;
    voices: SpeechSynthesisVoice[];
    currentIndex: number;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const cancelledRef = useRef(false);

    const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    // Load voices - they may load async
    useEffect(() => {
        if (!isSupported) return;

        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();

            if (availableVoices.length === 0) {
                // Voices not loaded yet, wait for event
                return;
            }

            // Prioritize: English local voices > Any local voices > English voices > Any voice
            const localVoices = availableVoices.filter(v => v.localService);
            const englishLocalVoices = localVoices.filter(v => v.lang.startsWith('en'));
            const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));

            // Pick best available set
            let selectedVoices: SpeechSynthesisVoice[] = [];
            if (englishLocalVoices.length > 0) {
                selectedVoices = englishLocalVoices;
            } else if (localVoices.length > 0) {
                selectedVoices = localVoices;
            } else if (englishVoices.length > 0) {
                selectedVoices = englishVoices;
            } else {
                selectedVoices = availableVoices;
            }

            setVoices(selectedVoices);

            if (process.env.NODE_ENV === 'development') {
                console.log('[TTS] All voices:', availableVoices.map(v => `${v.name} (${v.lang}) local:${v.localService}`));
                console.log('[TTS] Selected voices:', selectedVoices.map(v => v.name));
            }
        };

        // Initial load
        loadVoices();

        // Chrome loads voices async - try multiple times
        const retryTimer = setTimeout(loadVoices, 100);
        const retryTimer2 = setTimeout(loadVoices, 500);

        // Chrome loads voices async
        speechSynthesis.addEventListener('voiceschanged', loadVoices);
        return () => {
            clearTimeout(retryTimer);
            clearTimeout(retryTimer2);
            speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
    }, [isSupported]);

    const getPreferredVoice = useCallback(() => {
        // Priority: Samantha (iOS), Google US English, any English local voice
        const preferred = voices.find(v =>
            v.name.includes('Samantha') ||
            v.name.includes('Google US English') ||
            v.name.includes('Alex')
        );
        return preferred || voices[0];
    }, [voices]);

    const speak = useCallback((text: string) => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getPreferredVoice();

        if (voice) {
            utterance.voice = voice;
        }

        // Calm, measured pace for crisis situations
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (event) => {
            console.error('[TTS] Speech error:', event.error);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        speechSynthesis.speak(utterance);
    }, [isSupported, getPreferredVoice]);

    const speakSequence = useCallback(async (texts: string[], delayMs = 1500): Promise<void> => {
        if (!isSupported || texts.length === 0) return;

        cancelledRef.current = false;

        for (let i = 0; i < texts.length; i++) {
            if (cancelledRef.current) break;

            setCurrentIndex(i);

            await new Promise<void>((resolve) => {
                const utterance = new SpeechSynthesisUtterance(texts[i]);
                const voice = getPreferredVoice();

                if (voice) utterance.voice = voice;

                utterance.rate = 0.85;
                utterance.pitch = 1.0;

                utterance.onstart = () => {
                    setIsSpeaking(true);
                    setIsPaused(false);
                };

                utterance.onend = () => {
                    setIsSpeaking(false);
                    // Brief pause between steps
                    setTimeout(resolve, delayMs);
                };

                utterance.onerror = () => {
                    setIsSpeaking(false);
                    resolve();
                };

                speechSynthesis.speak(utterance);
            });
        }

        setCurrentIndex(-1);
    }, [isSupported, getPreferredVoice]);

    const pause = useCallback(() => {
        if (!isSupported) return;
        speechSynthesis.pause();
        setIsPaused(true);
    }, [isSupported]);

    const resume = useCallback(() => {
        if (!isSupported) return;
        speechSynthesis.resume();
        setIsPaused(false);
    }, [isSupported]);

    const cancel = useCallback(() => {
        if (!isSupported) return;
        cancelledRef.current = true;
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentIndex(-1);
    }, [isSupported]);

    return {
        speak,
        speakSequence,
        pause,
        resume,
        cancel,
        isSpeaking,
        isPaused,
        isSupported,
        hasVoices: voices.length > 0,
        voices,
        currentIndex,
    };
}
