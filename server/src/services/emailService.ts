import nodemailer from 'nodemailer';
import path from 'path';

export interface EmailPayload {
  to: string;
  customerName: string;
  reference: string;
  language: string;
  invoicePath: string;
  total: number;
}

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendBookingConfirmationEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[EmailService] SMTP not configured — skipping email send');
    return;
  }

  const isAr = payload.language === 'ar';
  const subject = isAr
    ? `تأكيد حجزك — ${payload.reference} | سمارت سيرفس`
    : `Booking Confirmed — ${payload.reference} | Smart Service`;

  const html = isAr
    ? `<div dir="rtl" style="font-family: Arial, sans-serif; color: #231712;">
        <h2 style="color:#b04a2a;">شكراً لحجزك، ${payload.customerName}</h2>
        <p>رقم الحجز: <strong>${payload.reference}</strong></p>
        <p>الإجمالي: <strong>${payload.total.toLocaleString('ar-SA')} ريال سعودي</strong></p>
        <p>يرجى إتمام التحويل البنكي وإرسال صورة الإيصال عبر واتساب.</p>
        <p>فاتورتك مرفقة بهذا البريد الإلكتروني.</p>
        <hr/>
        <p style="color:#4a342a; font-size:12px;">سمارت سيرفس — جدة، المملكة العربية السعودية</p>
      </div>`
    : `<div style="font-family: Georgia, serif; color: #231712;">
        <h2 style="color:#b04a2a;">Thank you for booking, ${payload.customerName}</h2>
        <p>Booking Reference: <strong>${payload.reference}</strong></p>
        <p>Total: <strong>SAR ${payload.total.toLocaleString()}</strong></p>
        <p>Please complete the bank transfer and send a photo of the receipt via WhatsApp.</p>
        <p>Your invoice is attached to this email.</p>
        <hr/>
        <p style="color:#4a342a; font-size:12px;">Smart Service — Jeddah, Saudi Arabia</p>
      </div>`;

  const transport = createTransport();
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'Smart Service <noreply@smartservice.sa>',
    to: payload.to,
    subject,
    html,
    attachments: [
      {
        filename: `invoice-${payload.reference}.pdf`,
        path: payload.invoicePath,
      },
    ],
  });
}

export async function sendPaidConfirmationEmail(to: string, customerName: string, reference: string, language: string): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return;

  const isAr = language === 'ar';
  const subject = isAr
    ? `تم استلام دفعتك — ${reference}`
    : `Payment Received — ${reference}`;

  const html = isAr
    ? `<div dir="rtl" style="font-family:Arial;color:#231712;"><h2 style="color:#4a6b3a;">تم استلام دفعتك بنجاح</h2><p>شكراً ${customerName}، رقم حجزك: <strong>${reference}</strong></p></div>`
    : `<div style="font-family:Georgia;color:#231712;"><h2 style="color:#4a6b3a;">Payment Received</h2><p>Thank you ${customerName}, your booking <strong>${reference}</strong> is now confirmed as paid.</p></div>`;

  const transport = createTransport();
  await transport.sendMail({
    from: process.env.EMAIL_FROM || 'Smart Service <noreply@smartservice.sa>',
    to,
    subject,
    html,
  });
}
