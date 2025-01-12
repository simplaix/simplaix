import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { MCPServerConfig } from "./types";

export async function createMCPClient(
  config: MCPServerConfig
): Promise<Client> {
  const transport = new StdioClientTransport({
    command: config.command,
    args: config.args,
    stderr: process.stderr,
  });

  const client = new Client(
    {
      name: `simplaix-client`,
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {}
      },
    }
  );

  await client.connect(transport);
  return client;
}
