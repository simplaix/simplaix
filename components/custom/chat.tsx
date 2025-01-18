'use client';

import { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { ChatHeader } from '@/components/custom/chat-header';
import { Message as PreviewMessage } from '@/components/custom/message';
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom';
import { JiraTicketStreamHandler } from '@/components/jira-ui/jira-ticket-stream-handler';
import { MiddleSection } from '@/components/middle-section';
import { DraftData } from '@/toolbox/tools/local/email/types/draft';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';
import { EmailStreamHandler } from '@/toolbox/tools/local/email/ui/email-ui/email-stream-handler';
import { JiraTicketData } from '@/types/ticket';

import { Canvas, UICanvas } from './canvas';
import { CanvasStreamHandler } from './canvas-stream-handler';
import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';
import { DraftStreamHandler } from '../../toolbox/tools/local/email/ui/draft-ui/draft-stream-handler';

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    data: streamingData,
  } = useChat({
    body: { id, modelId: selectedModelId },
    initialMessages,
    // maxToolRoundtrips: 1, 
    onFinish: () => {
      window.history.replaceState({}, '', `/chat/${id}`);
    },
  });

  const [canvas, setCanvas] = useState<UICanvas | null>(null);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  const [draftData, setDraftData] = useState<DraftData | undefined>();
  const [isDraftVisible, setIsDraftVisible] = useState(false);

  const [createdTickets, setCreatedTickets] = useState<
    JiraTicketData[] | undefined
  >([]);
  const [isTicketsVisible, setIsTicketsVisible] = useState(false);

  const [emails, setEmails] = useState<EmailResult[]>();
  const [isEmailListVisible, setIsEmailListVisible] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string>();

  // Handler to close draft
  const handleCloseDraft = () => {
    setIsDraftVisible(false);
  };

  // Handler to close tickets
  const handleCloseTickets = () => {
    setIsTicketsVisible(false);
  };

  // Add this handler near your other handlers
  const handleCloseEmailList = () => {
    setIsEmailListVisible(false);
  };

  // Effect to show draft when new data arrives
  useEffect(() => {
    // console.log('draftData', draftData);
    if (draftData) {
      setIsDraftVisible(true);
    }
  }, [draftData]);

  // Add this effect alongside the draft effect
  useEffect(() => {
    // console.log('createdTickets', createdTickets);
    if (createdTickets && createdTickets.length > 0) {
      setIsTicketsVisible(true);
    }
  }, [createdTickets]);

  return (
    <div className="flex h-dvh">
      {/* Middle white area */}

      <MiddleSection
        draftData={draftData}
        isDraftVisible={isDraftVisible}
        onDraftClose={handleCloseDraft}
        tickets={createdTickets}
        isTicketsVisible={isTicketsVisible}
        onTicketsClose={handleCloseTickets}
        emails={emails}
        isEmailListVisible={isEmailListVisible}
        selectedEmailId={selectedEmailId}
        onEmailSelect={(email) => setSelectedEmailId(email?.id)}
        onEmailListClose={handleCloseEmailList}
        setIsDraftVisible={setIsDraftVisible}
        setIsTicketsVisible={setIsTicketsVisible}
        setIsEmailListVisible={setIsEmailListVisible}
      />

      {/* Chat UI moved to right side */}
      <div className="w-[400px] flex flex-col min-w-0 bg-background border-l">
        <ChatHeader selectedModelId={selectedModelId} />
        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll"
        >
          {messages.length === 0 && <Overview />}

          {messages.map((message) => (
            <PreviewMessage
              key={message.id}
              role={message.role}
              content={message.content}
              attachments={message.experimental_attachments}
              toolInvocations={message.toolInvocations}
              canvas={canvas}
              setCanvas={setCanvas}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full">
          <MultimodalInput
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>

      <AnimatePresence>
        {canvas && canvas.isVisible && (
          <Canvas
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append}
            canvas={canvas}
            setCanvas={setCanvas}
            messages={messages}
            setMessages={setMessages}
          />
        )}
      </AnimatePresence>

      <CanvasStreamHandler
        streamingData={streamingData}
        setCanvas={setCanvas}
      />

      <DraftStreamHandler
        streamingData={streamingData}
        setDraftData={setDraftData}
        setIsDraftVisible={setIsDraftVisible}
      />

      <JiraTicketStreamHandler
        streamingData={streamingData}
        setCreatedTickets={setCreatedTickets}
        setIsTicketsVisible={setIsTicketsVisible}
      />

      <EmailStreamHandler
        streamingData={streamingData}
        setEmails={setEmails}
        setIsEmailListVisible={setIsEmailListVisible}
      />
    </div>
  );
}
