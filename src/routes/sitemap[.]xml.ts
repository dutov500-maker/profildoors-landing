import { createFileRoute } from "@tanstack/react-router";
import { fetchCatalog } from "@/lib/api";

const SITE_URL = "https://profildoors-roomer.ru";

const STATIC = [
  { loc: "/", freq: "daily", prio: "1.0" },
  { loc: "/orange", freq: "weekly", prio: "0.8" },
  { loc: "/privacy", freq: "yearly", prio: "0.3" },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const data = await fetchCatalog("all").catch(() => null);
        const models = (data?.products ?? []).filter((p) => p.slug);
        const urls = [
          ...STATIC.map((s) => `  <url>\n    <loc>${SITE_URL}${s.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${s.freq}</changefreq>\n    <priority>${s.prio}</priority>\n  </url>`),
          ...models.map((p) => {
            const img = p.image_url ? (p.image_url.startsWith("http") ? p.image_url : `${SITE_URL}${p.image_url}`) : "";
            return `  <url>\n    <loc>${SITE_URL}/models/${esc(p.slug!)}</loc>\n    <lastmod>${p.updated || today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>${
              img ? `\n    <image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(p.name)}</image:title></image:image>` : ""
            }\n  </url>`;
          }),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join("\n")}\n</urlset>\n`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
