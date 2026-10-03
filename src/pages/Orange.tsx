import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import OrangeQuiz from "@/components/orange/OrangeQuiz";
import OrangeCatalog from "@/components/orange/OrangeCatalog";
import OrangePalette from "@/components/orange/OrangePalette";
import SalonMap from "@/components/SalonMap";
import MetroList from "@/components/MetroList";
import FloatingMessenger from "@/components/FloatingMessenger";
import LeadDialog from "@/components/LeadDialog";
import { callMeasurer } from "@/components/Header";
import { SITE } from "@/lib/site";

const FACTS = ["Полотна до 3000 мм", "Скрытые короба Reverse", "Экспозиция А149–А151"];

const BackLink = ({ className = "" }: { className?: string }) => (
  <Link to="/" className={`inline-flex items-center gap-2 text-[0.88em] transition-colors ${className}`}>
    <Icon name="ArrowLeft" size={15} strokeWidth={1.6} /> Вернуться к основному каталогу ProfilDoors
  </Link>
);

const Orange = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "ProfilDoors Orange 2026 — коллекция в МЦ Roomer";
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1012] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#0F1012]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-[34px]">
          <Link to="/" className="flex flex-col leading-[1.1]">
            <span className="text-[1.05em] font-semibold uppercase tracking-[0.16em]">
              ProfilDoors <span className="text-[#E05A2B]">Orange</span>
            </span>
            <span className="mt-0.5 text-[0.7em] font-light text-white/45">Коллекция 2026 · МЦ Roomer</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[0.88em] text-white/60 lg:flex">
            <a href="#orange-catalog" className="hover:text-white">Модели</a>
            <a href="#orange-palette" className="hover:text-white">Палитра</a>
            <a href="#orange-contacts" className="hover:text-white">Контакты</a>
            <BackLink className="text-white/60 hover:text-white" />
          </nav>
          <div className="flex items-center gap-2">
            <a href={SITE.phoneHref} className="hidden whitespace-nowrap text-[0.88em] text-white/60 hover:text-white sm:inline">
              {SITE.phone}
            </a>
            <button onClick={callMeasurer} className="btn-pill bg-[#E05A2B] px-4 py-2.5 text-[0.86em] text-white hover:bg-[#C94E24]">
              Вызвать замерщика
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-16">
        <img src="/img/orange-hero.webp" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1012] via-[#0F1012]/90 to-[#0F1012]/40" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_minmax(0,500px)] lg:gap-20 lg:px-[34px] lg:py-28">
          <div className="animate-fade-in">
            <BackLink className="text-white/45 hover:text-white lg:hidden" />
            <span className="mt-6 flex w-fit items-center gap-2.5 rounded-full border border-[#E05A2B]/40 px-3 py-1.5 text-[0.72em] font-medium uppercase tracking-[0.2em] text-[#E8A27E] lg:mt-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E05A2B]" /> Новая коллекция 2026
            </span>
            <h1 className="hero-title mt-8 max-w-[12em]">
              ProfilDoors <span className="text-[#E05A2B]">Orange</span> — новая архитектурная коллекция в&nbsp;МЦ&nbsp;Roomer
            </h1>
            <p className="mt-7 max-w-[34em] text-[1.06em] font-light leading-[1.65] text-white/60">
              Высота полотен до 3000 мм, скрытые короба Reverse, шпон благородных пород и бархатистая эмаль. Официальная экспозиция в павильоне А149–А151.
            </p>
            <div className="mt-10 flex flex-col gap-3 min-[480px]:flex-row">
              <a href="#orange-catalog" className="btn-pill bg-white text-[#121316] hover:bg-white/85">
                Смотреть модели <Icon name="ArrowDown" size={15} strokeWidth={1.8} />
              </a>
              <a href="#orange-palette" className="btn-pill btn-ghost-light">
                Палитра текстур
              </a>
            </div>
            <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.08] pt-6 text-[0.86em] font-light text-white/50">
              {FACTS.map((f, i) => (
                <span key={f} className="flex items-center gap-4">
                  {i > 0 && <span className="h-[3px] w-[3px] rounded-full bg-[#E05A2B]" />}
                  {f}
                </span>
              ))}
            </p>
          </div>
          <OrangeQuiz />
        </div>
      </section>

      <div className="text-foreground">
        <OrangeCatalog />
      </div>

      <OrangePalette />

      <section id="orange-contacts" className="bg-[#F8F7F5] text-foreground">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.3fr] lg:gap-16 lg:px-[34px]">
          <Reveal className="flex flex-col">
            <span className="eyebrow-chip text-[#B8522E]">Orange вживую</span>
            <h2 className="section-title mt-6 max-w-[12em]">Смотрите коллекцию в шоуруме Roomer</h2>
            <dl className="mt-10 border-t border-neutral-200">
              {[
                ["Адрес", SITE.addressFull],
                ["Часы", "Ежедневно, 10:00–22:00"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[90px_1fr] gap-4 border-b border-neutral-200 py-4">
                  <dt className="text-[0.86em] font-light text-muted-foreground">{k}</dt>
                  <dd className="tracking-[-0.01em]">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[90px_1fr] gap-4 border-b border-neutral-200 py-4">
                <dt className="text-[0.86em] font-light text-muted-foreground">Метро</dt>
                <dd><MetroList /></dd>
              </div>
              <div className="grid grid-cols-[90px_1fr] gap-4 border-b border-neutral-200 py-4">
                <dt className="text-[0.86em] font-light text-muted-foreground">Телефон</dt>
                <dd>
                  <a href={SITE.phoneHref} className="text-[1.1em] hover:underline">{SITE.phone}</a>
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill bg-[#E05A2B] text-white hover:bg-[#C94E24]">
                Написать в MAX
              </a>
              <button onClick={callMeasurer} className="btn-pill btn-outline">
                Вызвать замерщика
              </button>
              <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                Построить маршрут
              </a>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SalonMap className="h-[380px] sm:h-[480px] lg:h-full lg:min-h-[520px]" />
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] bg-[#0F1012] text-white/50">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-12 pb-28 text-[0.86em] font-light sm:px-6 md:flex-row md:items-center md:justify-between md:pb-12 lg:px-[34px]">
          <div>
            <p className="text-[1.05em] font-semibold uppercase tracking-[0.14em] text-white">
              ProfilDoors <span className="text-[#E05A2B]">Orange</span>
            </p>
            <p className="mt-2">{SITE.addressFull}</p>
            <p className="mt-1">
              <a href={SITE.phoneHref} className="text-white hover:underline">{SITE.phone}</a> · {SITE.hours}
            </p>
          </div>
          <BackLink className="text-white/80 hover:text-white" />
        </div>
      </footer>

      <FloatingMessenger />
      <LeadDialog />
    </div>
  );
};

export default Orange;
