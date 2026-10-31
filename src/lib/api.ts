import { goal, setUserParams } from "@/lib/metrika";
const mods = import.meta.glob<{ default: Record<string, string> }>("../../backend/func2url.json", { eager: true });
const urls: Record<string, string> = Object.values(mods)[0]?.default ?? {};

export type LeadPayload = { name: string; phone: string; comment: string; page: string; source: string };

export const sendLead = async (data: LeadPayload) => {
  const url = urls.lead;
  if (!url) throw new Error("Сервис заявок ещё не подключён");
  const call = () =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  const res = await call().catch(async () => {
    await new Promise((r) => setTimeout(r, 1500));
    return call();
  });
  const json = await res.json().catch(() => ({}));
  if (res.status !== 200 || !json.ok) throw new Error(json.error || "Не удалось отправить заявку");
  const where = window.location.pathname.startsWith("/orange") ? "orange" : "main";
  goal("lead", { source: data.source, page: where });
  goal(data.source === "Калькулятор стоимости" ? "lead_calc" : "lead_form", { source: data.source, page: where });
  setUserParams({ lead_sent: true, last_lead_source: data.source });
  return json;
};

export const pageLabel = () => {
  const p = window.location.pathname;
  const name = p.startsWith("/orange") ? "/orange (Коллекция Orange)" : "Главная";
  return `${name} — ${window.location.origin}${p}`;
};

export type CatalogCategory = { id: number; slug: string; name: string; quiz_type: string; sort_order?: number };
export type CatalogProduct = {
  id: number;
  category_id: number;
  name: string;
  series: string;
  badge: string;
  description: string;
  price: number;
  image_url: string;
  status?: "published" | "draft";
  sort_order?: number;
  in_main?: boolean;
  in_orange?: boolean;
  finishes?: Finish[];
  finishes_label?: string;
  slug?: string;
  updated?: string;
};
export type Finish = { name: string; color: string; texture?: string; image?: string };

/** Стиль кружочка отделки: фото текстуры или цвет. */
export const swatchStyle = (f: Finish) =>
  f.texture ? { backgroundImage: `url(${f.texture})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: f.color };
export type CatalogData = { categories: CatalogCategory[]; products: CatalogProduct[] };

/**
 * Публичный каталог одинаков для всех посетителей, поэтому один ответ можно
 * переиспользовать 2 минуты: сайт и поисковые роботы не дёргают функцию на каждый показ страницы.
 * Хранится только общедоступный каталог — никаких данных конкретного посетителя.
 */
const CACHE_MS = 60_000;
const publicCache = new Map<string, { at: number; data: Promise<unknown> }>();
const cachedJson = <T,>(url: string, ms = CACHE_MS): Promise<T> => {
  const hit = publicCache.get(url);
  if (hit && Date.now() - hit.at < ms) return hit.data as Promise<T>;
  const data = fetch(url).then((r) => {
    if (!r.ok) throw new Error("Не удалось загрузить каталог");
    return r.json();
  });
  publicCache.set(url, { at: Date.now(), data });
  data.catch(() => publicCache.delete(url));
  if (publicCache.size > 50) publicCache.delete(publicCache.keys().next().value as string);
  return data as Promise<T>;
};

/**
 * Весь опубликованный каталог лежит готовым файлом на CDN — админка обновляет его при каждом сохранении.
 * Чтение файла с CDN бесплатно и не расходует вычислительное время.
 * Функция каталога вызывается только как запасной вариант, если файла ещё нет.
 */
export const CDN_BASE = "https://cdn.poehali.dev/projects/442e1379-6c54-4c99-9e28-859842ae37d4/bucket";
const CATALOG_FILE = `${CDN_BASE}/site/catalog.json`;

/** Номер минуты: CDN отдаёт свежий файл не позже чем через минуту после сохранения в админке. */
const minuteStamp = () => Math.floor(Date.now() / 60_000);

const loadAll = async (): Promise<CatalogData> => {
  try {
    return await cachedJson<CatalogData>(`${CATALOG_FILE}?m=${minuteStamp()}`);
  } catch {
    if (!urls.catalog) throw new Error("Каталог ещё не подключён");
    return cachedJson<CatalogData>(`${urls.catalog}?section=all`, 5 * 60_000);
  }
};

const pick = (all: CatalogData, keep: (p: CatalogProduct) => boolean): CatalogData => {
  const products = all.products.filter(keep);
  const used = new Set(products.map((p) => p.category_id));
  return { categories: all.categories.filter((c) => used.has(c.id)), products };
};

export const fetchModel = async (slug: string): Promise<CatalogData | null> => {
  const all = await loadAll().catch(() => null);
  if (!all) return null;
  const data = pick(all, (p) => p.slug === slug);
  return data.products.length ? data : null;
};

export const fetchCatalog = async (section: "main" | "orange" | "all" = "main"): Promise<CatalogData> => {
  const all = await loadAll();
  if (section === "all") return pick(all, () => true);
  return pick(all, (p) => (section === "orange" ? !!p.in_orange : !!p.in_main));
};

export type LeadStatus = "new" | "in_work" | "done" | "spam";
export type Lead = {
  id: number;
  name: string;
  phone: string;
  comment: string;
  page: string;
  source: string;
  status: LeadStatus;
  manager_note: string;
  created_at: string;
};
export type LeadsData = { leads: Lead[] };

const TOKEN_KEY = "pd_admin_token";
export const adminToken = {
  get: () => sessionStorage.getItem(TOKEN_KEY) || "",
  set: (t: string) => sessionStorage.setItem(TOKEN_KEY, t),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export class AuthError extends Error {}
export class NetworkError extends Error {}

export const adminApi = async <T = CatalogData>(action: string, body?: unknown): Promise<T> => {
  if (!urls.admin) throw new Error("Панель управления ещё не опубликована");
  const call = () =>
    fetch(`${urls.admin}?action=${action}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": adminToken.get() },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  let res: Response;
  try {
    res = await call();
  } catch {
    await new Promise((r) => setTimeout(r, 1200));
    try {
      res = await call();
    } catch {
      throw new NetworkError("Нет соединения с сервером. Проверьте интернет и нажмите «Повторить».");
    }
  }
  if (res.status === 402) throw new Error("Сервер временно недоступен: достигнут лимит тарифа. Обновите подписку на poehali.dev/p/pay.");
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 && action !== "login") {
    adminToken.clear();
    throw new AuthError(json.error || "Требуется вход");
  }
  if (!res.ok) throw new Error(json.error || "Ошибка сервера");
  return json as T;
};