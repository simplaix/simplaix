import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Schema, z } from 'zod';

export type LocalServerConfig = {
  type: "local";
  language: string;
}

export type MCPServerConfig = {
  command: string;
  args: string[];
}

export type MCPServers = {
  [key: string]: MCPServerConfig;
}

export type ToolSetConfig = {
    mcpServers: {
      [key: string]: {
        command: string;
        args: string[];
      };
    };
    // onCallTool is a function that will be called when a tool is called. It will be passed the server name, tool name, arguments, and a function that will resolve to the result of the tool call. Useful for timing the tool calls or doing other instrumentation like logging.
    onCallTool?: (
      serverName: string,
      toolName: string,
      args: any,
      result: Promise<string>
    ) => void;
  };

export type ToolSet = {
  tools: Record<string, any>;
  clients: Record<string, Client>;
}

export interface ToolDefinition {
  description: string;
  parameters: Schema<any>;
  execute: (params: any) => Promise<any>;
}