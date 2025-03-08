import { Weather } from '@/components/base/weather';
import { DocumentPreview } from '@/components/base/document-preview';
import { DocumentToolResult } from '@/components/base/document';
import { EmailList } from '@/toolbox/tools/local/email/ui/email-ui/email-list';
import { JiraTickets} from '@/toolbox/tools/local/jira/ui/jira-tickets';
import { DraftInputs } from '@/toolbox/tools/local/email/ui/draft-ui/draft-inputs';

type ClientTools = {
  'create_jira_issues': React.ComponentType<any>;
  'send_message': React.ComponentType<any>;
  'reply_message': React.ComponentType<any>;
};

type ServerTools = {
  'search_messages': React.ComponentType<any>;
  'getWeather': React.ComponentType<any>;
  'createDocument': React.ComponentType<any>;
  'updateDocument': React.ComponentType<any>;
  'requestSuggestions': React.ComponentType<any>;
};

export type ClientToolName = keyof ClientTools;
export type ServerToolName = keyof ServerTools;

export type UIRegistry = {
  client_tools: ClientTools;
  server_tools: ServerTools;
}

export const uiRegistry: UIRegistry = {
  client_tools: {
    'create_jira_issues': JiraTickets,
    'send_message': DraftInputs,
    'reply_message': DraftInputs,
  },
  server_tools: {
    'search_messages': EmailList,
    'getWeather': Weather,
    'createDocument': DocumentPreview,
    'updateDocument': DocumentToolResult,
    'requestSuggestions': DocumentToolResult,
  }
};
