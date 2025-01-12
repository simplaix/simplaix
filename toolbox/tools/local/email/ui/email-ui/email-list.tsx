// components/email-ui/email-list.tsx
import { X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';

import { EmailCard } from './email-card';
import { MailDisplay } from './email-display';


interface EmailListProps {
  emails: EmailResult[];
  onSelect?: (email: EmailResult) => void;
  selectedId?: string;
  onClose: () => void;
}

export function EmailList({
  emails,
  onSelect,
  selectedId,
  onClose,
}: EmailListProps) {
  const [selectedMail, setSelectedMail] = useState<EmailResult | null>(null);

  return (
    <div className={cn(
      "relative flex bg-white rounded-lg shadow-lg p-6 mx-auto gap-6 min-h-[600px]",
      selectedMail ? "max-w-5xl" : "max-w-2xl"
    )}>
      <div className={selectedMail ? "w-1/2" : "w-full"}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Email Search Results
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="flex flex-col gap-2">
            {emails.map((email) => (
              <EmailCard
                key={email.id}
                email={email}
                isSelected={selectedId === email.id}
                onSelect={(email) => onSelect?.(email)}
                onMailDisplay={setSelectedMail}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {selectedMail && (
        <div className="w-1/2 border rounded-lg">
          <MailDisplay mail={selectedMail} />
        </div>
      )}
    </div>
  );
}
