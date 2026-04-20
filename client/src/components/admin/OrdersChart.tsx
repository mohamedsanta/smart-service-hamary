import { useTranslation } from 'react-i18next';
import { Bar, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DailyData { date: string; orders: number; sheep: number; }

export function OrdersChart({ data }: { data: DailyData[] }) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className={`card ${isAr ? 'text-right' : ''}`}>
      <h3 className="font-display font-bold text-lg text-ink mb-6">{t('admin.orders_chart')}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#c7b38a" opacity={0.4} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#4a342a' }}
            tickFormatter={(v) => v.slice(5)} />
          <YAxis yAxisId="left" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#4a342a' }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#c88a3d' }} />
          <Tooltip
            contentStyle={{ background: '#ede0c4', border: '1px solid #c7b38a', borderRadius: 8, fontFamily: 'Inter', fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontFamily: 'Inter', fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="orders" fill="#b04a2a" radius={[3,3,0,0]} name={isAr ? 'الطلبات' : 'Orders'} />
          <Line yAxisId="right" type="monotone" dataKey="sheep" stroke="#c88a3d" strokeWidth={2} dot={false} name={isAr ? 'الرؤوس' : 'Sheep'} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
