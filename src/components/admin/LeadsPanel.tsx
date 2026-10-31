import { useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import type { Lead, LeadStatus } from "@/lib/api";

const STATUS: Record<LeadStatus, { label: string; dot: string; chip: string }> = {
  new: { label: "Новая", dot: "bg-[#E05A2B]", chip: "bg-[#E05A2B]/10 text-[#B8461F]" },
  in_work: { label: "В работе", dot: "bg-sky-500", chip: "bg-sky-50 text-sky-700" },
  done: { label: "Обработана", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700" },
  spam: { label: "Спам", dot: "bg-black/25", chip: "bg-black/[0.05] text-black/50" },
};

const FILTERS: [LeadStatus | "all", string][] = [
  ["new", "Новые"],
  ["in_work", "В работе"],
  ["done", "Обработаны"],
  ["all", "Все"],
  ["spam", "Спам"],
];

const parse = (s: string) => new Date(s.replace(" ", "T"));
const dt = (s: string) => {
  const d = parse(s);
  const now = new Date();
  const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return `Сегодня, ${time}`;
  if (d.toDateString() === yest.toDateString()) return `Вчера, ${time}`;
  return d.toLocaleString("ru-RU", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
};

type Props = {
  leads: Lead[];
  onUpdate: (body: { id: number; status?: LeadStatus; manager_note?: string }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  onRefresh: () => Promise<unknown>;
};

const LeadCard = ({ lead, onUpdate, onDelete }: { lead: Lead } & Pick<Props, "onUpdate" | "onDelete">) => {
  const [note, setNote] = useState(lead.manager_note);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const tel = lead.phone.replace(/[^\d+]/g, "");
  const digits = tel.replace(/\D/g, "").replace(/^8/, "7");
  const st = STATUS[lead.status];

  const saveNote = async () => {
    if (note === lead.manager_note) return;
    setSaving(true);
    await onUpdate({ id: lead.id, manager_note: note }).finally(() => setSaving(false));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <li className={`rounded-2xl border bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-5 ${lead.status === "new" ? "border-[#E05A2B]/40" : "border-black/[0.06]"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-[0.75em] text-black/45">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-medium ${st.chip}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} /> {st.label}
            </span>
            <span>{dt(lead.created_at)}</span>
            <span>· №{lead.id}</span>
          </div>
          <p className="mt-2 text-[1.15em] font-semibold tracking-[-0.01em]">{lead.name || "Без имени"}</p>
          <p className="text-[0.95em] text-black/70">{lead.phone}</p>
          {lead.source && <p className="mt-1 text-[0.8em] text-black/45">{lead.source}</p>}
        </div>
        <div className="flex gap-2">
          <a href={`tel:${tel}`} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0F1012] px-4 text-[0.85em] font-medium text-white hover:bg-black">
            <Icon name="Phone" size={15} /> Позвонить
          </a>
          <a
            href={`https://wa.me/${digits}`}
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-black/60 hover:bg-black/[0.04] hover:text-black"
            title="Написать в WhatsApp"
            aria-label="Написать в WhatsApp"
          >
            <Icon name="MessageCircle" size={16} />
          </a>
        </div>
      </div>

      {lead.comment && <p className="mt-3 whitespace-pre-line rounded-xl bg-[#F4F3F1] px-3.5 py-2.5 text-[0.88em] leading-relaxed">{lead.comment}</p>}

      <div className="mt-3 flex items-center gap-2">
        <Icon name="StickyNote" size={15} className="shrink-0 text-black/30" />
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={saveNote}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          placeholder="Заметка: перезвонить в пятницу, замер 12.11…"
          className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3 text-[0.88em] outline-none transition focus:border-black/40"
        />
        {saving && <Icon name="Loader2" size={16} className="animate-spin text-black/40" />}
        {saved && <Icon name="Check" size={16} className="text-emerald-600" />}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-black/[0.05] pt-3">
        <span className="mr-1 text-[0.75em] text-black/40">Статус:</span>
        {(Object.keys(STATUS) as LeadStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => s !== lead.status && onUpdate({ id: lead.id, status: s })}
            className={`rounded-full px-3 py-1.5 text-[0.78em] font-medium transition ${
              s === lead.status ? `${STATUS[s].chip} ring-1 ring-inset ring-current/20` : "text-black/50 hover:bg-black/[0.04] hover:text-black"
            }`}
          >
            {STATUS[s].label}
          </button>
        ))}
        <button
          onClick={() => confirm(`Удалить заявку №${lead.id} без возможности восстановления?`) && onDelete(lead.id)}
          className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-black/35 hover:bg-red-50 hover:text-red-600"
          title="Удалить заявку"
          aria-label="Удалить заявку"
        >
          <Icon name="Trash2" size={15} />
        </button>
      </div>
      {lead.page && <p className="mt-2 truncate text-[0.72em] text-black/35">Со страницы: {lead.page}</p>}
    </li>
  );
};

const LeadsPanel = ({ leads, onUpdate, onDelete, onRefresh }: Props) => {
  const hasNew = leads.some((l) => l.status === "new");
  const [filter, setFilter] = useState<LeadStatus | "all">(hasNew ? "new" : "all");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const count = (f: LeadStatus | "all") => (f === "all" ? leads.filter((l) => l.status !== "spam").length : leads.filter((l) => l.status === f).length);
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const digits = needle.replace(/\D/g, "");
    return leads.filter((l) => {
      if (filter === "all" ? l.status === "spam" : l.status !== filter) return false;
      if (!needle) return true;
      return (
        l.name.toLowerCase().includes(needle) ||
        l.comment.toLowerCase().includes(needle) ||
        l.manager_note.toLowerCase().includes(needle) ||
        (digits.length > 2 && l.phone.replace(/\D/g, "").includes(digits))
      );
    });
  }, [leads, filter, q]);

  const today = leads.filter((l) => parse(l.created_at).toDateString() === new Date().toDateString()).length;
  const stats = [
    { label: "Новые", value: count("new"), accent: true },
    { label: "В работе", value: count("in_work") },
    { label: "Сегодня", value: today },
    { label: "Всего", value: count("all") },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.accent && s.value ? "bg-[#E05A2B] text-white" : "bg-white"}`}>
            <p className={`text-[0.78em] ${s.accent && s.value ? "text-white/80" : "text-black/45"}`}>{s.label}</p>
            <p className="mt-1 text-[1.7em] font-semibold tracking-[-0.03em]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
          {FILTERS.map(([id, l]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.85em] font-medium transition ${
                filter === id ? "bg-[#0F1012] text-white" : "bg-white text-black/55 hover:text-black"
              }`}
            >
              {l} <span className={filter === id ? "text-white/50" : "text-black/30"}>{count(id)}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative flex-1 lg:w-[280px] lg:flex-none">
            <Icon name="Search" size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Поиск: имя, телефон, текст"
              className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-[0.88em] outline-none focus:border-black/40"
            />
          </label>
          <button
            onClick={async () => {
              setBusy(true);
              await onRefresh().finally(() => setBusy(false));
            }}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-black/10 bg-white text-black/60 hover:text-black"
            title="Обновить список"
            aria-label="Обновить список"
          >
            <Icon name="RefreshCw" size={15} className={busy ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {!list.length ? (
        <div className="mt-4 rounded-2xl bg-white p-12 text-center">
          <Icon name={q ? "SearchX" : "Inbox"} size={30} className="mx-auto text-black/20" fallback="Inbox" />
          <p className="mt-3 font-medium">{q ? "Ничего не найдено" : filter === "new" ? "Новых заявок нет" : "Здесь пока пусто"}</p>
          <p className="mt-1 text-[0.85em] text-black/45">
            {filter === "new" && !q ? "Как только клиент оставит заявку на сайте, она появится здесь и прозвучит сигнал." : "Попробуйте другой фильтр."}
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((l) => (
            <LeadCard key={`${l.id}-${l.manager_note}`} lead={l} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeadsPanel;
