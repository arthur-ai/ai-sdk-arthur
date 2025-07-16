import { ChatPage } from '../pages/chat';
import { test, expect } from '../fixtures';

test.describe('Middleware functionality', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.createNewChat();
  });

  test('should block PII in user messages', async () => {
    await chatPage.sendUserMessage('My social security number is 123-45-6789');

    // Should show blocking message
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should block email addresses in user messages', async () => {
    await chatPage.sendUserMessage(
      'Please send the report to john.doe@company.com',
    );

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should block phone numbers in user messages', async () => {
    await chatPage.sendUserMessage('Call me at 555-123-4567');

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should block credit card information', async () => {
    await chatPage.sendUserMessage(
      'My credit card number is 4111-1111-1111-1111',
    );

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should block driver license information', async () => {
    await chatPage.sendUserMessage('My driver license is A123456789');

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should allow safe messages through', async () => {
    await chatPage.sendUserMessage('What is the weather like today?');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    // Should not contain blocking message
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
    // Should contain actual response
    expect(assistantMessage.content?.length).toBeGreaterThan(0);
  });

  test('should block toxic content', async () => {
    await chatPage.sendUserMessage('You are stupid and worthless');

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should work with reasoning model', async ({ page }) => {
    const reasoningChatPage = new ChatPage(page);
    await reasoningChatPage.createNewChat();
    await reasoningChatPage.chooseModelFromSelector('chat-model-reasoning');

    // Test safe message with reasoning model
    await reasoningChatPage.sendUserMessage('Explain quantum computing');
    await reasoningChatPage.isGenerationComplete();

    const assistantMessage =
      await reasoningChatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
    expect(assistantMessage.content?.length).toBeGreaterThan(0);
  });

  test('should block PII in reasoning model', async ({ page }) => {
    const reasoningChatPage = new ChatPage(page);
    await reasoningChatPage.createNewChat();
    await reasoningChatPage.chooseModelFromSelector('chat-model-reasoning');

    await reasoningChatPage.sendUserMessage('My SSN is 123-45-6789');

    const assistantMessage =
      await reasoningChatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should handle file uploads with middleware', async () => {
    await chatPage.addImageAttachment();
    await chatPage.sendUserMessage('My SSN is 123-45-6789 in this image');

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should allow normal file uploads', async () => {
    await chatPage.addImageAttachment();
    await chatPage.sendUserMessage('What is in this image?');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
    expect(assistantMessage.content?.length).toBeGreaterThan(0);
  });

  test('should handle message editing with middleware', async () => {
    // Send a safe message first
    await chatPage.sendUserMessage('What is the weather like?');
    await chatPage.isGenerationComplete();

    // Edit to include PII
    const userMessage = await chatPage.getRecentUserMessage();
    await userMessage.edit('My SSN is 123-45-6789');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should handle URL query parameters with middleware', async ({
    page,
  }) => {
    await page.goto('/?query=My SSN is 123-45-6789');

    await chatPage.isGenerationComplete();
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should handle safe URL query parameters', async ({ page }) => {
    await page.goto('/?query=What is artificial intelligence?');

    await chatPage.isGenerationComplete();
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
    expect(assistantMessage.content?.length).toBeGreaterThan(0);
  });

  test('should work with suggested actions', async () => {
    await chatPage.sendUserMessageFromSuggestion();
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
    expect(assistantMessage.content?.length).toBeGreaterThan(0);
  });

  test('should handle multiple messages in conversation', async () => {
    // First message - safe
    await chatPage.sendUserMessage('Hello, how are you?');
    await chatPage.isGenerationComplete();

    let assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );

    // Second message - contains PII
    await chatPage.sendUserMessage('My email is john@example.com');

    assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );

    // Third message - safe again
    await chatPage.sendUserMessage('What is the capital of France?');
    await chatPage.isGenerationComplete();

    assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).not.toContain(
      'Your message may contain sensitive data',
    );
  });

  test('should handle stop generation with middleware', async () => {
    await chatPage.sendUserMessage('My SSN is 123-45-6789');

    // Should show stop button during blocking
    await expect(chatPage.stopButton).toBeVisible();
    await chatPage.stopButton.click();
    await expect(chatPage.sendButton).toBeVisible();
  });

  test('should handle voting on blocked messages', async () => {
    await chatPage.sendUserMessage('My SSN is 123-45-6789');

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toContain(
      'Your message may contain sensitive data',
    );

    // Should be able to vote on blocked messages
    await assistantMessage.upvote();
    await chatPage.isVoteComplete();
  });
});
