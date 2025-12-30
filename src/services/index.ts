import { database } from '../config/database';
import { Coach, Driver, Customer, Route, Booking, MaintenanceRecord } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export class CoachService {
  async create(coach: Omit<Coach, 'id' | 'created_at' | 'updated_at'>): Promise<Coach> {
    const db = database.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO coaches (id, name, type, capacity, features, status, registration_number, year, mileage, last_service_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, coach.name, coach.type, coach.capacity, coach.features, coach.status, coach.registration_number, coach.year, coach.mileage, coach.last_service_date, now, now],
        function(err) {
          if (err) reject(err);
          else {
            resolve({ ...coach, id, created_at: now, updated_at: now } as Coach);
          }
        }
      );
    });
  }

  async getAll(): Promise<Coach[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM coaches ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Coach[]);
      });
    });
  }

  async getById(id: string): Promise<Coach | null> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM coaches WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Coach || null);
      });
    });
  }

  async update(id: string, updates: Partial<Coach>): Promise<Coach | null> {
    const db = database.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
    const values = fields.map(k => (updates as any)[k]);
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE coaches SET ${setClause}, updated_at = ? WHERE id = ?`,
        [...values, now, id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) resolve(null);
          else {
            db.get('SELECT * FROM coaches WHERE id = ?', [id], (err, row) => {
              if (err) reject(err);
              else resolve(row as Coach);
            });
          }
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM coaches WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  async getAvailable(startDate: string, endDate: string): Promise<Coach[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM coaches 
         WHERE status = 'available' 
         AND id NOT IN (
           SELECT coach_id FROM bookings 
           WHERE status IN ('confirmed', 'in-progress')
           AND (
             (pickup_datetime BETWEEN ? AND ?)
             OR (return_datetime BETWEEN ? AND ?)
             OR (pickup_datetime <= ? AND return_datetime >= ?)
           )
         )`,
        [startDate, endDate, startDate, endDate, startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Coach[]);
        }
      );
    });
  }
}

export class DriverService {
  async create(driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>): Promise<Driver> {
    const db = database.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO drivers (id, first_name, last_name, license_number, phone, email, status, hire_date, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, driver.first_name, driver.last_name, driver.license_number, driver.phone, driver.email, driver.status, driver.hire_date, now, now],
        function(err) {
          if (err) reject(err);
          else resolve({ ...driver, id, created_at: now, updated_at: now } as Driver);
        }
      );
    });
  }

  async getAll(): Promise<Driver[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM drivers ORDER BY last_name, first_name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Driver[]);
      });
    });
  }

  async getById(id: string): Promise<Driver | null> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM drivers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Driver || null);
      });
    });
  }

  async update(id: string, updates: Partial<Driver>): Promise<Driver | null> {
    const db = database.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
    const values = fields.map(k => (updates as any)[k]);
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE drivers SET ${setClause}, updated_at = ? WHERE id = ?`,
        [...values, now, id],
        async function(err) {
          if (err) reject(err);
          else if (this.changes === 0) resolve(null);
          else {
            const driver = await new Promise<Driver>((res, rej) => {
              db.get('SELECT * FROM drivers WHERE id = ?', [id], (err, row) => {
                if (err) rej(err);
                else res(row as Driver);
              });
            });
            resolve(driver);
          }
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM drivers WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  async getAvailable(date: string): Promise<Driver[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM drivers 
         WHERE status = 'active' 
         AND id NOT IN (
           SELECT driver_id FROM bookings 
           WHERE driver_id IS NOT NULL
           AND status IN ('confirmed', 'in-progress')
           AND ? BETWEEN DATE(pickup_datetime) AND DATE(COALESCE(return_datetime, pickup_datetime))
         )`,
        [date],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Driver[]);
        }
      );
    });
  }
}

