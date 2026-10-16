import { useEffect } from "react";

const useNoIndex = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} — ProfilDoors`;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, [title]);
};

export default useNoIndex;
