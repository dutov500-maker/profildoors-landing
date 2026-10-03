import { METRO_LINES } from "@/lib/site";

const MetroList = ({ dark = false, className = "" }: { dark?: boolean; className?: string }) => (
  <ul className={`flex flex-col gap-2.5 ${className}`}>
    {METRO_LINES.map((m) => (
      <li key={m.line} className="flex items-center gap-3">
        {m.mck ? (
          <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-[3px] bg-white" style={{ borderColor: m.color }} />
        ) : (
          <span className="h-[18px] w-[18px] shrink-0 rounded-full" style={{ background: m.color }} />
        )}
        <span className="leading-snug tracking-[-0.01em]">
          {m.name} <span className={dark ? "text-white/50" : "text-muted-foreground"}>({m.line})</span> — {m.time}
        </span>
      </li>
    ))}
  </ul>
);

export default MetroList;
