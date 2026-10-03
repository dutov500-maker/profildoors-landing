import Icon from "@/components/ui/icon";
import { SITE, ADDRESS_QUERY } from "@/lib/site";

const MAP_SRC = `https://yandex.ru/map-widget/v1/?ll=${SITE.lon}%2C${SITE.lat}&z=17&mode=search&text=${ADDRESS_QUERY}`;

const SalonMap = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-[10px] border border-neutral-200 bg-[#f2efe9] ${className}`}>
    <iframe
      src={MAP_SRC}
      title="ProfilDoors в МЦ Roomer на Яндекс Картах"
      loading="lazy"
      allowFullScreen
      className="absolute inset-0 h-full w-full border-0"
    />
    <div className="pointer-events-none absolute left-4 top-4 rounded-[10px] bg-[#121316] px-3.5 py-2 text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]">
      <p className="text-[0.6em] font-medium uppercase tracking-[0.2em] text-white/55">ProfilDoors</p>
      <p className="text-[0.8em] font-medium tracking-[-0.01em]">МЦ Roomer · павильон А149–А151</p>
    </div>
    <a
      href={SITE.routeUrl}
      target="_blank"
      rel="noreferrer"
      className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-[0.82em] font-medium text-white shadow-md transition-opacity hover:opacity-80"
    >
      <Icon name="Navigation" size={13} strokeWidth={1.8} /> Построить маршрут
    </a>
  </div>
);

export default SalonMap;