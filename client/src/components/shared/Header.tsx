import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { company } from '../../config/company';

export function Header() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t('nav.why'), href: '#why' },
    { label: t('nav.booking'), href: '#booking' },
    { label: t('nav.journey'), href: '#journey' },
    { label: t('nav.faq'), href: '#faq' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm border-b border-line' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
          <RamSilhouette />
          <span className="font-display font-bold text-xl text-terracotta leading-none">
            {isAr ? company.name.ar : company.name.en}
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className={`hidden md:flex items-center gap-6 ${isAr ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-inter text-ink-soft hover:text-terracotta transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse' : ''}`}>
          <a href={`tel:${company.phone}`} className="hidden sm:flex items-center gap-1.5 text-ink-soft hover:text-terracotta text-sm transition-colors">
            <Phone size={15} />
            <span className="hidden lg:inline font-inter">{company.phone}</span>
          </a>
          <a
            href={`https://wa.me/${company.whatsappRaw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle size={16} />
          </a>
          <LanguageToggle className="text-ink-soft" />
          <button className="md:hidden p-1 text-ink" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-line px-4 py-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2.5 text-ink-soft hover:text-terracotta font-inter text-sm border-b border-line/50 ${isAr ? 'text-right' : ''}`}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

function RamSilhouette() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 22C8 22 5 20 4 17C3 14 4 11 6 10C8 9 10 10 10 10C10 10 8 7 10 5C12 3 14 4 15 5C16 4 18 2 20 3C22 4 22 7 21 9C23 9 25 10 25 13C25 16 23 18 21 19C20 21 18 23 16 23C14 23 12 22 11 22L8 22Z" fill="#b04a2a" opacity="0.9"/>
      <path d="M6 10C5 9 3 10 2 12C1 14 2 16 3 17" stroke="#b04a2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M21 9C22 8 24 9 25 11C26 13 25 15 24 16" stroke="#b04a2a" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <ellipse cx="12" cy="14" rx="1" ry="1" fill="#f5ecd9"/>
      <path d="M10 22L9 26M16 23L16 27M11 22L10.5 26" stroke="#b04a2a" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
