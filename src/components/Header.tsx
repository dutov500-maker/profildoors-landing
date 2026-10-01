import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SITE, openCatalogTab, scrollToId, waLink } from "@/lib/site";
import { openLead } from "@/components/LeadDialog";

type NavItem = { label: string; short: string; action: () => void };

const NAV: NavItem[] = [
  { label: "Каталог", short: "Каталог", action: () => openCatalogTab("all") },
  { label: "Скрытые двери Invisible", short: "Invisible", action: () => openCatalogTab("invisible") },
  { label: "Раздвижные системы", short: "Раздвижные", action: () => openCatalogTab("glass") },
  { label: "Калькулятор стоимости", short: "Калькулятор", action: () => scrollToId("calc") },
  { label: "Дизайнерам", short: "Дизайнерам", action: () => scrollToId("b2b") },
  { label: "Контакты", short: "Контакты", action: () => scrollToId("contacts") },
];

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
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-background border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-[34px]">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex flex-col whitespace-nowrap leading-[1.1]"
        >
          <span className="font-display text-[1.2em] font-bold tracking-[-0.03em]">ProfilDoors</span>
          <span className="text-[0.72em] text-muted-foreground">Фирменный салон в МЦ Roomer</span>
        </a>

        <nav className="hidden xl:flex gap-[22px] text-[0.93em] font-medium">
          {NAV.map((n) => (
            <button key={n.label} onClick={n.action} title={n.label} className="relative transition-colors hover:text-muted-foreground">
              {n.short}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3.5 text-[0.9em]">
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
            href={waLink("Здравствуйте! Хочу проконсультироваться по дверям ProfilDoors.")}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 font-medium text-foreground hover:text-whatsapp transition-colors"
          >
            <Icon name="MessageCircle" size={15} className="text-whatsapp" />
            Написать менеджеру
          </a>
          <span className="hidden md:block h-[18px] w-px bg-border" />
          <a href={SITE.phoneHref} className="hidden lg:inline font-medium text-muted-foreground hover:text-foreground transition-colors">
            {SITE.phone}
          </a>
          <a href={SITE.phoneHref} aria-label="Позвонить" className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-secondary">
            <Icon name="Phone" size={16} />
          </a>
          <button
            onClick={callMeasurer}
            className="hidden sm:inline-flex items-center gap-2 rounded-[9px] bg-primary px-[13px] py-2 text-[0.93em] font-medium text-primary-foreground transition hover:bg-primary/85"
          >
            <Icon name="Plus" size={13} strokeWidth={2.4} />
            Вызвать замерщика
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button aria-label="Меню" className="xl:hidden grid h-9 w-9 place-items-center rounded-full bg-secondary">
                <Icon name="Menu" size={18} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm p-6">
              <SheetTitle className="font-display text-xl font-bold tracking-tight">ProfilDoors</SheetTitle>
              <p className="text-xs text-muted-foreground">Фирменный салон в МЦ Roomer</p>
              <nav className="mt-8 flex flex-col">
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
                <a href={waLink("Здравствуйте! Хочу проконсультироваться.")} target="_blank" rel="noreferrer" className="btn-pill btn-outline">
                  <Icon name="MessageCircle" size={16} className="text-whatsapp" /> Написать менеджеру
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