'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import { blockDefinitions, BlockKind } from './block';
import { Suggestion } from '@/lib/db/schema';
import { initialBlockData, useBlock } from '@/hooks/use-block';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list'

export type DataStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind'
    | 'tool-result';
  content: string | Suggestion;
};

interface EmailData {
  id: string;
  subject: string;
  from: string;
  date: string;
  // ... other email properties
}

export function DataStreamHandler({ id }: { id: string }) {
  const { data: dataStream } = useChat({ id });
  const { block, setBlock, setMetadata } = useBlock();
  const lastProcessedIndex = useRef(-1);
  const [emailListOpen, setEmailListOpen] = useState(false);
  const [emailData, setEmailData] = useState<EmailData[] | null>(null);

  useEffect(() => {
    if (!dataStream?.length) return;

    const newDeltas = dataStream.slice(lastProcessedIndex.current + 1);
    lastProcessedIndex.current = dataStream.length - 1;

    (newDeltas as DataStreamDelta[]).forEach((delta: DataStreamDelta) => {
      const blockDefinition = blockDefinitions.find(
        (blockDefinition) => blockDefinition.kind === block.kind,
      );

      if (blockDefinition?.onStreamPart) {
        blockDefinition.onStreamPart({
          streamPart: delta,
          setBlock,
          setMetadata,
        });
      }

      setBlock((draftBlock) => {
        if (!draftBlock) {
          return { ...initialBlockData, status: 'streaming' };
        }

        switch (delta.type) {
          case 'id':
            return {
              ...draftBlock,
              documentId: delta.content as string,
              status: 'streaming',
            };

          case 'title':
            return {
              ...draftBlock,
              title: delta.content as string,
              status: 'streaming',
            };

          case 'kind':
            return {
              ...draftBlock,
              kind: delta.content as BlockKind,
              status: 'streaming',
            };

          case 'clear':
            return {
              ...draftBlock,
              content: '',
              status: 'streaming',
            };

          case 'finish':
            return {
              ...draftBlock,
              status: 'idle',
            };

          default:
            return draftBlock;
        }
      });
    });
  }, [dataStream, setBlock, setMetadata, block]);

  useEffect(() => {
    const emailItems = dataStream?.filter(item =>
      typeof item === 'object' &&
      item !== null &&
      'type' in item &&
      item.type === 'email' &&
      'data' in item
    );

    if (emailItems?.length) {
      setEmailData(emailItems.map(item => item.data as EmailData));
      setEmailListOpen(true);
    }
  }, [dataStream]);

  return (
    <>
      {emailData && (
        <EmailList
          emails={emailData}
          isExpanded={emailListOpen}
          onClose={() => setEmailListOpen(false)}
        />
      )}
    </>
  );
}
