import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";

const ITEMS = [
  {
    icon: "DoorOpen",
    num: "А149–А151",
    title: "Большой живой шоурум",
    text: "Секция на 1 этаже. Образцы полотен в полный рост, веера покрытий, скрытые короба в разрезе.",
    dark: true,
  },
  {
    icon: "Coffee",
    num: "1 : 1",
    title: "Индивидуальный подбор",
    text: "Чай или кофе, раскладка проекта с дизайнером, фурнитура под цвет сантехники и ручек.",
  },
  {
    icon: "ShieldCheck",
    num: "0 пыли",
    title: "Честный монтаж без сюрпризов",
    text: "Собственные штатные монтажники со специнструментом и пылесосами, а не случайные мастера с биржи.",
  },
  {
    icon: "CalendarCheck",
    num: "С завода",
    title: "Точно в срок",
    text: "Прямые поставки с завода ProfilDoors с соблюдением оговоренных дат.",
  },
];

const WhyUs = () => (
  <section id="why" className="section-sand">
    <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-[34px]">
    <Reveal>
      <span className="eyebrow-chip">Почему МЦ Roomer</span>
      <h2 className="section-title mt-4 max-w-[18em]">Почему выбирают именно наш салон</h2>
    </Reveal>
    <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[auto_auto]">
      {ITEMS.map((it, i) => (
        <Reveal
          key={it.title}
          delay={i * 80}
          className={i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : i === 1 ? "lg:col-span-2" : ""}
        >
          <div
            className={`relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-[16px] p-6 sm:p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift ${
              it.dark ? "bg-graphite text-white min-h-[280px] lg:min-h-[400px]" : "bg-card min-h-[220px]"
            }`}
          >
            {it.dark && (
              <div className="pointer-events-none absolute -right-10 top-8 h-[120%] w-1/2 opacity-80" aria-hidden>
                <div className="absolute right-[30%] top-0 h-full w-[54%] rounded-sm border border-white/15 bg-gradient-to-b from-white/[0.07] to-transparent" />
                <div className="absolute right-[34%] top-[46%] h-2 w-2 rounded-full bg-gold shadow-[0_0_24px_6px_hsl(var(--gold)/0.45)]" />
              </div>
            )}
            <div className="relative flex items-center justify-between">
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${
                  it.dark ? "bg-white/10 text-gold" : "bg-sand text-foreground"
                }`}
              >
                <Icon name={it.icon} size={20} />
              </span>
              <span className={`text-[0.82em] font-medium ${it.dark ? "text-white/60" : "text-muted-foreground"}`}>
                0{i + 1}
              </span>
            </div>
            <div className="relative">
              <p className={`font-serif font-medium tracking-[-0.01em] ${it.dark ? "text-6xl sm:text-7xl text-gold" : "text-4xl"}`}>
                {it.num}
              </p>
              <h3 className={`mt-3 font-semibold tracking-[-0.02em] ${it.dark ? "text-2xl" : "text-lg"}`}>{it.title}</h3>
              <p className={`mt-2 max-w-[28em] leading-relaxed ${it.dark ? "text-white/70" : "text-muted-foreground"}`}>
                {it.text}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
    </div>
  </section>
);

export default WhyUs;
