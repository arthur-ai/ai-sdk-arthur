import type { LanguageModelV1Middleware, LanguageModelV1StreamPart, CoreMessage } from 'ai';
import { createArthurAPI } from '../arthur-api';

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

      // Validate the prompt using Arthur API
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        const promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });

        // If prompt validation fails, throw an error
        if (promptValidation.rule_results?.some(rule => rule.result === 'Fail')) {
          const failedRules = promptValidation.rule_results
            .filter(rule => rule.result === 'Fail')
            .map(rule => rule.name);
          
          throw new Error(`Prompt validation failed: ${failedRules.join(', ')}`);
        }

        // Generate the response
        const result = await doGenerate();

        // Validate the response using the inference_id from prompt validation
        if (promptValidation.inference_id && result.text) {
          try {
            const responseValidation = await arthurAPI.validateResponse(
              taskId,
              promptValidation.inference_id,
              {
                response: result.text,
                context: textContent,
              }
            );

            // If response validation fails, throw an error
            if (responseValidation.rule_results?.some(rule => rule.result === 'Fail')) {
              const failedRules = responseValidation.rule_results
                .filter(rule => rule.result === 'Fail')
                .map(rule => rule.name);
              
              throw new Error(`Response validation failed: ${failedRules.join(', ')}`);
            }
          } catch (error) {
            console.error('Response validation error:', error);
            // Continue with the response even if validation fails
          }
        }

        return result;
      } catch (error) {
        console.error('Arthur validation error:', error);
        // If validation fails, return the original result
        return doGenerate();
      }
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

      // Validate the prompt using Arthur API
      try {
        const providerMetadata = params.providerMetadata as Record<string, any> | undefined;
        const promptValidation = await arthurAPI.validatePrompt(taskId, {
          prompt: textContent,
          conversation_id: providerMetadata?.conversationId as string || undefined,
          user_id: providerMetadata?.userId as string || undefined,
        });

        // If prompt validation fails, throw an error
        if (promptValidation.rule_results?.some(rule => rule.result === 'Fail')) {
          const failedRules = promptValidation.rule_results
            .filter(rule => rule.result === 'Fail')
            .map(rule => rule.name);
          
          throw new Error(`Prompt validation failed: ${failedRules.join(', ')}`);
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
            if (chunk.type === 'finish' && !hasValidatedResponse && promptValidation.inference_id) {
              hasValidatedResponse = true;
              
              // Validate the response asynchronously
              arthurAPI.validateResponse(
                taskId,
                promptValidation.inference_id,
                {
                  response: generatedText,
                  context: textContent,
                }
              ).then(responseValidation => {
                if (responseValidation.rule_results?.some(rule => rule.result === 'Fail')) {
                  const failedRules = responseValidation.rule_results
                    .filter(rule => rule.result === 'Fail')
                    .map(rule => rule.name);
                  
                  console.error(`Response validation failed: ${failedRules.join(', ')}`);
                }
              }).catch(error => {
                console.error('Response validation error:', error);
              });
            }

            controller.enqueue(chunk);
          },
        });

        return {
          stream: stream.pipeThrough(transformStream),
          ...rest,
        };
      } catch (error) {
        console.error('Arthur validation error:', error);
        // If validation fails, return the original stream
        return doStream();
      }
    },
  };
} 