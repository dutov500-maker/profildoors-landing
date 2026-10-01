import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; delay?: number };

const Reveal = ({ children, className = "", delay = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    // safety net: never leave content hidden (print, screenshots, old browsers)
    const t = window.setTimeout(() => setVisible(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

export default Reveal;