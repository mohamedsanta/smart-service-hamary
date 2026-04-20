import { useTranslation } from 'react-i18next';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { LanguageToggle } from '../shared/LanguageToggle';
import { company } from '../../config/company';

export function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="bg-ink text-cream/80 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className={`grid sm:grid-cols-3 gap-10 mb-12 ${isAr ? 'text-right' : ''}`}>
          {/* Brand */}
          <div>
            <h3 className="font-display font-bold text-xl text-cream mb-3">
              {isAr ? company.name.ar : company.name.en}
            </h3>
            <p className="text-sm font-cormorant leading-relaxed mb-4 text-cream/60">
              {isAr ? company.tagline.ar : company.tagline.en}
            </p>
            <div className="inline-flex items-center gap-2 bg-terracotta/20 border border-terracotta/30 rounded-full px-4 py-2 text-xs font-inter text-terracotta">
              <MapPin size={11} />
              {t('footer.delivery_notice')}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-inter font-semibold text-sm text-cream/50 uppercase tracking-wider mb-4">
              {isAr ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            {[
              { href: '#why', label: t('nav.why') },
              { href: '#booking', label: t('nav.booking') },
              { href: '#journey', label: t('nav.journey') },
              { href: '#faq', label: t('nav.faq') },
              { href: '#contact', label: t('nav.contact') },
            ].map((l) => (
              <a key={l.href} href={l.href} className="block py-1 text-sm text-cream/60 hover:text-terracotta transition-colors font-inter">
                {l.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-inter font-semibold text-sm text-cream/50 uppercase tracking-wider mb-4">
              {isAr ? 'تواصل معنا' : 'Contact'}
            </h4>
            <div className="space-y-3">
              <a href={`tel:${company.phone}`} className={`flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
                <Phone size={14} /> {company.phone}
              </a>
              <a href={`https://wa.me/${company.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
                <MessageCircle size={14} /> {isAr ? 'واتساب' : 'WhatsApp'}
              </a>
              <a href={`mailto:${company.email}`} className={`flex items-center gap-2 text-sm text-cream/60 hover:text-cream transition-colors ${isAr ? 'flex-row-reverse' : ''}`}>
                <Mail size={14} /> {company.email}
              </a>
              <div className={`flex items-center gap-2 text-sm text-cream/60 ${isAr ? 'flex-row-reverse' : ''}`}>
                <MapPin size={14} /> {isAr ? company.address.ar : company.address.en}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className={`flex flex-wrap justify-between items-center gap-4 ${isAr ? 'flex-row-reverse' : ''}`}>
            <p className="text-xs text-cream/40 font-inter">
              © {new Date().getFullYear()} {isAr ? company.name.ar : company.name.en}. {t('footer.rights')}
            </p>
            <p className="text-xs text-cream/40 font-cormorant">{t('footer.tagline')}</p>
            <LanguageToggle className="text-cream/50 border-cream/30" />
          </div>
        </div>
      </div>
    </footer>
  );
}
