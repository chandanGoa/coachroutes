export interface Coach {
  id: string;
  name: string;
  type: string;
  capacity: number;
  features?: string;
  status: 'available' | 'booked' | 'maintenance' | 'out-of-service';
  registration_number?: string;
  year?: number;
  mileage?: number;
  last_service_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  license_number: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive' | 'on-leave';
  hire_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  distance_km?: number;
  estimated_duration_minutes?: number;
  waypoints?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  coach_id: string;
  driver_id?: string;
  route_id?: string;
  pickup_location: string;
  dropoff_location: string;
  pickup_datetime: string;
  return_datetime?: string;
  passenger_count: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  total_cost?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  coach_id: string;
  service_type: string;
  description?: string;
  cost?: number;
  service_date: string;
  next_service_date?: string;
  created_at: string;
}
