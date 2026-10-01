import Icon from "@/components/ui/icon";
import QuizCard from "@/components/QuizCard";
import { SITE, scrollToId } from "@/lib/site";

const TILES = [
  { cap: "Гарантия", big: "5 лет", sub: "Полотна и фурнитура" },
  { cap: "Высота полотна", big: "3000 мм", sub: "Скрытый короб" },
  { cap: "Шоурум", big: "10–22", sub: "Ежедневно" },
];

const CHIPS = ["Эмаль", "Шпон", "Алюминий", "Стекло", "Условия для дизайнеров"];

const Hero = () => {
  return (
    <div id="top" className="mx-auto max-w-[1440px] px-4 pt-16 sm:px-6 lg:px-[34px]">
      <main className="grid gap-x-[26px] gap-y-[22px] pb-[34px] pt-6 sm:pt-9 lg:min-h-[min(calc(100svh-64px),760px)] lg:grid-cols-[1fr_540px] lg:grid-rows-[1fr_auto] lg:[grid-template-areas:'text_quiz'_'cta_quiz']">
        <section className="flex flex-col items-start gap-5 lg:self-end lg:[grid-area:text] animate-fade-in">
          <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="eyebrow-chip hover:bg-secondary/70">
            Ленинская Слобода, 26 · 1 этаж, А149–А151
            <Icon name="ArrowRight" size={12} strokeWidth={2.4} />
          </a>
          <h1 className="hero-title max-w-[14em]">Официальный салон ProfilDoors в&nbsp;МЦ&nbsp;Roomer</h1>
          <p className="max-w-[30em] text-[1.15em] leading-[1.5] text-foreground">
            Двери премиум-класса с установкой под ключ. 60+ моделей вживую, смета за 10 минут.
          </p>
          <button
            onClick={() => scrollToId("showroom")}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-1.5 pr-4 text-left transition hover:border-foreground/30"
          >
            <img src="/img/showroom-entry.webp" alt="Шоурум ProfilDoors в МЦ Roomer" className="h-14 w-20 rounded-xl object-cover" />
            <span className="text-[0.86em] leading-snug">
              <span className="block font-medium">Более 60 моделей вживую</span>
              <span className="text-muted-foreground">1 этаж, секция А149–А151</span>
            </span>
            <Icon name="ArrowRight" size={14} className="ml-1 text-muted-foreground transition group-hover:translate-x-0.5" />
          </button>
        </section>

        <div className="lg:[grid-area:quiz] lg:min-h-0">
          <QuizCard />
        </div>

        <section className="flex flex-col gap-[18px] lg:[grid-area:cta] animate-fade-in [animation-delay:120ms]">
          <div className="flex flex-col gap-2.5 min-[480px]:flex-row">
            <button onClick={() => scrollToId("calc")} className="btn-pill btn-dark">
              Рассчитать стоимость дверей
              <Icon name="ArrowRight" size={14} strokeWidth={2.4} />
            </button>
            <a
              href={SITE.max}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-outline"
            >
              <Icon name="MessageCircle" size={15} className="text-messenger" />
              Написать в MAX
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {TILES.map((t) => (
              <div key={t.cap} className="flex flex-col gap-[3px] rounded-2xl bg-secondary px-3 py-3 sm:px-4 sm:py-3.5">
                <span className="text-[0.66em] font-medium uppercase tracking-[0.06em] text-muted-foreground sm:text-[0.72em]">{t.cap}</span>
                <span className="font-display text-[1.15em] font-semibold tracking-[-0.02em] sm:text-[1.35em]">{t.big}</span>
                <span className="text-[0.8em] text-muted-foreground sm:text-[0.86em]">{t.sub}</span>
              </div>
            ))}
          </div>
          <ul className="flex flex-wrap items-center gap-2">
            {CHIPS.map((c, i) => (
              <li
                key={c}
                className={`rounded-full px-[11px] py-1 text-[0.82em] font-medium ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                {c}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Hero;