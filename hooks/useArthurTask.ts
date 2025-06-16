import useSWR from 'swr';

interface RuleConfig {
  keywords?: string[];
  regex_patterns?: string[];
  disabled_pii_entities?: string[];
  allow_list?: string[];
  examples?: Array<{
    example: string;
    result: boolean;
  }>;
  threshold?: number;
}

interface Rule {
  id: string;
  name: string;
  type:
    | 'KeywordRule'
    | 'RegexRule'
    | 'PIIDataRule'
    | 'ModelHallucinationRuleV2'
    | 'ModelSensitiveDataRule'
    | 'PromptInjectionRule'
    | 'ToxicityRule';
  apply_to_prompt: boolean;
  apply_to_response: boolean;
  enabled?: boolean;
  scope: 'default' | 'task';
  created_at: number;
  updated_at: number;
  config?: RuleConfig;
}

interface ArthurTask {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  rules: Rule[];
}

async function fetchArthurTask(): Promise<ArthurTask> {
  const response = await fetch('/api/arthur/task');

  if (!response.ok) {
    throw new Error('Failed to fetch Arthur task');
  }

  return response.json();
}

export function useArthurTask() {
  const { data, error, mutate } = useSWR('arthur-task', fetchArthurTask, {
    revalidateOnFocus: false, // Don't revalidate when window regains focus
    revalidateOnReconnect: true, // Revalidate when browser regains connection
    refreshInterval: 60000, // Refresh every minute
  });

  return {
    task: data,
    isLoading: !error && !data,
    isError: error,
    refresh: mutate,
  };
}

// Helper functions to quickly check rules
export function getKeywordRules(task?: ArthurTask): string[] {
  if (!task) return [];

  return task.rules
    .filter((rule) => rule.type === 'KeywordRule' && rule.enabled !== false)
    .flatMap((rule) => rule.config?.keywords || []);
}

export function getRegexPatterns(task?: ArthurTask): string[] {
  if (!task) return [];

  return task.rules
    .filter((rule) => rule.type === 'RegexRule' && rule.enabled !== false)
    .flatMap((rule) => rule.config?.regex_patterns || []);
}

export function getPIIConfig(task?: ArthurTask) {
  if (!task) return null;

  const piiRule = task.rules.find(
    (rule) => rule.type === 'PIIDataRule' && rule.enabled !== false,
  );

  if (!piiRule?.config) return null;

  return {
    disabledEntities: piiRule.config.disabled_pii_entities || [],
    allowList: piiRule.config.allow_list || [],
  };
}

export function getToxicityThreshold(task?: ArthurTask): number | null {
  if (!task) return null;

  const toxicityRule = task.rules.find(
    (rule) => rule.type === 'ToxicityRule' && rule.enabled !== false,
  );

  return toxicityRule?.config?.threshold ?? null;
}
