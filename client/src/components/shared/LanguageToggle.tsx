import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [isAr]);

  const toggle = () => i18n.changeLanguage(isAr ? 'en' : 'ar');

  return (
    <button
      onClick={toggle}
      className={`text-sm font-semibold font-inter border border-current rounded px-3 py-1 transition-colors hover:bg-terracotta hover:text-cream hover:border-terracotta ${className}`}
      aria-label="Toggle language"
    >
      {isAr ? 'EN' : 'ع'}
    </button>
  );
}
