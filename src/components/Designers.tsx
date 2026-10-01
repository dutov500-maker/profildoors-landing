import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const TERMS = [
  { title: "Закрепление проектов", text: "Ваш клиент закреплён за вами с первого визита." },
  { title: "Персональные условия", text: "Индивидуальные скидки и бонусы на каждый объект." },
  { title: "Образцы на вынос", text: "Каталоги, веера эмали и образцы покрытий на объект." },
  { title: "Переговорная в салоне", text: "Спокойная зона для встреч с заказчиком в Roomer." },
];

const Designers = () => (
  <section id="b2b" className="bg-[#0F1012] text-white">
    <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <Reveal className="flex flex-col justify-between gap-10">
          <div>
            <span className="eyebrow-chip text-white/45">Дизайнерам и архитекторам</span>
            <h2 className="section-title mt-6 max-w-[13em]">Комплектация дизайн-проектов на партнёрских условиях</h2>
            <p className="mt-6 max-w-[30em] font-light leading-relaxed text-white/55">
              Подберём двери, перегородки и фурнитуру под весь объект, подготовим спецификацию и проведём монтаж штатной бригадой фабрики.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center">
            <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-light">
              Получить партнёрский прайс в MAX
            </a>
            <span className="text-[0.84em] font-light text-white/40">Ответим в течение часа</span>
          </div>
        </Reveal>
        <div className="grid border-t border-white/[0.08] sm:grid-cols-2">
          {TERMS.map((t, i) => (
            <Reveal
              key={t.title}
              delay={i * 70}
              className={`border-b border-white/[0.08] py-8 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}
            >
              <span className="text-[0.78em] font-light text-white/35">0{i + 1}</span>
              <h3 className="mt-5 text-[1.12em] font-medium tracking-[-0.025em]">{t.title}</h3>
              <p className="mt-2 font-light leading-relaxed text-white/50">{t.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Designers;
