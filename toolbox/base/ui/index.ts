import { Weather } from '@/components/base/weather';
import { DocumentPreview } from '@/components/base/document-preview';
import { DocumentToolResult } from '@/components/base/document';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import { uiRegistry } from './registry';

export function registerUIs() {
  // Register default UI components
  uiRegistry.register('getWeather', Weather);
  uiRegistry.register('createDocument', DocumentPreview);
  uiRegistry.register('updateDocument', DocumentToolResult);
  uiRegistry.register('requestSuggestions', DocumentToolResult);
  uiRegistry.register('search_messages', EmailList);
}