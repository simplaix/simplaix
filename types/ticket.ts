export interface JiraTicketData {
  id: string;
  title: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee?: string;
  type?: 'TASK' | 'BUG' | 'FEATURE' | 'STORY';
  complete?: number;
  area?: string;
  iteration?: string;
}
