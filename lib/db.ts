import { sql } from '@vercel/postgres';
import type { SessionMetrics, TranscriptEntry, ToolLog } from '@/types';

export async function createSessionLog(session: SessionMetrics) {
  try {
    const result = await sql`
      INSERT INTO sessions (
        id,
        user_id,
        start_time,
        end_time,
        duration,
        incognito_mode,
        connection_quality,
        device_type,
        browser,
        reconnection_attempts,
        audio_quality_score,
        total_speaker_changes,
        longest_pause_seconds,
        interruption_count,
        tools_triggered,
        emergency_alerts,
        total_user_words,
        total_ai_words,
        transcript_entries
      ) VALUES (
        ${session.sessionId},
        ${session.userId || null},
        ${session.startTime.toISOString()},
        ${session.endTime?.toISOString() || null},
        ${session.duration || 0},
        ${session.incognitoMode},
        ${session.connectionQuality},
        ${session.deviceType},
        ${session.browser || null},
        ${session.reconnectionAttempts},
        ${session.audioQualityScore || null},
        ${session.totalSpeakerChanges},
        ${session.longestPauseSeconds},
        ${session.interruptionCount},
        ${session.toolsTriggered as any},
        ${session.emergencyAlerts},
        ${session.totalUserWords},
        ${session.totalAiWords},
        ${session.transcriptEntries}
      )
      RETURNING id
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to create session log:', error);
    throw error;
  }
}

export async function updateSessionEnd(
  sessionId: string,
  endTime: Date,
  duration: number
) {
  try {
    const result = await sql`
      UPDATE sessions
      SET end_time = ${endTime.toISOString()},
          duration = ${duration}
      WHERE id = ${sessionId}
      RETURNING id
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to update session end:', error);
    throw error;
  }
}

export async function addTranscriptEntry(entry: TranscriptEntry, sessionId: string) {
  try {
    const result = await sql`
      INSERT INTO transcript_entries (id, session_id, speaker, text, timestamp)
      VALUES (${entry.id}, ${sessionId}, ${entry.speaker}, ${entry.text}, ${entry.timestamp.toISOString()})
      RETURNING id
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to add transcript entry:', error);
    throw error;
  }
}

export async function logToolCall(log: Omit<ToolLog, 'id'>) {
  try {
    const id = `tool-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const result = await sql`
      INSERT INTO tool_logs (id, session_id, tool_name, payload, timestamp)
      VALUES (${id}, ${log.sessionId}, ${log.toolName}, ${JSON.stringify(log.payload)}::jsonb, ${log.timestamp.toISOString()})
      RETURNING id
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to log tool call:', error);
    throw error;
  }
}

export async function getSession(sessionId: string) {
  try {
    const result = await sql`
      SELECT * FROM sessions WHERE id = ${sessionId}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Failed to get session:', error);
    throw error;
  }
}

export async function getSessionTranscript(sessionId: string) {
  try {
    const result = await sql`
      SELECT * FROM transcript_entries 
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Failed to get session transcript:', error);
    throw error;
  }
}

export async function getSessionTools(sessionId: string) {
  try {
    const result = await sql`
      SELECT * FROM tool_logs 
      WHERE session_id = ${sessionId}
      ORDER BY timestamp ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Failed to get session tools:', error);
    throw error;
  }
}
