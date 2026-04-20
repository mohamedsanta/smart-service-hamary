import { company } from '../config/company';

export function buildWhatsAppLink(reference: string, quantity: number, language: string, invoiceUrl: string): string {
  const message = language === 'ar'
    ? `مرحباً سمارت سيرفس، قمت بحجز ${quantity} رأس حَمَري. رقم حجزي: ${reference}. الفاتورة: ${invoiceUrl}`
    : `Hello Smart Service, I just booked ${quantity} Hamary sheep. My reference is ${reference}. Invoice: ${invoiceUrl}`;
  return `https://wa.me/${company.whatsappRaw}?text=${encodeURIComponent(message)}`;
}
