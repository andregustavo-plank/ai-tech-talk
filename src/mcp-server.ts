import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// Handle POST requests for client-to-server communication
app.post('/:clientId/mcp', async (req: Request, res: Response) => {
  // Check for existing session ID
  const clientId = req.params.clientId;
  console.log(`Client ID: ${clientId}`);
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  console.log(`Session ID: ${sessionId}`);
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      }
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };
    const server = new McpServer({
      name: "sample-server",
      version: "1.0.0"
    });

    // ... set up server resources, tools, and prompts ...
    server.tool(
      "convert-meters-to-feet",
      { meters: z.number() },
      async ({ meters }) => {
        const feet = meters * 3.28084;
        return {
          content: [{ type: "text", text: `${meters} meters is ${feet} feet` }]
        };
      }
    );

    server.tool(
      "convert-feet-to-meters",
      { feet: z.number() },
      async ({ feet }) => {
        const meters = feet / 3.28084;
        return {
          content: [{ type: "text", text: `${feet} feet is ${meters} meters` }]
        };
      }
    );

    server.tool(
      "convert-km-to-miles",
      { km: z.number() },
      async ({ km }) => {
        const miles = km * 0.621371;
        return {
          content: [{ type: "text", text: `${km} km is ${miles} miles` }]
        };
      } 
    );

    server.tool(
      "convert-miles-to-km",
      { miles: z.number() },
      async ({ miles }) => {
        const km = miles * 1.60934;
        return {
          content: [{ type: "text", text: `${miles} miles is ${km} km` }]
        };
      }
    );

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req: Request, res: Response) => {
  const clientId = req.params.clientId;
  console.log(`Client ID: ${clientId}`);
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  console.log(`Session ID: ${sessionId}`);
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get('/:clientId/mcp', handleSessionRequest);

// Handle GET requests for server-to-client notifications via SSE
app.get('/', (req: Request, res: Response) => {
  res.send('ok!');
});

// Handle DELETE requests for session termination
app.delete('/:clientId/mcp', handleSessionRequest);

app.listen(80, () => {
  console.log(`Server is running with key ${process.env.SOME_KEY}`);
  console.log('Server is running on port 80');
});