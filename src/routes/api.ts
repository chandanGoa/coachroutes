import express, { Request, Response, NextFunction } from 'express';
import { CoachService, DriverService, BookingService, CustomerService, RouteService } from '../services/index';

const router = express.Router();
const coachService = new CoachService();
const driverService = new DriverService();
const bookingService = new BookingService();
const customerService = new CustomerService();
const routeService = new RouteService();

// Error handler wrapper
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Coach routes
router.get('/coaches', asyncHandler(async (req: Request, res: Response) => {
  const coaches = await coachService.getAll();
  res.json(coaches);
}));

router.get('/coaches/:id', asyncHandler(async (req: Request, res: Response) => {
  const coach = await coachService.getById(req.params.id);
  if (!coach) {
    return res.status(404).json({ error: 'Coach not found' });
  }
  res.json(coach);
}));

router.post('/coaches', asyncHandler(async (req: Request, res: Response) => {
  const coach = await coachService.create(req.body);
  res.status(201).json(coach);
}));

router.put('/coaches/:id', asyncHandler(async (req: Request, res: Response) => {
  const coach = await coachService.update(req.params.id, req.body);
  if (!coach) {
    return res.status(404).json({ error: 'Coach not found' });
  }
  res.json(coach);
}));

router.delete('/coaches/:id', asyncHandler(async (req: Request, res: Response) => {
  const success = await coachService.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Coach not found' });
  }
  res.status(204).send();
}));

router.get('/coaches/available/:startDate/:endDate', asyncHandler(async (req: Request, res: Response) => {
  const coaches = await coachService.getAvailable(req.params.startDate, req.params.endDate);
  res.json(coaches);
}));

// Driver routes
router.get('/drivers', asyncHandler(async (req: Request, res: Response) => {
  const drivers = await driverService.getAll();
  res.json(drivers);
}));

router.get('/drivers/:id', asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.getById(req.params.id);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(driver);
}));

router.post('/drivers', asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.create(req.body);
  res.status(201).json(driver);
}));

router.put('/drivers/:id', asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.update(req.params.id, req.body);
  if (!driver) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.json(driver);
}));

router.delete('/drivers/:id', asyncHandler(async (req: Request, res: Response) => {
  const success = await driverService.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Driver not found' });
  }
  res.status(204).send();
}));

router.get('/drivers/available/:date', asyncHandler(async (req: Request, res: Response) => {
  const drivers = await driverService.getAvailable(req.params.date);
  res.json(drivers);
}));

// Booking routes
router.get('/bookings', asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getAll();
  res.json(bookings);
}));

router.get('/bookings/:id', asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.getById(req.params.id);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
}));

router.post('/bookings', asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.create(req.body);
  res.status(201).json(booking);
}));

router.put('/bookings/:id', asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.update(req.params.id, req.body);
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.json(booking);
}));

router.delete('/bookings/:id', asyncHandler(async (req: Request, res: Response) => {
  const success = await bookingService.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  res.status(204).send();
}));

router.get('/bookings/customer/:customerId', asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getByCustomer(req.params.customerId);
  res.json(bookings);
}));

router.get('/bookings/date/:startDate/:endDate', asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.getByDateRange(req.params.startDate, req.params.endDate);
  res.json(bookings);
}));

// Customer routes
router.get('/customers', asyncHandler(async (req: Request, res: Response) => {
  const customers = await customerService.getAll();
  res.json(customers);
}));

router.get('/customers/:id', asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.getById(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
}));

router.post('/customers', asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.create(req.body);
  res.status(201).json(customer);
}));

router.put('/customers/:id', asyncHandler(async (req: Request, res: Response) => {
  const customer = await customerService.update(req.params.id, req.body);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
}));

router.delete('/customers/:id', asyncHandler(async (req: Request, res: Response) => {
  const success = await customerService.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.status(204).send();
}));

// Route routes
router.get('/routes', asyncHandler(async (req: Request, res: Response) => {
  const routes = await routeService.getAll();
  res.json(routes);
}));

router.get('/routes/:id', asyncHandler(async (req: Request, res: Response) => {
  const route = await routeService.getById(req.params.id);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);
}));

router.post('/routes', asyncHandler(async (req: Request, res: Response) => {
  const route = await routeService.create(req.body);
  res.status(201).json(route);
}));

router.put('/routes/:id', asyncHandler(async (req: Request, res: Response) => {
  const route = await routeService.update(req.params.id, req.body);
  if (!route) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.json(route);
}));

router.delete('/routes/:id', asyncHandler(async (req: Request, res: Response) => {
  const success = await routeService.delete(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Route not found' });
  }
  res.status(204).send();
}));

export default router;
