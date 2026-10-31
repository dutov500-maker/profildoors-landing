import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { fetchCatalog } from "@/lib/api";

export const Route = createFileRoute("/")({
  loader: async () => ({ catalog: await fetchCatalog("main").catch(() => null) }),
  head: () => ({
    links: [
      { rel: "canonical", href: "https://profildoors-roomer.ru/" },
      { rel: "preload", as: "image", href: "/img/hero-interior.webp", fetchPriority: "high" },
    ],
  }),
  component: Home,
});

function Home() {
  const { catalog } = Route.useLoaderData();
  return <Index catalog={catalog} />;
}
