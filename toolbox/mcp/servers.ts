import * as fs from 'fs/promises';
import * as path from 'path';

import { LocalServerConfig, MCPServerConfig, MCPServers } from './types';

/**
 * Validates and registers MCP server configurations
 */
const CONFIG_PATH = "toolbox/tool_config.json";
const LOCAL_SERVER_PATH = "toolbox/tools/local";

export function validateMCPServers(servers: MCPServers): void {
  for (const [name, config] of Object.entries(servers)) {
    if (!config.command || !Array.isArray(config.args)) {
      throw new Error(`Invalid configuration for MCP server "${name}"`);
    }
  }
}

export async function loadToolConfig(configPath?: string): Promise<MCPServers> {
  const defaultPath = path.join(process.cwd(), CONFIG_PATH);
  const localServerPath = path.join(process.cwd(), LOCAL_SERVER_PATH);
  const finalPath = configPath || defaultPath;

  try {
    const configData = await fs.readFile(finalPath, 'utf8');
    const loadedConfig = JSON.parse(configData);
    const toolBoxConfig = loadedConfig.type === "local" ? loadedConfig as LocalServerConfig : loadedConfig as MCPServers;
    const configs: MCPServers = {};
    // Process Python servers
    // iterate over the server configs
    for (const [name, cfg] of Object.entries(toolBoxConfig)) {
      let serverConfig: MCPServerConfig;


      let toolConfigPath = path.join(localServerPath, name, `tool_config.json`);
      console.log("toolConfigPath", toolConfigPath);
      const toolConfigData = await fs.readFile(toolConfigPath, 'utf8');
      const toolConfig = JSON.parse(toolConfigData);
      console.log("toolConfig", toolConfig);
      if (cfg.language === 'python') {
          // For Python servers using uv, ensure paths are absolute
          console.log("localServerPath", localServerPath, name);
          serverConfig = {
              command: "uv",
              args: [
                      "--directory",
                      path.join(localServerPath, name, `${name}-server`),
                      "run",
                      "main.py"
                  ],
              clientTools: toolConfig[name].client_tools,
              serverTools: toolConfig[name].server_tools
          }
      }
      else {
          serverConfig = {
              command: cfg.command,
              args: cfg.args,
              clientTools: toolConfig.client_tools,
              serverTools: toolConfig.server_tools
          }
      }
      configs[name] = serverConfig;
    }
    validateMCPServers(configs);
    return configs;
  } catch (error) {
    throw new Error(`Failed to load tool config from ${finalPath}: ${error}`);
  }
}
