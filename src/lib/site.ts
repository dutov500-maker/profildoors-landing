export const SITE = {
  phone: "+7 495 000-00-00",
  phoneHref: "tel:+74950000000",
  whatsapp: "74950000000",
  telegram: "https://t.me/profildoors_roomer",
  address: "Москва, ул. Ленинская Слобода, 26",
  addressFull: "Москва, ул. Ленинская Слобода, 26 (МЦ Roomer, 1 этаж, секция А149–А151)",
  metro: "м. Автозаводская",
  hours: "Ежедневно с 10:00 до 22:00",
  routeUrl: "https://yandex.ru/maps/?rtext=~55.709806,37.654283&rtt=auto",
};

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/** Choose a door type in the quiz from anywhere on the page and scroll to it. */
export const QUIZ_PRESET_EVENT = "quiz:preset";
export const presetQuiz = (typeId: string) => {
  window.dispatchEvent(new CustomEvent(QUIZ_PRESET_EVENT, { detail: typeId }));
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
