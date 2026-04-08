import { Helmet } from 'react-helmet-async';
import {
  SITE_URL,
  SITE_NAME,
  SEO_HOME_TITLE,
  SEO_HOME_DESCRIPTION,
  SEO_KEYWORDS,
  buildLocalBusinessJsonLd,
} from '../seo/siteConfig.js';

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

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="he_IL" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={SEO_HOME_TITLE} />
      <meta property="og:description" content={SEO_HOME_DESCRIPTION} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={SEO_HOME_TITLE} />
      <meta name="twitter:description" content={SEO_HOME_DESCRIPTION} />

      <meta name="geo.region" content="IL" />
      <meta name="geo.placename" content="ישראל" />

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
