import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import path from 'path';
import fs from 'fs';

interface BookingData {
  reference: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  quantity: number;
  tier: string;
  deliveryOption: string;
  preferredDate: Date;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  language: string;
  createdAt: Date;
}

const tierLabels: Record<string, { en: string; ar: string }> = {
  earlyBird: { en: 'Early Bird', ar: 'حجز مبكر' },
  standard: { en: 'Standard', ar: 'قياسي' },
  vip: { en: 'VIP Premium', ar: 'فاخر VIP' },
};

const deliveryLabels: Record<string, { en: string; ar: string }> = {
  port: { en: 'Pickup at Jeddah Port', ar: 'استلام من ميناء جدة' },
  home: { en: 'Home Delivery (Jeddah area)', ar: 'توصيل للمنزل (منطقة جدة)' },
  slaughterhouse: { en: 'Delivery to Slaughterhouse', ar: 'توصيل إلى المسلخ' },
};

export async function generateInvoicePDF(booking: BookingData, storagePath: string): Promise<string> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const tierPrice = booking.subtotal / booking.quantity;

  // ─── Header ───────────────────────────────────────────────
  doc.setFillColor(176, 74, 42);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(245, 236, 217);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Service', 14, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Jeddah, Saudi Arabia | info@smartservice.sa', 14, 20);
  doc.text('سمارت سيرفس | جدة، المملكة العربية السعودية', 210 - 14, 20, { align: 'right' });

  // ─── Invoice title ─────────────────────────────────────────
  doc.setTextColor(176, 74, 42);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFORMA INVOICE', 14, 38);
  doc.setFontSize(10);
  doc.text('فاتورة أولية', 210 - 14, 38, { align: 'right' });

  // ─── Reference & Date ──────────────────────────────────────
  doc.setTextColor(35, 23, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference: ${booking.reference}`, 14, 46);
  doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString('en-SA')}`, 14, 52);
  doc.text(`رقم الحجز: ${booking.reference}`, 210 - 14, 46, { align: 'right' });
  doc.text(`التاريخ: ${new Date(booking.createdAt).toLocaleDateString('ar-SA')}`, 210 - 14, 52, { align: 'right' });

  // ─── Customer details ──────────────────────────────────────
  doc.setFillColor(237, 224, 196);
  doc.roundedRect(14, 57, 182, 32, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS', 18, 64);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${booking.customerName}`, 18, 70);
  doc.text(`Phone: ${booking.phone}`, 18, 76);
  doc.text(`Email: ${booking.email}`, 18, 82);
  doc.text(`City: ${booking.city}`, 100, 70);
  doc.text(`Address: ${booking.address.slice(0, 40)}`, 100, 76);
  doc.text(`Delivery: ${deliveryLabels[booking.deliveryOption]?.en || booking.deliveryOption}`, 100, 82);

  // ─── Items table ───────────────────────────────────────────
  autoTable(doc, {
    startY: 95,
    head: [['Item / المنتج', 'Qty / الكمية', 'Unit Price / سعر الوحدة', 'Subtotal / الإجمالي الفرعي']],
    body: [
      [
        `Hamary Sheep (${tierLabels[booking.tier]?.en || booking.tier})\nحَمَري (${tierLabels[booking.tier]?.ar || booking.tier})`,
        booking.quantity,
        `SAR ${tierPrice.toLocaleString('en', { minimumFractionDigits: 2 })}`,
        `SAR ${booking.subtotal.toLocaleString('en', { minimumFractionDigits: 2 })}`,
      ],
    ],
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [176, 74, 42], textColor: [245, 236, 217], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 236, 217] },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 6;

  // ─── Pricing summary ──────────────────────────────────────
  const summaryRows = [
    ['Subtotal / الإجمالي الفرعي', `SAR ${booking.subtotal.toFixed(2)}`],
    ['Bulk Discount / خصم الكمية', booking.discount > 0 ? `- SAR ${booking.discount.toFixed(2)}` : 'N/A'],
    ['VAT 15% / ضريبة القيمة المضافة 15%', `SAR ${booking.vat.toFixed(2)}`],
    ['TOTAL / الإجمالي الكلي', `SAR ${booking.total.toFixed(2)}`],
  ];

  autoTable(doc, {
    startY: finalY,
    body: summaryRows,
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' } },
    bodyStyles: { fillColor: [245, 236, 217] },
    margin: { left: 80, right: 14 },
    didDrawCell: (data) => {
      if (data.row.index === 3) {
        doc.setFillColor(176, 74, 42);
      }
    },
  });

  const afterSummary = (doc as any).lastAutoTable.finalY + 8;

  // ─── Bank details ──────────────────────────────────────────
  doc.setFillColor(237, 224, 196);
  doc.roundedRect(14, afterSummary, 182, 46, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(176, 74, 42);
  doc.text('BANK TRANSFER DETAILS / تفاصيل التحويل البنكي', 18, afterSummary + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(35, 23, 18);
  // TODO: Replace placeholders with real Smart Service bank details
  doc.text('Beneficiary: Smart Service', 18, afterSummary + 14);
  doc.text('Bank: [PLACEHOLDER — Bank Name]', 18, afterSummary + 20);
  doc.text('IBAN: SA00 0000 0000 0000 0000 0000', 18, afterSummary + 26);
  doc.text('SWIFT: [PLACEHOLDER]', 18, afterSummary + 32);
  doc.text(`Reference in transfer: ${booking.reference}`, 18, afterSummary + 38);
  doc.text('يرجى استخدام رقم الحجز في وصف التحويل', 210 - 18, afterSummary + 38, { align: 'right' });

  const afterBank = afterSummary + 54;

  // ─── Guaranteed specifications ────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(176, 74, 42);
  doc.text('GUARANTEED SPECIFICATIONS / المواصفات المضمونة', 14, afterBank + 6);

  autoTable(doc, {
    startY: afterBank + 10,
    head: [['Specification', 'English', 'Arabic']],
    body: [
      ['Breed', 'Authentic Hamary from North Kordofan, Sudan', 'حَمَري أصيل من شمال كردفان، السودان'],
      ['Weight', 'Min 25 kg live weight', '25 كجم فأكثر (حي)'],
      ['Age', 'Not exceeding 1 year', 'لا يتجاوز سنة واحدة'],
      ['Health', 'Vet-inspected, certified healthy', 'فحص بيطري معتمد'],
      ['Sacrifice', 'Hajj / Udhiyah / Aqiqah compliant', 'مستوفٍ لشروط الأضحية / الهدي / العقيقة'],
      ['Origin', 'Natural Kordofan pastures', 'مراعٍ طبيعية في كردفان'],
    ],
    styles: { fontSize: 8 },
    headStyles: { fillColor: [176, 74, 42], textColor: [245, 236, 217] },
    alternateRowStyles: { fillColor: [245, 236, 217] },
    margin: { left: 14, right: 14 },
  });

  // ─── Footer ────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(176, 74, 42);
  doc.rect(0, pageH - 12, 210, 12, 'F');
  doc.setTextColor(245, 236, 217);
  doc.setFontSize(8);
  doc.text('Smart Service · Jeddah, Saudi Arabia · Delivery within Jeddah and nearby areas only', 105, pageH - 5, { align: 'center' });

  // ─── Save ──────────────────────────────────────────────────
  const filename = `invoice-${booking.reference}.pdf`;
  const outputPath = path.join(storagePath, filename);
  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}
