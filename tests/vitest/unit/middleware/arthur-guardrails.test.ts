import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createArthurGuardrailsMiddleware } from '@/lib/ai/middleware/arthur-guardrails';

// Mock the Arthur API
vi.mock('@/lib/ai/arthur-api', () => ({
  createArthurAPI: vi.fn(() => ({
    validatePrompt: vi.fn(),
    validateResponse: vi.fn(),
  })),
}));

describe('Arthur Guardrails Middleware', () => {
  let mockCreateArthurAPI: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { createArthurAPI } = await import('@/lib/ai/arthur-api');
    mockCreateArthurAPI = vi.mocked(createArthurAPI);
  });

  it('should block messages with PII when validation fails', async () => {
    const middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
      blockMessage: 'Message blocked due to PII',
    });
    // Get the mock instance after middleware creation
    const mockInstance = mockCreateArthurAPI.mock.results[0].value;
    mockInstance.validatePrompt.mockResolvedValue({
      inference_id: 'test-inference-id',
      rule_results: [
        {
          id: 'rule-1',
          name: 'PII Detection',
          rule_type: 'PIIDataRule',
          scope: 'default',
          result: 'Fail',
          latency_ms: 100,
          details: { detected_pii: ['SSN'] },
        },
      ],
    });

    const mockDoGenerate = vi.fn().mockResolvedValue({
      text: 'This should not be returned',
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 5 },
    });

    const result = await middleware.wrapGenerate({
      doGenerate: mockDoGenerate,
      params: {
        prompt: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'My SSN is 123-45-6789',
          },
        ],
      },
    });

    expect(result.text).toBe('Message blocked due to PII');
    expect(result.finishReason).toBe('stop');
    expect(mockDoGenerate).not.toHaveBeenCalled();
  });

  it('should pass through messages when validation succeeds', async () => {
    const middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
    });
    const mockInstance = mockCreateArthurAPI.mock.results[0].value;
    mockInstance.validatePrompt.mockResolvedValue({
      inference_id: 'test-inference-id',
      rule_results: [
        {
          id: 'rule-1',
          name: 'PII Detection',
          rule_type: 'PIIDataRule',
          scope: 'default',
          result: 'Pass',
          latency_ms: 100,
        },
      ],
    });

    const mockDoGenerate = vi.fn().mockResolvedValue({
      text: 'Hello, how are you?',
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 5 },
    });

    const result = await middleware.wrapGenerate({
      doGenerate: mockDoGenerate,
      params: {
        prompt: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello, how are you?',
          },
        ],
      },
    });

    expect(result.text).toBe('Hello, how are you?');
    expect(mockDoGenerate).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    const middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
    });
    const mockInstance = mockCreateArthurAPI.mock.results[0].value;
    mockInstance.validatePrompt.mockRejectedValue(new Error('API Error'));

    const mockDoGenerate = vi.fn().mockResolvedValue({
      text: 'Hello, how are you?',
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 5 },
    });

    const result = await middleware.wrapGenerate({
      doGenerate: mockDoGenerate,
      params: {
        prompt: [
          {
            id: 'msg-1',
            role: 'user',
            content: 'Hello, how are you?',
          },
        ],
      },
    });

    // Should pass through when API fails
    expect(result.text).toBe('Hello, how are you?');
    expect(mockDoGenerate).toHaveBeenCalled();
  });

  it('should handle messages with no user content', async () => {
    const middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
    });
    // No need to mock validatePrompt since it shouldn't be called
    const mockDoGenerate = vi.fn().mockResolvedValue({
      text: 'Response',
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 5 },
    });

    const result = await middleware.wrapGenerate({
      doGenerate: mockDoGenerate,
      params: {
        prompt: [
          {
            id: 'msg-1',
            role: 'assistant',
            content: 'Previous response',
          },
        ],
      },
    });

    expect(result.text).toBe('Response');
    expect(mockDoGenerate).toHaveBeenCalled();
    // Optionally, check that validatePrompt was not called
    const mockInstance = mockCreateArthurAPI.mock.results[0].value;
    expect(mockInstance.validatePrompt).not.toHaveBeenCalled();
  });
});
