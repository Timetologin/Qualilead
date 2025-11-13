export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.status(200).send(`# robots.txt for AutoLead
User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://autolead.co.il/sitemap.xml
`)
}
