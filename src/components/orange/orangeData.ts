import type { CatalogProduct, Finish } from "@/lib/api";

export type { Finish };

export type Photo = { src: string };

export type Model = {
  id: number;
  cat: string;
  name: string;
  subtitle: string;
  badge: string;
  price: string;
  text: string;
  finishesLabel: string;
  finishes: Finish[];
  photos: Photo[];
};

export const PLACEHOLDER = "/img/door-placeholder.webp";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export const toModel = (p: CatalogProduct, slug: string): Model => ({
  id: p.id,
  cat: slug,
  name: p.name,
  subtitle: p.series,
  badge: p.badge,
  price: p.price ? `от ${fmt(p.price)} ₽` : "Цена по запросу",
  text: p.description,
  finishesLabel: p.finishes_label || "Отделки",
  finishes: p.finishes ?? [],
  photos: [{ src: p.image_url || PLACEHOLDER }],
});
