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

const TERRACOTTA: [number, number, number] = [176, 74, 42];
const CREAM:      [number, number, number] = [245, 236, 217];
const CREAM_DEEP: [number, number, number] = [237, 224, 196];
const INK:        [number, number, number] = [35, 23, 18];

const tierLabel: Record<string, string> = {
  earlyBird: 'Early Bird (1,200 SAR)',
  standard:  'Standard (1,500 SAR)',
  vip:       'VIP Premium (1,800 SAR)',
};

const deliveryLabel: Record<string, string> = {
  port:         'Pickup at Jeddah Port',
  home:         'Home Delivery (Jeddah area)',
  slaughterhouse: 'Delivery to Slaughterhouse',
};

export async function generateInvoicePDF(booking: BookingData, storagePath: string): Promise<string> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const margin = 14;

  // ── Header bar ──────────────────────────────────────────────
  doc.setFillColor(...TERRACOTTA);
  doc.rect(0, 0, W, 30, 'F');

  doc.setTextColor(...CREAM);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Service', margin, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Jeddah, Saudi Arabia', margin, 20);
  doc.text('info@smartservice.sa', margin, 26);

  // Badge top-right
  doc.setFontSize(8);
  doc.text('Authentic Hamary Sheep', W - margin, 20, { align: 'right' });
  doc.text('Kordofan, Sudan', W - margin, 26, { align: 'right' });

  // ── Invoice title ────────────────────────────────────────────
  doc.setTextColor(...TERRACOTTA);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFORMA INVOICE', margin, 42);

  // ── Reference & Date row ─────────────────────────────────────
  doc.setTextColor(...INK);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference:  ${booking.reference}`, margin, 50);
  doc.text(`Date:  ${new Date(booking.createdAt).toLocaleDateString('en-GB')}`, margin, 56);
  doc.text(`Preferred Date:  ${new Date(booking.preferredDate).toLocaleDateString('en-GB')}`, margin, 62);

  // Status badge
  doc.setFillColor(237, 244, 236);
  doc.setDrawColor(74, 107, 58);
  doc.roundedRect(W - margin - 30, 47, 30, 10, 2, 2, 'FD');
  doc.setTextColor(74, 107, 58);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PENDING PAYMENT', W - margin - 15, 53.5, { align: 'center' });

  // ── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(...TERRACOTTA);
  doc.setLineWidth(0.4);
  doc.line(margin, 67, W - margin, 67);

  // ── Customer details box ─────────────────────────────────────
  doc.setFillColor(...CREAM_DEEP);
  doc.roundedRect(margin, 71, W - margin * 2, 36, 2, 2, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TERRACOTTA);
  doc.text('CUSTOMER DETAILS', margin + 4, 78);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...INK);
  // Left column
  doc.text(`Name:`, margin + 4, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.customerName, margin + 22, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(`Phone:`, margin + 4, 91);
  doc.text(booking.phone, margin + 22, 91);
  doc.text(`Email:`, margin + 4, 97);
  doc.text(booking.email, margin + 22, 97);
  doc.text(`City:`, margin + 4, 103);
  doc.text(booking.city, margin + 22, 103);

  // Right column
  const col2 = 110;
  doc.text(`Address:`, col2, 85);
  doc.text(booking.address.slice(0, 35), col2 + 20, 85);
  doc.text(`Delivery:`, col2, 91);
  doc.text(deliveryLabel[booking.deliveryOption] || booking.deliveryOption, col2 + 20, 91);

  // ── Items table ───────────────────────────────────────────────
  const unitPrice = booking.subtotal / booking.quantity;

  autoTable(doc, {
    startY: 113,
    head: [['#', 'Description', 'Qty', 'Unit Price (SAR)', 'Subtotal (SAR)']],
    body: [[
      '1',
      `Hamary Sheep — ${tierLabel[booking.tier] || booking.tier}`,
      String(booking.quantity),
      unitPrice.toLocaleString('en', { minimumFractionDigits: 2 }),
      booking.subtotal.toLocaleString('en', { minimumFractionDigits: 2 }),
    ]],
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: TERRACOTTA, textColor: CREAM, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 90 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 35, halign: 'right' },
      4: { cellWidth: 35, halign: 'right' },
    },
    alternateRowStyles: { fillColor: CREAM },
    margin: { left: margin, right: margin },
  });

  const afterItems = (doc as any).lastAutoTable.finalY + 6;

  // ── Pricing summary ───────────────────────────────────────────
  const rows: [string, string][] = [
    ['Subtotal', `SAR ${booking.subtotal.toFixed(2)}`],
  ];
  if (booking.discount > 0) {
    rows.push(['Bulk Discount (7%)', `- SAR ${booking.discount.toFixed(2)}`]);
  }
  rows.push(['VAT (15%)', `SAR ${booking.vat.toFixed(2)}`]);
  rows.push(['TOTAL DUE', `SAR ${booking.total.toFixed(2)}`]);

  autoTable(doc, {
    startY: afterItems,
    body: rows,
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 50, fontStyle: 'normal', textColor: INK },
      1: { cellWidth: 40, halign: 'right', fontStyle: 'bold', textColor: INK },
    },
    bodyStyles: { fillColor: CREAM },
    didParseCell: (data) => {
      if (data.row.index === rows.length - 1) {
        data.cell.styles.fillColor = TERRACOTTA;
        data.cell.styles.textColor = CREAM;
        data.cell.styles.fontSize = 11;
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: W - margin - 95, right: margin },
  });

  const afterSummary = (doc as any).lastAutoTable.finalY + 8;

  // ── Bank transfer details ─────────────────────────────────────
  doc.setFillColor(...CREAM_DEEP);
  doc.roundedRect(margin, afterSummary, W - margin * 2, 58, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TERRACOTTA);
  doc.text('BANK TRANSFER DETAILS', margin + 4, afterSummary + 8);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...INK);

  const bankLeft = margin + 4;
  const bankVal = margin + 40;
  const lines: [string, string][] = [
    ['Beneficiary:', 'Smart Service'],
    ['Bank:', 'Saudi Awwal Bank (SAB)'],
    ['Account No.:', '033475500001'],
    ['IBAN:', 'SA6045000000033475500001'],
    ['SWIFT:', 'SABBSARI'],
    ['Transfer Reference:', booking.reference],
  ];
  lines.forEach(([label, value], i) => {
    const y = afterSummary + 16 + i * 6.5;
    doc.setFont('helvetica', 'bold');
    doc.text(label, bankLeft, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, bankVal, y);
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 80, 60);
  doc.text('* Please include your booking reference in the transfer description.', bankLeft, afterSummary + 55);

  const afterBank = afterSummary + 66;

  // ── Guaranteed specifications ─────────────────────────────────
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...TERRACOTTA);
  doc.text('GUARANTEED SPECIFICATIONS', margin, afterBank + 6);

  autoTable(doc, {
    startY: afterBank + 10,
    head: [['Specification', 'Details']],
    body: [
      ['Breed',   'Authentic Hamary from North Kordofan, Sudan'],
      ['Weight',  'Minimum 25 kg live weight'],
      ['Age',     'Not exceeding 1 year'],
      ['Health',  'Veterinary-inspected and certified healthy'],
      ['Halal',   'Fully compliant for Hajj / Udhiyah / Aqiqah sacrifice'],
      ['Origin',  'Natural pastures, Kordofan region'],
    ],
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: TERRACOTTA, textColor: CREAM, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: CREAM },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 142 },
    },
    margin: { left: margin, right: margin },
  });

  // ── Footer ────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.height;
  doc.setFillColor(...TERRACOTTA);
  doc.rect(0, pageH - 14, W, 14, 'F');
  doc.setTextColor(...CREAM);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'Smart Service  ·  Jeddah, Saudi Arabia  ·  Delivery within Jeddah and nearby areas only',
    W / 2, pageH - 6,
    { align: 'center' },
  );

  // ── Save ──────────────────────────────────────────────────────
  const filename = `invoice-${booking.reference}.pdf`;
  const outputPath = path.join(storagePath, filename);
  if (!fs.existsSync(storagePath)) fs.mkdirSync(storagePath, { recursive: true });
  fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  return outputPath;
}
