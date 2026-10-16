import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import type { Finish } from "@/lib/api";

type Props = {
  value: Finish[];
  label: string;
  onChange: (v: Finish[]) => void;
  onLabel: (v: string) => void;
};

const PRESETS: Finish[] = [
  { name: "Вайт", color: "#F4F3EF" },
  { name: "Кашемир", color: "#D6C8B4" },
  { name: "Капучино", color: "#CDBBA5" },
  { name: "Мокко", color: "#6E5646" },
  { name: "Графит", color: "#3E3F41" },
  { name: "Чёрный муар", color: "#232325" },
];

const FinishesEditor = ({ value, label, onChange, onLabel }: Props) => {
  const update = (i: number, patch: Partial<Finish>) => onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const unused = PRESETS.filter((p) => !value.some((v) => v.name === p.name));

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[0.8em] font-medium text-muted-foreground">Цвета / отделки (кружочки на карточке)</span>
        <select value={label} onChange={(e) => onLabel(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="Отделки">Подпись: «Отделки»</option>
          <option value="Профиль">Подпись: «Профиль»</option>
          <option value="Цвета">Подпись: «Цвета»</option>
        </select>
      </div>
      <ul className="mt-3 space-y-2">
        {value.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="color"
              value={f.color}
              onChange={(e) => update(i, { color: e.target.value })}
              className="h-9 w-11 cursor-pointer rounded-md border border-input bg-background p-1"
              aria-label="Цвет"
            />
            <Input value={f.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Название, например «Кашемир»" maxLength={40} className="h-9 flex-1" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
              aria-label="Удалить цвет"
            >
              <Icon name="X" size={15} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {value.length < 12 && (
          <button type="button" onClick={() => onChange([...value, { name: "", color: "#D6C8B4" }])} className="btn-pill btn-outline px-3 py-1.5 text-[0.8em]">
            <Icon name="Plus" size={13} /> Добавить цвет
          </button>
        )}
        {unused.slice(0, 4).map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onChange([...value, p])}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] px-2.5 py-1 text-[0.78em] text-muted-foreground hover:text-foreground"
          >
            <span className="h-3 w-3 rounded-full border border-black/10" style={{ background: p.color }} /> {p.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FinishesEditor;
