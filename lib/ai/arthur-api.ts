/**
 * Arthur GenAI Engine API Client
 * Based on OpenAPI specification v2.1.44
 */

// Types based on OpenAPI schema
export interface TokenUsageCount {
  inference: number;
  eval_prompt: number;
  eval_completion: number;
  user_input: number; // deprecated
  prompt: number; // deprecated
  completion: number; // deprecated
}

export interface TokenUsageResponse {
  rule_type?: string | null;
  task_id?: string | null;
  count: TokenUsageCount;
}

export type TokenUsageScope = 'rule_type' | 'task';

export type InferenceFeedbackTarget = 'context' | 'response_results' | 'prompt_results';

export interface FeedbackRequest {
  target: InferenceFeedbackTarget;
  score: number;
  reason?: string | null;
  user_id?: string | null;
}

export interface InferenceFeedbackResponse {
  id: string;
  inference_id: string;
  target: InferenceFeedbackTarget;
  score: number;
  reason?: string | null;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface QueryFeedbackResponse {
  feedback: InferenceFeedbackResponse[];
  page: number;
  page_size: number;
  total_pages: number;
  total_count: number;
}

export type RuleType = 
  | 'KeywordRule'
  | 'ModelHallucinationRuleV2'
  | 'ModelSensitiveDataRule'
  | 'PIIDataRule'
  | 'PromptInjectionRule'
  | 'RegexRule'
  | 'ToxicityRule';

export type RuleResultEnum = 
  | 'Pass'
  | 'Fail'
  | 'Skipped'
  | 'Unavailable'
  | 'Partially Unavailable'
  | 'Model Not Available';

export type RuleScope = 'default' | 'task';

export type PaginationSortMethod = 'asc' | 'desc';

export interface ExternalRuleResult {
  id: string;
  name: string;
  rule_type: RuleType;
  scope: RuleScope;
  result: RuleResultEnum;
  latency_ms: number;
  details?: any | null;
}

export interface ExternalInferencePrompt {
  id: string;
  inference_id: string;
  result: RuleResultEnum;
  created_at: number;
  updated_at: number;
  message: string;
  prompt_rule_results: ExternalRuleResult[];
  tokens?: number | null;
}

export interface ExternalInferenceResponse {
  id: string;
  inference_id: string;
  result: RuleResultEnum;
  created_at: number;
  updated_at: number;
  message: string;
  context?: string | null;
  response_rule_results: ExternalRuleResult[];
  tokens?: number | null;
}

export interface ExternalInference {
  id: string;
  result: RuleResultEnum;
  created_at: number;
  updated_at: number;
  task_id?: string | null;
  task_name?: string | null;
  conversation_id?: string | null;
  inference_prompt: ExternalInferencePrompt;
  inference_response?: ExternalInferenceResponse | null;
  inference_feedback: InferenceFeedbackResponse[];
  user_id?: string | null;
}

export interface QueryInferencesResponse {
  count: number;
  inferences: ExternalInference[];
}

export interface KeywordsConfig {
  keywords: string[];
}

export interface RegexConfig {
  regex_patterns: string[];
}

export interface ExampleConfig {
  example: string;
  result: boolean;
}

export interface ExamplesConfig {
  examples: ExampleConfig[];
  hint?: string | null;
}

export interface ToxicityConfig {
  threshold?: number | null;
}

export interface PIIConfig {
  disabled_pii_entities?: string[] | null;
  confidence_threshold?: number | null;
  allow_list?: string[] | null;
}

export interface NewRuleRequest {
  name: string;
  type: RuleType;
  apply_to_prompt: boolean;
  apply_to_response: boolean;
  config?: KeywordsConfig | RegexConfig | ExamplesConfig | ToxicityConfig | PIIConfig | null;
}

export interface RuleResponse {
  id: string;
  name: string;
  type: RuleType;
  apply_to_prompt: boolean;
  apply_to_response: boolean;
  enabled?: boolean | null;
  scope: RuleScope;
  created_at: number;
  updated_at: number;
  config?: KeywordsConfig | RegexConfig | ExamplesConfig | ToxicityConfig | PIIConfig | null;
}

export interface NewTaskRequest {
  name: string;
}

export interface TaskResponse {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  rules: RuleResponse[];
}

export interface SearchRulesRequest {
  rule_ids?: string[] | null;
  rule_scopes?: RuleScope[] | null;
  prompt_enabled?: boolean | null;
  response_enabled?: boolean | null;
  rule_types?: RuleType[] | null;
}

export interface SearchRulesResponse {
  count: number;
  rules: RuleResponse[];
}

export interface SearchTasksRequest {
  task_ids?: string[] | null;
  task_name?: string | null;
}

export interface SearchTasksResponse {
  count: number;
  tasks: TaskResponse[];
}

export interface UpdateRuleRequest {
  enabled: boolean;
}

export interface PromptValidationRequest {
  prompt: string;
  conversation_id?: string | null;
  user_id?: string | null;
}

export interface ResponseValidationRequest {
  response: string;
  context?: string | null;
}

export interface ValidationResult {
  inference_id?: string | null;
  rule_results?: ExternalRuleResult[] | null;
  user_id?: string | null;
}

export type APIKeysRolesEnum = 
  | 'DEFAULT-RULE-ADMIN'
  | 'TASK-ADMIN'
  | 'VALIDATION-USER'
  | 'ORG-AUDITOR'
  | 'ORG-ADMIN';

export interface NewApiKeyRequest {
  description?: string | null;
  roles?: APIKeysRolesEnum[] | null;
}

export interface ApiKeyResponse {
  id: string;
  key?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  deactivated_at?: string | null;
  message?: string | null;
  roles: string[];
}

export interface SpanResponse {
  id: string;
  trace_id: string;
  span_id: string;
  start_time: string;
  end_time: string;
  task_id?: string | null;
  created_at: string;
  updated_at: string;
  raw_data: Record<string, any>;
}

export interface QuerySpansResponse {
  count: number;
  spans: SpanResponse[];
}

// Query parameters interfaces
export interface TokenUsageQueryParams {
  start_time?: string;
  end_time?: string;
  group_by?: TokenUsageScope[];
}

export interface FeedbackQueryParams {
  start_time?: string | null;
  end_time?: string | null;
  feedback_id?: string | string[] | null;
  inference_id?: string | string[] | null;
  target?: string | string[] | null;
  score?: number | number[] | null;
  feedback_user_id?: string | null;
  conversation_id?: string | string[] | null;
  task_id?: string | string[] | null;
  inference_user_id?: string | null;
  sort?: PaginationSortMethod;
  page_size?: number;
  page?: number;
}

export interface InferencesQueryParams {
  task_ids?: string[];
  task_name?: string;
  conversation_id?: string;
  inference_id?: string;
  user_id?: string;
  start_time?: string;
  end_time?: string;
  rule_types?: RuleType[];
  rule_statuses?: RuleResultEnum[];
  prompt_statuses?: RuleResultEnum[];
  response_statuses?: RuleResultEnum[];
  include_count?: boolean;
  sort?: PaginationSortMethod;
  page_size?: number;
  page?: number;
}

export interface RulesSearchQueryParams {
  sort?: PaginationSortMethod;
  page_size?: number;
  page?: number;
}

export interface TasksSearchQueryParams {
  sort?: PaginationSortMethod;
  page_size?: number;
  page?: number;
}

export interface SpansQueryParams {
  trace_ids?: string[];
  span_ids?: string[];
  task_ids?: string[];
  start_time?: string;
  end_time?: string;
  sort?: PaginationSortMethod;
  page_size?: number;
  page?: number;
}

// API Client Class
export class ArthurAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey?: string, baseUrl?: string) {
    // Use provided parameters or fall back to environment variables
    this.apiKey = apiKey || process.env.ARTHUR_API_KEY || '';
    this.baseUrl = baseUrl || process.env.ARTHUR_API_BASE || 'https://api.arthur.ai';
    
