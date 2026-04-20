export const pricing = {
  earlyBird: {
    price: 1200, // SAR per sheep — TODO: confirm with owner
    label: { en: 'Early Bird', ar: 'حجز مبكر' },
    description: {
      en: 'Book now before arrival — best available price',
      ar: 'احجز الآن قبل الوصول — أفضل سعر متاح',
    },
    specs: {
      en: 'Min 25 kg · Under 1 year · Vet-certified · Hajj-compliant',
      ar: '25 كجم فأكثر · أقل من سنة · فحص بيطري · مستوفٍ لشروط الأضحية',
    },
    highlight: false,
  },
  standard: {
    price: 1500, // SAR per sheep — TODO: confirm with owner
    label: { en: 'Standard', ar: 'قياسي' },
    description: {
      en: 'Standard post-arrival booking',
      ar: 'حجز قياسي بعد الوصول',
    },
    specs: {
      en: 'Min 25 kg · Under 1 year · Vet-certified · Hajj-compliant',
      ar: '25 كجم فأكثر · أقل من سنة · فحص بيطري · مستوفٍ لشروط الأضحية',
    },
    highlight: true,
  },
  vip: {
    price: 1800, // SAR per sheep — TODO: confirm with owner
    label: { en: 'VIP Premium', ar: 'فاخر VIP' },
    description: {
      en: 'Hand-selected top-tier Hamary animals',
      ar: 'اختيار يدوي لأفضل رؤوس الحَمَري',
    },
    specs: {
      en: 'Min 30 kg · Hand-selected premium red coat · Under 1 year · Vet-certified',
      ar: '30 كجم فأكثر · اختيار يدوي مميز · معطف أحمر فاخر · أقل من سنة · فحص بيطري',
    },
    highlight: false,
  },
  bulkThreshold: 5,
  bulkDiscountPct: 7,
  vatPct: 15,
  currency: 'SAR',
};

export type TierKey = 'earlyBird' | 'standard' | 'vip';
