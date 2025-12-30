export type Speaker = "user" | "ai";

export interface EmergencyContact {
  name: string;
  phone: string;
}


export type SessionStatus = "idle" | "connecting" | "active" | "ended" | "error" | "reconnecting";

export type ConnectionQuality = "good" | "degraded" | "poor";

export type DeviceType = "mobile" | "desktop" | "tablet";

export type ToolName = "alertEmergencyServices" | "provide_local_resource" | "get_location";

export type ResourceType = "mental_health" | "poison_control";

export type EmergencyPriority = "high" | "medium";

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface TranscriptEntry {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: Date;
}

export interface SessionState {
  status: SessionStatus;
  transcript: TranscriptEntry[];
  startTime: Date | null;
  endTime: Date | null;
  incognito: boolean;
  autoCallEmergency: boolean;
  connectionQuality: ConnectionQuality;
  toolsActive: Set<ToolName>;
  sessionId: string;
  userId: string | null;
  deviceType: DeviceType;
  emergencyContact?: EmergencyContact;
}


export interface SessionMetrics {
  sessionId: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  incognitoMode: boolean;
  connectionQuality: ConnectionQuality;
  deviceType: DeviceType;
  browser?: string;
  reconnectionAttempts: number;
  audioQualityScore?: number;
  totalSpeakerChanges: number;
  longestPauseSeconds: number;
  interruptionCount: number;
  toolsTriggered: string[];
  emergencyAlerts: number;
  totalUserWords: number;
  totalAiWords: number;
  transcriptEntries: number;
}

export interface ToolLog {
  id: string;
  sessionId: string;
  toolName: ToolName;
  payload: Record<string, unknown>;
  timestamp: Date;
}

export interface EmergencyResource {
  name: string;
  phone: string;
  description: string;
}

export interface ConversationMessage {
  type: "user" | "agent" | "tool_call" | "error";
  content?: string;
  toolName?: string;
  toolArgs?: Record<string, unknown>;
  timestamp: Date;
}

export interface UseConversationReturn {
  status: "connecting" | "connected" | "disconnected" | "error";
  connect: () => Promise<void>;
  disconnect: () => void;
  isSpeaking: boolean;
  volume: number;
  messages: ConversationMessage[];
}

export interface UseLocationReturn {
  location: Location | null;
  error: string | null;
  loading: boolean;
  getLocation: () => Promise<Location | null>;
}

export interface PermissionState {
  microphone: "granted" | "denied" | "prompt";
  location: "granted" | "denied" | "prompt";
}

export interface AudioVisualizerProps {
  isActive: boolean;
  volume?: number;
  height?: number;
}

export interface TranscriptProps {
  entries: TranscriptEntry[];
  maxHeight?: number;
}

export interface ToolIndicatorProps {
  toolName: ToolName;
  isActive: boolean;
}

export interface SessionTimerProps {
  startTime: Date | null;
  isActive: boolean;
}
