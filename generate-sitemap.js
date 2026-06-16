import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://vaishnavihomeocare.com/api/press-releases';
const SITE_URL = 'https://vaishnavihomeocare.com';

async function generateSitemap() {
  try {
    // 1. Fetch dynamic blog URLs
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch press-releases: ${response.status}`);
    }
    const responseData = await response.json();
    const data = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData.content)
          ? responseData.content
          : [];

    // 2. Define static URLs
    const staticUrls = [
      { loc: '/', changefreq: 'weekly', priority: '1.0' },
      { loc: '/about', changefreq: 'monthly', priority: '0.9' },
      { loc: '/services', changefreq: 'monthly', priority: '0.9' },
      { loc: '/testimonials', changefreq: 'weekly', priority: '0.7' },
      { loc: '/patient-feedback', changefreq: 'weekly', priority: '0.6' },
      { loc: '/appointment', changefreq: 'weekly', priority: '0.9' },
      { loc: '/blog', changefreq: 'weekly', priority: '0.8' },
      { loc: '/gallery', changefreq: 'monthly', priority: '0.6' },
      { loc: '/videos', changefreq: 'monthly', priority: '0.6' },
      { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
      { loc: '/contact', changefreq: 'monthly', priority: '0.8' },
      { loc: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
      { loc: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
    ];

    // 3. Construct sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages
    staticUrls.forEach((url) => {
      sitemap += `
  <url>
    <loc>${SITE_URL}${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`;
    });

    // Dynamic pages (Blogs / Press Releases)
    data.forEach((pr) => {
      const slug = pr.slug || pr.id;
      sitemap += `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `\n</urlset>`;

    // 4. Write to public/sitemap.xml
    const publicDir = path.join(__dirname, 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    // Ensure public dir exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    fs.writeFileSync(sitemapPath, sitemap);
    console.log(`✅ Sitemap successfully generated with ${staticUrls.length} static pages and ${data.length} dynamic blog pages.`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

generateSitemap();
