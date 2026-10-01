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
    <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow-chip">Шоурум в Roomer</span>
          <h2 className="section-title mt-6 max-w-[17em]">
            Самый большой выбор ProfilDoors на юге Москвы: шоурум 150&nbsp;м² в&nbsp;Roomer
          </h2>
        </div>
        <div className="flex max-w-[26em] flex-col gap-4">
          <p className="font-light leading-relaxed text-muted-foreground">
            Экспозиция более 60 моделей дверей и перегородок вживую: 1 этаж, секция А149–А151. Ежедневно с 10:00 до 22:00.
          </p>
          <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-outline w-fit">
            <Icon name="Navigation" size={15} /> Как добраться
          </a>
        </div>
      </Reveal>

      <div className="mt-14 grid auto-rows-[240px] gap-3 md:grid-cols-4 md:auto-rows-[260px]">
        {TILES.map((t, i) => (
          <Reveal key={t.src} delay={i * 70} className={t.cls}>
            <figure className="group relative h-full overflow-hidden rounded-[10px] bg-secondary">
              <img
                src={t.src}
                alt={t.cap}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <figcaption className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[1.05em] font-medium tracking-[-0.02em]">{t.cap}</p>
                <p className="mt-0.5 text-[0.8em] font-light text-white/65">{t.sub}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-3 grid gap-8 rounded-[10px] border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-14 lg:p-12">
          <div>
            <span className="eyebrow-chip">Гарантия фабрики</span>
            <h3 className="mt-5 text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-[2rem]">
              Официальная гарантия фабрики ProfilDoors и сертифицированный монтаж
            </h3>
            <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-outline mt-8">
              Задать вопрос в MAX
            </a>
          </div>
          <ul className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {GUARANTEE.map((g) => (
              <li key={g.text} className="flex flex-col gap-5 py-5 sm:px-6 sm:py-2 sm:first:pl-0">
                <Icon name={g.icon} size={20} strokeWidth={1.4} className="text-muted-foreground" fallback="Check" />
                <span className="leading-snug tracking-[-0.01em]">{g.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Showroom;
