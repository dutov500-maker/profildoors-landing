import { swatchStyle, type Finish } from "@/lib/api";

type Props = {
  finishes: Finish[];
  active: number;
  onPick: (i: number) => void;
  size?: "sm" | "lg";
  dark?: boolean;
  limit?: number;
};

const Swatches = ({ finishes, active, onPick, size = "sm", dark = false, limit }: Props) => {
  const list = limit ? finishes.slice(0, limit) : finishes;
  const rest = finishes.length - list.length;
  const dim = size === "lg" ? "h-11 w-11" : "h-6 w-6";
  const ring = dark ? "ring-white ring-offset-[#0F1012]" : "ring-graphite ring-offset-white";

  return (
    <div className={`flex flex-wrap items-center ${size === "lg" ? "gap-3" : "gap-1.5"}`}>
      {list.map((f, i) => (
        <button
          key={`${f.name}-${i}`}
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPick(i);
          }}
          onMouseEnter={size === "sm" ? () => onPick(i) : undefined}
          title={f.name}
          aria-label={f.name}
          aria-pressed={i === active}
          className="group/s relative"
        >
          <span
            className={`block ${dim} rounded-full border shadow-inner transition ${dark ? "border-white/20" : "border-black/10"} ${
              i === active ? `ring-2 ring-offset-2 ${ring}` : "hover:scale-110"
            }`}
            style={swatchStyle(f)}
          />
          {size === "lg" && (
            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#121316] px-2.5 py-1 text-[0.72em] text-white opacity-0 transition group-hover/s:opacity-100">
              {f.name}
            </span>
          )}
        </button>
      ))}
      {rest > 0 && <span className={`ml-1 text-[0.75em] ${dark ? "text-white/55" : "text-muted-foreground"}`}>+{rest}</span>}
    </div>
  );
};

export default Swatches;
