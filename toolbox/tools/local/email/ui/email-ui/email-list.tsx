// components/email-ui/email-list.tsx

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';
import { useEmailStore } from '@/toolbox/stores/emailStore';
import { UIContainer } from '@/components/base/ui-container';

import { EmailCard } from './email-card';
import { MailDisplay } from './email-display';
import { cx } from 'class-variance-authority';
import { useUiVisiableStore } from '@/toolbox/stores/uiVisiableStore';

const UITitle = 'Email Search Results';
interface EmailListProps {
  emails: EmailResult[];
  toolResultId: string;
  selectedId?: string;
  isInline?: boolean;
  onClose: () => void;
}

export function InlineEmailList({
  emails,
  onClick,
  toolResultId,
}: {
  emails: EmailResult[];
  onClick?: () => void;
  toolResultId: string;
}) {
  if (!emails.length) return null;
  const showEmailUI = useUiVisiableStore((state) => state.visiableUIs.has(toolResultId));
  return (
    <Button
      onClick={onClick}
      className={cx(
        'flex flex-row gap-4 rounded-2xl p-4 bg-gray-100 hover:bg-gray-100 max-w-[300px] h-auto border border-gray-200 text-black'
      )}
    >
      <div className="flex flex-col"> 
        <div className="text-sm font-medium text-gray-900">
          {emails.length} emails found
        </div>
        <div className="text-xs text-gray-500">
          {showEmailUI ? 'Viewing...' : 'Click to view details'}
        </div>
      </div>
    </Button>
  );
}

export function EmailList({
  toolResultId,
  emails,
  isInline = false,
  onClose,
}: EmailListProps) {
  const selectedEmail = useEmailStore((state) => state.selectedEmail);
  const setSelectedEmail = useEmailStore((state) => state.setSelectedEmail);
  const addVisiableUI = useUiVisiableStore((state) => state.addVisiableUI);

  const onSelect = (email: EmailResult) => {
    setSelectedEmail(email);
    addVisiableUI(toolResultId);
  }

  if (isInline) {
    return (
      <InlineEmailList
        emails={emails}
        toolResultId={toolResultId}
        onClick={() => {
          addVisiableUI(toolResultId);
        }}
      />
    );
  }

  return (
    <UIContainer onClose={onClose} title={UITitle}>
      <div className="flex flex-row">
        <div className= {selectedEmail ? "w-1/2 flex flex-row" : "w-full"}>
          <ScrollArea>
            <div className="flex flex-col gap-2">
              {emails.map((email) => (
                <EmailCard
                  key={email.id}
                  email={email}
                  isSelected={selectedEmail?.id === email.id}
                  onSelect={(email) => onSelect?.(email)}
                  onMailDisplay={(email) => setSelectedEmail(email)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
        {selectedEmail && (
        <div className="w-1/2 border rounded-lg">
          <MailDisplay mail={selectedEmail} />
        </div>
      )}
      </div>
    </UIContainer>
  );
}
