const mods = import.meta.glob<{ default: Record<string, string> }>("../../backend/func2url.json", { eager: true });
const urls: Record<string, string> = Object.values(mods)[0]?.default ?? {};

export type LeadPayload = { name: string; phone: string; comment: string; page: string; source: string };

export const sendLead = async (data: LeadPayload) => {
  const url = urls.lead;
  if (!url) throw new Error("Сервис заявок ещё не подключён");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (res.status !== 200 || !json.ok) throw new Error(json.error || "Не удалось отправить заявку");
  return json;
};

export const pageLabel = () => {
  const p = window.location.pathname;
  const name = p.startsWith("/orange") ? "/orange (Коллекция Orange)" : "Главная";
  return `${name} — ${window.location.origin}${p}`;
};
