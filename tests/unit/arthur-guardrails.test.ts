import { ArthurAPI } from '../../lib/ai/arthur-api';

// Ensure mocks are async
const mockValidatePrompt = jest.fn(async (...args) => Promise.resolve());
const mockValidateResponse = jest.fn(async (...args) => Promise.resolve());

// Spy on the prototype before any other imports or instance creation
jest
  .spyOn(ArthurAPI.prototype, 'validatePrompt')
  .mockImplementation(mockValidatePrompt);
jest
  .spyOn(ArthurAPI.prototype, 'validateResponse')
  .mockImplementation(mockValidateResponse);

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createArthurGuardrailsMiddleware } from '../../lib/ai/middleware/arthur-guardrails';
import { simulateReadableStream } from 'ai';

test('mock works', () => {
  const api = new ArthurAPI();
  api.validatePrompt('foo', { bar: 1 });
  expect(mockValidatePrompt).toHaveBeenCalledWith('foo', { bar: 1 });
});

describe('Arthur Guardrails Middleware', () => {
  let middleware: any;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log('[TEST] beforeEach - creating middleware');
    middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
      baseUrl: 'http://localhost:3030',
      blockMessage: 'Message blocked due to security policies',
    });
    console.log('[TEST] beforeEach - middleware created:', middleware);
    console.log('[TEST] beforeEach - mockValidatePrompt:', mockValidatePrompt);
  });

  describe('wrapGenerate', () => {
    it('should allow messages that pass validation', async () => {
      // Mock successful validation
      mockValidatePrompt.mockResolvedValue({
        rule_results: [],
        inference_id: 'test-inference-id',
      });

      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello, how can I help you?',
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 5 },
      });

      console.log('[TEST] About to call middleware.wrapGenerate');
      console.log('[TEST] middleware object:', middleware);
      console.log(
        '[TEST] mockValidatePrompt calls before:',
        mockValidatePrompt.mock.calls.length,
      );

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [{ role: 'user', content: 'Hello, how are you?' }],
        },
      });

      console.log(
        '[TEST] mockValidatePrompt calls after:',
        mockValidatePrompt.mock.calls.length,
      );
      console.log(
        '[TEST] mockValidatePrompt calls:',
        mockValidatePrompt.mock.calls,
      );

      expect(mockValidatePrompt).toHaveBeenCalledWith('test-task-id', {
        prompt: 'Hello, how are you?',
        conversation_id: undefined,
        user_id: undefined,
      });

      expect(mockDoGenerate).toHaveBeenCalled();
      expect(result.text).toBe('Hello, how can I help you?');
    });

    it('should block messages with PII violations', async () => {
      // Mock PII violation
      mockValidatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'PIIDataRule',
            details: 'Contains email address',
          },
        ],
      });

      const mockDoGenerate = jest.fn();

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [{ role: 'user', content: 'My email is test@example.com' }],
        },
      });

      expect(mockValidatePrompt).toHaveBeenCalled();
      expect(mockDoGenerate).not.toHaveBeenCalled();
      expect(result.text).toBe('Message blocked due to security policies');
      expect(result.finishReason).toBe('stop');
    });

    it('should block messages with toxicity violations', async () => {
      // Mock toxicity violation
      mockValidatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'ToxicityRule',
            details: 'Contains inappropriate content',
          },
        ],
      });

      const mockDoGenerate = jest.fn();

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [{ role: 'user', content: 'Inappropriate message' }],
        },
      });

      expect(mockValidatePrompt).toHaveBeenCalled();
      expect(mockDoGenerate).not.toHaveBeenCalled();
      expect(result.text).toBe('Message blocked due to security policies');
      expect(result.finishReason).toBe('stop');
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockValidatePrompt.mockRejectedValue(new Error('API Error'));

      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello, how can I help you?',
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 5 },
      });

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [{ role: 'user', content: 'Hello' }],
        },
      });

      expect(mockDoGenerate).toHaveBeenCalled();
      expect(result.text).toBe('Hello, how can I help you?');
    });

    it('should handle empty messages', async () => {
      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello',
        finishReason: 'stop',
        usage: { promptTokens: 5, completionTokens: 2 },
      });

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [],
        },
      });

      expect(mockValidatePrompt).not.toHaveBeenCalled();
      expect(mockDoGenerate).toHaveBeenCalled();
      expect(result.text).toBe('Hello');
    });
  });

  describe('wrapStream', () => {
    it('should allow streaming for valid messages', async () => {
      // Mock successful validation
      mockValidatePrompt.mockResolvedValue({
        rule_results: [],
        inference_id: 'test-inference-id',
      });

      const mockDoStream = jest.fn().mockResolvedValue({
        stream: simulateReadableStream({
          text: 'Hello',
          finishReason: 'stop',
        }),
      });

      const result = await middleware.wrapStream({
        doStream: mockDoStream,
        params: {
          prompt: [{ role: 'user', content: 'Hello' }],
        },
      });

      expect(mockValidatePrompt).toHaveBeenCalled();
      expect(mockDoStream).toHaveBeenCalled();
      expect(result.stream).toBeDefined();
    });

    it('should block streaming for violations', async () => {
      // Mock violation
      mockValidatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'PIIDataRule',
            details: 'Contains PII',
          },
        ],
      });

      const mockDoStream = jest.fn();

      const result = await middleware.wrapStream({
        doStream: mockDoStream,
        params: {
          prompt: [{ role: 'user', content: 'My SSN is 123-45-6789' }],
        },
      });

      expect(mockValidatePrompt).toHaveBeenCalled();
      expect(mockDoStream).not.toHaveBeenCalled();
      expect(result.stream).toBeDefined();
    });
  });
});
