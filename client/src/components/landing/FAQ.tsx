import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const questionKeys = ['q1','q2','q3','q4','q5','q6','q7','q8','q9'];

export function FAQ() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mb-12 ${isAr ? 'text-right' : ''}`}
      >
        <h2 className="section-title mb-4">{t('faq.title')}</h2>
        <p className="text-ink-soft font-cormorant text-lg">{t('faq.subtitle')}</p>
      </motion.div>

      <div className="space-y-3">
        {questionKeys.map((k, i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="border border-line rounded-xl overflow-hidden bg-cream-deep"
          >
            <button
              onClick={() => setOpen(open === k ? null : k)}
              className={`w-full flex items-center justify-between p-5 hover:bg-sand/20 transition-colors ${isAr ? 'flex-row-reverse text-right' : ''}`}
            >
              <span className="font-display font-semibold text-ink">{t(`faq.${k}`)}</span>
              <motion.div animate={{ rotate: open === k ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={18} className="text-terracotta shrink-0" />
              </motion.div>
            </button>
            <AnimatePresence>
              {open === k && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className={`px-5 pb-5 text-ink-soft font-cormorant leading-relaxed text-[15px] ${isAr ? 'text-right' : ''}`}>
                    {t(`faq.a${k.slice(1)}`)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
