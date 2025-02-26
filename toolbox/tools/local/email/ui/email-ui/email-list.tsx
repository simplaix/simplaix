// components/email-ui/email-list.tsx

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { EmailResult } from '@/toolbox/tools/local/email/types/email';
import { useEmailStore } from '@/toolbox/stores/emailStore';
import { UIContainer } from '@/components/base/ui-container';

import { EmailCard } from './email-card';
import { MailDisplay } from './email-display';
import { cx } from 'class-variance-authority';
import { useUiVisiableStore } from '@/toolbox/stores/uiVisiableStore';
import { ToolResult } from 'ai';

const UITitle = 'Email Search Results';
interface EmailListProps {
  toolResult: ToolResult<string, string, any>;
  selectedId?: string;
  isInline?: boolean;
  onClose: () => void;
}

export function InlineEmailList({
  toolResult,
  onClick,
}: {
  toolResult: ToolResult<string, string, any>;
  onClick?: () => void;
}) {
  console.log('toolResult from inline email list', toolResult);
  if (!toolResult || !toolResult.result) {
    return null;
  }
  const { result } = toolResult;
  const emails = result.data;
  const showEmailUI = useUiVisiableStore((state) => state.visiableUIs.has(result.toolResultId));
  if (!emails?.length) return null;
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
  toolResult,
  isInline = false,
  onClose,
}: EmailListProps) {
  const { result } = toolResult;
  const emails = result.data;
  const selectedEmail = useEmailStore((state) => state.selectedEmail);
  const setSelectedEmail = useEmailStore((state) => state.setSelectedEmail);
  const addVisiableUI = useUiVisiableStore((state) => state.addVisiableUI);

  const onSelect = (email: EmailResult) => {
    setSelectedEmail(email);
    addVisiableUI(result.toolResultId);
  }

  if (isInline) {
    return (
      <InlineEmailList
        toolResult={toolResult}
        onClick={() => {
          addVisiableUI(result.toolResultId);
        }}
      />
    );
  }

  return (
    <UIContainer onClose={onClose} title={UITitle}>
      <div className="flex flex-row">
        <div className= "flex flex-1 min-w-[200px]">
          <ScrollArea>
            <div className="flex flex-col gap-2">
              {emails?.map((email: EmailResult) => (
                <EmailCard
                  key={email.id}
                  email={email}
                  isSelected={selectedEmail?.id === email.id}
                  onSelect={(email) => onSelect?.(email)}
                  onMailDisplay={(email) => setSelectedEmail(email)}
                />
              )) || <div className="text-center text-gray-500">No emails found</div>}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
        {selectedEmail && (
        <div className="flex border rounded-lg flex-1">
          <MailDisplay mail={selectedEmail} />
        </div>
      )}
      </div>
    </UIContainer>
  );
}
