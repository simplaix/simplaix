import { DataStreamWriter } from "ai";

import { createMCPClient } from "./mcp/client";
import { validateMCPServers, loadToolConfig } from "./mcp/servers";
import { mapToolToToolset } from "./mcp/toolMapper";
import { ToolSet, ToolSetConfig } from "./mcp/types";

export class ToolManager {
  private toolset: ToolSet;
  private config!: ToolSetConfig;

  constructor() {
    this.toolset = { tools: {}, clients: {} };
  }

  getToolNames() {
    return Object.keys(this.toolset.tools);
  }

  getTools() {
    return this.toolset.tools;
  }

  async loadTools(
    streamingData: DataStreamWriter,
    onCallTool?: ToolSetConfig['onCallTool'],
  ): Promise<ToolSet> {
    const mcpServers = await loadToolConfig();
    this.config = { mcpServers, onCallTool };

    validateMCPServers(this.config.mcpServers);

    // Reset state for fresh load
    this.toolset = { tools: {}, clients: {} };

    for (const [serverName, serverConfig] of Object.entries(this.config.mcpServers)) {
      const client = await createMCPClient(serverConfig);
      this.toolset.clients[serverName] = client;

      const toolList = await client.listTools();

      for (const tool of toolList.tools) {
        const toolName = tool.name !== serverName ? tool.name : tool.name;
        this.toolset.tools[toolName] = mapToolToToolset(
          tool,
          serverName,
          client,
          this.config,
          streamingData
        );
      }
    }
    return this.toolset;
  }
}

export * from './mcp/types';
