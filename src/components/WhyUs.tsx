import Reveal from "@/components/Reveal";

const ITEMS = [
  {
    num: "01",
    title: "Большой живой шоурум",
    text: "Павильон А149–А151 на 1 этаже. Образцы полотен в полный рост, веера покрытий, скрытые короба в разрезе.",
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
        <div className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 70} className="h-full">
              <div className="flex h-full flex-col rounded-[14px] border border-[#E5E7EB] bg-card p-6 transition-colors duration-300 hover:border-[#1A1A1A]/30 sm:p-8">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[#E5E7EB] text-[0.8em] font-medium text-muted-foreground">
                  {it.num}
                </span>
                <h3 className="mt-6 text-[1.25em] font-medium tracking-[-0.03em]">{it.title}</h3>
                <p className="mt-3 font-light leading-relaxed text-muted-foreground">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyUs;