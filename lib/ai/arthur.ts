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

  // Only process keyword matches
  const keywordMatches = validationResult.rule_results
    .filter((rule) => rule.result === 'Fail' && rule.details?.keyword_matches)
    .flatMap((rule) => rule.details?.keyword_matches || [])
    .map((match) => match.keyword);

  // Sort keywords by length (longest first) to avoid partial replacements
  keywordMatches.sort((a, b) => b.length - a.length);

  // Replace each keyword with [REDACTED]
  for (const keyword of keywordMatches) {
    redactedText = redactedText.replace(
      new RegExp(escapeRegExp(keyword), 'gi'),
      '[REDACTED]',
    );
  }

  return redactedText;
}

export function redactCustomKeywords(
  text: string,
  keywords: string[],
  replacement = '[REDACTED]',
): string {
  let redactedText = text;

  // Sort keywords by length (longest first) to avoid partial replacements
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

  // Replace each keyword with the replacement text
  for (const keyword of sortedKeywords) {
    redactedText = redactedText.replace(
      new RegExp(escapeRegExp(keyword), 'gi'),
      replacement,
    );
  }

  return redactedText;
}

// Helper function to escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
