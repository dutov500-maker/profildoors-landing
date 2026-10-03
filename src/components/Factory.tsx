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
        <figure className="mt-14">
          <div className="relative aspect-[1116/469] overflow-hidden rounded-[14px] ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8),0_0_60px_-10px_rgba(224,90,43,0.18)]">
            <img
              src="/img/profildoors-factory-aerial.webp"
              alt="Аэроснимок производственного комплекса ProfilDoors в Кубинке, Московская область"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1012]/35 via-transparent to-transparent" />
          </div>
          <figcaption className="mt-4 text-[0.82em] font-light text-white/60">
            Производственный комплекс ProfilDoors — Кубинка, Московская область
          </figcaption>
        </figure>
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