import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, copyText } from "@/lib/site";
import { fetchCatalog, type CatalogData } from "@/lib/api";
import { toModel, photoFor, type Model } from "./orangeData";
import { Link as RLink } from "@tanstack/react-router";
import Swatches from "@/components/catalog/Swatches";
import SmartImg from "./SmartImg";
import OrangeLightbox from "./OrangeLightbox";
import OrangeModelDialog from "./OrangeModelDialog";
import { goal } from "@/lib/metrika";

const ModelCard = ({ m, i, onDetails, onZoom }: { m: Model; i: number; onDetails: (finish: number) => void; onZoom: (i: number, finish: number) => void }) => {
  const [fi, setFi] = useState(0);
  const f = m.finishes[fi];
  return (
    <article className="flex flex-col animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
      <div className="relative">
        <button
          onClick={() => onZoom(0, fi)}
          className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-[8px] bg-white/[0.06]"
          aria-label={`Открыть фото ${m.name}`}
        >
          <SmartImg
            key={photoFor(m, f).src}
            photo={photoFor(m, f)}
            alt={`${m.name} — ${f ? f.name : m.subtitle}`}
            loading={i < 3 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#121316] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Icon name="Maximize2" size={16} />
          </span>
        </button>
        {m.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7em] font-medium text-[#121316] backdrop-blur">
            {m.badge}
          </span>
        )}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#B8522E] px-2 py-0.5 text-[0.62em] font-semibold tracking-[0.12em] text-white">
          ORANGE
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        {m.slug ? (
          <RLink to="/models/$slug" params={{ slug: m.slug }} className="text-left">
            <h3 className="text-[1.12em] font-medium leading-tight tracking-[-0.025em] hover:text-[#E05A2B]">{m.name}</h3>
            <p className="mt-1 text-[0.86em] text-white/55">{m.subtitle}</p>
          </RLink>
        ) : (
          <button onClick={() => onDetails(fi)} className="text-left">
            <h3 className="text-[1.12em] font-medium leading-tight tracking-[-0.025em] hover:text-[#E05A2B]">{m.name}</h3>
            <p className="mt-1 text-[0.86em] text-white/55">{m.subtitle}</p>
          </button>
        )}
        <p className="mt-3 line-clamp-3 text-[0.85em] font-light leading-relaxed text-white/55">{m.text}</p>
        {m.finishes.length > 0 && (
        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-2 text-[0.72em]">
            <span className="uppercase tracking-[0.16em] text-white/45">{m.finishesLabel}</span>
            <span className="line-clamp-1 font-medium text-white/85">{f?.name}</span>
          </div>
          <div className="mt-2.5">
            <Swatches finishes={m.finishes} active={fi} onPick={setFi} limit={8} dark />
          </div>
        </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-[1.25em] font-medium tracking-[-0.02em]">{m.price}</p>
          <button onClick={() => onDetails(fi)} className="inline-flex items-center gap-1 text-[0.84em] font-medium text-white underline-offset-4 hover:underline">
            Подробнее <Icon name="ArrowRight" size={13} strokeWidth={1.8} />
          </button>
        </div>
        <a
          href={SITE.max}
          target="_blank"
          rel="noreferrer"
          onClick={() => copyText(`Здравствуйте! Хочу рассчитать ${m.name}${m.subtitle ? ` (${m.subtitle})` : ""}${f ? `, ${m.finishesLabel.toLowerCase()} «${f.name}»` : ""}.`)}
          className="btn-pill mt-4 w-full bg-white py-3 text-[0.86em] font-medium text-[#121316] hover:bg-white/90"
        >
          Рассчитать в MAX <Icon name="ArrowUpRight" size={14} strokeWidth={1.8} />
        </a>
      </div>
    </article>
  );
};

type Zoom = { m: Model; i: number; back?: boolean; finish?: number };

const toModels = ({ categories, products }: CatalogData): Model[] => {
  const slug = new Map(categories.map((c) => [c.id, c.slug]));
  return products.map((p) => toModel(p, slug.get(p.category_id) ?? ""));
};

const OrangeCatalog = ({ initial = null }: { initial?: CatalogData | null }) => {
  const [tab, setTab] = useState<string>("all");
  const [models, setModels] = useState<Model[]>(() => (initial ? toModels(initial) : []));
  const [tabs, setTabs] = useState<{ id: string; label: string }[]>(() =>
    initial ? initial.categories.map((c) => ({ id: c.slug, label: c.name })) : [],
  );
  const [loading, setLoading] = useState(!initial);
  const [details, setDetails] = useState<{ m: Model; finish: number } | null>(null);
  const [zoom, setZoom] = useState<Zoom | null>(null);

  useEffect(() => {
    if (initial) return;
    fetchCatalog("orange")
      .then((data) => {
        setModels(toModels(data));
        setTabs(data.categories.map((c) => ({ id: c.slug, label: c.name })));
      })
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, [initial]);

  const TABS = useMemo(() => [{ id: "all", label: "Все модели" }, ...tabs], [tabs]);
  const active = TABS.some((t) => t.id === tab) ? tab : "all";
  const list = useMemo(() => (active === "all" ? models : models.filter((m) => m.cat === active)), [active, models]);

  const closeZoom = () => {
    if (zoom?.back) setDetails({ m: zoom.m, finish: zoom.finish ?? 0 });
    setZoom(null);
  };

  return (
    <section id="orange-catalog" data-fab-hide className="relative border-t border-white/[0.06] bg-[#0F1012] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip text-[#E05A2B]">Витрина Orange 2026</span>
            <h2 className="section-title mt-6 max-w-[13em]">Каталог моделей ProfilDoors Orange</h2>
          </div>
          <p className="max-w-[26em] font-light leading-relaxed text-white/55">
            Нажмите на фото, чтобы рассмотреть детали в полном размере, или откройте модель, чтобы выбрать отделку.
          </p>
        </Reveal>

        <div className="-mx-4 mt-14 overflow-x-auto border-b border-white/[0.08] px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-7">
            {TABS.map((t) => {
              const count = t.id === "all" ? models.length : models.filter((m) => m.cat === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`-mb-px whitespace-nowrap border-b pb-4 text-[0.88em] tracking-[-0.01em] transition-colors duration-300 ${
                    active === t.id ? "border-[#E05A2B] font-medium text-white" : "border-transparent text-white/55 hover:text-white"
                  }`}
                >
                  {t.label} <span className="ml-1 text-[0.85em] text-white/55">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-pulse rounded-[8px] bg-white/[0.06]" />
                <div className="mt-5 h-5 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        )}
        {!loading && !list.length && (
          <p className="mt-10 rounded-[12px] border border-white/[0.08] bg-white/[0.03] p-10 text-center font-light text-white/55">
            Витрина обновляется. Актуальные модели Orange подскажет менеджер салона: <a href={SITE.phoneHref} className="text-white">{SITE.phone}</a>
          </p>
        )}
        <div key={active} className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, i) => (
            <ModelCard key={m.id} m={m} i={i} onDetails={(fin) => {
              setDetails({ m, finish: fin });
              goal("orange_model_open", { model: m.name });
            }} onZoom={(idx, fin) => {
              setZoom({ m, i: idx, finish: fin });
              goal("orange_photo_zoom", { model: m.name });
            }} />
          ))}
        </div>

        <Reveal className="mt-20 flex flex-col gap-6 rounded-[12px] border border-white/[0.08] bg-[#16171A] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E05A2B]">
              <Icon name="MapPin" size={22} />
            </span>
            <p className="max-w-[44em] text-[1.02em] font-light leading-relaxed text-white/80">
              В онлайн-каталоге представлены ключевые конфигурации серии Orange. Экспозиция из 26 моделей, веера выкрасов эмали и образцы шпона представлены в салоне:{" "}
              <span className="font-medium text-white">Москва, МЦ Roomer, этаж 1, павильон А149–А151</span>.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
            <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill bg-[#E05A2B] text-white hover:bg-[#C94E24]">
              Забронировать консультацию в салоне
            </a>
            <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-ghost-light">
              Маршрут
            </a>
          </div>
        </Reveal>
      </div>

      <OrangeModelDialog
        model={details?.m ?? null}
        initialFinish={details?.finish ?? 0}
        onClose={() => setDetails(null)}
        onZoom={(m, i, finish) => {
          setDetails(null);
          setZoom({ m, i, back: true, finish });
        }}
      />
      {zoom && (
        <OrangeLightbox
          photos={[photoFor(zoom.m, zoom.m.finishes[zoom.finish ?? 0])]}
          index={zoom.i}
          title={zoom.m.name}
          onClose={closeZoom}
          onIndex={(i) => setZoom({ ...zoom, i })}
        />
      )}
    </section>
  );
};

export default OrangeCatalog;