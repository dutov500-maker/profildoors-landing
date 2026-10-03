import Icon from "@/components/ui/icon";
import QuizCard from "@/components/QuizCard";
import { SITE, METRO_LINES, openCalc, openCatalogTab } from "@/lib/site";

const FACTS = ["Экспозиция 60+ моделей", "Высота полотен до 4 000 мм", "Гарантия 5 лет"];

const Hero = () => (
  <div id="top" className="relative isolate overflow-hidden bg-[#0B0C0E] pt-24 text-white">
    <img
      src="/img/hero-interior.webp"
      alt=""
      aria-hidden
      fetchPriority="high"
      className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_50%]"
    />
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.6)_0%,rgba(0,0,0,0.85)_100%)]" />

    <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16 lg:px-[34px] lg:pb-32 lg:pt-20 xl:gap-24">
      <section className="flex flex-col justify-center animate-fade-in">
        <a
          href={SITE.routeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2.5 text-[0.72em] font-medium uppercase tracking-[0.22em] text-white/55 transition hover:text-white/85"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: METRO_LINES[0].color }} />
          МЦ Roomer · Ленинская Слобода, 26
        </a>

        <h1 className="hero-title mt-8 max-w-[12em] text-white">Дверные системы и скрытые решения ProfilDoors</h1>

        <p className="mt-7 max-w-[32em] text-[1.1em] font-light leading-[1.65] text-white/70">
          Официальный салон в Москве. Проектирование, комплектация и монтаж скрытых дверей, перегородок и входных групп.
        </p>

        <div className="mt-10 flex flex-col gap-3 min-[480px]:flex-row">
          <button onClick={() => openCalc()} className="btn-pill btn-light">
            Рассчитать проект
            <Icon name="ArrowRight" size={15} strokeWidth={1.8} />
          </button>
          <button onClick={() => openCatalogTab("all")} className="btn-pill btn-ghost-light">
            Смотреть каталог
          </button>
        </div>

        <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.1] pt-6 text-[0.86em] font-light text-white/60">
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
