import { SITE } from "@/lib/site";

const Footer = () => (
  <footer className="bg-[#0F1012] text-white/50">
    <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 pb-28 text-[0.88em] font-light sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] md:pb-14 lg:px-[34px]">
      <div>
        <p className="text-[1.05em] font-semibold uppercase tracking-[0.14em] text-white">ProfilDoors</p>
        <p className="mt-3 max-w-[26em] leading-relaxed">Официальный шоурум в МЦ Roomer. {SITE.addressFull}.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <a href={SITE.phoneHref} className="text-white hover:underline">{SITE.phone}</a>
        <p>{SITE.hours}</p>
        <div className="mt-2 flex gap-5">
          <a href={SITE.max} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">MAX</a>
          <a href={SITE.vk} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">ВКонтакте</a>
        </div>
      </div>
      <div className="flex flex-col items-start gap-2 md:items-end">
        <a href={SITE.routeUrl} target="_blank" rel="noreferrer" className="btn-pill btn-ghost-light px-5 py-3">
          Маршрут до МЦ Roomer
        </a>
        <p className="text-[0.85em] text-white/35">{SITE.routeTarget}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
