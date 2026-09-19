import { Language, SeoMetadata, Tool, Category } from '../types';

/**
 * Updates runtime document SEO meta tags for OpenGraph, Twitter, and Search engines.
 */
export function updatePageSeo(seo: {
  title: string;
  description: string;
  canonicalUrl?: string;
  type?: 'website' | 'article';
  jsonLd?: object;
}) {
  // 1. Page Title
  document.title = seo.title;

  // 2. Meta description
  setMetaTag('description', seo.description);

  // 3. OpenGraph Tags
  setMetaTag('og:title', seo.title, 'property');
  setMetaTag('og:description', seo.description, 'property');
  setMetaTag('og:type', seo.type || 'website', 'property');
  if (seo.canonicalUrl) {
    setMetaTag('og:url', seo.canonicalUrl, 'property');
  }

  // 4. Twitter Tags
  setMetaTag('twitter:title', seo.title, 'name');
  setMetaTag('twitter:description', seo.description, 'name');
  setMetaTag('twitter:card', 'summary_large_image', 'name');

  // 5. Canonical Link
  let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', seo.canonicalUrl || window.location.href);

  // 6. JSON-LD Structured Data
  let script = document.getElementById('toolverse-dynamic-jsonld') as HTMLScriptElement | null;
  if (seo.jsonLd) {
    if (!script) {
      script = document.createElement('script');
      script.id = 'toolverse-dynamic-jsonld';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(seo.jsonLd);
  } else if (script) {
    script.remove();
  }
}

function setMetaTag(nameOrProperty: string, content: string, attributeName: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attributeName}="${nameOrProperty}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, nameOrProperty);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Builds Schema.org JSON-LD for a Tool
 */
export function buildToolJsonLd(tool: Tool, lang: Language) {
  const isAr = lang === 'ar';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    alternateName: tool.nameAr,
    description: isAr ? tool.descriptionAr : tool.descriptionEn,
    applicationCategory: tool.category,
    operatingSystem: 'All',
    url: tool.officialUrl,
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'Free' ? '0' : 'Varies',
      priceCurrency: 'USD'
    },
    keywords: tool.keywords.join(', ')
  };
}

/**
 * Builds Schema.org JSON-LD for a Category
 */
export function buildCategoryJsonLd(category: Category, count: number, lang: Language) {
  const isAr = lang === 'ar';
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isAr ? category.nameAr : category.nameEn,
    description: isAr ? category.descriptionAr : category.descriptionEn,
    url: `${window.location.origin}/category/${category.slug}`,
    numberOfItems: count
  };
}
