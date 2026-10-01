import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { SITE, phoneMask, phoneValid } from "@/lib/site";

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

const LeadDialog = () => {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<LeadOptions>({ title: "", source: "" });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<LeadOptions>).detail;
      setOpts(detail);
      setDone(false);
      setTouched(false);
      setOpen(true);
    };
    window.addEventListener(LEAD_EVENT, handler);
    return () => window.removeEventListener(LEAD_EVENT, handler);
  }, []);

  const nameOk = name.trim().length >= 2;
  const phoneOk = phoneValid(phone);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!nameOk || !phoneOk) return;
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[440px] rounded-[22px] border-border p-6 sm:p-7">
        {done ? (
          <div className="flex flex-col items-center py-4 text-center animate-scale-in">
            <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Icon name="Check" size={26} />
            </span>
            <DialogTitle className="text-xl font-semibold tracking-tight">Заявка принята</DialogTitle>
            <DialogDescription className="mt-2 text-muted-foreground">
              {name.trim()}, менеджер салона перезвонит вам в течение 15 минут в рабочее время (10:00–22:00).
            </DialogDescription>
            <a
              href={SITE.max}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-outline mt-5"
            >
              <Icon name="MessageCircle" size={16} /> Не ждать — написать в MAX
            </a>
          </div>
        ) : (
          <>
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold tracking-tight">{opts.title}</DialogTitle>
              {opts.description && (
                <DialogDescription className="text-muted-foreground">{opts.description}</DialogDescription>
              )}
            </DialogHeader>
            <form onSubmit={submit} className="mt-2 flex flex-col gap-3" noValidate>
              <div>
                <Input
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl bg-secondary border-transparent focus-visible:bg-card"
                />
                {touched && !nameOk && <p className="mt-1 text-xs text-destructive">Укажите имя</p>}
              </div>
              <div>
                <Input
                  placeholder="+7 (___) ___-__-__"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(phoneMask(e.target.value))}
                  className="h-12 rounded-xl bg-secondary border-transparent focus-visible:bg-card"
                />
                {touched && !phoneOk && <p className="mt-1 text-xs text-destructive">Введите телефон полностью</p>}
              </div>
              <button type="submit" className="btn-pill btn-dark mt-1 h-12">
                {opts.button ?? "Отправить заявку"} <Icon name="ArrowRight" size={16} />
              </button>
              <p className="text-center text-xs text-muted-foreground">
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
