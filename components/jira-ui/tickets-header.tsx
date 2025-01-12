import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TicketsHeaderProps {
  ticketCount: number;
  onClose: () => void;
}

export function TicketsHeader({ ticketCount, onClose }: TicketsHeaderProps) {
  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Created Jira Tickets
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {ticketCount} ticket{ticketCount !== 1 ? 's' : ''} created
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100 rounded-full"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
