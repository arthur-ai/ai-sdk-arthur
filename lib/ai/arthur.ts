import { ChatSDKError } from '@/lib/errors';

const ARTHUR_API_KEY = process.env.ARTHUR_API_KEY || '';
const ARTHUR_TASK_ID = process.env.ARTHUR_TASK_ID || '';
const ARTHUR_API_BASE = process.env.ARTHUR_API_BASE || '';

interface ValidationResult {
  inference_id: string;
  rule_results: Array<{
    id: string;
    name: string;
    result:
      | 'Pass'
      | 'Fail'
      | 'Skipped'
      | 'Unavailable'
      | 'Partially Unavailable'
      | 'Model Not Available';
    details?: {
      keyword_matches?: Array<{ keyword: string }>;
      regex_matches?: Array<{ matching_text: string }>;
      pii_entities?: Array<{ span: string }>;
    };
  }>;
}

export async function validatePrompt(
  prompt: string,
): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `${ARTHUR_API_BASE}/api/v2/tasks/${ARTHUR_TASK_ID}/validate_prompt`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ARTHUR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Arthur API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to validate prompt with Arthur:', error);
    throw new ChatSDKError('bad_request:api');
  }
}

export async function validateResponse(
  inferenceId: string,
  responseText: string,
  context?: string,
): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `${ARTHUR_API_BASE}/api/v2/tasks/${ARTHUR_TASK_ID}/validate_response/${inferenceId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ARTHUR_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: responseText,
          context,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Arthur API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to validate response with Arthur:', error);
    throw new ChatSDKError('bad_request:api');
  }
}

export function checkValidationResult(result: ValidationResult): boolean {
  return result.rule_results.every((rule) => rule.result === 'Pass');
}

export function redactSensitiveContent(
  text: string,
  validationResult: ValidationResult,
): string {
  let redactedText = text;

  // Get all matches from different rule types
  const matches = validationResult.rule_results.flatMap((rule) => {
    if (rule.result === 'Pass') return [];

    return [
      // Get keyword matches
      ...(rule.details?.keyword_matches?.map((match) => match.keyword) || []),
      // Get regex matches
      ...(rule.details?.regex_matches?.map((match) => match.matching_text) ||
        []),
      // Get PII matches
      ...(rule.details?.pii_entities?.map((entity) => entity.span) || []),
    ];
  });

  // Sort matches by length (longest first) to avoid partial replacements
  matches.sort((a, b) => b.length - a.length);

  // Replace each match with [REDACTED]
  for (const match of matches) {
    redactedText = redactedText.replace(
      new RegExp(escapeRegExp(match), 'g'),
      '[REDACTED]',
    );
  }

  return redactedText;
}

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
