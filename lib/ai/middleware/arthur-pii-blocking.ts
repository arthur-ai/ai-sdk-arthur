import type { LanguageModelV1Middleware, LanguageModelV1StreamPart, CoreMessage } from 'ai';
import { createArthurAPI, ValidationResult } from '../arthur-api';

interface ArthurPIIBlockingMiddlewareOptions {
  taskId: string;
  apiKey?: string;
  baseUrl?: string;
  blockMessage?: string;
}

function createArthurGuardrailsMiddleware(
  options: ArthurPIIBlockingMiddlewareOptions
): LanguageModelV1Middleware {
  const { taskId, apiKey, baseUrl, blockMessage = "Your message may contain sensitive data - sending message failed" } = options;
  const arthurAPI = createArthurAPI(apiKey, baseUrl);

  return {
    wrapGenerate: async ({ doGenerate, params }) => {
      const messages = params.prompt as CoreMessage[];
      const lastUserMessage = messages?.findLast(
        (msg: CoreMessage) => msg.role === 'user'
      );

      if (!lastUserMessage) {
        return doGenerate();
      }

      const textContent = Array.isArray(lastUserMessage.content) 
        ? lastUserMessage.content
            .filter(item => item.type === 'text')
            .map(item => (item as any).text)
            .join(' ')
        : String(lastUserMessage.content);

      let promptValidation: ValidationResult | undefined = undefined;
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });
        
        const ruleFailures = promptValidation.rule_results?.filter(
          rule => rule.result === 'Fail' && (rule.rule_type === 'PIIDataRule' || rule.rule_type === 'ToxicityRule')
        );

        if (ruleFailures && ruleFailures.length > 0) {
          return {
            text: blockMessage,
            finishReason: 'stop',
            usage: { promptTokens: 0, completionTokens: 0 },
            rawCall: { rawPrompt: null, rawSettings: {} },
          };
        }
      } catch (error) {
        console.error('Arthur PII validation error:', error);
      }

      const result = await doGenerate();

      if (promptValidation?.inference_id && result.text) {
        try {
          await arthurAPI.validateResponse(
            taskId,
            promptValidation.inference_id,
            {
              response: result.text,
              context: textContent,
            }
          );
        } catch (error) {
          console.error('Arthur PII response validation error:', error);
        }
      }

      return result;
    },

    wrapStream: async ({ doStream, params }) => {
      const messages = params.prompt as CoreMessage[];
      const lastUserMessage = messages?.findLast(
        (msg: CoreMessage) => msg.role === 'user'
      );

      if (!lastUserMessage) {
        return doStream();
      }

      const textContent = Array.isArray(lastUserMessage.content) 
        ? lastUserMessage.content
            .filter(item => item.type === 'text')
            .map(item => (item as any).text)
            .join(' ')
        : String(lastUserMessage.content);

      let promptValidation: ValidationResult | undefined = undefined;
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });
        
        const ruleFailures = promptValidation.rule_results?.filter(
          rule => rule.result === 'Fail' && (rule.rule_type === 'PIIDataRule' || rule.rule_type === 'ToxicityRule')
        );

        if (ruleFailures && ruleFailures.length > 0) {
          const blockedStream = new ReadableStream({
            start(controller) {
              const words = blockMessage.split(' ');
              let index = 0;
              
              const sendNextWord = () => {
                if (index < words.length) {
                  controller.enqueue({
                    type: 'text-delta',
                    textDelta: words[index] + (index < words.length - 1 ? ' ' : ''),
                  });
                  index++;
                  setTimeout(sendNextWord, 50);
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
        console.error('Arthur PII or toxicity validation error:', error);
      }

      const { stream, ...rest } = await doStream();

      let generatedText = '';
      let hasValidatedResponse = false;

      const transformStream = new TransformStream<
        LanguageModelV1StreamPart,
        LanguageModelV1StreamPart
      >({
        transform(chunk, controller) {
          if (chunk.type === 'text-delta') {
            generatedText += chunk.textDelta;
          }

          if (chunk.type === 'finish' && !hasValidatedResponse && promptValidation?.inference_id) {
            hasValidatedResponse = true;

            arthurAPI.validateResponse(
              taskId,
              promptValidation.inference_id,
              {
                response: generatedText,
                context: textContent,
              }
            ).then(() => {
            }).catch(error => {
              console.error('Arthur PII response validation error:', error);
            });
          }

          controller.enqueue(chunk);
        },
      });

      return {
        stream: stream.pipeThrough(transformStream),
        ...rest,
      };
    },
  };
} 

export const arthurGuardrails = createArthurGuardrailsMiddleware({
  taskId: process.env.ARTHUR_MODEL_ID!,
  apiKey: process.env.ARTHUR_API_KEY,
  baseUrl: process.env.ARTHUR_API_BASE,
  blockMessage: "Your the message was blocked due to organization security policies",
});