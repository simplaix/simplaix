import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  if (apiIdentifier.includes('claude')) {
    return wrapLanguageModel({
      model: anthropic(apiIdentifier, {cacheControl: true}),
      middleware: customMiddleware,
    });
  }
  else {
    return wrapLanguageModel({
      model: openai(apiIdentifier),
      middleware: customMiddleware,
    });
  }
};
