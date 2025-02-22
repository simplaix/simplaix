import { Weather } from '@/components/base/weather';
import { DocumentPreview } from '@/components/base/document-preview';
import { DocumentToolResult } from '@/components/base/document';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import { JiraTickets, JiraTicketsProps} from '@/toolbox/tools/local/jira/ui/jira-tickets';
import { DraftInputs } from '@/toolbox/tools/local/email/ui/draft-ui/draft-inputs';

export const uiRegistry: Record<string, React.ComponentType<any>> = {
  'getWeather': Weather,
  'createDocument': DocumentPreview,
  'updateDocument': DocumentToolResult,
  'requestSuggestions': DocumentToolResult,
  'search_messages': EmailList,
  'create_jira_issues': JiraTickets,
  'create_draft': DraftInputs,
}

export const mapUIProps = (toolName: string, toolResultId: string) => {
  return {
    toolName,
    toolResultId,
  }
}