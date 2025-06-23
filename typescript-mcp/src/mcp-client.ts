import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";


let client: Client | undefined = undefined
const baseUrl = new URL("https://near-fcd7fhpiti34.devingtools.com/1234567/mcp");

async function run() {
    try {
        client = new Client({
            name: 'streamable-http-client',
            version: '1.0.0'
        });
        const transport = new StreamableHTTPClientTransport(
            new URL(baseUrl)
        );
        await client.connect(transport);
        const tools = await client.listTools();
        console.log(JSON.stringify(tools, null, 2));

        setInterval(async () => {
            console.log("Session ID:", transport.sessionId);
            const response = await client?.callTool({
                name: 'convert-meters-to-feet',
                arguments: {
                    meters: 100
                }
            });
            console.log(response);
        }, 10000);
        console.log("Connected using Streamable HTTP transport");
    } catch (error) {
        // If that fails with a 4xx error, try the older SSE transport
        console.log("Streamable HTTP connection failed, falling back to SSE transport");
        console.error(error);
    }
}

run();