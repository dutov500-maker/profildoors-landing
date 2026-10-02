import Icon from "@/components/ui/icon";
import { SITE } from "@/lib/site";

const MAP_OPEN = `https://yandex.ru/maps/?ll=${SITE.lon}%2C${SITE.lat}&z=17&pt=${SITE.lon},${SITE.lat},pm2blm`;

const SalonMap = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-[10px] border border-neutral-200 bg-[#f2efe9] ${className}`}>
    <a href={MAP_OPEN} target="_blank" rel="noreferrer" aria-label="Открыть салон в Яндекс Картах" className="absolute inset-0">
      <img
        src="/img/map-roomer.webp"
        alt="Карта: МЦ Roomer, ул. Ленинская Слобода, 26, м. Автозаводская"
        loading="lazy"
        className="h-full w-full object-cover object-center"
      />
    </a>

    <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
      <div className="mb-2 whitespace-nowrap rounded-[10px] border border-[#E05A2B]/70 bg-[#121316] px-3.5 py-2 text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]">
        <p className="text-[0.6em] font-medium uppercase tracking-[0.2em] text-[#E8A27E]">ProfilDoors</p>
        <p className="text-[0.8em] font-medium tracking-[-0.01em]">МЦ Roomer · А149–А151</p>
      </div>
      <span className="grid h-11 w-11 place-items-center rounded-full rounded-br-none border-2 border-[#E05A2B] bg-[#121316] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] [transform:rotate(45deg)]">
        <span className="text-[0.9em] font-bold text-white [transform:rotate(-45deg)]">P</span>
      </span>
    </div>
    <span className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30 blur-[2px]" />

    <a
      href={SITE.routeUrl}
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#121316] px-4 py-2.5 text-[0.82em] font-medium text-white shadow-md transition hover:bg-black"
    >
      <Icon name="Navigation" size={13} strokeWidth={1.8} /> Построить маршрут
    </a>
  </div>
);

export default SalonMap;
