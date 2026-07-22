import { useEffect } from 'react';

export interface SeoHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
}

export default function SeoHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogType = 'website',
  ogImage = '/logo.png',
}: SeoHeadProps) {
  useEffect(() => {
    // Update Page Title
    const siteTitle = `${title} | BookMySpace`;
    document.title = siteTitle;

    // Helper to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrValue: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set link tag (e.g. canonical)
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords.length > 0) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }

    // OpenGraph Meta
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', siteTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', window.location.origin + ogImage);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', window.location.href);

    // Twitter Card Meta
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', siteTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', window.location.origin + ogImage);

    // Canonical Link
    const href = canonicalUrl || window.location.href;
    setLinkTag('canonical', href);
  }, [title, description, keywords, canonicalUrl, ogType, ogImage]);

  return null;
}
