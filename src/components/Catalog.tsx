import { useEffect, useMemo, useState } from "react";
import { Link as RLink } from "@tanstack/react-router";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { Link } from "@/lib/router-compat";
import { openLead } from "@/components/LeadDialog";
import { CATALOG_TAB_EVENT, presetQuiz } from "@/lib/site";
import { goal } from "@/lib/metrika";
import { fetchCatalog, type CatalogCategory, type CatalogData, type Finish } from "@/lib/api";
import Swatches from "@/components/catalog/Swatches";

type Model = {
  id: number;
  slug: string;
  finishes: Finish[];
  finishesLabel: string;
  cat: string;
  series: string;
  name: string;
  img: string;
  text: string;
  price: number;
  badge: string;
  quiz: string;
};

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const toModels = ({ categories, products }: CatalogData): Model[] => {
  const byId = new Map(categories.map((c) => [c.id, c]));
  return products.map((p) => ({
    id: p.id,
    slug: p.slug ?? "",
    finishes: p.finishes ?? [],
    finishesLabel: p.finishes_label || "Отделки",
    cat: byId.get(p.category_id)?.slug ?? "",
    series: p.series,
    name: p.name,
    img: p.image_url || "/img/door-placeholder.webp",
    text: p.description,
    price: p.price,
    badge: p.badge,
    quiz: byId.get(p.category_id)?.quiz_type ?? "interior",
  }));
};

const PLACEHOLDER = "/img/door-placeholder.webp";

