import { StreamData } from "ai";

import { createMCPClient } from "./mcp/client";
import { validateMCPServers, loadToolConfig } from "./mcp/servers";
import { mapToolToToolset } from "./mcp/toolMapper";
import { ToolSet, ToolSetConfig } from "./mcp/types";

// // Define allowed tools for different functionalities
// type AllowedTools =
//   | 'createDocument'
//   | 'updateDocument'
//   | 'requestSuggestions'
//   | 'getWeather'
//   | 'createDraft'
//   | 'createJiraTickets'
//   | 'searchMail'
//   | 'joinData'
//   | 'filter'
//   | 'replaceDataset'
//   | 'getAreaPaths'
//   | 'getIterationPaths'
//   | 'googleLogin';

// // Tools available for canvas model
// const canvasTools: AllowedTools[] = [
//   'createDocument',
//   'updateDocument',
//   'requestSuggestions',
// ];

// // Tools available for draft creation
// const draftTools: AllowedTools[] = [
//   'createJiraTickets',
//   'getAreaPaths',
//   'getIterationPaths',
// ];

// // Tools available for weather information
// const emailTools: AllowedTools[] = ['searchMail', 'createDraft', 'googleLogin'];

// // Add data transform tools to available tools
// const dataTransformTools: AllowedTools[] = [
//   'joinData',
//   'filter',
//   'replaceDataset',
// ];

export async function loadTools(
  streamingData: StreamData,
  onCallTool?: ToolSetConfig['onCallTool'],
): Promise<ToolSet> {
  const mcpServers = await loadToolConfig();

  const config: ToolSetConfig = {
    mcpServers,
    onCallTool
  };

  validateMCPServers(config.mcpServers);

  const toolset: ToolSet = {
    tools: {},
    clients: {},
  };

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    const client = await createMCPClient(serverConfig);
    toolset.clients[serverName] = client;

    const toolList = await client.listTools();
    
    for (const tool of toolList.tools) {
      const toolName = tool.name !== serverName ? tool.name : tool.name;
      toolset.tools[toolName] = mapToolToToolset(
        tool,
        serverName,
        client,
        config,
        streamingData
      );
    }
  }

  console.log(toolset);
  return toolset;
}

export * from './mcp/types';
