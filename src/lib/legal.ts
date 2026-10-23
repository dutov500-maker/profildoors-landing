/** Реквизиты оператора персональных данных — меняйте только здесь, текст политики обновится везде. */
export const LEGAL = {
  domain: "profildoors-roomer.ru",
  operator: "Индивидуальный предприниматель Конева Наталья Олеговна (ИП Конева Н.О.)",
  short: "ИП Конева Н.О.",
  inn: "402571831759",
  ogrn: "319402700035283",
  legalAddress: "Калужская обл., г. Обнинск, пр. Ленина, д. 221, кв. 15",
  email: "info@profildoors-roomer.ru",
  phone: "+7 (901) 592-72-24",
  address: "г. Москва, ул. Ленинская Слобода, 26, МЦ Roomer",
  updated: "17.10.2026",
};

export const PRIVACY_OPEN_EVENT = "privacy:open";
export const openPrivacy = () => window.dispatchEvent(new Event(PRIVACY_OPEN_EVENT));
