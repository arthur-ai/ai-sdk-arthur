# Contributing Guide

Thank you for your interest in contributing to the Chat SDK with Arthur AI project! This guide will help you get started.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git
- Docker (for local Arthur GenAI Engine)

### Development Setup

1. **Fork and clone** the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-sdk-arthur.git
   cd ai-sdk-arthur
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Add your Arthur AI credentials
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

### 2. Make Your Changes

- Write clean, well-documented code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run unit tests
pnpm test:unit

# Run E2E tests
pnpm test:e2e

# Run linting
pnpm lint

# Check types
pnpm build
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

Use conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/amazing-feature
```

## Code Standards

### TypeScript

- Use strict TypeScript mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Add JSDoc comments for complex functions

### React/Next.js

- Use functional components with hooks
- Follow Next.js App Router patterns
- Use TypeScript for all components
- Implement proper error boundaries

### Testing

- Write unit tests for new middleware functions
- Add E2E tests for new user flows
- Maintain test coverage above 80%
- Use descriptive test names

### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Keep functions small and focused

## Adding New Features

### Middleware Development

When adding new middleware:

1. **Create the middleware function**
   ```typescript
   export function createCustomMiddleware(options: CustomOptions) {
     return {
       wrapGenerate: async ({ doGenerate, params }) => {
         // Your middleware logic
         return doGenerate();
       },
     };
   }
   ```

2. **Add unit tests**
   ```typescript
   describe('Custom Middleware', () => {
     it('should handle specific case', async () => {
       // Test implementation
     });
   });
   ```

3. **Add E2E tests**
   ```typescript
   test('should work in real user flow', async ({ page }) => {
     // Test user interaction
   });
   ```

### API Routes

When adding new API routes:

1. **Create the route handler**
   ```typescript
   export async function POST(request: Request) {
     // Your API logic
   }
   ```

2. **Add route tests**
   ```typescript
   test('POST /api/new-route', async ({ request }) => {
     const response = await request.post('/api/new-route', {
       data: { /* test data */ },
     });
     expect(response.status()).toBe(200);
   });
   ```

### Components

When adding new components:

1. **Create the component**
   ```typescript
   interface ComponentProps {
     // Define props
   }

   export function NewComponent({ prop }: ComponentProps) {
     return <div>Component content</div>;
   }
   ```

2. **Add component tests**
   ```typescript
   test('renders correctly', async ({ page }) => {
     await page.goto('/');
     await expect(page.locator('[data-testid="new-component"]')).toBeVisible();
   });
   ```

## Testing Guidelines

### Unit Tests (Vitest)

- Test business logic in isolation
- Mock external dependencies
- Test edge cases and error conditions
- Keep tests fast and reliable

### E2E Tests (Playwright)

- Test complete user workflows
- Use page object models
- Add `data-testid` attributes to components
- Test cross-browser compatibility

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

## Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Document complex business logic
- Include usage examples
- Explain configuration options

### User Documentation

- Update README.md for user-facing changes
- Add setup instructions for new features
- Include troubleshooting steps
- Provide code examples

## Pull Request Guidelines

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   pnpm test:unit && pnpm test:e2e
   ```

2. **Check code quality**
   ```bash
   pnpm lint
   pnpm build
   ```

3. **Update documentation**
   - README.md for user-facing changes
   - Code comments for complex logic
   - API documentation for new endpoints

### PR Description

Include the following in your PR description:

- **Summary** of changes
- **Motivation** for the change
- **Testing** approach used
- **Breaking changes** (if any)
- **Screenshots** for UI changes

### Review Process

1. **Self-review** your changes
2. **Request review** from maintainers
3. **Address feedback** promptly
4. **Squash commits** if requested
5. **Merge** when approved

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear description** of the issue
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, etc.)
- **Relevant logs** or error messages

### Feature Requests

When requesting features, include:

- **Use case** and motivation
- **Proposed solution** (if any)
- **Alternative approaches** considered
- **Impact** on existing functionality

## Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow project conventions

### Communication

- Use GitHub Issues for discussions
- Be clear and concise
- Provide context for questions
- Help others when possible

## Getting Help

### Resources

- [Setup Guide](./SETUP.md) - Get started with the project
- [Testing Guide](./TESTING.md) - Learn about testing
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues
- [Arthur AI Docs](https://docs.arthur.ai) - Arthur AI documentation

### Support Channels

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and discussions
- **Arthur AI Support**: For Arthur AI specific issues

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project documentation
- Release notes
- Community acknowledgments

Thank you for contributing to making this project better! 🚀 