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
    const config = loadedConfig.type === "local" ? loadedConfig as LocalServerConfig : loadedConfig as MCPServers;
    const configs: MCPServers = {};
    // Process Python servers
    for (const [name, cfg] of Object.entries(config)) {
        let serverConfig: MCPServerConfig;
        if (cfg.language === 'python') {
            // For Python servers using uv, ensure paths are absolute
            console.log("localServerPath", localServerPath);
            serverConfig = {
                command: "uv",
                args: [
                        "--directory",
                        path.join(localServerPath, name, `${name}-server`),
                        "run",
                        "main.py"
                    ]
            }
        }
        else {
            serverConfig = {
                command: cfg.command,
                args: cfg.args
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
