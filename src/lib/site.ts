export const SITE = {
  phone: "+7 (901) 592-72-24",
  phoneHref: "tel:+79015927224",
  max: "https://max.ru/join/vdXcwdMFl4420hjcm8CJpanFfbi99zCSYgQiVFt-Vhg",
  vk: "https://vk.com/profildoors__design",
  address: "г. Москва, ул. Ленинская Слобода, 26",
  addressFull: "г. Москва, ул. Ленинская Слобода, 26, МЦ Roomer, 1 этаж, секция А149–А151",
  metro: "м. Автозаводская",
  hours: "Ежедневно с 10:00 до 22:00",
  routeTarget: "МЦ Roomer, ул. Ленинская Слобода, 26",
  routeUrl: "",
};

const ROUTE_DEST = "Москва, улица Ленинская Слобода, 26, МЦ Roomer";

export const routeLink = (rtt: "auto" | "mt" | "pd" = "auto", from = "") =>
  `https://yandex.ru/maps/?mode=routes&rtt=${rtt}&rtext=${encodeURIComponent(from)}~${encodeURIComponent(ROUTE_DEST)}`;

SITE.routeUrl = routeLink("auto");

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

/** Choose a door type in the quiz from anywhere on the page and scroll to it. */
export const QUIZ_PRESET_EVENT = "quiz:preset";
export type QuizPreset = { type: string; model?: string };
export const presetQuiz = (type: string, model?: string) => {
  window.dispatchEvent(new CustomEvent<QuizPreset>(QUIZ_PRESET_EVENT, { detail: { type, model } }));
  scrollToId("calc");
};

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