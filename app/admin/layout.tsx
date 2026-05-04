import { redirect } from "next/navigation";
import { getServerAuthSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { TopBar } from "@/components/layout/topbar";
import { AdminMobileMenu } from "@/components/layout/admin-mobile-menu";
import { ADMIN_ROLES, hasRole } from "@/lib/permissions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession();
  if (!session) redirect("/login?callbackUrl=/admin");
  if (!hasRole(session.user.role, ADMIN_ROLES)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar mobileMenu={<AdminMobileMenu />}>Admin Console</TopBar>
        <main className="flex-1 p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
