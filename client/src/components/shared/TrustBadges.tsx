import { useTranslation } from 'react-i18next';
import { Scale, Calendar, Stethoscope, Moon } from 'lucide-react';

const badges = [
  { key: 'weight', icon: Scale },
  { key: 'age', icon: Calendar },
  { key: 'vet', icon: Stethoscope },
  { key: 'hajj', icon: Moon },
];

export function TrustBadges({ className = '' }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {badges.map(({ key, icon: Icon }) => (
        <div
          key={key}
          className="flex items-center gap-2 bg-cream/20 backdrop-blur-sm border border-cream/30 rounded-full px-4 py-2 text-cream"
        >
          <Icon size={14} className="shrink-0 opacity-90" />
          <span className="text-sm font-inter font-medium whitespace-nowrap">{t(`badges.${key}`)}</span>
        </div>
      ))}
    </div>
  );
}
