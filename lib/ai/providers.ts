import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { createArthurValidationMiddleware } from './middleware/arthur-validation';
import { createArthurPIIBlockingMiddleware } from './middleware/arthur-pii-blocking';

// Create Arthur validation middleware (observational only)
const arthurValidation = createArthurValidationMiddleware({
  taskId: process.env.ARTHUR_TASK_ID!,
  apiKey: process.env.ARTHUR_API_KEY,
  baseUrl: process.env.ARTHUR_API_BASE,
});

// Example: PII blocking middleware
const arthurPIIBlocking = createArthurPIIBlockingMiddleware({
  taskId: process.env.ARTHUR_TASK_ID!,
  apiKey: process.env.ARTHUR_API_KEY,
  baseUrl: process.env.ARTHUR_API_BASE,
  blockMessage: "Your message may contain sensitive data - sending message failed",
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // 'chat-model': wrapLanguageModel({
        //   model: xai('grok-2-vision-1212'),
        //   middleware: arthurValidation,
        // }),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: [extractReasoningMiddleware({ tagName: 'think' }), arthurValidation],
        }),
        'title-model': wrapLanguageModel({
          model: xai('grok-2-1212'),
          middleware: arthurValidation,
        }),
        'artifact-model': wrapLanguageModel({
          model: xai('grok-2-1212'),
          middleware: arthurValidation,
        }),
        
        'chat-model': wrapLanguageModel({
          model: xai('grok-2-vision-1212'),
          middleware: arthurPIIBlocking,
        }),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
