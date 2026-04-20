import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import path from 'path';
import fs from 'fs';
import { generateInvoicePDF } from '../services/pdfService';

const router = Router();

router.get('/:reference', async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { reference: req.params.reference } });
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../storage/invoices');
  let invoicePath = booking.invoicePath || '';

  if (!invoicePath || !fs.existsSync(invoicePath)) {
    invoicePath = await generateInvoicePDF({ ...booking, preferredDate: booking.preferredDate, createdAt: booking.createdAt }, storagePath);
    await prisma.booking.update({ where: { id: booking.id }, data: { invoicePath } });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="invoice-${booking.reference}.pdf"`);
  fs.createReadStream(invoicePath).pipe(res);
});

router.get('/:reference/download', async (req: Request, res: Response) => {
  const booking = await prisma.booking.findUnique({ where: { reference: req.params.reference } });
  if (!booking) return res.status(404).json({ error: 'Not found' });

  const storagePath = process.env.STORAGE_PATH || path.join(__dirname, '../../storage/invoices');
  let invoicePath = booking.invoicePath || '';

  if (!invoicePath || !fs.existsSync(invoicePath)) {
    invoicePath = await generateInvoicePDF({ ...booking, preferredDate: booking.preferredDate, createdAt: booking.createdAt }, storagePath);
    await prisma.booking.update({ where: { id: booking.id }, data: { invoicePath } });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${booking.reference}.pdf"`);
  fs.createReadStream(invoicePath).pipe(res);
});

export default router;
