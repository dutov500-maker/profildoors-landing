import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { SITE } from "@/lib/site";

const modalOpen = () =>
  document.body.hasAttribute("data-scroll-locked") || document.body.style.overflow === "hidden" || !!document.querySelector('[role="dialog"]');

const FloatingMessenger = () => {
  const [modal, setModal] = useState(false);
  const [blocked, setBlocked] = useState(0);

  useEffect(() => {
    const check = () => setModal(modalOpen());
    const mo = new MutationObserver(check);
    mo.observe(document.body, { attributes: true, childList: true, attributeFilter: ["style", "data-scroll-locked"] });
    check();

    const seen = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        setBlocked(seen.size);
      },
      { rootMargin: "-75% 0px 0px 0px" }
    );
    const watch = () => document.querySelectorAll("[data-fab-hide]").forEach((el) => io.observe(el));
    watch();
    const t = window.setTimeout(watch, 1500);
    const t2 = window.setTimeout(watch, 4000);

    return () => {
      mo.disconnect();
      io.disconnect();
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, []);

  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const h = () => setMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const hidden = modal || (mobile && blocked > 0);

  return (
    <a
      href={SITE.max}
      target="_blank"
      rel="noreferrer"
      aria-label="Онлайн-консультация в MAX из шоурума Roomer"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`group fixed bottom-6 right-4 z-40 flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#121316] text-white shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 sm:right-6 sm:py-2 sm:pl-2 sm:pr-5 ${
        hidden ? "pointer-events-none invisible translate-y-4 opacity-0" : "visible opacity-100"
      }`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[#121316] sm:h-11 sm:w-11">
        <Icon name="MessageCircle" size={20} strokeWidth={1.6} />
      </span>
      <span className="hidden flex-col leading-tight sm:flex">
        <span className="text-[0.9em] font-medium tracking-[-0.01em]">Консультация в MAX</span>
        <span className="text-[0.78em] font-light text-white/50">из шоурума Roomer</span>
      </span>
    </a>
  );
};

export default FloatingMessenger;
