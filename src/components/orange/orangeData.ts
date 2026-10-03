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
  { id: "all", label: "Все модели" },
  { id: "frame", label: "Каркасные (PE.O / NE.O)" },
  { id: "ve", label: "Шпон & Эмаль (VE / SE)" },
  { id: "inv", label: "Скрытые Invisible" },
  { id: "po", label: "Царговые (P.O / PD.O)" },
  { id: "alu", label: "Алюминий & Перегородки" },
];

export const BASE_FINISHES: Finish[] = [
  { name: "Вайт", color: "#F4F3EF" },
  { name: "Кашемир", color: "#D6C8B4" },
  { name: "Графит", color: "#3E3F41" },
  { name: "Дуб", color: "#C59D6B" },
  { name: "Чёрный анод", color: "#1C1D1F" },
];

type Raw = [id: string, cat: Cat, name: string, subtitle: string, src: string, badge: string, text: string, price: string];

const RAW: Raw[] = [
  ["pe55-1", "frame", "ProfilDoors 55 PE.O", "Интерьер 1", "/orange-pe-55-1.jpg", "Хит продаж", "Гладкое каркасное полотно с защитной алюминиевой кромкой. Покрытие матовая эмаль.", "от 21 800 ₽"],
  ["pe55-2", "frame", "ProfilDoors 55 PE.O", "Интерьер 2", "/orange-pe-55-2.jpg", "Новинка", "Минималистичный монохромный дизайн в современном интерьере. Высокая шумоизоляция.", "от 21 800 ₽"],
  ["ne46-1", "frame", "ProfilDoors 46 NE.O", "Фактура Дуб", "/orange-ne-46-1.jpg", "Эко-фактура", "Бархатистая тактильная древесная текстура, устойчивая к царапинам и влаге.", "от 19 600 ₽"],
  ["ne46-2", "frame", "ProfilDoors 46 NE.O", "Фактура Орех", "/orange-ne-46-2.jpg", "Эко-фактура", "Глубокий благородный древесный оттенок. Заводская врезка под бесшумный магнитный замок.", "от 19 600 ₽"],
  ["ve-1", "ve", "ProfilDoors Серия VE", "Американский орех", "/orange-design-1.jpg", "Натуральный шпон", "Отделка натуральным шпоном ценных пород дерева. Толщина 44 мм, высота до 3000 мм.", "от 38 900 ₽"],
  ["ve-2", "ve", "ProfilDoors Серия VE", "Натуральный дуб", "/orange-design-2.jpg", "Премиум", "Скрытый короб Reverse Infinity, безупречный вертикальный рисунок древесных волокон.", "от 38 900 ₽"],
  ["se-1", "ve", "ProfilDoors Серия SE", "Эмаль Тёплый шёлк", "/orange-design-3.jpg", "Трендовая эмаль", "Шелковистая глубокоматовая эмаль Soft-Touch. Скрытые итальянские петли в цвет фурнитуры.", "от 32 500 ₽"],
  ["se-2", "ve", "ProfilDoors Серия SE", "Эмаль Кашемир / Тауп", "/orange-design-4.jpg", "Дизайнерский выбор", "Архитектурные оттенки сложной палитры 2026 года с защитным полимерным лаком.", "от 32 500 ₽"],
  ["inv-1", "inv", "ProfilDoors Orange Invisible", "Под покраску", "/orange-design-5.jpg", "В наличии на складе", "Анодированный скрытый алюминиевый короб Slim/Reverse, полотно с фабричным грунтом под обои или покраску.", "от 24 900 ₽"],
  ["inv-2", "inv", "ProfilDoors Orange Invisible", "Интерьерное решение", "/orange-design-6.jpg", "Без наличников", "Дверь в единой плоскости со стеной. Визуально расширяет пространство прихожих и коридоров.", "от 24 900 ₽"],
  ["graf", "po", "ProfilDoors Серия Графика", "Геометрия", "/orange-design-7.jpg", "Новинка 2026", "Дизайнерская радиусная и линейная 3D-гравировка на полотне в матовой эмали.", "от 24 500 ₽"],
  ["relief", "po", "ProfilDoors Серия Рельеф", "Вертикальный вельвет", "/orange-design-8.jpg", "Трендовая рейка", "Фактурный вертикальный реечный фасад в глубоком шоколадном оттенке.", "от 26 800 ₽"],
  ["po11", "po", "ProfilDoors 1.1 P.O", "Классическая царга", "/orange-design-9.jpg", "Хит для квартир", "Прочная сборно-разборная конструкция. Износостойкий полимер Unilack, устойчивый к влаге и сколам.", "от 16 900 ₽"],
  ["pdo", "po", "ProfilDoors PD.O", "С сатинированным стеклом", "/orange-design-10.jpg", "Матовое стекло", "Вставки из непрозрачного белого сатинированного триплекса, мягко рассеивающего свет.", "от 19 400 ₽"],
  ["avo-1", "alu", "ProfilDoors AV.O", "Тонкий алюминиевый профиль", "/orange-design-11.jpg", "Архитектурный стиль", "Распашная дверь из сверхпрочного анодированного алюминия со стеклом триплекс 8 мм.", "от 43 500 ₽"],
  ["avo-2", "alu", "ProfilDoors AV.O", "Профиль Чёрный муар", "/orange-design-12.jpg", "Премиум стекло", "Матовое сатинированное стекло в черном графичном обрамлении с магнитной фиксацией.", "от 45 000 ₽"],
  ["axo-1", "alu", "ProfilDoors AX.O", "Раздвижная перегородка Magic", "/orange-design-13.jpg", "Зонирование комнат", "Беспороговая верхнеподвесная раздвижная система для разделения кухни и гостиной.", "от 64 000 ₽"],
  ["axo-2", "alu", "ProfilDoors AX.O", "Каскадная система 2 створки", "/orange-design-14.jpg", "Экспозиция в Roomer", "Синхронное телескопическое открывание створок. Закаленное ударопрочное стекло.", "от 72 000 ₽"],
  ["axo-3", "alu", "ProfilDoors AX.O", "Зонирование спальни/гардеробной", "/orange-design-15.jpg", "Индивидуальный размер", "Раздвижная конструкция в потолок до 3000 мм с бесшумными доводчиками плавного хода.", "от 68 000 ₽"],
];

export const MODELS: Model[] = RAW.map(([id, cat, name, subtitle, src, badge, text, price]) => ({
  id,
  cat,
  name,
  subtitle,
  badge,
  price,
  text,
  finishesLabel: "Доступные отделки",
  finishes: BASE_FINISHES,
  photos: [{ src }],
}));