const ModelCard = ({ m, i }: { m: Model; i: number }) => {
  const [fi, setFi] = useState(0);
  const f = m.finishes[fi];
  const img = f?.image || m.img;
  const title = `${m.series} ${m.name}`.trim();
  const toPage = m.slug ? { to: "/models/$slug" as const, params: { slug: m.slug } } : null;

  const photo = (
    <img
      key={img}
      src={img}
      alt={f ? `${m.name} — ${f.name}` : m.name}
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.src.endsWith(PLACEHOLDER)) el.src = PLACEHOLDER;
      }}
      loading={i < 4 ? "eager" : "lazy"}
      className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out animate-fade-in group-hover:scale-[1.06]"
    />
  );

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-neutral-200 bg-card animate-rise"
      style={{ animationDelay: `${(i % 8) * 50}ms` }}
    >
      <div className="relative aspect-[3/4] shrink-0 overflow-hidden bg-secondary">
        {toPage ? (
          <RLink {...toPage} aria-label={`Подробнее: ${m.name}`} className="block h-full w-full">
            {photo}
          </RLink>
        ) : (
          photo
        )}
        {m.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7em] font-medium tracking-[0.01em] text-graphite backdrop-blur">
            {m.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="line-clamp-1 text-[0.68em] font-medium uppercase tracking-[0.2em] text-muted-foreground">{m.series}</span>
        <h3 className="mt-2 line-clamp-2 min-h-[2.5em] text-[1.08em] font-medium leading-[1.25] tracking-[-0.025em]">
          {toPage ? (
            <RLink {...toPage} className="hover:underline hover:underline-offset-4">
              {m.name}
            </RLink>
          ) : (
            m.name
          )}
        </h3>
        <p className="mt-2 line-clamp-3 min-h-[4.875em] text-[0.85em] font-light leading-[1.625] text-muted-foreground">{m.text}</p>
        {m.finishes.length > 0 && (
          <div className="mt-4">
            <div className="flex items-baseline justify-between gap-2 text-[0.72em]">
              <span className="uppercase tracking-[0.16em] text-muted-foreground">{m.finishesLabel}</span>
              <span className="line-clamp-1 font-medium">{f?.name}</span>
            </div>
            <div className="mt-2.5">
              <Swatches finishes={m.finishes} active={fi} onPick={setFi} limit={8} />
            </div>
          </div>
        )}
        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
            <span className="text-[0.74em] text-muted-foreground">Комплект от</span>
            <span className="text-[1.5em] font-light tracking-[-0.04em]">{fmt(m.price)} ₽</span>
          </div>
          <button
            onClick={() => presetQuiz(m.quiz, f ? `${title}, отделка «${f.name}»` : title)}
            className="btn-pill btn-graphite mt-4 w-full py-3 text-[0.86em]"
          >
            Рассчитать эту модель
          </button>
          {toPage ? (
            <RLink
              {...toPage}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 py-1.5 text-[0.82em] text-muted-foreground transition hover:text-foreground"
            >
              Подробнее о модели <Icon name="ArrowRight" size={14} />
            </RLink>
          ) : (
            <button
              onClick={() =>
                openLead({
                  title: "Посмотреть образцы в шоуруме",
                  description: `${title}. Подготовим образец и веер покрытий к вашему визиту в МЦ Roomer.`,
                  source: `Визит в шоурум: ${title}`,
                  button: "Записаться на визит",
                })
              }
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 py-1.5 text-[0.82em] text-muted-foreground transition hover:text-foreground"
            >
              <Icon name="Eye" size={14} /> Посмотреть в шоуруме
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

const Catalog = ({ initial = null }: { initial?: CatalogData | null }) => {
  const [tab, setTab] = useState<string>("all");
  const [cats, setCats] = useState<CatalogCategory[]>(() => initial?.categories ?? []);
  const [models, setModels] = useState<Model[]>(() => (initial ? toModels(initial) : []));
  const [loading, setLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    fetchCatalog()
      .then((data) => {
        setCats(data.categories);
        setModels(toModels(data));
      })
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, [initial]);

  useEffect(() => {
    const h = (e: Event) => setTab((e as CustomEvent<string>).detail || "all");
    window.addEventListener(CATALOG_TAB_EVENT, h);
    return () => window.removeEventListener(CATALOG_TAB_EVENT, h);
  }, []);

  const TABS = useMemo(() => [{ id: "all", label: "Все модели" }, ...cats.map((c) => ({ id: c.slug, label: c.name }))], [cats]);
  const active = TABS.some((t) => t.id === tab) ? tab : "all";
  const list = useMemo(() => (active === "all" ? models : models.filter((m) => m.cat === active)), [active, models]);

  return (
    <section id="catalog" data-fab-hide className="relative border-t border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip">Актуальные коллекции фабрики</span>
            <h2 className="section-title mt-6 max-w-[14em]">Каталог моделей, которые можно потрогать в шоуруме</h2>
          </div>
          <p className="max-w-[26em] font-light leading-relaxed text-muted-foreground">
            {models.length || ""} актуальных моделей и новая линейка ProfilDoors Orange. Цены за комплект: полотно, короб, наличники.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <Link
            to="/orange"
            onClick={() => goal("orange_banner_click")}
            className="group mt-12 grid overflow-hidden rounded-[10px] bg-[#121316] text-white md:grid-cols-[1.3fr_1fr]"
          >
            <div className="flex flex-col justify-center gap-5 p-7 sm:p-10">
              <span className="inline-flex w-fit items-center gap-2 text-[0.7em] font-medium uppercase tracking-[0.22em] text-[#E8A27E]">
                <span className="h-px w-6 bg-[#E05A2B]" /> ProfilDoors Orange 2026
              </span>
              <p className="max-w-[22em] text-[1.5em] font-medium leading-[1.15] tracking-[-0.035em] sm:text-[1.9em]">
                Новая коллекция ProfilDoors Orange уже в Roomer: царговые, шпонированные и алюминиевые серии
              </p>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-[0.9em] font-medium text-[#1A1A1A] transition-opacity group-hover:opacity-85">
                Смотреть коллекцию Orange <Icon name="ArrowRight" size={15} strokeWidth={1.8} />
              </span>
            </div>
            <div className="relative min-h-[220px] overflow-hidden">
              <img
                src="/img/orange-wave.webp"
                alt="Дверь ProfilDoors Orange"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121316] via-transparent to-transparent md:via-[#121316]/10" />
            </div>
          </Link>
        </Reveal>

        <div className="-mx-4 mt-14 overflow-x-auto border-b border-neutral-200 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-7">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  goal("catalog_tab", { tab: t.label });
                }}
                className={`-mb-px whitespace-nowrap border-b pb-4 text-[0.88em] tracking-[-0.01em] transition-colors duration-300 ${
                  active === t.id ? "border-graphite font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[620px] animate-pulse rounded-[12px] bg-secondary" />
            ))}
          </div>
        )}
        {!loading && !list.length && (
          <p className="mt-10 rounded-[12px] border border-neutral-200 p-10 text-center font-light text-muted-foreground">
            Каталог обновляется. Актуальные модели и цены подскажет менеджер салона.
          </p>
        )}
        <div key={active} className="mt-10 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((m, i) => (
            <ModelCard key={m.id} m={m} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;