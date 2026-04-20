import { Router, Request, Response } from 'express';
import { getInventory, adjustInventory } from '../services/inventoryService';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const inventory = await getInventory();
  res.json(inventory);
});

router.patch('/', authMiddleware, async (req: Request, res: Response) => {
  const { reserved } = req.body;
  if (typeof reserved !== 'number') return res.status(400).json({ error: 'reserved must be a number' });
  await adjustInventory(reserved);
  const updated = await getInventory();
  res.json(updated);
});

export default router;
