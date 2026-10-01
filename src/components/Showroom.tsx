import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const TILES = [
  { src: "/img/showroom-entry.webp", cap: "Ресепшн и переговорная зона", sub: "Секция А149–А151", cls: "md:col-span-2 md:row-span-2" },
  { src: "/img/showroom-invisible.webp", cap: "Скрытые двери Invisible", sub: "Полотна до 3000 мм", cls: "" },
  { src: "/img/showroom-hardware.webp", cap: "Фурнитура и замки", sub: "AGB, магнитные замки", cls: "" },
  { src: "/img/showroom-glass.webp", cap: "Стеклянные перегородки AG", sub: "Раздвижные системы", cls: "md:col-span-2" },
];

const GUARANTEE = [
  { icon: "Factory", text: "Собственное производство в Подмосковье" },
  { icon: "ScanLine", text: "Автоматизированный контроль геометрии" },
  { icon: "ShieldCheck", text: "Гарантия 5 лет на полотна и фурнитуру" },
];

const Showroom = () => (
  <section id="showroom" className="section-sand">
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-[34px]">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow-chip">Шоурум в Roomer</span>
          <h2 className="section-title mt-5 max-w-[15em]">
            Самый большой выбор ProfilDoors на юге Москвы: шоурум 150&nbsp;м² в&nbsp;Roomer
          </h2>
        </div>
        <div className="flex max-w-[26em] flex-col gap-4">
          <p className="text-muted-foreground">
            Экспозиция более 60 моделей дверей и перегородок вживую: 1 этаж, секция А149–А151. Ежедневно с 10:00 до 22:00.
          </p>
          <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-dark w-fit">
            <Icon name="Navigation" size={15} /> Как добраться
          </a>
        </div>
      </Reveal>

      <div className="mt-10 grid auto-rows-[220px] gap-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[260px]">
        {TILES.map((t, i) => (
          <Reveal key={t.src} delay={i * 70} className={t.cls}>
            <figure className="group relative h-full overflow-hidden rounded-[16px] bg-secondary shadow-soft">
              <img
                src={t.src}
                alt={t.cap}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <figcaption className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-serif text-[1.5em] font-medium leading-tight">{t.cap}</p>
                <p className="text-[0.82em] text-white/70">{t.sub}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-4 grid gap-6 rounded-[16px] bg-graphite p-6 text-white shadow-lift sm:p-8 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-10 lg:p-10">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-gold">
              <Icon name="BadgeCheck" size={24} />
            </span>
            <h3 className="mt-5 font-serif text-3xl font-medium leading-tight sm:text-4xl">
              Официальная гарантия фабрики ProfilDoors и сертифицированный монтаж
            </h3>
            <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-gold mt-6">
              <Icon name="MessageCircle" size={16} /> Задать вопрос в MAX
            </a>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {GUARANTEE.map((g) => (
              <li key={g.text} className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <Icon name={g.icon} size={22} className="text-gold" fallback="Check" />
                <span className="font-medium leading-snug">{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Showroom;
