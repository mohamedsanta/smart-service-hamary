import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { company } from '../../config/company';

// TODO: Replace with real Smart Service gallery photos
const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=800&q=80', alt: 'Hamary sheep 1' },
  { src: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80', alt: 'Livestock flock' },
  { src: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=800&q=80', alt: 'Desert landscape' },
  { src: 'https://images.unsplash.com/photo-1598715685267-0f45367d8071?auto=format&fit=crop&w=800&q=80', alt: 'Rural pastoral' },
  { src: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=800&q=80', alt: 'Hamary sheep 5' },
  { src: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=80', alt: 'Shipment 6' },
];

const testimonials = [
  {
    name: 'Fahd Al-Otaibi', // PLACEHOLDER
    text_en: 'Excellent service — the Hamary sheep arrived healthy and exactly as described. The weight exceeded expectations. Will book again.',
    text_ar: 'خدمة ممتازة — وصلت الخراف بصحة جيدة وبالمواصفات المذكورة تماماً. الوزن تجاوز التوقعات. سأحجز مرة أخرى.',
    city: 'Jeddah',
  },
  {
    name: 'Um Khalid', // PLACEHOLDER
    text_en: 'Very smooth process. Booked online, received the invoice immediately, and the delivery was on time. Highly recommended.',
    text_ar: 'عملية سلسة جداً. حجزت عبر الإنترنت، استلمت الفاتورة فوراً، والتوصيل كان في الموعد. أنصح بشدة.',
    city: 'Al Rawdah',
  },
  {
    name: 'Majed bin Nasser', // PLACEHOLDER
    text_en: 'The VIP selection was worth every riyal. Beautiful red coat, young, healthy. Perfect for our Eid sacrifice.',
    text_ar: 'الاختيار الفاخر كان يستحق كل ريال. معطف أحمر جميل، شاب وصحيح. مثالي لأضحيتنا في عيد الأضحى.',
    city: 'Obhur North',
  },
];

export function TrustSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-cream-deep/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`mb-14 ${isAr ? 'text-right' : ''}`}
        >
          <h2 className="section-title mb-4">{t('trust.title')}</h2>
          <p className="text-ink-soft font-cormorant text-lg">{t('trust.subtitle')}</p>
        </motion.div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`card mb-12 flex flex-wrap gap-6 items-center ${isAr ? 'flex-row-reverse' : ''}`}
        >
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
            <Phone size={18} className="text-terracotta" />
            <a href={`tel:${company.phone}`} className="font-inter text-ink hover:text-terracotta transition-colors">{company.phone}</a>
          </div>
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
            <MessageCircle size={18} className="text-terracotta" />
            <a
              href={`https://wa.me/${company.whatsappRaw}`}
              target="_blank" rel="noopener noreferrer"
              className="font-inter text-ink hover:text-terracotta transition-colors"
            >
              {isAr ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
            <MapPin size={18} className="text-terracotta" />
            <span className="font-inter text-ink-soft">{isAr ? company.address.ar : company.address.en}</span>
          </div>
          <a
            href={`https://wa.me/${company.whatsappRaw}`}
            target="_blank" rel="noopener noreferrer"
            className={`btn-primary ml-auto ${isAr ? 'mr-auto ml-0' : ''}`}
          >
            {isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
          </a>
        </motion.div>

        {/* Gallery */}
        <div className="mb-14">
          <h3 className={`font-display font-bold text-xl text-ink mb-6 ${isAr ? 'text-right' : ''}`}>{t('trust.gallery_title')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.02 }}
                className="aspect-video rounded-xl overflow-hidden"
              >
                {/* TODO: REPLACE with real Smart Service photos */}
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials — PLACEHOLDER content */}
        <div>
          <h3 className={`font-display font-bold text-xl text-ink mb-6 ${isAr ? 'text-right' : ''}`}>{t('trust.testimonials_title')}</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card ${isAr ? 'text-right' : ''}`}
              >
                <div className="text-gold-accent text-xl mb-3">★★★★★</div>
                <p className="text-ink-soft font-cormorant leading-relaxed text-sm mb-4">
                  "{isAr ? t_.text_ar : t_.text_en}"
                </p>
                <div>
                  <div className="font-inter font-semibold text-sm text-ink">{t_.name}</div>
                  <div className="font-inter text-xs text-ink-soft">{t_.city}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
