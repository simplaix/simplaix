'use client';

import { useEffect } from 'react';

import { DraftData } from '@/toolbox/tools/local/email/types/draft';

export function DraftStreamHandler({
  streamingData,
  setDraftData,
  setIsDraftVisible,
}: {
  streamingData: any;
  setDraftData: (data: DraftData | undefined) => void;
  setIsDraftVisible: (show: boolean) => void;
}) {
  useEffect(() => {
    if (!streamingData) return;

    const handleStream = async () => {
      for await (const chunk of streamingData) {
        console.log('chunk', chunk);
        if (chunk.type.includes('draft')) {
          const draftData = chunk.content[0];
          setDraftData(draftData);
          setIsDraftVisible(true);
        }
      }
    };

    handleStream();
  }, [streamingData, setDraftData, setIsDraftVisible]);

  return null;
}
