import { generateUUID } from '@/lib/utils';
import { expect, test } from '../fixtures';
import { getMessageByErrorCode } from '@/lib/errors';

test.describe('/api/chat with middleware', () => {
  test('should block messages containing PII when guardrails are enabled', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    // Test with SSN (should be blocked)
    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'My social security number is 123-45-6789',
          parts: [
            {
              type: 'text',
              text: 'My social security number is 123-45-6789',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    // Should be blocked by PII detection
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should block messages containing email addresses when guardrails are enabled', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Please send the report to john.doe@company.com',
          parts: [
            {
              type: 'text',
              text: 'Please send the report to john.doe@company.com',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should block messages containing phone numbers when guardrails are enabled', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Call me at 555-123-4567',
          parts: [
            {
              type: 'text',
              text: 'Call me at 555-123-4567',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should allow normal messages when guardrails are enabled', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'What is the weather like today?',
          parts: [
            {
              type: 'text',
              text: 'What is the weather like today?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    // Should not contain blocking message
    expect(text).not.toContain('Your message may contain sensitive data');
    // Should contain actual response
    expect(text).toContain('text-delta');
  });

  test('should block toxic content when guardrails are enabled', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'You are stupid and worthless',
          parts: [
            {
              type: 'text',
              text: 'You are stupid and worthless',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should validate responses when using validation middleware', async ({
    curieContext,
  }) => {
    const chatId = generateUUID();

    const response = await curieContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Tell me about artificial intelligence',
          parts: [
            {
              type: 'text',
              text: 'Tell me about artificial intelligence',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model-reasoning',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    // Should contain actual response (validation middleware logs but doesn't block)
    expect(text).toContain('text-delta');
  });

  test('should handle middleware errors gracefully', async ({ adaContext }) => {
    const chatId = generateUUID();

    // Test with malformed message that might cause middleware errors
    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: null, // This might cause middleware issues
          parts: [],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    // Should still return a response (even if it's an error)
    expect(response.status()).toBe(200);
  });

  test('should work with different model types', async ({ adaContext }) => {
    const chatId = generateUUID();

    // Test with reasoning model
    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Explain quantum computing step by step',
          parts: [
            {
              type: 'text',
              text: 'Explain quantum computing step by step',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model-reasoning',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('text-delta');
  });

  test('should handle stream responses with middleware', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'Write a short story about a robot',
          parts: [
            {
              type: 'text',
              text: 'Write a short story about a robot',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    const lines = text.split('\n').filter(Boolean);

    // Should have streaming response
    expect(lines.length).toBeGreaterThan(1);
    expect(text).toContain('text-delta');
    expect(text).toContain('finish');
  });

  test('should block credit card information', async ({ adaContext }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'My credit card number is 4111-1111-1111-1111',
          parts: [
            {
              type: 'text',
              text: 'My credit card number is 4111-1111-1111-1111',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should block driver license information', async ({ adaContext }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'My driver license is A123456789',
          parts: [
            {
              type: 'text',
              text: 'My driver license is A123456789',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain('Your message may contain sensitive data');
  });

  test('should allow safe content through guardrails', async ({
    adaContext,
  }) => {
    const chatId = generateUUID();

    const response = await adaContext.request.post('/api/chat', {
      data: {
        id: chatId,
        message: {
          id: generateUUID(),
          role: 'user',
          content: 'What are the benefits of renewable energy?',
          parts: [
            {
              type: 'text',
              text: 'What are the benefits of renewable energy?',
            },
          ],
          createdAt: new Date().toISOString(),
        },
        selectedChatModel: 'chat-model',
        selectedVisibilityType: 'private',
      },
    });

    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).not.toContain('Your message may contain sensitive data');
    expect(text).toContain('text-delta');
  });
});
