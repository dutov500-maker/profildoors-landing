import { useState } from "react";
import Reveal from "@/components/Reveal";

type Swatch = { name: string; style: React.CSSProperties; light?: boolean };

const wood = (a: string, b: string, c: string): React.CSSProperties => ({
  backgroundColor: a,
  backgroundImage: `repeating-linear-gradient(92deg, ${b} 0px, ${a} 3px, ${c} 7px, ${a} 11px, ${b} 16px)`,
});
const metal = (a: string, b: string): React.CSSProperties => ({
  backgroundImage: `linear-gradient(135deg, ${a} 0%, ${b} 45%, ${a} 55%, ${b} 100%)`,
});

const GROUPS: { id: string; label: string; items: Swatch[] }[] = [
  {
    id: "enamel",
    label: "Эмаль",
    items: [
      { name: "Тёплый шёлк", style: { background: "#E9E1D4" }, light: true },
      { name: "Кашемир", style: { background: "#CFC3B2" }, light: true },
      { name: "Тауп", style: { background: "#8C8075" } },
      { name: "Мокко", style: { background: "#5E4A3E" } },
      { name: "Вайт", style: { background: "#F4F3EF" }, light: true },
      { name: "Графит", style: { background: "#36383B" } },
    ],
  },
  {
    id: "veneer",
    label: "Шпон",
    items: [
      { name: "Дуб натуральный", style: wood("#B98E5F", "#A57A4D", "#C9A274"), light: true },
      { name: "Американский орех", style: wood("#6B4A33", "#5A3C28", "#7C5940") },
      { name: "Венге", style: wood("#3B2C24", "#2D211B", "#4A382E") },
    ],
  },
  {
    id: "profile",
    label: "Профиль",
    items: [
      { name: "Черный матовый", style: { background: "#1C1C1E" } },
      { name: "Никель", style: metal("#B9BBBD", "#E3E4E5"), light: true },
      { name: "Шампань", style: metal("#C8B48E", "#E6D8B9"), light: true },
      { name: "Деорэ", style: metal("#A7895A", "#D2B783"), light: true },
    ],
  },
];

const OrangePalette = () => {
  const [group, setGroup] = useState(GROUPS[0].id);
  const [active, setActive] = useState<Swatch>(GROUPS[0].items[0]);
  const current = GROUPS.find((g) => g.id === group)!;

  return (
    <section id="orange-palette" className="bg-[#0F1012] text-white">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:px-[34px]">
        <Reveal className="flex flex-col">
          <span className="eyebrow-chip text-[#E8A27E]">Палитра Orange</span>
          <h2 className="section-title mt-6 max-w-[11em]">Официальные текстуры коллекции</h2>
          <p className="mt-6 max-w-[28em] font-light leading-relaxed text-white/55">
            Выберите покрытие, чтобы увидеть оттенок. Живые образцы каждой текстуры — в шоуруме Roomer, секция А149–А151.
          </p>

          <div className="mt-10 flex gap-7 border-b border-white/[0.08]">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setGroup(g.id);
                  setActive(g.items[0]);
                }}
                className={`-mb-px border-b pb-3.5 text-[0.9em] transition-colors ${
                  group === g.id ? "border-[#E05A2B] text-white" : "border-transparent text-white/45 hover:text-white"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div key={group} className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {current.items.map((s) => {
              const on = active.name === s.name;
              return (
                <button key={s.name} onClick={() => setActive(s)} className="group flex flex-col gap-2 text-left animate-rise">
                  <span
                    className={`aspect-square w-full rounded-[8px] ring-offset-2 ring-offset-[#0F1012] transition-all duration-300 ${
                      on ? "ring-1 ring-[#E05A2B]" : "ring-1 ring-white/10 group-hover:ring-white/40"
                    }`}
                    style={s.style}
                  />
                  <span className={`text-[0.8em] leading-tight ${on ? "text-white" : "text-white/55"}`}>{s.name}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#17181B] sm:aspect-[5/5]">
            <div className="absolute inset-0 opacity-90 transition-all duration-700" style={active.style} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
            <div
              className="relative h-[72%] w-[38%] rounded-[3px] border border-black/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] transition-all duration-700"
              style={active.style}
            >
              <span className={`absolute right-[10%] top-1/2 h-[14%] w-[3px] -translate-y-1/2 rounded-full ${active.light ? "bg-[#1C1C1E]" : "bg-[#D2B783]"}`} />
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
              <div>
                <p className="text-[0.68em] font-medium uppercase tracking-[0.22em] text-white/60">{current.label}</p>
                <p className="mt-1 text-[1.5em] font-medium tracking-[-0.03em] text-white">{active.name}</p>
              </div>
              <span className="rounded-full bg-[#B8522E] px-2.5 py-1 text-[0.65em] font-semibold tracking-[0.12em] text-white">ORANGE</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default OrangePalette;
