import prisma from '../db/prisma';

export async function getInventory() {
  const counter = await prisma.inventoryCounter.findUnique({ where: { id: 1 } });
  if (!counter) throw new Error('Inventory not initialized');
  return {
    totalCapacity: counter.totalCapacity,
    reserved: counter.reserved,
    available: counter.totalCapacity - counter.reserved,
  };
}

export async function reserveInventory(quantity: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const counter = await tx.inventoryCounter.findUnique({ where: { id: 1 } });
    if (!counter) throw new Error('Inventory not initialized');
    const available = counter.totalCapacity - counter.reserved;
    if (quantity > available) throw new Error('Not enough inventory available');
    await tx.inventoryCounter.update({
      where: { id: 1 },
      data: { reserved: { increment: quantity } },
    });
  });
}

export async function adjustInventory(reserved: number): Promise<void> {
  await prisma.inventoryCounter.update({
    where: { id: 1 },
    data: { reserved },
  });
}
