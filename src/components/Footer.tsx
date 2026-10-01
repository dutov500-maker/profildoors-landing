import { SITE } from "@/lib/site";

const Footer = () => (
  <footer className="border-t border-border">
    <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 pb-28 text-[0.86em] text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between md:pb-8 lg:px-[34px]">
      <div>
        <p className="font-display text-base font-bold tracking-[-0.03em] text-foreground">ProfilDoors</p>
        <p>Фирменный салон в МЦ Roomer · {SITE.addressFull}</p>
      </div>
      <div className="flex flex-col gap-1 md:items-end">
        <a href={SITE.phoneHref} className="font-medium text-foreground">{SITE.phone}</a>
        <p>{SITE.hours}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
