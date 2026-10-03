export const SITE = {
  phone: "+7 (901) 592-72-24",
  phoneHref: "tel:+79015927224",
  /** Личный диалог с менеджером: вставьте сюда ссылку на профиль вида https://max.ru/u/... */
  maxManager: "",
  maxChannel: "https://max.ru/join/vdXcwdMFl4420hjcm8CJpanFfbi99zCSYgQiVFt-Vhg",
  get max() {
    return this.maxManager || this.maxChannel;
  },
  vk: "https://vk.com/profildoors__design",
  address: "г. Москва, ул. Ленинская Слобода, 26",
  addressFull: "г. Москва, ул. Ленинская Слобода, 26 (МЦ Roomer, этаж 1, павильон А149–А151)",
  metro: "м. Автозаводская",
  hours: "Ежедневно с 10:00 до 22:00",
  routeTarget: "Официальный салон ProfilDoors, МЦ Roomer, этаж 1, павильон А149–А151",
  lat: 55.712613,
  lon: 37.653495,
  routeUrl: `https://yandex.ru/maps/?rtext=~${encodeURIComponent("Москва, улица Ленинская Слобода, 26")}&rtt=auto`,
};

export const ADDRESS_QUERY = encodeURIComponent("Москва, улица Ленинская Слобода, 26");

export const METRO_LINES = [
  { color: "#4DAC4B", name: "Автозаводская", line: "Замоскворецкая линия", time: "3 мин пешком", mck: false },
  { color: "#E44036", name: "Автозаводская", line: "МЦК", time: "7 мин пешком", mck: true },
];

const METRO = "55.706914,37.657487";

export const routeLink = (rtt: "auto" | "mt" | "pd" = "auto", fromMetro = false) =>
  `https://yandex.ru/maps/?rtext=${fromMetro ? METRO : ""}~${ADDRESS_QUERY}&rtt=${rtt}`;

export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const openMax = (text?: string) => {
  if (text) copyText(text);
  window.open(SITE.max, "_blank", "noopener,noreferrer");
};

export const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Open the cost calculator modal from anywhere, optionally with a preset door type/model. */
export const CALC_OPEN_EVENT = "calc:open";
export type QuizPreset = { type?: string; model?: string };
export const openCalc = (preset: QuizPreset = {}) => {
  window.dispatchEvent(new CustomEvent<QuizPreset>(CALC_OPEN_EVENT, { detail: preset }));
};
export const presetQuiz = (type: string, model?: string) => openCalc({ type, model });

/** Switch the catalog tab from anywhere on the page and scroll to it. */
export const CATALOG_TAB_EVENT = "catalog:tab";
export const openCatalogTab = (tabId: string) => {
  window.dispatchEvent(new CustomEvent(CATALOG_TAB_EVENT, { detail: tabId }));
  scrollToId("catalog");
};

export const phoneMask = (raw: string) => {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += " " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
};

export const phoneValid = (v: string) => v.replace(/\D/g, "").length === 11;