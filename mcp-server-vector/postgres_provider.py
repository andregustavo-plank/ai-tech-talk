import psycopg2
from psycopg2 import sql
import openai
import os
import time

def connect_to_db(connection_string):
    """
    Connects to a PostgreSQL database using a connection string and returns the connection and cursor.
    """
    conn = psycopg2.connect(connection_string)
    cursor = conn.cursor()
    return conn, cursor

def add_column_to_table(connection_string, table_name, column_name, column_type="vector(1536)"):
    """
    Connects to the database using a connection string and adds a new column to the specified table.
    Args:
        connection_string (str): PostgreSQL connection string.
        table_name (str): Name of the table to alter.
        column_name (str): Name of the new column to add.
        column_type (str): SQL type of the new column.
    """
    conn = None
    cursor = None
    try:
        conn, cursor = connect_to_db(connection_string)
        query = sql.SQL("ALTER TABLE {table} ADD COLUMN {column} {ctype}").format(
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

def check_embedding_valid(embedding_resp):
    return (
        embedding_resp and
        hasattr(embedding_resp, 'data') and
        len(embedding_resp.data) > 0 and
        hasattr(embedding_resp.data[0], 'embedding')
    )

def get_embedding_with_retry(cleaned_value, max_retries=5):
    delay = 2
    for attempt in range(max_retries):
        try:
            embedding_resp = openai.embeddings.create(
                model="text-embedding-ada-002",
                input=cleaned_value,
            )
            return embedding_resp
        except openai.error.RateLimitError as e:
            print(f"Rate limit hit, retrying in {delay} seconds...")
            time.sleep(delay)
            delay *= 2
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return None
    print("Max retries exceeded.")
    return None

def process_embeddings(connection_string, openai_api_key, table_name, table_column_name, embedding_column_name):
    """
    Iterates through the specified table, generates OpenAI embeddings for the given column, and updates the table.
    Args:
        connection_string (str): PostgreSQL connection string.
        openai_api_key (str): OpenAI API key.
        table_name (str): Name of the table to process.
        table_column_name (str): Name of the column to generate embeddings for.
    """
    openai.api_key = openai_api_key
    conn, cursor = connect_to_db(connection_string)
    total_cnt = 0
    try:
        print(f"Processing all rows in table {table_name}, column {table_column_name}")
        cursor.execute(
            sql.SQL("SELECT id, {column} FROM public.{table} WHERE {column} IS NOT NULL ORDER BY id").format(
                table=sql.Identifier(table_name),
                column=sql.Identifier(table_column_name)
            )
        )
        rows = cursor.fetchall()
        for row in rows:
            row_id, column_value = row
            cleaned_value = column_value.replace("*", " ").replace("\n", " ")
            embedding_resp = get_embedding_with_retry(cleaned_value)
            if embedding_resp is None:
                print(f"Failed to get embedding for id {row_id}")
                continue
            if not check_embedding_valid(embedding_resp):
                print(f"Invalid embedding for id {row_id}")
                continue
            embedding = embedding_resp.data[0].embedding
            embedding_str = str(embedding)
            cursor.execute(
                sql.SQL("UPDATE public.{table} SET {column} = %s WHERE id = %s").format(
                    table=sql.Identifier(table_name),
                    column=sql.Identifier(embedding_column_name)
                ),
                (embedding_str, row_id)
            )
            total_cnt += 1
            time.sleep(2)
        conn.commit()

        return f"Finished generating embeddings for {total_cnt} rows"

    except Exception as e:
        return f"Error processing embeddings for table {table_name} in database {connection_string}: {e}"
    finally:
        cursor.close()
        conn.close()
