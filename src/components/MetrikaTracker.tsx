import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { hit, initClickGoals } from "@/lib/metrika";

const MetrikaTracker = () => {
  const { pathname, search } = useLocation();
  const prev = useRef<string | null>(null);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    return initClickGoals();
  }, [isAdmin]);

  useEffect(() => {
    const url = location.origin + pathname + search;
    if (prev.current === null) {
      prev.current = url;
      return;
    }
    if (prev.current === url) return;
    const referer = prev.current;
    prev.current = url;
    if (isAdmin) return;
    const t = setTimeout(() => hit(url, referer), 150);
    return () => clearTimeout(t);
  }, [pathname, search, isAdmin]);

  return null;
};

export default MetrikaTracker;
