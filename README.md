# CoachRoutes - Full-Featured Coach Management System

A comprehensive, multiplatform coach management system with Model Context Protocol (MCP) server support for AI-powered fleet management.

## Features

### Core Management Features
- **Fleet Management**: Complete CRUD operations for coaches with status tracking (available, booked, maintenance, out-of-service)
- **Driver Management**: Manage driver profiles, licenses, schedules, and availability
- **Booking System**: Full-featured reservation system with date range availability checking
- **Customer Management**: Customer profiles with booking history
- **Route Planning**: Create and manage routes with distance and duration tracking
- **Maintenance Tracking**: Service records and maintenance scheduling for fleet

### MCP Server Features
The system includes a fully-functional MCP (Model Context Protocol) server that exposes all management capabilities as tools that can be used by AI assistants like Claude:

**Available MCP Tools:**
- Coach management: `list_coaches`, `get_coach`, `create_coach`, `update_coach`, `delete_coach`, `get_available_coaches`
- Driver management: `list_drivers`, `get_driver`, `create_driver`, `update_driver`, `delete_driver`, `get_available_drivers`
- Booking management: `list_bookings`, `get_booking`, `create_booking`, `update_booking`, `delete_booking`, `get_customer_bookings`, `get_bookings_by_date`
- Customer management: `list_customers`, `get_customer`, `create_customer`, `update_customer`, `delete_customer`
- Route management: `list_routes`, `get_route`, `create_route`, `update_route`, `delete_route`

### REST API
Complete REST API with endpoints for all management operations:
- `/api/coaches` - Coach fleet management
- `/api/drivers` - Driver management
- `/api/bookings` - Booking and reservation system
- `/api/customers` - Customer management
- `/api/routes` - Route management

### Multiplatform Support
- **Web Interface**: Responsive design for desktop, tablet, and mobile
- **REST API**: Platform-agnostic HTTP API
- **MCP Server**: Integrate with AI assistants via Model Context Protocol
- **CLI Tools**: Command-line interface for administration (via npm scripts)

## Installation

```bash
# Clone the repository
git clone https://github.com/chandanGoa/coachroutes.git
cd coachroutes

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Build the project
npm run build
```

## Usage

### Running the Web Server & API

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

The web interface will be available at `http://localhost:3000`
API endpoints will be available at `http://localhost:3000/api`

### Running the MCP Server

```bash
# Development mode
npm run mcp

# Production mode
npm run mcp:build
```

### MCP Server Configuration

To use the CoachRoutes MCP server with Claude Desktop or other MCP clients, add this to your MCP configuration:

**For Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "coachroutes": {
      "command": "node",
      "args": ["/path/to/coachroutes/dist/index.js"],
      "env": {
        "DATABASE_PATH": "/path/to/coachroutes/data/coachroutes.db"
      }
    }
  }
}
```

Or using npm/npx:

```json
{
  "mcpServers": {
    "coachroutes": {
      "command": "npx",
      "args": ["-y", "tsx", "/path/to/coachroutes/src/index.ts"]
    }
  }
}
```

## API Examples

### Create a Coach
```bash
curl -X POST http://localhost:3000/api/coaches \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Executive Van",
    "type": "Mercedes Sprinter",
    "capacity": 16,
    "status": "available",
    "registration_number": "ABC123"
  }'
```

### Create a Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "customer-uuid",
    "coach_id": "coach-uuid",
    "pickup_location": "London Heathrow",
    "dropoff_location": "Manchester",
    "pickup_datetime": "2025-01-15T09:00:00Z",
    "passenger_count": 12,
    "status": "pending"
  }'
```

### Check Coach Availability
```bash
curl http://localhost:3000/api/coaches/available/2025-01-15T00:00:00Z/2025-01-20T23:59:59Z
```

## MCP Tool Examples

When using the MCP server with Claude or another AI assistant:

**List all available coaches:**
```
Please list all coaches in the fleet
```

**Create a new booking:**
```
Create a booking for customer John Doe (customer-id: xyz) 
for coach ABC-123 from London to Manchester on January 15th, 2025
with 15 passengers
```

**Check availability:**
```
Which coaches are available between January 15th and 20th, 2025?
```

## Database

The system uses SQLite for data storage. The database includes:
- coaches
- drivers
- customers
- routes
- bookings
- maintenance_records

Database is automatically initialized on first run.

## Architecture

```
coachroutes/
├── src/
│   ├── config/         # Database configuration
│   ├── models/         # Data type definitions
│   ├── services/       # Business logic layer
│   ├── routes/         # REST API routes
│   ├── mcp/           # MCP server implementation
│   ├── server.ts      # Express web server
│   └── index.ts       # MCP server entry point
├── data/              # SQLite database
├── images/            # Static assets
├── index.html         # Frontend UI
└── dist/              # Compiled TypeScript
```

## Technology Stack

- **Backend**: Node.js + TypeScript
- **Database**: SQLite3
- **Web Framework**: Express
- **MCP**: @modelcontextprotocol/sdk
- **Frontend**: HTML5, TailwindCSS, JavaScript

## Development

```bash
# Watch mode for development
npm run dev

# Build TypeScript
npm run build

# Run MCP server in development
npm run mcp
```

## Security Features

- Input validation on all API endpoints
- SQL injection protection via parameterized queries
- CORS enabled for API access
- Environment variable configuration for sensitive data

## Deployment

### Vercel Deployment

This application is configured for deployment on Vercel with the included `vercel.json` configuration.

**Automatic Deployment:**
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration and deploy
3. The build process will:
   - Run `npm install` to install dependencies
   - Run `npm run build` to compile TypeScript
   - Create a `public` directory with static HTML files
   - Deploy the static site

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Environment Variables:**
Configure these in your Vercel project settings:
- `DATABASE_PATH` - Path to SQLite database (e.g., `/tmp/coachroutes.db`)
- `NODE_ENV` - Set to `production`

**Note on npm warnings:**
The deployment may show warnings about deprecated packages (`rimraf`, `npmlog`, `inflight`, `glob`, `are-we-there-yet`, `@npmcli/move-file`, `gauge`). These are transitive dependencies from `sqlite3` and do not affect functionality. They are warning-only and can be safely ignored.

### Other Platforms

**Heroku:**
```bash
# Add Procfile
echo "web: node dist/server.js" > Procfile

# Deploy
git push heroku main
```

**Railway/Render:**
- Build Command: `npm run build`
- Start Command: `npm start`

## Future Enhancements

- [ ] Real-time GPS tracking
- [ ] Payment gateway integration
- [ ] Email/SMS notifications
- [ ] Advanced route optimization
- [ ] Mobile apps (iOS/Android)
- [ ] Multi-tenant support
- [ ] Advanced reporting and analytics
- [ ] Integration with calendar systems

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
