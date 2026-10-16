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
};
export type Finish = { name: string; color: string };
export type CatalogData = { categories: CatalogCategory[]; products: CatalogProduct[] };

export const fetchCatalog = async (section: "main" | "orange" = "main"): Promise<CatalogData> => {
  if (!urls.catalog) throw new Error("Каталог ещё не подключён");
  const res = await fetch(`${urls.catalog}?section=${section}`);
  if (!res.ok) throw new Error("Не удалось загрузить каталог");
  return res.json();
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
      throw new Error("Нет связи с сервером. Проверьте интернет и обновите страницу. Если не помогает — возможно, исчерпан лимит тарифа (poehali.dev/p/pay).");
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