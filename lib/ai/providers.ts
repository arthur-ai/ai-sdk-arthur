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
import { arthurValidation } from './middleware/arthur-validation';
import { arthurPIIBlocking } from './middleware/arthur-pii-blocking';

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
        // Arthur validation middleware example
        'chat-model': wrapLanguageModel({
          model: xai('grok-2-vision-1212'),
          // Use arthurValidation for observational logging (recommended for debugging)
          // middleware: arthurValidation,
          // Use arthurPIIBlocking for PII blocking with response logging
          middleware: arthurPIIBlocking,
        }),

        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: [extractReasoningMiddleware({ tagName: 'think' }), arthurPIIBlocking],
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': wrapLanguageModel({
          model: xai('grok-2-1212'),
          middleware: arthurValidation,
        }),
        
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
