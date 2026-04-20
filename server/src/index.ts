import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import adminRoutes from './routes/admin';
import inventoryRoutes from './routes/inventory';
import invoiceRoutes from './routes/invoices';
import waitlistRoutes from './routes/waitlist';

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/bookings', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/waitlist', waitlistRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});

export default app;
