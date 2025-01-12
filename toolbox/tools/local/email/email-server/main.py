from __future__ import annotations

from mcp.server.fastmcp import FastMCP
from tools.account import gmail_login
from tools.draft import create_draft
from tools.search import search_messages
from tools.send import send_message
# Initialize FastMCP server
mcp = FastMCP("email")

# Add tools
mcp.add_tool(create_draft)
mcp.add_tool(search_messages)
mcp.add_tool(gmail_login)
mcp.add_tool(send_message)

if __name__ == "__main__":
    # Initialize and run the local stdio server
    mcp.run(transport="stdio")
