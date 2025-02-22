import { Weather } from '@/components/base/weather';
import { DocumentPreview } from '@/components/base/document-preview';
import { DocumentToolResult } from '@/components/base/document';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import { JiraTickets} from '@/toolbox/tools/local/jira/ui/jira-tickets';
import { DraftInputs } from '@/toolbox/tools/local/email/ui/draft-ui/draft-inputs';

type ClientTools = {
  'getWeather': React.ComponentType<any>;
  'createDocument': React.ComponentType<any>;
  'updateDocument': React.ComponentType<any>;
  'requestSuggestions': React.ComponentType<any>;
  'create_jira_issues': React.ComponentType<any>;
  'create_draft': React.ComponentType<any>;
};

type ServerTools = {
  'search_messages': React.ComponentType<any>;
};

export type ClientToolName = keyof ClientTools;
export type ServerToolName = keyof ServerTools;

export type UIRegistry = {
  client_tools: ClientTools;
  server_tools: ServerTools;
}

export const uiRegistry: UIRegistry = {
  client_tools: {
    'getWeather': Weather,
    'createDocument': DocumentPreview,
    'updateDocument': DocumentToolResult,
    'requestSuggestions': DocumentToolResult,
    'create_jira_issues': JiraTickets,
    'create_draft': DraftInputs,
  },
  server_tools: {
    'search_messages': EmailList,
  }
};

export const mapUIProps = (toolName: string, toolResultId: string) => {
  return {
    toolName,
    toolResultId,
  }
}