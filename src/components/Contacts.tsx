import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, routeLink } from "@/lib/site";
import { callMeasurer } from "@/components/Header";
import SalonMap from "@/components/SalonMap";
import MetroList from "@/components/MetroList";


const INFO = [
  { k: "Адрес", v: SITE.addressFull },
  { k: "Часы работы", v: "Ежедневно, 10:00–22:00" },
];

const Contacts = () => (
  <section id="contacts" className="border-t border-border bg-sand">
    <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 sm:py-28 lg:px-[34px]">
      <Reveal>
        <span className="eyebrow-chip">Шоурум на Автозаводской</span>
        <h2 className="section-title mt-6 max-w-[14em]">Приезжайте выбирать двери вживую</h2>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <SalonMap className="h-[360px] sm:h-[480px] lg:h-full lg:min-h-[560px]" />
        </Reveal>

        <div className="order-1 flex flex-col lg:order-2">
          <Reveal>
            <dl className="border-t border-neutral-200">
              {INFO.map((r) => (
                <div key={r.k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-200 py-4 sm:grid-cols-[140px_1fr]">
                  <dt className="text-[0.86em] font-light text-muted-foreground">{r.k}</dt>
                  <dd className="tracking-[-0.01em]">{r.v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-200 py-4 sm:grid-cols-[140px_1fr]">
                <dt className="text-[0.86em] font-light text-muted-foreground">Метро</dt>
                <dd><MetroList /></dd>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-200 py-4 sm:grid-cols-[140px_1fr]">
                <dt className="text-[0.86em] font-light text-muted-foreground">Телефон</dt>
                <dd>
                  <a href={SITE.phoneHref} className="text-[1.15em] tracking-[-0.02em] hover:underline">
                    {SITE.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-8">
              <p className="text-[0.72em] font-medium uppercase tracking-[0.22em] text-muted-foreground">Как быстро пройти в салон</p>
              <p className="mt-3 font-light leading-relaxed text-foreground/80">
                1 этаж, центральный вход со стороны ул. Ленинская Слобода, двигайтесь прямо по линии А до павильона А149–А151 (напротив эскалатора).
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-8 flex flex-col gap-2.5">
              <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-graphite">
                <Icon name="Navigation" size={15} strokeWidth={1.6} /> Построить маршрут
              </a>
              <a href={routeLink("pd", true)} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                <Icon name="Footprints" size={15} strokeWidth={1.6} fallback="Navigation" /> Пешком от метро
              </a>
              <p className="text-center text-[0.78em] font-light text-muted-foreground">Конечная точка: {SITE.routeTarget}</p>
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                  Написать в MAX
                </a>
                <a href={SITE.vk} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                  Группа VK
                </a>
              </div>
              <button onClick={callMeasurer} className="btn-pill btn-outline">
                Вызвать замерщика бесплатно
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default Contacts;