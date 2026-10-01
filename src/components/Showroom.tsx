import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const PHOTOS = [
  { src: "/img/showroom-entry.webp", cap: "Входная зона и переговорный стол, секция А149–А151" },
  { src: "/img/showroom-invisible.webp", cap: "Скрытые двери Invisible и полотна в потолок" },
  { src: "/img/showroom-glass.webp", cap: "Стеклянные перегородки и фурнитура" },
];

const GUARANTEE = [
  { icon: "Factory", text: "Собственное производство в Подмосковье" },
  { icon: "ScanLine", text: "Автоматизированный контроль геометрии" },
  { icon: "ShieldCheck", text: "Гарантия 5 лет на полотна и фурнитуру" },
];

const Showroom = () => (
  <section id="showroom" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-[34px]">
    <Reveal className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="eyebrow-chip">О шоуруме в Roomer</span>
        <h2 className="section-title mt-4 max-w-[16em]">Живая экспозиция на 1 этаже МЦ Roomer</h2>
      </div>
      <div className="flex max-w-[30em] items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4">
        <Icon name="Sparkles" size={18} className="mt-0.5 shrink-0 text-gold" />
        <p className="text-[0.92em] font-medium leading-snug">
          Экспозиция более 60 моделей дверей и перегородок вживую в ТЦ Roomer (1 этаж, секция А149–А151)
        </p>
      </div>
    </Reveal>

    <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-[1.4fr_1fr] md:grid-rows-2">
      {PHOTOS.map((p, i) => (
        <Reveal key={p.src} delay={i * 80} className={i === 0 ? "md:row-span-2" : ""}>
          <figure className={`group relative overflow-hidden rounded-[22px] bg-secondary ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full" : "aspect-[16/10]"}`}>
            <img src={p.src} alt={p.cap} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <figcaption className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/90 px-3 py-2 text-[0.84em] font-medium backdrop-blur">
              {p.cap}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>

    <Reveal delay={120}>
      <div className="mt-4 grid gap-6 rounded-[22px] bg-primary p-6 text-primary-foreground sm:p-8 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-10 lg:p-10">
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary-foreground/10 text-gold">
            <Icon name="BadgeCheck" size={24} />
          </span>
          <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
            Официальная гарантия фабрики ProfilDoors и сертифицированный монтаж
          </h3>
          <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill mt-6 bg-messenger text-white hover:opacity-90">
            <Icon name="MessageCircle" size={16} /> Задать вопрос в MAX
          </a>
        </div>
        <ul className="grid gap-3 sm:grid-cols-3">
          {GUARANTEE.map((g) => (
            <li key={g.text} className="flex flex-col gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-5">
              <Icon name={g.icon} size={22} className="text-gold" fallback="Check" />
              <span className="font-medium leading-snug">{g.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  </section>
);

export default Showroom;
