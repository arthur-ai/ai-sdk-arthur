import '@testing-library/jest-dom'

// Test environment configuration
export const TEST_CONFIG = {
  // Arthur AI test configuration
  ARTHUR: {
    API_KEY: 'test-api-key',
    MODEL_ID: 'test-model-id',
    API_BASE: 'http://localhost:3030',
    USE_GUARDRAILS: 'true',
  },
  // Auth test configuration
  AUTH: {
    SECRET: 'test-auth-secret',
  },
  // Database test configuration
  DATABASE: {
    URL: 'postgresql://test:test@localhost:5432/test_db',
  },
}

// Mock data for tests
export const MOCK_DATA = {
  messages: [
    {
      id: '1',
      role: 'user' as const,
      content: 'Hello, how are you?',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Hi there! I\'m doing well, thank you for asking. How can I help you today?',
      createdAt: new Date('2024-01-01T00:00:05Z'),
    },
  ],
  users: [
    {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
    },
  ],
  conversations: [
    {
      id: 'conv-1',
      title: 'Test Conversation',
      userId: 'user-1',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  ],
}

// Test utilities
export const createMockRequest = (body: any, headers: Record<string, string> = {}) => {
  return new Request('http://localhost:3000/api/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  })
}

export const createMockResponse = () => {
  return new Response()
}

// Mock Arthur API responses
export const MOCK_ARTHUR_RESPONSES = {
  validPrompt: {
    rule_results: [],
    inference_id: 'test-inference-id',
  },
  piiViolation: {
    rule_results: [
      {
        result: 'Fail',
        rule_type: 'PIIDataRule',
        details: 'Contains email address',
      },
    ],
    inference_id: 'test-inference-id',
  },
  toxicityViolation: {
    rule_results: [
      {
        result: 'Fail',
        rule_type: 'ToxicityRule',
        details: 'Contains inappropriate content',
      },
    ],
    inference_id: 'test-inference-id',
  },
}

// Test helpers
export const waitForElement = (selector: string, timeout = 5000) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

// Mock fetch for API tests
global.fetch = jest.fn()

// Mock environment variables for testing
process.env.ARTHUR_API_KEY = TEST_CONFIG.ARTHUR.API_KEY
process.env.ARTHUR_MODEL_ID = TEST_CONFIG.ARTHUR.MODEL_ID
process.env.ARTHUR_API_BASE = TEST_CONFIG.ARTHUR.API_BASE
process.env.ARTHUR_USE_GUARDRAILS = TEST_CONFIG.ARTHUR.USE_GUARDRAILS
process.env.AUTH_SECRET = TEST_CONFIG.AUTH.SECRET 