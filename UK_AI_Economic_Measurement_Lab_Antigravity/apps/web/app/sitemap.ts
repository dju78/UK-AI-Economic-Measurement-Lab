import { MetadataRoute } from 'next';

const BASE_URL = 'https://ai-measurement.jomovate.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/stack',
    '/supply-use',
    '/disaggregation',
    '/classifier',
    '/sna-decision',
    '/adoption',
    '/gaps',
    '/methodology',
    '/quality',
    '/sources'
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date('2026-09-21'),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8
  }));
}
