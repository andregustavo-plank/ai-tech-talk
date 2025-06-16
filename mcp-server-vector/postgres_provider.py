import psycopg2
from psycopg2 import sql

# Function to connect to a PostgreSQL database
def connect_to_db(host, dbname, user, password, port=5432):
    """
    Connects to a PostgreSQL database and returns the connection and cursor.
    """
    conn = psycopg2.connect(
        host=host,
        dbname=dbname,
        user=user,
        password=password,
        port=port
    )
    cursor = conn.cursor()
    return conn, cursor

# Function to add a new column to a table, creating its own connection
def add_column_to_table(host, dbname, user, password, table_name, column_name, column_type, port=5432):
    """
    Connects to the database and adds a new column to the specified table.
    """
    conn = None
    cursor = None
    try:
        conn, cursor = connect_to_db(host, dbname, user, password, port)
        query = sql.SQL("ALTER TABLE {table} ADD COLUMN {column} {ctype};").format(
            table=sql.Identifier(table_name),
            column=sql.Identifier(column_name),
            ctype=sql.SQL(column_type)
        )
        cursor.execute(query)
        conn.commit()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
