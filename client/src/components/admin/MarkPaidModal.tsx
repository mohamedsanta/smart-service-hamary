import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2 } from 'lucide-react';
import { updateBookingStatus } from '../../lib/api';

interface Props { booking: any; onClose: () => void; onSuccess: () => void; }

export function MarkPaidModal({ booking, onClose, onSuccess }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [paymentRef, setPaymentRef] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [sendEmail, setSendEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setLoading(true);
    setError('');
    try {
      await updateBookingStatus(booking.id, { status: 'paid', paymentRef, paidAt, sendEmail });
      onSuccess();
    } catch {
      setError(isAr ? 'حدث خطأ' : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm">
      <div className={`bg-cream rounded-2xl shadow-2xl w-full max-w-md ${isAr ? 'text-right' : ''}`}>
        <div className={`flex items-center justify-between p-6 border-b border-line ${isAr ? 'flex-row-reverse' : ''}`}>
          <h2 className="font-display font-bold text-lg text-ink">{t('admin.mark_paid')}</h2>
          <button onClick={onClose} className="p-1 hover:text-terracotta transition-colors text-ink-soft">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm font-inter text-ink-soft">{booking.reference} — {booking.customerName}</p>

          <div>
            <label className="block text-sm font-inter text-ink-soft mb-1">{t('admin.paid_date')}</label>
            <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="block text-sm font-inter text-ink-soft mb-1">{t('admin.payment_ref')}</label>
            <input value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="Optional — bank transfer ref" className="input w-full" />
          </div>
          <label className={`flex items-center gap-2 cursor-pointer ${isAr ? 'flex-row-reverse' : ''}`}>
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="accent-terracotta" />
            <span className="text-sm font-inter text-ink-soft">{t('admin.send_email')}</span>
          </label>

          {error && <p className="text-red-600 text-sm font-inter">{error}</p>}

          <div className={`flex gap-3 pt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
            <button onClick={onClose} className="btn-secondary flex-1 py-2.5 text-sm">{t('admin.cancel')}</button>
            <button onClick={confirm} disabled={loading} className="btn-primary flex-1 py-2.5 text-sm">
              {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : t('admin.confirm_payment')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
