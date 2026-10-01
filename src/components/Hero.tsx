import Icon from "@/components/ui/icon";
import QuizCard from "@/components/QuizCard";
import { SITE, scrollToId } from "@/lib/site";

const FACTS = ["Экспозиция в Roomer", "Высота до 3 метров", "Гарантия 5 лет"];

const Hero = () => (
  <div id="top" className="relative bg-[#0F1012] pt-24 text-white">
    <div className="relative mx-auto grid max-w-[1440px] items-stretch gap-14 px-4 pb-24 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1fr_minmax(0,560px)] lg:gap-20 lg:px-[34px] lg:pb-32 lg:pt-20 xl:gap-28">
      <section className="flex flex-col justify-center py-2 animate-fade-in lg:py-10">
        <a
          href={SITE.routeUrl}
          target="_blank"
          rel="noreferrer"
          className="w-fit text-[0.72em] font-medium uppercase tracking-[0.22em] text-white/45 transition hover:text-white/80"
        >
          МЦ Roomer · Ленинская Слобода, 26
        </a>

        <h1 className="hero-title mt-8 max-w-[12em] text-white">Дверные системы и скрытые решения ProfilDoors</h1>

        <p className="mt-7 max-w-[30em] text-[1.1em] font-light leading-[1.65] text-white/55">
          Официальный шоурум в МЦ Roomer. Проектирование, комплектация и фабричный монтаж под ключ.
        </p>

        <div className="mt-10 flex flex-col gap-3 min-[480px]:flex-row">
          <button onClick={() => scrollToId("catalog")} className="btn-pill btn-light">
            Подобрать двери в салоне
            <Icon name="ArrowRight" size={15} strokeWidth={1.8} />
          </button>
          <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-ghost-light">
            Написать в MAX
          </a>
        </div>

        <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.08] pt-6 text-[0.86em] font-light text-white/50">
          {FACTS.map((f, i) => (
            <span key={f} className="flex items-center gap-4">
              {i > 0 && <span className="h-[3px] w-[3px] rounded-full bg-white/30" />}
              {f}
            </span>
          ))}
        </p>
      </section>

      <div className="relative overflow-hidden rounded-[14px]">
        <img
          src="/img/hero-invisible.webp"
          alt="Скрытая дверь ProfilDoors в интерьере с деревянными панелями"
          className="absolute inset-0 h-full w-full object-cover grayscale-[35%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1012]/85 via-[#0F1012]/20 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-3 pt-40 sm:p-8 sm:pt-56 lg:pt-8">
          <div className="w-full lg:mt-auto">
            <QuizCard glass />
          </div>
        </div>
      </div>
    </div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 lg:h-24 bg-gradient-to-b from-transparent to-sand" />
  </div>
);

export default Hero;
