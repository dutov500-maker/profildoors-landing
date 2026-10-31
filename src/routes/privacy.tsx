import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/pages/Privacy";

const TITLE = "Политика конфиденциальности — ProfilDoors в МЦ Roomer";
const DESCRIPTION = "Политика обработки персональных данных сайта profildoors-roomer.ru в соответствии с 152-ФЗ.";
const URL = "https://profildoors-roomer.ru/privacy";

export const Route = createFileRoute("/privacy")({
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
  component: Privacy,
});
