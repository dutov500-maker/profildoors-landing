import { createFileRoute, notFound } from "@tanstack/react-router";
import ModelPage from "@/pages/ModelPage";
import { fetchModel } from "@/lib/api";

const SITE_URL = "https://profildoors-roomer.ru";
const abs = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);

export const Route = createFileRoute("/models/$slug")({
  staleTime: 5 * 60_000,
  loader: async ({ params }) => {
    const data = await fetchModel(params.slug).catch(() => null);
    const product = data?.products[0];
    if (!product) throw notFound();
    const category = data.categories.find((c) => c.id === product.category_id);
    return { product, category };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return {};
    const orange = !!p.in_orange && !p.in_main;
    const full = `ProfilDoors ${orange ? "Orange " : ""}${p.series ? `${p.series} ` : ""}${p.name}`.replace(/\s+/g, " ").trim();
    const price = p.price ? ` — от ${new Intl.NumberFormat("ru-RU").format(p.price)} ₽` : "";
    const title = `${full}${price} | купить в Москве, МЦ Roomer`;
    const finishes = (p.finishes ?? []).map((f) => f.name);
    const base = p.description || `Дверь ${full}: образцы в шоуруме МЦ Roomer, расчёт и монтаж по Москве и МО.`;
    const description = `${base}${finishes.length ? ` Отделки: ${finishes.slice(0, 6).join(", ")}.` : ""}`.slice(0, 300);
    const url = `${SITE_URL}/models/${p.slug}`;
    const image = abs(p.image_url || "/img/door-placeholder.webp");
    const images = [image, ...(p.finishes ?? []).filter((f) => f.image).map((f) => abs(f.image!))];
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Product",
          name: full,
          description: base,
          image: images,
          url,
          brand: { "@type": "Brand", name: "ProfilDoors" },
          ...(loaderData?.category ? { category: loaderData.category.name } : {}),
          ...(finishes.length ? { color: finishes.join(", ") } : {}),
          ...(p.price
            ? {
                offers: {
                  "@type": "Offer",
                  price: p.price,
                  priceCurrency: "RUB",
                  availability: "https://schema.org/InStoreOnly",
                  url,
                  seller: { "@type": "Organization", name: "ProfilDoors в МЦ Roomer" },
                },
              }
            : {}),
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: `${SITE_URL}/` },
            orange
              ? { "@type": "ListItem", position: 2, name: "Коллекция Orange", item: `${SITE_URL}/orange` }
              : { "@type": "ListItem", position: 2, name: "Каталог", item: `${SITE_URL}/#catalog` },
            { "@type": "ListItem", position: 3, name: p.name, item: url },
          ],
        },
      ],
    };
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "product" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:secure_url", content: image },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: ModelRoute,
});

function ModelRoute() {
  const { product, category } = Route.useLoaderData();
  return <ModelPage key={product.id} product={product} category={category} />;
}