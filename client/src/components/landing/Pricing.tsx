import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, Star } from 'lucide-react';
import { pricing } from '../../config/pricing';
import type { TierKey } from '../../config/pricing';

const tiers: TierKey[] = ['earlyBird', 'standard', 'vip'];

export function Pricing() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section className="py-24 px-4 sm:px-6 bg-ink">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-14 ${isAr ? 'text-right' : ''}`}
        >
          <h2 className="text-4xl font-display font-bold text-cream mb-4">{t('pricing.title')}</h2>
          <p className="text-cream/70 font-cormorant text-lg">{t('pricing.subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {tiers.map((key, i) => {
            const tier = pricing[key];
            const isHighlight = tier.highlight;
            const isVip = key === 'vip';

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl p-8 transition-all ${
                  isHighlight
                    ? 'bg-terracotta text-cream shadow-2xl scale-105 z-10'
                    : isVip
                    ? 'bg-ink border-2 border-gold-accent/60 text-cream'
                    : 'bg-cream-deep text-ink'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-accent text-ink text-xs font-inter font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star size={11} fill="currentColor" />
                    {t('pricing.popular')}
                  </div>
                )}
                {isVip && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-accent text-ink text-xs font-inter font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star size={11} fill="currentColor" />
                    {t('pricing.vip_badge')}
                  </div>
                )}

                <h3 className={`font-display font-bold text-xl mb-1 ${isAr ? 'text-right' : ''}`}>
                  {isAr ? tier.label.ar : tier.label.en}
                </h3>
                <p className={`text-sm opacity-70 mb-6 font-cormorant ${isAr ? 'text-right' : ''}`}>
                  {isAr ? tier.description.ar : tier.description.en}
                </p>

                <div className={`mb-6 ${isAr ? 'text-right' : ''}`}>
                  <span className="text-4xl font-display font-black">
                    {tier.price.toLocaleString()}
                  </span>
                  <span className={`text-sm opacity-70 ml-1 font-inter ${isAr ? 'mr-1 ml-0' : ''}`}>
                    {t('common.sar')} / {t('pricing.per_sheep')}
                  </span>
                </div>

                <div className={`mb-8 ${isAr ? 'text-right' : ''}`}>
                  <p className="text-xs font-inter font-semibold uppercase tracking-wider opacity-60 mb-3">{t('pricing.includes')}</p>
                  {(isAr ? tier.specs.ar : tier.specs.en).split(' · ').map((spec) => (
                    <div key={spec} className={`flex items-center gap-2 mb-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle2 size={14} className={`shrink-0 ${isHighlight ? 'text-cream' : isVip ? 'text-gold-accent' : 'text-terracotta'}`} />
                      <span className="text-sm font-cormorant">{spec}</span>
                    </div>
                  ))}
                  {pricing.bulkDiscountPct > 0 && (
                    <p className={`text-xs opacity-60 mt-3 font-inter ${isAr ? 'text-right' : ''}`}>
                      {t('pricing.bulk_note')}
                    </p>
                  )}
                </div>

                <a
                  href="#booking"
                  className={`block text-center py-3 px-6 rounded-lg font-inter font-semibold text-sm transition-all ${
                    isHighlight
                      ? 'bg-cream text-terracotta hover:bg-cream-deep'
                      : isVip
                      ? 'bg-gold-accent text-ink hover:bg-ochre'
                      : 'bg-terracotta text-cream hover:bg-terracotta-dark'
                  }`}
                >
                  {t('pricing.select')}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
