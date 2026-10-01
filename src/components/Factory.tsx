import Reveal from "@/components/Reveal";

const FACTS = [
  { big: "2002", title: "Основание производства", text: "Лидер российского рынка дверей и интерьерных систем." },
  { big: "DE · IT", title: "Немецкие и итальянские технологии", text: "Замкнутый цикл от алюминиевого литья до тончайшей ручной доводки." },
  { big: "4 000 мм", title: "Высота полотен", text: "Нестандартные архитектурные решения в потолок." },
  { big: "42 дБ", title: "Звукоизоляция и EI-30", text: "Сертифицированная противопожарная безопасность в серии FT." },
  { big: "RAL · NCS", title: "Индивидуальная колеровка", text: "Профили и эмали в любом оттенке по палитрам RAL и NCS." },
];

const Factory = () => (
  <section id="factory" className="bg-[#0F1012] text-white">
    <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="eyebrow-chip text-white/45">Фабрика PROFILDOORS</span>
          <h2 className="section-title mt-6 max-w-[15em]">Инновации и масштаб с&nbsp;2002&nbsp;года</h2>
        </div>
        <p className="max-w-[28em] font-light leading-relaxed text-white/55">
          Собственный роботизированный комплекс в Подмосковье. Каждая дверь в нашем салоне — с фабричной гарантией и паспортом изделия.
        </p>
      </Reveal>

      <Reveal delay={80}>
        <div className="relative mt-14 aspect-[16/9] overflow-hidden rounded-[10px] sm:aspect-[21/9]">
          <img
            src="/img/factory.webp"
            alt="Роботизированный производственный комплекс ProfilDoors в Подмосковье"
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1012]/70 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 text-[0.8em] font-light text-white/70 sm:bottom-7 sm:left-7">
            Производственный комплекс ProfilDoors · Московская область
          </p>
        </div>
      </Reveal>

      <div className="mt-3 grid border-t border-white/[0.08] sm:grid-cols-2 lg:grid-cols-5">
        {FACTS.map((f, i) => (
          <Reveal
            key={f.title}
            delay={i * 60}
            className="border-b border-white/[0.08] py-8 sm:pr-6 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
          >
            <p className="text-[1.9em] font-light leading-none tracking-[-0.04em]">{f.big}</p>
            <h3 className="mt-5 text-[0.98em] font-medium tracking-[-0.02em]">{f.title}</h3>
            <p className="mt-2 text-[0.86em] font-light leading-relaxed text-white/50">{f.text}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Factory;
