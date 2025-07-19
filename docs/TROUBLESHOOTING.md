# Troubleshooting Guide

This guide helps you resolve common issues when working with the Chat SDK with Arthur AI project.

## Quick Fixes

### Environment Issues

**Environment variables not loading?**
```bash
# Ensure .env.local exists (not .env)
cp .env.example .env.local

# Restart development server
pnpm dev
```

**Auth secret missing?**
```bash
# Generate a new secret
openssl rand -base64 32

# Add to .env.local
AUTH_SECRET=your-generated-secret
```

### Development Server Issues

**Port already in use?**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev --port 3001
```

**Module not found errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
```

## Arthur AI Issues

### Engine Connection Problems

**Arthur GenAI Engine not responding?**
```bash
# Check if Docker container is running
docker ps | grep arthur

# Restart Arthur GenAI Engine
docker restart arthur-engine

# Check logs
docker logs arthur-engine
```

**API key invalid?**
1. Go to [platform.arthur.ai](https://platform.arthur.ai)
2. Navigate to your model dashboard
3. Expand "Model Management" dropdown
4. Click "API Key" and copy the new key
5. Update `ARTHUR_API_KEY` in `.env.local`

**Model ID not found?**
1. In Arthur Platform, go to your model
2. Copy the Model ID from the validate prompt command
3. The ID is in the URL: `/api/v2/tasks/{MODEL_ID}/`
4. Update `ARTHUR_MODEL_ID` in `.env.local`

### Content Blocking Issues

**PII not being blocked?**
- Verify `ARTHUR_USE_GUARDRAILS=true`
- Check PII metric is applied to "Prompt only"
- Ensure Arthur GenAI Engine is running and accessible
- Test with known PII: `My SSN is 123-45-6789`

**Too many false positives?**
- Adjust PII metric settings in Arthur Platform
- Disable unnecessary entities (CRYPTO, DATE_TIME, etc.)
- Review blocked content in Arthur Platform dashboard

## Testing Issues

### Unit Test Problems

**Vitest not running?**
```bash
# Install dependencies
pnpm install

# Clear cache
pnpm exec vitest --clearCache

# Run with verbose output
pnpm exec vitest --reporter=verbose
```

**Mock not working?**
```typescript
// Ensure mocks are at the top of the file
vi.mock('@/lib/ai/arthur-api', () => ({
  createArthurAPI: vi.fn(() => ({
    validatePrompt: vi.fn(),
    validateResponse: vi.fn(),
  })),
}));
```

**Environment variables missing in tests?**
```typescript
// Add to tests/vitest/unit/setup.ts
process.env.ARTHUR_API_KEY = 'test-api-key';
process.env.ARTHUR_MODEL_ID = 'test-model-id';
```

### E2E Test Problems

**Playwright browsers not found?**
```bash
# Install browsers
pnpm exec playwright install

# Install specific browser
pnpm exec playwright install chromium
```

**Tests failing intermittently?**
```bash
# Run with headed mode to see what's happening
pnpm exec playwright test --headed

# Run with debug mode
pnpm exec playwright test --debug

# Increase timeouts
pnpm exec playwright test --timeout=30000
```

**Element not found?**
- Add `data-testid` attributes to components
- Use `page.waitForSelector()` instead of `page.locator()`
- Check if element is in viewport: `await element.scrollIntoViewIfNeeded()`

## Database Issues

### Connection Problems

**Database connection failed?**
```bash
# Check DATABASE_URL format
DATABASE_URL=postgresql://username:password@host:port/database

# Test connection
pnpm db:check

# Run migrations
pnpm db:migrate
```

**Migration errors?**
```bash
# Reset database (⚠️ destroys data)
pnpm db:push --force-reset

# Or run migrations manually
pnpm db:migrate
```

### Neon Database Issues

**Neon connection timeout?**
- Check if Neon project is active
- Verify connection string format
- Try connecting from different network

## Build and Deployment Issues

### Build Errors

**TypeScript errors?**
```bash
# Check types
pnpm build

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format
```

**ESLint errors?**
```bash
# Fix auto-fixable issues
pnpm lint:fix

# Check specific file
pnpm exec eslint app/page.tsx

# Ignore specific rule for line
// eslint-disable-next-line @typescript-eslint/no-unused-vars
```

### Vercel Deployment Issues

**Environment variables missing in Vercel?**
1. Go to Vercel dashboard
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add all variables from `.env.local`

**Build failing on Vercel?**
- Check build logs for specific errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

## Performance Issues

### Slow Response Times

**Chat responses slow?**
- Check Arthur GenAI Engine performance
- Monitor network latency to Arthur API
- Consider caching frequently used validations

**File uploads slow?**
- Check file size limits
- Verify Vercel Blob configuration
- Monitor network bandwidth

### Memory Issues

**High memory usage?**
- Check for memory leaks in middleware
- Monitor Arthur GenAI Engine resource usage
- Consider implementing request timeouts

## Security Issues

### Authentication Problems

**Users can't log in?**
- Verify `AUTH_SECRET` is set correctly
- Check Auth.js configuration
- Ensure OAuth providers are configured

**Session issues?**
- Clear browser cookies and local storage
- Check session configuration in Auth.js
- Verify database connection for session storage

### Content Security

**PII leaking through?**
- Verify Arthur GenAI Engine is running
- Check middleware is properly configured
- Review blocked content logs

## Monitoring and Logs

### Debug Logging

**Enable debug logs?**
```bash
# Set debug environment variable
DEBUG=* pnpm dev

# Or enable specific debug
DEBUG=arthur:* pnpm dev
```

**Check Arthur GenAI Engine logs?**
```bash
# Docker logs
docker logs arthur-engine

# Follow logs in real-time
docker logs -f arthur-engine
```

### Error Tracking

**Common error patterns:**
- `MissingSecret`: Set `AUTH_SECRET`
- `Connection refused`: Arthur GenAI Engine not running
- `Invalid API key`: Check `ARTHUR_API_KEY`
- `Model not found`: Verify `ARTHUR_MODEL_ID`

## Getting Help

### Self-Service

1. **Check this guide** for your specific issue
2. **Search existing issues** on GitHub
3. **Review logs** for error details
4. **Test with minimal setup** to isolate the problem

### Community Support

- **GitHub Issues**: [Create an issue](https://github.com/arthur-ai/ai-sdk-arthur/issues)
- **Arthur AI Docs**: [docs.arthur.ai](https://docs.arthur.ai)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)

### When Creating Issues

Include the following information:
- **Error message** (full text)
- **Steps to reproduce**
- **Environment details** (OS, Node version, etc.)
- **Relevant logs**
- **What you've tried**

## Prevention Tips

1. **Keep dependencies updated**: `pnpm update`
2. **Run tests regularly**: `pnpm test:unit && pnpm test:e2e`
3. **Monitor Arthur GenAI Engine**: Check logs periodically
4. **Backup configuration**: Keep `.env.local` backed up
5. **Document customizations**: Note any changes to default settings

## Next Steps

- [Setup Guide](./SETUP.md) - Get started with the project
- [Testing Guide](./TESTING.md) - Learn about testing
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production 