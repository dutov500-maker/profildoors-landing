import Icon from "@/components/ui/icon";
import QuizCard from "@/components/QuizCard";
import { SITE, scrollToId } from "@/lib/site";

const TRUST = [
  { icon: "ShieldCheck", text: "Гарантия 5 лет" },
  { icon: "Sparkles", text: "Монтаж без пыли" },
  { icon: "Ruler", text: "Замер по Москве" },
];

const STATS = [
  { big: "60+", sub: "моделей в экспозиции" },
  { big: "3000", sub: "мм — высота полотна" },
  { big: "150", sub: "м² шоурума в Roomer" },
];

const Hero = () => (
  <div id="top" className="relative overflow-hidden bg-graphite pt-24 text-white">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_15%_20%,rgba(176,141,87,0.18),transparent_60%)]" />
    <div className="relative mx-auto grid max-w-[1440px] gap-10 px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:grid-cols-2 lg:gap-8 lg:px-[34px] lg:pb-20">
      <section className="flex flex-col justify-center gap-7 animate-fade-in">
        <a
          href={SITE.routeUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[0.8em] text-white/75 backdrop-blur transition hover:border-white/40"
        >
          <Icon name="MapPin" size={13} className="text-gold" />
          Ленинская Слобода, 26 · 1 этаж, А149–А151
        </a>

        <h1 className="hero-title max-w-[11em]">
          Премиальные двери и&nbsp;перегородки <span className="italic text-gold">ProfilDoors</span> в&nbsp;МЦ&nbsp;Roomer
        </h1>

        <p className="max-w-[32em] text-[1.08em] leading-[1.6] text-white/70">
          Флагманский салон фабрики. Экспозиция более 60 моделей, скрытые двери в потолок и новая коллекция{" "}
          <span className="font-medium text-orange">ProfilDoors Orange</span>.
        </p>

        <div className="flex flex-col gap-3 min-[480px]:flex-row">
          <button onClick={() => scrollToId("catalog")} className="btn-pill btn-gold">
            Подобрать двери в салоне
            <Icon name="ArrowRight" size={15} strokeWidth={2.2} />
          </button>
          <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-ghost-light">
            <Icon name="MessageCircle" size={15} /> Написать в MAX
          </a>
        </div>

        <ul className="flex flex-wrap gap-2.5">
          {TRUST.map((t) => (
            <li key={t.text} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[0.85em] text-white/85">
              <Icon name={t.icon} size={15} className="text-gold" />
              {t.text}
            </li>
          ))}
        </ul>

        <div className="mt-2 grid max-w-[520px] grid-cols-3 border-t border-white/10 pt-6">
          {STATS.map((s, i) => (
            <div key={s.big} className={i > 0 ? "border-l border-white/10 pl-4 sm:pl-6" : ""}>
              <p className="font-serif text-[2.1em] font-medium leading-none text-white sm:text-[2.6em]">{s.big}</p>
              <p className="mt-1.5 text-[0.78em] leading-snug text-white/50">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="relative min-h-[620px] overflow-hidden rounded-[16px] shadow-glass lg:min-h-[720px]">
        <img
          src="/img/hero-invisible.webp"
          alt="Скрытая дверь ProfilDoors в интерьере с деревянными панелями"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[0.75em] text-white/85 backdrop-blur sm:left-6 sm:top-6">
          <Icon name="Eye" size={12} className="text-gold" /> Invisible в потолок — в экспозиции Roomer
        </span>
        <div className="relative flex h-full items-end p-3 pt-20 sm:p-6 sm:pt-24">
          <div className="w-full">
            <QuizCard glass />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Hero;
