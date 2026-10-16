import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { adminApi, adminToken } from "@/lib/api";
import useNoIndex from "@/hooks/useNoIndex";

const AdminLogin = () => {
  useNoIndex("Вход в панель управления");
  const nav = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (adminToken.get()) nav("/admin", { replace: true });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const r = await adminApi<{ token: string }>("login", { login: login.trim(), password });
      adminToken.set(r.token);
      nav("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось войти");
    } finally {
      setPassword("");
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-secondary px-4">
      <form onSubmit={submit} className="w-full max-w-[380px] rounded-[16px] border border-[#E5E7EB] bg-card p-8" noValidate>
        <p className="text-[1.05em] font-semibold uppercase tracking-[0.16em]">ProfilDoors</p>
        <h1 className="mt-1 text-[1.4em] font-medium tracking-[-0.03em]">Панель управления</h1>
        <p className="mt-1 text-sm text-muted-foreground">Вход только для сотрудников салона</p>
        <div className="mt-6 flex flex-col gap-3">
          <Input placeholder="Логин" autoComplete="username" value={login} onChange={(e) => setLogin(e.target.value)} className="h-12 rounded-xl" />
          <Input
            placeholder="Пароль"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-xl"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={busy || !login || !password} className="btn-pill btn-graphite mt-2 w-full disabled:opacity-50">
            {busy ? <Icon name="Loader2" size={16} className="animate-spin" /> : <Icon name="Lock" size={15} />} Войти
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
