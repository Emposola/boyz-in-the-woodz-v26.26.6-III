/* ============================================================
   SEO — Reusable head manager for titles, meta, OG, JSON-LD
   Use: <SEO title="..." description="..." canonical="..." />
   ============================================================ */
import { useEffect } from 'react';

const SITE_NAME = 'BOYZ IN THE WOODZ';
const DEFAULT_DESCRIPTION = 'Brotherhood. Freedom. Nature. A clothing brand and brotherhood movement built for men who need space to breathe. Wilderness retreats, barbershop, and community.';
const DEFAULT_IMAGE = '/images/logos/og-default.jpg';
const SITE_URL = 'https://boyzinthewoodz.com';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;

    document.title = fullTitle;

    setMeta('description', description);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image.startsWith('http') ? image : SITE_URL + image, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('twitter:card', 'summary_large_image', true);
    setMeta('twitter:title', fullTitle, true);
    setMeta('twitter:description', description, true);
    setMeta('twitter:image', image.startsWith('http') ? image : SITE_URL + image, true);

    if (noindex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    if (canonical) {
      const link = document.querySelector("link[rel='canonical']") || document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical.startsWith('http') ? canonical : SITE_URL + canonical;
      if (!link.parentElement) document.head.appendChild(link);
    }

    if (jsonLd) {
      const scriptId = 'json-ld-seo';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonical, image, type, jsonLd, noindex]);

  return null;
}

function setMeta(name, content, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
