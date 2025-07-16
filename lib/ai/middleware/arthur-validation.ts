import type { LanguageModelV1Middleware, LanguageModelV1StreamPart, CoreMessage } from 'ai';
import { createArthurAPI, ValidationResult } from '../arthur-api';

interface ArthurValidationMiddlewareOptions {
  taskId: string;
  apiKey?: string;
  baseUrl?: string;
}

function createArthurValidationMiddleware(
  options: ArthurValidationMiddlewareOptions
): LanguageModelV1Middleware {
  const { taskId, apiKey, baseUrl } = options;
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
      } catch (error) {
        console.error('Arthur prompt validation error:', error);
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
          console.error('Arthur response validation error:', error);
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
      } catch (error) {
        console.error('Arthur prompt validation error:', error);
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
              console.error('Arthur response validation error:', error);
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

export const arthurValidation = createArthurValidationMiddleware({
  taskId: process.env.ARTHUR_MODEL_ID!,
  apiKey: process.env.ARTHUR_API_KEY,
  baseUrl: process.env.ARTHUR_API_BASE,
});