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

/** Вкладка открыта и на экране — раз в 2 минуты. */
const VISIBLE_MS = 120_000;
/** Вкладка свёрнута, звук включён — раз в 5 минут. */
const HIDDEN_MS = 300_000;
/** Никто не трогал админку 30 минут — проверки останавливаются до первого движения мыши / касания. */
const IDLE_MS = 30 * 60_000;
/** Не чаще одной проверки в 20 секунд, даже если вкладку часто переключают. */
const MIN_GAP_MS = 20_000;

const useLeadsPolling = (enabled: boolean, leads: Lead[], onLeads: (l: Lead[]) => void, soundOn: boolean) => {
  const maxId = useRef(0);
  const ready = useRef(false);
  const onLeadsRef = useRef(onLeads);
  const soundRef = useRef(soundOn);
  onLeadsRef.current = onLeads;
  soundRef.current = soundOn;

  useEffect(() => {
    if (!enabled || ready.current) return;
    maxId.current = leads.reduce((m, l) => Math.max(m, l.id), 0);
    ready.current = true;
  }, [enabled, leads]);

  useEffect(() => {
    if (!enabled) return;
    let timer = 0;
    let busy = false;
    let lastCall = Date.now();
    let lastActivity = Date.now();
    let stopped = false;

    const delay = () => (document.hidden ? HIDDEN_MS : VISIBLE_MS);
    const schedule = (ms = delay()) => {
      window.clearTimeout(timer);
      if (!stopped) timer = window.setTimeout(tick, ms);
    };

    const tick = async () => {
      if (Date.now() - lastActivity > IDLE_MS) return;
      if (document.hidden && !soundRef.current) return;
      if (busy) return schedule();
      busy = true;
      lastCall = Date.now();
      const res = await adminApi<LeadsData>("leads").catch(() => null);
      busy = false;
      if (res) {
        const top = res.leads.reduce((m, l) => Math.max(m, l.id), 0);
        if (top > maxId.current) {
          maxId.current = top;
          if (soundRef.current) playChime();
          document.title = "● Новая заявка — Панель управления";
        }
        onLeadsRef.current(res.leads);
      }
      schedule();
    };

    const wake = () => {
      const wasIdle = Date.now() - lastActivity > IDLE_MS;
      lastActivity = Date.now();
      if (wasIdle && !document.hidden && Date.now() - lastCall > MIN_GAP_MS) tick();
    };

    const onVisibility = () => {
      if (document.hidden) return schedule();
      lastActivity = Date.now();
      const since = Date.now() - lastCall;
      if (since >= VISIBLE_MS) tick();
      else schedule(Math.max(VISIBLE_MS - since, MIN_GAP_MS));
    };

    const events = ["pointerdown", "keydown", "mousemove", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, wake, { passive: true }));
    document.addEventListener("visibilitychange", onVisibility);
    schedule();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, wake));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled]);
};

export default useLeadsPolling;