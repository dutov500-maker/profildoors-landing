import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, copyText } from "@/lib/site";
import { MODELS, TABS, type Cat, type Model } from "./orangeData";
import SmartImg from "./SmartImg";
import OrangeLightbox from "./OrangeLightbox";
import OrangeModelDialog from "./OrangeModelDialog";

const ModelCard = ({ m, i, onDetails, onZoom }: { m: Model; i: number; onDetails: () => void; onZoom: (i: number) => void }) => {
  return (
    <article className="flex flex-col animate-rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
      <div className="relative">
        <button
          onClick={() => onZoom(0)}
          className="group relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-[8px] bg-neutral-200"
          aria-label={`Открыть фото ${m.name}`}
        >
          <SmartImg
            photo={m.photos[0]}
            alt={`${m.name} — ${m.subtitle}`}
            loading={i < 3 ? "eager" : "lazy"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#121316] opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Icon name="Maximize2" size={16} />
          </span>
        </button>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.7em] font-medium text-[#121316] backdrop-blur">
          {m.badge}
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-[#B8522E] px-2 py-0.5 text-[0.62em] font-semibold tracking-[0.12em] text-white">
          ORANGE
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <button onClick={onDetails} className="text-left">
          <h3 className="text-[1.12em] font-medium leading-tight tracking-[-0.025em] hover:text-[#B8522E]">{m.name}</h3>
          <p className="mt-1 text-[0.86em] text-muted-foreground">{m.subtitle}</p>
        </button>
        <p className="mt-3 line-clamp-3 text-[0.85em] font-light leading-relaxed text-muted-foreground">{m.text}</p>
        <button onClick={onDetails} className="mt-4 flex w-fit items-center gap-1.5">
          {m.finishes.map((s) => (
            <span key={s.name} title={s.name} className="h-4 w-4 rounded-full border border-black/10" style={{ background: s.color }} />
          ))}
          <span className="ml-1 text-[0.75em] text-muted-foreground">{m.finishesLabel === "Профиль" ? "цвета профиля" : "отделки"}</span>
        </button>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-[1.25em] font-medium tracking-[-0.02em]">{m.price}</p>
          <button onClick={onDetails} className="text-[0.82em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Подробнее
          </button>
        </div>
        <a
          href={SITE.max}
          target="_blank"
          rel="noreferrer"
          onClick={() => copyText(`Здравствуйте! Хочу рассчитать ${m.name} (${m.subtitle}).`)}
          className="btn-pill mt-4 w-full border border-neutral-300 py-3 text-[0.86em] hover:border-[#E05A2B] hover:bg-[#E05A2B] hover:text-white"
        >
          Рассчитать в MAX <Icon name="ArrowUpRight" size={14} strokeWidth={1.8} />
        </a>
      </div>
    </article>
  );
};

type Zoom = { m: Model; i: number; back?: boolean };

const OrangeCatalog = () => {
  const [tab, setTab] = useState<"all" | Cat>("all");
  const [details, setDetails] = useState<Model | null>(null);
  const [zoom, setZoom] = useState<Zoom | null>(null);
  const list = useMemo(() => (tab === "all" ? MODELS : MODELS.filter((m) => m.cat === tab)), [tab]);

  const closeZoom = () => {
    if (zoom?.back) setDetails(zoom.m);
    setZoom(null);
  };

  return (
    <section id="orange-catalog" className="bg-[#F8F7F5]">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
        <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow-chip text-[#B8522E]">Витрина Orange 2026</span>
            <h2 className="section-title mt-6 max-w-[13em]">Каталог моделей ProfilDoors Orange</h2>
          </div>
          <p className="max-w-[26em] font-light leading-relaxed text-muted-foreground">
            Нажмите на фото, чтобы рассмотреть детали в полном размере, или откройте модель, чтобы выбрать отделку.
          </p>
        </Reveal>

        <div className="-mx-4 mt-14 overflow-x-auto border-b border-neutral-200 px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
          <div className="flex w-max gap-7">
            {TABS.map((t) => {
              const count = t.id === "all" ? MODELS.length : MODELS.filter((m) => m.cat === t.id).length;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`-mb-px whitespace-nowrap border-b pb-4 text-[0.88em] tracking-[-0.01em] transition-colors duration-300 ${
                    tab === t.id ? "border-[#E05A2B] font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label} <span className="ml-1 text-[0.85em] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div key={tab} className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((m, i) => (
            <ModelCard key={m.id} m={m} i={i} onDetails={() => setDetails(m)} onZoom={(idx) => setZoom({ m, i: idx })} />
          ))}
        </div>

        <Reveal className="mt-20 flex flex-col gap-6 rounded-[12px] bg-[#121316] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E05A2B]">
              <Icon name="MapPin" size={22} />
            </span>
            <p className="max-w-[44em] text-[1.02em] font-light leading-relaxed text-white/80">
              В онлайн-каталоге представлены ключевые конфигурации серии Orange. Полная экспозиция фабрики — более 70 вариантов остеклений, веера выкрасов эмали и образцы шпона — представлена в салоне:{" "}
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
        model={details}
        onClose={() => setDetails(null)}
        onZoom={(m, i) => {
          setDetails(null);
          setZoom({ m, i, back: true });
        }}
      />
      {zoom && (
        <OrangeLightbox
          photos={zoom.m.photos}
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