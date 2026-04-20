import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../db/prisma';

const router = Router();

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
});

router.post('/', async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const entry = await prisma.waitlist.create({ data: parsed.data });
  res.status(201).json(entry);
});

export default router;
