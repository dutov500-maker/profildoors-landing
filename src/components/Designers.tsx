import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

const TERMS = [
  { icon: "Lock", title: "Закрепление проектов", text: "Ваш клиент закреплён за вами с первого визита." },
  { icon: "BadgePercent", title: "Персональные скидки и бонусы", text: "Индивидуальные условия на каждый объект." },
  { icon: "Layers", title: "Образцы на вынос", text: "Каталоги, веера эмали и образцы шпона на объект." },
  { icon: "Armchair", title: "Переговорная в салоне", text: "Удобная зона для встреч с заказчиком." },
];

const Designers = () => (
  <section id="b2b" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-[34px]">
    <div className="grid gap-4 overflow-hidden rounded-[28px] bg-primary p-6 text-primary-foreground sm:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:p-14">
      <Reveal className="flex flex-col justify-between gap-8">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-foreground/10 px-2.5 py-1 text-[0.84em] font-medium">
            <Icon name="PenTool" size={13} className="text-gold" />
            Дизайнерам, архитекторам и прорабам
          </span>
          <h2 className="section-title mt-5 max-w-[14em]">Комплектация дизайн-проектов на специальных условиях</h2>
          <p className="mt-4 max-w-[30em] text-primary-foreground/70">
            Подберём двери, перегородки и фурнитуру под весь объект, просчитаем спецификацию и проведём монтаж силами штатной бригады.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center">
          <a
            href={SITE.max}
            target="_blank"
            rel="noreferrer"
            className="btn-pill bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <Icon name="MessageCircle" size={16} className="text-messenger" />
            Получить партнёрский прайс в MAX
          </a>
          <span className="text-[0.86em] text-primary-foreground/60">Ответим в течение часа</span>
        </div>
      </Reveal>
      <div className="grid gap-3 sm:grid-cols-2">
        {TERMS.map((t, i) => (
          <Reveal key={t.title} delay={i * 80}>
            <div className="flex h-full flex-col gap-6 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-5 transition-colors hover:bg-primary-foreground/[0.08]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/10 text-gold">
                <Icon name={t.icon} size={19} />
              </span>
              <div>
                <h3 className="font-semibold tracking-[-0.01em]">{t.title}</h3>
                <p className="mt-1.5 text-[0.9em] text-primary-foreground/60">{t.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Designers;
