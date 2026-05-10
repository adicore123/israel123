/**
 * הגדרות אתר ל-SEO ול-Schema.org.
 * הגדר ב-.env: VITE_SITE_URL=https://www.ha-domein-shelcha.co.il (ללא סלאש בסוף)
 */
const raw = import.meta.env.VITE_SITE_URL || 'https://www.example.com';
export const SITE_URL = raw.replace(/\/$/, '');

export const SITE_NAME = 'E-TECH';
export const BUSINESS_LEGAL_NAME = 'E-TECH — טכנאי מקצועי לכלים חשמליים';

/** E.164 לשימוש ב-schema ולקישורי טלפון */
export const BUSINESS_PHONE_E164 = '+972545050609';

export const SEO_OG_TITLE =
  'תיקון אופניים חשמליים וקורקינטים | טכנאי מומחה בישראל | E-TECH';

export const SEO_OG_DESCRIPTION =
  'טכנאי מומחה לתיקון אופניים חשמליים, קורקינטים חשמליים, טרקטורונים וקלנועיות. אבחון מקצועי, תיקוני חשמל ומנוע, שירות מהיר ואמין. חייג עכשיו!';

export const SEO_HOME_TITLE =
  'תיקון אופניים חשמליים וקורקינטים | טכנאי מומחה | E-TECH ישראל';

export const SEO_HOME_DESCRIPTION =
  'טכנאי קורקינטים חשמליים ותיקון אופניים חשמליים בישראל. אבחון מקצועי, החלפת סוללה לקורקינט, תיקון מנוע, צמות ותקלות חשמל. שירות לפרטיים ולעסקים — מרכז הארץ.';

export const SEO_KEYWORDS =
  'טכנאי קורקינטים חשמליים, תיקון אופניים חשמליים ישראל, החלפת סוללה לקורקינט, תיקון קורקינט, טכנאי אופניים חשמליים, תיקון טרקטורון חשמלי, קלנועית, אבחון חשמל כלי רכיב';

/** JSON-LD LocalBusiness — עדכן כתובת פיזית כשיהיה רלוונטי */
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: SEO_HOME_DESCRIPTION,
    url: SITE_URL,
    telephone: BUSINESS_PHONE_E164,
    priceRange: '$$',
    areaServed: [
      { '@type': 'Country', name: 'ישראל' },
      { '@type': 'AdministrativeArea', name: 'מרכז' },
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
    knowsAbout: [
      'תיקון קורקינט חשמלי',
      'תיקון אופניים חשמליים',
      'החלפת סוללה לקורקינט',
      'תיקון מנוע כלי רכיב',
      'תקלות חשמל בקורקינט',
    ],
  };
}
