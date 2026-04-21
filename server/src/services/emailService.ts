import { Resend } from 'resend';
import fs from 'fs';

export interface EmailPayload {
  to: string;
  customerName: string;
  reference: string;
  language: string;
  invoicePath: string;
  total: number;
}

const OWNER_EMAIL = 'mo.businessdeal@gmail.com';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getFromAddress() {
  // Use verified domain sender if set, otherwise Resend's shared sandbox address
  return process.env.EMAIL_FROM || 'Smart Service <onboarding@resend.dev>';
}

export async function sendBookingConfirmationEmail(payload: EmailPayload): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log('[EmailService] RESEND_API_KEY not configured — skipping email send');
    return;
  }

  const isAr = payload.language === 'ar';
  const subject = isAr
    ? `تأكيد حجزك — ${payload.reference} | سمارت سيرفس`
    : `Booking Confirmed — ${payload.reference} | Smart Service`;

  const html = isAr
    ? `<div dir="rtl" style="font-family: Arial, sans-serif; color: #231712; max-width:600px; margin:0 auto;">
        <div style="background:#b04a2a; padding:20px 24px; border-radius:8px 8px 0 0;">
          <h1 style="color:#f5ecd9; margin:0; font-size:22px;">سمارت سيرفس</h1>
        </div>
        <div style="padding:24px; border:1px solid #ede0c4; border-top:none; border-radius:0 0 8px 8px;">
          <h2 style="color:#b04a2a;">شكراً لحجزك، ${payload.customerName}</h2>
          <p>تم تأكيد حجزك بنجاح. تفاصيل حجزك:</p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0;">
            <tr style="background:#ede0c4;"><td style="padding:10px; font-weight:bold;">رقم الحجز</td><td style="padding:10px;">${payload.reference}</td></tr>
            <tr><td style="padding:10px; font-weight:bold;">الإجمالي المطلوب</td><td style="padding:10px; color:#b04a2a; font-weight:bold;">${payload.total.toLocaleString('ar-SA')} ريال سعودي</td></tr>
          </table>
          <p style="background:#fff8ee; border-right:4px solid #b04a2a; padding:12px; border-radius:4px;">
            يرجى إتمام التحويل البنكي وإرسال صورة الإيصال عبر واتساب مع ذكر رقم الحجز.
          </p>
          <p>فاتورتك الأولية مرفقة بهذا البريد الإلكتروني.</p>
          <hr style="border:none; border-top:1px solid #ede0c4; margin:20px 0;"/>
          <p style="color:#4a342a; font-size:12px; text-align:center;">سمارت سيرفس — جدة، المملكة العربية السعودية</p>
        </div>
      </div>`
    : `<div style="font-family: Georgia, serif; color: #231712; max-width:600px; margin:0 auto;">
        <div style="background:#b04a2a; padding:20px 24px; border-radius:8px 8px 0 0;">
          <h1 style="color:#f5ecd9; margin:0; font-size:22px;">Smart Service</h1>
        </div>
        <div style="padding:24px; border:1px solid #ede0c4; border-top:none; border-radius:0 0 8px 8px;">
          <h2 style="color:#b04a2a;">Thank you for booking, ${payload.customerName}!</h2>
          <p>Your booking has been confirmed. Here are your details:</p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0;">
            <tr style="background:#ede0c4;"><td style="padding:10px; font-weight:bold;">Booking Reference</td><td style="padding:10px;">${payload.reference}</td></tr>
            <tr><td style="padding:10px; font-weight:bold;">Amount Due</td><td style="padding:10px; color:#b04a2a; font-weight:bold;">SAR ${payload.total.toLocaleString()}</td></tr>
          </table>
          <p style="background:#fff8ee; border-left:4px solid #b04a2a; padding:12px; border-radius:4px;">
            Please complete the bank transfer and send a photo of the receipt via WhatsApp, quoting your booking reference.
          </p>
          <p>Your proforma invoice is attached to this email.</p>
          <hr style="border:none; border-top:1px solid #ede0c4; margin:20px 0;"/>
          <p style="color:#4a342a; font-size:12px; text-align:center;">Smart Service — Jeddah, Saudi Arabia</p>
        </div>
      </div>`;

  let attachments: { filename: string; content: Buffer }[] = [];
  try {
    const buf = fs.readFileSync(payload.invoicePath);
    attachments = [{ filename: `invoice-${payload.reference}.pdf`, content: buf }];
  } catch {
    console.warn('[EmailService] Could not read invoice file for attachment');
  }

  await resend.emails.send({
    from: getFromAddress(),
    to: [payload.to],
    bcc: [OWNER_EMAIL],
    subject,
    html,
    attachments,
  });
}

export async function sendPaidConfirmationEmail(
  to: string,
  customerName: string,
  reference: string,
  language: string,
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const isAr = language === 'ar';
  const subject = isAr ? `تم استلام دفعتك — ${reference}` : `Payment Received — ${reference}`;

  const html = isAr
    ? `<div dir="rtl" style="font-family:Arial;color:#231712;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#4a6b3a;">تم استلام دفعتك بنجاح ✓</h2>
        <p>شكراً ${customerName}، تم تأكيد دفعتك لحجز رقم <strong>${reference}</strong>.</p>
        <p style="color:#4a342a;font-size:12px;">سمارت سيرفس — جدة، المملكة العربية السعودية</p>
      </div>`
    : `<div style="font-family:Georgia;color:#231712;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#4a6b3a;">Payment Received ✓</h2>
        <p>Thank you ${customerName}, your booking <strong>${reference}</strong> is now confirmed as paid.</p>
        <p style="color:#4a342a;font-size:12px;">Smart Service — Jeddah, Saudi Arabia</p>
      </div>`;

  await resend.emails.send({
    from: getFromAddress(),
    to: [to],
    bcc: [OWNER_EMAIL],
    subject,
    html,
  });
}
