import { useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import PrivacyText from "@/components/legal/PrivacyText";
import useSeo from "@/hooks/useSeo";

const Privacy = () => {
  useSeo({
    title: "Политика конфиденциальности — ProfilDoors в МЦ Roomer",
    description: "Политика обработки персональных данных сайта profildoors-roomer.ru в соответствии с 152-ФЗ.",
    path: "/privacy",
  });
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <div className="min-h-screen bg-[#0F1012] text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#0F1012]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[860px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-[1.05em] font-semibold uppercase tracking-[0.16em]">
            ProfilDoors
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-[0.88em] text-white/60 hover:text-white">
            <Icon name="ArrowLeft" size={15} /> Вернуться на сайт
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[860px] px-4 py-14 sm:px-6 sm:py-20">
        <PrivacyText />
      </main>
    </div>
  );
};

export default Privacy;
