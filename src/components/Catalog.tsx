import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { openLead } from "@/components/LeadDialog";
import { CATALOG_TAB_EVENT, presetQuiz } from "@/lib/site";

type Cat = "orange" | "invisible" | "modern" | "glass";

type Model = {
  id: string;
  cat: Cat;
  series: string;
  name: string;
  img: string;
  text: string;
  price: number;
  badge: string;
  quiz: string;
};

const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "orange", label: "ProfilDoors Orange (Флагманские новинки)" },
  { id: "invisible", label: "Скрытые двери (Invisible & Reverse)" },
  { id: "modern", label: "Современные серии (E, UNILACK, L, ZN)" },
  { id: "glass", label: "Стеклянные перегородки AG & Входные двери" },
];

const MODELS: Model[] = [
  {
    id: "orange-wave",
    cat: "orange",
    series: "ProfilDoors Orange",
    name: "Orange Wave 01 (трендовая 3D-фрезеровка)",
    img: "/img/orange-wave.webp",
    text: "Новая линейка Orange. Глубокая фактурная 3D-фрезеровка, бархатистое матовое покрытие Soft-Touch, алюминиевая кромка с 4 сторон.",
    price: 36900,
    badge: "Новинка линейки Orange",
    quiz: "interior",
  },
  {
    id: "orange-slim",
    cat: "orange",
    series: "ProfilDoors Orange",
    name: "Orange Slim Glass (алюминиевый профиль)",
    img: "/img/glass.webp",
    text: "Ультратонкий архитектурный профиль Orange, закалённое стекло триплекс: графит, бронза или прозрачное.",
    price: 44500,
    badge: "Хит Orange",
    quiz: "interior",
  },
  {
    id: "0z",
    cat: "invisible",
    series: "Invisible",
    name: "Скрытая дверь 0Z Invisible под покраску",
    img: "/img/showroom-invisible.webp",
    text: "Анодированный алюминиевый скрытый короб, заводской полимерный грунт под покраску или поклейку обоев. Скрытые итальянские петли AGB Eclipse.",
    price: 24900,
    badge: "Хит продаж в Москве",
    quiz: "invisible",
  },
  {
    id: "reverse",
    cat: "invisible",
    series: "Invisible Reverse",
    name: "Invisible Reverse (открывание от себя)",
    img: "/img/invisible.webp",
    text: "Полотно с четвертью реверсивного открывания в единой плоскости со стеной. Высота до 3000 мм под заказ.",
    price: 28800,
    badge: "В наличии в Roomer",
    quiz: "invisible",
  },
  {
    id: "1e",
    cat: "modern",
    series: "Серия E",
    name: "Серия 1E (гладкая матовая эмаль)",
    img: "/img/modern.webp",
    text: "Многослойная немецкая эмаль, устойчивая к ультрафиолету и влаге. Цвета: Белый матовый, Графит, Дарк вайт.",
    price: 23400,
    badge: "Практичный выбор",
    quiz: "interior",
  },
  {
    id: "210u",
    cat: "modern",
    series: "Серия U · UNILACK",
    name: "Серия 2.10U (бархатный Unilack)",
    img: "/img/classic.webp",
    text: "Усиленное износостойкое покрытие УФ-лаком с шелковистой текстурой. Цвета: Аляска, Магнолия, Антрацит.",
    price: 19800,
    badge: "Топ цена/качество",
    quiz: "interior",
  },
  {
    id: "ag",
    cat: "glass",
    series: "Серия AG",
    name: "Алюминиевая перегородка AG",
    img: "/img/showroom-glass.webp",
    text: "Раздвижная беспороговая система в потолок. Анодированный профиль Black Matte, безопасный триплекс 8 мм, скрытые доводчики.",
    price: 68000,
    badge: "Экспозиция в Roomer",
    quiz: "glass",
  },
  {
    id: "master",
    cat: "glass",
    series: "Входные двери",
    name: "Стальная дверь Master Security",
    img: "/img/entry.webp",
    text: "Взломостойкая дверь 4 класса с терморазрывом и внутренней декоративной панелью, повторяющей межкомнатные двери ProfilDoors.",
    price: 62500,
    badge: "Единый стиль квартиры",
    quiz: "entry",
  },
];

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const Catalog = () => {
  const [tab, setTab] = useState<"all" | Cat>("all");

  useEffect(() => {
    const h = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as "all" | Cat;
      if (TABS.some((t) => t.id === id)) setTab(id);
    };
    window.addEventListener(CATALOG_TAB_EVENT, h);
    return () => window.removeEventListener(CATALOG_TAB_EVENT, h);
  }, []);

  const list = useMemo(() => (tab === "all" ? MODELS : MODELS.filter((m) => m.cat === tab)), [tab]);

  return (
    <section id="catalog" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-[34px]">
      <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow-chip">Актуальные коллекции ProfilDoors</span>
          <h2 className="section-title mt-4 max-w-[16em]">Каталог моделей, которые можно потрогать в шоуруме</h2>
        </div>
        <p className="max-w-[26em] text-muted-foreground">
          Только актуальные серии фабрики и новая линейка ProfilDoors Orange. Цены за комплект: полотно, короб, наличники.
        </p>
      </Reveal>

      <div className="-mx-4 mt-8 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 rounded-full bg-secondary p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[0.9em] font-medium transition-all ${
                tab === t.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div key={tab} className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((m, i) => (
          <article
            key={m.id}
            className="group flex flex-col overflow-hidden rounded-[22px] border border-border bg-card animate-rise"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={m.img}
                alt={m.name}
                loading={i < 4 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.75em] font-medium backdrop-blur ${
                  m.cat === "orange" ? "bg-gold text-white" : "bg-card/95"
                }`}
              >
                {m.badge}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <span className="text-[0.72em] font-medium uppercase tracking-[0.06em] text-gold">{m.series}</span>
              <h3 className="mt-1 text-[1.1em] font-semibold leading-tight tracking-[-0.02em]">{m.name}</h3>
              <p className="mt-2.5 text-[0.86em] leading-relaxed text-muted-foreground">{m.text}</p>
              <div className="mt-auto pt-4">
                <p className="font-display text-xl font-semibold tracking-tight">
                  от {fmt(m.price)} ₽ <span className="text-[0.7em] font-medium text-muted-foreground">/ комплект</span>
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button onClick={() => presetQuiz(m.quiz, m.name)} className="btn-pill btn-dark py-2.5 text-[0.88em]">
                    <Icon name="Calculator" size={15} /> Рассчитать эту модель
                  </button>
                  <button
                    onClick={() =>
                      openLead({
                        title: "Посмотреть образцы в шоуруме",
                        description: `${m.name}. Подготовим образец и веер покрытий к вашему визиту в МЦ Roomer.`,
                        source: `Визит в шоурум: ${m.name}`,
                        button: "Записаться на визит",
                      })
                    }
                    className="btn-pill btn-outline py-2.5 text-[0.88em]"
                  >
                    <Icon name="Eye" size={15} /> Посмотреть в шоуруме
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Catalog;
