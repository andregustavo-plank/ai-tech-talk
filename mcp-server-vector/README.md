# Setup environment

## Table of Contents
1. [Install UV](#install-uv)
2. [Run Vector Postgres](#run-vector-postgres)
3. [Postgres Connection String](#postgres-connection-string)
4. [Run MCP Locally](#run-mcp-locally)
5. [Troubleshooting](#troubleshooting)
6. [Contact](#contact)

## Install UV

### Prerequisites
- Ensure you have Python and pip installed on your system.

### Installation

````sh
pip install uv
````

## Run Vector Postgres

This command will start the Vector Postgres service using Docker Compose.

````sh
docker compose up
````

## Postgres Connection String

Use the following connection string to connect to the Postgres database:

```
postgres://postgres:postgres@localhost:5433/postgres
```

## Run MCP Locally

This command will run the MCP server locally using `uv`.

````sh
uv run mcp dev server.py
````

## Troubleshooting

- **Issue**: Unable to connect to Postgres.
  **Solution**: Ensure Docker is running and the Postgres service is up.

- **Issue**: `uv` command not found.
  **Solution**: Ensure `uv` is installed and added to your PATH.

## Contact

For support or contributions, please contact [Your Name] at [your-email@example.com].


## Hands-On

Github: https://github.com/andregustavo-plank/ai-tech-talk
### Add 3 tools to the existing MCP Server
#### add_embedding_columns_to_table: 
Parameters: 
- table_name: str, 
- embedding_column_name: str, 
- connection_string: str

What should do: should add a column with the suffix _embedding to a given table with this type: vector(1536)

#### generate_embedding: 
Parameters: 
- column_name_from: str, 
- column_name_to: str, 
- table_name: str, 
- connection_string: str, 
- openai_api_key: str

What should do: Should select the records of a given table_name, use OpenAI API to generate the embedding using the model text-embedding-ada-002 and then update the record using the column_name_to to persist the vector data

#### similarity_search: 
Parameters: 
- query: str
- table_name: str
- embedding_column_name: str
- connection_string: str
- openai_api_key: str 
- match_threshold: float(between 0 and 1)

What should do: Should select the records of a given table_name, use OpenAI API to generate the embedding using the model text-embedding-ada-002 and then update the record using the column_name_to to persist the vector data