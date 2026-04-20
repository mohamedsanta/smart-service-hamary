import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash: hash },
    create: { username, passwordHash: hash },
  });
  console.log(`[Seed] Admin created: ${username}`);

  await prisma.inventoryCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, totalCapacity: 450, reserved: 3 },
  });
  console.log('[Seed] Inventory initialized: 450 capacity, 3 reserved');

  const samples = [
    {
      reference: 'SS-HAM-2026-0001',
      customerName: 'Ahmed Al-Rashidi',
      phone: '+966501234567',
      email: 'ahmed@example.com',
      city: 'Jeddah Central',
      address: 'King Fahd Road, Building 12, Apt 3',
      quantity: 1,
      tier: 'earlyBird',
      deliveryOption: 'home',
      preferredDate: new Date('2026-05-20'),
      subtotal: 1200,
      discount: 0,
      vat: 180,
      total: 1380,
      status: 'paid',
      paidAt: new Date('2026-04-10'),
      language: 'ar',
    },
    {
      reference: 'SS-HAM-2026-0002',
      customerName: 'Mohammed Al-Ghamdi',
      phone: '+966509876543',
      email: 'mghamdi@example.com',
      city: 'Al Rawdah',
      address: 'Palestine Street, Villa 7',
      quantity: 5,
      tier: 'standard',
      deliveryOption: 'port',
      preferredDate: new Date('2026-05-18'),
      subtotal: 7500,
      discount: 525,
      vat: 1046.25,
      total: 8021.25,
      status: 'pending',
      language: 'ar',
    },
    {
      reference: 'SS-HAM-2026-0003',
      customerName: 'Khalid bin Saad',
      phone: '+966555123456',
      email: 'khalid@example.com',
      city: 'Obhur North',
      address: 'Corniche Road, Villa 22',
      quantity: 2,
      tier: 'vip',
      deliveryOption: 'slaughterhouse',
      preferredDate: new Date('2026-05-22'),
      subtotal: 3600,
      discount: 0,
      vat: 540,
      total: 4140,
      status: 'delivered',
      paidAt: new Date('2026-04-08'),
      deliveredAt: new Date('2026-05-22'),
      language: 'en',
    },
  ];

  for (const s of samples) {
    await prisma.booking.upsert({
      where: { reference: s.reference },
      update: {},
      create: s as any,
    });
  }
  console.log('[Seed] 3 sample bookings created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
