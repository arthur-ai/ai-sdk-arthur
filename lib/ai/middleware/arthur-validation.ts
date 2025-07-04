import type { LanguageModelV1Middleware, LanguageModelV1StreamPart, CoreMessage } from 'ai';
import { createArthurAPI, ValidationResult } from '../arthur-api';

interface ArthurValidationMiddlewareOptions {
  taskId: string;
  apiKey?: string;
  baseUrl?: string;
}

export function createArthurValidationMiddleware(
  options: ArthurValidationMiddlewareOptions
): LanguageModelV1Middleware {
  const { taskId, apiKey, baseUrl } = options;
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

      // Always call Arthur validation, but never block or throw
      let promptValidation: ValidationResult | undefined = undefined;
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });
      } catch (error) {
        // Optionally log, but never block
        console.error('Arthur prompt validation error:', error);
      }

      // Generate the response
      const result = await doGenerate();

      // Always call response validation, but never block or throw
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
          // Optionally log, but never block
          console.error('Arthur response validation error:', error);
        }
      }

      return result;
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

      // Always call Arthur validation, but never block or throw
      let promptValidation: ValidationResult | undefined = undefined;
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });
      } catch (error) {
        // Optionally log, but never block
        console.error('Arthur prompt validation error:', error);
      }

      // Get the stream
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

          // If this is the finish chunk and we haven't validated the response yet
          if (chunk.type === 'finish' && !hasValidatedResponse && promptValidation?.inference_id) {
            hasValidatedResponse = true;
            // Validate the response asynchronously, but never block
            arthurAPI.validateResponse(
              taskId,
              promptValidation.inference_id,
              {
                response: generatedText,
                context: textContent,
              }
            ).catch(error => {
              // Optionally log, but never block
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