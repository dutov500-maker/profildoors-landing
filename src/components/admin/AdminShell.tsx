import type { ReactNode } from "react";
import Icon from "@/components/ui/icon";

export type AdminTab = "leads" | "products" | "categories";

type Props = {
  tab: AdminTab;
  onTab: (t: AdminTab) => void;
  login: string;
  newLeads: number;
  productsCount: number;
  categoriesCount: number;
  sound: boolean;
  onSound: () => void;
  onLogout: () => void;
  children: ReactNode;
};

const NAV: { id: AdminTab; label: string; icon: string; hint: string }[] = [
  { id: "leads", label: "Заявки", icon: "Inbox", hint: "Обращения клиентов с сайта" },
  { id: "products", label: "Модели", icon: "DoorOpen", hint: "Каталог дверей, цены, отделки" },
  { id: "categories", label: "Категории", icon: "LayoutList", hint: "Вкладки каталога на сайте" },
];

const AdminShell = ({ tab, onTab, login, newLeads, productsCount, categoriesCount, sound, onSound, onLogout, children }: Props) => {
  const count = (id: AdminTab) => (id === "leads" ? newLeads : id === "products" ? productsCount : categoriesCount);

  return (
    <div className="min-h-screen bg-[#F4F3F1] text-[#16171A]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col border-r border-black/[0.06] bg-[#0F1012] text-white lg:flex">
        <div className="px-6 pb-6 pt-7">
          <p className="text-[0.95em] font-semibold uppercase tracking-[0.18em]">ProfilDoors</p>
          <p className="mt-1 text-[0.75em] text-white/45">Панель управления салона</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((n) => {
            const active = tab === n.id;
            const c = count(n.id);
            return (
              <button
                key={n.id}
                onClick={() => onTab(n.id)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active ? "bg-white text-[#0F1012]" : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                <Icon name={n.icon} size={18} strokeWidth={1.7} fallback="Circle" />
                <span className="flex-1">
                  <span className="block text-[0.92em] font-medium">{n.label}</span>
                  <span className={`block text-[0.7em] ${active ? "text-black/45" : "text-white/35"}`}>{n.hint}</span>
                </span>
                {n.id === "leads" && c > 0 ? (
                  <span className="min-w-[22px] rounded-full bg-[#E05A2B] px-1.5 py-0.5 text-center text-[0.72em] font-semibold text-white">{c}</span>
                ) : (
                  <span className={`text-[0.75em] ${active ? "text-black/40" : "text-white/30"}`}>{c}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-1 border-t border-white/[0.08] p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.88em] text-white/70 hover:bg-white/[0.06] hover:text-white">
            <Icon name="ExternalLink" size={16} /> Открыть сайт
          </a>
          <button onClick={onSound} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[0.88em] text-white/70 hover:bg-white/[0.06] hover:text-white">
            <Icon name={sound ? "Bell" : "BellOff"} size={16} />
            <span className="flex-1">Звук новых заявок</span>
            <span className={`relative h-5 w-9 rounded-full transition ${sound ? "bg-emerald-500" : "bg-white/20"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${sound ? "left-[18px]" : "left-0.5"}`} />
            </span>
          </button>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-[0.8em] font-semibold uppercase">{login.slice(0, 1) || "A"}</span>
            <span className="min-w-0 flex-1 truncate text-[0.85em] text-white/70">{login}</span>
            <button onClick={onLogout} className="grid h-8 w-8 place-items-center rounded-lg text-white/50 hover:bg-white/[0.08] hover:text-white" title="Выйти" aria-label="Выйти">
              <Icon name="LogOut" size={16} />
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-black/[0.06] bg-[#0F1012] px-4 text-white lg:hidden">
        <p className="text-[0.9em] font-semibold uppercase tracking-[0.16em]">ProfilDoors</p>
        <div className="flex items-center gap-1">
          <a href="/" target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg text-white/70" aria-label="Открыть сайт">
            <Icon name="ExternalLink" size={17} />
          </a>
          <button onClick={onSound} className="grid h-9 w-9 place-items-center rounded-lg text-white/70" aria-label="Звук уведомлений">
            <Icon name={sound ? "Bell" : "BellOff"} size={17} />
          </button>
          <button onClick={onLogout} className="grid h-9 w-9 place-items-center rounded-lg text-white/70" aria-label="Выйти">
            <Icon name="LogOut" size={17} />
          </button>
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:ml-[248px] lg:px-10 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-[1180px]">{children}</div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-black/[0.06] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV.map((n) => {
          const active = tab === n.id;
          const c = count(n.id);
          return (
            <button key={n.id} onClick={() => onTab(n.id)} className={`relative flex flex-col items-center gap-1 py-2.5 text-[0.7em] font-medium ${active ? "text-[#0F1012]" : "text-black/40"}`}>
              <Icon name={n.icon} size={20} strokeWidth={active ? 2 : 1.6} fallback="Circle" />
              {n.label}
              {n.id === "leads" && c > 0 && (
                <span className="absolute left-1/2 top-1.5 ml-2 min-w-[18px] rounded-full bg-[#E05A2B] px-1 text-center text-[0.9em] font-semibold leading-[18px] text-white">{c}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export const PageHead = ({ title, text, action }: { title: string; text: string; action?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 className="text-[1.6em] font-semibold tracking-[-0.03em] sm:text-[1.9em]">{title}</h1>
      <p className="mt-1 max-w-[46em] text-[0.9em] text-black/50">{text}</p>
    </div>
    {action}
  </div>
);

export default AdminShell;
