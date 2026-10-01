type Props = { kind: "classic" | "invisible" | "glass" | "entry"; className?: string };

const DoorGlyph = ({ kind, className = "h-[60px] w-[44px]" }: Props) => {
  if (kind === "classic")
    return (
      <svg viewBox="0 0 60 80" className={className} aria-hidden>
        <rect x="14" y="6" width="32" height="70" rx="1.5" className="d-frame" />
        <rect x="18" y="10" width="24" height="62" className="d-leaf" />
        <rect x="21" y="14" width="18" height="24" className="d-panel" />
        <rect x="21" y="44" width="18" height="24" className="d-panel" />
        <circle cx="38" cy="42" r="1.6" className="d-knob" />
      </svg>
    );
  if (kind === "invisible")
    return (
      <svg viewBox="0 0 60 80" className={className} aria-hidden>
        <rect x="10" y="4" width="40" height="72" className="d-wall" />
        <rect x="18" y="10" width="24" height="66" className="d-hidden" />
        <circle cx="38" cy="44" r="1.6" className="d-gold" />
      </svg>
    );
  if (kind === "glass")
    return (
      <svg viewBox="0 0 60 80" className={className} aria-hidden>
        <rect x="8" y="6" width="44" height="70" className="d-alu" />
        <line x1="30" y1="6" x2="30" y2="76" className="d-line" />
        <line x1="8" y1="41" x2="52" y2="41" className="d-line" />
      </svg>
    );
  return (
    <svg viewBox="0 0 60 80" className={className} aria-hidden>
      <rect x="12" y="4" width="36" height="72" rx="1.5" className="d-entry" />
      <rect x="17" y="10" width="26" height="60" className="d-entry-in" />
      <rect x="38" y="38" width="2.4" height="9" rx="1" className="d-gold" />
    </svg>
  );
};

export default DoorGlyph;
