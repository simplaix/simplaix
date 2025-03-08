import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { jsonSchema, DataStreamWriter, tool } from 'ai';

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

  const clientTools = config.mcpServers[serverName].clientTools;
  const serverTools = config.mcpServers[serverName].serverTools;

  console.log('clientTools', clientTools, 'serverTools', serverTools);
  if (clientTools.includes(toolName) && !serverTools.includes(toolName)) {
    return {
      description: tool.description || '',
      parameters: jsonSchema(tool.inputSchema) as any,
      callTool: async (args: any) => {
        return runMCPTool(tool, args, client, streamingData, config, serverName);
      }
    };
  }

  return {
    description: tool.description || '',
    parameters: jsonSchema(tool.inputSchema) as any,
    execute: async (args: any) => {
      console.log('calling server side tool', toolName, args);
      return runMCPTool(tool, args, client, streamingData, config, serverName);
    },
  };
}

export function runMCPTool(tool: any, args: any, client: Client, streamingData: DataStreamWriter, config: ToolSetConfig, serverName: string) {
  try {
    const resultPromise = (async () => {
      const toolResultId = generateUUID();
      console.log('calling MCP tool', tool.name, args);
      const result = await client.callTool({
        name: tool.name,
        arguments: args,
      });
      if (result.isError) {
        console.error('Error in calling tool from server', tool.name, result.content);
        return (result.content as { text: string }[])[0].text;
      }
      const parsedResult = parseResult(result);

      streamingData.writeData({
        type: `${tool.name}_result`,
        content: parsedResult,
      });
      return {toolResultId, data:parsedResult};
    })();

    if (config.onCallTool) {
      config.onCallTool(serverName, tool.name, args, resultPromise as Promise<string>);
    }

    return resultPromise;
  } catch (error) {
    console.error('Error in running tool', tool.name, error);
    throw new Error(
      `Error in running tool ${tool.name}: ${(error as Error).message}`
    );
  }
}