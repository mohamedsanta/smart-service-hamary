import { useTranslation } from 'react-i18next';
import { ShoppingBag, Package, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Props {
  totalBookings: number;
  totalSheep: number;
  totalCapacity: number;
  totalRevenue: number;
  paidRevenue: number;
}

export function KPICards({ totalBookings, totalSheep, totalCapacity, totalRevenue, paidRevenue }: Props) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const cards = [
    { label: t('admin.total_bookings'), value: totalBookings, icon: ShoppingBag, color: 'text-terracotta bg-terracotta/10' },
    { label: t('admin.total_sheep'), value: `${totalSheep} / ${totalCapacity}`, icon: Package, color: 'text-ochre bg-ochre/10' },
    { label: t('admin.expected_revenue'), value: `${totalRevenue.toLocaleString()} SAR`, icon: TrendingUp, color: 'text-ink bg-sand/30' },
    { label: t('admin.paid_revenue'), value: `${paidRevenue.toLocaleString()} SAR`, icon: CheckCircle2, color: 'text-success bg-success/10' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className={`card ${isAr ? 'text-right' : ''}`}>
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${color} mb-3 ${isAr ? 'mr-auto' : ''}`}>
            <Icon size={18} />
          </div>
          <p className="text-2xl font-display font-black text-ink">{value}</p>
          <p className="text-xs font-inter text-ink-soft/70 mt-1">{label}</p>
        </div>
      ))}
    </div>
  );
}
