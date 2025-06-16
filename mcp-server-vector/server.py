# server.py
from mcp.server.fastmcp import FastMCP
from postgres_provider import add_column_to_table
from openai_provider import generate_embedding

# Create an MCP server
mcp = FastMCP("Demo")


# Add an addition tool
@mcp.tool()
def add_embedding_columns_to_table(table_name: str, embedding_column_name: str, connection_string: str) -> int:
    """Add an embedding column to a table in a PostgreSQL database"""
    print(f"Adding embedding column to table {table_name} in database {connection_string}")
    conn, cursor = connect_to_db(connection_string)
    result = add_column_to_table(table_name, embedding_column_name, cursor)
    conn.close()

    return result

@mcp.tool()
def generate_embedding(column_name_from: str, column_name_to: str, table_name: str, connection_string: str) -> int:
    """Generate an embedding for a text"""
    print(f"Generating embedding for text {text} in database {connection_string}")
    result = generate_embedding(text, connection_string)
    return result


# Add a dynamic greeting resource
@mcp.resource("greeting://{name}")
def get_greeting(name: str) -> str:
    """Get a personalized greeting"""
    return f"Hello, {name}!"