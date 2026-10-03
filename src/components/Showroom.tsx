import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, openCatalogTab, scrollToId } from "@/lib/site";

type Tile = { src: string; cap: string; sub: string; alt: string; big?: boolean; go: () => void };

const TILES: Tile[] = [
  { src: "/img/roomer-consult.webp", cap: "Зона консультаций и экспозиция", sub: "Павильон А149–А151", alt: "Зона консультаций шоурума ProfilDoors в Roomer", big: true, go: () => scrollToId("contacts") },
  { src: "/img/roomer-bifold.webp", cap: "Складные системы и перегородки", sub: "Bifold, гармошки, раздвижные профили", alt: "Стеклянная складная перегородка-гармошка в белом профиле", go: () => openCatalogTab("alu") },
  { src: "/img/roomer-entry.webp", cap: "Входные двери и Smart-замки", sub: "Биометрия и усиленные короба", alt: "Графитовая входная дверь с умным замком", go: () => openCatalogTab("entry") },
  { src: "/img/roomer-invisible.webp", cap: "Скрытые двери Invisible", sub: "Полотна под покраску и зеркальные системы", alt: "Скрытая зеркальная дверь Invisible", go: () => openCatalogTab("invisible") },
  { src: "/img/roomer-classic.webp", cap: "Классика и дизайнерские серии", sub: "Эмаль, багетные филенки, анодированный алюминий", alt: "Дверь цвета шампань со стеклом и белая классическая дверь", go: () => openCatalogTab("premium") },
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
            Самый большой выбор ProfilDoors на юге Москвы: флагманский шоурум в&nbsp;Roomer
          </h2>
        </div>
        <div className="flex max-w-[26em] flex-col gap-4">
          <p className="font-light leading-relaxed text-muted-foreground">
            Экспозиция более 60 моделей дверей и перегородок вживую. этаж 1, павильон А149–А151. Ежедневно с 10:00 до 22:00.
          </p>
          <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-outline w-fit">
            <Icon name="Navigation" size={15} /> Как добраться
          </a>
        </div>
      </Reveal>

      <div className="-mx-4 mt-14 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-4 md:grid-rows-[300px_300px] md:overflow-visible md:px-0 md:pb-0 lg:grid-rows-[320px_320px] [&::-webkit-scrollbar]:hidden">
        {TILES.map((t, i) => (
          <Reveal
            key={t.src}
            delay={i * 70}
            className={`w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto ${t.big ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <button
              type="button"
              onClick={t.go}
              aria-label={t.cap}
              className="group relative block h-[420px] w-full overflow-hidden rounded-[16px] bg-secondary text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 md:h-full"
            >
              <img
                src={t.src}
                alt={t.alt}
                loading="lazy"
                className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] ${t.big ? "object-[50%_45%]" : ""}`}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7),transparent_55%)] transition-colors duration-500 group-hover:bg-black/15" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 text-white sm:p-6">
                <div>
                  <p className={`font-medium tracking-[-0.02em] ${t.big ? "text-[1.35em] sm:text-[1.6em]" : "text-[1.05em]"}`}>{t.cap}</p>
                  <p className="mt-1 text-[0.82em] font-light text-white/75">{t.sub}</p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <Icon name="ArrowUpRight" size={16} />
                </span>
              </div>
            </button>
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