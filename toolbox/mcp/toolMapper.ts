import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { jsonSchema, StreamData } from 'ai';

import { ToolDefinition, ToolSetConfig } from './types';


function parseResult(result: any) {
  const parsedArray = result.content;
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
  streamingData: StreamData
): ToolDefinition {
  let toolName = tool.name;
  if (toolName !== serverName) {
    toolName = `simplaix_${toolName}`;
  }

  return {
    description: tool.description || '',
    parameters: jsonSchema(tool.inputSchema) as any,
    execute: async (args: any) => {
      console.log('calling tool', toolName, args);
      try {
        const resultPromise = (async () => {
          const result = await client.callTool({
            name: tool.name,
            arguments: args,
          });
          if (result.isError) {
            console.error('Error in calling tool from server', toolName, result.content);
            return (result.content as { text: string }[])[0].text;
          }
          const parsedResult = parseResult(result);

          // console.log('parsedResult', parsedResult);

          streamingData.append({
            type: `${toolName}_result`,
            content: parsedResult,
          });
          return parsedResult;
        })();

        if (config.onCallTool) {
          config.onCallTool(serverName, toolName, args, resultPromise);
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
