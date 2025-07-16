import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables for testing
process.env.ARTHUR_API_KEY = 'test-api-key';
process.env.ARTHUR_ORG_ID = 'test-org-id';
process.env.AUTH_SECRET = 'test-secret';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};
