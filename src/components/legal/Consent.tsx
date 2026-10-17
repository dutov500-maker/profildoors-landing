import { openPrivacy } from "@/lib/legal";

type Props = { button?: string; dark?: boolean; className?: string };

const Consent = ({ button = "кнопку", dark = false, className = "" }: Props) => (
  <p className={`text-[0.72rem] font-light leading-snug ${dark ? "text-white/45" : "text-muted-foreground"} ${className}`}>
    Нажимая {button}, вы соглашаетесь с{" "}
    <button
      type="button"
      onClick={openPrivacy}
      className={`underline underline-offset-2 transition-colors ${dark ? "decoration-white/30 hover:text-white" : "decoration-black/25 hover:text-foreground"}`}
    >
      Политикой конфиденциальности
    </button>{" "}
    и даёте согласие на обработку персональных данных
  </p>
);

export default Consent;
