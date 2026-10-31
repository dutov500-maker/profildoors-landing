import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { SITE, copyText, waLink } from "@/lib/site";
import OrangeCarousel from "./OrangeCarousel";
import Consent from "@/components/legal/Consent";
import { photoFor, type Model } from "./orangeData";
import Swatches from "@/components/catalog/Swatches";
import { Link } from "@tanstack/react-router";

type Props = {
  model: Model | null;
  initialFinish?: number;
  onClose: () => void;
  onZoom: (m: Model, i: number, finish: number) => void;
};

const OrangeModelDialog = ({ model, initialFinish = 0, onClose, onZoom }: Props) => {
  const [idx, setIdx] = useState(0);
  const [finish, setFinish] = useState(0);

  useEffect(() => {
    setIdx(0);
    setFinish(initialFinish);
  }, [model?.id, initialFinish]);

  if (!model) return null;
  const f = model.finishes[finish];
  const msg = `Здравствуйте! Хочу рассчитать комплектацию: ${model.name}${model.subtitle ? ` (${model.subtitle})` : ""}${f ? `, отделка «${f.name}»` : ""}.`;

  return (
    <Dialog open={!!model} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-[1040px] gap-0 overflow-y-auto rounded-[12px] border-0 p-0 sm:rounded-[12px]">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <OrangeCarousel
            key={photoFor(model, f).src}
            photos={[photoFor(model, f)]}
            index={idx}
            onIndex={setIdx}
            onOpen={() => onZoom(model, idx, finish)}
            alt={f ? `${model.name} — ${f.name}` : model.name}
            eager
            className="aspect-[4/5] md:aspect-auto md:min-h-[600px]"
          />
          <div className="flex flex-col p-6 sm:p-9">
            {model.badge && (
              <span className="w-fit rounded-full bg-[#E05A2B]/10 px-3 py-1 text-[0.72em] font-medium text-[#B8522E]">{model.badge}</span>
            )}
            <DialogTitle className="mt-4 text-[1.6em] font-medium leading-tight tracking-[-0.03em]">{model.name}</DialogTitle>
            <p className="mt-1 text-muted-foreground">{model.subtitle}</p>
            <p className="mt-5 text-[1.5em] font-medium tracking-[-0.02em]">{model.price}</p>
            <DialogDescription className="mt-5 text-[0.95em] font-light leading-relaxed text-muted-foreground">
              {model.text}
            </DialogDescription>

            {f && (
              <div className="mt-8 border-t border-neutral-200 pt-6">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[0.72em] font-medium uppercase tracking-[0.18em] text-muted-foreground">{model.finishesLabel}</span>
                  <span className="text-[0.9em] font-medium">{f.name}</span>
                </div>
                <div className="mt-4">
                  <Swatches finishes={model.finishes} active={finish} onPick={setFinish} size="lg" />
                </div>
              </div>
            )}

            <div className="mt-auto pt-8">
              <a
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                onClick={() => copyText(msg)}
                className="btn-pill w-full bg-[#121316] py-3.5 text-white hover:bg-black"
              >
                Рассчитать в MAX <Icon name="ArrowUpRight" size={15} strokeWidth={1.8} />
              </a>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <a href={waLink(msg)} target="_blank" rel="noreferrer" className="btn-pill border border-neutral-300 py-3 text-[0.86em] hover:border-[#121316]">
                  <Icon name="MessageCircle" size={15} /> WhatsApp
                </a>
                <a href={SITE.telegram} target="_blank" rel="noreferrer" onClick={() => copyText(msg)} className="btn-pill border border-neutral-300 py-3 text-[0.86em] hover:border-[#121316]">
                  <Icon name="Send" size={15} /> Telegram
                </a>
              </div>
              <p className="mt-3 text-center text-[0.75em] font-light text-muted-foreground">
                Текст с моделью{f ? " и отделкой" : ""} скопируется — просто вставьте в чат. Или звоните: <a href={SITE.phoneHref} className="text-foreground">{SITE.phone}</a>
              </p>
              <Consent className="mt-2 text-center" />
              {model.slug && (
                <Link
                  to="/models/$slug"
                  params={{ slug: model.slug }}
                  onClick={onClose}
                  className="mt-3 flex items-center justify-center gap-1.5 text-[0.84em] font-medium underline-offset-4 hover:underline"
                >
                  Открыть страницу модели <Icon name="ArrowRight" size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrangeModelDialog;
