import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import QuizCard from "@/components/QuizCard";
import { CALC_OPEN_EVENT, QuizPreset } from "@/lib/site";

const CalcDialog = () => {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<QuizPreset>({});

  useEffect(() => {
    const h = (e: Event) => {
      setPreset({ ...(e as CustomEvent<QuizPreset>).detail });
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
