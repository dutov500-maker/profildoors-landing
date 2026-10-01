import Reveal from "@/components/Reveal";

const ITEMS = [
  {
    num: "01",
    title: "Большой живой шоурум",
    text: "Секция А149–А151 на 1 этаже. Образцы полотен в полный рост, веера покрытий, скрытые короба в разрезе.",
  },
  {
    num: "02",
    title: "Индивидуальный подбор",
    text: "Раскладка проекта вместе с дизайнером, фурнитура в тон сантехники, ручек и стеновых панелей.",
  },
  {
    num: "03",
    title: "Монтаж без пыли",
    text: "Штатные сертифицированные мастера со специнструментом и промышленными пылесосами.",
  },
  {
    num: "04",
    title: "Точно в срок",
    text: "Прямые поставки с фабрики ProfilDoors в Подмосковье с соблюдением согласованных дат.",
  },
];

const WhyUs = () => (
  <section id="why" className="border-t border-border bg-sand">
    <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <Reveal>
          <span className="eyebrow-chip">Почему МЦ Roomer</span>
          <h2 className="section-title mt-6 max-w-[10em]">Почему выбирают наш салон</h2>
        </Reveal>
        <div className="grid border-t border-neutral-200 sm:grid-cols-2">
          {ITEMS.map((it, i) => (
            <Reveal
              key={it.title}
              delay={i * 70}
              className={`border-b border-neutral-200 py-8 sm:py-10 ${i % 2 === 0 ? "sm:border-r sm:pr-10" : "sm:pl-10"}`}
            >
              <span className="text-[0.78em] font-light text-muted-foreground">{it.num}</span>
              <h3 className="mt-6 text-[1.3em] font-medium tracking-[-0.03em]">{it.title}</h3>
              <p className="mt-3 max-w-[26em] font-light leading-relaxed text-muted-foreground">{it.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyUs;
