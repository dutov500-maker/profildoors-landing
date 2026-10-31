import { createFileRoute } from "@tanstack/react-router";
import Admin from "@/pages/Admin";
import AdminPending from "@/components/admin/AdminPending";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  pendingComponent: AdminPending,
  component: Admin,
});
