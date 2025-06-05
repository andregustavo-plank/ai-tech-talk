# MCP Server Setup Guide

This guide explains how to set up and use the MCP (Model Context Protocol) server with Cursor.

## Prerequisites

- Node.js installed
- Cursor editor installed
- OpenAI API key

## Setup Instructions

1. **Install Dependencies**
```bash
npm install 
```

2. **Configure MCP Server**
Click on Cursor - > Settings -> Cursor Settings -> MCP - Add MCP Server

Use the JSON bellow to enable your MCP Server
```json
{
    "mcpServers": {
        "github": {
            "command": "node",
            "args": ["path/to/your/mcp-server.js"],
            "env": {
                "OPENAI_API_KEY": "your-api-key-here"
            }
        }
    }
}
```

## Available Tools

### Code Review Tool
Reviews code files and provides suggestions for improvements.

Usage:
```typescript
// Review a code file
review-my-code "/path/to/your/code.ts"
```

## Development

1. **Build the Project**
```bash
npm run build
```

2. **Watch for Changes**
```bash
npm run watch
```

## Using with Cursor

1. Open you updated Cursor editor
2. Use the command palette (Cmd/Ctrl + I)
3. Start interacting with the MCP server
4. With the Agent option enable ask for code review an pass the absolute path of the file

## Hands-on Exercise

Create a new code generation tool with the following parameters:

1. **Input Parameters**:
   - Language: The target programming language (typescript, python, java, etc.)
   - Description: Detailed description of the implementation requirements
   - OutputPath: Directory path where generated files should be created

2. **Implementation Steps**:

   a. Create a Prompt Template
      - Design a prompt that instructs the LLM what to generate
      - The prompt should request an array of objects with:
        ```typescript
        {
          code: string;        // The generated code
          fileName: string;    // Name of the file to create
          explanation: string; // Description of the generated code
        }
        ```

   b. Implement LLM Integration
      - Make the API call to the LLM using your prompt
      - Validate and process the response

   c. File Generation
      - Create the files based on the LLM response
      - Ensure proper error handling and path validation