'use client';

import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import type { Attachment, Message } from 'ai';
import { DocumentPreview } from './document-preview';
import { Weather } from './weather';
import { DialogTrigger , DialogContent, DialogTitle , Dialog } from '../ui/dialog';
import { useWeatherStore } from '../stores/weatherStore';
import { useEmailStore } from '../stores/emailStore';
import { useUiVisiableStore } from '../stores/uiVisiableStore';
const JSONDialog = ({ result }: { result: any }) => {
  return (
    <Dialog>
      <DialogTrigger className="self-start px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded-md">
        View Full
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogTitle>JSON Result</DialogTitle>
        <div className="overflow-y-auto max-h-[calc(80vh-4rem)]">
          <pre className="text-sm text-muted-foreground whitespace-pre-wrap break-words w-full">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export function MiddleSection({ messages }: { messages: Message[] }) {
  const showWeatherUI = useWeatherStore((state) => state.showWeatherUI);
  const setShowWeatherUI = useWeatherStore((state) => state.setShowWeatherUI);
  const showEmailUI = useEmailStore((state) => state.showEmailUI);
  const setShowEmailUI = useEmailStore((state) => state.setShowEmailUI);
  const setSelectedEmail = useEmailStore((state) => state.setSelectedEmail);
  const visiableUIs = useUiVisiableStore((state) => state.visiableUIs);
  const removeVisiableUI = useUiVisiableStore((state) => state.removeVisiableUI);
  const toolResults = messages
    .filter(message => message.role === 'assistant' && message.toolInvocations?.length && message.toolInvocations.length > 0)
    .flatMap(message => message.toolInvocations?.filter(tool => tool.state === 'result') || []);

  const shouldShow = (toolName: string, toolResultId: string) => {
    console.log('toolName', toolName, 'toolResultId', toolResultId, 'visiableUIs', visiableUIs);
    if (visiableUIs.has(toolResultId)) return true;
    return false;
  };

  const visibleResults = toolResults.filter(result => shouldShow(result.toolName, result.result.toolResultId));
  
  if (visibleResults.length === 0) {
    return (
      <div className="flex flex-col h-full flex-1">
        <div className="flex-1 bg-white overflow-y-auto">
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No active content
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="p-4 grid gap-4">
          {visibleResults.map((toolResult, index) => (
            <div key={`${toolResult.toolName}-${index}`}>
              {toolResult.toolName === 'getWeather' ? (
                <Weather 
                  weatherAtLocation={toolResult.result} 
                  onClose={() => setShowWeatherUI(false)}
                />
              ) : toolResult.toolName === 'createDocument' ? (
                <DocumentPreview
                  isReadonly={true}
                  result={toolResult.result}
                />
              ) : toolResult.toolName === 'search_messages' ? (
                <EmailList
                  toolResultId={toolResult.result.toolResultId}
                  emails={toolResult.result.data}
                  onClose={() => {
                    setShowEmailUI(false);
                    removeVisiableUI(toolResult.result.toolResultId);
                  }}
                  onSelect={(email) => setSelectedEmail(email)}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <pre className="text-sm text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                    {JSON.stringify(toolResult.result, null, 2)}
                  </pre>
                  <JSONDialog result={toolResult.result} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
