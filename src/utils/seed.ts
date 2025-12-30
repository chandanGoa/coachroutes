import { database } from '../config/database';
import { CoachService, DriverService, CustomerService, RouteService } from '../services/index';

export async function seedDatabase() {
  console.log('Seeding database with sample data...');
  
  const coachService = new CoachService();
  const driverService = new DriverService();
  const customerService = new CustomerService();
  const routeService = new RouteService();

  try {
    // Seed coaches
    const coaches = [
      {
        name: '9-Seater Executive Van',
        type: 'Mercedes Vito',
        capacity: 9,
        features: 'Wi-Fi, Charging Ports, Climate Control, Entertainment System',
        status: 'available' as const,
        registration_number: 'MV-2023-001',
        year: 2023,
        mileage: 15000,
      },
      {
        name: '33-Seater Mid-Size Coach',
        type: 'Mercedes Sprinter',
        capacity: 33,
        features: 'Wi-Fi, USB Charging, Reclining Seats, Entertainment System',
        status: 'available' as const,
        registration_number: 'MS-2022-045',
        year: 2022,
        mileage: 42000,
      },
      {
        name: '61-Seater Luxury Coach',
        type: 'Volvo B11R',
        capacity: 61,
        features: 'Wi-Fi, Entertainment, Restroom, Reclining Seats, Climate Control',
        status: 'available' as const,
        registration_number: 'VL-2023-089',
        year: 2023,
        mileage: 28000,
      },
    ];

    for (const coach of coaches) {
      await coachService.create(coach);
      console.log(`Created coach: ${coach.name}`);
    }

    // Seed drivers
    const drivers = [
      {
        first_name: 'James',
        last_name: 'Wilson',
        license_number: 'DL-UK-123456',
        phone: '+44 7700 900123',
        email: 'james.wilson@coachroutes.com',
        status: 'active' as const,
        hire_date: '2020-03-15',
      },
      {
        first_name: 'Sarah',
        last_name: 'Thompson',
        license_number: 'DL-UK-234567',
        phone: '+44 7700 900234',
        email: 'sarah.thompson@coachroutes.com',
        status: 'active' as const,
        hire_date: '2019-06-20',
      },
      {
        first_name: 'Michael',
        last_name: 'Davies',
        license_number: 'DL-UK-345678',
        phone: '+44 7700 900345',
        email: 'michael.davies@coachroutes.com',
        status: 'active' as const,
        hire_date: '2021-01-10',
      },
    ];

    for (const driver of drivers) {
      await driverService.create(driver);
      console.log(`Created driver: ${driver.first_name} ${driver.last_name}`);
    }

    // Seed customers
    const customers = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+44 20 7946 0958',
        company: 'Smith & Co Ltd',
        address: '123 Business Park, London, UK',
      },
      {
        name: 'Emma Johnson',
        email: 'emma.j@weddingsrus.co.uk',
        phone: '+44 161 496 0000',
        company: 'Weddings R Us',
        address: '45 Wedding Lane, Manchester, UK',
      },
      {
        name: 'Robert Brown',
        email: 'r.brown@techcorp.com',
        phone: '+44 131 496 0000',
        company: 'TechCorp International',
        address: '78 Tech Tower, Edinburgh, UK',
      },
    ];

    for (const customer of customers) {
      await customerService.create(customer);
      console.log(`Created customer: ${customer.name}`);
    }

    // Seed routes
    const routes = [
      {
        name: 'London - Manchester',
        origin: 'London, UK',
        destination: 'Manchester, UK',
        distance_km: 320,
        estimated_duration_minutes: 240,
        waypoints: JSON.stringify(['Birmingham', 'Stoke-on-Trent']),
      },
      {
        name: 'London Heathrow - Central London',
        origin: 'London Heathrow Airport',
        destination: 'Central London',
        distance_km: 28,
        estimated_duration_minutes: 45,
      },
      {
        name: 'Edinburgh - Glasgow',
        origin: 'Edinburgh, Scotland',
        destination: 'Glasgow, Scotland',
        distance_km: 75,
        estimated_duration_minutes: 75,
      },
    ];

    for (const route of routes) {
      await routeService.create(route);
      console.log(`Created route: ${route.name}`);
    }

    console.log('\nDatabase seeded successfully!');
    console.log('Summary:');
    console.log(`- ${coaches.length} coaches created`);
    console.log(`- ${drivers.length} drivers created`);
    console.log(`- ${customers.length} customers created`);
    console.log(`- ${routes.length} routes created`);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  (async () => {
    try {
      await database.initialize();
      await seedDatabase();
      await database.close();
      process.exit(0);
    } catch (error) {
      console.error('Failed to seed database:', error);
      process.exit(1);
    }
  })();
}
