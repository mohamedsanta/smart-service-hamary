import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, MessageCircle, Mail, ArrowLeft, Copy } from 'lucide-react';
import { Header } from '../components/shared/Header';
import { Footer } from '../components/landing/Footer';
import { bankDetails } from '../config/bank';
import { getInvoiceDownloadUrl } from '../lib/api';
import { buildWhatsAppLink } from '../lib/whatsapp';
import { formatSAR, formatDate } from '../lib/format';
import { useState } from 'react';

const tierLabels: Record<string, { en: string; ar: string }> = {
  earlyBird: { en: 'Early Bird', ar: 'حجز مبكر' },
  standard: { en: 'Standard', ar: 'قياسي' },
  vip: { en: 'VIP Premium', ar: 'فاخر VIP' },
};

const deliveryLabels: Record<string, { en: string; ar: string }> = {
  port: { en: 'Pickup at Jeddah Port', ar: 'استلام من ميناء جدة' },
  home: { en: 'Home Delivery', ar: 'توصيل للمنزل' },
  slaughterhouse: { en: 'Delivery to Slaughterhouse', ar: 'توصيل إلى المسلخ' },
};

export default function Confirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);

  const booking = state?.booking;
  const invoiceUrl = state?.invoiceUrl;

  if (!booking) {
    navigate('/');
    return null;
  }

  const customerWaLink = buildWhatsAppLink(booking.reference, booking.quantity, i18n.language, invoiceUrl);

  const copyRef = () => {
    navigator.clipboard.writeText(booking.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mb-12 ${isAr ? 'text-right sm:text-center' : ''}`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/15 mb-6">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <h1 className="text-4xl font-display font-black text-ink mb-3">{t('confirmation.title')}</h1>
          <p className="text-ink-soft font-cormorant text-lg">{t('confirmation.subtitle')}</p>

          {/* Reference */}
          <div className="inline-flex items-center gap-3 bg-cream-deep border-2 border-terracotta/30 rounded-xl px-6 py-4 mt-6">
            <div>
              <p className="text-xs font-inter text-ink-soft/60 uppercase tracking-wider mb-1">{t('confirmation.ref_label')}</p>
              <p className="text-2xl font-display font-black text-terracotta tracking-wide">{booking.reference}</p>
            </div>
            <button onClick={copyRef} className="p-2 text-ink-soft hover:text-terracotta transition-colors" title="Copy reference">
              <Copy size={18} />
            </button>
            {copied && <span className="text-success text-xs font-inter">Copied!</span>}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Next steps */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
            <h2 className={`font-display font-bold text-xl text-ink mb-6 ${isAr ? 'text-right' : ''}`}>{t('confirmation.next_steps')}</h2>
            {[1,2,3].map((step) => (
              <div key={step} className={`flex items-start gap-4 mb-5 last:mb-0 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-terracotta text-cream flex items-center justify-center text-sm font-display font-bold shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-inter font-semibold text-sm text-ink">{t(`confirmation.step${step}_title`)}</p>
                  <p className="text-ink-soft text-sm font-cormorant mt-0.5">{t(`confirmation.step${step}_desc`)}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bank details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card">
            <h2 className={`font-display font-bold text-xl text-terracotta mb-6 ${isAr ? 'text-right' : ''}`}>{t('confirmation.bank_details')}</h2>
            {[
              { label: t('confirmation.beneficiary'), value: bankDetails.beneficiaryName },
              { label: t('confirmation.bank'), value: bankDetails.bankName },
              { label: t('confirmation.iban'), value: bankDetails.iban },
              { label: t('confirmation.swift'), value: bankDetails.swift },
              { label: isAr ? 'المبلغ المطلوب' : 'Amount Due', value: formatSAR(booking.total, i18n.language) },
              { label: isAr ? 'مرجع التحويل' : 'Transfer Reference', value: booking.reference },
            ].map(({ label, value }) => (
              <div key={label} className={`flex justify-between items-start py-2 border-b border-line last:border-0 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-inter text-ink-soft/70">{label}</span>
                <span className="text-sm font-inter font-medium text-ink text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            <p className={`text-xs text-ink-soft/60 mt-3 font-cormorant ${isAr ? 'text-right' : ''}`}>
              {isAr ? bankDetails.notes.ar : bankDetails.notes.en}
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <h2 className={`font-display font-bold text-xl text-ink mb-6 ${isAr ? 'text-right' : ''}`}>{isAr ? 'الفاتورة' : 'Your Invoice'}</h2>
            <div className="space-y-3">
              <a
                href={getInvoiceDownloadUrl(booking.reference)}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-primary flex items-center gap-2 justify-center w-full ${isAr ? 'flex-row-reverse' : ''}`}
              >
                <Download size={16} />
                {t('confirmation.download_invoice')}
              </a>
              <a
                href={customerWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-secondary flex items-center gap-2 justify-center w-full ${isAr ? 'flex-row-reverse' : ''}`}
              >
                <MessageCircle size={16} />
                {t('confirmation.whatsapp_invoice')}
              </a>
              <a
                href={`mailto:${booking.email}?subject=Invoice ${booking.reference}&body=Please find your invoice attached or at: ${invoiceUrl}`}
                className={`btn-secondary flex items-center gap-2 justify-center w-full ${isAr ? 'flex-row-reverse' : ''}`}
              >
                <Mail size={16} />
                {t('confirmation.email_invoice')}
              </a>
            </div>
          </motion.div>

          {/* Booking summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
            <h2 className={`font-display font-bold text-xl text-ink mb-6 ${isAr ? 'text-right' : ''}`}>{t('confirmation.booking_summary')}</h2>
            {[
              { label: t('confirmation.quantity'), value: `${booking.quantity} ${isAr ? 'رأس' : 'sheep'}` },
              { label: t('confirmation.tier'), value: isAr ? (tierLabels[booking.tier]?.ar || booking.tier) : (tierLabels[booking.tier]?.en || booking.tier) },
              { label: t('confirmation.delivery'), value: isAr ? (deliveryLabels[booking.deliveryOption]?.ar || booking.deliveryOption) : (deliveryLabels[booking.deliveryOption]?.en || booking.deliveryOption) },
              { label: t('confirmation.date'), value: formatDate(booking.preferredDate, i18n.language) },
              { label: t('confirmation.total'), value: formatSAR(booking.total, i18n.language) },
            ].map(({ label, value }) => (
              <div key={label} className={`flex justify-between items-center py-2 border-b border-line last:border-0 ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-inter text-ink-soft/70">{label}</span>
                <span className="text-sm font-inter font-semibold text-ink">{value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className={`mt-8 ${isAr ? 'text-right' : ''}`}>
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 text-ink-soft hover:text-terracotta transition-colors font-inter text-sm ${isAr ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft size={16} className={isAr ? 'flip-rtl' : ''} />
            {isAr ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
