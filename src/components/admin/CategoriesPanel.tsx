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
  const dirty = name !== c.name || quiz !== c.quiz_type;
  return (
    <li className="flex flex-wrap items-center gap-2.5 border-b border-[#E5E7EB] py-3 last:border-0">
      <div className="flex flex-col">
        <button disabled={first} onClick={() => move(-1)} className="text-muted-foreground hover:text-foreground disabled:opacity-25" aria-label="Выше">
          <Icon name="ChevronUp" size={16} />
        </button>
        <button disabled={last} onClick={() => move(1)} className="text-muted-foreground hover:text-foreground disabled:opacity-25" aria-label="Ниже">
          <Icon name="ChevronDown" size={16} />
        </button>
      </div>
      <Input value={name} onChange={(e) => setName(e.target.value)} className="h-10 min-w-[180px] flex-1" />
      <select value={quiz} onChange={(e) => setQuiz(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm" title="Тип для калькулятора">
        {QUIZ.map((q) => (
          <option key={q.id} value={q.id}>
            Расчёт: {q.name}
          </option>
        ))}
      </select>
      <span className="w-20 text-sm text-muted-foreground">{count} мод.</span>
      <button disabled={!dirty} onClick={() => run("category_save", { id: c.id, name, quiz_type: quiz })} className="btn-pill btn-graphite px-4 py-2 disabled:opacity-30">
        Сохранить
      </button>
      <button
        onClick={() => confirm(`Удалить категорию «${c.name}»?`) && run("category_delete", { id: c.id })}
        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
        aria-label="Удалить"
      >
        <Icon name="Trash2" size={16} />
      </button>
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
    <div className="rounded-[14px] border border-[#E5E7EB] bg-card p-5 sm:p-6">
      <p className="text-sm text-muted-foreground">Порядок здесь = порядок табов на сайте. Первый таб «Все модели» добавляется автоматически. Пустые категории на сайте не показываются.</p>
      <ul className="mt-4">
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
      </ul>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (name.trim().length < 2) return;
          await run("category_save", { name: name.trim(), quiz_type: quiz });
          setName("");
        }}
        className="mt-4 flex flex-wrap gap-2.5 border-t border-[#E5E7EB] pt-4"
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Новая категория, например «Перегородки»" className="h-10 min-w-[220px] flex-1" />
        <select value={quiz} onChange={(e) => setQuiz(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
          {QUIZ.map((q) => (
            <option key={q.id} value={q.id}>
              Расчёт: {q.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-pill btn-graphite px-5 py-2">
          <Icon name="Plus" size={15} /> Добавить
        </button>
      </form>
    </div>
  );
};

export default CategoriesPanel;
