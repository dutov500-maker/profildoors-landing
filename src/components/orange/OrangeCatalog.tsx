import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, copyText } from "@/lib/site";

type Cat = "ve" | "frame" | "po" | "alu";

type Model = { id: string; cat: Cat; series: string; name: string; img: string; text: string; badge: string };

const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "ve", label: "Шпон & Эмаль (Серии VE и SE)" },
  { id: "frame", label: "Каркасные двери & Invisible" },
  { id: "po", label: "Царговые двери (Серии P.O и PD.O)" },
  { id: "alu", label: "Алюминиевые стеклянные двери & Перегородки" },
];

const MODELS: Model[] = [
  {
    id: "ve",
    cat: "ve",
    series: "Серия VE",
    name: "Натуральный шпон",
    img: "/img/orange-ve.webp",
    text: "Натуральный шпон (Дуб натуральный, Американский орех, Венге, Грецкий орех). Толщина 44 мм, высота до 3000 мм, скрытый короб Reverse. Алюминиевый торец (Черный, Никель, Шампань).",
    badge: "Натуральный шпон",
  },
  {
    id: "se",
    cat: "ve",
    series: "Серия SE",
    name: "Матовая эмаль",
    img: "/img/orange-hero.webp",
    text: "Премиальное гладкое эмалевое покрытие в трендовых оттенках (Тёплый шёлк, Кашемир, Тауп, Мокко). Врезка скрытых петель, короб телескоп или Invisible.",
    badge: "Трендовая эмаль",
  },
  {
    id: "inv",
    cat: "frame",
    series: "Orange Invisible",
    name: "Invisible под покраску",
    img: "/img/showroom-invisible.webp",
    text: "Скрытый анодированный короб Slim и Invisible Reverse, полотно с заводским грунтом под финишную покраску или обои. Высота до 3000 мм.",
    badge: "В наличии на складе",
  },
  {
    id: "peo",
    cat: "frame",
    series: "Серия PE.O",
    name: "Каркасные двери",
    img: "/img/door-white.webp",
    text: "Каркасные двери в инновационном эмалевом покрытии и полимерном UNILACK (Аляска, Дарк Вайт, Графит). Алюминиевая защитная кромка по периметру.",
    badge: "Практичный выбор",
  },
  {
    id: "po",
    cat: "po",
    series: "Серия 1.1 P.O",
    name: "Царговая серия",
    img: "/img/orange-po.webp",
    text: "Надежная сборно-разборная царговая конструкция. Покрытия: матовая эмаль, перламутр, структурный «Элегант». Цвета: Вайт, Крем Вайт, Лайт Грей, Смоки.",
    badge: "Хит для квартир",
  },
  {
    id: "pdo",
    cat: "po",
    series: "Серия PD.O",
    name: "С сатинированным стеклом",
    img: "/img/orange-pdo.webp",
    text: "Современная геометрия вставок, безопасное белое и бронзовое матовое стекло, износостойкое покрытие Unilack.",
    badge: "Надежность и стиль",
  },
  {
    id: "avo",
    cat: "alu",
    series: "Серия AV.O",
    name: "Стеклянная дверь в алюминиевом профиле",
    img: "/img/door-glass-bronze.webp",
    text: "Прочный архитектурный профиль (Черный матовый, Шампань, Никель, Деорэ), закаленный триплекс с матовым или прозрачным заполнением.",
    badge: "Архитектурный стиль",
  },
  {
    id: "axo",
    cat: "alu",
    series: "Серия AX.O",
    name: "Раздвижная перегородка",
    img: "/img/showroom-glass.webp",
    text: "Беспороговое скольжение, синхронные доводчики, механизмы Magic и скрытый пенал. Зонирование пространств.",
    badge: "Экспозиция в Roomer",
  },
];

const OrangeCatalog = () => {
  const [tab, setTab] = useState<"all" | Cat>("all");
  const list = useMemo(() => (tab === "all" ? MODELS : MODELS.filter((m) => m.cat === tab)), [tab]);

  return (
    <section id="orange-catalog" className="bg-[#F8F7F5]">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip text-[#B8522E]">Серии Orange 2026</span>
            <h2 className="section-title mt-6 max-w-[13em]">Каталог моделей ProfilDoors Orange</h2>
          </div>
          <p className="max-w-[26em] font-light leading-relaxed text-muted-foreground">
            Все серии представлены в шоуруме Roomer: образцы в полный рост, веера эмалей и шпона, профили в разрезе.
          </p>
        </Reveal>

        <div className="-mx-4 mt-14 overflow-x-auto border-b border-neutral-200 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-7">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px whitespace-nowrap border-b pb-4 text-[0.88em] tracking-[-0.01em] transition-colors duration-300 ${
                  tab === t.id ? "border-[#E05A2B] font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div key={tab} className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m, i) => (
            <article key={m.id} className="group flex flex-col animate-rise" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[8px] bg-secondary">
                <img
                  src={m.img}
                  alt={`ProfilDoors Orange ${m.series}`}
                  loading={i < 4 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7em] font-medium text-[#121316] backdrop-blur">
                  {m.badge}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-[#B8522E] px-2 py-0.5 text-[0.62em] font-semibold tracking-[0.12em] text-white">
                  ORANGE
                </span>
              </div>
              <div className="flex flex-1 flex-col pt-5">
                <span className="text-[0.68em] font-medium uppercase tracking-[0.2em] text-[#B8522E]">{m.series}</span>
                <h3 className="mt-2 text-[1.08em] font-medium leading-tight tracking-[-0.025em]">{m.name}</h3>
                <p className="mt-2 text-[0.85em] font-light leading-relaxed text-muted-foreground">{m.text}</p>
                <div className="mt-auto pt-5">
                  <a
                    href={SITE.max}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => copyText(`Здравствуйте! Хочу рассчитать ProfilDoors Orange ${m.series} — ${m.name}.`)}
                    className="btn-pill w-full border border-neutral-300 py-3 text-[0.86em] hover:border-[#E05A2B] hover:bg-[#E05A2B] hover:text-white"
                  >
                    Рассчитать в MAX <Icon name="ArrowUpRight" size={14} strokeWidth={1.8} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrangeCatalog;
