'use client';

import { JiraTicketInputs } from '@/components/jira-ui/jira-ticket-inputs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DraftData } from '@/toolbox/tools/local/email/types/draft';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';
import { DraftInputs } from '@/toolbox/tools/local/email/ui/draft-ui/draft-inputs';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import { JiraTicketData } from '@/types/ticket';


import '@xyflow/react/dist/style.css';

export function MiddleSection({
  draftData,
  isDraftVisible,
  onDraftClose,
  tickets,
  isTicketsVisible,
  onTicketsClose,
  emails,
  isEmailListVisible,
  selectedEmailId,
  onEmailSelect,
  onEmailListClose,
  setIsDraftVisible,
  setIsTicketsVisible,
  setIsEmailListVisible,
}: {
  draftData?: DraftData;
  isDraftVisible: boolean;
  onDraftClose: () => void;
  tickets?: JiraTicketData[];
  isTicketsVisible: boolean;
  onTicketsClose: () => void;
  emails?: EmailResult[];
  isEmailListVisible: boolean;
  selectedEmailId?: string;
  onEmailSelect?: (email: EmailResult) => void;
  onEmailListClose: () => void;
  setIsDraftVisible: (visible: boolean) => void;
  setIsTicketsVisible: (visible: boolean) => void;
  setIsEmailListVisible: (visible: boolean) => void;
}) {
  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex-1 bg-white overflow-y-auto">
        {!draftData && !tickets && !emails && (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No active content
          </div>
        )}

        {draftData && isDraftVisible && (
          <DraftInputs
            draftData={draftData}
            onClose={onDraftClose}
          />
        )}

        {tickets && isTicketsVisible && (
          <JiraTicketInputs tickets={tickets} onClose={onTicketsClose} />
        )}

        {emails && isEmailListVisible && (
          <EmailList
            emails={emails}
            selectedId={selectedEmailId}
            onSelect={onEmailSelect}
            onClose={onEmailListClose}
          />
        )}
      </div>

      <div className="border-t border-gray-200">
        <Tabs defaultValue="none" className="h-10">
          <TabsList className="bg-gray-50 h-full">
            {draftData && !isDraftVisible && (
              <TabsTrigger
                value="draft"
                onClick={() => setIsDraftVisible(true)}
                className="flex items-center gap-2"
              >
                Draft
                <span
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDraftClose();
                  }}
                >
                  ×
                </span>
              </TabsTrigger>
            )}

            {tickets && tickets.length > 0 && !isTicketsVisible && (
              <TabsTrigger
                value="tickets"
                onClick={() => setIsTicketsVisible(true)}
                className="flex items-center gap-2"
              >
                Tickets
                <span
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTicketsClose();
                  }}
                >
                  ×
                </span>
              </TabsTrigger>
            )}

            {emails && !isEmailListVisible && (
              <TabsTrigger
                value="emails"
                onClick={() => setIsEmailListVisible(true)}
                className="flex items-center gap-2"
              >
                Emails
                <span
                  className="text-gray-400 hover:text-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmailListClose();
                  }}
                >
                  ×
                </span>
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
