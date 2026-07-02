import { SECTIONS } from '@/pages/Sitemap';

export const generateSitemapXML = () => {
  const baseUrl = 'https://boyzinthewoodz.com';
  const pages = SECTIONS.flatMap(s => 
    s.links.filter(l => !l.external).map(l => ({
      url: `${baseUrl}${l.to}`,
      priority: l.priority || 0.5,
      changefreq: l.changefreq || 'weekly',
      lastmod: new Date().toISOString().split('T')[0],
    }))
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${pages.map(p => `  <url>
    <loc>${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};