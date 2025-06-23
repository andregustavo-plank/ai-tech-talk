# Setup environment

## Install UV:

````
pip install uv
````

# Run Vector Postgres

````sh
docker compose up
````

## Postgres Connection String

```
postgres://postgres:postgres@localhost:5433/postgres
```

# Run MCP locally
````sh
 uv run mcp dev server.py
 ````
