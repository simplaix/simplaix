import { DataStreamWriter } from "ai";

import { createMCPClient } from "./mcp/client";
import { validateMCPServers, loadToolConfig } from "./mcp/servers";
import { mapToolToToolset } from "./mcp/toolMapper";
import { ToolSet, ToolSetConfig } from "./mcp/types";
import { UIRegistry, uiRegistry, ClientToolName, ServerToolName } from "./base/ui";
export class ToolManager {
  private toolset: ToolSet;
  private config!: ToolSetConfig;
  private uiRegistry: UIRegistry;

  constructor() {
    this.toolset = { tools: {}, clients: {} };
    this.uiRegistry = uiRegistry;
  }
  
  getToolNames() {
    return Object.keys(this.toolset.tools);
  }

  getTools() {
    return this.toolset.tools;
  }

  isClientTool(toolName: string) {
    return Object.keys(this.uiRegistry.client_tools).includes(toolName);
  }

  isServerTool(toolName: string) {
    return Object.keys(this.uiRegistry.server_tools).includes(toolName);
  }

  async loadTools(
    streamingData: DataStreamWriter,
    onCallTool?: ToolSetConfig['onCallTool'],
  ): Promise<ToolSet> {
    const mcpServersConfigs = await loadToolConfig();
    this.config = { mcpServers: mcpServersConfigs, onCallTool };

    validateMCPServers(mcpServersConfigs);

    // Reset state for fresh load
    this.toolset = { tools: {}, clients: {} };

    for (const [serverName, serverConfig] of Object.entries(mcpServersConfigs)) {
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
