import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateEmbeddings } from "./providers/open-ai.js";
import { Client } from "pg";
// Create an MCP server
const server = new McpServer({
  name: "Demo",
  version: "1.0.0"
});

// TASK 0 - Try to call the health check tool
server.tool("health-check",
  { test_string: z.string() },
  async ({ test_string }: { test_string: string }) => {
    try {
      return { content: [{ type: "text", text: `OK ${test_string}` }]};
    } catch (error: any) {
      return { 
        content: [{ 
          type: "text", 
          text: `Error reviewing code: ${error.message}` 
        }]
      };
    }
  }
);


// TASK 1 Understanding MCP Tools - Create a hello world tool to convert miles to kilometers using the formula: kilometers = miles * 1.60934
server.tool("convert-miles-to-kilometers",
  { miles: z.number() },
  async ({ miles }: { miles: number }) => {
    const kilometers = miles * 1.60934;
    return { content: [{ type: "text", text: `The number of kilometers is ${kilometers}` }]};
  }
);

// TASK 2 - Similarity Search - Create a tool to receive a query and return the most similar items in the database
server.tool("similarity-search",
  { query: z.string(), column_name: z.string(), similarity_threshold: z.number() },
  async ({ query, column_name, similarity_threshold }: { query: string, column_name: string, similarity_threshold: number }) => {
    const connectionString = "postgres://postgres:postgres@localhost:5434/postgres";
    const client = new Client({ connectionString });
    
    try {
      await client.connect();
      console.error("query: ", query);
      console.error("column_name: ", column_name);
      console.error("similarity_threshold: ", similarity_threshold);
      const embedding = await generateEmbeddings(query, 'text-embedding-ada-002');
      const embeddingStr = '[' + embedding.join(',') + ']';
      const sqlQuery = `
        SELECT description, prompt, 1 - (${column_name}_embedding <=> $1) as similarity
        FROM public.llm_prompts
        WHERE 1 - (${column_name}_embedding <=> $1) > $2
        ORDER BY ${column_name}_embedding <=> $1`;
      const res = await client.query(sqlQuery, [embeddingStr, similarity_threshold]);
      const results = res.rows.map((row: any) => `${row.description}: ${row.prompt} (similarity: ${row.similarity})`).join('\n');
      return { content: [{ type: "text", text: results }]};
    } catch (error: any) {
      console.error("Error during similarity search: ", error);
      return { 
        content: [{ 
          type: "text", 
          text: `Error during similarity search: ${error.message}` 
        }]
      };
    } finally {
      await client.end();
    }
  } 
);

// TASK 3 - Add a new column to the database to store the embeddings and update the database with the embeddings
server.tool("add-embedding-column",
  { original_column_name: z.string() },
  async ({ original_column_name }: { original_column_name: string }) => {
    
    const connectionString = "postgres://postgres:postgres@localhost:5434/postgres";
    const client = new Client({ connectionString });
    try {
      await client.connect(); 

      const sqlQuery = `ALTER TABLE public.llm_prompts ADD COLUMN ${original_column_name}_embedding vector(1536)`;

      await client.query(sqlQuery);
      console.error("Column added to table public.llm_prompts");

      const dataToUpdate = await client.query(`SELECT id, ${original_column_name} FROM public.llm_prompts`);
      console.error("Data to update: ", dataToUpdate.rows.length);
      for(let i = 0; i < dataToUpdate.rows.length; i++) {
        
        const row = dataToUpdate.rows[i];
        
        const embedding = await generateEmbeddings(row[original_column_name], 'text-embedding-ada-002');
        console.error("Embedding: ", embedding);

        const embeddingStr = '[' + embedding.join(',') + ']';
       
        const sqlQuery2 = `UPDATE public.llm_prompts SET ${original_column_name}_embedding = $1 WHERE id = $2`;
        console.error("updating row: ", row.id);
        await client.query(sqlQuery2, [embeddingStr, row.id]);
      }

      return { content: [{ type: "text", text: `Column ${original_column_name}_embedding added to table public.llm_prompts` }]};
    } catch (error: any) {
      return { 
        content: [{ 
          type: "text", 
          text: `Error adding column ${original_column_name} to table public.llm_prompts: ${error.message}` 
        }]
      };
    } finally {
      await client.end();
    }
  }
);


export const runMcpServer = async () => {
  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMcpServer();