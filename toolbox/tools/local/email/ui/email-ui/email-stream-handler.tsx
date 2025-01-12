'use client';

import { useEffect } from 'react';

import { EmailResult } from '@/toolbox/tools/local/email/types/email';

interface EmailStreamHandlerProps {
  streamingData: any;
  setEmails: React.Dispatch<React.SetStateAction<EmailResult[] | undefined>>;
  setIsEmailListVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EmailStreamHandler({
  streamingData,
  setEmails,
  setIsEmailListVisible,
}: EmailStreamHandlerProps) {
  useEffect(() => {
    if (!streamingData) return;

    const handleStream = async () => {
      for await (const chunk of streamingData) {
        console.log('chunk', chunk);
        if (chunk.type.includes('search_messages')) {
          setEmails(chunk.content);
          setIsEmailListVisible(true);
        }
      }
    };

    handleStream();
  }, [streamingData, setEmails, setIsEmailListVisible]);

  return null;
}