export class BookingService {
  async create(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> {
    const db = database.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO bookings (id, customer_id, coach_id, driver_id, route_id, pickup_location, dropoff_location, 
         pickup_datetime, return_datetime, passenger_count, status, total_cost, notes, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, booking.customer_id, booking.coach_id, booking.driver_id, booking.route_id, booking.pickup_location,
         booking.dropoff_location, booking.pickup_datetime, booking.return_datetime, booking.passenger_count,
         booking.status, booking.total_cost, booking.notes, now, now],
        function(err) {
          if (err) reject(err);
          else resolve({ ...booking, id, created_at: now, updated_at: now } as Booking);
        }
      );
    });
  }

  async getAll(): Promise<Booking[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM bookings ORDER BY pickup_datetime DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Booking[]);
      });
    });
  }

  async getById(id: string): Promise<Booking | null> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Booking || null);
      });
    });
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const db = database.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
    const values = fields.map(k => (updates as any)[k]);
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE bookings SET ${setClause}, updated_at = ? WHERE id = ?`,
        [...values, now, id],
        async function(err) {
          if (err) reject(err);
          else if (this.changes === 0) resolve(null);
          else {
            const booking = await new Promise<Booking>((res, rej) => {
              db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
                if (err) rej(err);
                else res(row as Booking);
              });
            });
            resolve(booking);
          }
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM bookings WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  async getByCustomer(customerId: string): Promise<Booking[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM bookings WHERE customer_id = ? ORDER BY pickup_datetime DESC',
        [customerId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Booking[]);
        }
      );
    });
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM bookings 
         WHERE pickup_datetime BETWEEN ? AND ?
         ORDER BY pickup_datetime`,
        [startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows as Booking[]);
        }
      );
    });
  }
}

export class CustomerService {
  async create(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const db = database.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO customers (id, name, email, phone, company, address, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, customer.name, customer.email, customer.phone, customer.company, customer.address, now, now],
        function(err) {
          if (err) reject(err);
          else resolve({ ...customer, id, created_at: now, updated_at: now } as Customer);
        }
      );
    });
  }

  async getAll(): Promise<Customer[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM customers ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Customer[]);
      });
    });
  }

  async getById(id: string): Promise<Customer | null> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Customer || null);
      });
    });
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    const db = database.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
    const values = fields.map(k => (updates as any)[k]);
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE customers SET ${setClause}, updated_at = ? WHERE id = ?`,
        [...values, now, id],
        async function(err) {
          if (err) reject(err);
          else if (this.changes === 0) resolve(null);
          else {
            const customer = await new Promise<Customer>((res, rej) => {
              db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
                if (err) rej(err);
                else res(row as Customer);
              });
            });
            resolve(customer);
          }
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM customers WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}

export class RouteService {
  async create(route: Omit<Route, 'id' | 'created_at' | 'updated_at'>): Promise<Route> {
    const db = database.getDb();
    const id = uuidv4();
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO routes (id, name, origin, destination, distance_km, estimated_duration_minutes, waypoints, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, route.name, route.origin, route.destination, route.distance_km, route.estimated_duration_minutes, route.waypoints, now, now],
        function(err) {
          if (err) reject(err);
          else resolve({ ...route, id, created_at: now, updated_at: now } as Route);
        }
      );
    });
  }

  async getAll(): Promise<Route[]> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM routes ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows as Route[]);
      });
    });
  }

  async getById(id: string): Promise<Route | null> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM routes WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row as Route || null);
      });
    });
  }

  async update(id: string, updates: Partial<Route>): Promise<Route | null> {
    const db = database.getDb();
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'created_at');
    const values = fields.map(k => (updates as any)[k]);
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE routes SET ${setClause}, updated_at = ? WHERE id = ?`,
        [...values, now, id],
        async function(err) {
          if (err) reject(err);
          else if (this.changes === 0) resolve(null);
          else {
            const route = await new Promise<Route>((res, rej) => {
              db.get('SELECT * FROM routes WHERE id = ?', [id], (err, row) => {
                if (err) rej(err);
                else res(row as Route);
              });
            });
            resolve(route);
          }
        }
      );
    });
  }

  async delete(id: string): Promise<boolean> {
    const db = database.getDb();
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM routes WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
}
