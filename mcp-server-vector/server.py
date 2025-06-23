# server.py
from mcp.server.fastmcp import FastMCP
from postgres_provider import add_column_to_table, process_embeddings
from openai_provider import generate_embedding

# Create an MCP server
mcp = FastMCP("Demo")


# Adding tools
@mcp.tool()
def add_embedding_columns_to_table(table_name: str, embedding_column_name: str, connection_string: str) -> int:
    """Add an embedding column to a table in a PostgreSQL database"""
    # try:
    #      # Use 'vector' as the column type for embeddings
    #     add_column_to_table(connection_string, table_name, embedding_column_name)
    #     return "The embedding column has been added to the table"
    # except Exception as e:
    #     return f"Error adding embedding column to table {table_name} in database {connection_string}: {e}"

@mcp.tool()
def generate_embedding(column_name_from: str, column_name_to: str, table_name: str, connection_string: str, openai_api_key: str) -> int:
    """Generate embeddings for a column and store them in another column using postgres_provider"""
    # result = process_embeddings(connection_string, openai_api_key, table_name, column_name_from, column_name_to)
    # return result

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