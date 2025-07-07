import type { LanguageModelV1Middleware, LanguageModelV1StreamPart, CoreMessage } from 'ai';
import { createArthurAPI, ValidationResult } from '../arthur-api';

interface ArthurPIIBlockingMiddlewareOptions {
  taskId: string;
  apiKey?: string;
  baseUrl?: string;
  blockMessage?: string;
}

function createArthurPIIBlockingMiddleware(
  options: ArthurPIIBlockingMiddlewareOptions
): LanguageModelV1Middleware {
  const { taskId, apiKey, baseUrl, blockMessage = "Your message may contain sensitive data - sending message failed" } = options;
  const arthurAPI = createArthurAPI(apiKey, baseUrl);

  return {
    wrapGenerate: async ({ doGenerate, params }) => {
      // Extract the prompt from the messages
      const messages = params.prompt as CoreMessage[];
      const lastUserMessage = messages?.findLast(
        (msg: CoreMessage) => msg.role === 'user'
      );

      if (!lastUserMessage) {
        return doGenerate();
      }

      // Extract text content from the message
      const textContent = Array.isArray(lastUserMessage.content) 
        ? lastUserMessage.content
            .filter(item => item.type === 'text')
            .map(item => (item as any).text)
            .join(' ')
        : String(lastUserMessage.content);

      // Check for PII rule failures
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        const promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });

        // Check if any PII rules failed
        const piiRuleFailures = promptValidation.rule_results?.filter(
          rule => rule.result === 'Fail' && rule.rule_type === 'PIIDataRule'
        );

        if (piiRuleFailures && piiRuleFailures.length > 0) {
          // Return blocked response instead of calling the LLM
          return {
            text: blockMessage,
            finishReason: 'stop',
            usage: { promptTokens: 0, completionTokens: 0 },
            rawCall: { rawPrompt: null, rawSettings: {} },
          };
        }
      } catch (error) {
        // If validation fails, continue with normal generation
        console.error('Arthur PII validation error:', error);
      }

      // If no PII issues or validation failed, proceed with normal generation
      return doGenerate();
    },

    wrapStream: async ({ doStream, params }) => {
      // Extract the prompt from the messages
      const messages = params.prompt as CoreMessage[];
      const lastUserMessage = messages?.findLast(
        (msg: CoreMessage) => msg.role === 'user'
      );

      if (!lastUserMessage) {
        return doStream();
      }

      // Extract text content from the message
      const textContent = Array.isArray(lastUserMessage.content) 
        ? lastUserMessage.content
            .filter(item => item.type === 'text')
            .map(item => (item as any).text)
            .join(' ')
        : String(lastUserMessage.content);

      // Check for PII rule failures
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        const promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });

        // Check if any PII rules failed
        const piiRuleFailures = promptValidation.rule_results?.filter(
          rule => rule.result === 'Fail' && rule.rule_type === 'PIIDataRule'
        );

        if (piiRuleFailures && piiRuleFailures.length > 0) {
          // Return blocked response stream instead of calling the LLM
          const blockedStream = new ReadableStream({
            start(controller) {
              // Send the blocked message as text deltas
              const words = blockMessage.split(' ');
              let index = 0;
              
              const sendNextWord = () => {
                if (index < words.length) {
                  controller.enqueue({
                    type: 'text-delta',
                    textDelta: words[index] + (index < words.length - 1 ? ' ' : ''),
                  });
                  index++;
                  setTimeout(sendNextWord, 50); // Small delay between words
                } else {
                  controller.enqueue({
                    type: 'finish',
                    finishReason: 'stop',
                    usage: { promptTokens: 0, completionTokens: 0 },
                  });
                  controller.close();
                }
              };
              
              sendNextWord();
            },
          });

          return {
            stream: blockedStream,
            rawCall: { rawPrompt: null, rawSettings: {} },
          };
        }
      } catch (error) {
        // If validation fails, continue with normal generation
        console.error('Arthur PII validation error:', error);
      }

      // If no PII issues or validation failed, proceed with normal stream
      return doStream();
    },
  };
} 

// Example: PII blocking middleware
export const arthurPIIBlocking = createArthurPIIBlockingMiddleware({
  taskId: process.env.ARTHUR_TASK_ID!,
  apiKey: process.env.ARTHUR_API_KEY,
  baseUrl: process.env.ARTHUR_API_BASE,
  blockMessage: "Your the message was blocked due to organization security policies",
});