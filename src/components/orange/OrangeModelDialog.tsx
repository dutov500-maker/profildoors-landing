import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";
import { SITE, copyText } from "@/lib/site";
import OrangeCarousel from "./OrangeCarousel";
import type { Model } from "./orangeData";

type Props = { model: Model | null; onClose: () => void; onZoom: (m: Model, i: number) => void };

const OrangeModelDialog = ({ model, onClose, onZoom }: Props) => {
  const [idx, setIdx] = useState(0);
  const [finish, setFinish] = useState(0);

  useEffect(() => {
    setIdx(0);
    setFinish(0);
  }, [model?.id]);

  if (!model) return null;
  const f = model.finishes[finish];

  return (
    <Dialog open={!!model} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-[1040px] gap-0 overflow-y-auto rounded-[12px] border-0 p-0 sm:rounded-[12px]">
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          <OrangeCarousel
            photos={model.photos}
            index={idx}
            onIndex={setIdx}
            onOpen={() => onZoom(model, idx)}
            alt={model.name}
            eager
            className="aspect-[4/5] md:aspect-auto md:min-h-[600px]"
          />
          <div className="flex flex-col p-6 sm:p-9">
            <span className="w-fit rounded-full bg-[#E05A2B]/10 px-3 py-1 text-[0.72em] font-medium text-[#B8522E]">{model.badge}</span>
            <DialogTitle className="mt-4 text-[1.6em] font-medium leading-tight tracking-[-0.03em]">{model.name}</DialogTitle>
            <p className="mt-1 text-muted-foreground">{model.subtitle}</p>
            <p className="mt-5 text-[1.5em] font-medium tracking-[-0.02em]">{model.price}</p>
            <DialogDescription className="mt-5 text-[0.95em] font-light leading-relaxed text-muted-foreground">
              {model.text}
            </DialogDescription>

            <div className="mt-8 border-t border-neutral-200 pt-6">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.72em] font-medium uppercase tracking-[0.18em] text-muted-foreground">{model.finishesLabel}</span>
                <span className="text-[0.9em] font-medium">{f.name}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {model.finishes.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setFinish(i)}
                    className="group/s relative"
                    aria-label={s.name}
                  >
                    <span
                      className={`block h-11 w-11 rounded-full border border-black/10 shadow-inner transition ${
                        i === finish ? "ring-2 ring-[#E05A2B] ring-offset-2" : "hover:scale-110"
                      }`}
                      style={{ background: s.color }}
                    />
                    <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#121316] px-2.5 py-1 text-[0.72em] text-white opacity-0 transition group-hover/s:opacity-100">
                      {s.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <a
                href={SITE.max}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  copyText(`Здравствуйте! Хочу рассчитать комплектацию: ${model.name} (${model.subtitle}), отделка «${f.name}».`)
                }
                className="btn-pill w-full bg-[#E05A2B] py-3.5 text-white hover:bg-[#C94E24]"
              >
                Рассчитать комплектацию в MAX <Icon name="ArrowUpRight" size={15} strokeWidth={1.8} />
              </a>
              <p className="mt-3 text-center text-[0.75em] font-light text-muted-foreground">
                Название модели и отделки скопируется — просто вставьте в чат
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrangeModelDialog;
