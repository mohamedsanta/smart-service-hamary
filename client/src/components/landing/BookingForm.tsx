import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Minus, Plus, ShieldCheck, Loader2 } from 'lucide-react';
import { pricing } from '../../config/pricing';
import type { TierKey } from '../../config/pricing';
import { company } from '../../config/company';
import { createBooking, joinWaitlist } from '../../lib/api';
import { useInventory } from '../../hooks/useInventory';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  customerName: z.string().min(2, 'Name required'),
  phone: z.string().min(9, 'Valid phone required'),
  email: z.string().email('Valid email required'),
  whatsappOptIn: z.boolean(),
  city: z.string().min(1, 'City required'),
  address: z.string().min(5, 'Address required'),
  notes: z.string().optional(),
  deliveryOption: z.enum(['port', 'home', 'slaughterhouse']),
  preferredDate: z.string().min(1, 'Date required'),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept terms' }) }),
});

type FormValues = z.infer<typeof schema>;

const waitlistSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
});

export function BookingForm() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();
  const inventory = useInventory();
  const isSoldOut = inventory ? inventory.available <= 0 : false;

  const [quantity, setQuantity] = useState(1);
  const [tier, setTier] = useState<TierKey>('earlyBird');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryOption: 'home', whatsappOptIn: true, terms: true as any },
  });

  const wlForm = useForm({ resolver: zodResolver(waitlistSchema) });

  // Price calculation
  const unitPrice = pricing[tier].price;
  const subtotal = unitPrice * quantity;
  const isBulk = quantity >= pricing.bulkThreshold;
  const discount = isBulk ? subtotal * (pricing.bulkDiscountPct / 100) : 0;
  const afterDiscount = subtotal - discount;
  const vat = afterDiscount * (pricing.vatPct / 100);
  const total = afterDiscount + vat;

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setError('');
    try {
      const result = await createBooking({
        ...data,
        quantity,
        tier,
        subtotal,
        discount,
        vat,
        total,
        language: i18n.language,
      });
      navigate('/confirmation', { state: { booking: result.booking, invoiceUrl: result.invoiceUrl, whatsappLink: result.whatsappLink } });
    } catch (err: any) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const onWaitlist = async (data: any) => {
    setWaitlistLoading(true);
    try {
      await joinWaitlist(data);
      setWaitlistSuccess(true);
    } catch {
      setWaitlistSuccess(true);
    } finally {
      setWaitlistLoading(false);
    }
  };

  const tiers: TierKey[] = ['earlyBird', 'standard', 'vip'];

  if (isSoldOut) {
    return (
      <section id="booking" className="py-24 px-4 sm:px-6 max-w-2xl mx-auto">
        <div className={`card text-center ${isAr ? 'text-right' : ''}`}>
          <h2 className="section-title mb-4">{t('booking.waitlist_title')}</h2>
          <p className="text-ink-soft mb-8 font-cormorant">{t('booking.waitlist_desc')}</p>
          {waitlistSuccess ? (
            <p className="text-success font-inter font-semibold">{t('booking.waitlist_success')}</p>
          ) : (
            <form onSubmit={wlForm.handleSubmit(onWaitlist)} className="space-y-4">
              <input {...wlForm.register('name')} placeholder={t('booking.name')} className="input w-full" />
              <input {...wlForm.register('phone')} placeholder={t('booking.phone')} className="input w-full" />
              <input {...wlForm.register('email')} placeholder={t('booking.email')} className="input w-full" />
              <button type="submit" disabled={waitlistLoading} className="btn-primary w-full">
                {waitlistLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : t('booking.waitlist_submit')}
              </button>
            </form>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-12 ${isAr ? 'text-right' : ''}`}
        >
          <h2 className="section-title mb-4">{t('booking.title')}</h2>
          <p className="text-ink-soft font-cormorant text-lg">{t('booking.subtitle')}</p>
        </motion.div>

        <div className={`grid lg:grid-cols-5 gap-8 ${isAr ? 'direction-rtl' : ''}`}>
          {/* Form — 3 cols */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-8">

            {/* Quantity */}
            <div className="card">
              <h3 className={`font-display font-bold text-lg text-ink mb-4 ${isAr ? 'text-right' : ''}`}>{t('booking.quantity')}</h3>
              <div className={`flex items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-terracotta text-terracotta flex items-center justify-center hover:bg-terracotta hover:text-cream transition-colors">
                  <Minus size={16} />
                </button>
                <span className="text-3xl font-display font-bold text-ink w-12 text-center">{quantity}</span>
                <button type="button" onClick={() => setQuantity(Math.min(20, quantity + 1))}
                  className="w-10 h-10 rounded-full border-2 border-terracotta text-terracotta flex items-center justify-center hover:bg-terracotta hover:text-cream transition-colors">
                  <Plus size={16} />
                </button>
                {isBulk && (
                  <span className="text-success text-sm font-inter font-semibold bg-success/10 px-3 py-1 rounded-full">
                    {pricing.bulkDiscountPct}% {isAr ? 'خصم كمية' : 'bulk discount'}
                  </span>
                )}
              </div>
            </div>

            {/* Tier */}
            <div className="card">
              <h3 className={`font-display font-bold text-lg text-ink mb-4 ${isAr ? 'text-right' : ''}`}>{t('booking.tier')}</h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {tiers.map((k) => (
                  <button
                    key={k} type="button" onClick={() => setTier(k)}
                    className={`rounded-xl p-4 border-2 text-left transition-all ${isAr ? 'text-right' : ''} ${
                      tier === k ? 'border-terracotta bg-terracotta/5' : 'border-line hover:border-terracotta/40'
                    } ${k === 'vip' ? 'border-gold-accent/40' : ''}`}
                  >
                    <div className={`font-display font-bold text-sm mb-1 ${k === 'vip' ? 'text-gold-accent' : 'text-terracotta'}`}>
                      {isAr ? pricing[k].label.ar : pricing[k].label.en}
                    </div>
                    <div className="text-xl font-display font-black text-ink">
                      {pricing[k].price.toLocaleString()} <span className="text-xs font-inter font-normal text-ink-soft">{t('common.sar')}</span>
                    </div>
                    <div className="text-xs text-ink-soft mt-1 font-cormorant leading-relaxed">
                      {(isAr ? pricing[k].specs.ar : pricing[k].specs.en).split(' · ').slice(0, 2).join(' · ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="card">
              <h3 className={`font-display font-bold text-lg text-ink mb-4 ${isAr ? 'text-right' : ''}`}>{t('booking.delivery')}</h3>
              {(['port', 'home', 'slaughterhouse'] as const).map((opt) => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-cream-deep transition-colors mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <input type="radio" value={opt} {...register('deliveryOption')} className="accent-terracotta" />
                  <span className="font-inter text-sm text-ink">{t(`booking.delivery_${opt}`)}</span>
                </label>
              ))}
            </div>

            {/* Date */}
            <div className="card">
              <h3 className={`font-display font-bold text-lg text-ink mb-4 ${isAr ? 'text-right' : ''}`}>{t('booking.preferred_date')}</h3>
              <input
                type="date"
                {...register('preferredDate')}
                min={new Date(company.estimatedArrivalDate).toISOString().slice(0, 10)}
                className={`input w-full sm:w-auto ${errors.preferredDate ? 'border-red-500' : ''}`}
              />
              {errors.preferredDate && <p className="text-red-600 text-xs mt-1">{errors.preferredDate.message}</p>}
            </div>

            {/* Customer details */}
            <div className="card space-y-4">
              <h3 className={`font-display font-bold text-lg text-ink mb-2 ${isAr ? 'text-right' : ''}`}>{isAr ? 'بياناتك' : 'Your Details'}</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.name')} *</label>
                  <input {...register('customerName')} className={`input w-full ${errors.customerName ? 'border-red-500' : ''}`} />
                  {errors.customerName && <p className="text-red-600 text-xs mt-1">{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.phone')} *</label>
                  <input {...register('phone')} placeholder="+966..." className={`input w-full ${errors.phone ? 'border-red-500' : ''}`} dir="ltr" />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
                  <label className={`flex items-center gap-2 mt-1.5 cursor-pointer ${isAr ? 'flex-row-reverse' : ''}`}>
                    <input type="checkbox" {...register('whatsappOptIn')} className="accent-terracotta" />
                    <span className="text-xs text-ink-soft font-inter">{t('booking.whatsapp_opt')}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.email')} *</label>
                <input {...register('email')} type="email" className={`input w-full ${errors.email ? 'border-red-500' : ''}`} dir="ltr" />
                {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.city')} *</label>
                  <select {...register('city')} className={`input w-full ${errors.city ? 'border-red-500' : ''}`}>
                    <option value="">{t('booking.select_city')}</option>
                    {company.deliveryCities.map((c) => (
                      <option key={c.en} value={c.en}>{isAr ? c.ar : c.en}</option>
                    ))}
                  </select>
                  {errors.city && <p className="text-red-600 text-xs mt-1">{t('booking.city_required')}</p>}
                  <p className="text-xs text-ink-soft/70 mt-1 font-inter">{t('booking.jeddah_only')}</p>
                </div>
                <div>
                  <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.address')} *</label>
                  <input {...register('address')} className={`input w-full ${errors.address ? 'border-red-500' : ''}`} />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address.message}</p>}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-inter text-ink-soft mb-1 ${isAr ? 'text-right' : ''}`}>{t('booking.notes')}</label>
                <textarea {...register('notes')} rows={3} placeholder={t('booking.notes_placeholder')}
                  className={`input w-full resize-none ${isAr ? 'text-right' : ''}`} />
              </div>
            </div>

            {/* Guarantee + Terms + Submit */}
            <div>
              <div className={`flex items-start gap-3 bg-terracotta/8 border border-terracotta/20 rounded-xl p-4 mb-5 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
                <ShieldCheck size={20} className="shrink-0 text-terracotta mt-0.5" />
                <p className="text-sm font-cormorant text-ink-soft leading-relaxed">{t('booking.guarantee')}</p>
              </div>

              <label className={`flex items-center gap-3 mb-5 cursor-pointer ${isAr ? 'flex-row-reverse' : ''}`}>
                <input type="checkbox" {...register('terms')} className="accent-terracotta w-4 h-4" />
                <span className="text-sm font-inter text-ink-soft">{t('booking.terms')}</span>
              </label>
              {errors.terms && <p className="text-red-600 text-xs mb-3">{errors.terms.message}</p>}

              {error && <p className="text-red-600 text-sm mb-3 font-inter">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                {loading ? <Loader2 size={20} className="animate-spin mx-auto" /> : t('booking.confirm')}
              </button>
            </div>
          </form>

          {/* Price summary — sticky 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <motion.div
                initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card border-terracotta/30"
              >
                <h3 className={`font-display font-bold text-lg text-terracotta mb-6 ${isAr ? 'text-right' : ''}`}>
                  {isAr ? 'ملخص السعر' : 'Price Summary'}
                </h3>

                {[
                  { label: t('booking.subtotal'), value: subtotal, show: true },
                  { label: t('booking.bulk_discount'), value: -discount, show: isBulk },
                  { label: t('booking.vat'), value: vat, show: true },
                ].map(({ label, value, show }) =>
                  show ? (
                    <div key={label} className={`flex justify-between items-center py-2 border-b border-line ${isAr ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-inter text-ink-soft">{label}</span>
                      <span className={`text-sm font-inter ${value < 0 ? 'text-success' : 'text-ink'}`}>
                        {value < 0 ? '- ' : ''}
                        {Math.abs(value).toLocaleString('en', { minimumFractionDigits: 2 })} {t('common.sar')}
                      </span>
                    </div>
                  ) : null
                )}

                <div className={`flex justify-between items-center pt-4 mt-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                  <span className="font-display font-bold text-lg text-ink">{t('booking.total')}</span>
                  <span className="font-display font-black text-2xl text-terracotta">
                    {total.toLocaleString('en', { minimumFractionDigits: 2 })} {t('common.sar')}
                  </span>
                </div>

                <div className={`mt-6 p-4 bg-cream rounded-lg ${isAr ? 'text-right' : ''}`}>
                  <p className="text-xs font-inter text-ink-soft/80 leading-relaxed">{t('booking.jeddah_only')}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
