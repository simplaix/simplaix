'use client';

import { useUiVisiableStore } from '@/toolbox/stores/uiVisiableStore';
import { cx } from 'class-variance-authority';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JiraTicketData } from '../types/ticket';

import { TicketCard } from './ticket-card';
import { UIContainer } from '@/components/base/ui-container';
import { v4 as uuidv4 } from 'uuid';
import { ToolInvocation } from 'ai';

export interface JiraTicketsProps {
  toolInvocation: ToolInvocation;
  isInline?: boolean;
  addToolResult: ({toolCallId, result}: {toolCallId: string; result: any}) => void;
}

export function InlineJiraTickets({
  tickets,
  toolCallId
}: {
  tickets: JiraTicketData[];
  toolCallId: string;
}) {
  if (!tickets.length) return null;
  const showJiraUI = useUiVisiableStore((state) => state.visiableUIs.has(toolCallId));
  const addVisiableUI = useUiVisiableStore((state) => state.addVisiableUI);
  return (
    <Button
      onClick={() => {
        addVisiableUI(toolCallId);
      }}
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

export function JiraTickets({
  toolInvocation,
  isInline = false,
  addToolResult = () => {},
}: JiraTicketsProps) {
  const { toolName, toolCallId, state, args } = toolInvocation;

  const tickets = args.requests;
  const removeVisiableUI = useUiVisiableStore((state) => state.removeVisiableUI);

  const handleClose = () => {
    removeVisiableUI(toolCallId);
  }

  const handleSave = () => {
    addToolResult({
      toolCallId: toolCallId,
      result: 'User has confirmed the tickets created are correct, now call save_jira_issues to save these tickets to Jira.',
    });
  }

  if (isInline) {
    return (
      <InlineJiraTickets
        tickets={tickets}
        toolCallId={toolCallId}
      />
    );
  }

  return (
    <UIContainer title={`New Jira Tickets - ${tickets.length} tickets`} onClose={handleClose}>

      <ScrollArea className="h-[600px] p-6">
        <div className="space-y-4">
          {tickets.map((ticket: JiraTicketData, index: number) => (
            <TicketCard key={uuidv4()} ticket={ticket} index={index + 1}/>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <Button className="items-center" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="items-center" onClick={handleSave}>
            Save to Jira
          </Button>
        </div>
      </div>
    </UIContainer>
  );
}
