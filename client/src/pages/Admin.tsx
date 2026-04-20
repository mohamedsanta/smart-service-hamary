import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { LogOut, Download, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getAdminBookings, getAdminStats, adjustInventory, resendInvoice } from '../lib/api';
import { LanguageToggle } from '../components/shared/LanguageToggle';
import { KPICards } from '../components/admin/KPICards';
import { OrdersChart } from '../components/admin/OrdersChart';
import { OrdersTable } from '../components/admin/OrdersTable';
import { OrderDetail } from '../components/admin/OrderDetail';
import { MarkPaidModal } from '../components/admin/MarkPaidModal';

export default function Admin() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [markPaidBooking, setMarkPaidBooking] = useState<any>(null);
  const [inventoryEdit, setInventoryEdit] = useState(false);
  const [newReserved, setNewReserved] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuth) { navigate('/admin/login'); return; }
    loadData();
  }, [isAuth]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [b, s] = await Promise.all([getAdminBookings(), getAdminStats()]);
      setBookings(b);
      setStats(s);
    } catch { navigate('/admin/login'); }
    finally { setLoading(false); }
  }, []);

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const handleResend = async (id: string) => { try { await resendInvoice(id); alert(isAr ? 'تم إرسال الفاتورة' : 'Invoice resent'); } catch {} };
  const handleAdjustInventory = async () => {
    try { await adjustInventory(Number(newReserved)); setInventoryEdit(false); loadData(); } catch {}
  };

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-ink-soft font-inter">{t('common.loading')}</div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-cream ${isAr ? 'text-right' : ''}`}>
      {/* Admin header */}
      <header className="bg-ink sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
        <h1 className="font-display font-bold text-lg text-cream">{t('admin.title')}</h1>
        <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
          <LanguageToggle className="text-cream/50 border-cream/20" />
          <a
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/admin/export`}
            className={`flex items-center gap-1.5 text-cream/60 hover:text-cream text-sm font-inter transition-colors ${isAr ? 'flex-row-reverse' : ''}`}
          >
            <Download size={14} /> {t('admin.export')}
          </a>
          <button
            onClick={() => setInventoryEdit(!inventoryEdit)}
            className="text-cream/60 hover:text-cream transition-colors"
            title={t('admin.adjust_inventory')}
          >
            <Settings size={16} />
          </button>
          <button onClick={handleLogout} className={`flex items-center gap-1.5 text-cream/60 hover:text-cream text-sm font-inter transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
            <LogOut size={14} /> {t('admin.logout')}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Inventory adjustment */}
        {inventoryEdit && (
          <div className={`card flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
            <span className="font-inter text-sm text-ink-soft">{t('admin.adjust_inventory')}</span>
            <input
              type="number"
              value={newReserved}
              onChange={(e) => setNewReserved(e.target.value)}
              placeholder={stats?.totalSheep?.toString()}
              className="input w-32"
            />
            <button onClick={handleAdjustInventory} className="btn-primary text-sm py-2">{t('admin.update')}</button>
            <button onClick={() => setInventoryEdit(false)} className="text-ink-soft hover:text-ink text-sm font-inter">{t('admin.cancel')}</button>
          </div>
        )}

        {/* KPIs */}
        {stats && (
          <KPICards
            totalBookings={stats.totalBookings}
            totalSheep={stats.totalSheep}
            totalCapacity={stats.totalCapacity}
            totalRevenue={stats.totalRevenue}
            paidRevenue={stats.paidRevenue}
          />
        )}

        {/* Chart */}
        {stats?.dailyData && <OrdersChart data={stats.dailyData} />}

        {/* Table */}
        <OrdersTable
          bookings={bookings}
          onMarkPaid={setMarkPaidBooking}
          onView={setSelectedBooking}
          onResend={handleResend}
        />
      </div>

      {/* Modals */}
      {selectedBooking && (
        <OrderDetail booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
      {markPaidBooking && (
        <MarkPaidModal
          booking={markPaidBooking}
          onClose={() => setMarkPaidBooking(null)}
          onSuccess={() => { setMarkPaidBooking(null); loadData(); }}
        />
      )}
    </div>
  );
}
