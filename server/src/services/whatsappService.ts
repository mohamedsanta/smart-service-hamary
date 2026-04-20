export interface WhatsAppPayload {
  phone: string;
  customerName: string;
  reference: string;
  quantity: number;
  language: string;
  invoiceUrl: string;
}

export function buildWhatsAppLink(payload: WhatsAppPayload): string {
  const number = payload.phone.replace(/[^0-9]/g, '');
  const message = payload.language === 'ar'
    ? `مرحباً سمارت سيرفس، قمت بحجز ${payload.quantity} رأس حَمَري. رقم حجزي: ${payload.reference}. الفاتورة: ${payload.invoiceUrl}`
    : `Hello Smart Service, I just booked ${payload.quantity} Hamary sheep. My reference is ${payload.reference}. Invoice: ${payload.invoiceUrl}`;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildBusinessWhatsAppLink(reference: string, quantity: number, language: string, invoiceUrl: string): string {
  const businessNumber = (process.env.COMPANY_WHATSAPP || '+966500000000').replace(/[^0-9]/g, '');
  const message = language === 'ar'
    ? `مرحباً، قمت بالحجز. رقمي: ${reference}. الكمية: ${quantity}. الفاتورة: ${invoiceUrl}`
    : `Hello, I made a booking. Reference: ${reference}. Quantity: ${quantity}. Invoice: ${invoiceUrl}`;

  return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
}
