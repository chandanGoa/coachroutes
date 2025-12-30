#!/usr/bin/env node
import { Command } from 'commander';
import { database } from './config/database';
import { CoachService, DriverService, BookingService, CustomerService, RouteService } from './services/index';
import { seedDatabase } from './utils/seed';

const program = new Command();

program
  .name('coachroutes-cli')
  .description('CoachRoutes Management CLI')
  .version('1.0.0');

// Coaches commands
const coaches = program.command('coaches').description('Manage coaches');

coaches
  .command('list')
  .description('List all coaches')
  .action(async () => {
    await database.initialize();
    const service = new CoachService();
    const coaches = await service.getAll();
    console.table(coaches);
    await database.close();
  });

coaches
  .command('available')
  .description('List available coaches for date range')
  .requiredOption('-s, --start <date>', 'Start date (ISO format)')
  .requiredOption('-e, --end <date>', 'End date (ISO format)')
  .action(async (options) => {
    await database.initialize();
    const service = new CoachService();
    const coaches = await service.getAvailable(options.start, options.end);
    console.table(coaches);
    await database.close();
  });

// Drivers commands
const drivers = program.command('drivers').description('Manage drivers');

drivers
  .command('list')
  .description('List all drivers')
  .action(async () => {
    await database.initialize();
    const service = new DriverService();
    const drivers = await service.getAll();
    console.table(drivers);
    await database.close();
  });

drivers
  .command('available')
  .description('List available drivers for a date')
  .requiredOption('-d, --date <date>', 'Date (ISO format)')
  .action(async (options) => {
    await database.initialize();
    const service = new DriverService();
    const drivers = await service.getAvailable(options.date);
    console.table(drivers);
    await database.close();
  });

// Bookings commands
const bookings = program.command('bookings').description('Manage bookings');

bookings
  .command('list')
  .description('List all bookings')
  .action(async () => {
    await database.initialize();
    const service = new BookingService();
    const bookings = await service.getAll();
    console.table(bookings);
    await database.close();
  });

bookings
  .command('by-date')
  .description('List bookings in date range')
  .requiredOption('-s, --start <date>', 'Start date (ISO format)')
  .requiredOption('-e, --end <date>', 'End date (ISO format)')
  .action(async (options) => {
    await database.initialize();
    const service = new BookingService();
    const bookings = await service.getByDateRange(options.start, options.end);
    console.table(bookings);
    await database.close();
  });

// Database commands
const db = program.command('db').description('Database operations');

db
  .command('seed')
  .description('Seed database with sample data')
  .action(async () => {
    await database.initialize();
    await seedDatabase();
    await database.close();
  });

db
  .command('init')
  .description('Initialize database schema')
  .action(async () => {
    await database.initialize();
    console.log('Database initialized successfully');
    await database.close();
  });

// Customers commands
const customers = program.command('customers').description('Manage customers');

customers
  .command('list')
  .description('List all customers')
  .action(async () => {
    await database.initialize();
    const service = new CustomerService();
    const customers = await service.getAll();
    console.table(customers);
    await database.close();
  });

// Routes commands
const routes = program.command('routes').description('Manage routes');

routes
  .command('list')
  .description('List all routes')
  .action(async () => {
    await database.initialize();
    const service = new RouteService();
    const routes = await service.getAll();
    console.table(routes);
    await database.close();
  });

program.parse();
