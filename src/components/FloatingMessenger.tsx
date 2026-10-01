import Icon from "@/components/ui/icon";
import { SITE } from "@/lib/site";

const FloatingMessenger = () => (
  <a
    href={SITE.max}
    target="_blank"
    rel="noreferrer"
    aria-label="Онлайн-консультация в MAX из шоурума Roomer"
    className="group fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#121316] py-2 pl-2 pr-2 text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:pr-5"
  >
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-[#121316]">
      <Icon name="MessageCircle" size={20} strokeWidth={1.6} />
    </span>
    <span className="hidden flex-col leading-tight sm:flex">
      <span className="text-[0.9em] font-medium tracking-[-0.01em]">Консультация в MAX</span>
      <span className="text-[0.78em] font-light text-white/50">из шоурума Roomer</span>
    </span>
  </a>
);

export default FloatingMessenger;
