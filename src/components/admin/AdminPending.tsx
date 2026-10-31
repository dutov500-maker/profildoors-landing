import Icon from "@/components/ui/icon";

/** Server/hydration placeholder for the client-only admin panel: same spinner the panel shows while loading. */
const AdminPending = () => (
  <div className="grid min-h-screen place-items-center bg-secondary">
    <p className="sr-only">Панель управления ProfilDoors — загрузка</p>
    <Icon name="Loader2" size={26} className="animate-spin text-muted-foreground" />
  </div>
);

export default AdminPending;