    // Validate that we have an API key
    if (!this.apiKey) {
      throw new Error('ARTHUR_API_KEY is required. Please set the ARTHUR_API_KEY environment variable or pass it as a parameter.');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // Usage endpoints
  async getTokenUsage(params?: TokenUsageQueryParams): Promise<TokenUsageResponse[]> {
    const searchParams = new URLSearchParams();
    
    if (params?.start_time) searchParams.append('start_time', params.start_time);
    if (params?.end_time) searchParams.append('end_time', params.end_time);
    if (params?.group_by) {
      params.group_by.forEach(scope => searchParams.append('group_by', scope));
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/usage/tokens${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TokenUsageResponse[]>(endpoint);
  }

  // Feedback endpoints
  async postFeedback(inferenceId: string, feedback: FeedbackRequest): Promise<InferenceFeedbackResponse> {
    return this.request<InferenceFeedbackResponse>(`/api/v2/feedback/${inferenceId}`, {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  }

  async queryFeedback(params?: FeedbackQueryParams): Promise<QueryFeedbackResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.start_time) searchParams.append('start_time', params.start_time);
    if (params?.end_time) searchParams.append('end_time', params.end_time);
    if (params?.feedback_id) {
      if (Array.isArray(params.feedback_id)) {
        params.feedback_id.forEach(id => searchParams.append('feedback_id', id));
      } else {
        searchParams.append('feedback_id', params.feedback_id);
      }
    }
    if (params?.inference_id) {
      if (Array.isArray(params.inference_id)) {
        params.inference_id.forEach(id => searchParams.append('inference_id', id));
      } else {
        searchParams.append('inference_id', params.inference_id);
      }
    }
    if (params?.target) {
      if (Array.isArray(params.target)) {
        params.target.forEach(t => searchParams.append('target', t));
      } else {
        searchParams.append('target', params.target);
      }
    }
    if (params?.score !== undefined) {
      if (Array.isArray(params.score)) {
        params.score.forEach(s => searchParams.append('score', s.toString()));
      } else if (params.score !== null) {
        searchParams.append('score', params.score.toString());
      }
    }
    if (params?.feedback_user_id) searchParams.append('feedback_user_id', params.feedback_user_id);
    if (params?.conversation_id) {
      if (Array.isArray(params.conversation_id)) {
        params.conversation_id.forEach(id => searchParams.append('conversation_id', id));
      } else {
        searchParams.append('conversation_id', params.conversation_id);
      }
    }
    if (params?.task_id) {
      if (Array.isArray(params.task_id)) {
        params.task_id.forEach(id => searchParams.append('task_id', id));
      } else {
        searchParams.append('task_id', params.task_id);
      }
    }
    if (params?.inference_user_id) searchParams.append('inference_user_id', params.inference_user_id);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/feedback/query${queryString ? `?${queryString}` : ''}`;
    
    return this.request<QueryFeedbackResponse>(endpoint);
  }

  // Inferences endpoints
  async queryInferences(params?: InferencesQueryParams): Promise<QueryInferencesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.task_ids) {
      params.task_ids.forEach(id => searchParams.append('task_ids', id));
    }
    if (params?.task_name) searchParams.append('task_name', params.task_name);
    if (params?.conversation_id) searchParams.append('conversation_id', params.conversation_id);
    if (params?.inference_id) searchParams.append('inference_id', params.inference_id);
    if (params?.user_id) searchParams.append('user_id', params.user_id);
    if (params?.start_time) searchParams.append('start_time', params.start_time);
    if (params?.end_time) searchParams.append('end_time', params.end_time);
    if (params?.rule_types) {
      params.rule_types.forEach(type => searchParams.append('rule_types', type));
    }
    if (params?.rule_statuses) {
      params.rule_statuses.forEach(status => searchParams.append('rule_statuses', status));
    }
    if (params?.prompt_statuses) {
      params.prompt_statuses.forEach(status => searchParams.append('prompt_statuses', status));
    }
    if (params?.response_statuses) {
      params.response_statuses.forEach(status => searchParams.append('response_statuses', status));
    }
    if (params?.include_count !== undefined) searchParams.append('include_count', params.include_count.toString());
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/inferences/query${queryString ? `?${queryString}` : ''}`;
    
    return this.request<QueryInferencesResponse>(endpoint);
  }

  // Rules endpoints
  async getDefaultRules(): Promise<RuleResponse[]> {
    return this.request<RuleResponse[]>('/api/v2/default_rules');
  }

  async createDefaultRule(rule: NewRuleRequest): Promise<RuleResponse> {
    return this.request<RuleResponse>('/api/v2/default_rules', {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async archiveDefaultRule(ruleId: string): Promise<void> {
    return this.request<void>(`/api/v2/default_rules/${ruleId}`, {
      method: 'DELETE',
    });
  }

  async searchRules(
    searchRequest: SearchRulesRequest,
    params?: RulesSearchQueryParams
  ): Promise<SearchRulesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/rules/search${queryString ? `?${queryString}` : ''}`;
    
    return this.request<SearchRulesResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    });
  }

  // Tasks endpoints
  async createTask(task: NewTaskRequest): Promise<TaskResponse> {
    return this.request<TaskResponse>('/api/v2/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async searchTasks(
    searchRequest: SearchTasksRequest,
    params?: TasksSearchQueryParams
  ): Promise<SearchTasksResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = `/api/v2/tasks/search${queryString ? `?${queryString}` : ''}`;
    
    return this.request<SearchTasksResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    });
  }

  async getTask(taskId: string): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/api/v2/tasks/${taskId}`);
  }

  async archiveTask(taskId: string): Promise<void> {
    return this.request<void>(`/api/v2/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async createTaskRule(taskId: string, rule: NewRuleRequest): Promise<RuleResponse> {
    return this.request<RuleResponse>(`/api/v2/tasks/${taskId}/rules`, {
      method: 'POST',
      body: JSON.stringify(rule),
    });
  }

  async updateTaskRule(taskId: string, ruleId: string, update: UpdateRuleRequest): Promise<TaskResponse> {
    return this.request<TaskResponse>(`/api/v2/tasks/${taskId}/rules/${ruleId}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    });
  }

  async archiveTaskRule(taskId: string, ruleId: string): Promise<void> {
    return this.request<void>(`/api/v2/tasks/${taskId}/rules/${ruleId}`, {
      method: 'DELETE',
    });
  }

  // Task-based validation endpoints
  async validatePrompt(taskId: string, request: PromptValidationRequest): Promise<ValidationResult> {
    return this.request<ValidationResult>(`/api/v2/tasks/${taskId}/validate_prompt`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async validateResponse(
    taskId: string,
    inferenceId: string,
    request: ResponseValidationRequest
  ): Promise<ValidationResult> {
    return this.request<ValidationResult>(`/api/v2/tasks/${taskId}/validate_response/${inferenceId}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // API Keys endpoints
  async getAllActiveApiKeys(): Promise<ApiKeyResponse[]> {
    return this.request<ApiKeyResponse[]>('/auth/api_keys/');
  }

  async createApiKey(request: NewApiKeyRequest): Promise<ApiKeyResponse> {
    return this.request<ApiKeyResponse>('/auth/api_keys/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getApiKey(apiKeyId: string): Promise<ApiKeyResponse> {
    return this.request<ApiKeyResponse>(`/auth/api_keys/${apiKeyId}`);
  }

  async deactivateApiKey(apiKeyId: string): Promise<ApiKeyResponse> {
    return this.request<ApiKeyResponse>(`/auth/api_keys/deactivate/${apiKeyId}`, {
      method: 'DELETE',
    });
  }

  // Traces endpoints
  async receiveTraces(traces: string): Promise<void> {
    return this.request<void>('/v1/traces', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: traces,
    });
  }

  // Spans endpoints
  async querySpans(params?: SpansQueryParams): Promise<QuerySpansResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.trace_ids) {
      params.trace_ids.forEach(id => searchParams.append('trace_ids', id));
    }
    if (params?.span_ids) {
      params.span_ids.forEach(id => searchParams.append('span_ids', id));
    }
    if (params?.task_ids) {
      params.task_ids.forEach(id => searchParams.append('task_ids', id));
    }
    if (params?.start_time) searchParams.append('start_time', params.start_time);
    if (params?.end_time) searchParams.append('end_time', params.end_time);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());

    const queryString = searchParams.toString();
    const endpoint = `/v1/spans/query${queryString ? `?${queryString}` : ''}`;
    
    return this.request<QuerySpansResponse>(endpoint);
  }
}

// Export a factory function for easier usage
export function createArthurAPI(apiKey?: string, baseUrl?: string): ArthurAPI {
  return new ArthurAPI(apiKey, baseUrl);
} 