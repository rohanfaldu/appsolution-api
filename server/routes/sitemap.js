import express from 'express';
import prisma from '../lib/prisma.js';

const router = express.Router();

const BASE_URL = process.env.SITE_URL || 'https://appsellpoint.com';

const staticRoutes = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/products', priority: '0.9', changefreq: 'daily' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  { loc: '/about', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
];

router.get('/sitemap.xml', async (req, res) => {
  try {
    const [products, posts] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        select: { id: true, updatedAt: true },
      }),
    ]);

    const toDate = (d) => new Date(d).toISOString().split('T')[0];

    const urls = [
      ...staticRoutes.map(
        (r) => `<url><loc>${BASE_URL}${r.loc}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
      ),
      ...products.map(
        (p) => `<url><loc>${BASE_URL}/product/${p.slug || p.id}</loc><lastmod>${toDate(p.updatedAt)}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      ),
      ...posts.map(
        (b) => `<url><loc>${BASE_URL}/blog/${b.id}</loc><lastmod>${toDate(b.updatedAt)}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`
      ),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`
  );
});

export default router;
