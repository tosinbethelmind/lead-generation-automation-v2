export type ScalingMode = 'dynamic' | 'n8n' | 'git';
export type SubmissionType = 'central' | 'web3forms' | 'sheets' | 'supabase';

export interface ScalingConfig {
  mode: ScalingMode;
  submissionType: SubmissionType;
  submissionKey: string;
}

/**
 * Parses the scaling config from the notes field of a lead.
 * Format in notes: [SCALING_MODE: dynamic] [SUBMISSION_TYPE: central] [SUBMISSION_KEY: key_here]
 */
export function parseScalingConfig(notes: string = '', defaultMode: ScalingMode = 'dynamic'): ScalingConfig {
  const modeMatch = notes.match(/\[SCALING_MODE:\s*(dynamic|n8n|git)\]/i);
  const typeMatch = notes.match(/\[SUBMISSION_TYPE:\s*(central|web3forms|sheets|supabase)\]/i);
  const keyMatch = notes.match(/\[SUBMISSION_KEY:\s*([^\]]+)\]/i);

  return {
    mode: (modeMatch ? modeMatch[1].toLowerCase() : defaultMode) as ScalingMode,
    submissionType: (typeMatch ? typeMatch[1].toLowerCase() : 'central') as SubmissionType,
    submissionKey: keyMatch ? keyMatch[1].trim() : '',
  };
}

/**
 * Serializes the scaling config and appends/updates it in the notes field.
 */
export function serializeScalingConfig(
  notes: string = '',
  config: Partial<ScalingConfig>
): string {
  // Strip existing tags
  let cleanNotes = notes
    .replace(/\[SCALING_MODE:\s*[^\]]+\]/gi, '')
    .replace(/\[SUBMISSION_TYPE:\s*[^\]]+\]/gi, '')
    .replace(/\[SUBMISSION_KEY:\s*[^\]]+\]/gi, '')
    .trim();

  // Load current values or fallbacks
  const current = parseScalingConfig(notes);
  const mode = config.mode || current.mode;
  const submissionType = config.submissionType || current.submissionType;
  const submissionKey = config.submissionKey !== undefined ? config.submissionKey : current.submissionKey;

  // Re-append tags at the end
  const tags = ` [SCALING_MODE: ${mode}] [SUBMISSION_TYPE: ${submissionType}]` + 
    (submissionKey ? ` [SUBMISSION_KEY: ${submissionKey}]` : '');

  return (cleanNotes + tags).trim();
}
