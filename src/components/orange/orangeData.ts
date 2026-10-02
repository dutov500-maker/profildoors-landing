export type Cat = "frame" | "ve" | "inv" | "po" | "alu";

export type Finish = { name: string; color: string };

export type Photo = { src: string };

export type Model = {
  id: string;
  cat: Cat;
  name: string;
  subtitle: string;
  badge: string;
  price: string;
  text: string;
  finishesLabel: string;
  finishes: Finish[];
  photos: Photo[];
};

export const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Все коллекции" },
  { id: "frame", label: "Каркасные PE.O / NE.O" },
  { id: "ve", label: "Шпон & Эмаль VE/SE" },
  { id: "inv", label: "Скрытые Invisible" },
  { id: "po", label: "Царговые P.O / PD.O" },
  { id: "alu", label: "Алюминий & Перегородки" },
];


export const MODELS: Model[] = [
  {
    id: "pe55",
    cat: "frame",
    name: "ProfilDoors 55 PE.O",
    subtitle: "Гладкая каркасная эмаль",
    badge: "Хит продаж",
    price: "от 21 800 ₽",
    text: "Полотно с матовой эмалью и защитным алюминиевым торцом по 4 сторонам. Высокая звукоизоляция, фабричная врезка под скрытые петли.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Вайт", color: "#F4F3EF" },
      { name: "Крем Вайт", color: "#EDE6D8" },
      { name: "Лайт Грей", color: "#CFCFCB" },
      { name: "Смоки", color: "#8D8B86" },
      { name: "Графит", color: "#3E3F41" },
    ],
    photos: [
      { src: "/orange-pe-55-1.jpg" },
      { src: "/orange-pe-55-2.jpg" },
    ],
  },
  {
    id: "ne46",
    cat: "frame",
    name: "ProfilDoors 46 NE.O",
    subtitle: "Древесная эко-фактура",
    badge: "Эко-коллекция",
    price: "от 19 600 ₽",
    text: "Глубокая тактильная древесная текстура, устойчивая к бытовой химии, когтям животных и влаге.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Дуб Натуральный", color: "#C9A67A" },
      { name: "Дуб Мокко", color: "#7A5A43" },
      { name: "Орех Шоколад", color: "#4A3226" },
      { name: "Дуб Сонома", color: "#D9BF97" },
    ],
    photos: [
      { src: "/orange-ne-46-1.jpg" },
      { src: "/orange-ne-46-2.jpg" },
    ],
  },
  {
    id: "ve",
    cat: "ve",
    name: "ProfilDoors Серия VE",
    subtitle: "Натуральный шпон",
    badge: "Премиум шпон",
    price: "от 38 900 ₽",
    text: "Натуральный шпон ценных пород. Толщина полотна 44 мм, высота до 3000 мм. Скрытый короб Reverse. Анодированная кромка: Черный, Никель, Шампань.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Дуб натуральный", color: "#C59D6B" },
      { name: "Американский орех", color: "#5C4030" },
      { name: "Венге", color: "#2F2520" },
      { name: "Грецкий орех", color: "#7B5638" },
    ],
    photos: [
      { src: "/orange-design-1.jpg" },
      { src: "/orange-design-2.jpg" },
    ],
  },
  {
    id: "se",
    cat: "ve",
    name: "ProfilDoors Серия SE",
    subtitle: "Бархатистая эмаль Soft-Touch",
    badge: "Трендовая палитра",
    price: "от 32 500 ₽",
    text: "Шелковистое глубокоматовое покрытие. Комплектуется моноблоком Export или коробом Invisible в цвет полотна.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Тёплый шёлк", color: "#E8DFD0" },
      { name: "Кашемир", color: "#D6C8B4" },
      { name: "Тауп", color: "#9C8E80" },
      { name: "Мокко", color: "#6E5646" },
    ],
    photos: [
      { src: "/orange-design-3.jpg" },
      { src: "/orange-design-4.jpg" },
    ],
  },
  {
    id: "inv",
    cat: "inv",
    name: "ProfilDoors Orange Invisible",
    subtitle: "Под покраску / обои",
    badge: "В наличии на складе",
    price: "от 24 900 ₽",
    text: "Анодированный скрытый алюминиевый короб Slim / Reverse Infinity. Полотно с двойным заводским грунтом. Монтаж в единую плоскость со стеной.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Грунт под финишную отделку", color: "#ECEBE7" },
      { name: "Зеркало Серебро", color: "linear-gradient(135deg,#F2F3F5,#B9BDC2)" },
      { name: "Зеркало Графит", color: "linear-gradient(135deg,#6B6E73,#2E3033)" },
    ],
    photos: [
      { src: "/orange-design-5.jpg" },
      { src: "/orange-design-6.jpg" },
    ],
  },
  {
    id: "po11",
    cat: "po",
    name: "Царговая серия 1.1 P.O",
    subtitle: "Сборно-разборная конструкция",
    badge: "Практичный выбор",
    price: "от 16 900 ₽",
    text: "Надежная сборно-разборная конструкция царг. Износостойкий полимер Unilack, устойчивый к влаге и сколам.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Аляска", color: "#F6F5F1" },
      { name: "Дарк Вайт", color: "#E4E1DA" },
      { name: "Магнолия Грей", color: "#BDB8AF" },
    ],
    photos: [{ src: "/orange-design-7.jpg" }, { src: "/orange-design-8.jpg" }],
  },
  {
    id: "pdo",
    cat: "po",
    name: "Серия PD.O",
    subtitle: "С матовым сатинированным стеклом",
    badge: "Безопасный триплекс",
    price: "от 19 400 ₽",
    text: "Геометрические вставки безопасного матового стекла (белое / бронза), пропускающего мягкий рассеянный свет без прозрачности.",
    finishesLabel: "Доступные отделки",
    finishes: [
      { name: "Вайт", color: "#F4F3EF" },
      { name: "Крем Вайт", color: "#EDE6D8" },
      { name: "Лайт Грей", color: "#CFCFCB" },
      { name: "Блэк", color: "#1E1F21" },
    ],
    photos: [{ src: "/orange-design-9.jpg" }, { src: "/orange-design-10.jpg" }],
  },
  {
    id: "avo",
    cat: "alu",
    name: "Стеклянная дверь AV.O",
    subtitle: "В алюминиевом профиле",
    badge: "Архитектурный стиль",
    price: "от 43 500 ₽",
    text: "Тонкий жесткий каркас из авиационного алюминия, безопасное закаленное стекло 8 мм, скрытые врезные ручки.",
    finishesLabel: "Цвет профиля",
    finishes: [
      { name: "Чёрный матовый", color: "#1C1D1F" },
      { name: "Шампань", color: "linear-gradient(135deg,#E6D3B0,#B79D73)" },
      { name: "Никель", color: "linear-gradient(135deg,#E3E4E6,#9EA2A7)" },
      { name: "Деорэ", color: "linear-gradient(135deg,#E7C98A,#A97F3C)" },
    ],
    photos: [{ src: "/orange-design-11.jpg" }, { src: "/orange-design-12.jpg" }],
  },
  {
    id: "axo",
    cat: "alu",
    name: "Раздвижная перегородка AX.O",
    subtitle: "Беспороговая система",
    badge: "Зонирование комнат",
    price: "от 64 000 ₽",
    text: "Верхнеподвесная система без направляющих на полу. Механизмы плавного довода, каскадное открытие и скрытый монтаж в пенал.",
    finishesLabel: "Цвет профиля",
    finishes: [
      { name: "Чёрный муар", color: "#232325" },
      { name: "Серебро", color: "linear-gradient(135deg,#F0F1F3,#A9ADB2)" },
      { name: "Графит", color: "#4A4C4F" },
    ],
    photos: [{ src: "/orange-design-13.jpg" }, { src: "/orange-design-14.jpg" }, { src: "/orange-design-15.jpg" }],
  },
];
