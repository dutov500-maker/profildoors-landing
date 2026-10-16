export const YM_ID = 113657043;

type Ym = (...args: unknown[]) => void;

const ym = (...args: unknown[]) => {
  const fn = (window as unknown as { ym?: Ym }).ym;
  if (fn) fn(YM_ID, ...args);
};

export const goal = (name: string, params?: Record<string, unknown>) => ym("reachGoal", name, params);

export const hit = (url: string, referer?: string) => ym("hit", url, { title: document.title, referer });

const sent = new Set<string>();
export const goalOnce = (name: string, params?: Record<string, unknown>, key = name) => {
  if (sent.has(key)) return;
  sent.add(key);
  goal(name, params);
};

export const setUserParams = (params: Record<string, unknown>) => ym("userParams", params);

const linkGoal = (href: string): [string, Record<string, unknown>] | null => {
  if (href.startsWith("tel:")) return ["phone_click", { phone: href.slice(4) }];
  if (href.startsWith("mailto:")) return ["email_click", {}];
  if (href.includes("max.ru")) return ["max_click", {}];
  if (href.includes("vk.com")) return ["vk_click", {}];
  if (href.includes("t.me") || href.includes("telegram")) return ["telegram_click", {}];
  if (href.includes("wa.me") || href.includes("whatsapp")) return ["whatsapp_click", {}];
  if (href.includes("yandex.ru/maps") || href.includes("yandex.ru/map")) return ["route_click", {}];
  return null;
};

export const initClickGoals = () => {
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest?.("a");
    if (!a) return;
    const g = linkGoal(a.getAttribute("href") || "");
    if (!g) return;
    goal(g[0], { ...g[1], page: location.pathname });
    goal("contact_click", { type: g[0], page: location.pathname });
  };
  const onCopy = () => {
    const text = String(window.getSelection() || "");
    if (/\+?7[\s(-]*9\d{2}/.test(text) || /\d{3}[\s-]?\d{2}[\s-]?\d{2}/.test(text)) goal("phone_copy");
  };
  document.addEventListener("click", onClick, true);
  document.addEventListener("copy", onCopy);

  const marks = [25, 50, 75, 100];
  const onScroll = () => {
    const h = document.documentElement;
    const pct = ((h.scrollTop + innerHeight) / h.scrollHeight) * 100;
    marks.forEach((m) => pct >= m - 1 && goalOnce(`scroll_${m}`, { page: location.pathname }, `scroll_${m}_${location.pathname}`));
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  const timer = setTimeout(() => goalOnce("engaged_60s"), 60_000);

  return () => {
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("copy", onCopy);
    window.removeEventListener("scroll", onScroll);
    clearTimeout(timer);
  };
};