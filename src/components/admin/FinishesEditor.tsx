import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { adminApi, swatchStyle, type Finish } from "@/lib/api";

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

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;
const LIMIT = 24;

const readBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });

type Slot = { i: number; kind: "texture" | "image" };

const FinishesEditor = ({ value, label, onChange, onLabel }: Props) => {
  const [busy, setBusy] = useState<string>("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const slot = useRef<Slot | null>(null);

  const update = (i: number, patch: Partial<Finish>) => onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const unused = PRESETS.filter((p) => !value.some((v) => v.name === p.name));

  const pick = (i: number, kind: Slot["kind"]) => {
    slot.current = { i, kind };
    fileRef.current?.click();
  };

  const upload = async (file?: File) => {
    const s = slot.current;
    if (!file || !s) return;
    setError("");
    if (!ALLOWED.includes(file.type)) return setError("Только JPEG, PNG или WEBP");
    if (file.size > MAX) return setError("Файл больше 5 МБ");
    setBusy(`${s.i}-${s.kind}`);
    try {
      const data = await readBase64(file);
      const r = await adminApi<{ url: string }>("upload", { mime: file.type, data, kind: s.kind });
      update(s.i, { [s.kind]: r.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить фото");
    } finally {
      setBusy("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="rounded-[10px] border border-[#E5E7EB] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-[0.85em] font-medium">Цвета, текстуры и отделки</span>
          <span className="mt-0.5 block text-[0.75em] text-muted-foreground">
            Кружок — цвет или фото текстуры (дерево, камень). Если добавить фото двери в этой отделке, оно будет показываться при выборе кружка.
          </span>
        </div>
        <select value={label} onChange={(e) => onLabel(e.target.value)} className="h-9 rounded-md border border-input bg-background px-2 text-sm">
          <option value="Отделки">Подпись: «Отделки»</option>
          <option value="Цвета">Подпись: «Цвета»</option>
          <option value="Текстуры">Подпись: «Текстуры»</option>
          <option value="Профиль">Подпись: «Профиль»</option>
        </select>
      </div>

      <ul className="mt-4 space-y-3">
        {value.map((f, i) => (
          <li key={i} className="rounded-[10px] border border-[#E5E7EB] bg-secondary/40 p-3">
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 shrink-0 rounded-full border border-black/10 shadow-inner" style={swatchStyle(f)} aria-hidden />
              <Input
                value={f.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="Название, например «Дуб Кассела»"
                maxLength={60}
                className="h-9 flex-1 bg-background"
              />
              <div className="flex shrink-0 items-center">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="grid h-8 w-7 place-items-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Выше">
                  <Icon name="ChevronUp" size={15} />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="grid h-8 w-7 place-items-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30" aria-label="Ниже">
                  <Icon name="ChevronDown" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, j) => j !== i))}
                  className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                  aria-label="Удалить отделку"
                >
                  <Icon name="X" size={15} />
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <label className={`flex h-[72px] cursor-pointer items-center gap-2.5 rounded-md border bg-background px-3 text-[0.78em] ${f.texture ? "opacity-60" : "border-input"}`}>
                <input
                  type="color"
                  value={f.color}
                  onChange={(e) => update(i, { color: e.target.value })}
                  className="h-9 w-10 shrink-0 cursor-pointer rounded border border-input bg-background p-0.5"
                  aria-label="Цвет"
                />
                <span className="leading-tight">
                  Цвет из палитры
                  {f.texture && <span className="block text-muted-foreground">не используется — есть фото текстуры</span>}
                </span>
              </label>

              {(["texture", "image"] as const).map((kind) => {
                const url = f[kind];
                const loading = busy === `${i}-${kind}`;
                const title = kind === "texture" ? "Фото текстуры" : "Фото двери в этой отделке";
                const hint = kind === "texture" ? "кружок, квадратное фото" : "заменит основное фото";
                return (
                  <div key={kind} className="relative flex h-[72px] items-center gap-2.5 rounded-md border border-input bg-background px-2 text-[0.78em]">
                    <button
                      type="button"
                      onClick={() => pick(i, kind)}
                      className={`relative grid h-14 shrink-0 place-items-center overflow-hidden border border-dashed border-[#D1D5DB] bg-secondary text-muted-foreground hover:border-[#1A1A1A]/40 ${
                        kind === "texture" ? "w-14 rounded-full" : "w-11 rounded-md"
                      }`}
                      aria-label={`Загрузить: ${title}`}
                    >
                      {url ? <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <Icon name="ImagePlus" size={16} />}
                      {loading && (
                        <span className="absolute inset-0 grid place-items-center bg-white/70">
                          <Icon name="Loader2" size={16} className="animate-spin" />
                        </span>
                      )}
                    </button>
                    <span className="min-w-0 flex-1 leading-tight">
                      <button type="button" onClick={() => pick(i, kind)} className="block text-left font-medium hover:underline">
                        {url ? "Заменить" : title}
                      </button>
                      <span className="block text-muted-foreground">{url ? title.toLowerCase() : hint}</span>
                    </span>
                    {url && (
                      <button
                        type="button"
                        onClick={() => update(i, { [kind]: undefined })}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                        aria-label="Убрать фото"
                      >
                        <Icon name="Trash2" size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {value.length < LIMIT && (
          <button type="button" onClick={() => onChange([...value, { name: "", color: "#D6C8B4" }])} className="btn-pill btn-outline px-3 py-1.5 text-[0.8em]">
            <Icon name="Plus" size={13} /> Добавить отделку
          </button>
        )}
        {value.length < LIMIT &&
          unused.slice(0, 4).map((p) => (
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
