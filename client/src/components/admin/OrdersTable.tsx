import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Eye, CheckCircle2, Send, ExternalLink } from 'lucide-react';
import { getInvoiceUrl } from '../../lib/api';

interface Booking {
  id: string; reference: string; createdAt: string; customerName: string;
  phone: string; quantity: number; tier: string; total: number; status: string;
  email: string; city: string; address: string; notes?: string; deliveryOption: string;
  preferredDate: string; subtotal: number; discount: number; vat: number;
  language: string; paymentRef?: string; paidAt?: string;
}

interface Props {
  bookings: Booking[];
  onMarkPaid: (b: Booking) => void;
  onView: (b: Booking) => void;
  onResend: (id: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-ochre/20 text-ochre',
  paid: 'bg-success/20 text-success',
  delivered: 'bg-terracotta/20 text-terracotta',
  cancelled: 'bg-ink/10 text-ink-soft',
};

const tierLabels: Record<string, { en: string; ar: string }> = {
  earlyBird: { en: 'Early Bird', ar: 'مبكر' },
  standard: { en: 'Standard', ar: 'قياسي' },
  vip: { en: 'VIP', ar: 'VIP' },
};

export function OrdersTable({ bookings, onMarkPaid, onView, onResend }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || b.reference.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q) || b.phone.includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="card">
      {/* Filters */}
      <div className={`flex flex-wrap gap-3 mb-5 ${isAr ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 bg-cream rounded-lg px-3 py-2 flex-1 min-w-48 ${isAr ? 'flex-row-reverse' : ''}`}>
          <Search size={15} className="text-ink-soft/50 shrink-0" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.search')}
            className="bg-transparent text-sm font-inter text-ink outline-none w-full"
          />
        </div>
        <div className={`flex gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
          {['all','pending','paid','delivered','cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-inter font-medium transition-colors ${
                statusFilter === s ? 'bg-terracotta text-cream' : 'bg-cream text-ink-soft hover:text-ink'
              }`}
            >
              {t(`admin.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b border-line ${isAr ? 'text-right' : ''}`}>
              {[t('admin.ref'), t('admin.date'), t('admin.customer'), t('admin.phone'), t('admin.qty'), t('admin.tier'), t('admin.total'), t('admin.status'), t('admin.actions')].map((h) => (
                <th key={h} className="pb-3 px-2 text-xs font-inter font-semibold text-ink-soft/70 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-line/50 hover:bg-cream-deep/50 transition-colors">
                <td className="py-3 px-2 font-inter font-semibold text-terracotta text-xs whitespace-nowrap">{b.reference}</td>
                <td className="py-3 px-2 text-ink-soft whitespace-nowrap">{new Date(b.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-2 font-medium text-ink">{b.customerName}</td>
                <td className="py-3 px-2 text-ink-soft" dir="ltr">{b.phone}</td>
                <td className="py-3 px-2 text-center font-semibold text-ink">{b.quantity}</td>
                <td className="py-3 px-2">
                  <span className="text-xs font-inter">{isAr ? tierLabels[b.tier]?.ar : tierLabels[b.tier]?.en}</span>
                </td>
                <td className="py-3 px-2 font-inter font-semibold text-ink whitespace-nowrap">{b.total.toLocaleString()} SAR</td>
                <td className="py-3 px-2">
                  <span className={`text-xs font-inter font-medium px-2 py-1 rounded-full ${statusColors[b.status] || ''}`}>
                    {t(`admin.${b.status}`)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className={`flex gap-1 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <button onClick={() => onView(b)} className="p-1.5 rounded hover:bg-cream transition-colors text-ink-soft hover:text-ink" title={t('admin.view')}>
                      <Eye size={14} />
                    </button>
                    {b.status === 'pending' && (
                      <button onClick={() => onMarkPaid(b)} className="p-1.5 rounded hover:bg-success/10 transition-colors text-ink-soft hover:text-success" title={t('admin.mark_paid')}>
                        <CheckCircle2 size={14} />
                      </button>
                    )}
                    <button onClick={() => onResend(b.id)} className="p-1.5 rounded hover:bg-cream transition-colors text-ink-soft hover:text-terracotta" title={t('admin.resend')}>
                      <Send size={14} />
                    </button>
                    <a href={getInvoiceUrl(b.reference)} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-cream transition-colors text-ink-soft hover:text-terracotta" title="View Invoice">
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-8 text-ink-soft/50 font-inter text-sm">
                  {isAr ? 'لا توجد نتائج' : 'No results found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
