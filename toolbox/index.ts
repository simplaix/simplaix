import { DataStreamWriter } from "ai";

import { createMCPClient } from "./mcp/client";
import { validateMCPServers, loadToolConfig } from "./mcp/servers";
import { mapToolToToolset } from "./mcp/toolMapper";
import { ToolSet, ToolSetConfig } from "./mcp/types";

export async function loadTools(
  streamingData: DataStreamWriter,
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
  return toolset;
}

export * from './mcp/types';
