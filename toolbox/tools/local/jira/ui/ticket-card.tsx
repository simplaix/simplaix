import {
  Circle,
  AlertCircle,
  CheckCircle2,
  ListTodo,
  Bug,
  Lightbulb,
  BookMarked,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { JiraTicketData } from '../types/ticket';

const statusIcons = {
  TODO: Circle,
  IN_PROGRESS: AlertCircle,
  DONE: CheckCircle2,
};

const typeIcons = {
  Task: ListTodo,
  Bug: Bug,
  Story: BookMarked,
};

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

interface TicketCardProps {
  ticket: JiraTicketData;
  index: number;
}

export function TicketCard({ ticket, index }: TicketCardProps) {
  const StatusIcon = statusIcons['TODO'];
  const TypeIcon = typeIcons[ticket.type || 'Task'];

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <TypeIcon className="size-5 text-gray-500" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-gray-500">{ticket.type}-{index}</code>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <StatusIcon className="size-3" />
                TODO
              </Badge>
            </div>
          </div>

          <h3 className="text-base font-medium text-gray-900">
            {ticket.summary}
          </h3>


          {/* <div className="flex items-center justify-between">
            {ticket.assignee && (
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs text-gray-600">
                    {ticket.assignee[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{ticket.assignee}</span>
              </div>
            )}
          </div> */}
        </div>
      </div>
    </Card>
  );
}
