import { useState } from "react";
import Icon from "@/components/ui/icon";
import { SITE, copyText } from "@/lib/site";

type Opt = { id: string; name: string; sub: string };

const STEPS: { q: string; opts: Opt[] }[] = [
  {
    q: "Тип покрытия",
    opts: [
      { id: "Натуральный шпон (серия VE)", name: "Шпон VE", sub: "Дуб, орех, венге" },
      { id: "Матовая эмаль (серия SE)", name: "Эмаль SE", sub: "Шёлк, кашемир, тауп" },
      { id: "Invisible под покраску", name: "Invisible", sub: "Под покраску, Reverse" },
      { id: "Царговые P.O / PD.O", name: "Царговые", sub: "P.O и PD.O" },
      { id: "Алюминий AV.O / AX.O", name: "Алюминий", sub: "AV.O и перегородки AX.O" },
      { id: "Каркасные PE.O", name: "Каркасные", sub: "PE.O, Unilack" },
    ],
  },
  {
    q: "Количество дверей",
    opts: [
      { id: "1–3 шт", name: "1–3", sub: "Одна-три комнаты" },
      { id: "4–6 шт", name: "4–6", sub: "Квартира" },
      { id: "7 и более", name: "7+", sub: "Дом, большой объект" },
    ],
  },
  {
    q: "Нужен замер?",
    opts: [
      { id: "Нужен замер и монтаж", name: "Замер и монтаж", sub: "Москва и МО" },
      { id: "Только двери", name: "Только двери", sub: "Без замера" },
    ],
  },
];

const OrangeQuiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const done = step >= STEPS.length;

  const pick = (id: string) => {
    const next = [...answers.slice(0, step), id];
    setAnswers(next);
    setTimeout(() => setStep(step + 1), 200);
  };

  const send = () => {
    copyText(
      `Здравствуйте! Хочу рассчитать комплект ProfilDoors Orange: ${answers[0]}, ${answers[1]}, ${answers[2]?.toLowerCase()}. Прошу смету и скидку салона Roomer.`,
    );
  };

  return (
    <div id="orange-calc" className="rounded-[14px] border border-white/[0.08] bg-[#121316]/90 p-5 text-white backdrop-blur-xl sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68em] font-medium uppercase tracking-[0.22em] text-[#E8A27E]">Экспресс-расчёт Orange</p>
          <h2 className="mt-2 text-[1.4em] font-medium leading-none tracking-[-0.03em]">Комплект за 3 клика</h2>
        </div>
        <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[0.78em] text-white/60">
          {done ? "Готово" : `${step + 1} / 3`}
        </span>
      </div>

      <div className="mb-6 mt-5 grid grid-cols-3 gap-1.5">
        {STEPS.map((_, i) => (
          <span key={i} className="h-[3px] overflow-hidden rounded bg-white/[0.08]">
            <span className="block h-full bg-[#E05A2B] transition-all duration-500" style={{ width: done || i <= step ? "100%" : "0%" }} />
          </span>
        ))}
      </div>

      {!done ? (
        <div key={step} className="animate-rise">
          <p className="mb-3 text-[0.92em] font-medium">{STEPS[step].q}</p>
          <div className={`grid gap-2.5 ${STEPS[step].opts.length > 3 ? "grid-cols-2" : "grid-cols-1"}`}>
            {STEPS[step].opts.map((o) => {
              const on = answers[step] === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => pick(o.id)}
                  className={`flex items-center justify-between gap-3 rounded-[10px] border px-4 py-3 text-left transition-all duration-200 active:scale-[0.99] ${
                    on ? "border-[#E05A2B] bg-[#E05A2B]/10" : "border-white/[0.08] bg-[#1A1B1F] hover:border-white/25"
                  }`}
                >
                  <span>
                    <span className="block text-[0.92em] font-medium tracking-[-0.01em]">{o.name}</span>
                    <span className="block text-[0.8em] font-light text-white/45">{o.sub}</span>
                  </span>
                  {on && <Icon name="Check" size={15} className="text-[#E05A2B]" />}
                </button>
              );
            })}
          </div>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="mt-4 inline-flex items-center gap-1.5 text-[0.84em] text-white/45 hover:text-white">
              <Icon name="ArrowLeft" size={14} /> Назад
            </button>
          )}
        </div>
      ) : (
        <div className="animate-rise">
          <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08] text-[0.88em]">
            {STEPS.map((s, i) => (
              <li key={s.q} className="flex justify-between gap-4 py-2.5">
                <span className="font-light text-white/45">{s.q}</span>
                <span className="text-right">{answers[i]}</span>
              </li>
            ))}
          </ul>
          <a
            href={SITE.max}
            target="_blank"
            rel="noreferrer"
            onClick={send}
            className="btn-pill mt-5 w-full bg-[#E05A2B] text-white hover:bg-[#C94E24]"
          >
            Рассчитать комплект Orange в MAX <Icon name="ArrowUpRight" size={15} strokeWidth={1.8} />
          </a>
          <p className="mt-3 text-center text-[0.76em] font-light text-white/40">
            Текст заявки скопирован — вставьте его в чат MAX
          </p>
          <button
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
            className="mt-2 w-full text-[0.82em] text-white/45 hover:text-white"
          >
            Начать заново
          </button>
        </div>
      )}
    </div>
  );
};

export default OrangeQuiz;
