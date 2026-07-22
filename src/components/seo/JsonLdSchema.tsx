import { useEffect } from 'react';
import type { Property } from '../../types';

export interface JsonLdSchemaProps {
  categoryTitle: string;
  categoryUrl: string;
  faqs?: { question: string; answer: string }[];
  properties?: Property[];
}

export default function JsonLdSchema({
  categoryTitle,
  categoryUrl,
  faqs = [],
  properties = [],
}: JsonLdSchemaProps) {
  useEffect(() => {
    const scriptId = 'json-ld-category-schema';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    const currentOrigin = window.location.origin;

    // 1. Breadcrumb Schema
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': currentOrigin,
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Rental Properties',
          'item': `${currentOrigin}/properties`,
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': categoryTitle,
          'item': categoryUrl.startsWith('http') ? categoryUrl : `${currentOrigin}${categoryUrl}`,
        },
      ],
    };

    // 2. ItemList Schema for listings
    const itemListSchema = properties.length > 0 ? {
      '@type': 'ItemList',
      'name': categoryTitle,
      'description': `Verified rental listings in ${categoryTitle}`,
      'numberOfItems': properties.length,
      'itemListElement': properties.map((prop, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'url': `${currentOrigin}/properties/${prop._id}`,
        'name': prop.title,
      })),
    } : null;

    // 3. FAQ Schema
    const faqSchema = faqs.length > 0 ? {
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer,
        },
      })),
    } : null;

    const graph = [breadcrumbSchema, itemListSchema, faqSchema].filter(Boolean);

    scriptElement.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [categoryTitle, categoryUrl, faqs, properties]);

  return null;
}
