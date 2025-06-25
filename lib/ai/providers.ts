import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { qwen } from 'qwen-ai-provider';
import { portdex } from './portdex';

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
        'chat-model': qwen('qwen-plus-latest'),
        'chat-model-reasoning': wrapLanguageModel({
          model: portdex('thinker'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': portdex('maker'),
        'artifact-model': portdex('maker'),
      },
      // imageModels: {
      //   'small-model': qwen.('qwen-vl-max'),
      // },
    });
