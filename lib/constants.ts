import { EmergencyResource, SessionStatus, ConnectionQuality, ToolName } from "@/types";

export const US_EMERGENCY_NUMBERS: Record<string, EmergencyResource> = {
  emergency: {
    name: "Emergency Services",
    phone: "911",
    description: "For life-threatening emergencies"
  },
  poison_control: {
    name: "Poison Control",
    phone: "1-800-222-1222",
    description: "24/7 poison emergency hotline"
  },
  suicide_prevention: {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "Crisis support and suicide prevention"
  },
  domestic_violence: {
    name: "National Domestic Violence Hotline",
    phone: "1-800-799-7233",
    description: "Support for domestic violence survivors"
  },
  mental_health: {
    name: "Crisis Text Line",
    phone: "741741",
    description: "Text HOME to connect with a crisis counselor"
  },
  disaster_distress: {
    name: "Disaster Distress Helpline",
    phone: "1-800-985-5990",
    description: "Support for disaster-related distress"
  }
};

export const APP_SETTINGS = {
  VOICE_THRESHOLD: 0.6,
  SILENCE_TIMEOUT: 800,
  MAX_LATENCY: 800,
  TARGET_TTFT: 500,
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 2000,
  SAMPLE_RATE: 48000,
  BITRATE: "high",
  CODEC: "opus",
  TRANSCRIPT_MAX_HEIGHT: 300,
  AUDIO_VISUALIZER_HEIGHT: 50,
  MIN_TAP_TARGET: 48,
  MAX_SESSION_DURATION: 3600,
  AUTO_END_IDLE_TIME: 120,
  ENABLE_ANALYTICS: true,
  SESSION_LOGGING_ENABLED: true
};

export const TOOL_NAMES = {
  ALERT_EMERGENCY_SERVICES: "alertEmergencyServices",
  PROVIDE_LOCAL_RESOURCE: "provide_local_resource",
  GET_LOCATION: "get_location"
} as const;

export const SESSION_STATUS: Record<string, SessionStatus> = {
  IDLE: "idle",
  CONNECTING: "connecting",
  ACTIVE: "active",
  ENDED: "ended",
  ERROR: "error",
  RECONNECTING: "reconnecting"
};

export const CONNECTION_QUALITY: Record<string, ConnectionQuality> = {
  GOOD: "good",
  DEGRADED: "degraded",
  POOR: "poor"
};

export const CONNECTION_QUALITY_THRESHOLDS = {
  GOOD: 0.8,
  DEGRADED: 0.4,
  POOR: 0.4
};

export const DEVICE_TYPES = {
  MOBILE: "mobile",
  DESKTOP: "desktop",
  TABLET: "tablet"
};

export const ERROR_MESSAGES = {
  MICROPHONE_DENIED: "Microphone access is required to use this service",
  LOCATION_DENIED: "Location access is required for emergency alerts",
  CONNECTION_FAILED: "Failed to connect to the counselor. Please try again.",
  CONNECTION_LOST: "Connection lost. Reconnecting...",
  RECONNECTION_FAILED: "Unable to reconnect. Please check your internet connection.",
  API_ERROR: "Something went wrong. Please try again.",
  SESSION_TIMEOUT: "Session has ended due to inactivity."
};

export const STORAGE_KEYS = {
  USER_ID: "smart_crisis_user_id",
  AUTO_CALL_EMERGENCY: "auto_call_emergency",
  INCOGNITO_MODE: "incognito_mode",
  LAST_SESSION_ID: "last_session_id",
  EMERGENCY_CONTACT: "emergency_contact"
};

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
