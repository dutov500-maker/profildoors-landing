import type { CatalogProduct, Finish } from "@/lib/api";

export type { Finish };

export type Photo = { src: string };

export type Model = {
  id: number;
  slug: string;
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
  slug: p.slug ?? "",
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

/** Фото модели в выбранной отделке; если своего фото у отделки нет — основное. */
export const photoFor = (m: Model, finish?: Finish): Photo => (finish?.image ? { src: finish.image } : m.photos[0]);