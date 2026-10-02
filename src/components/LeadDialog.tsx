import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { SITE, phoneMask, copyText } from "@/lib/site";
import { sendLead, pageLabel } from "@/lib/api";

export type LeadOptions = {
  title: string;
  description?: string;
  source: string;
  button?: string;
};

const LEAD_EVENT = "lead:open";

export const openLead = (opts: LeadOptions) => {
  window.dispatchEvent(new CustomEvent<LeadOptions>(LEAD_EVENT, { detail: opts }));
};

const field = "h-12 rounded-xl border-transparent bg-secondary focus-visible:bg-card";

const LeadDialog = () => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<LeadOptions>({ title: "", source: "" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    const handler = (e: Event) => {
      setOpts((e as CustomEvent<LeadOptions>).detail);
      setDone(false);
      setTouched(false);
      setError("");
      setFallback("");
      setOpen(true);
    };
    window.addEventListener(LEAD_EVENT, handler);
    return () => window.removeEventListener(LEAD_EVENT, handler);
  }, []);

  const nameOk = name.trim().length >= 2;
  const phoneOk = phone.replace(/\D/g, "").length >= 10;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (!nameOk || !phoneOk || sending) return;
    setSending(true);
    try {
      await sendLead({ name: name.trim(), phone, comment: comment.trim(), page: pageLabel(), source: opts.source });
      setName("");
      setPhone("");
      setComment("");
      setTouched(false);
      setDone(true);
    } catch {
      setFallback(
        `Здравствуйте! Заявка на вызов замерщика.\nИмя: ${name.trim()}\nТелефон: ${phone}\nАдрес / комментарий: ${comment.trim() || "—"}\nСтраница: ${pageLabel()}`,
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[460px] rounded-[16px] border-border p-6 sm:p-8">
        {fallback ? (
          <div className="flex flex-col py-2 text-center animate-scale-in">
            <DialogTitle className="text-[1.4em] font-medium tracking-[-0.03em]">Отправьте заявку в MAX</DialogTitle>
            <DialogDescription className="mt-3 font-light leading-relaxed text-muted-foreground">
              Сейчас форма временно не отправляется. Мы уже подготовили текст вашей заявки — нажмите кнопку, вставьте его в чат и отправьте менеджеру.
            </DialogDescription>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-secondary p-3 text-left font-sans text-[0.82em] leading-relaxed">{fallback}</pre>
            <a
              href={SITE.max}
              target="_blank"
              rel="noreferrer"
              onClick={() => copyText(fallback)}
              className="btn-pill btn-dark mt-5 w-full"
            >
              <Icon name="MessageCircle" size={16} strokeWidth={1.6} /> Скопировать и открыть MAX
            </a>
            <a href={SITE.phoneHref} className="btn-pill btn-outline mt-2.5 w-full">
              <Icon name="Phone" size={15} strokeWidth={1.6} /> Позвонить {SITE.phone}
            </a>
            <button onClick={() => setFallback("")} className="mt-3 text-[0.84em] text-muted-foreground hover:text-foreground">
              Попробовать отправить ещё раз
            </button>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center py-2 text-center animate-scale-in">
            <span className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <Icon name="Check" size={26} strokeWidth={2} />
            </span>
            <DialogTitle className="text-[1.5em] font-medium tracking-[-0.03em]">✅ Спасибо! Заявка принята.</DialogTitle>
            <DialogDescription className="mt-3 font-light leading-relaxed text-muted-foreground">
              Мы перезвоним вам в течение 10–15 минут для согласования удобного времени замера.
            </DialogDescription>
            <p className="mt-4 text-[0.92em] leading-relaxed text-foreground">
              Если не хотите ждать звонка — напишите нашему менеджеру прямо сейчас:
            </p>
            <a href={SITE.max} target="_blank" rel="noreferrer" className="btn-pill btn-dark mt-5 w-full">
              <Icon name="MessageCircle" size={16} strokeWidth={1.6} /> Написать в мессенджер MAX
            </a>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-[1.6em] font-medium tracking-[-0.035em]">{opts.title}</DialogTitle>
              {opts.description && (
                <DialogDescription className="font-light leading-relaxed text-muted-foreground">{opts.description}</DialogDescription>
              )}
            </DialogHeader>
            <form onSubmit={submit} className="mt-3 flex flex-col gap-3" noValidate>
              <div>
                <Input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} className={field} disabled={sending} />
                {touched && !nameOk && <p className="mt-1 text-xs text-destructive">Укажите имя</p>}
              </div>
              <div>
                <Input
                  placeholder="+7 (___) ___-__-__"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(phoneMask(e.target.value))}
                  className={field}
                  disabled={sending}
                />
                {touched && !phoneOk && <p className="mt-1 text-xs text-destructive">Введите номер телефона — минимум 10 цифр</p>}
              </div>
              <textarea
                placeholder="Адрес объекта или пожелания (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                disabled={sending}
                className="w-full resize-none rounded-xl border border-transparent bg-secondary px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card"
              />
              {error && (
                <p className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-[0.85em] text-destructive">
                  <Icon name="CircleAlert" size={15} className="mt-0.5 shrink-0" />
                  <span>
                    {error}. Попробуйте ещё раз или напишите в{" "}
                    <a href={SITE.max} target="_blank" rel="noreferrer" className="underline">MAX</a>.
                  </span>
                </p>
              )}
              <button type="submit" disabled={sending} className="btn-pill btn-dark mt-1 h-12 disabled:cursor-wait disabled:opacity-80">
                {sending ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" /> Отправка...
                  </>
                ) : (
                  <>
                    {opts.button ?? "Отправить заявку"} <Icon name="ArrowRight" size={16} strokeWidth={1.8} />
                  </>
                )}
              </button>
              <p className="text-center text-xs font-light text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadDialog;
