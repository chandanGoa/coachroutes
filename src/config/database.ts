import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../data/coachroutes.db');

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
      }
    });
  }

  async initialize(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));
    
    // Coaches table
    await run(`
      CREATE TABLE IF NOT EXISTS coaches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        capacity INTEGER NOT NULL,
        features TEXT,
        status TEXT DEFAULT 'available',
        registration_number TEXT UNIQUE,
        year INTEGER,
        mileage INTEGER,
        last_service_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Drivers table
    await run(`
      CREATE TABLE IF NOT EXISTS drivers (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        license_number TEXT UNIQUE NOT NULL,
        phone TEXT,
        email TEXT,
        status TEXT DEFAULT 'active',
        hire_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Customers table
    await run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL,
        company TEXT,
        address TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Routes table
    await run(`
      CREATE TABLE IF NOT EXISTS routes (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        distance_km REAL,
        estimated_duration_minutes INTEGER,
        waypoints TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    await run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        coach_id TEXT NOT NULL,
        driver_id TEXT,
        route_id TEXT,
        pickup_location TEXT NOT NULL,
        dropoff_location TEXT NOT NULL,
        pickup_datetime TEXT NOT NULL,
        return_datetime TEXT,
        passenger_count INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        total_cost REAL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (coach_id) REFERENCES coaches(id),
        FOREIGN KEY (driver_id) REFERENCES drivers(id),
        FOREIGN KEY (route_id) REFERENCES routes(id)
      )
    `);

    // Maintenance records table
    await run(`
      CREATE TABLE IF NOT EXISTS maintenance_records (
        id TEXT PRIMARY KEY,
        coach_id TEXT NOT NULL,
        service_type TEXT NOT NULL,
        description TEXT,
        cost REAL,
        service_date TEXT NOT NULL,
        next_service_date TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
      )
    `);

    console.log('Database tables initialized');
  }

  getDb(): sqlite3.Database {
    return this.db;
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const database = new Database();
