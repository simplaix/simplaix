export interface JiraTicketData {
  id: string;
  summary: string;
  description: string;
  type?: 'Task' | 'Bug' | 'Story';
}
