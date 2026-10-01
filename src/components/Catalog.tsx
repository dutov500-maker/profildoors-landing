import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { openLead } from "@/components/LeadDialog";
import { CATALOG_TAB_EVENT, presetQuiz } from "@/lib/site";

type Cat = "orange" | "invisible" | "premium" | "alu" | "entry";

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
  { id: "invisible", label: "Скрытые Invisible & Короба" },
  { id: "premium", label: "Шпон & Эмаль (Премиум)" },
  { id: "alu", label: "Алюминиевые двери & Перегородки AG" },
  { id: "entry", label: "Входные алюминиевые двери" },
  { id: "orange", label: "ProfilDoors Orange" },
];

const MODELS: Model[] = [
  { id: "inv-alu", cat: "invisible", series: "Короб INVISIBLE ALU", name: "Скрытый алюминиевый короб", img: "/img/showroom-invisible.webp", text: "Анодированный короб под отделку стены, скрытые петли и магнитный замок. Высота полотна до 4 000 мм.", price: 26900, badge: "Хит Roomer", quiz: "invisible" },
  { id: "inv-slim", cat: "invisible", series: "Короб SLIM", name: "Тонкий скрытый короб SLIM", img: "/img/hero-invisible.webp", text: "Минимальный теневой зазор и облегчённый профиль — дверь читается как линия на стене.", price: 29400, badge: "Скрытый монтаж", quiz: "invisible" },
  { id: "inv-reverse", cat: "invisible", series: "INFINITY REVERSE", name: "Полотно в плоскости стены", img: "/img/invisible.webp", text: "Реверсивное открывание: полотно в единой плоскости со стеной с обеих сторон. До 4 000 мм.", price: 34800, badge: "Скрытый монтаж", quiz: "invisible" },
  { id: "inv-0sa", cat: "invisible", series: "Серии 0 SA · 0 SE", name: "Под покраску и сплошное зеркало", img: "/img/door-mirror.webp", text: "Полотно под покраску или со сплошным зеркалом: серебро, бронза, графит.", price: 24900, badge: "Выбор дизайнеров", quiz: "invisible" },

  { id: "ve", cat: "premium", series: "Серии VE · VA · VT", name: "Натуральный шпон", img: "/img/door-veneer.webp", text: "Сложные текстуры Duna и Albero, руст 5 мм, диагональное и радиальное направление волокон.", price: 48500, badge: "Премиум", quiz: "interior" },
  { id: "se", cat: "premium", series: "Серии SE · SA", name: "Шелковистая гладкая эмаль", img: "/img/door-white.webp", text: "Многослойная эмаль с бархатистой поверхностью, кромка в цвет полотна, колеровка RAL/NCS.", price: 32700, badge: "Хит Roomer", quiz: "interior" },
  { id: "sw", cat: "premium", series: "Серия SW", name: "Неоклассическая 3D-фрезеровка", img: "/img/door-graphite.webp", text: "Объёмная фрезеровка филёнок под эмалью — современная неоклассика для высоких потолков.", price: 39800, badge: "Неоклассика", quiz: "interior" },
  { id: "swb", cat: "premium", series: "Серия SWB", name: "Эмаль с латунными молдингами", img: "/img/door-enamel-brass.webp", text: "Тонкие латунные молдинги на шелковистой эмали — акцент для гостиных и кабинетов.", price: 46200, badge: "Новая коллекция", quiz: "interior" },

  { id: "agk", cat: "alu", series: "Серии AGK · AGN", name: "Алюминиевые двери с триплексом", img: "/img/door-glass-bronze.webp", text: "Двойное заполнение триплексом и декоративные панели АКП в тонком алюминиевом профиле.", price: 52400, badge: "Хит Roomer", quiz: "glass" },
  { id: "ag", cat: "alu", series: "Серия AG", name: "Беспороговые раздвижные перегородки", img: "/img/showroom-glass.webp", text: "Перегородки в потолок без порога, профиль Black Matte, скрытые доводчики.", price: 68000, badge: "Экспозиция в Roomer", quiz: "glass" },
  { id: "magic", cat: "alu", series: "Системы Magic · Pivot", name: "Magic, Pivot и каскадные пеналы", img: "/img/glass.webp", text: "Раздвижные системы Magic со скрытым механизмом, поворотные Pivot и каскадные пеналы.", price: 74500, badge: "Сложные проёмы", quiz: "glass" },

  { id: "rp", cat: "entry", series: "Серия RP", name: "Pivot со смарт-замком", img: "/img/door-pivot.webp", text: "Премиальная алюминиевая входная дверь на поворотной оси Pivot, смарт-замок, для дома и квартиры.", price: 189000, badge: "Премиум", quiz: "entry" },
  { id: "fn", cat: "entry", series: "Серия FN", name: "Алюминиевая дверь с терморазрывом", img: "/img/door-entry-house.webp", text: "Уличная и квартирная дверь с терморазрывом и многоконтурным уплотнением.", price: 98000, badge: "Для коттеджа", quiz: "entry" },
  { id: "fn-flat", cat: "entry", series: "Серия FN", name: "Квартирная FN в стиле межкомнатных", img: "/img/entry.webp", text: "Внутренняя панель в едином стиле с межкомнатными дверями ProfilDoors.", price: 86500, badge: "Единый стиль", quiz: "entry" },

  { id: "orange-wave", cat: "orange", series: "ProfilDoors Orange", name: "Orange Wave 01", img: "/img/orange-wave.webp", text: "3D-фрезеровка, бархатистое покрытие Soft-Touch, алюминиевая кромка с 4 сторон.", price: 36900, badge: "Новая коллекция Orange", quiz: "interior" },
  { id: "orange-line", cat: "orange", series: "ProfilDoors Orange", name: "Orange Line 03", img: "/img/door-greige.webp", text: "Тонкая вертикальная фрезеровка, матовый Soft-Touch в оттенках Грейж и Кашемир.", price: 38700, badge: "Новая коллекция Orange", quiz: "interior" },
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
    <section id="catalog" className="border-t border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip">Актуальные коллекции фабрики</span>
            <h2 className="section-title mt-6 max-w-[14em]">Каталог моделей, которые можно потрогать в шоуруме</h2>
          </div>
          <p className="max-w-[26em] font-light leading-relaxed text-muted-foreground">
            {MODELS.length} актуальных моделей и новая линейка ProfilDoors Orange. Цены за комплект: полотно, короб, наличники.
          </p>
        </Reveal>

        <div className="-mx-4 mt-14 overflow-x-auto border-b border-neutral-200 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-7">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px whitespace-nowrap border-b pb-4 text-[0.88em] tracking-[-0.01em] transition-colors duration-300 ${
                  tab === t.id ? "border-graphite font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m, i) => (
            <article
              key={m.id}
              className="group flex flex-col animate-rise"
              style={{ animationDelay: `${(i % 8) * 50}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-secondary">
                <img
                  src={m.img}
                  alt={m.name}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.7em] font-medium tracking-[0.01em] backdrop-blur  bg-white/90 text-graphite`}>
                  {m.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col pt-5">
                <span className="text-[0.68em] font-medium uppercase tracking-[0.2em] text-muted-foreground">{m.series}</span>
                <h3 className="mt-2 text-[1.08em] font-medium leading-tight tracking-[-0.025em]">{m.name}</h3>
                <p className="mt-2 text-[0.85em] font-light leading-relaxed text-muted-foreground">{m.text}</p>
                <div className="mt-auto pt-5">
                  <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
                    <span className="text-[0.74em] text-muted-foreground">Комплект от</span>
                    <span className="text-[1.5em] font-light tracking-[-0.04em]">{fmt(m.price)} ₽</span>
                  </div>
                  <button onClick={() => presetQuiz(m.quiz, `${m.series} ${m.name}`)} className="btn-pill btn-outline mt-4 w-full py-3 text-[0.86em]">
                    Рассчитать эту модель
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
                    className="mt-2 inline-flex w-full items-center justify-center gap-1.5 py-1.5 text-[0.82em] text-muted-foreground transition hover:text-foreground"
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
