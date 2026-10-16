import { useEffect, useRef } from "react";
import { adminApi, type Lead, type LeadsData } from "@/lib/api";

export const playChime = () => {
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  [880, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  });
  setTimeout(() => ctx.close(), 1000);
};

const useLeadsPolling = (enabled: boolean, leads: Lead[], onLeads: (l: Lead[]) => void, soundOn: boolean) => {
  const maxId = useRef(0);
  const ready = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const top = leads.reduce((m, l) => Math.max(m, l.id), 0);
    if (!ready.current) {
      maxId.current = top;
      ready.current = true;
    }
  }, [enabled, leads]);

  useEffect(() => {
    if (!enabled) return;
    const tick = async () => {
      if (document.hidden && !soundOn) return;
      const res = await adminApi<LeadsData>("leads").catch(() => null);
      if (!res) return;
      const top = res.leads.reduce((m, l) => Math.max(m, l.id), 0);
      if (top > maxId.current) {
        maxId.current = top;
        if (soundOn) playChime();
        document.title = "● Новая заявка — Панель управления";
      }
      onLeads(res.leads);
    };
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [enabled, onLeads, soundOn]);
};

export default useLeadsPolling;
