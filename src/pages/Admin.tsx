import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { AuthError, adminApi, adminToken, type CatalogData, type CatalogProduct } from "@/lib/api";
import useNoIndex from "@/hooks/useNoIndex";
import CategoriesPanel from "@/components/admin/CategoriesPanel";
import ProductForm, { type ProductDraft } from "@/components/admin/ProductForm";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

const EMPTY: ProductDraft = {
  name: "",
  series: "",
  badge: "",
  description: "",
  price: 0,
  image_url: "",
  category_id: 0,
  status: "published",
  sort_order: 0,
};

const Admin = () => {
  useNoIndex("Панель управления");
  const nav = useNavigate();
  const [data, setData] = useState<CatalogData | null>(null);
  const [login, setLogin] = useState("");
  const [tab, setTab] = useState<"products" | "categories">("products");
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [error, setError] = useState("");

  const fail = useCallback(
    (e: unknown) => {
      if (e instanceof AuthError) nav("/admin/login", { replace: true });
      else setError(e instanceof Error ? e.message : "Ошибка");
    },
    [nav],
  );

  useEffect(() => {
    if (!adminToken.get()) {
      nav("/admin/login", { replace: true });
      return;
    }
    adminApi<{ login: string }>("me")
      .then((r) => {
        setLogin(r.login);
        return adminApi("data");
      })
      .then(setData)
      .catch(fail);
  }, [nav, fail]);

  const run = async (action: string, body: unknown) => {
    setError("");
    try {
      setData(await adminApi(action, body));
    } catch (e) {
      fail(e);
      throw e;
    }
  };

  const safeRun = (action: string, body: unknown) => run(action, body).catch(() => undefined);

  const logout = async () => {
    await adminApi("logout", {}).catch(() => undefined);
    adminToken.clear();
    nav("/admin/login", { replace: true });
  };

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-secondary">
        {error ? <p className="text-destructive">{error}</p> : <Icon name="Loader2" size={26} className="animate-spin text-muted-foreground" />}
      </div>
    );
  }

  const catName = (id: number) => data.categories.find((c) => c.id === id)?.name ?? "—";
  const products = data.products as CatalogProduct[];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-card">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="leading-tight">
            <p className="text-[0.95em] font-semibold uppercase tracking-[0.16em]">ProfilDoors</p>
            <p className="text-[0.72em] text-muted-foreground">Панель управления каталогом</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/#catalog" target="_blank" className="hidden items-center gap-1.5 text-muted-foreground hover:text-foreground sm:inline-flex">
              <Icon name="ExternalLink" size={14} /> Открыть сайт
            </Link>
            <span className="hidden text-muted-foreground sm:inline">{login}</span>
            <button onClick={logout} className="btn-pill btn-outline px-4 py-2">
              <Icon name="LogOut" size={14} /> Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-[#E5E7EB] bg-card p-1">
            {(
              [
                ["products", `Модели (${products.length})`],
                ["categories", `Категории каталога (${data.categories.length})`],
              ] as const
            ).map(([id, l]) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setEditing(null);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === id ? "bg-[#1A1A1A] text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {l}
              </button>
            ))}
          </div>
          {tab === "products" && !editing && (
            <button
              onClick={() =>
                setEditing({ ...EMPTY, category_id: data.categories[0]?.id ?? 0, sort_order: (products.at(-1)?.sort_order ?? 0) + 10 })
              }
              className="btn-pill btn-graphite"
            >
              <Icon name="Plus" size={15} /> Добавить модель
            </button>
          )}
        </div>

        {error && <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}

        <div className="mt-6">
          {tab === "categories" && <CategoriesPanel categories={data.categories} products={products} run={safeRun} />}

          {tab === "products" && editing && (
            <div className="rounded-[14px] border border-[#E5E7EB] bg-card p-5 sm:p-6">
              <h2 className="mb-5 text-lg font-medium">{editing.id ? "Редактирование модели" : "Новая модель"}</h2>
              <ProductForm
                key={editing.id ?? "new"}
                initial={editing}
                categories={data.categories}
                onCancel={() => setEditing(null)}
                onSave={async (p) => {
                  await run("product_save", p);
                  setEditing(null);
                }}
              />
            </div>
          )}

          {tab === "products" && !editing && (
            <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-card">
              {!products.length && <p className="p-10 text-center text-muted-foreground">Пока нет моделей. Нажмите «Добавить модель».</p>}
              <ul>
                {products.map((p, i) => (
                  <li key={p.id} className="flex items-center gap-4 border-b border-[#E5E7EB] p-3 last:border-0 sm:p-4">
                    <div className="flex flex-col">
                      <button
                        disabled={i === 0}
                        onClick={() => {
                          const ids = products.map((x) => x.id);
                          [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
                          safeRun("product_reorder", { ids });
                        }}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                        aria-label="Выше"
                      >
                        <Icon name="ChevronUp" size={16} />
                      </button>
                      <button
                        disabled={i === products.length - 1}
                        onClick={() => {
                          const ids = products.map((x) => x.id);
                          [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]];
                          safeRun("product_reorder", { ids });
                        }}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-25"
                        aria-label="Ниже"
                      >
                        <Icon name="ChevronDown" size={16} />
                      </button>
                    </div>
                    <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                      {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.7em] font-medium uppercase tracking-[0.16em] text-muted-foreground">{p.series || "—"}</p>
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {catName(p.category_id)} · {fmt(p.price)} ₽{p.badge ? ` · ${p.badge}` : ""}
                      </p>
                    </div>
                    <span
                      className={`hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline ${
                        p.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                    <button onClick={() => setEditing({ ...p })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary" aria-label="Редактировать">
                      <Icon name="Pencil" size={16} />
                    </button>
                    <button
                      onClick={() => confirm(`Удалить «${p.name}»?`) && safeRun("product_delete", { id: p.id })}
                      className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                      aria-label="Удалить"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
