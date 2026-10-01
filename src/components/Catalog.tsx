import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { openLead } from "@/components/LeadDialog";
import { CATALOG_TAB_EVENT, presetQuiz } from "@/lib/site";

type Cat = "orange" | "invisible" | "modern" | "glass";
type Tone = "orange" | "dark" | "light";

type Model = {
  id: string;
  cat: Cat;
  series: string;
  name: string;
  img: string;
  text: string;
  price: number;
  badge: string;
  tone: Tone;
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
  { id: "orange-wave", cat: "orange", series: "ProfilDoors Orange", name: "Orange Wave 01", img: "/img/orange-wave.webp", text: "Трендовая 3D-фрезеровка, бархатистое покрытие Soft-Touch, алюминиевая кромка с 4 сторон.", price: 36900, badge: "Новая коллекция Orange", tone: "orange", quiz: "interior" },
  { id: "orange-slim", cat: "orange", series: "ProfilDoors Orange", name: "Orange Slim Glass", img: "/img/door-glass-bronze.webp", text: "Ультратонкий архитектурный профиль, триплекс графит, бронза или прозрачный.", price: 44500, badge: "Хит Orange", tone: "orange", quiz: "interior" },
  { id: "orange-line", cat: "orange", series: "ProfilDoors Orange", name: "Orange Line 03", img: "/img/door-greige.webp", text: "Тонкая вертикальная фрезеровка, матовый Soft-Touch в оттенках Грейж и Кашемир.", price: 38700, badge: "Новая коллекция Orange", tone: "orange", quiz: "interior" },
  { id: "orange-edge", cat: "orange", series: "ProfilDoors Orange", name: "Orange Edge Black", img: "/img/door-white.webp", text: "Гладкое полотно с контрастной чёрной алюминиевой кромкой и скрытым магнитным замком.", price: 34500, badge: "Новинка 2026", tone: "orange", quiz: "interior" },

  { id: "0z", cat: "invisible", series: "Invisible", name: "0Z Invisible под покраску", img: "/img/showroom-invisible.webp", text: "Анодированный скрытый короб, заводской грунт под покраску или обои, петли AGB Eclipse.", price: 24900, badge: "Хит Roomer", tone: "dark", quiz: "invisible" },
  { id: "reverse", cat: "invisible", series: "Invisible Reverse", name: "Invisible Reverse", img: "/img/invisible.webp", text: "Реверсивное открывание от себя, полотно в единой плоскости со стеной. До 3000 мм.", price: 28800, badge: "Скрытый монтаж", tone: "light", quiz: "invisible" },
  { id: "inv-ceiling", cat: "invisible", series: "Invisible", name: "Invisible в потолок 3000", img: "/img/hero-invisible.webp", text: "Полотно от пола до потолка без фрамуги, усиленный короб и 4 скрытые петли.", price: 41200, badge: "Скрытый монтаж", tone: "light", quiz: "invisible" },
  { id: "inv-veneer", cat: "invisible", series: "Invisible", name: "Invisible под стеновые панели", img: "/img/door-graphite.webp", text: "Скрытая дверь под отделку МДФ-панелями или шпоном в едином рисунке со стеной.", price: 36400, badge: "Выбор дизайнеров", tone: "dark", quiz: "invisible" },

  { id: "1e", cat: "modern", series: "Серия E", name: "1E Гладкая матовая эмаль", img: "/img/modern.webp", text: "Многослойная эмаль, устойчивая к влаге и УФ. Белый матовый, Графит, Дарк вайт.", price: 23400, badge: "Хит Roomer", tone: "dark", quiz: "interior" },
  { id: "210u", cat: "modern", series: "Серия U · UNILACK", name: "2.10U Бархатный Unilack", img: "/img/classic.webp", text: "Износостойкое покрытие УФ-лаком с шелковистой текстурой. Аляска, Магнолия, Антрацит.", price: 19800, badge: "Топ цена/качество", tone: "light", quiz: "interior" },
  { id: "l", cat: "modern", series: "Серия L", name: "3L Графит с молдингом", img: "/img/door-graphite.webp", text: "Эмаль с тонкими накладными молдингами — современная неоклассика для высоких потолков.", price: 29600, badge: "В наличии в Roomer", tone: "light", quiz: "interior" },
  { id: "zn", cat: "modern", series: "Серия ZN", name: "1ZN Алюминиевая кромка", img: "/img/door-white.webp", text: "Гладкое полотно Nanoflex с кромкой ABS/алюминий, магнитный замок в комплекте.", price: 21900, badge: "Практичный выбор", tone: "light", quiz: "interior" },

  { id: "ag", cat: "glass", series: "Серия AG", name: "Раздвижная перегородка AG", img: "/img/showroom-glass.webp", text: "Беспороговая система в потолок, профиль Black Matte, триплекс 8 мм, скрытые доводчики.", price: 68000, badge: "Экспозиция в Roomer", tone: "dark", quiz: "glass" },
  { id: "agn", cat: "glass", series: "Серия AGN", name: "Распашная AGN Bronze", img: "/img/door-glass-bronze.webp", text: "Стеклянная дверь в тонкой алюминиевой раме, тонированное бронзовое стекло.", price: 52400, badge: "Хит Roomer", tone: "dark", quiz: "glass" },
  { id: "master", cat: "glass", series: "Входные двери", name: "Master Security", img: "/img/entry.webp", text: "4 класс взломостойкости, терморазрыв и панель в стиле межкомнатных дверей.", price: 62500, badge: "Единый стиль квартиры", tone: "light", quiz: "entry" },
  { id: "master-house", cat: "glass", series: "Входные двери", name: "Master Thermo для дома", img: "/img/door-entry-house.webp", text: "Уличная дверь с тройным терморазрывом, 3 контура уплотнения и фрезерованная панель.", price: 84900, badge: "Для коттеджа", tone: "light", quiz: "entry" },
];

