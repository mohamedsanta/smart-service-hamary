import { useTranslation } from 'react-i18next';
import { X, ExternalLink, Download } from 'lucide-react';
import { getInvoiceUrl, getInvoiceDownloadUrl } from '../../lib/api';
import { formatSAR, formatDate } from '../../lib/format';

interface Props { booking: any; onClose: () => void; }

export function OrderDetail({ booking: b, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const tierLabels: Record<string, { en: string; ar: string }> = {
    earlyBird: { en: 'Early Bird', ar: 'حجز مبكر' },
    standard: { en: 'Standard', ar: 'قياسي' },
    vip: { en: 'VIP Premium', ar: 'فاخر VIP' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className={`bg-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${isAr ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between p-6 border-b border-line ${isAr ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className="font-display font-bold text-xl text-ink">{t('admin.booking_detail')}</h2>
            <p className="text-terracotta font-inter font-semibold text-sm mt-0.5">{b.reference}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-cream-deep transition-colors text-ink-soft">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer */}
          <section>
            <h3 className="font-inter font-semibold text-xs text-ink-soft/60 uppercase tracking-wider mb-3">{t('admin.customer_info')}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: isAr ? 'الاسم' : 'Name', v: b.customerName },
                { l: isAr ? 'الهاتف' : 'Phone', v: b.phone },
                { l: isAr ? 'البريد' : 'Email', v: b.email },
                { l: isAr ? 'المدينة' : 'City', v: b.city },
                { l: isAr ? 'العنوان' : 'Address', v: b.address },
                { l: isAr ? 'ملاحظات' : 'Notes', v: b.notes || '—' },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-xs font-inter text-ink-soft/60 mb-0.5">{l}</p>
                  <p className="text-sm font-inter text-ink">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Booking */}
          <section>
            <h3 className="font-inter font-semibold text-xs text-ink-soft/60 uppercase tracking-wider mb-3">
              {isAr ? 'تفاصيل الحجز' : 'Booking Details'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: isAr ? 'الكمية' : 'Quantity', v: b.quantity },
                { l: isAr ? 'الخيار' : 'Tier', v: isAr ? (tierLabels[b.tier]?.ar || b.tier) : (tierLabels[b.tier]?.en || b.tier) },
                { l: isAr ? 'التوصيل' : 'Delivery', v: b.deliveryOption },
                { l: isAr ? 'التاريخ المفضل' : 'Preferred Date', v: formatDate(b.preferredDate, i18n.language) },
                { l: isAr ? 'اللغة' : 'Language', v: b.language },
                { l: isAr ? 'الحالة' : 'Status', v: t(`admin.${b.status}`) },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-xs font-inter text-ink-soft/60 mb-0.5">{l}</p>
                  <p className="text-sm font-inter text-ink">{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h3 className="font-inter font-semibold text-xs text-ink-soft/60 uppercase tracking-wider mb-3">
              {isAr ? 'الأسعار' : 'Pricing'}
            </h3>
            <div className="bg-cream-deep rounded-xl p-4 space-y-2">
              {[
                { l: isAr ? 'الإجمالي الفرعي' : 'Subtotal', v: formatSAR(b.subtotal) },
                { l: isAr ? 'الخصم' : 'Discount', v: b.discount > 0 ? `- ${formatSAR(b.discount)}` : 'N/A' },
                { l: isAr ? 'ضريبة القيمة المضافة' : 'VAT 15%', v: formatSAR(b.vat) },
              ].map(({ l, v }) => (
                <div key={l} className={`flex justify-between text-sm font-inter ${isAr ? 'flex-row-reverse' : ''}`}>
                  <span className="text-ink-soft">{l}</span>
                  <span>{v}</span>
                </div>
              ))}
              <div className={`flex justify-between font-display font-bold text-base pt-2 border-t border-line ${isAr ? 'flex-row-reverse' : ''}`}>
                <span className="text-ink">{isAr ? 'الإجمالي' : 'Total'}</span>
                <span className="text-terracotta">{formatSAR(b.total)}</span>
              </div>
            </div>
          </section>

          {/* Payment */}
          {(b.paidAt || b.paymentRef) && (
            <section>
              <h3 className="font-inter font-semibold text-xs text-ink-soft/60 uppercase tracking-wider mb-3">
                {isAr ? 'تفاصيل الدفع' : 'Payment Details'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {b.paidAt && <div><p className="text-xs text-ink-soft/60 mb-0.5">{t('admin.paid_date')}</p><p className="text-sm font-inter">{formatDate(b.paidAt)}</p></div>}
                {b.paymentRef && <div><p className="text-xs text-ink-soft/60 mb-0.5">{t('admin.payment_ref')}</p><p className="text-sm font-inter">{b.paymentRef}</p></div>}
              </div>
            </section>
          )}

          {/* Invoice */}
          <div className={`flex gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
            <a href={getInvoiceUrl(b.reference)} target="_blank" rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 btn-secondary text-sm py-2.5 ${isAr ? 'flex-row-reverse' : ''}`}>
              <ExternalLink size={14} />
              {isAr ? 'عرض الفاتورة' : 'View Invoice'}
            </a>
            <a href={getInvoiceDownloadUrl(b.reference)} target="_blank" rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 btn-primary text-sm py-2.5 ${isAr ? 'flex-row-reverse' : ''}`}>
              <Download size={14} />
              {isAr ? 'تحميل' : 'Download'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
