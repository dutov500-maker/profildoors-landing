import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SITE, openCatalogTab, scrollToId } from "@/lib/site";
import { openLead } from "@/components/LeadDialog";

type NavItem = { label: string; short: string; action: () => void };

const NAV: NavItem[] = [
  { label: "Каталог", short: "Каталог", action: () => openCatalogTab("all") },
  { label: "Скрытые двери Invisible", short: "Invisible", action: () => openCatalogTab("invisible") },
  { label: "Раздвижные системы", short: "Раздвижные", action: () => openCatalogTab("alu") },
  { label: "Калькулятор стоимости", short: "Калькулятор", action: () => scrollToId("calc") },
  { label: "Фабрика", short: "Фабрика", action: () => scrollToId("factory") },
  { label: "Дизайнерам", short: "Дизайнерам", action: () => scrollToId("b2b") },
  { label: "Контакты", short: "Контакты", action: () => scrollToId("contacts") },
];

export const OrangeLink = ({ className = "", onClick }: { className?: string; onClick?: () => void }) => (
  <Link
    to="/orange"
    onClick={onClick}
    className={`group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#E05A2B]/35 bg-[#E05A2B]/[0.06] py-1.5 pl-1.5 pr-3.5 text-[0.88em] font-medium tracking-[-0.01em] text-foreground transition-all duration-300 hover:border-[#E05A2B] hover:bg-[#E05A2B]/10 active:scale-[0.98] ${className}`}
  >
    <span className="rounded-full bg-[#B8522E] px-2 py-0.5 text-[0.7em] font-semibold tracking-[0.12em] text-white">NEW</span>
    Коллекция Orange 2026
    <Icon name="ArrowUpRight" size={14} strokeWidth={1.8} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
  </Link>
);

export const callMeasurer = () =>
  openLead({
    title: "Вызвать замерщика",
    description: "Бесплатный выезд по Москве. Замерщик привезёт образцы покрытий и рассчитает смету на месте.",
    source: "Вызов замерщика",
    button: "Вызвать замерщика",
  });

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl border-b border-neutral-200" : "bg-white border-b border-neutral-200"
      }`}
    >
      <div className={`overflow-hidden bg-[#0F1012] text-white/55 transition-all duration-300 ${scrolled ? "h-0" : "h-8"}`}>
        <div className="mx-auto flex h-8 max-w-[1440px] items-center justify-center gap-2.5 px-4 text-[0.72em] font-light tracking-[0.04em] sm:text-[0.76em]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          </span>
          <span className="truncate">
            <span className="hidden sm:inline">Официальный дилер фабрики ProfilDoors <span className="mx-2 text-white/25">•</span> </span>
            Экспозиция открыта сегодня до 22:00 в МЦ Roomer
          </span>
        </div>
      </div>
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-[34px]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col whitespace-nowrap leading-[1.1]"
        >
          <span className="text-[1.05em] font-semibold uppercase tracking-[0.16em]">ProfilDoors</span>
          <span className="mt-0.5 text-[0.7em] font-light text-muted-foreground">Официальный шоурум · МЦ Roomer</span>
        </a>

        <nav className="hidden xl:flex items-center gap-6 text-[0.9em] tracking-[-0.01em]">
          {NAV.filter((n) => n.short !== "Калькулятор" && n.short !== "Раздвижные").map((n) => (
            <button key={n.label} onClick={n.action} title={n.label} className="relative transition-colors hover:text-muted-foreground">
              {n.short}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3.5 text-[0.9em]">
          <OrangeLink className="hidden md:inline-flex" />
          <a
            href={SITE.routeUrl}
            target="_blank"
            rel="noreferrer"
            title={SITE.addressFull}
            className="hidden 2xl:inline-flex items-center gap-[7px] rounded-[10px] bg-secondary px-3 py-2 text-foreground"
          >
            <Icon name="MapPin" size={14} className="text-muted-foreground" />
            {SITE.metro}
          </a>
          <span className="hidden 2xl:block h-[18px] w-px bg-border" />
          <a
            href={SITE.max}
            target="_blank"
            rel="noreferrer"
            className="hidden 2xl:inline-flex items-center gap-1.5 whitespace-nowrap font-medium text-foreground hover:text-muted-foreground transition-colors"
          >
            <Icon name="MessageCircle" size={15} strokeWidth={1.6} />
            Написать в MAX
          </a>
          <span className="hidden 2xl:block h-[18px] w-px bg-border" />
          <a href={SITE.phoneHref} className="hidden 2xl:inline whitespace-nowrap font-medium text-muted-foreground hover:text-foreground transition-colors">
            {SITE.phone}
          </a>
          <a href={SITE.phoneHref} aria-label="Позвонить" className="2xl:hidden grid h-9 w-9 place-items-center rounded-full bg-secondary">
            <Icon name="Phone" size={16} />
          </a>
          <button
            onClick={callMeasurer}
            className="btn-dark hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.93em] font-medium transition-all active:scale-[0.97]"
          >
                        Вызвать замерщика
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Меню" className="xl:hidden grid h-9 w-9 place-items-center rounded-full bg-secondary">
                <Icon name="Menu" size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm p-6">
              <SheetTitle className="text-lg font-semibold uppercase tracking-[0.14em]">ProfilDoors</SheetTitle>
              <p className="text-xs text-muted-foreground">Фирменный салон в МЦ Roomer</p>
              <OrangeLink className="mt-6" onClick={() => setOpen(false)} />
              <nav className="mt-6 flex flex-col">
                {NAV.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => {
                      setOpen(false);
                      setTimeout(n.action, 250);
                    }}
                    className="flex items-center justify-between border-b border-border py-3.5 text-left text-base font-medium"
                  >
                    {n.label}
                    <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                  </button>
                ))}
              </nav>
              <div className="mt-6 flex items-start gap-2 rounded-2xl bg-secondary p-4 text-sm">
                <Icon name="MapPin" size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                <span>
                  {SITE.addressFull} · {SITE.metro}
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    setTimeout(callMeasurer, 250);
                  }}
                  className="btn-pill btn-dark"
                >
                  Вызвать замерщика
                </button>
                <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                  Написать в MAX
                </a>
                <a href={SITE.vk} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                  <Icon name="Users" size={16} /> Группа ВКонтакте
                </a>
                <a href={SITE.phoneHref} className="btn-pill btn-outline">
                  <Icon name="Phone" size={16} /> {SITE.phone}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;