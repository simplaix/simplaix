'use client';

import { useUiVisiableStore } from '@/toolbox/stores/uiVisiableStore';
import { cx } from 'class-variance-authority';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JiraTicketData } from '../types/ticket';

import { TicketCard } from './ticket-card';
import { TicketsHeader } from './tickets-header';
import { UIContainer } from '@/components/base/ui-container';
import { v4 as uuidv4 } from 'uuid';

export function InlineJiraTickets({
  tickets,
  toolCallId,
  onClick,
}: {
  tickets: JiraTicketData[];
  toolCallId: string;
  onClick?: () => void;
}) {
  if (!tickets.length) return null;
  const showJiraUI = useUiVisiableStore((state) => state.visiableUIs.has(toolCallId));

  return (
    <Button
      onClick={onClick}
      className={cx(
       'flex flex-row gap-4 rounded-2xl p-4 bg-gray-800 hover:bg-gray-100 max-w-[300px] h-auto border border-gray-200 text-black'
      )}
    >
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900">
          Drafting {tickets.length} Jira tickets
        </div>
        <div className="text-xs text-gray-500">
          {showJiraUI ? 'Viewing...' : 'Click to view details'}
        </div>
      </div>
    </Button>
  );
}

export function JiraTicketInputs({
  toolCallId,
  tickets,
  onClose,
  isInline = false,
  addToolResult,
}: {
  toolCallId: string;
  tickets: JiraTicketData[];
  onClose: () => void;
  isInline?: boolean;
  addToolResult: ({toolCallId, result}: {toolCallId: string; result: any}) => void;
}) {
  const addVisiableUI = useUiVisiableStore((state) => state.addVisiableUI);

  const handleSave = async () => {
    try {
      console.log('tickets', tickets);
      onClose();
    } catch (error) {
      console.error('Failed to save tickets:', error);
    }
  };

  if (isInline) {
    return (
      <InlineJiraTickets
        tickets={tickets}
        toolCallId={toolCallId}
        onClick={() => {
          addVisiableUI(toolCallId);
        }}
      />
    );
  }

  return (
    <UIContainer title={`New Jira Tickets - ${tickets.length} tickets`} onClose={onClose}>

      <ScrollArea className="h-[600px] p-6">
        <div className="space-y-4">
          {tickets.map((ticket, index) => (
            <TicketCard key={uuidv4()} ticket={ticket} index={index + 1}/>
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
          <Button className="items-center" onClick={() => {
            addToolResult({
              toolCallId: toolCallId,
              result: 'Call save_jira_issues to save these tickets to Jira. This is a confirmation from human.',
            });
          }}>
            Save to Jira
          </Button>
        </div>
      </div>
    </UIContainer>
  );
}
