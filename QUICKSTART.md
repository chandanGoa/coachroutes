# Quick Start Guide

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Initialize Database
```bash
npm run seed
```

### 3. Start the System

#### Web Server & API
```bash
npm start
# or for development with hot reload
npm run dev
```
Access:
- Web Interface: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin.html
- API: http://localhost:3000/api

#### MCP Server
```bash
npm run mcp
```

#### CLI Tool
```bash
npm run cli -- <command>
```

## Common Tasks

### View All Coaches
```bash
npm run cli -- coaches list
```

### Check Coach Availability
```bash
npm run cli -- coaches available --start 2025-01-15T00:00:00Z --end 2025-01-20T23:59:59Z
```

### View All Bookings
```bash
npm run cli -- bookings list
```

### View Drivers
```bash
npm run cli -- drivers list
```

### Check Driver Availability
```bash
npm run cli -- drivers available --date 2025-01-15
```

## API Examples

### List Coaches
```bash
curl http://localhost:3000/api/coaches
```

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-uuid",
    "coach_id": "coach-uuid",
    "pickup_location": "London",
    "dropoff_location": "Manchester",
    "pickup_datetime": "2025-01-15T09:00:00Z",
    "passenger_count": 25,
    "status": "pending"
  }'
```

### Get Available Coaches
```bash
curl http://localhost:3000/api/coaches/available/2025-01-15T00:00:00Z/2025-01-20T23:59:59Z
```

## MCP Server Setup

### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```json
{
  "mcpServers": {
    "coachroutes": {
      "command": "npx",
      "args": ["-y", "tsx", "/absolute/path/to/coachroutes/src/index.ts"],
      "env": {
        "DATABASE_PATH": "/absolute/path/to/coachroutes/data/coachroutes.db"
      }
    }
  }
}
```

Or after building:

```json
{
  "mcpServers": {
    "coachroutes": {
      "command": "node",
      "args": ["/absolute/path/to/coachroutes/dist/index.js"]
    }
  }
}
```

### Using the MCP Server with Claude

Once configured, you can ask Claude:
- "List all available coaches"
- "Create a new customer named John Smith"
- "Show me all bookings for next week"
- "Which drivers are available on January 15th?"

## Project Structure

```
coachroutes/
├── src/
│   ├── config/         # Database configuration
│   ├── models/         # TypeScript type definitions
│   ├── services/       # Business logic (CRUD operations)
│   ├── routes/         # REST API routes
│   ├── mcp/           # MCP server implementation
│   ├── utils/         # Utilities (seed data, etc.)
│   ├── server.ts      # Express web server
│   ├── index.ts       # MCP server entry point
│   └── cli.ts         # CLI tool
├── data/              # SQLite database
├── admin.html         # Admin dashboard
├── index.html         # Public website
└── dist/              # Compiled JavaScript
```

## Environment Variables

Create a `.env` file (see `.env.example`):

```env
PORT=3000
DATABASE_PATH=./data/coachroutes.db
NODE_ENV=development
MCP_SERVER_NAME=coachroutes-mcp
MCP_SERVER_VERSION=1.0.0
```

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Database not found
```bash
npm run seed
```

### Port already in use
Change PORT in `.env` or:
```bash
PORT=3001 npm start
```

### MCP server not connecting
- Ensure absolute paths in configuration
- Check database path is correct
- Restart Claude Desktop after config changes
