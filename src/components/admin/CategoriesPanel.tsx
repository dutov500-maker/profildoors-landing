import { useState } from "react";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { type CatalogCategory, type CatalogProduct } from "@/lib/api";

const QUIZ = [
  { id: "invisible", name: "Скрытые Invisible" },
  { id: "interior", name: "Межкомнатные" },
  { id: "glass", name: "Алюминий и перегородки" },
  { id: "entry", name: "Входные" },
];

type Props = {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  run: (action: string, body: unknown) => Promise<void>;
};

const Row = ({ c, count, first, last, run, move }: { c: CatalogCategory; count: number; first: boolean; last: boolean; run: Props["run"]; move: (d: -1 | 1) => void }) => {
  const [name, setName] = useState(c.name);
  const [quiz, setQuiz] = useState(c.quiz_type);
  const [busy, setBusy] = useState(false);
  const dirty = name.trim() !== c.name || quiz !== c.quiz_type;

  const save = async () => {
    if (!dirty || name.trim().length < 2) return;
    setBusy(true);
    await run("category_save", { id: c.id, name: name.trim(), quiz_type: quiz }).finally(() => setBusy(false));
  };

  return (
    <li className="flex flex-wrap items-center gap-2.5 border-b border-black/[0.05] px-4 py-3.5 last:border-0 sm:flex-nowrap">
      <div className="flex shrink-0 flex-col">
        <button disabled={first} onClick={() => move(-1)} className="text-black/35 hover:text-black disabled:opacity-20" aria-label="Выше" title="Выше">
          <Icon name="ChevronUp" size={16} />
        </button>
        <button disabled={last} onClick={() => move(1)} className="text-black/35 hover:text-black disabled:opacity-20" aria-label="Ниже" title="Ниже">
          <Icon name="ChevronDown" size={16} />
        </button>
      </div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className="h-10 min-w-[160px] flex-1 font-medium"
        aria-label="Название категории"
      />
      <select value={quiz} onChange={(e) => setQuiz(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" title="Какой вариант выбрать в калькуляторе">
        {QUIZ.map((q) => (
          <option key={q.id} value={q.id}>
            Калькулятор: {q.name}
          </option>
        ))}
      </select>
      <span className={`w-[76px] shrink-0 text-center text-[0.8em] ${count ? "text-black/55" : "text-black/30"}`}>{count ? `${count} мод.` : "пусто"}</span>
      {dirty ? (
        <button onClick={save} disabled={busy} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-[#0F1012] px-4 text-[0.85em] font-medium text-white disabled:opacity-50">
          {busy ? <Icon name="Loader2" size={14} className="animate-spin" /> : <Icon name="Check" size={14} />} Сохранить
        </button>
      ) : (
        <button
          onClick={() =>
            count
              ? alert(`В категории «${c.name}» ${count} мод. Сначала перенесите их в другую категорию.`)
              : confirm(`Удалить категорию «${c.name}»?`) && run("category_delete", { id: c.id })
          }
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-black/35 hover:bg-red-50 hover:text-red-600"
          aria-label="Удалить"
          title="Удалить категорию"
        >
          <Icon name="Trash2" size={16} />
        </button>
      )}
    </li>
  );
};

const CategoriesPanel = ({ categories, products, run }: Props) => {
  const [name, setName] = useState("");
  const [quiz, setQuiz] = useState("interior");

  const move = (idx: number, d: -1 | 1) => {
    const ids = categories.map((c) => c.id);
    const j = idx + d;
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    run("category_reorder", { ids });
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-2xl bg-white p-4 text-[0.85em] text-black/55">
        <Icon name="Info" size={18} className="mt-0.5 shrink-0 text-black/35" />
        <p>
          Категории — это вкладки над каталогом на сайте (их порядок задаётся стрелками). Вкладка «Все модели» добавляется сама, пустые категории на сайте скрыты.
          «Калькулятор» — какой тип дверей заранее выбрать, когда клиент нажмёт «Рассчитать эту модель».
        </p>
      </div>

      <ul className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {categories.map((c, i) => (
          <Row
            key={`${c.id}-${c.name}-${c.quiz_type}`}
            c={c}
            count={products.filter((p) => p.category_id === c.id).length}
            first={i === 0}
            last={i === categories.length - 1}
            run={run}
            move={(d) => move(i, d)}
          />
        ))}
        {!categories.length && <li className="p-10 text-center text-black/45">Категорий пока нет</li>}
      </ul>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (name.trim().length < 2) return;
          await run("category_save", { name: name.trim(), quiz_type: quiz });
          setName("");
        }}
        className="rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      >
        <p className="mb-3 font-semibold">Новая категория</p>
        <div className="flex flex-wrap gap-2.5">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: «Перегородки»" className="h-10 min-w-[200px] flex-1" />
          <select value={quiz} onChange={(e) => setQuiz(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {QUIZ.map((q) => (
              <option key={q.id} value={q.id}>
                Калькулятор: {q.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={name.trim().length < 2} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#0F1012] px-5 text-[0.88em] font-medium text-white disabled:opacity-40">
            <Icon name="Plus" size={15} /> Добавить
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesPanel;
