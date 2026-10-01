import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";
import DoorGlyph from "@/components/DoorGlyph";
import { QUIZ_PRESET_EVENT, QuizPreset, SITE, openMax, phoneMask, phoneValid } from "@/lib/site";

type Opt = { id: string; name: string; sub: string; glyph?: "classic" | "invisible" | "glass" | "entry"; icon?: string; price?: number; mult?: number };

const TYPES: Opt[] = [
  { id: "invisible", name: "Скрытые Invisible", sub: "Под покраску, Reverse", glyph: "invisible", price: 24900 },
  { id: "interior", name: "Межкомнатные", sub: "Orange и эмаль", glyph: "classic", price: 23400 },
  { id: "glass", name: "Перегородки", sub: "Алюминий AG, стекло", glyph: "glass", price: 68000 },
  { id: "entry", name: "Входные", sub: "Master Security", glyph: "entry", price: 62500 },
];

const QTY: Opt[] = [
  { id: "1-3", name: "1–3 шт", sub: "Одна-три комнаты", icon: "Square", mult: 2 },
  { id: "4-6", name: "4–6 шт", sub: "Квартира", icon: "Columns2", mult: 5 },
  { id: "7+", name: "Более 7 шт", sub: "Большая квартира, дом", icon: "Grid2x2", mult: 8, },
];

const INSTALL: Opt[] = [
  { id: "turnkey", name: "Да, нужен замер и монтаж", sub: "Москва и Московская область", icon: "Wrench", mult: 1.22 },
  { id: "only", name: "Только двери", sub: "Полотна, короба и наличники", icon: "Package", mult: 1 },
];

const LABELS = ["Какие двери нужны?", "Сколько дверей?", "Нужен ли замер и монтаж в Москве/МО?", "Получите расчёт стоимости и зафиксируйте скидку салона"];
const NOTES = ["Дальше: количество, монтаж, контакт", "Дальше: монтаж и контакт", "Остался последний шаг", "Ответим в MAX в течение 10 минут"];

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n / 1000) * 1000);

