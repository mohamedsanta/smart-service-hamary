import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { TrustBadges } from '../shared/TrustBadges';
import { useInventory } from '../../hooks/useInventory';
import { company } from '../../config/company';

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

export function Hero() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const inventory = useInventory();
  const countdown = useCountdown(company.estimatedArrivalDate);

  const countdownUnits = [
    { label: t('countdown.days'), value: countdown.days },
    { label: t('countdown.hours'), value: countdown.hours },
    { label: t('countdown.minutes'), value: countdown.minutes },
    { label: t('countdown.seconds'), value: countdown.seconds },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        {/* TODO: REPLACE with real Smart Service hero photo */}
        <img
          src="https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=1920&q=80"
          alt="Hamary sheep from Kordofan"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/50 to-ink/80" />
      </div>

      {/* Content */}
      <div className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 ${isAr ? 'text-right' : 'text-left'}`}>
        {/* Delivery notice */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`inline-flex items-center gap-2 bg-terracotta/80 backdrop-blur-sm text-cream rounded-full px-4 py-1.5 text-xs font-inter font-medium mb-6 ${isAr ? 'flex-row-reverse' : ''}`}
        >
          <MapPin size={12} />
          {t('hero.delivery_notice')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-black text-cream leading-tight mb-2"
        >
          {t('hero.headline')}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gold-accent leading-tight mb-6"
        >
          {t('hero.subheadline')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-cream/85 max-w-2xl mb-8 leading-relaxed font-cormorant"
        >
          {t('hero.description')}
        </motion.p>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${isAr ? 'flex justify-end' : 'flex justify-start'} mb-10`}
        >
          <TrustBadges />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`flex flex-wrap gap-4 mb-12 ${isAr ? 'flex-row-reverse' : ''}`}
        >
          <a href="#booking" className="btn-primary text-base px-8 py-4 rounded-md">
            {t('hero.cta_primary')}
          </a>
          <a href="#why" className="btn-secondary border-cream text-cream hover:bg-cream hover:text-ink text-base px-8 py-4 rounded-md">
            {t('hero.cta_secondary')}
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`flex flex-wrap gap-8 ${isAr ? 'flex-row-reverse' : ''}`}
        >
          {/* Countdown */}
          <div>
            <p className="text-cream/60 text-xs font-inter uppercase tracking-widest mb-2">{t('hero.arrival')}</p>
            <div className={`flex gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
              {countdownUnits.map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-display font-bold text-cream bg-white/10 backdrop-blur-sm rounded px-3 py-1 min-w-[48px]">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-cream/50 text-xs mt-1 font-inter">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          {inventory && (
            <div>
              <p className="text-cream/60 text-xs font-inter uppercase tracking-widest mb-2">{t('hero.remaining')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-display font-bold text-gold-accent">{inventory.available}</span>
                <span className="text-cream/70 font-inter">/ {inventory.totalCapacity}</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/20 rounded-full w-32">
                <div
                  className="h-full bg-gold-accent rounded-full transition-all"
                  style={{ width: `${(inventory.available / inventory.totalCapacity) * 100}%` }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}
