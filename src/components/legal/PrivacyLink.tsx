import { openPrivacy } from "@/lib/legal";

const PrivacyLink = ({ className = "" }: { className?: string }) => (
  <button type="button" onClick={openPrivacy} className={`text-left underline-offset-4 transition-colors hover:text-white hover:underline ${className}`}>
    Политика конфиденциальности
  </button>
);

export default PrivacyLink;
