import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE, routeLink } from "@/lib/site";
import { callMeasurer } from "@/components/Header";

const MAP_SRC = `https://yandex.ru/map-widget/v1/?ll=${SITE.lon}%2C${SITE.lat}&z=16&l=map&theme=light&lang=ru_RU`;
const MAP_OPEN = `https://yandex.ru/maps/?ll=${SITE.lon}%2C${SITE.lat}&z=17&pt=${SITE.lon},${SITE.lat},pm2blackm`;

const INFO = [
  { k: "Салон", v: "Официальный салон ProfilDoors, МЦ Roomer, 1 этаж, секция А149–А151" },
  { k: "Адрес", v: "г. Москва, ул. Ленинская Слобода, 26" },
  { k: "Метро", v: "Автозаводская — 2 минуты пешком" },
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
          <div className="relative h-[360px] overflow-hidden rounded-[10px] border border-neutral-200 bg-secondary sm:h-[480px] lg:h-full lg:min-h-[560px]">
            <iframe
              title="МЦ Roomer на карте"
              src={MAP_SRC}
              className="pointer-events-none absolute inset-0 h-full w-full [filter:saturate(1.35)_contrast(1.05)]"
              loading="lazy"
              tabIndex={-1}
            />
            <a
              href={MAP_OPEN}
              target="_blank"
              rel="noreferrer"
              aria-label="Открыть МЦ Roomer в Яндекс Картах"
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
              <div className="mb-2 whitespace-nowrap rounded-[10px] border border-[#E05A2B]/60 bg-[#121316] px-3.5 py-2 text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]">
                <p className="text-[0.62em] font-medium uppercase tracking-[0.2em] text-[#E8A27E]">ProfilDoors</p>
                <p className="text-[0.82em] font-medium tracking-[-0.01em]">МЦ Roomer · А149–А151</p>
              </div>
              <span className="relative grid h-11 w-11 place-items-center rounded-full rounded-br-none border-2 border-[#E05A2B] bg-[#121316] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] [transform:rotate(45deg)]">
                <span className="text-[0.9em] font-bold text-white [transform:rotate(-45deg)]">P</span>
              </span>
              <span className="mt-1 h-2 w-5 rounded-full bg-black/25 blur-[2px]" />
            </div>
            <a
              href={MAP_OPEN}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[0.82em] font-medium shadow-sm transition hover:bg-neutral-50"
            >
              <Icon name="Maximize2" size={13} strokeWidth={1.8} /> Открыть в Яндекс Картах
            </a>
          </div>
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
                1 этаж, центральный вход со стороны ул. Ленинская Слобода, двигайтесь прямо по линии А до секции А149–А151 (напротив эскалатора).
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-8 flex flex-col gap-2.5">
              <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-dark">
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