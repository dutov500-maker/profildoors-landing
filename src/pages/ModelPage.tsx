import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import Icon from "@/components/ui/icon";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadDialog, { openLead } from "@/components/LeadDialog";
import CalcDialog from "@/components/CalcDialog";
import FloatingMessenger from "@/components/FloatingMessenger";
import Swatches from "@/components/catalog/Swatches";
import Consent from "@/components/legal/Consent";
import { SITE, copyText, presetQuiz } from "@/lib/site";
import { goal } from "@/lib/metrika";
import type { CatalogCategory, CatalogProduct } from "@/lib/api";

const PLACEHOLDER = "/img/door-placeholder.webp";
const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

type Props = { product: CatalogProduct; category?: CatalogCategory };

const ModelPage = ({ product: p, category }: Props) => {
  const [fi, setFi] = useState(0);
  const finishes = p.finishes ?? [];
  const f = finishes[fi];
  const img = f?.image || p.image_url || PLACEHOLDER;
  const orange = !!p.in_orange && !p.in_main;
  const title = `${p.series} ${p.name}`.trim();
  const label = p.finishes_label || "Отделки";

  useEffect(() => {
    window.scrollTo(0, 0);
    goal("model_page", { model: p.name });
  }, [p.id, p.name]);

  const calc = () => {
    if (orange) {
      copyText(`Здравствуйте! Хочу рассчитать ${title}${f ? `, ${label.toLowerCase()} «${f.name}»` : ""}.`);
      window.open(SITE.max, "_blank", "noopener");
      return;
    }
    presetQuiz(category?.quiz_type ?? "interior", f ? `${title}, отделка «${f.name}»` : title);
  };

  return (
    <div className="min-h-screen bg-card text-foreground">
      <Header />
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-28 sm:px-6 lg:px-[34px] lg:pt-36">
        <nav aria-label="Навигация" className="flex flex-wrap items-center gap-2 text-[0.8em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <Icon name="ChevronRight" size={12} />
          {orange ? (
            <Link to="/orange" className="hover:text-foreground">Коллекция Orange</Link>
          ) : (
            <Link to="/" hash="catalog" className="hover:text-foreground">Каталог</Link>
          )}
          {category && (
            <>
              <Icon name="ChevronRight" size={12} />
              <span>{category.name}</span>
            </>
          )}
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[14px] bg-secondary lg:sticky lg:top-28 lg:self-start">
            <img
              key={img}
              src={img}
              alt={f ? `${p.name} — ${f.name}` : p.name}
              onError={(e) => {
                const el = e.currentTarget;
                if (!el.src.endsWith(PLACEHOLDER)) el.src = PLACEHOLDER;
              }}
              className="aspect-[3/4] w-full object-cover animate-fade-in"
            />
            {p.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.75em] font-medium text-graphite backdrop-blur">
                {p.badge}
              </span>
            )}
            {orange && (
              <span className="absolute right-4 top-4 rounded-full bg-[#B8522E] px-2.5 py-1 text-[0.66em] font-semibold tracking-[0.12em] text-white">
                ORANGE
              </span>
            )}
          </div>

          <div className="flex flex-col">
            {p.series && <span className="text-[0.72em] font-medium uppercase tracking-[0.2em] text-muted-foreground">{p.series}</span>}
            <h1 className="mt-3 text-[2em] font-medium leading-[1.1] tracking-[-0.035em] sm:text-[2.6em]">
              {p.name}
            </h1>
            <p className="mt-2 text-muted-foreground">ProfilDoors{orange ? " Orange" : ""} · в наличии образцы в МЦ Roomer</p>

            <div className="mt-8 flex items-baseline gap-3 border-y border-neutral-200 py-6">
              <span className="text-[0.85em] text-muted-foreground">Комплект от</span>
              <span className="text-[2em] font-light tracking-[-0.04em]">{p.price ? `${fmt(p.price)} ₽` : "по запросу"}</span>
            </div>

            {finishes.length > 0 && (
              <div className="mt-8">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.72em] font-medium uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
                  <span className="text-[0.95em] font-medium">{f?.name}</span>
                </div>
                <div className="mt-4">
                  <Swatches finishes={finishes} active={fi} onPick={setFi} size="lg" />
                </div>
              </div>
            )}

            {p.description && (
              <div className="mt-8">
                <h2 className="text-[0.72em] font-medium uppercase tracking-[0.18em] text-muted-foreground">Описание</h2>
                <p className="mt-3 whitespace-pre-line font-light leading-[1.75] text-foreground/80">{p.description}</p>
              </div>
            )}

            <ul className="mt-8 grid gap-3 text-[0.9em] sm:grid-cols-2">
              {[
                ["Store", "Образцы вживую в шоуруме МЦ Roomer"],
                ["Ruler", "Замер и расчёт под ваши проёмы"],
                ["ShieldCheck", "Официальная гарантия фабрики — 1 год"],
                ["Truck", "Доставка и монтаж по Москве и МО"],
              ].map(([icon, text]) => (
                <li key={text} className="flex items-start gap-3 rounded-[10px] border border-neutral-200 p-4">
                  <Icon name={icon} size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-muted-foreground" fallback="Check" />
                  <span className="leading-snug">{text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5">
              <button onClick={calc} className="btn-pill btn-graphite w-full py-4">
                {orange ? "Рассчитать в MAX" : "Рассчитать эту модель"}
                <Icon name={orange ? "ArrowUpRight" : "ArrowRight"} size={15} strokeWidth={1.8} />
              </button>
              <button
                onClick={() =>
                  openLead({
                    title: "Посмотреть образцы в шоуруме",
                    description: `${title}${f ? `, «${f.name}»` : ""}. Подготовим образец и веер покрытий к вашему визиту в МЦ Roomer.`,
                    source: `Визит в шоурум: ${title}`,
                    button: "Записаться на визит",
                  })
                }
                className="btn-pill btn-outline w-full py-3.5"
              >
                <Icon name="Eye" size={15} /> Записаться на просмотр в шоуруме
              </button>
              {orange && <Consent className="mt-1 text-center" />}
              <p className="mt-2 text-center text-[0.8em] font-light text-muted-foreground">
                Или звоните: <a href={SITE.phoneHref} className="text-foreground hover:underline">{SITE.phone}</a> · {SITE.hours}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 rounded-[12px] bg-[#121316] p-7 text-white sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-[34em] text-[1.05em] font-light leading-relaxed text-white/80">
            Шоурум ProfilDoors в МЦ Roomer: {SITE.addressFull}. Экспозиция из 26 моделей, веера покрытий и образцы фурнитуры.
          </p>
          <Link
            to={orange ? "/orange" : "/"}
            hash={orange ? undefined : "catalog"}
            className="btn-pill btn-light shrink-0"
          >
            <Icon name="ArrowLeft" size={15} /> {orange ? "Вся коллекция Orange" : "Весь каталог"}
          </Link>
        </div>
      </main>
      <Footer />
      <FloatingMessenger />
      <LeadDialog />
      <CalcDialog />
    </div>
  );
};

export default ModelPage;
