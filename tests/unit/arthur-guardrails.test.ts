import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { createArthurGuardrailsMiddleware } from '../../lib/ai/middleware/arthur-guardrails'

// Mock the Arthur API
jest.mock('../../lib/ai/arthur-api', () => ({
  createArthurAPI: jest.fn(() => ({
    validatePrompt: jest.fn(),
    validateResponse: jest.fn(),
  })),
}))

describe('Arthur Guardrails Middleware', () => {
  let middleware: any
  let mockArthurAPI: any

  beforeEach(() => {
    jest.clearAllMocks()
    
    middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task-id',
      apiKey: 'test-api-key',
      baseUrl: 'http://localhost:3030',
      blockMessage: 'Message blocked due to security policies',
    })

    // Get the mocked API instance
    const { createArthurAPI } = require('../../lib/ai/arthur-api')
    mockArthurAPI = createArthurAPI()
  })

  describe('wrapGenerate', () => {
    it('should allow messages that pass validation', async () => {
      // Mock successful validation
      mockArthurAPI.validatePrompt.mockResolvedValue({
        rule_results: [],
        inference_id: 'test-inference-id',
      })

      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello, how can I help you?',
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 5 },
      })

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [
            { role: 'user', content: 'Hello, how are you?' }
          ],
        },
      })

      expect(mockArthurAPI.validatePrompt).toHaveBeenCalledWith('test-task-id', {
        prompt: 'Hello, how are you?',
        conversation_id: undefined,
        user_id: undefined,
      })

      expect(mockDoGenerate).toHaveBeenCalled()
      expect(result.text).toBe('Hello, how can I help you?')
    })

    it('should block messages with PII violations', async () => {
      // Mock PII violation
      mockArthurAPI.validatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'PIIDataRule',
            details: 'Contains email address',
          },
        ],
      })

      const mockDoGenerate = jest.fn()

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [
            { role: 'user', content: 'My email is test@example.com' }
          ],
        },
      })

      expect(mockArthurAPI.validatePrompt).toHaveBeenCalled()
      expect(mockDoGenerate).not.toHaveBeenCalled()
      expect(result.text).toBe('Message blocked due to security policies')
      expect(result.finishReason).toBe('stop')
    })

    it('should block messages with toxicity violations', async () => {
      // Mock toxicity violation
      mockArthurAPI.validatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'ToxicityRule',
            details: 'Contains inappropriate content',
          },
        ],
      })

      const mockDoGenerate = jest.fn()

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [
            { role: 'user', content: 'Inappropriate message' }
          ],
        },
      })

      expect(mockArthurAPI.validatePrompt).toHaveBeenCalled()
      expect(mockDoGenerate).not.toHaveBeenCalled()
      expect(result.text).toBe('Message blocked due to security policies')
      expect(result.finishReason).toBe('stop')
    })

    it('should handle API errors gracefully', async () => {
      // Mock API error
      mockArthurAPI.validatePrompt.mockRejectedValue(new Error('API Error'))

      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello, how can I help you?',
        finishReason: 'stop',
        usage: { promptTokens: 10, completionTokens: 5 },
      })

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [
            { role: 'user', content: 'Hello' }
          ],
        },
      })

      expect(mockDoGenerate).toHaveBeenCalled()
      expect(result.text).toBe('Hello, how can I help you?')
    })

    it('should handle empty messages', async () => {
      const mockDoGenerate = jest.fn().mockResolvedValue({
        text: 'Hello',
        finishReason: 'stop',
        usage: { promptTokens: 5, completionTokens: 2 },
      })

      const result = await middleware.wrapGenerate({
        doGenerate: mockDoGenerate,
        params: {
          prompt: [],
        },
      })

      expect(mockArthurAPI.validatePrompt).not.toHaveBeenCalled()
      expect(mockDoGenerate).toHaveBeenCalled()
      expect(result.text).toBe('Hello')
    })
  })

  describe('wrapStream', () => {
    it('should allow streaming for valid messages', async () => {
      // Mock successful validation
      mockArthurAPI.validatePrompt.mockResolvedValue({
        rule_results: [],
        inference_id: 'test-inference-id',
      })

      const mockDoStream = jest.fn().mockResolvedValue({
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue({ type: 'text-delta', textDelta: 'Hello' })
            controller.enqueue({ type: 'finish', finishReason: 'stop' })
            controller.close()
          },
        }),
      })

      const result = await middleware.wrapStream({
        doStream: mockDoStream,
        params: {
          prompt: [
            { role: 'user', content: 'Hello' }
          ],
        },
      })

      expect(mockArthurAPI.validatePrompt).toHaveBeenCalled()
      expect(mockDoStream).toHaveBeenCalled()
      expect(result.stream).toBeDefined()
    })

    it('should block streaming for violations', async () => {
      // Mock violation
      mockArthurAPI.validatePrompt.mockResolvedValue({
        rule_results: [
          {
            result: 'Fail',
            rule_type: 'PIIDataRule',
            details: 'Contains PII',
          },
        ],
      })

      const mockDoStream = jest.fn()

      const result = await middleware.wrapStream({
        doStream: mockDoStream,
        params: {
          prompt: [
            { role: 'user', content: 'My SSN is 123-45-6789' }
          ],
        },
      })

      expect(mockArthurAPI.validatePrompt).toHaveBeenCalled()
      expect(mockDoStream).not.toHaveBeenCalled()
      expect(result.stream).toBeDefined()
    })
  })
}) 