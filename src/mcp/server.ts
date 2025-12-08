import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { CoachService, DriverService, BookingService, CustomerService, RouteService } from '../services/index.js';
import { database } from '../config/database.js';

const SERVER_NAME = process.env.MCP_SERVER_NAME || 'coachroutes-mcp';
const SERVER_VERSION = process.env.MCP_SERVER_VERSION || '1.0.0';

export class CoachRoutesMCPServer {
  private server: Server;
  private coachService: CoachService;
  private driverService: DriverService;
  private bookingService: BookingService;
  private customerService: CustomerService;
  private routeService: RouteService;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.coachService = new CoachService();
    this.driverService = new DriverService();
    this.bookingService = new BookingService();
    this.customerService = new CustomerService();
    this.routeService = new RouteService();

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Coach management
          case 'list_coaches':
            return await this.listCoaches();
          case 'get_coach':
            return await this.getCoach(args);
          case 'create_coach':
            return await this.createCoach(args);
          case 'update_coach':
            return await this.updateCoach(args);
          case 'delete_coach':
            return await this.deleteCoach(args);
          case 'get_available_coaches':
            return await this.getAvailableCoaches(args);

          // Driver management
          case 'list_drivers':
            return await this.listDrivers();
          case 'get_driver':
            return await this.getDriver(args);
          case 'create_driver':
            return await this.createDriver(args);
          case 'update_driver':
            return await this.updateDriver(args);
          case 'delete_driver':
            return await this.deleteDriver(args);
          case 'get_available_drivers':
            return await this.getAvailableDrivers(args);

          // Booking management
          case 'list_bookings':
            return await this.listBookings();
          case 'get_booking':
            return await this.getBooking(args);
          case 'create_booking':
            return await this.createBooking(args);
          case 'update_booking':
            return await this.updateBooking(args);
          case 'delete_booking':
            return await this.deleteBooking(args);
          case 'get_customer_bookings':
            return await this.getCustomerBookings(args);
          case 'get_bookings_by_date':
            return await this.getBookingsByDate(args);

          // Customer management
          case 'list_customers':
            return await this.listCustomers();
          case 'get_customer':
            return await this.getCustomer(args);
          case 'create_customer':
            return await this.createCustomer(args);
          case 'update_customer':
            return await this.updateCustomer(args);
          case 'delete_customer':
            return await this.deleteCustomer(args);

