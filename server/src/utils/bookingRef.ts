import prisma from '../db/prisma';

export async function generateBookingRef(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.booking.count();
  const seq = String(count + 1).padStart(4, '0');
  return `SS-HAM-${year}-${seq}`;
}
