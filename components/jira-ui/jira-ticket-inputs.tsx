'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveTickets } from '@/lib/devops/create_tickets';
import { JiraTicketData } from '@/types/ticket';

import { TicketCard } from './ticket-card';
import { TicketsHeader } from './tickets-header';

export function JiraTicketInputs({
  tickets,
  onClose,
}: {
  tickets: JiraTicketData[];
  onClose: () => void;
}) {
  const handleSave = async () => {
    try {
      const response = await saveTickets(tickets);
      console.log('Response:', response);
      onClose();
    } catch (error) {
      console.error('Failed to save tickets:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full mx-auto"
    >
      <TicketsHeader ticketCount={tickets.length} onClose={onClose} />

      <ScrollArea className="h-[600px] p-6">
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button className="items-center" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="items-center" onClick={handleSave}>
            Save to Jira
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
