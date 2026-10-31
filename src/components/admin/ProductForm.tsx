import { useRef, useState, type ReactNode } from "react";
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

const Block = ({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) => (
  <section className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6">
    <div className="mb-5 flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0F1012] text-[0.78em] font-semibold text-white">{n}</span>
      <div>
        <h3 className="font-semibold leading-7">{title}</h3>
        {hint && <p className="text-[0.82em] text-black/45">{hint}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-[0.82em] font-medium">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[0.75em] text-black/40">{hint}</span>}
  </label>
);

const ProductForm = ({ initial, categories, onSave, onCancel }: Props) => {
  const [p, setP] = useState<ProductDraft>(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = JSON.stringify(p) !== JSON.stringify(initial);

  const set = <K extends keyof ProductDraft>(k: K, v: ProductDraft[K]) => setP((s) => ({ ...s, [k]: v }));

  const upload = async (f?: File) => {
    if (!f) return;
    setError("");
    if (!ALLOWED.includes(f.type)) return setError("Подойдёт только фото в формате JPEG, PNG или WEBP");
    if (f.size > MAX) return setError("Фото больше 5 МБ — уменьшите его и попробуйте снова");
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
    if (p.name.trim().length < 2) return setError("Впишите название модели");
    if (!p.category_id) return setError("Выберите категорию");
    if (!p.in_main && !p.in_orange) return setError("Отметьте, где показывать модель: основной каталог и/или Orange");
    if ((p.finishes ?? []).some((f) => !f.name.trim())) return setError("У каждой отделки должно быть название — заполните или удалите пустые");
    setSaving(true);
    try {
      await onSave(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const descLen = p.description.length;

  return (
    <form onSubmit={submit} className="pb-24">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => (!dirty || confirm("Выйти без сохранения? Изменения пропадут.")) && onCancel()}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-black/60 hover:text-black"
          aria-label="Назад к списку"
        >
          <Icon name="ArrowLeft" size={18} />
        </button>
        <div>
          <p className="text-[0.8em] text-black/45">Модели</p>
          <h1 className="text-[1.4em] font-semibold tracking-[-0.02em]">{p.id ? p.name || "Модель" : "Новая модель"}</h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <div className="space-y-5">
          <section className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:sticky lg:top-8">
            <p className="mb-3 font-semibold">Основное фото</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative grid aspect-[3/4] w-full place-items-center overflow-hidden rounded-xl border-2 border-dashed border-black/10 bg-[#F4F3F1] text-[0.85em] text-black/45 transition hover:border-black/30"
            >
              {p.image_url ? (
                <>
                  <img src={p.image_url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-x-3 bottom-3 rounded-lg bg-black/60 py-2 text-white backdrop-blur">Заменить фото</span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-2 px-4 text-center">
                  <Icon name="ImagePlus" size={28} />
                  <span className="font-medium text-black/70">Загрузить фото</span>
                  <span>Вертикальное 3:4, JPEG/PNG/WEBP до 5 МБ</span>
                </span>
              )}
              {uploading && (
                <span className="absolute inset-0 grid place-items-center bg-white/70">
                  <Icon name="Loader2" size={24} className="animate-spin" />
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            <p className="mt-3 text-[0.75em] text-black/40">Показывается в карточке, пока клиент не выбрал отделку со своим фото.</p>

            <div className="mt-5 border-t border-black/[0.06] pt-4">
              <p className="mb-2 text-[0.82em] font-medium">Видимость на сайте</p>
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#F4F3F1] p-1">
                {(
                  [
                    ["published", "На сайте", "Eye"],
                    ["draft", "Черновик", "EyeOff"],
                  ] as const
                ).map(([v, l, ic]) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => set("status", v)}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-[0.82em] font-medium transition ${
                      p.status === v ? "bg-white shadow-sm" : "text-black/45 hover:text-black"
                    }`}
                  >
                    <Icon name={ic} size={14} /> {l}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.75em] text-black/40">
                {p.status === "published" ? "Клиенты видят модель сразу после сохранения." : "Модель сохранится, но на сайте её не будет."}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <Block n={1} title="Где показывать" hint="Можно выбрать оба раздела">
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["in_main", "Основной каталог", "Главная страница, блок «Каталог»"],
                  ["in_orange", "Коллекция Orange", "Страница /orange"],
                ] as const
              ).map(([k, t, d]) => (
                <label
                  key={k}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition ${
                    p[k] ? (k === "in_orange" ? "border-[#E05A2B] bg-[#E05A2B]/[0.04]" : "border-[#0F1012] bg-black/[0.02]") : "border-black/[0.06] hover:border-black/20"
                  }`}
                >
                  <input type="checkbox" checked={!!p[k]} onChange={(e) => set(k, e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#0F1012]" />
                  <span>
                    <span className="block text-[0.92em] font-medium">{t}</span>
                    <span className="block text-[0.75em] text-black/45">{d}</span>
                  </span>
                </label>
              ))}
            </div>
          </Block>

          <Block n={2} title="Название и цена" hint="Так модель будет подписана в каталоге и в поиске Яндекса">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Название модели *" className="sm:col-span-2">
                <Input value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="Например: 1GE или «Натуральный шпон»" maxLength={160} className="h-11" />
              </Field>
              <Field label="Серия / подзаголовок" hint="Мелкая строка над названием">
                <Input value={p.series} onChange={(e) => set("series", e.target.value)} placeholder="Серии VE · VA · VT" maxLength={160} className="h-11" />
              </Field>
              <Field label="Категория *" hint="Вкладка каталога, где будет модель">
                <select
                  value={p.category_id || ""}
                  onChange={(e) => set("category_id", Number(e.target.value))}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">— выберите —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Цена за комплект, ₽" hint="Пишется как «от 48 500 ₽». Пусто — «Цена по запросу»">
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    value={p.price || ""}
                    onChange={(e) => set("price", Number(e.target.value))}
                    placeholder="48500"
                    className="h-11 pr-8"
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/35">₽</span>
                </div>
              </Field>
              <Field label="Метка на фото" hint="Необязательно: «Хит», «Новинка 2026»">
                <Input value={p.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Новинка" maxLength={60} className="h-11" />
              </Field>
            </div>
          </Block>

          <Block n={3} title="Описание" hint="2–4 предложения: материал, особенности, размеры. Помогает в поиске">
            <Textarea value={p.description} onChange={(e) => set("description", e.target.value)} rows={4} maxLength={600} placeholder="Каркасная дверь на алюминиевом профиле, панели EGGER, толщина полотна 44 мм…" />
            <div className="mt-1.5 flex justify-between text-[0.75em]">
              <span className="text-black/40">В карточке видны первые ~160 символов, на странице модели — весь текст.</span>
              <span className={descLen > 160 ? "text-black/40" : "text-black/60"}>{descLen} / 600</span>
            </div>
          </Block>

          <Block n={4} title="Отделки и цвета" hint="Кружочки под фото. Клиент нажимает — фото меняется на дверь в этой отделке">
            <FinishesEditor
              value={p.finishes ?? []}
              label={p.finishes_label || "Отделки"}
              onChange={(v) => set("finishes", v)}
              onLabel={(v) => set("finishes_label", v)}
            />
          </Block>

          <Block n={5} title="Адрес страницы в интернете" hint="Можно не трогать — создастся автоматически из названия">
            <div className="flex items-center gap-2">
              <span className="shrink-0 rounded-l-md text-[0.85em] text-black/40">profildoors-roomer.ru/models/</span>
              <Input
                value={p.slug ?? ""}
                onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="заполнится сам"
                maxLength={90}
                className="h-11"
              />
              {p.id && p.slug && p.status === "published" && (
                <a
                  href={`/models/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-input text-black/50 hover:text-black"
                  title="Открыть страницу модели"
                  aria-label="Открыть страницу модели"
                >
                  <Icon name="ExternalLink" size={16} />
                </a>
              )}
            </div>
          </Block>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[60px] z-20 border-t border-black/[0.06] bg-white/95 backdrop-blur lg:bottom-0 lg:left-[248px]">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-10">
          <p className={`min-w-0 flex-1 truncate text-[0.85em] ${error ? "text-red-600" : "text-black/45"}`}>
            {error || (dirty ? "Есть несохранённые изменения" : "Изменений нет")}
          </p>
          <button
            type="button"
            onClick={() => (!dirty || confirm("Выйти без сохранения? Изменения пропадут.")) && onCancel()}
            className="h-11 rounded-xl px-4 text-[0.9em] font-medium text-black/60 hover:bg-black/[0.04] hover:text-black"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F1012] px-6 text-[0.9em] font-medium text-white hover:bg-black disabled:opacity-50"
          >
            {saving ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Check" size={16} />} Сохранить
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
