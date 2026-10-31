import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import { swatchStyle, type CatalogCategory, type CatalogProduct } from "@/lib/api";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

type Section = "all" | "main" | "orange" | "draft";

type Props = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  onEdit: (p: CatalogProduct) => void;
  onDuplicate: (p: CatalogProduct) => void;
  run: (action: string, body: unknown) => Promise<void>;
};

const ProductsPanel = ({ products, categories, onEdit, onDuplicate, run }: Props) => {
  const [section, setSection] = useState<Section>("all");
  const [q, setQ] = useState("");
  const catName = (id: number) => categories.find((c) => c.id === id)?.name ?? "Без категории";

  const inSection = (p: CatalogProduct, s: Section) =>
    s === "all" ? true : s === "draft" ? p.status === "draft" : s === "orange" ? !!p.in_orange : !!p.in_main;

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter(
      (p) => inSection(p, section) && (!needle || `${p.name} ${p.series} ${p.badge}`.toLowerCase().includes(needle)),
    );
  }, [products, section, q]);

  const move = (id: number, dir: -1 | 1) => {
    const i = list.findIndex((p) => p.id === id);
    const other = list[i + dir];
    if (!other) return;
    const ids = products.map((p) => p.id);
    const a = ids.indexOf(id);
    const b = ids.indexOf(other.id);
    [ids[a], ids[b]] = [ids[b], ids[a]];
    run("product_reorder", { ids });
  };

  const toggle = (p: CatalogProduct) => run("product_save", { ...p, status: p.status === "published" ? "draft" : "published" });

  const SECTIONS: [Section, string][] = [
    ["all", "Все"],
    ["main", "Основной каталог"],
    ["orange", "Orange"],
    ["draft", "Черновики"],
  ];

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
          {SECTIONS.map(([id, l]) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.85em] font-medium transition ${
                section === id ? "bg-[#0F1012] text-white" : "bg-white text-black/55 hover:text-black"
              }`}
            >
              {l} <span className={section === id ? "text-white/50" : "text-black/30"}>{products.filter((p) => inSection(p, id)).length}</span>
            </button>
          ))}
        </div>
        <label className="relative lg:w-[280px]">
          <Icon name="Search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск модели"
            className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-[0.88em] outline-none focus:border-black/40"
          />
        </label>
      </div>

      {!list.length ? (
        <div className="mt-4 rounded-2xl bg-white p-12 text-center">
          <Icon name="DoorOpen" size={30} className="mx-auto text-black/20" fallback="Box" />
          <p className="mt-3 font-medium">{q ? "Ничего не найдено" : "Здесь пока нет моделей"}</p>
          <p className="mt-1 text-[0.85em] text-black/45">Нажмите «Добавить модель», чтобы она появилась на сайте.</p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => {
            const published = p.status === "published";
            const finishes = p.finishes ?? [];
            return (
              <li key={p.id} className={`group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${published ? "" : "opacity-80"}`}>
                <button onClick={() => onEdit(p)} className="relative aspect-[4/3] overflow-hidden bg-[#ECEAE6] text-left">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <span className="grid h-full place-items-center text-black/25">
                      <Icon name="ImageOff" size={28} />
                    </span>
                  )}
                  <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {p.in_main && <span className="rounded-full bg-white/90 px-2 py-0.5 text-[0.7em] font-medium backdrop-blur">Основной</span>}
                    {p.in_orange && <span className="rounded-full bg-[#E05A2B] px-2 py-0.5 text-[0.7em] font-medium text-white">Orange</span>}
                  </span>
                  {!published && (
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1.5 text-center text-[0.75em] font-medium text-white">Черновик — не видна на сайте</span>
                  )}
                </button>
                <div className="flex flex-1 flex-col p-4">
                  <p className="truncate text-[0.7em] font-medium uppercase tracking-[0.14em] text-black/40">
                    {catName(p.category_id)}
                    {p.series ? ` · ${p.series}` : ""}
                  </p>
                  <button onClick={() => onEdit(p)} className="mt-1 text-left">
                    <p className="line-clamp-2 font-semibold leading-snug hover:underline">{p.name}</p>
                  </button>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[1.05em] font-medium">{p.price ? `от ${fmt(p.price)} ₽` : <span className="text-black/40">Цена не указана</span>}</p>
                    {finishes.length > 0 && (
                      <span className="flex items-center -space-x-1.5" title={`${finishes.length} отделок`}>
                        {finishes.slice(0, 5).map((f, j) => (
                          <span key={j} className="h-5 w-5 rounded-full border-2 border-white" style={swatchStyle(f)} />
                        ))}
                        {finishes.length > 5 && <span className="pl-2.5 text-[0.72em] text-black/45">+{finishes.length - 5}</span>}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-1 border-t border-black/[0.05] pt-3">
                    <button
                      onClick={() => toggle(p)}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[0.8em] font-medium ${published ? "text-emerald-700" : "text-black/50"} hover:bg-black/[0.04]`}
                      title={published ? "Скрыть с сайта" : "Показать на сайте"}
                    >
                      <span className={`relative h-[18px] w-8 rounded-full transition ${published ? "bg-emerald-500" : "bg-black/15"}`}>
                        <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${published ? "left-4" : "left-0.5"}`} />
                      </span>
                      {published ? "На сайте" : "Скрыта"}
                    </button>
                    <span className="ml-auto flex items-center">
                      <IconBtn icon="ArrowUp" title="Показывать раньше" disabled={i === 0} onClick={() => move(p.id, -1)} />
                      <IconBtn icon="ArrowDown" title="Показывать позже" disabled={i === list.length - 1} onClick={() => move(p.id, 1)} />
                      {published && p.slug && <IconBtn icon="Eye" title="Открыть на сайте" href={`/models/${p.slug}`} />}
                      <IconBtn icon="Copy" title="Создать копию" onClick={() => onDuplicate(p)} />
                      <IconBtn icon="Pencil" title="Редактировать" onClick={() => onEdit(p)} />
                      <IconBtn
                        icon="Trash2"
                        title="Удалить"
                        danger
                        onClick={() => confirm(`Удалить модель «${p.name}» без возможности восстановления?`) && run("product_delete", { id: p.id })}
                      />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const IconBtn = ({ icon, title, onClick, disabled, danger, href }: { icon: string; title: string; onClick?: () => void; disabled?: boolean; danger?: boolean; href?: string }) => {
  const cls = `grid h-8 w-8 place-items-center rounded-lg text-black/40 transition disabled:opacity-25 ${danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-black/[0.05] hover:text-black"}`;
  if (href)
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls} title={title} aria-label={title}>
        <Icon name={icon} size={15} />
      </a>
    );
  return (
    <button onClick={onClick} disabled={disabled} className={cls} title={title} aria-label={title}>
      <Icon name={icon} size={15} />
    </button>
  );
};

export default ProductsPanel;
