import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import prisma from '../db/prisma';
import { sendPaidConfirmationEmail } from '../services/emailService';
import { generateInvoicePDF } from '../services/pdfService';
import path from 'path';

const router = Router();
router.use(authMiddleware);

router.get('/bookings', async (req: Request, res: Response) => {
  const { status, search, sort = 'createdAt', order = 'desc' } = req.query as Record<string, string>;

  const where: any = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { reference: { contains: search } },
      { customerName: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { [sort]: order },
  });

  res.json(bookings.map((b) => ({ ...b, invoicePath: undefined })));
});

router.get('/bookings/:id', async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ error: 'Not found' });
  res.json({ ...booking, invoicePath: undefined });
});

router.patch('/bookings/:id/status', async (req: Request, res: Response) => {
  const { status, paymentRef, paidAt, sendEmail } = req.body;
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const updated = await prisma.booking.update({
    where: { id: req.params.id },
    data: {
      status,
      paymentRef: paymentRef || booking.paymentRef,
      paidAt: status === 'paid' ? (paidAt ? new Date(paidAt) : new Date()) : booking.paidAt,
      deliveredAt: status === 'delivered' ? new Date() : booking.deliveredAt,
    },
  });

  if (status === 'paid' && sendEmail) {
    sendPaidConfirmationEmail(booking.email, booking.customerName, booking.reference, booking.language)
      .catch((err) => console.error('[Email] paid confirmation failed:', err));
  }

  res.json({ ...updated, invoicePath: undefined });
});

router.post('/bookings/:id/resend-invoice', async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../storage/invoices');
  const publicUrl = process.env.PUBLIC_URL || 'http://localhost:3001';
  const invoiceUrl = `${publicUrl}/api/invoices/${booking.reference}`;

  let invoicePath = booking.invoicePath || '';
  if (!invoicePath) {
    invoicePath = await generateInvoicePDF({ ...booking, preferredDate: booking.preferredDate, createdAt: booking.createdAt }, storagePath);
    await prisma.booking.update({ where: { id: booking.id }, data: { invoicePath } });
  }

  const { sendBookingConfirmationEmail } = await import('../services/emailService');
  await sendBookingConfirmationEmail({
    to: booking.email,
    customerName: booking.customerName,
    reference: booking.reference,
    language: booking.language,
    invoicePath,
    total: booking.total,
  });

  const { buildBusinessWhatsAppLink } = await import('../services/whatsappService');
  const waLink = buildBusinessWhatsAppLink(booking.reference, booking.quantity, booking.language, invoiceUrl);

  res.json({ success: true, invoiceUrl, whatsappLink: waLink });
});

router.get('/stats', async (_req: Request, res: Response) => {
  const [allBookings, inventory] = await Promise.all([
    prisma.booking.findMany(),
    prisma.inventoryCounter.findUnique({ where: { id: 1 } }),
  ]);

  const totalBookings = allBookings.length;
  const totalSheep = allBookings.reduce((s, b) => s + b.quantity, 0);
  const totalRevenue = allBookings.reduce((s, b) => s + b.total, 0);
  const paidRevenue = allBookings.filter((b) => b.status === 'paid' || b.status === 'delivered').reduce((s, b) => s + b.total, 0);

  // Orders per day for last 30 days
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentBookings = allBookings.filter((b) => new Date(b.createdAt) >= thirtyDaysAgo);
  const dailyMap: Record<string, { orders: number; sheep: number }> = {};

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    dailyMap[key] = { orders: 0, sheep: 0 };
  }

  for (const b of recentBookings) {
    const key = new Date(b.createdAt).toISOString().slice(0, 10);
    if (dailyMap[key]) {
      dailyMap[key].orders++;
      dailyMap[key].sheep += b.quantity;
    }
  }

  const dailyData = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }));

  res.json({
    totalBookings,
    totalSheep,
    totalCapacity: inventory?.totalCapacity || 450,
    totalRevenue,
    paidRevenue,
    dailyData,
  });
});

router.get('/export', async (_req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });

  const rows = bookings.map((b) => ({
    reference: b.reference,
    date: new Date(b.createdAt).toISOString().slice(0, 10),
    customerName: b.customerName,
    phone: b.phone,
    email: b.email,
    city: b.city,
    quantity: b.quantity,
    tier: b.tier,
    deliveryOption: b.deliveryOption,
    subtotal: b.subtotal,
    discount: b.discount,
    vat: b.vat,
    total: b.total,
    status: b.status,
    paymentRef: b.paymentRef || '',
  }));

  const header = Object.keys(rows[0] || {}).join(',');
  const csvRows = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(','));
  const csv = [header, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
  res.send(csv);
});

export default router;
