/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://inceptumrex.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  // App-router icon files are routes, not pages.
  exclude: ['/icon.svg', '/apple-icon.png'],
};
