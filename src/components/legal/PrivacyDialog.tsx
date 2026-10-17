import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PRIVACY_OPEN_EVENT } from "@/lib/legal";
import PrivacyText from "./PrivacyText";

const PrivacyDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener(PRIVACY_OPEN_EVENT, h);
    return () => window.removeEventListener(PRIVACY_OPEN_EVENT, h);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="z-[120] flex max-h-[90vh] max-w-[760px] flex-col gap-0 overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0F1012] p-0 text-white sm:rounded-[14px] [&>button]:text-white/70 [&>button]:hover:text-white">
        <DialogTitle className="sr-only">Политика конфиденциальности</DialogTitle>
        <DialogDescription className="sr-only">Политика в отношении обработки персональных данных</DialogDescription>
        <div className="overflow-y-auto px-6 pb-6 pt-10 sm:px-10 sm:pb-8">
          <PrivacyText />
        </div>
        <div className="flex shrink-0 justify-end border-t border-white/[0.08] px-6 py-4 sm:px-10">
          <button onClick={() => setOpen(false)} className="btn-pill btn-light px-5 py-2.5">
            Вернуться на сайт
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyDialog;