          // Route management
          case 'list_routes':
            return await this.listRoutes();
          case 'get_route':
            return await this.getRoute(args);
          case 'create_route':
            return await this.createRoute(args);
          case 'update_route':
            return await this.updateRoute(args);
          case 'delete_route':
            return await this.deleteRoute(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private getTools(): Tool[] {
    return [
      // Coach tools
      {
        name: 'list_coaches',
        description: 'List all coaches in the fleet',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_coach',
        description: 'Get details of a specific coach by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Coach ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_coach',
        description: 'Create a new coach',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Coach name' },
            type: { type: 'string', description: 'Coach type (e.g., Executive Van, Mid-Size, Luxury)' },
            capacity: { type: 'number', description: 'Passenger capacity' },
            features: { type: 'string', description: 'Coach features (optional)' },
            status: { type: 'string', enum: ['available', 'booked', 'maintenance', 'out-of-service'] },
            registration_number: { type: 'string', description: 'Vehicle registration number (optional)' },
            year: { type: 'number', description: 'Year of manufacture (optional)' },
          },
          required: ['name', 'type', 'capacity'],
        },
      },
      {
        name: 'update_coach',
        description: 'Update coach information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Coach ID' },
            name: { type: 'string' },
            type: { type: 'string' },
            capacity: { type: 'number' },
            features: { type: 'string' },
            status: { type: 'string', enum: ['available', 'booked', 'maintenance', 'out-of-service'] },
            registration_number: { type: 'string' },
            year: { type: 'number' },
            mileage: { type: 'number' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_coach',
        description: 'Delete a coach from the fleet',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Coach ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_available_coaches',
        description: 'Get available coaches for a date range',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: { type: 'string', description: 'Start date (ISO format)' },
            end_date: { type: 'string', description: 'End date (ISO format)' },
          },
          required: ['start_date', 'end_date'],
        },
      },
      // Driver tools
      {
        name: 'list_drivers',
        description: 'List all drivers',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_driver',
        description: 'Get details of a specific driver by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Driver ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_driver',
        description: 'Create a new driver',
        inputSchema: {
          type: 'object',
          properties: {
            first_name: { type: 'string', description: 'First name' },
            last_name: { type: 'string', description: 'Last name' },
            license_number: { type: 'string', description: 'Driver license number' },
            phone: { type: 'string', description: 'Phone number (optional)' },
            email: { type: 'string', description: 'Email address (optional)' },
            status: { type: 'string', enum: ['active', 'inactive', 'on-leave'], description: 'Driver status' },
          },
          required: ['first_name', 'last_name', 'license_number'],
        },
      },
      {
        name: 'update_driver',
        description: 'Update driver information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Driver ID' },
            first_name: { type: 'string' },
            last_name: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'on-leave'] },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_driver',
        description: 'Delete a driver',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Driver ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_available_drivers',
        description: 'Get available drivers for a specific date',
        inputSchema: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Date (ISO format)' },
          },
          required: ['date'],
        },
      },
      // Booking tools
      {
        name: 'list_bookings',
        description: 'List all bookings',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_booking',
        description: 'Get details of a specific booking by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Booking ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_booking',
        description: 'Create a new booking',
        inputSchema: {
          type: 'object',
          properties: {
            customer_id: { type: 'string', description: 'Customer ID' },
            coach_id: { type: 'string', description: 'Coach ID' },
            driver_id: { type: 'string', description: 'Driver ID (optional)' },
            route_id: { type: 'string', description: 'Route ID (optional)' },
            pickup_location: { type: 'string', description: 'Pickup location' },
            dropoff_location: { type: 'string', description: 'Drop-off location' },
            pickup_datetime: { type: 'string', description: 'Pickup date and time (ISO format)' },
            return_datetime: { type: 'string', description: 'Return date and time (ISO format, optional)' },
            passenger_count: { type: 'number', description: 'Number of passengers' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'] },
            total_cost: { type: 'number', description: 'Total cost (optional)' },
            notes: { type: 'string', description: 'Additional notes (optional)' },
          },
          required: ['customer_id', 'coach_id', 'pickup_location', 'dropoff_location', 'pickup_datetime', 'passenger_count'],
        },
      },
      {
        name: 'update_booking',
        description: 'Update booking information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Booking ID' },
            driver_id: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'] },
            total_cost: { type: 'number' },
            notes: { type: 'string' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_booking',
        description: 'Delete a booking',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Booking ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_customer_bookings',
        description: 'Get all bookings for a specific customer',
        inputSchema: {
          type: 'object',
          properties: {
            customer_id: { type: 'string', description: 'Customer ID' },
          },
          required: ['customer_id'],
        },
      },
      {
        name: 'get_bookings_by_date',
        description: 'Get bookings within a date range',
        inputSchema: {
          type: 'object',
          properties: {
            start_date: { type: 'string', description: 'Start date (ISO format)' },
            end_date: { type: 'string', description: 'End date (ISO format)' },
          },
          required: ['start_date', 'end_date'],
        },
      },
      // Customer tools
      {
        name: 'list_customers',
        description: 'List all customers',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_customer',
        description: 'Get details of a specific customer by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Customer ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_customer',
        description: 'Create a new customer',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Customer name' },
            email: { type: 'string', description: 'Email address (optional)' },
            phone: { type: 'string', description: 'Phone number' },
            company: { type: 'string', description: 'Company name (optional)' },
            address: { type: 'string', description: 'Address (optional)' },
          },
          required: ['name', 'phone'],
        },
      },
      {
        name: 'update_customer',
        description: 'Update customer information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Customer ID' },
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            company: { type: 'string' },
            address: { type: 'string' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_customer',
        description: 'Delete a customer',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Customer ID' },
          },
          required: ['id'],
        },
      },
      // Route tools
      {
        name: 'list_routes',
        description: 'List all routes',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_route',
        description: 'Get details of a specific route by ID',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Route ID' },
          },
          required: ['id'],
        },
      },
      {
        name: 'create_route',
        description: 'Create a new route',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Route name' },
            origin: { type: 'string', description: 'Origin location' },
            destination: { type: 'string', description: 'Destination location' },
            distance_km: { type: 'number', description: 'Distance in kilometers (optional)' },
            estimated_duration_minutes: { type: 'number', description: 'Estimated duration in minutes (optional)' },
            waypoints: { type: 'string', description: 'Waypoints JSON (optional)' },
          },
          required: ['name', 'origin', 'destination'],
        },
      },
      {
        name: 'update_route',
        description: 'Update route information',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Route ID' },
            name: { type: 'string' },
            distance_km: { type: 'number' },
            estimated_duration_minutes: { type: 'number' },
            waypoints: { type: 'string' },
          },
          required: ['id'],
        },
      },
      {
        name: 'delete_route',
        description: 'Delete a route',
        inputSchema: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Route ID' },
          },
          required: ['id'],
        },
      },
    ];
  }

  // Coach handlers
  private async listCoaches() {
    const coaches = await this.coachService.getAll();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(coaches, null, 2),
        },
      ],
    };
  }

  private async getCoach(args: any) {
    const coach = await this.coachService.getById(args.id);
    return {
      content: [
        {
          type: 'text',
          text: coach ? JSON.stringify(coach, null, 2) : 'Coach not found',
        },
      ],
    };
  }

  private async createCoach(args: any) {
    const coach = await this.coachService.create({
      name: args.name,
      type: args.type,
      capacity: args.capacity,
      features: args.features,
      status: args.status || 'available',
      registration_number: args.registration_number,
      year: args.year,
      mileage: args.mileage,
      last_service_date: args.last_service_date,
    });
    return {
      content: [
        {
          type: 'text',
          text: `Coach created successfully:\n${JSON.stringify(coach, null, 2)}`,
        },
      ],
    };
  }

  private async updateCoach(args: any) {
    const { id, ...updates } = args;
    const coach = await this.coachService.update(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: coach ? `Coach updated successfully:\n${JSON.stringify(coach, null, 2)}` : 'Coach not found',
        },
      ],
    };
  }

  private async deleteCoach(args: any) {
    const success = await this.coachService.delete(args.id);
    return {
      content: [
        {
          type: 'text',
          text: success ? 'Coach deleted successfully' : 'Coach not found',
        },
      ],
    };
  }

  private async getAvailableCoaches(args: any) {
    const coaches = await this.coachService.getAvailable(args.start_date, args.end_date);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(coaches, null, 2),
        },
      ],
    };
  }

  // Driver handlers
  private async listDrivers() {
    const drivers = await this.driverService.getAll();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(drivers, null, 2),
        },
      ],
    };
  }

  private async getDriver(args: any) {
    const driver = await this.driverService.getById(args.id);
    return {
      content: [
        {
          type: 'text',
          text: driver ? JSON.stringify(driver, null, 2) : 'Driver not found',
        },
      ],
    };
  }

  private async createDriver(args: any) {
    const driver = await this.driverService.create({
      first_name: args.first_name,
      last_name: args.last_name,
      license_number: args.license_number,
      phone: args.phone,
      email: args.email,
      status: args.status || 'active',
      hire_date: args.hire_date,
    });
    return {
      content: [
        {
          type: 'text',
          text: `Driver created successfully:\n${JSON.stringify(driver, null, 2)}`,
        },
      ],
    };
  }

  private async updateDriver(args: any) {
    const { id, ...updates } = args;
    const driver = await this.driverService.update(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: driver ? `Driver updated successfully:\n${JSON.stringify(driver, null, 2)}` : 'Driver not found',
        },
      ],
    };
  }

  private async deleteDriver(args: any) {
    const success = await this.driverService.delete(args.id);
    return {
      content: [
        {
          type: 'text',
          text: success ? 'Driver deleted successfully' : 'Driver not found',
        },
      ],
    };
  }

  private async getAvailableDrivers(args: any) {
    const drivers = await this.driverService.getAvailable(args.date);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(drivers, null, 2),
        },
      ],
    };
  }

  // Booking handlers
  private async listBookings() {
    const bookings = await this.bookingService.getAll();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(bookings, null, 2),
        },
      ],
    };
  }

  private async getBooking(args: any) {
    const booking = await this.bookingService.getById(args.id);
    return {
      content: [
        {
          type: 'text',
          text: booking ? JSON.stringify(booking, null, 2) : 'Booking not found',
        },
      ],
    };
  }

  private async createBooking(args: any) {
    const booking = await this.bookingService.create({
      customer_id: args.customer_id,
      coach_id: args.coach_id,
      driver_id: args.driver_id,
      route_id: args.route_id,
      pickup_location: args.pickup_location,
      dropoff_location: args.dropoff_location,
      pickup_datetime: args.pickup_datetime,
      return_datetime: args.return_datetime,
      passenger_count: args.passenger_count,
      status: args.status || 'pending',
      total_cost: args.total_cost,
      notes: args.notes,
    });
    return {
      content: [
        {
          type: 'text',
          text: `Booking created successfully:\n${JSON.stringify(booking, null, 2)}`,
        },
      ],
    };
  }

  private async updateBooking(args: any) {
    const { id, ...updates } = args;
    const booking = await this.bookingService.update(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: booking ? `Booking updated successfully:\n${JSON.stringify(booking, null, 2)}` : 'Booking not found',
        },
      ],
    };
  }

  private async deleteBooking(args: any) {
    const success = await this.bookingService.delete(args.id);
    return {
      content: [
        {
          type: 'text',
          text: success ? 'Booking deleted successfully' : 'Booking not found',
        },
      ],
    };
  }

  private async getCustomerBookings(args: any) {
    const bookings = await this.bookingService.getByCustomer(args.customer_id);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(bookings, null, 2),
        },
      ],
    };
  }

  private async getBookingsByDate(args: any) {
    const bookings = await this.bookingService.getByDateRange(args.start_date, args.end_date);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(bookings, null, 2),
        },
      ],
    };
  }

  // Customer handlers
  private async listCustomers() {
    const customers = await this.customerService.getAll();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(customers, null, 2),
        },
      ],
    };
  }

  private async getCustomer(args: any) {
    const customer = await this.customerService.getById(args.id);
    return {
      content: [
        {
          type: 'text',
          text: customer ? JSON.stringify(customer, null, 2) : 'Customer not found',
        },
      ],
    };
  }

  private async createCustomer(args: any) {
    const customer = await this.customerService.create({
      name: args.name,
      email: args.email,
      phone: args.phone,
      company: args.company,
      address: args.address,
    });
    return {
      content: [
        {
          type: 'text',
          text: `Customer created successfully:\n${JSON.stringify(customer, null, 2)}`,
        },
      ],
    };
  }

  private async updateCustomer(args: any) {
    const { id, ...updates } = args;
    const customer = await this.customerService.update(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: customer ? `Customer updated successfully:\n${JSON.stringify(customer, null, 2)}` : 'Customer not found',
        },
      ],
    };
  }

  private async deleteCustomer(args: any) {
    const success = await this.customerService.delete(args.id);
    return {
      content: [
        {
          type: 'text',
          text: success ? 'Customer deleted successfully' : 'Customer not found',
        },
      ],
    };
  }

  // Route handlers
  private async listRoutes() {
    const routes = await this.routeService.getAll();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(routes, null, 2),
        },
      ],
    };
  }

  private async getRoute(args: any) {
    const route = await this.routeService.getById(args.id);
    return {
      content: [
        {
          type: 'text',
          text: route ? JSON.stringify(route, null, 2) : 'Route not found',
        },
      ],
    };
  }

  private async createRoute(args: any) {
    const route = await this.routeService.create({
      name: args.name,
      origin: args.origin,
      destination: args.destination,
      distance_km: args.distance_km,
      estimated_duration_minutes: args.estimated_duration_minutes,
      waypoints: args.waypoints,
    });
    return {
      content: [
        {
          type: 'text',
          text: `Route created successfully:\n${JSON.stringify(route, null, 2)}`,
        },
      ],
    };
  }

  private async updateRoute(args: any) {
    const { id, ...updates } = args;
    const route = await this.routeService.update(id, updates);
    return {
      content: [
        {
          type: 'text',
          text: route ? `Route updated successfully:\n${JSON.stringify(route, null, 2)}` : 'Route not found',
        },
      ],
    };
  }

  private async deleteRoute(args: any) {
    const success = await this.routeService.delete(args.id);
    return {
      content: [
        {
          type: 'text',
          text: success ? 'Route deleted successfully' : 'Route not found',
        },
      ],
    };
  }

  async run(): Promise<void> {
    try {
      await database.initialize();
      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      console.error('CoachRoutes MCP Server running on stdio');
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  }
}
