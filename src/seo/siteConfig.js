/**
 * הגדרות אתר ל-SEO ול-Schema.org.
 * הגדר ב-.env: VITE_SITE_URL=https://www.ha-domein-shelcha.co.il (ללא סלאש בסוף)
 */
const raw = import.meta.env.VITE_SITE_URL || 'https://www.e-tech-israel.co.il';
export const SITE_URL = raw.replace(/\/$/, '');

export const SITE_NAME = 'ישראל טכנאי קורקינטים ואופניים חשמליים';
export const BUSINESS_LEGAL_NAME = 'ישראל — טכנאי מקצועי לכלים חשמליים';

/** E.164 לשימוש ב-schema ולקישורי טלפון */
export const BUSINESS_PHONE_E164 = '+972501234567';

export const SEO_HOME_TITLE =
  'ישראל טכנאי קורקינטים ואופניים חשמליים | שירות מהיר ואמין בישראל';

export const SEO_HOME_DESCRIPTION =
  'ישראל טכנאי קורקינטים ואופניים חשמליים. שירות תיקונים מהיר ומקצועי עד הבית בפתח תקווה, אלעד, ראש העין, הוד השרון, רעננה וכפר סבא. אבחון, החלפת סוללה, מנועים ותקלות חשמל.';

export const SEO_KEYWORDS =
  'טכנאי קורקינטים פתח תקווה, תיקון אופניים חשמליים כפר סבא, תיקון קורקינטים רעננה, הוד השרון, אלעד, ראש העין, החלפת סוללה לקורקינט, תיקון אופניים חשמליים, טכנאי קורקינטים ואופניים';

export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE_NAME,
    image: [
      `${SITE_URL}/images/og-card.jpg`,
      `${SITE_URL}/images/logo.png`
    ],
    description: SEO_HOME_DESCRIPTION,
    url: SITE_URL,
    telephone: BUSINESS_PHONE_E164,
    priceRange: '₪₪',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressRegion: 'מרכז',
    },
    areaServed: [
      { '@type': 'Country', name: 'ישראל' },
      { '@type': 'City', name: 'פתח תקווה' },
      { '@type': 'City', name: 'אלעד' },
      { '@type': 'City', name: 'ראש העין' },
      { '@type': 'City', name: 'הוד השרון' },
      { '@type': 'City', name: 'רעננה' },
      { '@type': 'City', name: 'כפר סבא' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '120'
    }
  };
}

export function buildFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'האם ישראל מתקן גם תקלות חשמל מורכבות וצמות?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'כן, ישראל מתמחה בפתרון תקלות חשמל מורכבות שלרוב נשארות ללא מענה, כולל החלפת צמות ראשיות וצמות מנוע.'
        }
      },
      {
        '@type': 'Question',
        name: 'לאילו כלים חשמליים ניתן לקבל שירות?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ישראל מטפל בקורקינטים, אופניים חשמליים, טרקטורונים וקלנועיות מכל הסוגים והחברות המובילות (כמו TEVERUN, NAMI, INOKIM).'
        }
      }
    ]
  };
}

export function buildPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'ישראל',
    jobTitle: 'טכנאי מומחה לקורקינטים ואופניים חשמליים',
    description: 'טכנאי מקצועי עם למעלה מעשור ניסיון בתיקון כלים חשמליים, אבחון תקלות מורכבות, והרכבות מנועים במרכז והשפלה.',
    knowsAbout: [
      'תיקון קורקינט חשמלי',
      'תיקון אופניים חשמליים',
      'החלפת סוללה לקורקינט',
      'תיקון מנוע כלי רכיב',
      'תקלות חשמל בקורקינט',
      'חילוץ ברגים תקועים',
      'הלחמות מקצועיות'
    ],
    worksFor: {
      '@type': 'LocalBusiness',
      name: SITE_NAME
    },
    telephone: BUSINESS_PHONE_E164
  };
}

export function buildServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'ElectricScooterRepair',
    name: 'שירותי מעבדה וטכנאי לכלים חשמליים',
    description: 'אבחון מקצועי, תיקוני חשמל, צמות, חילוץ ברגים, צמיגים, והלחמות.',
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_NAME
    },
    areaServed: [
      { '@type': 'Country', name: 'ישראל' },
      { '@type': 'City', name: 'פתח תקווה' },
      { '@type': 'City', name: 'אלעד' },
      { '@type': 'City', name: 'ראש העין' },
      { '@type': 'City', name: 'הוד השרון' },
      { '@type': 'City', name: 'רעננה' },
      { '@type': 'City', name: 'כפר סבא' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'שירותי המעבדה של ישראל',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'אבחון תקלות ותיקוני חשמל מורכבים',
            description: 'פתרון בעיות חשמל מורכבות שחנויות רבות לא מצליחות לתקן.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'החלפת סוללה וצמות',
            description: 'החלפת סוללות לקורקינטים, אופניים וטרקטורונים וכן החלפת צמות מנוע.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'הרכבת צמיגים וחילוץ ברגים',
            description: 'חילוץ ברגים שבורים ותקועים, והרכבת כל סוגי הצמיגים.'
          }
        }
      ]
    }
  };
}

export function buildBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'דף הבית',
        item: SITE_URL + '/'
      }
    ]
  };
}

export function buildWebPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITE_URL + '/#webpage',
    url: SITE_URL + '/',
    name: SEO_HOME_TITLE,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: SITE_URL + '/images/og-card.jpg',
      width: 1200,
      height: 630
    }
  };
}
