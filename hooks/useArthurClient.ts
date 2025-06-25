import { useCallback } from 'react';

interface ArthurClientOptions {
  baseUrl?: string;
}

interface TokenUsageParams {
  start_time?: string;
  end_time?: string;
  group_by?: string[];
}

interface SearchParams {
  sort?: 'asc' | 'desc';
  page_size?: number;
  page?: number;
}

export function useArthurClient(options: ArthurClientOptions = {}) {
  const baseUrl = options.baseUrl || '/api/arthur';

  const getTokenUsage = useCallback(async (params?: TokenUsageParams) => {
    const searchParams = new URLSearchParams();
    if (params?.start_time) searchParams.append('start_time', params.start_time);
    if (params?.end_time) searchParams.append('end_time', params.end_time);
    if (params?.group_by) searchParams.append('group_by', params.group_by.join(','));

    const response = await fetch(`${baseUrl}/usage?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch token usage: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const getDefaultRules = useCallback(async () => {
    const response = await fetch(`${baseUrl}/client?endpoint=default-rules`);
    if (!response.ok) {
      throw new Error(`Failed to fetch default rules: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const getTask = useCallback(async (taskId: string) => {
    const response = await fetch(`${baseUrl}/client?endpoint=task&task_id=${taskId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const createTask = useCallback(async (task: { name: string }) => {
    const response = await fetch(`${baseUrl}/client?endpoint=create-task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`Failed to create task: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const searchTasks = useCallback(async (searchRequest: any, params?: SearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.append('endpoint', 'search-tasks');
    if (params) {
      searchParams.append('params', JSON.stringify(params));
    }

    const response = await fetch(`${baseUrl}/client?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });
    if (!response.ok) {
      throw new Error(`Failed to search tasks: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const searchRules = useCallback(async (searchRequest: any, params?: SearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.append('endpoint', 'search-rules');
    if (params) {
      searchParams.append('params', JSON.stringify(params));
    }

    const response = await fetch(`${baseUrl}/client?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchRequest),
    });
    if (!response.ok) {
      throw new Error(`Failed to search rules: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const validatePrompt = useCallback(async (taskId: string, request: any) => {
    const searchParams = new URLSearchParams();
    searchParams.append('endpoint', 'validate-prompt');
    searchParams.append('task_id', taskId);

    const response = await fetch(`${baseUrl}/client?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Failed to validate prompt: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const validateResponse = useCallback(async (taskId: string, inferenceId: string, request: any) => {
    const searchParams = new URLSearchParams();
    searchParams.append('endpoint', 'validate-response');
    searchParams.append('task_id', taskId);
    searchParams.append('inference_id', inferenceId);

    const response = await fetch(`${baseUrl}/client?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Failed to validate response: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  const postFeedback = useCallback(async (inferenceId: string, feedback: any) => {
    const searchParams = new URLSearchParams();
    searchParams.append('endpoint', 'post-feedback');
    searchParams.append('inference_id', inferenceId);

    const response = await fetch(`${baseUrl}/client?${searchParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) {
      throw new Error(`Failed to post feedback: ${response.statusText}`);
    }
    return response.json();
  }, [baseUrl]);

  return {
    getTokenUsage,
    getDefaultRules,
    getTask,
    createTask,
    searchTasks,
    searchRules,
    validatePrompt,
    validateResponse,
    postFeedback,
  };
} 