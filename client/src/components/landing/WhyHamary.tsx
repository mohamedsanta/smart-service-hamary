import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const cards = [
  {
    key: 'origin',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <circle cx="32" cy="26" r="10" stroke="#b04a2a" strokeWidth="2.5" fill="none"/>
        <path d="M32 36v20M24 48h16" stroke="#b04a2a" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="32" cy="26" r="3" fill="#b04a2a"/>
      </svg>
    ),
  },
  {
    key: 'coat',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <path d="M12 44C12 44 18 28 32 28C46 28 52 44 52 44" stroke="#b04a2a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <ellipse cx="32" cy="24" rx="12" ry="10" stroke="#b04a2a" strokeWidth="2.5" fill="none"/>
        <path d="M26 20C26 20 28 24 32 24C36 24 38 20 38 20" stroke="#b04a2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="32" cy="18" r="2.5" fill="#b04a2a"/>
      </svg>
    ),
  },
  {
    key: 'flavor',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <path d="M32 8C32 8 20 18 20 30C20 38.84 25.37 46 32 46C38.63 46 44 38.84 44 30C44 18 32 8 32 8Z" stroke="#b04a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M24 32C24 32 28 36 32 36C36 36 40 32 40 32" stroke="#b04a2a" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M32 46L32 56" stroke="#b04a2a" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'tradition',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-14 h-14">
        <path d="M44 16C44 16 40 12 32 14C24 16 20 22 20 30C20 38 26 44 34 44C40 44 46 40 48 34" stroke="#b04a2a" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="46" cy="14" r="4" stroke="#b04a2a" strokeWidth="2" fill="none"/>
        <path d="M32 10L32 8M42 20L44 18M22 20L20 18M20 32L18 32M44 32L46 32" stroke="#b04a2a" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const specRows = [
  { key: 'breed', label_en: 'Breed', label_ar: 'السلالة', val: 'specs_breed' },
  { key: 'weight', label_en: 'Weight', label_ar: 'الوزن', val: 'specs_weight' },
  { key: 'age', label_en: 'Age', label_ar: 'العمر', val: 'specs_age' },
  { key: 'health', label_en: 'Health', label_ar: 'الصحة', val: 'specs_health' },
  { key: 'sacrifice', label_en: 'Sacrifice-ready', label_ar: 'صلاحية الأضحية', val: 'specs_sacrifice' },
  { key: 'origin', label_en: 'Origin', label_ar: 'المنشأ', val: 'specs_origin' },
];

export function WhyHamary() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section id="why" className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`mb-14 ${isAr ? 'text-right' : 'text-left'}`}
      >
        <h2 className="section-title mb-4">{t('why.title')}</h2>
        <p className="text-ink-soft text-lg font-cormorant max-w-2xl">{t('why.subtitle')}</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map(({ key, icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(176,74,42,0.12)' }}
            className={`card hover:border-terracotta/40 transition-all cursor-default ${isAr ? 'text-right' : ''}`}
          >
            <div className={`mb-4 ${isAr ? 'flex justify-end' : ''}`}>{icon}</div>
            <h3 className="font-display font-bold text-lg text-ink mb-2">{t(`why.${key}_title`)}</h3>
            <p className="text-ink-soft text-sm leading-relaxed font-cormorant">{t(`why.${key}_desc`)}</p>
          </motion.div>
        ))}
      </div>

      {/* Specifications card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="card border-terracotta/30 bg-cream-deep"
      >
        <h3 className={`font-display font-bold text-xl text-terracotta mb-6 ${isAr ? 'text-right' : ''}`}>
          {t('why.specs_title')}
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {specRows.map(({ key, label_en, label_ar, val }) => (
            <div key={key} className={`flex items-start gap-3 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
              <CheckCircle2 size={18} className="shrink-0 text-terracotta mt-0.5" />
              <div>
                <span className="font-inter font-semibold text-sm text-ink">
                  {isAr ? label_ar : label_en}:{' '}
                </span>
                <span className="text-ink-soft text-sm">{t(`why.${val}`)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
