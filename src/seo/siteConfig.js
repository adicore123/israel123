/**
 * הגדרות אתר ל-SEO ול-Schema.org.
 * הגדר ב-.env: VITE_SITE_URL=https://www.ha-domein-shelcha.co.il (ללא סלאש בסוף)
 */
const raw = import.meta.env.VITE_SITE_URL || 'https://www.example.com';
export const SITE_URL = raw.replace(/\/$/, '');

export const SITE_NAME = 'israelfix';
export const BUSINESS_LEGAL_NAME = 'israelfix — טכנאי מקצועי לכלים חשמליים';

/** E.164 לשימוש ב-schema ולקישורי טלפון */
export const BUSINESS_PHONE_E164 = '+972545050609';

export const SEO_OG_TITLE =
  'קורקינט או אופניים חשמליים תקועים? טכנאי מגיע עד אליך – החל מ-250 ₪';

export const SEO_OG_DESCRIPTION =
  'אבחון מקצועי, תיקון סוללות, מנועים וצמות – Inokim, Teverun, Nami וכל הדגמים. טכנאי מוסמך עם 10 שנות ניסיון. השאר פרטים ונחזור אליך תוך שעה!';

export const SEO_OG_IMAGE =
  'https://qlywwlsbfnwqurmwsetz.supabase.co/storage/v1/object/public/catalog-images/product-1780222255275.png';

export const SEO_HOME_TITLE =
  'תיקון אופניים חשמליים וקורקינטים | טכנאי מומחה | israelfix ישראל';

export const SEO_HOME_DESCRIPTION =
  'טכנאי קורקינטים חשמליים ותיקון אופניים חשמליים בישראל. אבחון מקצועי, החלפת סוללה לקורקינט, תיקון מנוע, צמות ותקלות חשמל. שירות לפרטיים ולעסקים — מרכז הארץ.';

export const SEO_KEYWORDS =
  'טכנאי קורקינטים חשמליים, תיקון אופניים חשמליים ישראל, החלפת סוללה לקורקינט, תיקון קורקינט, טכנאי אופניים חשמליים, תיקון טרקטורון חשמלי, קלנועית, אבחון חשמל כלי רכיב';

/** JSON-LD LocalBusiness + ProfessionalService */
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    name: SITE_NAME,
    legalName: BUSINESS_LEGAL_NAME,
    description: SEO_OG_DESCRIPTION,
    url: SITE_URL,
    image: SEO_OG_IMAGE,
    telephone: BUSINESS_PHONE_E164,
    priceRange: '250₪–1500₪',
    currenciesAccepted: 'ILS',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    areaServed: [
      { '@type': 'Country', name: 'Israel' },
      { '@type': 'City', name: 'תל אביב' },
      { '@type': 'City', name: 'רמת גן' },
      { '@type': 'City', name: 'גבעתיים' },
      { '@type': 'City', name: 'פתח תקווה' },
      { '@type': 'City', name: 'ראשון לציון' },
      { '@type': 'City', name: 'חולון' },
      { '@type': 'City', name: 'בת ים' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressRegion: 'מרכז',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'ביקור טכנאי ואבחון מקצועי',
        description: 'ביקור עד הבית עם אבחון מלא של הכלי החשמלי',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'ILS',
          minPrice: '250',
          price: '250',
        },
      },
      {
        '@type': 'Offer',
        name: 'תיקון קורקינט חשמלי Inokim',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', minPrice: '250' },
      },
      {
        '@type': 'Offer',
        name: 'תיקון קורקינט חשמלי Teverun',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', minPrice: '250' },
      },
      {
        '@type': 'Offer',
        name: 'תיקון קורקינט חשמלי Nami',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', minPrice: '250' },
      },
      {
        '@type': 'Offer',
        name: 'החלפת סוללה לקורקינט חשמלי',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', minPrice: '400' },
      },
      {
        '@type': 'Offer',
        name: 'תיקון אופניים חשמליים',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', minPrice: '250' },
      },
    ],
    knowsAbout: [
      'תיקון קורקינט חשמלי',
      'תיקון אופניים חשמליים',
      'החלפת סוללה לקורקינט',
      'תיקון מנוע Inokim',
      'תיקון מנוע Teverun',
      'תיקון מנוע Nami',
      'תיקון טרקטורון חשמלי',
      'תקלות חשמל בקורקינט',
      'תיקון בקר מנוע',
      'החלפת צמה ראשית',
    ],
    sameAs: [
      `https://wa.me/${BUSINESS_PHONE_E164.replace('+', '')}`,
    ],
  };
}
