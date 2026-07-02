import React from 'react';

const RobotsTxt = () => {
  const content = `# robots.txt for BOYZ IN THE WOODZ
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /account/
Disallow: /cart/
Disallow: /checkout/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password

# Sitemaps
Sitemap: https://boyzinthewoodz.com/sitemap.xml

# Crawl delay
Crawl-delay: 2

# Host
Host: https://boyzinthewoodz.com`;

  return <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{content}</pre>;
};

export default RobotsTxt;