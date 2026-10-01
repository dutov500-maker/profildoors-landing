import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { openLead } from "@/components/LeadDialog";
import { CATALOG_TAB_EVENT, presetQuiz } from "@/lib/site";

type Cat = "invisible" | "modern" | "classic" | "glass" | "entry";

type Model = {
  id: string;
  cat: Cat;
  series: string;
  name: string;
  img: string;
  coating: string;
  frame: string;
  sound: string;
  height: string;
  price: number;
  badge?: string;
  quiz: string;
};

const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "invisible", label: "Скрытые (Invisible)" },
  { id: "modern", label: "Современные (Эмаль/Nanoflex)" },
  { id: "classic", label: "Классические" },
  { id: "glass", label: "Стеклянные перегородки (Алюминий)" },
  { id: "entry", label: "Входные двери" },
];

const MODELS: Model[] = [
  { id: "inv", cat: "invisible", series: "ProfilDoors Invisible", name: "Скрытая под покраску", img: "/img/invisible.webp", coating: "Грунт под покраску", frame: "Алюминиевый скрытый короб", sound: "до 32 дБ", height: "до 3000 мм", price: 38900, badge: "Хит салона", quiz: "invisible" },
  { id: "inv-rev", cat: "invisible", series: "Invisible Reverse", name: "Скрытая обратного открывания", img: "/img/invisible.webp", coating: "Эмаль / грунт", frame: "Короб Reverse 0 мм", sound: "до 32 дБ", height: "до 3000 мм", price: 44500, quiz: "invisible" },
  { id: "u", cat: "modern", series: "Серия U", name: "1.1.1 U Антрацит", img: "/img/modern.webp", coating: "Unilack, антрацит", frame: "Массив + МДФ", sound: "до 28 дБ", height: "до 2300 мм", price: 26700, quiz: "classic" },
  { id: "e", cat: "modern", series: "Серия E", name: "1E Аляска, кромка ABS", img: "/img/modern.webp", coating: "Эмаль", frame: "Инженерный массив", sound: "до 30 дБ", height: "до 2400 мм", price: 31200, quiz: "classic" },
  { id: "z", cat: "modern", series: "Серия Z", name: "1Z Nanoflex Графит", img: "/img/modern.webp", coating: "Nanoflex, soft-touch", frame: "Массив + МДФ", sound: "до 28 дБ", height: "до 2300 мм", price: 29400, badge: "Новинка", quiz: "classic" },
  { id: "l", cat: "classic", series: "Серия L", name: "73L Манхэттен", img: "/img/classic.webp", coating: "Эмаль, патина", frame: "Массив хвойных пород", sound: "до 30 дБ", height: "до 2400 мм", price: 42800, quiz: "classic" },
  { id: "x", cat: "classic", series: "Серия X", name: "2.8XN Пекан Кремовый", img: "/img/classic.webp", coating: "Натуральный шпон", frame: "Массив", sound: "до 30 дБ", height: "до 2300 мм", price: 36500, quiz: "classic" },
  { id: "ag", cat: "glass", series: "Серия AG", name: "Перегородка AG Чёрный матовый", img: "/img/glass.webp", coating: "Алюминий, порошок", frame: "Профиль 20 мм", sound: "до 26 дБ", height: "до 3000 мм", price: 64000, badge: "До потолка", quiz: "glass" },
  { id: "agn", cat: "glass", series: "Серия AGN", name: "Раздвижная AGN Компакт", img: "/img/glass.webp", coating: "Алюминий, стекло 4 мм", frame: "Скрытый механизм", sound: "до 24 дБ", height: "до 3000 мм", price: 71500, quiz: "glass" },
  { id: "ent", cat: "entry", series: "Входные ProfilDoors", name: "Steel Графит с ручкой-скобой", img: "/img/entry.webp", coating: "МДФ-панель, эмаль", frame: "Сталь 2 мм, 3 контура", sound: "до 42 дБ", height: "до 2400 мм", price: 89000, quiz: "entry" },
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
          <span className="eyebrow-chip">Коллекции ProfilDoors</span>
          <h2 className="section-title mt-4 max-w-[16em]">Каталог моделей, которые можно потрогать в шоуруме</h2>
        </div>
        <p className="max-w-[26em] text-muted-foreground">
          Образцы в полный рост, веера покрытий и короба в разрезе. Цены за комплект: полотно, короб, наличники.
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
                alt={`${m.series} ${m.name}`}
                loading={i < 4 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              {m.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-card/95 px-2.5 py-1 text-[0.75em] font-medium backdrop-blur">
                  {m.badge}
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <span className="text-[0.72em] font-medium uppercase tracking-[0.06em] text-gold">{m.series}</span>
              <h3 className="mt-1 text-[1.15em] font-semibold leading-tight tracking-[-0.02em]">{m.name}</h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[0.82em]">
                {[
                  ["Покрытие", m.coating],
                  ["Каркас", m.frame],
                  ["Звукоизоляция", m.sound],
                  ["Высота", m.height],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-4">
                <p className="font-display text-xl font-semibold tracking-tight">
                  от {fmt(m.price)} ₽ <span className="text-[0.7em] font-medium text-muted-foreground">/ комплект</span>
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <button onClick={() => presetQuiz(m.quiz)} className="btn-pill btn-dark py-2.5 text-[0.88em]">
                    Быстрый расчёт в салон
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
                    className="btn-pill btn-outline py-2.5 text-[0.88em]"
                  >
                    <Icon name="Eye" size={15} /> Посмотреть образцы в шоуруме
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