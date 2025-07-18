# Testing Guide

This guide covers the testing infrastructure and best practices for the Chat SDK with Arthur AI project.

## Testing Strategy

This project uses a **hybrid testing approach** with two complementary test suites:

- **Vitest Unit Tests**: Fast, isolated tests for business logic
- **Playwright E2E Tests**: Comprehensive user flow validation

## Test Structure

```
tests/
├── playwright/          # E2E tests (Playwright)
│   ├── e2e/            # End-to-end user flows
│   ├── routes/         # API route tests
│   └── pages/          # Page object models
└── vitest/             # Unit tests (Vitest)
    └── unit/           # Business logic tests
        └── middleware/ # Middleware unit tests
```

## Running Tests

### Quick Commands

```bash
# Run all unit tests (fast)
pnpm test:unit

# Run all E2E tests (comprehensive)
pnpm test:e2e

# Run unit tests with UI
pnpm test:unit:ui

# Run specific test files
pnpm exec playwright test tests/playwright/e2e/chat.test.ts
pnpm exec vitest tests/vitest/unit/middleware/arthur-guardrails.test.ts
```

### CI/CD Integration

```bash
# Run tests in CI environment
pnpm test:ci

# Run tests with coverage
pnpm exec vitest --coverage
pnpm exec playwright test --reporter=html
```

## Unit Testing (Vitest)

### What to Test

- **Middleware functions**: Arthur guardrails, validation logic
- **Utility functions**: Data processing, formatting
- **Business logic**: Chat processing, file handling
- **API route handlers**: Request/response logic

### Example Unit Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { createArthurGuardrailsMiddleware } from '@/lib/ai/middleware/arthur-guardrails';

describe('Arthur Guardrails Middleware', () => {
  it('should block messages with PII', async () => {
    const middleware = createArthurGuardrailsMiddleware({
      taskId: 'test-task',
      apiKey: 'test-key',
    });

    // Test implementation...
    expect(result.text).toBe('Message blocked due to PII');
  });
});
```

### Best Practices

- **Mock external dependencies**: API calls, database operations
- **Test edge cases**: Error conditions, boundary values
- **Keep tests focused**: One assertion per test
- **Use descriptive names**: Clear test descriptions

## E2E Testing (Playwright)

### What to Test

- **User workflows**: Complete chat conversations
- **File uploads**: Image and document handling
- **Authentication**: Login/logout flows
- **Middleware integration**: PII blocking, toxicity detection
- **Cross-browser compatibility**: Chrome, Firefox, Safari

### Example E2E Test

```typescript
import { test, expect } from '../fixtures';

test('should block PII in user messages', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="chat-input"]', 'My SSN is 123-45-6789');
  await page.click('[data-testid="send-button"]');
  
  const response = await page.waitForSelector('[data-testid="assistant-message"]');
  expect(await response.textContent()).toContain('blocked');
});
```

### Page Object Models

Use page objects to encapsulate UI interactions:

```typescript
export class ChatPage {
  constructor(private page: Page) {}

  async sendMessage(text: string) {
    await this.page.fill('[data-testid="chat-input"]', text);
    await this.page.click('[data-testid="send-button"]');
  }

  async getLastMessage() {
    return this.page.locator('[data-testid="assistant-message"]').last();
  }
}
```

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/vitest/unit/setup.ts'],
    include: ['tests/vitest/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
```

## Writing New Tests

### Adding Unit Tests

1. **Create test file** in `tests/vitest/unit/`
2. **Import function** to test
3. **Mock dependencies** using `vi.mock()`
4. **Write test cases** with clear descriptions
5. **Run tests**: `pnpm test:unit`

### Adding E2E Tests

1. **Create test file** in `tests/playwright/e2e/`
2. **Use page objects** for UI interactions
3. **Test user workflows** end-to-end
4. **Add data-testid attributes** to components
5. **Run tests**: `pnpm test:e2e`

### Test Data

Use fixtures for consistent test data:

```typescript
// tests/playwright/fixtures.ts
export const testData = {
  validMessage: 'Hello, how are you?',
  piiMessage: 'My SSN is 123-45-6789',
  toxicMessage: 'You are stupid and worthless',
};
```

## Debugging Tests

### Unit Test Debugging

```bash
# Run with debug output
pnpm exec vitest --reporter=verbose

# Run specific test with UI
pnpm exec vitest --ui tests/vitest/unit/middleware/arthur-guardrails.test.ts
```

### E2E Test Debugging

```bash
# Run in headed mode
pnpm exec playwright test --headed

# Run with debug mode
pnpm exec playwright test --debug

# Generate trace
pnpm exec playwright test --trace on
```

## Performance Testing

### Test Execution Times

- **Unit tests**: < 30 seconds
- **E2E tests**: < 2 minutes
- **Full test suite**: < 3 minutes

### Optimization Tips

- **Parallel execution**: Tests run in parallel when possible
- **Test isolation**: Each test is independent
- **Efficient mocking**: Mock heavy operations
- **Selective testing**: Run only relevant tests during development

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/ci.yml
- name: Run Unit Tests
  run: pnpm test:unit

- name: Run E2E Tests
  run: pnpm test:e2e
```

### Pre-commit Hooks

```json
// package.json
{
  "scripts": {
    "pre-commit": "pnpm test:unit && pnpm lint"
  }
}
```

## Common Issues

### Unit Test Issues

**Mock not working?**
- Check import paths
- Ensure mocks are hoisted
- Use `vi.mocked()` for type safety

**Environment variables missing?**
- Add to `tests/vitest/unit/setup.ts`
- Use `process.env.VARIABLE = 'test-value'`

### E2E Test Issues

**Tests flaky?**
- Add explicit waits
- Use `page.waitForSelector()` instead of `page.locator()`
- Increase timeouts for slow operations

**Browser not found?**
```bash
pnpm exec playwright install
```

## Best Practices Summary

1. **Write tests first** (TDD approach)
2. **Keep tests simple** and focused
3. **Use descriptive names** for test cases
4. **Mock external dependencies**
5. **Test error conditions**
6. **Maintain test data** in fixtures
7. **Run tests frequently** during development
8. **Keep tests fast** and reliable

## Next Steps

- [Setup Guide](./SETUP.md) - Get started with the project
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions 