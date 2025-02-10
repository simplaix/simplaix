'use client';

import { Attachment, ToolInvocation } from 'ai';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { Dispatch, ReactNode, SetStateAction } from 'react';

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { UICanvas } from './canvas';
import { DocumentToolCall, DocumentToolResult } from './document';
import { SimplaixIcon } from './icons';
import { Markdown } from './markdown';
import { PreviewAttachment } from './preview-attachment';
import { Weather } from './weather';

export const Message = ({
  role,
  content,
  toolInvocations,
  attachments,
  canvas,
  setCanvas,
  // setDraftData,
  // setCreatedTickets,
}: {
  role: string;
  content: string | ReactNode;
  toolInvocations: Array<ToolInvocation> | undefined;
  attachments?: Array<Attachment>;
  canvas: UICanvas | null;
  setCanvas: Dispatch<SetStateAction<UICanvas | null>>;
  // setDraftData: Dispatch<SetStateAction<DraftData | undefined>>;
  // setCreatedTickets: Dispatch<SetStateAction<JiraTicketData[] | undefined>>;
}) => {
  // This will load the draft data and tickets into the state
  // // Handle draft data updates
  // useEffect(() => {
  //   if (toolInvocations) {
  //     const draftTool = toolInvocations.find(
  //       tool => tool.toolName === 'createDraft' && tool.state === 'result'
  //     );
  //     if (draftTool && 'result' in draftTool) {
  //       setDraftData(draftTool.result);
  //     }
  //   }
  // }, [toolInvocations, setDraftData]);

  // useEffect(() => {
  //   if (toolInvocations) {
  //     const ticketTool = toolInvocations.find(
  //       tool => tool.toolName === 'createJiraTickets' && tool.state === 'result'
  //     );

  //     if (ticketTool && 'result' in ticketTool) {
  //       console.log('ticketTool setting data', ticketTool);
  //       setCreatedTickets(ticketTool.result);
  //     }
  //   }
  // }, [toolInvocations, setCreatedTickets]);

  return (
    <motion.div
      className="w-full mx-auto px-4 group/message break-words"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-5 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-full group-data-[role=user]/message:py-3.5 rounded-xl overflow-hidden break-words',
          {
            'group-data-[role=user]/message:bg-muted': !canvas,
            'group-data-[role=user]/message:bg-zinc-300 dark:group-data-[role=user]/message:bg-zinc-800':
              canvas,
          }
        )}
      >
        {role === 'assistant' && (
          <div className="size-8 flex items-center rounded-full justify-center shrink-0">
            <SimplaixIcon size={26} />
          </div>
        )}
        <div className="flex flex-col gap-2 w-full overflow-hidden break-words">
          {content && (
            <div className="flex flex-col gap-4 overflow-x-auto break-words whitespace-pre-wrap w-full">
              <Markdown>{content as string}</Markdown>
            </div>
          )}

          {toolInvocations && toolInvocations.length > 0 && (
            <div className="flex flex-col gap-4">
              {toolInvocations.map((toolInvocation) => {
                const { toolName, toolCallId, state, args } = toolInvocation;

                if (state === 'result') {
                  const { result } = toolInvocation;

                  if (toolName === 'createDraft') {
                    return (
                      <div
                        key={toolCallId}
                        className="text-sm text-muted-foreground"
                      >
                        Draft created: {result.subject}
                      </div>
                    );
                  }

                  if (toolName === 'askForConfirmation') {
                  }
                  if (toolName === 'joinData') {
                    return (
                      <div
                        key={toolCallId}
                        className="text-sm text-muted-foreground"
                      >
                        Data joined: {result.data}
                      </div>
                    );
                  }
                  if (toolName === 'replaceDataset') {
                    return (
                      <div
                        key={toolCallId}
                        className="text-sm text-muted-foreground"
                      >
                        Data replaced: {result.data}
                      </div>
                    );
                  }

                  if (toolName === 'createJiraTickets') {
                    return (
                      <div
                        key={toolCallId}
                        className="text-sm text-muted-foreground"
                      >
                        Ticket created: {result.id}
                      </div>
                    );
                  }

                  return (
                    <div key={toolCallId}>
                      {toolName === 'getWeather' ? (
                        <Weather weatherAtLocation={result} />
                      ) : toolName === 'createDocument' ? (
                        <DocumentToolResult
                          type="create"
                          result={result}
                          canvas={canvas}
                          setCanvas={setCanvas}
                        />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolResult
                          type="update"
                          result={result}
                          canvas={canvas}
                          setCanvas={setCanvas}
                        />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolResult
                          type="request-suggestions"
                          result={result}
                          canvas={canvas}
                          setCanvas={setCanvas}
                        />
                      ) : (
                        <div className="flex flex-col gap-2">
                          <pre className="text-sm text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words max-w-full max-h-[10em] overflow-y-hidden">
                            {JSON.stringify(result, null, 2)}
                          </pre>
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
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={toolCallId}
                      className={cx({
                        skeleton: ['getWeather'].includes(toolName),
                      })}
                    >
                      {toolName === 'getWeather' ? (
                        <Weather />
                      ) : toolName === 'createDocument' ? (
                        <DocumentToolCall type="create" args={args} />
                      ) : toolName === 'updateDocument' ? (
                        <DocumentToolCall type="update" args={args} />
                      ) : toolName === 'requestSuggestions' ? (
                        <DocumentToolCall
                          type="request-suggestions"
                          args={args}
                        />
                      ) : null}
                    </div>
                  );
                }
              })}
            </div>
          )}

          {attachments && (
            <div className="flex flex-row gap-2">
              {attachments.map((attachment) => (
                <PreviewAttachment
                  key={attachment.url}
                  attachment={attachment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
