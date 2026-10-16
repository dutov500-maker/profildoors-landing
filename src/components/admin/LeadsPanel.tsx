import { useState } from "react";
import Icon from "@/components/ui/icon";
import type { Lead, LeadStatus } from "@/lib/api";

const STATUS: Record<LeadStatus, { label: string; cls: string }> = {
  new: { label: "Новая", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  in_work: { label: "В работе", cls: "bg-sky-50 text-sky-700 border-sky-200" },
  done: { label: "Обработана", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  spam: { label: "Спам / тест", cls: "bg-secondary text-muted-foreground border-[#E5E7EB]" },
};

const FILTERS: [LeadStatus | "all", string][] = [
  ["all", "Все"],
  ["new", "Новые"],
  ["in_work", "В работе"],
  ["done", "Обработанные"],
  ["spam", "Спам / тест"],
];

const dt = (s: string) =>
  new Date(s.replace(" ", "T")).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

type Props = {
  leads: Lead[];
  onUpdate: (body: { id: number; status?: LeadStatus; manager_note?: string }) => Promise<unknown>;
  onDelete: (id: number) => Promise<unknown>;
  onRefresh: () => void;
};

const LeadCard = ({ lead, onUpdate, onDelete }: { lead: Lead } & Pick<Props, "onUpdate" | "onDelete">) => {
  const [note, setNote] = useState(lead.manager_note);
  const [saving, setSaving] = useState(false);
  const tel = lead.phone.replace(/[^\d+]/g, "");

  const saveNote = async () => {
    if (note === lead.manager_note) return;
    setSaving(true);
    await onUpdate({ id: lead.id, manager_note: note }).finally(() => setSaving(false));
  };

  return (
    <li className={`rounded-[14px] border bg-card p-4 sm:p-5 ${lead.status === "new" ? "border-amber-300" : "border-[#E5E7EB]"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            №{lead.id} · {dt(lead.created_at)}
            {lead.source ? ` · ${lead.source}` : ""}
          </p>
          <p className="mt-1 text-lg font-medium">{lead.name}</p>
          <a href={`tel:${tel}`} className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-foreground hover:underline">
            <Icon name="Phone" size={14} /> {lead.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={lead.status}
            onChange={(e) => onUpdate({ id: lead.id, status: e.target.value as LeadStatus })}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium outline-none ${STATUS[lead.status].cls}`}
          >
            {(Object.keys(STATUS) as LeadStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS[s].label}
              </option>
            ))}
          </select>
          <button
            onClick={() => confirm(`Удалить заявку №${lead.id}?`) && onDelete(lead.id)}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
            aria-label="Удалить"
          >
            <Icon name="Trash2" size={16} />
          </button>
        </div>
      </div>

      {lead.comment && <p className="mt-3 whitespace-pre-line rounded-lg bg-secondary px-3 py-2 text-sm">{lead.comment}</p>}
      {lead.page && <p className="mt-2 truncate text-xs text-muted-foreground">Страница: {lead.page}</p>}

      <div className="mt-3 flex items-center gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={saveNote}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          placeholder="Заметка менеджера: перезвонить в пятницу, замер 12.11…"
          className="h-10 flex-1 rounded-lg border border-[#E5E7EB] bg-card px-3 text-sm outline-none focus:border-foreground"
        />
        {saving && <Icon name="Loader2" size={16} className="animate-spin text-muted-foreground" />}
      </div>
    </li>
  );
};

const LeadsPanel = ({ leads, onUpdate, onDelete, onRefresh }: Props) => {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const list = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const count = (f: LeadStatus | "all") => (f === "all" ? leads.length : leads.filter((l) => l.status === f).length);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(([id, l]) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                filter === id ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#E5E7EB] bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {l} ({count(id)})
            </button>
          ))}
        </div>
        <button onClick={onRefresh} className="btn-pill btn-outline px-4 py-2">
          <Icon name="RefreshCw" size={14} /> Обновить
        </button>
      </div>

      {!list.length ? (
        <p className="rounded-[14px] border border-[#E5E7EB] bg-card p-10 text-center text-muted-foreground">Заявок нет</p>
      ) : (
        <ul className="space-y-3">
          {list.map((l) => (
            <LeadCard key={`${l.id}-${l.manager_note}`} lead={l} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeadsPanel;
