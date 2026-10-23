import Icon from "@/components/ui/icon";
import QuizCard from "@/components/QuizCard";
import { SITE, METRO_LINES, openCalc, openCatalogTab } from "@/lib/site";

const FACTS = ["Экспозиция 26 моделей", "Высота полотен до 4 000 мм", "Гарантия 1 год"];

const Hero = () => (
  <div id="top" className="relative isolate overflow-hidden bg-[#0B0C0E] pt-24 text-white">
    <picture>
      <source media="(max-width: 767px)" srcSet="/img/hero-mobile.webp" />
      <img
        src="/img/hero-interior.webp"
        alt=""
        aria-hidden
        {...{ fetchpriority: "high" }}
        className="absolute inset-x-0 top-0 -z-20 h-[680px] w-full object-cover object-top md:inset-0 md:h-full md:object-[70%_50%]"
      />
    </picture>
    <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.85)_100%)] md:block" />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,12,14,0.35)_0px,rgba(11,12,14,0)_110px,rgba(11,12,14,0)_220px,rgba(11,12,14,0.6)_420px,#0B0C0E_680px)] md:hidden" />

    <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 pb-24 pt-[200px] sm:px-6 md:pt-16 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16 lg:px-[34px] lg:pb-32 lg:pt-20 xl:gap-24">
      <section className="flex flex-col justify-center animate-fade-in">
        <a
          href={SITE.routeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/90 backdrop-blur-md transition hover:bg-black/45 md:gap-2.5 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:text-[0.72em] md:tracking-[0.22em] md:text-white/55 md:backdrop-blur-none md:hover:bg-transparent md:hover:text-white/85"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: METRO_LINES[0].color }} />
          МЦ Roomer · Ленинская Слобода, 26
        </a>

        <h1 className="hero-title mt-5 max-w-[12em] text-white md:mt-8">Дверные системы и скрытые решения ProfilDoors</h1>

        <p className="mt-4 max-w-[32em] text-[0.95em] font-light leading-[1.6] text-white/80 md:mt-7 md:text-[1.1em] md:leading-[1.65] md:text-white/70">
          Официальный салон в Москве. Проектирование, комплектация и монтаж скрытых дверей, перегородок и входных групп.
        </p>

        <div className="mt-7 flex flex-col gap-1 min-[480px]:flex-row min-[480px]:gap-3 md:mt-10">
          <button onClick={() => openCalc()} className="btn-pill btn-light">
            Рассчитать проект
            <Icon name="ArrowRight" size={15} strokeWidth={1.8} />
          </button>
          <button
            onClick={() => openCatalogTab("all")}
            className="inline-flex items-center justify-center gap-2 py-3 text-[0.92em] font-medium text-white/85 underline-offset-4 transition hover:text-white hover:underline md:rounded-full md:border md:border-white/[0.14] md:px-6 md:py-3.5 md:no-underline md:hover:border-white/40 md:hover:bg-white/[0.04]"
          >
            Смотреть каталог
            <Icon name="ArrowDown" size={15} strokeWidth={1.8} className="md:hidden" />
          </button>
        </div>

        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.1] pt-5 text-[0.8em] md:mt-12 md:pt-6 md:text-[0.86em] font-light text-white/60">
          {FACTS.map((f, i) => (
            <span key={f} className="flex items-center gap-4">
              {i > 0 && <span className="h-[3px] w-[3px] rounded-full bg-white/35" />}
              {f}
            </span>
          ))}
        </p>
      </section>

      <div className="w-full">
        <QuizCard glass title="Экспресс-расчёт" />
      </div>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-sand lg:h-24" />
  </div>
);

export default Hero;
