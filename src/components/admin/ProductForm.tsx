import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { adminApi, type CatalogCategory, type CatalogProduct } from "@/lib/api";
import FinishesEditor from "./FinishesEditor";

export type ProductDraft = Omit<CatalogProduct, "id"> & { id?: number };

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX = 5 * 1024 * 1024;

const readBase64 = (f: File) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(f);
  });

type Props = {
  initial: ProductDraft;
  categories: CatalogCategory[];
  onSave: (p: ProductDraft) => Promise<void>;
  onCancel: () => void;
};

const label = "mb-1.5 block text-[0.8em] font-medium text-muted-foreground";

const ProductForm = ({ initial, categories, onSave, onCancel }: Props) => {
  const [p, setP] = useState<ProductDraft>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) => setP((s) => ({ ...s, [k]: v }));

  const upload = async (f?: File) => {
    if (!f) return;
    setError("");
    if (!ALLOWED.includes(f.type)) return setError("Только JPEG, PNG или WEBP");
    if (f.size > MAX) return setError("Файл больше 5 МБ");
    setUploading(true);
    try {
      const data = await readBase64(f);
      const r = await adminApi<{ url: string }>("upload", { mime: f.type, data });
      set("image_url", r.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить фото");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (p.name.trim().length < 2) return setError("Укажите название модели");
    if (!p.category_id) return setError("Выберите категорию");
    if (!p.in_main && !p.in_orange) return setError("Отметьте, где показывать модель: основной каталог и/или Orange");
    setSaving(true);
    try {
      await onSave(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-6 md:grid-cols-[220px_1fr]">
      <div>
        <span className={label}>Фото (JPEG/PNG/WEBP, до 5 МБ)</span>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative grid aspect-[3/4] w-full place-items-center overflow-hidden rounded-[10px] border border-dashed border-[#E5E7EB] bg-secondary text-sm text-muted-foreground hover:border-[#1A1A1A]/40"
        >
          {p.image_url ? (
            <img src={p.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2">
              <Icon name="ImagePlus" size={22} /> Загрузить
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-white/70">
              <Icon name="Loader2" size={22} className="animate-spin" />
            </span>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
        <p className="mt-2 text-[0.75em] text-muted-foreground">Фото сожмётся автоматически, пропорции сохранятся. Для карточки лучше вертикальное 3:4.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <span className={label}>Где показывать модель</span>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["in_main", "Основной каталог ProfilDoors", "Главная страница, блок «Каталог»"],
                ["in_orange", "Коллекция ProfilDoors Orange", "Страница /orange"],
              ] as const
            ).map(([k, t, d]) => (
              <label
                key={k}
                className={`flex cursor-pointer items-start gap-3 rounded-[10px] border p-3 transition ${
                  p[k] ? "border-[#1A1A1A] bg-secondary" : "border-[#E5E7EB] hover:border-[#1A1A1A]/40"
                }`}
              >
                <input type="checkbox" checked={!!p[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1A1A1A]" />
                <span>
                  <span className="block text-sm font-medium">{t}</span>
                  <span className="block text-[0.75em] text-muted-foreground">{d}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <label className="sm:col-span-2">
          <span className={label}>Название модели</span>
          <Input value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Натуральный шпон" maxLength={160} />
        </label>
        <label>
          <span className={label}>Серии / подзаголовок</span>
          <Input value={p.series} onChange={(e) => set("series", e.target.value)} placeholder="Серии VE · VA · VT" maxLength={160} />
        </label>
        <label>
          <span className={label}>Бейдж на фото (необязательно)</span>
          <Input value={p.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Премиум" maxLength={60} />
        </label>
        <label>
          <span className={label}>Категория</span>
          <select
            value={p.category_id || ""}
            onChange={(e) => set("category_id", Number(e.target.value))}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">— выберите —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className={label}>Цена за комплект, ₽</span>
          <Input type="number" min={0} step={100} value={p.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="48500" />
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Описание (2–3 строки)</span>
          <Textarea value={p.description} onChange={(e) => set("description", e.target.value)} rows={3} maxLength={600} />
          <span className="mt-1 block text-right text-[0.72em] text-muted-foreground">{p.description.length} / 160 рекомендуемо</span>
        </label>
        <div className="sm:col-span-2">
          <FinishesEditor
            value={p.finishes ?? []}
            label={p.finishes_label || "Отделки"}
            onChange={(v) => set("finishes", v)}
            onLabel={(v) => set("finishes_label", v)}
          />
        </div>
        <label>
          <span className={label}>Статус</span>
          <select
            value={p.status}
            onChange={(e) => set("status", e.target.value as ProductDraft["status"])}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="published">Опубликовано</option>
            <option value="draft">Черновик</option>
          </select>
        </label>
        <label>
          <span className={label}>Порядок отображения</span>
          <Input type="number" value={p.sort_order ?? 0} onChange={(e) => set("sort_order", Number(e.target.value))} />
        </label>

        {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
        <div className="flex gap-2.5 sm:col-span-2">
          <button type="submit" disabled={saving || uploading} className="btn-pill btn-graphite disabled:opacity-50">
            {saving && <Icon name="Loader2" size={15} className="animate-spin" />} Сохранить
          </button>
          <button type="button" onClick={onCancel} className="btn-pill btn-outline">
            Отмена
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
