# server.py
from mcp.server.fastmcp import FastMCP
from postgres_provider import add_column_to_table, process_embeddings, search_by_similarity

# Create an MCP server
mcp = FastMCP("Demo", port=6274, host="0.0.0.0")


# Adding tools

@mcp.tool()
def health_check(test_string: str) -> int:
    """Health check the MCP server"""
    print(f"Health checking database {test_string}")
    return "OK"

# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"