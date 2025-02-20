import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { jsonSchema, DataStreamWriter } from 'ai';

import { ToolDefinition, ToolSetConfig } from './types';
import { generateUUID } from '@/lib/utils';


function parseResult(result: any) {
  const parsedArray = result.content; // TODO: Currently mcp call only returns array of objects, according to this issue: https://github.com/modelcontextprotocol/specification/issues/97
  const resultArray = parsedArray.map((item: any) => {
    return JSON.parse(item.text);
  });
  return resultArray;
}

export function mapToolToToolset(
  tool: any,
  serverName: string,
  client: Client,
  config: ToolSetConfig,
  streamingData: DataStreamWriter
): ToolDefinition {
  let toolName = tool.name;

  if (toolName !== serverName) {
    toolName = `server_tool_${toolName}`;
  }

  if (toolName === 'server_tool_create_jira_issues' || toolName === 'server_tool_create_draft') {
    return {
      description: tool.description || '',
      parameters: jsonSchema(tool.inputSchema) as any,
    };
  }

  return {
    description: tool.description || '',
    parameters: jsonSchema(tool.inputSchema) as any,
    execute: async (args: any) => {
      console.log('calling server side tool', toolName, args);
      try {
        const resultPromise = (async () => {
          const toolResultId = generateUUID();
          const result = await client.callTool({
            name: tool.name,
            arguments: args,
          });
          if (result.isError) {
            console.error('Error in calling tool from server', toolName, result.content);
            return (result.content as { text: string }[])[0].text;
          }
          const parsedResult = parseResult(result);

          streamingData.writeData({
            type: `${toolName}_result`,
            content: parsedResult,
          });
          return {toolResultId, data:parsedResult};
        })();

        if (config.onCallTool) {
          config.onCallTool(serverName, toolName, args, resultPromise as Promise<string>);
        }

        return resultPromise;
      } catch (error) {
        console.error('Error in running tool', toolName, error);
        throw new Error(
          `Error in running tool ${toolName}: ${(error as Error).message}`
        );
      }
    },
  };
}