const QuizCard = ({ glass = false }: { glass?: boolean }) => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<string>("invisible");
  const [model, setModel] = useState<string | null>(null);
  const [qty, setQty] = useState<string | null>(null);
  const [install, setInstall] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<QuizPreset>).detail;
      if (TYPES.some((t) => t.id === d.type)) {
        setType(d.type);
        setModel(d.model ?? null);
        setDone(false);
        setStep(1);
      }
    };
    window.addEventListener(QUIZ_PRESET_EVENT, handler);
    return () => window.removeEventListener(QUIZ_PRESET_EVENT, handler);
  }, []);

  const estimate = useMemo(() => {
    const t = TYPES.find((x) => x.id === type)?.price ?? 0;
    const q = QTY.find((x) => x.id === qty)?.mult ?? 1;
    const i = INSTALL.find((x) => x.id === install)?.mult ?? 1;
    return t * q * i;
  }, [type, qty, install]);

  const canNext = step === 0 ? !!type : step === 1 ? !!qty : step === 2 ? !!install : true;
  const nameOk = name.trim().length >= 2;
  const phoneOk = phoneValid(phone);

  const message = () => {
    const t = model ?? TYPES.find((x) => x.id === type)?.name;
    const q = QTY.find((x) => x.id === qty)?.name;
    const i = INSTALL.find((x) => x.id === install)?.name;
    return `Здравствуйте! Собрал расчёт на сайте ProfilDoors Roomer: ${t}, количество: ${q}, ${i?.toLowerCase()}. Меня зовут ${name.trim()}, телефон ${phone}. Хочу зафиксировать скидку салона и получить точную смету.`;
  };

  const next = () => {
    if (step < 3) {
      if (canNext) setStep(step + 1);
      return;
    }
    setTouched(true);
    if (!nameOk || !phoneOk) return;
    openMax(message());
    setDone(true);
  };

  const choose = (setter: (v: string) => void, v: string) => {
    setter(v);
    setTimeout(() => setStep((s) => Math.min(s + 1, 3)), 220);
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setModel(null);
    setQty(null);
    setInstall(null);
    setTouched(false);
  };

  const tileOff = glass
    ? "border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/25"
    : "border-transparent bg-secondary hover:bg-secondary/60 hover:border-border";
  const tileOn = glass ? "border-white/70 bg-white/[0.16]" : "border-primary bg-card shadow-soft";
  const muted = glass ? "text-white/60" : "text-muted-foreground";
  const chip = glass ? "bg-white/10" : "bg-secondary";
  const field = glass
    ? "border-white/15 bg-white/[0.08] text-white placeholder:text-white/45 focus:border-white/60 focus:bg-white/[0.12]"
    : "border-transparent bg-secondary focus:border-primary focus:bg-card";

  const optionTile = (o: Opt, on: boolean, onClick: () => void) => (
    <button
      key={o.id}
      type="button"
      onClick={onClick}
      className={`relative grid grid-cols-[44px_1fr] grid-rows-[auto_auto] content-center items-center gap-x-3.5 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-all duration-200 animate-rise ${
        on ? tileOn : tileOff
      }`}
    >
      <span className="row-span-2 grid place-items-center">
        {o.glyph ? (
          <span className={glass ? "rounded-lg bg-white/90 p-1" : ""}>
            <DoorGlyph kind={o.glyph} />
          </span>
        ) : (
          <span className={`grid h-11 w-11 place-items-center rounded-xl ${glass ? "bg-white/10 text-gold" : "bg-card text-foreground shadow-soft"}`}>
            <Icon name={o.icon ?? "Circle"} size={20} />
          </span>
        )}
      </span>
      <span className="self-end text-[0.95em] font-semibold leading-tight">{o.name}</span>
      <span className={`mt-0.5 self-start text-[0.84em] leading-snug ${muted}`}>{o.sub}</span>
      {on && (
        <span className={`absolute right-2.5 top-2.5 grid h-5 w-5 place-items-center rounded-full animate-scale-in ${glass ? "bg-gold text-graphite" : "bg-primary text-primary-foreground"}`}>
          <Icon name="Check" size={11} strokeWidth={3.4} />
        </span>
      )}
    </button>
  );

  return (
    <section
      id="calc"
      aria-label="Расчёт стоимости"
      className={`flex min-h-[460px] flex-col rounded-[16px] p-5 sm:p-[26px] ${glass ? "glass-card" : "border border-border bg-card shadow-lift"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-[0.7em] font-medium uppercase tracking-[0.18em] ${glass ? "text-gold" : "text-muted-foreground"}`}>Калькулятор салона</p>
          <h2 className="mt-1 font-serif text-[1.75em] font-medium leading-none">Расчёт за 3 клика</h2>
          <p className={`mt-2 max-w-[26em] text-[0.88em] leading-[1.45] ${muted}`}>
            И подарок к заказу: магнитные замки или скрытые петли.
          </p>
        </div>
        <span className={`whitespace-nowrap rounded-full px-[11px] py-1 text-[0.82em] font-medium ${chip}`}>
          {done ? "Готово" : `${step + 1} / 4`}
        </span>
      </div>

      <div className="mb-[22px] mt-5 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-[3px] overflow-hidden rounded ${glass ? "bg-white/15" : "bg-secondary"}`}>
            <span
              className={`block h-full rounded transition-all duration-500 ${glass ? "bg-gold" : "bg-primary"}`}
              style={{ width: done || i <= step ? "100%" : "0%" }}
            />
          </span>
        ))}
      </div>

      {done ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in">
          <span className={`mb-4 grid h-14 w-14 place-items-center rounded-full ${glass ? "bg-gold text-graphite" : "bg-primary text-primary-foreground"}`}>
            <Icon name="Check" size={26} />
          </span>
          <p className="font-display text-2xl font-semibold tracking-tight">Расчёт собран</p>
          <p className={`mt-2 max-w-[25em] ${muted}`}>
            Мы скопировали текст заявки — вставьте его в чат MAX и отправьте. Менеджер пришлёт смету со скидкой салона в течение 10 минут.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <button onClick={() => openMax(message())} className="btn-pill bg-messenger text-white hover:opacity-90">
              <Icon name="MessageCircle" size={16} /> Открыть MAX
            </button>
            <a href={SITE.phoneHref} className={`btn-pill ${glass ? "btn-ghost-light" : "btn-outline"}`}>
              <Icon name="Phone" size={16} /> Позвонить
            </a>
            <button onClick={reset} className={`btn-pill ${glass ? "btn-ghost-light" : "btn-outline"}`}>
              Новый расчёт
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-[0.95em] font-medium">{LABELS[step]}</p>
          {model && step > 0 && (
            <p className={`-mt-1 mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[0.8em] font-medium ${chip}`}>
              <Icon name="Tag" size={12} className="text-gold" /> {model}
            </p>
          )}

          <div key={step} className="flex-1">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {TYPES.map((o) =>
                  optionTile(o, type === o.id, () => {
                    setModel(null);
                    choose(setType, o.id);
                  }),
                )}
              </div>
            )}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-3">
                {QTY.map((o) => optionTile(o, qty === o.id, () => choose(setQty, o.id)))}
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 gap-3">
                {INSTALL.map((o) => optionTile(o, install === o.id, () => choose(setInstall, o.id)))}
              </div>
            )}
            {step === 3 && (
              <div className="flex flex-col gap-3 animate-rise">
                <div className={`flex items-center justify-between rounded-xl px-4 py-3 ${chip}`}>
                  <span className={`text-[0.84em] ${muted}`}>Ориентировочно</span>
                  <span className={`font-display text-lg font-semibold tracking-tight ${glass ? "text-gold" : ""}`}>от {fmt(estimate)} ₽</span>
                </div>
                <div className="grid gap-3 min-[420px]:grid-cols-2">
                  <div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ваше имя"
                      className={`h-12 w-full rounded-xl border px-4 outline-none transition ${field}`}
                    />
                    {touched && !nameOk && <p className={`mt-1 text-xs ${glass ? "text-orange" : "text-destructive"}`}>Укажите имя</p>}
                  </div>
                  <div>
                    <input
                      value={phone}
                      inputMode="tel"
                      onChange={(e) => setPhone(phoneMask(e.target.value))}
                      placeholder="+7 (___) ___-__-__"
                      className={`h-12 w-full rounded-xl border px-4 outline-none transition ${field}`}
                    />
                    {touched && !phoneOk && <p className={`mt-1 text-xs ${glass ? "text-orange" : "text-destructive"}`}>Введите телефон полностью</p>}
                  </div>
                </div>
                <p className={`text-[0.8em] leading-snug ${muted}`}>
                  Откроется чат салона в MAX, а текст расчёта скопируется — останется вставить и отправить.
                </p>
              </div>
            )}
          </div>

          <div className={`mt-5 flex items-center justify-between gap-3 border-t pt-[18px] ${glass ? "border-white/10" : "border-border"}`}>
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className={`inline-flex items-center gap-1.5 text-[0.86em] ${muted} ${glass ? "hover:text-white" : "hover:text-foreground"}`}>
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
            ) : (
              <span className={`text-[0.86em] ${muted}`}>{NOTES[step]}</span>
            )}
            {step === 3 ? (
              <button onClick={next} className="btn-pill bg-messenger px-5 py-[11px] text-white hover:opacity-90">
                <Icon name="MessageCircle" size={16} /> Получить расчёт в MAX
              </button>
            ) : (
              <button
                onClick={next}
                disabled={!canNext}
                className={`btn-pill px-[34px] py-[11px] disabled:cursor-not-allowed disabled:opacity-40 ${glass ? "btn-gold" : "btn-dark"}`}
              >
                Далее
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default QuizCard;