const TONE: Record<Tone, string> = {
  orange: "bg-orange text-white",
  dark: "bg-graphite/85 text-white",
  light: "bg-white/90 text-graphite",
};

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
    <section id="catalog" className="bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip">Актуальные коллекции фабрики</span>
            <h2 className="section-title mt-5 max-w-[14em]">Каталог моделей, которые можно потрогать в шоуруме</h2>
          </div>
          <p className="max-w-[26em] text-muted-foreground">
            {MODELS.length} актуальных моделей и новая линейка ProfilDoors Orange. Цены за комплект: полотно, короб, наличники.
          </p>
        </Reveal>

        <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1.5 rounded-full border border-border bg-sand p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[0.88em] font-medium transition-all duration-300 active:scale-[0.97] ${
                  tab === t.id ? "bg-graphite text-white shadow-soft" : "text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {t.id === "orange" && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-orange align-middle" />}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
          {list.map((m, i) => (
            <article
              key={m.id}
              className="group flex flex-col overflow-hidden rounded-[16px] border border-border/70 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift animate-rise"
              style={{ animationDelay: `${(i % 8) * 50}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <img
                  src={m.img}
                  alt={m.name}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                <span className={`absolute left-3 top-3 rounded-full px-3 py-1.5 text-[0.74em] font-medium shadow-soft backdrop-blur ${TONE[m.tone]}`}>
                  {m.badge}
                </span>
                <p className="absolute bottom-3 left-4 font-serif text-[1.55em] font-medium leading-none text-white">
                  от {fmt(m.price)} ₽
                </p>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className={`text-[0.7em] font-medium uppercase tracking-[0.14em] ${m.cat === "orange" ? "text-orange" : "text-gold"}`}>
                  {m.series}
                </span>
                <h3 className="mt-1.5 font-display text-[1.12em] font-semibold leading-tight tracking-[-0.02em]">{m.name}</h3>
                <p className="mt-2 text-[0.86em] leading-relaxed text-muted-foreground">{m.text}</p>
                <div className="mt-auto flex flex-col gap-2 pt-5">
                  <button onClick={() => presetQuiz(m.quiz, `${m.series} ${m.name}`)} className="btn-pill btn-dark py-3 text-[0.88em]">
                    <Icon name="Calculator" size={15} /> Рассчитать эту модель
                  </button>
                  <button
                    onClick={() =>
                      openLead({
                        title: "Посмотреть образцы в шоуруме",
                        description: `${m.series} ${m.name}. Подготовим образец и веер покрытий к вашему визиту в МЦ Roomer.`,
                        source: `Визит в шоурум: ${m.series} ${m.name}`,
                        button: "Записаться на визит",
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 text-[0.85em] font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    <Icon name="Eye" size={14} /> Посмотреть в шоуруме
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;
