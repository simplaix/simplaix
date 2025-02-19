'use client';

import { useEffect } from 'react';

import { JiraTicketData } from '../types/ticket';

interface JiraTicketStreamHandlerProps {
  streamingData: any;
  setCreatedTickets: React.Dispatch<
    React.SetStateAction<JiraTicketData[] | undefined>
  >;
  setIsTicketsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function JiraTicketStreamHandler({
  streamingData,
  setCreatedTickets,
  setIsTicketsVisible,
}: JiraTicketStreamHandlerProps) {
  useEffect(() => {
    if (!streamingData) return;
    const createdTickets: JiraTicketData[] = [];
    const handleStream = async () => {
      for await (const chunk of streamingData) {
        if (chunk.type === 'jiraTickets') {
          setIsTicketsVisible(true);
          createdTickets.push(chunk.content);
        }
      }
      setCreatedTickets(createdTickets);
    };

    handleStream();
  }, [streamingData, setCreatedTickets, setIsTicketsVisible]);

  return null;
}
