import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock environment variables for testing
process.env.ARTHUR_API_KEY = 'test-api-key';
process.env.ARTHUR_MODEL_ID = 'test-model-id';
process.env.ARTHUR_API_BASE = 'http://localhost:3030';
process.env.ARTHUR_USE_GUARDRAILS = 'true';
process.env.AUTH_SECRET = 'test-auth-secret';

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };

// Mock ReadableStream for testing
global.ReadableStream = class ReadableStream {
  constructor(underlyingSource) {
    this.underlyingSource = underlyingSource;
  }
  pipeThrough() {
    return this;
  }
};

// Mock TransformStream for testing
global.TransformStream = class TransformStream {
  constructor(transformer) {
    this.transformer = transformer;
  }
};
