/** Реквизиты оператора персональных данных — меняйте только здесь, текст политики обновится везде. */
export const LEGAL = {
  domain: "profildoors-roomer.ru",
  operator: "[Реквизиты юридического лица / ИП будут указаны здесь после уточнения]",
  email: "info@profildoors-roomer.ru",
  phone: "+7 (901) 592-72-24",
  address: "г. Москва, ул. Ленинская Слобода, 26, МЦ Roomer",
  updated: "17.10.2026",
};

export const PRIVACY_OPEN_EVENT = "privacy:open";
export const openPrivacy = () => window.dispatchEvent(new Event(PRIVACY_OPEN_EVENT));
