"use client";

import { useCallback, useState } from 'react';
import { useConversation as useElevenLabsConversation } from '@elevenlabs/react';
import { useSession as useSessionContext } from '@/contexts/SessionContext';
import { useTranscript } from './useTranscript';
import { alertEmergencyServices, provideLocalResource } from '@/lib/tools';
import { logToolCall } from '@/lib/db';
import { TOOL_NAMES } from '@/lib/constants';
import type { ConversationMessage, UseConversationReturn } from '@/types';

export function useConversation(): UseConversationReturn {
  const { state, activateTool, deactivateTool } = useSessionContext();
  const { addEntry } = useTranscript();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  // Handle tool calls from the AI
  const handleToolCall = useCallback(async (toolName: string, toolArgs: Record<string, unknown>) => {
    try {
      activateTool(toolName as any);

      const toolMessage: ConversationMessage = {
        type: 'tool_call',
        toolName: toolName as any,
        toolArgs,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, toolMessage]);

      let result;
      switch (toolName) {
        case TOOL_NAMES.ALERT_EMERGENCY_SERVICES:
          result = await alertEmergencyServices(
            toolArgs.priority as 'high' | 'medium',
            state.autoCallEmergency
          );

          if (!state.incognito && state.sessionId) {
            await logToolCall({
              sessionId: state.sessionId,
              toolName: TOOL_NAMES.ALERT_EMERGENCY_SERVICES,
              payload: result,
              timestamp: new Date()
            });
          }
          break;

        case TOOL_NAMES.PROVIDE_LOCAL_RESOURCE:
          result = await provideLocalResource(toolArgs.type as 'mental_health' | 'poison_control');

          if (!state.incognito && state.sessionId) {
            await logToolCall({
              sessionId: state.sessionId,
              toolName: TOOL_NAMES.PROVIDE_LOCAL_RESOURCE,
              payload: result,
              timestamp: new Date()
            });
          }
          break;

        default:
          console.warn('[ElevenLabs] Unknown tool:', toolName);
      }

      setTimeout(() => {
        deactivateTool(toolName as any);
      }, 3000);

      return result;
    } catch (error) {
      console.error('[ElevenLabs] Tool execution failed:', error);
      deactivateTool(toolName as any);
      return null;
    }
  }, [activateTool, deactivateTool, state.autoCallEmergency, state.incognito, state.sessionId]);

  // Use ElevenLabs Conversational AI hook
  const conversation = useElevenLabsConversation({
    onConnect: () => {
      console.log('[ElevenLabs] Connected to conversational AI');
      // Add welcome message
      const welcomeMessage: ConversationMessage = {
        type: 'agent',
        content: "Hello. I'm your crisis counselor. I'm here to help you through this. What's happening?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMessage]);
      addEntry('ai', welcomeMessage.content!);
    },
    onDisconnect: () => {
      console.log('[ElevenLabs] Disconnected from conversational AI');
    },
    onMessage: (message) => {
      console.log('[ElevenLabs] Message received:', message);

      // The message payload contains the text content
      if (message && typeof message === 'object' && 'message' in message) {
        const msgContent = (message as { message: string; source?: string }).message;
        const source = (message as { source?: string }).source;

        if (source === 'ai' || source === 'agent') {
          const aiMessage: ConversationMessage = {
            type: 'agent',
            content: msgContent,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, aiMessage]);
          addEntry('ai', msgContent);
        } else if (source === 'user') {
          const userMessage: ConversationMessage = {
            type: 'user',
            content: msgContent,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, userMessage]);
          addEntry('user', msgContent);
        }
      }
    },
    onError: (error) => {
      console.error('[ElevenLabs] Error:', error);
      const errorMessage: ConversationMessage = {
        type: 'error',
        content: 'Connection error occurred. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  // Connect to ElevenLabs Conversational AI
  const connect = useCallback(async () => {
    const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

    if (!agentId) {
      console.error('[ElevenLabs] Agent ID not configured. Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in .env.local');
      const errorMessage: ConversationMessage = {
        type: 'error',
        content: 'Configuration error: Agent ID not set. Please check .env.local',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation session
      await conversation.startSession({
        agentId,
        connectionType: 'webrtc',
        clientTools: {
          // Register client-side tools that AI can call
          alertEmergencyServices: async (args: { priority: 'high' | 'medium' }) => {
            const result = await handleToolCall(TOOL_NAMES.ALERT_EMERGENCY_SERVICES, args);
            return JSON.stringify(result);
          },
          provide_local_resource: async (args: { type: 'mental_health' | 'poison_control' }) => {
            const result = await handleToolCall(TOOL_NAMES.PROVIDE_LOCAL_RESOURCE, args);
            return JSON.stringify(result);
          }
        }
      });

      console.log('[ElevenLabs] Session started successfully');
    } catch (error) {
      console.error('[ElevenLabs] Failed to start session:', error);
      const errorMessage: ConversationMessage = {
        type: 'error',
        content: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [conversation, handleToolCall, addEntry]);

  // Disconnect from ElevenLabs
  const disconnect = useCallback(async () => {
    try {
      await conversation.endSession();
      console.log('[ElevenLabs] Session ended');
    } catch (error) {
      console.error('[ElevenLabs] Failed to end session:', error);
    }
  }, [conversation]);

  // Map ElevenLabs status to our expected type
  const mappedStatus = (): 'connecting' | 'connected' | 'disconnected' | 'error' => {
    const status = conversation.status;
    if (status === 'disconnecting') return 'disconnected';
    return status as 'connecting' | 'connected' | 'disconnected' | 'error';
  };

  return {
    status: mappedStatus(),
    connect,
    disconnect,
    isSpeaking: conversation.isSpeaking,
    volume: 0,
    messages
  };
}
