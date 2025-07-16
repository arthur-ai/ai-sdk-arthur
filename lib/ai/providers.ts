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
import { arthurGuardrails } from './middleware/arthur-guardrails';

const useGuardrails = process.env.ARTHUR_USE_GUARDRAILS === 'true';

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
        // Arthur guardrails middleware example
        'chat-model': wrapLanguageModel({
          model: xai('grok-2-vision-1212'),
          middleware: useGuardrails ? arthurGuardrails : arthurValidation,
        }),

        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: [extractReasoningMiddleware({ tagName: 'think' }), useGuardrails ? arthurGuardrails : arthurValidation],
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
