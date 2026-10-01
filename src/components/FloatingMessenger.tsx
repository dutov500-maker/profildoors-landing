import Icon from "@/components/ui/icon";
import { SITE } from "@/lib/site";

const FloatingMessenger = () => (
  <a
    href={SITE.max}
    target="_blank"
    rel="noreferrer"
    aria-label="Онлайн-консультация в MAX из шоурума Roomer"
    className="group fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full bg-primary py-2 pl-2 pr-2 text-primary-foreground shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:pr-5"
  >
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-messenger text-white animate-soft-pulse">
      <Icon name="MessageCircle" size={22} />
    </span>
    <span className="hidden flex-col leading-tight sm:flex">
      <span className="text-[0.92em] font-medium">Консультация в MAX</span>
      <span className="text-[0.78em] text-primary-foreground/65">из шоурума Roomer</span>
    </span>
  </a>
);

export default FloatingMessenger;
