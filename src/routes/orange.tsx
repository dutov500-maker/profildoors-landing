import { createFileRoute } from "@tanstack/react-router";
import Orange from "@/pages/Orange";
import { fetchCatalog } from "@/lib/api";

const TITLE = "ProfilDoors Orange 2026 — новая коллекция дверей в МЦ Roomer, Москва";
const DESCRIPTION =
  "Коллекция ProfilDoors Orange 2026: дизайнерские двери в эмали, рельефные, классические и алюминиевые серии. Смотрите вживую в шоуруме МЦ Roomer, м. Автозаводская. Расчёт стоимости и вызов замерщика.";
const URL = "https://profildoors-roomer.ru/orange";

export const Route = createFileRoute("/orange")({
  loader: async () => ({ catalog: await fetchCatalog("orange").catch(() => null) }),
  staleTime: 5 * 60_000,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: OrangePage,
});

function OrangePage() {
  const { catalog } = Route.useLoaderData();
  return <Orange catalog={catalog} />;
}