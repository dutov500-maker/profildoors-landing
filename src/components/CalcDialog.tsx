import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import QuizCard from "@/components/QuizCard";
import { CALC_OPEN_EVENT, QuizPreset } from "@/lib/site";
import { goal } from "@/lib/metrika";

const CalcDialog = () => {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<QuizPreset>({});

  useEffect(() => {
    const h = (e: Event) => {
      const d = (e as CustomEvent<QuizPreset>).detail;
      setPreset({ ...d });
      goal("calc_open", { type: d.type, model: d.model, page: location.pathname });
      setOpen(true);
    };
    window.addEventListener(CALC_OPEN_EVENT, h);
    return () => window.removeEventListener(CALC_OPEN_EVENT, h);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] max-w-[600px] overflow-y-auto rounded-[16px] border-none bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Расчёт стоимости проекта</DialogTitle>
        <QuizCard preset={preset} title="Расчёт проекта" />
      </DialogContent>
    </Dialog>
  );
};

export default CalcDialog;
