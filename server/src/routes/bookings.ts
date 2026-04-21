import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';
import { generateBookingRef } from '../utils/bookingRef';
import { reserveInventory } from '../services/inventoryService';
import { generateInvoicePDF } from '../services/pdfService';
import { sendBookingConfirmationEmail } from '../services/emailService';
import { buildBusinessWhatsAppLink } from '../services/whatsappService';
import path from 'path';

const router = Router();

const bookingSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  whatsappOptIn: z.boolean().default(true),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().optional(),
  quantity: z.number().int().min(1).max(20),
  tier: z.enum(['earlyBird', 'standard', 'vip']),
  deliveryOption: z.enum(['port', 'home', 'slaughterhouse']),
  preferredDate: z.string(),
  subtotal: z.number(),
  discount: z.number(),
  vat: z.number(),
  total: z.number(),
  language: z.enum(['en', 'ar']).default('en'),
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;

  try {
    await reserveInventory(data.quantity);
  } catch (err: any) {
    return res.status(409).json({ error: err.message });
  }

  const reference = await generateBookingRef();
  const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../storage/invoices');

  const booking = await prisma.booking.create({
    data: {
      reference,
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      whatsappOptIn: data.whatsappOptIn,
      city: data.city,
      address: data.address,
      notes: data.notes,
      quantity: data.quantity,
      tier: data.tier,
      deliveryOption: data.deliveryOption,
      preferredDate: new Date(data.preferredDate),
      subtotal: data.subtotal,
      discount: data.discount,
      vat: data.vat,
      total: data.total,
      language: data.language,
    },
  });

  let invoicePath = '';
  try {
    invoicePath = await generateInvoicePDF({ ...booking, preferredDate: booking.preferredDate, createdAt: booking.createdAt }, storagePath);
    await prisma.booking.update({ where: { id: booking.id }, data: { invoicePath } });
  } catch (err) {
    console.error('[PDF] Failed to generate invoice:', err);
  }

  const publicUrl = process.env.PUBLIC_URL || 'http://localhost:3001';
  const invoiceUrl = `${publicUrl}/api/invoices/${reference}`;

  // Send email regardless of whether PDF was generated — attach PDF only if available
  sendBookingConfirmationEmail({
    to: booking.email,
    customerName: booking.customerName,
    reference: booking.reference,
    language: booking.language,
    invoicePath,
    total: booking.total,
    invoiceUrl,
  }).catch((err) => console.error('[Email] Failed:', err));

  const waLink = buildBusinessWhatsAppLink(reference, data.quantity, data.language, invoiceUrl);

  res.status(201).json({
    booking: { ...booking, invoicePath: undefined },
    invoiceUrl,
    whatsappLink: waLink,
  });
});

router.get('/ref/:reference', async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { reference: req.params.reference } });
  if (!booking) return res.status(404).json({ error: 'Not found' });
  res.json({ ...booking, invoicePath: undefined });
});

export default router;
