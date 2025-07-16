# Testing Suite Documentation

This document provides comprehensive information about the testing infrastructure for the Chat SDK with Arthur AI project.

## 🧪 Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── arthur-guardrails.test.ts
│   └── components/
│       └── chat.test.tsx
├── integration/             # Integration tests
│   └── chat-api.test.ts
├── e2e/                    # End-to-end tests
│   ├── artifacts.test.ts
│   ├── chat.test.ts
│   ├── reasoning.test.ts
│   └── session.test.ts
├── config/                  # Test configuration
│   └── test-setup.ts
├── fixtures.ts             # Test fixtures
├── helpers.ts              # Test helpers
└── README.md              # This file
```

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e           # E2E tests only

# Run with coverage
pnpm test:coverage

# Run in watch mode
pnpm test:watch

# Run CI pipeline (all tests)
pnpm test:ci
```

### Test Environment Setup

1. **Environment Variables**: Tests use mock environment variables defined in `jest.setup.js`
2. **Database**: Tests use in-memory or test database instances
3. **External Services**: Arthur AI API calls are mocked for unit/integration tests

## 📋 Test Types

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual functions, components, and modules in isolation.

**Coverage**:
- Arthur AI Guardrails middleware
- React components
- Utility functions
- Business logic

**Example**:
```typescript
describe('Arthur Guardrails Middleware', () => {
  it('should block messages with PII violations', async () => {
    // Test implementation
  })
})
```

### 2. Integration Tests (`tests/integration/`)

**Purpose**: Test API endpoints and service interactions.

**Coverage**:
- Chat API endpoints
- Authentication flows
- Database operations
- External service integrations

**Example**:
```typescript
describe('Chat API Integration', () => {
  it('should handle chat requests with valid messages', async () => {
    // Test implementation
  })
})
```

### 3. End-to-End Tests (`tests/e2e/`)

**Purpose**: Test complete user workflows and application behavior.

**Coverage**:
- User registration and authentication
- Chat functionality
- File uploads
- Artifact generation
- Reasoning capabilities

**Tools**: Playwright for browser automation

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

- **Environment**: jsdom for React component testing
- **Coverage**: 70% threshold for branches, functions, lines, and statements
- **Setup**: `jest.setup.js` for global test configuration
- **Patterns**: Tests in `tests/unit/` and `tests/integration/`

### Playwright Configuration (`playwright.config.ts`)

- **Browsers**: Chrome (Desktop)
- **Parallel**: 8 workers locally, 2 on CI
- **Timeout**: 120 seconds per test
- **Reports**: HTML reporter with trace retention

## 🛠 Test Utilities

### Mock Data (`tests/config/test-setup.ts`)

```typescript
export const MOCK_DATA = {
  messages: [...],
  users: [...],
  conversations: [...]
}
```

### Test Helpers

```typescript
// Create mock requests
createMockRequest(body, headers)

// Create mock responses
createMockResponse()

// Wait for DOM elements
waitForElement(selector, timeout)
```

### Arthur AI Mock Responses

```typescript
export const MOCK_ARTHUR_RESPONSES = {
  validPrompt: { rule_results: [], inference_id: 'test-id' },
  piiViolation: { rule_results: [{ result: 'Fail', rule_type: 'PIIDataRule' }] },
  toxicityViolation: { rule_results: [{ result: 'Fail', rule_type: 'ToxicityRule' }] }
}
```

## 📊 Coverage Requirements

### Unit Tests: 70% Coverage
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Integration Tests
- API endpoint functionality
- Database operations
- External service integrations

### E2E Tests
- Critical user workflows
- Cross-browser compatibility
- Performance benchmarks

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

**Jobs**:
1. **Lint**: ESLint, Biome, TypeScript checks
2. **Test**: Unit and integration tests with coverage
3. **E2E**: Playwright tests with report upload
4. **Build**: Application build verification
5. **Deploy**: Vercel deployment (main branch only)
6. **Security**: Trivy vulnerability scanning
7. **Performance**: Lighthouse CI performance testing

### Environment Variables

Required secrets for CI:
- `ARTHUR_API_KEY`
- `ARTHUR_MODEL_ID`
- `ARTHUR_API_BASE`
- `AUTH_SECRET`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🐛 Debugging Tests

### Unit/Integration Tests

```bash
# Run specific test file
pnpm test tests/unit/arthur-guardrails.test.ts

# Run with verbose output
pnpm test --verbose

# Run with coverage
pnpm test --coverage --watchAll
```

### E2E Tests

```bash
# Run specific test file
pnpm test:e2e tests/e2e/chat.test.ts

# Run with headed browser
pnpm test:e2e --headed

# Run with debug mode
pnpm test:e2e --debug
```

### Playwright Debug

```bash
# Open Playwright Inspector
pnpm exec playwright test --debug

# Show test report
pnpm exec playwright show-report
```

## 📝 Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, jest, beforeEach } from '@jest/globals'

describe('Component Name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = someFunction(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### Integration Test Example

```typescript
import { describe, it, expect } from '@jest/globals'
import { createMockRequest } from '../config/test-setup'

describe('API Endpoint', () => {
  it('should handle valid requests', async () => {
    const request = createMockRequest({ message: 'test' })
    const response = await handler(request)
    
    expect(response.status).toBe(200)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('user can send a message', async ({ page }) => {
  await page.goto('/')
  await page.fill('[data-testid="message-input"]', 'Hello')
  await page.click('[data-testid="send-button"]')
  
  await expect(page.locator('[data-testid="message"]')).toContainText('Hello')
})
```

## 🎯 Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Mocking
- Mock external dependencies
- Use consistent mock data
- Reset mocks between tests

### 3. Assertions
- Test one thing per test
- Use specific assertions
- Include edge cases

### 4. Performance
- Keep tests fast
- Use parallel execution
- Minimize setup/teardown time

## 🔍 Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure `@types/jest` is installed
2. **React Testing Issues**: Check `@testing-library/react` setup
3. **Playwright Issues**: Verify browser installation
4. **Environment Variables**: Check `jest.setup.js` configuration

### Debug Commands

```bash
# Check test configuration
pnpm test --showConfig

# Run tests with Node debugger
node --inspect-brk node_modules/.bin/jest

# Check Playwright installation
pnpm exec playwright --version
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [GitHub Actions](https://docs.github.com/en/actions) 