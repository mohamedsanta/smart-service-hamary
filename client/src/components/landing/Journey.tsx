import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export function Journey() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section id="journey" className="py-24 bg-cream-deep/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-14 ${isAr ? 'text-right' : ''}`}
        >
          <h2 className="section-title mb-4">{t('journey.title')}</h2>
          <p className="text-ink-soft text-lg font-cormorant">{t('journey.subtitle')}</p>
        </motion.div>

        {/* SVG map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <svg viewBox="0 0 900 220" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Background track */}
            <line x1="90" y1="90" x2="810" y2="90" stroke="#c7b38a" strokeWidth="2" strokeDasharray="6 4" opacity="0.4" />

            {/* Animated route line */}
            <motion.path
              d={isAr
                ? "M 810 90 C 700 70, 550 110, 450 90 C 350 70, 200 110, 90 90"
                : "M 90 90 C 200 70, 350 110, 450 90 C 550 70, 700 110, 810 90"
              }
              stroke="#b04a2a"
              strokeWidth="3"
              strokeDasharray="14 8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />

            {/* Kordofan pin */}
            <motion.g initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <circle cx={isAr ? 810 : 90} cy="90" r="16" fill="#b04a2a" opacity="0.15" />
              <circle cx={isAr ? 810 : 90} cy="90" r="9" fill="#b04a2a" />
              <text x={isAr ? 810 : 90} y="130" textAnchor="middle" fontSize="15" fontFamily="serif" fontWeight="700" fill="#231712">
                {t('journey.kordofan')}
              </text>
              <text x={isAr ? 810 : 90} y="150" textAnchor="middle" fontSize="11" fill="#4a342a">
                🌿
              </text>
            </motion.g>

            {/* Port Sudan pin */}
            <motion.g initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
              <circle cx="450" cy="90" r="16" fill="#c88a3d" opacity="0.15" />
              <circle cx="450" cy="90" r="9" fill="#c88a3d" />
              <text x="450" y="130" textAnchor="middle" fontSize="15" fontFamily="serif" fontWeight="700" fill="#231712">
                {t('journey.port_sudan')}
              </text>
              <text x="450" y="150" textAnchor="middle" fontSize="11" fill="#4a342a">
                ⚓
              </text>
            </motion.g>

            {/* Jeddah pin */}
            <motion.g initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 1.6 }}>
              <circle cx={isAr ? 90 : 810} cy="90" r="20" fill="#b04a2a" opacity="0.2" />
              <circle cx={isAr ? 90 : 810} cy="90" r="11" fill="#b04a2a" />
              <circle cx={isAr ? 90 : 810} cy="90" r="5" fill="#f5ecd9" />
              <text x={isAr ? 90 : 810} y="130" textAnchor="middle" fontSize="15" fontFamily="serif" fontWeight="700" fill="#231712">
                {t('journey.jeddah')}
              </text>
              <text x={isAr ? 90 : 810} y="150" textAnchor="middle" fontSize="11" fill="#4a342a">
                🕌
              </text>
            </motion.g>

            {/* Ship icon along route */}
            <motion.text
              y="72"
              fontSize="22"
              textAnchor="middle"
              initial={{ x: isAr ? 810 : 90 }}
              whileInView={{ x: isAr ? 90 : 810 }}
              viewport={{ once: true }}
              transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }}
            >
              🚢
            </motion.text>
          </svg>
        </motion.div>

        {/* Step descriptions */}
        <div className={`grid sm:grid-cols-3 gap-6 mt-8 ${isAr ? 'text-right' : ''}`}>
          {['kordofan', 'port_sudan', 'jeddah'].map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card"
            >
              <h4 className="font-display font-bold text-terracotta mb-2">{t(`journey.${key}`)}</h4>
              <p className="text-ink-soft text-sm font-cormorant leading-relaxed">{t(`journey.${key}_desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
