export function formatSAR(amount: number, lang = 'en'): string {
  return lang === 'ar'
    ? `${amount.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ريال`
    : `SAR ${amount.toLocaleString('en', { minimumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date, lang = 'en'): string {
  return new Date(date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}
