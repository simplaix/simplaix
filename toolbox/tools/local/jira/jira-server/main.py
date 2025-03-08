from __future__ import annotations

from mcp.server.fastmcp import FastMCP
from tools.create_issues import create_jira_issues
from tools.save_issues import save_jira_issues

mcp = FastMCP("jira")

mcp.add_tool(save_jira_issues)
mcp.add_tool(create_jira_issues)
if __name__ == "__main__":
    # Initialize and run the local stdio server
    mcp.run(transport="stdio")
