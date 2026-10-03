export type Cat = "design" | "relief" | "classic" | "glass";

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
  { id: "design", label: "Дизайнерские & Эмаль" },
  { id: "relief", label: "Фактурные & Рельеф" },
  { id: "classic", label: "Классика" },
  { id: "glass", label: "Стекло & Алюминий" },
];

export const MODELS: Model[] = [
  {
    id: "grafika",
    cat: "design",
    name: "ProfilDoors Серия «Графика»",
    subtitle: "Модель с радиусной фрезеровкой",
    badge: "Новинка 2026",
    price: "от 24 500 ₽",
    text: "Премиальная матовая эмаль с объемной радиусной 3D-гравировкой. Черная матовая фурнитура, скрытые петли.",
    finishesLabel: "Отделки",
    finishes: [
      { name: "Вайт", color: "#F4F3EF" },
      { name: "Кашемир", color: "#D6C8B4" },
      { name: "Тёплый шёлк", color: "#E8DFD0" },
      { name: "Графит", color: "#3E3F41" },
    ],
    photos: [{ src: "/orange-design-3.jpg" }],
  },
  {
    id: "vertikal",
    cat: "design",
    name: "ProfilDoors Серия «Вертикаль»",
    subtitle: "Светлое полотно у стеллажа",
    badge: "Хит продаж",
    price: "от 22 900 ₽",
    text: "Каркасно-щитовое полотно с вертикальной линейной фрезеровкой. Идеально для современных минималистичных интерьеров.",
    finishesLabel: "Отделки",
    finishes: [
      { name: "Матовая эмаль", color: "#EDE6D8" },
      { name: "Unilack Вайт", color: "#F6F5F1" },
      { name: "Лайт Грей", color: "#CFCFCB" },
    ],
    photos: [{ src: "/orange-design-9.jpg" }],
  },
  {
    id: "relief",
    cat: "relief",
    name: "ProfilDoors Серия «Рельеф / Вельвет»",
    subtitle: "Тёмная реечная дверь",
    badge: "Трендовая рейка",
    price: "от 26 800 ₽",
    text: "Объемный вертикальный реечный фасад в глубоком оттенке Dark Oak. Высокая устойчивость к механическим повреждениям.",
    finishesLabel: "Отделки",
    finishes: [
      { name: "Венге", color: "#2F2520" },
      { name: "Тёмный Орех", color: "#4A3226" },
      { name: "Мокко", color: "#6E5646" },
      { name: "Графит", color: "#3E3F41" },
    ],
    photos: [{ src: "/orange-design-4.jpg" }],
  },
  {
    id: "classic",
    cat: "classic",
    name: "ProfilDoors Классика",
    subtitle: "Серия P.O / PM",
    badge: "Неоклассика",
    price: "от 19 800 ₽",
    text: "Элегантные пропорции, объемный классический багет, шелковистая матовая эмаль.",
    finishesLabel: "Отделки",
    finishes: [
      { name: "Вайт", color: "#F4F3EF" },
      { name: "Крем", color: "#EDE3CF" },
      { name: "Жемчуг", color: "linear-gradient(135deg,#F3F0EA,#D9D4CB)" },
    ],
    photos: [{ src: "/orange-design-6.jpg" }],
  },
  {
    id: "avo",
    cat: "glass",
    name: "ProfilDoors Серия AV.O",
    subtitle: "Двустворчатая стеклянная система",
    badge: "Архитектурный стиль",
    price: "от 68 000 ₽",
    text: "Распашная конструкция из закаленного триплекса в узком алюминиевом профиле Black Muar. Зонирование гостиных и холлов.",
    finishesLabel: "Профиль",
    finishes: [
      { name: "Чёрный муар", color: "#232325" },
      { name: "Шампань", color: "linear-gradient(135deg,#E6D3B0,#B79D73)" },
      { name: "Никель", color: "linear-gradient(135deg,#E3E4E6,#9EA2A7)" },
    ],
    photos: [{ src: "/orange-design-15.jpg" }],
  },
];
