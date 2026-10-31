import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/AdminLogin";

// The login form touches sessionStorage only in useEffect/handlers, so it renders on the server.
export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLogin,
});
