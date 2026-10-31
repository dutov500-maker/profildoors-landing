import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import { AuthError, NetworkError, adminApi, adminToken, type CatalogData, type CatalogProduct, type Lead, type LeadsData } from "@/lib/api";
import useNoIndex from "@/hooks/useNoIndex";
import useLeadsPolling, { playChime } from "@/hooks/useLeadsPolling";
import AdminShell, { PageHead, type AdminTab } from "@/components/admin/AdminShell";
import LeadsPanel from "@/components/admin/LeadsPanel";
import ProductsPanel from "@/components/admin/ProductsPanel";
import CategoriesPanel from "@/components/admin/CategoriesPanel";
import ProductForm, { type ProductDraft } from "@/components/admin/ProductForm";

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
  in_main: true,
  in_orange: false,
  finishes: [],
  finishes_label: "Отделки",
  slug: "",
};

const SAVED: Record<string, string> = {
  product_save: "Модель сохранена",
  product_delete: "Модель удалена",
  product_reorder: "Порядок обновлён",
  category_save: "Категория сохранена",
  category_delete: "Категория удалена",
  category_reorder: "Порядок вкладок обновлён",
  lead_update: "Заявка обновлена",
  lead_delete: "Заявка удалена",
};

const Admin = () => {
  useNoIndex("Панель управления");
  const navigate = useNavigate();
  const nav = useCallback((to: "/admin/login") => navigate({ to, replace: true }), [navigate]);
  const [data, setData] = useState<CatalogData | null>(null);
  const [login, setLogin] = useState("");
  const [tab, setTab] = useState<AdminTab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [editing, setEditing] = useState<ProductDraft | null>(null);
  const [bootError, setBootError] = useState("");
  const [sound, setSound] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setSound(localStorage.getItem("pd_admin_sound") !== "off");
  }, []);

  useLeadsPolling(!!data, leads, setLeads, sound);

  useEffect(() => {
    const reset = () => (document.title = "Панель управления — ProfilDoors");
    window.addEventListener("focus", reset);
    return () => window.removeEventListener("focus", reset);
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    localStorage.setItem("pd_admin_sound", next ? "on" : "off");
    if (next) playChime();
    toast(next ? "Звук новых заявок включён" : "Звук новых заявок выключен");
  };

  const fail = useCallback(
    (e: unknown) => {
      if (e instanceof AuthError) {
        toast.error("Сессия истекла — войдите снова");
        nav("/admin/login");
        return;
      }
      const msg = e instanceof Error ? e.message : "Что-то пошло не так";
      toast.error(e instanceof NetworkError ? "Нет связи с сервером" : "Не получилось", { description: msg });
    },
    [nav],
  );

  useEffect(() => {
    if (!adminToken.get()) {
      nav("/admin/login");
      return;
    }
    setBootError("");
    adminApi<{ login: string }>("me")
      .then((r) => {
        setLogin(r.login);
        return Promise.all([adminApi("data"), adminApi<LeadsData>("leads")]);
      })
      .then(([d, l]) => {
        setData(d);
        setLeads(l.leads);
      })
      .catch((e) => {
        if (e instanceof AuthError) nav("/admin/login");
        else setBootError(e instanceof Error ? e.message : "Не удалось загрузить данные");
      });
  }, [nav, attempt]);

  const leadsRun = async (action: string, body?: unknown) => {
    try {
      setLeads((await adminApi<LeadsData>(action, body)).leads);
      if (SAVED[action]) toast.success(SAVED[action]);
    } catch (e) {
      fail(e);
    }
  };

  const run = async (action: string, body: unknown) => {
    try {
      setData(await adminApi(action, body));
      if (SAVED[action]) toast.success(SAVED[action]);
    } catch (e) {
      fail(e);
      throw e;
    }
  };
  const safeRun = (action: string, body: unknown) => run(action, body).catch(() => undefined);

  const logout = async () => {
    await adminApi("logout", {}).catch(() => undefined);
    adminToken.clear();
    nav("/admin/login");
  };

  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F4F3F1] px-4">
        {bootError ? (
          <div className="max-w-[380px] rounded-2xl bg-white p-8 text-center shadow-sm">
            <Icon name="WifiOff" size={30} className="mx-auto text-black/25" />
            <p className="mt-4 font-semibold">Не удалось загрузить панель</p>
            <p className="mt-1 text-[0.88em] text-black/50">{bootError}</p>
            <button onClick={() => setAttempt((a) => a + 1)} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F1012] px-6 text-[0.9em] font-medium text-white">
              <Icon name="RefreshCw" size={15} /> Повторить
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-black/45">
            <Icon name="Loader2" size={26} className="animate-spin" />
            <span className="text-[0.85em]">Загружаем панель…</span>
          </div>
        )}
      </div>
    );
  }

  const allProducts = data.products as CatalogProduct[];
  const newLeads = leads.filter((l) => l.status === "new").length;
  const nextOrder = (allProducts.at(-1)?.sort_order ?? 0) + 10;

  const openNew = () => setEditing({ ...EMPTY, category_id: data.categories[0]?.id ?? 0, sort_order: nextOrder });
  const duplicate = (p: CatalogProduct) => {
    const { id: _id, ...rest } = p;
    void _id;
    setEditing({ ...rest, name: `${p.name} (копия)`, slug: "", status: "draft", sort_order: nextOrder });
    toast("Копия открыта — проверьте название и сохраните", { description: "Копия сохранится как черновик" });
  };

  return (
    <AdminShell
      tab={tab}
      onTab={(t) => {
        if (editing && !confirm("Выйти из редактирования? Несохранённые изменения пропадут.")) return;
        setTab(t);
        setEditing(null);
        window.scrollTo(0, 0);
      }}
      login={login}
      newLeads={newLeads}
      productsCount={allProducts.length}
      categoriesCount={data.categories.length}
      sound={sound}
      onSound={toggleSound}
      onLogout={logout}
    >
      {tab === "leads" && (
        <>
          <PageHead title="Заявки" text="Все обращения с сайта. Новые подсвечены оранжевым — позвоните клиенту и переведите заявку «В работу». Список обновляется сам раз в минуту." />
          <LeadsPanel
            leads={leads}
            onUpdate={(b) => leadsRun("lead_update", b)}
            onDelete={(id) => leadsRun("lead_delete", { id })}
            onRefresh={() => leadsRun("leads")}
          />
        </>
      )}

      {tab === "products" && editing && (
        <ProductForm
          key={editing.id ?? `new-${editing.name}`}
          initial={editing}
          categories={data.categories}
          onCancel={() => setEditing(null)}
          onSave={async (p) => {
            await run("product_save", p);
            setEditing(null);
            window.scrollTo(0, 0);
          }}
        />
      )}

      {tab === "products" && !editing && (
        <>
          <PageHead
            title="Модели"
            text="Двери, которые видят клиенты на сайте. Переключатель «На сайте» скрывает модель без удаления, стрелки меняют порядок в каталоге."
            action={
              <button onClick={openNew} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F1012] px-5 text-[0.9em] font-medium text-white hover:bg-black">
                <Icon name="Plus" size={16} /> Добавить модель
              </button>
            }
          />
          <ProductsPanel
            products={allProducts}
            categories={data.categories}
            onEdit={(p) => {
              setEditing({ ...p });
              window.scrollTo(0, 0);
            }}
            onDuplicate={duplicate}
            run={safeRun}
          />
        </>
      )}

      {tab === "categories" && (
        <>
          <PageHead title="Категории каталога" text="Вкладки, по которым клиенты фильтруют модели на сайте." />
          <CategoriesPanel categories={data.categories} products={allProducts} run={safeRun} />
        </>
      )}
    </AdminShell>
  );
};

export default Admin;