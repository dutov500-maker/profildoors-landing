import Icon from "@/components/ui/icon";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";
import { callMeasurer } from "@/components/Header";

const MAP_SRC =
  "https://yandex.ru/map-widget/v1/?ll=37.654283%2C55.709806&z=16&pt=37.654283%2C55.709806%2Cpm2dgl&l=map";

const ROUTE = [
  { icon: "TrainFront", text: "Метро Автозаводская — пара минут пешком" },
  { icon: "MapPin", text: "г. Москва, ул. Ленинская Слобода, 26, МЦ Roomer" },
  { icon: "DoorOpen", text: "1 этаж, секция А149–А151" },
];

const Contacts = () => (
  <section id="contacts" className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-[34px]">
    <Reveal>
      <span className="eyebrow-chip">Шоурум на Автозаводской</span>
      <h2 className="section-title mt-4 max-w-[16em]">Приезжайте выбирать двери вживую</h2>
    </Reveal>

    <div className="mt-8 grid gap-3 sm:gap-4 lg:grid-cols-[1fr_420px]">
      <Reveal className="order-2 lg:order-1">
        <div className="relative h-[340px] overflow-hidden rounded-[22px] border border-border bg-secondary sm:h-[460px] lg:h-full lg:min-h-[520px]">
          <iframe
            title="МЦ Roomer на карте"
            src={MAP_SRC}
            className="absolute inset-0 h-full w-full grayscale-[0.6]"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </Reveal>

      <div className="order-1 flex flex-col gap-3 sm:gap-4 lg:order-2">
        <Reveal>
          <div className="rounded-[22px] bg-secondary p-6">
            <p className="text-[0.72em] font-medium uppercase tracking-[0.06em] text-muted-foreground">Как добраться</p>
            <ul className="mt-4 flex flex-col gap-3.5">
              {ROUTE.map((r) => (
                <li key={r.text} className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-card">
                    <Icon name={r.icon} size={17} fallback="MapPin" />
                  </span>
                  <span className="pt-1.5 leading-snug">{r.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-2xl border border-gold/40 bg-card p-4 text-[0.9em] leading-relaxed">
              <p className="mb-1 flex items-center gap-1.5 font-semibold">
                <Icon name="Footprints" size={15} className="text-gold" fallback="Navigation" /> Как быстро пройти в салон
              </p>
              1 этаж, центральный вход со стороны ул. Ленинская Слобода, двигайтесь прямо по линии А до секции А149–А151 (напротив эскалатора).
            </div>
            <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-outline mt-4 w-full">
              <Icon name="Navigation" size={15} /> Построить маршрут
            </a>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-secondary p-5">
              <p className="text-[0.72em] font-medium uppercase tracking-[0.06em] text-muted-foreground">Часы работы</p>
              <p className="mt-1 font-display text-2xl font-semibold tracking-tight">10:00–22:00</p>
              <p className="text-[0.86em] text-muted-foreground">Ежедневно</p>
            </div>
            <a href={SITE.phoneHref} className="rounded-2xl bg-secondary p-5 transition-colors hover:bg-secondary/60">
              <p className="text-[0.72em] font-medium uppercase tracking-[0.06em] text-muted-foreground">Менеджер</p>
              <p className="mt-1 whitespace-nowrap font-display text-[1.05em] font-semibold leading-tight tracking-tight sm:text-lg">{SITE.phone}</p>
              <p className="text-[0.86em] text-muted-foreground">Позвонить</p>
            </a>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="flex flex-col gap-2.5 rounded-[22px] border border-border p-5">
            <div className="grid grid-cols-2 gap-2.5">
              <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill bg-messenger text-white hover:opacity-90">
                <Icon name="MessageCircle" size={16} /> Написать в MAX
              </a>
              <a href={SITE.vk} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                <Icon name="Users" size={16} /> Группа VK
              </a>
            </div>
            <button onClick={callMeasurer} className="btn-pill btn-dark">
              <Icon name="Ruler" size={16} /> Вызвать замерщика бесплатно
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Contacts;
