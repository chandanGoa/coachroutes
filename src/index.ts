#!/usr/bin/env node
import { CoachRoutesMCPServer } from './mcp/server';

const server = new CoachRoutesMCPServer();
server.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
