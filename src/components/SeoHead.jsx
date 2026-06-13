import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  SITE_NAME,
  SEO_HOME_TITLE,
  SEO_HOME_DESCRIPTION,
  SEO_OG_TITLE,
  SEO_OG_DESCRIPTION,
  SEO_OG_IMAGE,
  SEO_KEYWORDS,
  buildLocalBusinessJsonLd,
} from '../seo/siteConfig.js';

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'איך יודעים אם כדאי לתקן או להחליף כלי חשמלי?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אנו מבצעים אבחון מקצועי ללא התחייבות. אם עלות התיקון נמוכה משמעותית ממחיר כלי חדש והחלקים זמינים — כדאי לתקן. נמליץ לכם ביושר.',
      },
    },
    {
      '@type': 'Question',
      name: 'מה זמן תיקון ממוצע לקורקינט חשמלי?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'תלוי בסוג התקלה. תקלות חשמל פשוטות נפתרות תוך יום-יומיים. תקלות מורכבות כמו החלפת צמה ראשית או מנוע עשויות לקחת 3-5 ימי עסקים.',
      },
    },
    {
      '@type': 'Question',
      name: 'האם אתם נותנים אחריות על התיקון?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'כן! כל תיקון מבוצע באחריות מלאה. אנו עומדים מאחורי העבודה שלנו ומספקים אחריות על חלקי החילוף ועבודת התיקון.',
      },
    },
    {
      '@type': 'Question',
      name: 'אתם מגיעים עד הבית או רק במעבדה?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'אנו מציעים שירות עד הבית ללקוחות פרטיים. תיאום מראש באזור המרכז. כמו כן, ניתן להביא את הכלי למעבדה שלנו.',
      },
    },
    {
      '@type': 'Question',
      name: 'כמה עולה ביקור טכנאי לתיקון קורקינט?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'ביקור טכנאי עם אבחון מקצועי מתחיל מ-250 ₪. המחיר הסופי תלוי בסוג התקלה ובחלקים הנדרשים. אנחנו נותנים הצעת מחיר שקופה לפני כל עבודה.',
      },
    },
  ],
};

const serviceListLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'תיקון כלי רכב חשמליים',
  provider: {
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: SITE_URL,
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'שירותי תיקון וטיפול',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'אבחון תקלות מקצועי' },
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ILS', price: '250', minPrice: '250' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'תיקוני חשמל ותקלות מורכבות' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'החלפת סוללה לקורקינט חשמלי' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'החלפת מנוע קורקינט ואופניים חשמליים' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'תיקון Inokim, Teverun, Nami' },
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'תחזוקה שוטפת ואבחון מניעתי' },
      },
    ],
  },
};

/** מטא-תגיות + JSON-LD לדף הבית */
export default function SeoHead() {
  const canonical = `${SITE_URL}/`;
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <Helmet prioritizeSeoTags htmlAttributes={{ lang: 'he', dir: 'rtl' }}>
      <title>{SEO_HOME_TITLE}</title>
      <meta name="description" content={SEO_HOME_DESCRIPTION} />
      <meta name="keywords" content={SEO_KEYWORDS} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={SEO_OG_TITLE} />
      <meta property="og:description" content={SEO_OG_DESCRIPTION} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={SEO_OG_IMAGE} />
      <meta property="og:image:secure_url" content={SEO_OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="israelfix – טכנאי קורקינטים ואופניים חשמליים" />

      {/* Twitter / WhatsApp */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SEO_OG_TITLE} />
      <meta name="twitter:description" content={SEO_OG_DESCRIPTION} />
      <meta name="twitter:image" content={SEO_OG_IMAGE} />

      {/* גיאוגרפי */}
      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="ישראל, מרכז" />

      {/* Schema.org */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      <script type="application/ld+json">{JSON.stringify(serviceListLd)}</script>
    </Helmet>
  );
}
