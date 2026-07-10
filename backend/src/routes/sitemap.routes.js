const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const DATA_DIR = path.join(__dirname, '../../data');

function readJsonFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function getLastModified(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) return new Date().toISOString();
    const stats = fs.statSync(filePath);
    return stats.mtime.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

router.get('/', (req, res) => {
  // Determine the site base URL
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localsm.com';
  
  // Try to get the frontend URL from settings or use a sensible default
  const settings = readJsonFile('websitesettingss.json');
  const activeSetting = Array.isArray(settings) ? settings.find(s => s.isActive !== false) : null;
  
  // Base URL for the frontend (not the API)
  // The sitemap should reference the frontend routes
  const baseUrl = process.env.FRONTEND_URL || `${protocol}://${host.replace(/:\d+$/, '')}`;
  
  // Static routes with their data file dependencies for lastmod
  const staticRoutes = [
    { path: '/', dataFile: 'heros.json', priority: '1.0', changefreq: 'weekly' },
    { path: '/culture', dataFile: 'culturepagedocuments.json', priority: '0.8', changefreq: 'monthly' },
    { path: '/careers', dataFile: 'careerspagedocuments.json', priority: '0.8', changefreq: 'weekly' },
    { path: '/investors', dataFile: 'investorspagedocuments.json', priority: '0.8', changefreq: 'weekly' },
    { path: '/impact', dataFile: 'impactpagedocuments.json', priority: '0.7', changefreq: 'monthly' },
    { path: '/contact', dataFile: 'contactpagedocuments.json', priority: '0.7', changefreq: 'monthly' },
    { path: '/founder-letter', dataFile: 'founders.json', priority: '0.6', changefreq: 'monthly' },
  ];

  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of staticRoutes) {
    const lastmod = route.dataFile
      ? getLastModified(route.dataFile).split('T')[0]
      : now;

    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  res.set('Content-Type', 'application/xml');
  res.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  res.send(xml);
});

module.exports = router;
