'use client';

import type { Attachment, Message } from 'ai';
import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowSize } from 'usehooks-ts';

import { ChatHeader } from '@/components/base/chat-header';
import type { Vote } from '@/lib/db/schema';
import { fetcher, generateUUID } from '@/lib/utils';
import { create } from 'zustand'
import { Block } from './block';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useBlockSelector } from '@/hooks/use-block';
import { toast } from 'sonner';
import { MiddleSection } from './middle-section';
import { useWeatherStore } from '../stores/weatherStore';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { width: windowWidth } = useWindowSize();
  const [showMiddleSection, setShowMiddleSection] = useState(false);

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    reload,
  } = useChat({
    id,
    body: { id, selectedChatModel: selectedChatModel },
    initialMessages,
    experimental_throttle: 100,
    sendExtraMessageFields: true,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: (error) => {
      toast.error('An error occured, please try again!');
    },
  });

  const { data: votes } = useSWR<Array<Vote>>(
    `/api/vote?chatId=${id}`,
    fetcher,
  );

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const isBlockVisible = useBlockSelector((state) => state.isVisible);

  const showWeatherUI = useWeatherStore((state) => state.showWeatherUI);
  // Check if any message has tool invocations
  useEffect(() => {
    const hasToolInvocations = messages.some(
      message => message.role === 'assistant' && 
      message.toolInvocations && 
      message.toolInvocations.length > 0
    );
    setShowMiddleSection(hasToolInvocations);
  }, [messages]);

  return (
    <>
      <div className="h-dvh flex">
        <AnimatePresence>
          {showMiddleSection && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ 
                width: '100%',
                opacity: 1 
              }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 100,
                damping: 20,
                duration: 0.1
              }}
              className="h-dvh border-r"
            >
              <MiddleSection
               messages={messages}
               />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-col min-w-[600px] h-dvh bg-background"
          style={{
            width: showMiddleSection ? 
              windowWidth > 768 ? '40%' : '0%' : 
              '100%',
            maxWidth: showMiddleSection ? '700px' : '100%'
          }}

        >
          <ChatHeader
            chatId={id}
            selectedModelId={selectedChatModel}
            selectedVisibilityType={selectedVisibilityType}
            isReadonly={isReadonly}
          />

          <Messages
            chatId={id}
            isLoading={isLoading}
            votes={votes}
            messages={messages}
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            isBlockVisible={isBlockVisible}
          />

          <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
            {!isReadonly && (
              <MultimodalInput
                chatId={id}
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
            )}
          </form>
        </motion.div>

        <Block
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          append={append}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          votes={votes}
          isReadonly={isReadonly}
        />
      </div>
    </>
  );
}
